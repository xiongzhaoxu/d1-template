-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    avatar TEXT,
    is_active INTEGER DEFAULT 1,
    last_login_at TEXT,
    last_login_ip TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引，提升查询性能
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

-- 插入初始管理员账号（用户名: admin, 密码: admin123）
-- MD5('admin123') = '0192023a7bbd73250516f069df18b500'
INSERT INTO users (username, email, password_hash, role)
VALUES ('admin', 'admin@example.com', '0192023a7bbd73250516f069df18b500', 'admin')
ON CONFLICT(username) DO NOTHING;

-- 插入测试账号（用户名: testuser, 密码: test123）
-- MD5('test123') = 'cc03e747a6afbbcbf8be7668acfebee5'
INSERT INTO users (username, email, password_hash, role)
VALUES ('testuser', 'test@example.com', 'cc03e747a6afbbcbf8be7668acfebee5', 'viewer')
ON CONFLICT(username) DO NOTHING;