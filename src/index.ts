import { renderLoginPage, renderDashboardPage } from "./renderHtml";

function getSessionIdFromCookie(request: Request): string | null {
	const cookie = request.headers.get("cookie") || "";
	const match = cookie.match(/session_id=([^;]+)/);
	return match ? match[1] : null;
}

function generateSessionId(): string {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

interface Session {
	userId: number;
	username: string;
	role: string;
}

async function validateSession(env: Env, sessionId: string): Promise<Session | null> {
	const result = await env.DB.prepare("SELECT user_id, username, role FROM sessions WHERE id = ? AND expires_at > datetime('now')")
		.bind(sessionId)
		.first<{ user_id: number; username: string; role: string }>();
	if (!result) return null;
	return { userId: result.user_id, username: result.username, role: result.role };
}

async function getSession(request: Request, env: Env): Promise<Session | null> {
	const sessionId = getSessionIdFromCookie(request);
	if (!sessionId) return null;
	return validateSession(env, sessionId);
}

function jsonResponse(data: unknown, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "content-type": "application/json" },
	});
}

async function handleLoginWithHash(request: Request, env: Env): Promise<Response> {
	const { username, passwordHash } = (await request.json()) as { username: string; passwordHash: string };
	if (!username || !passwordHash) {
		return jsonResponse({ error: "用户名和密码不能为空" }, 400);
	}

	const user = await env.DB.prepare("SELECT id, username, role, is_active FROM users WHERE username = ? AND password_hash = ? AND is_active = 1")
		.bind(username, passwordHash)
		.first<{ id: number; username: string; role: string; is_active: number }>();

	if (!user) {
		return jsonResponse({ error: "用户名或密码错误" }, 401);
	}

	const sessionId = generateSessionId();
	await env.DB.prepare(
		"INSERT INTO sessions (id, user_id, username, role, expires_at) VALUES (?, ?, ?, ?, datetime('now', '+24 hours'))"
	)
		.bind(sessionId, user.id, user.username, user.role)
		.run();

	const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "";
	await env.DB.prepare("UPDATE users SET last_login_at = datetime('now'), last_login_ip = ? WHERE id = ?")
		.bind(ip, user.id)
		.run();

	return new Response(JSON.stringify({ success: true, role: user.role, username: user.username }), {
		status: 200,
		headers: {
			"content-type": "application/json",
			"set-cookie": `session_id=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`,
		},
	});
}

async function handleLogout(request: Request, env: Env): Promise<Response> {
	const sessionId = getSessionIdFromCookie(request);
	if (sessionId) {
		await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
	}
	return new Response(JSON.stringify({ success: true }), {
		status: 200,
		headers: {
			"content-type": "application/json",
			"set-cookie": `session_id=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`,
		},
	});
}

async function handleGetUserData(request: Request, env: Env, session: Session): Promise<Response> {
	if (session.role === "admin") {
		const { results } = await env.DB.prepare(
			"SELECT ud.*, u.username FROM user_data ud LEFT JOIN users u ON ud.user_id = u.id ORDER BY ud.id DESC"
		).all();
		return jsonResponse({ data: results });
	} else {
		const { results } = await env.DB.prepare(
			"SELECT ud.*, u.username FROM user_data ud LEFT JOIN users u ON ud.user_id = u.id WHERE ud.user_id = ? ORDER BY ud.id DESC"
		)
			.bind(session.userId)
			.all();
		return jsonResponse({ data: results });
	}
}

async function handleCreateUserData(request: Request, env: Env, session: Session): Promise<Response> {
	const body = (await request.json()) as { code?: number; msg?: number; info?: string; data?: string; tm?: number };

	const result = await env.DB.prepare("INSERT INTO user_data (user_id, code, msg, info, data, tm) VALUES (?, ?, ?, ?, ?, ?)")
		.bind(session.userId, body.code ?? 0, body.msg ?? 0, body.info ?? "", body.data ?? "", body.tm ?? Math.floor(Date.now() / 1000))
		.run();

	return jsonResponse({ success: true, id: result.meta.last_row_id });
}

async function handleUpdateUserData(request: Request, env: Env, session: Session, id: number): Promise<Response> {
	const body = (await request.json()) as { code?: number; msg?: number; info?: string; data?: string; tm?: number };

	if (session.role !== "admin") {
		const row = await env.DB.prepare("SELECT user_id FROM user_data WHERE id = ?").bind(id).first<{ user_id: number }>();
		if (!row || row.user_id !== session.userId) {
			return jsonResponse({ error: "无权限" }, 403);
		}
	}

	await env.DB.prepare("UPDATE user_data SET code = ?, msg = ?, info = ?, data = ?, tm = ?, updated_at = datetime('now') WHERE id = ?")
		.bind(body.code ?? 0, body.msg ?? 0, body.info ?? "", body.data ?? "", body.tm ?? Math.floor(Date.now() / 1000), id)
		.run();

	return jsonResponse({ success: true });
}

async function handleDeleteUserData(request: Request, env: Env, session: Session, id: number): Promise<Response> {
	if (session.role !== "admin") {
		const row = await env.DB.prepare("SELECT user_id FROM user_data WHERE id = ?").bind(id).first<{ user_id: number }>();
		if (!row || row.user_id !== session.userId) {
			return jsonResponse({ error: "无权限" }, 403);
		}
	}

	await env.DB.prepare("DELETE FROM user_data WHERE id = ?").bind(id).run();
	return jsonResponse({ success: true });
}

async function handleApi(request: Request, env: Env, url: URL): Promise<Response> {
	const path = url.pathname;

	if (path === "/api/login" && request.method === "POST") {
		return handleLoginWithHash(request, env);
	}

	const session = await getSession(request, env);
	if (!session) {
		return jsonResponse({ error: "未登录" }, 401);
	}

	if (path === "/api/logout" && request.method === "POST") {
		return handleLogout(request, env);
	}
	if (path === "/api/me" && request.method === "GET") {
		return jsonResponse({ userId: session.userId, username: session.username, role: session.role });
	}
	if (path === "/api/user-data" && request.method === "GET") {
		return handleGetUserData(request, env, session);
	}
	if (path === "/api/user-data" && request.method === "POST") {
		return handleCreateUserData(request, env, session);
	}

	const editMatch = path.match(/^\/api\/user-data\/(\d+)$/);
	if (editMatch) {
		const id = parseInt(editMatch[1]);
		if (request.method === "PUT") {
			return handleUpdateUserData(request, env, session, id);
		}
		if (request.method === "DELETE") {
			return handleDeleteUserData(request, env, session, id);
		}
	}

	return jsonResponse({ error: "Not Found" }, 404);
}

export default {
	async fetch(request, env): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;

		if (path.startsWith("/api/")) {
			return handleApi(request, env, url);
		}

		const session = await getSession(request, env);

		if (path === "/" || path === "/login") {
			if (session) {
				return new Response(renderDashboardPage(session.username, session.role), {
					headers: { "content-type": "text/html" },
				});
			}
			return new Response(renderLoginPage(), {
				headers: { "content-type": "text/html" },
			});
		}

		if (path === "/dashboard") {
			if (!session) {
				return Response.redirect(new URL("/login", url).href, 302);
			}
			return new Response(renderDashboardPage(session.username, session.role), {
				headers: { "content-type": "text/html" },
			});
		}

		return new Response("Not Found", { status: 404 });
	},
} satisfies ExportedHandler<Env>;
