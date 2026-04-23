export function renderLoginPage(error = "") {
	return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>登录 - D1 数据管理</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .login-card {
      background: #fff;
      border-radius: 12px;
      padding: 40px;
      width: 380px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .login-card h1 {
      text-align: center;
      color: #333;
      margin-bottom: 30px;
      font-size: 24px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      margin-bottom: 6px;
      color: #555;
      font-size: 14px;
    }
    .form-group input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s;
    }
    .form-group input:focus {
      outline: none;
      border-color: #667eea;
    }
    .btn-login {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn-login:hover { opacity: 0.9; }
    .btn-login:disabled { opacity: 0.5; cursor: not-allowed; }
    .error-msg {
      color: #e74c3c;
      text-align: center;
      margin-bottom: 16px;
      font-size: 14px;
      display: ${error ? 'block' : 'none'};
    }
  </style>
</head>
<body>
  <div class="login-card">
    <h1>D1 数据管理</h1>
    <div class="error-msg" id="errorMsg">${error}</div>
    <form id="loginForm">
      <div class="form-group">
        <label>用户名</label>
        <input type="text" id="username" placeholder="请输入用户名" required autocomplete="username" />
      </div>
      <div class="form-group">
        <label>密码</label>
        <input type="password" id="password" placeholder="请输入密码" required autocomplete="current-password" />
      </div>
      <button type="submit" class="btn-login" id="btnLogin">登 录</button>
    </form>
  </div>
  <script>
    // MD5 implementation for browser
    function md5(string) {
      function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];
        a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586); c = ff(c, d, a, b, k[2], 17, 606105819); b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12, 1200080426); c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417); c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682); d = ff(d, a, b, c, k[13], 12, -40341101); c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
        a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632); c = gg(c, d, a, b, k[11], 14, 643717713); b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9, 38016083); c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438); d = gg(d, a, b, c, k[14], 9, -1019803690); c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784); c = gg(c, d, a, b, k[7], 14, 1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734);
        a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463); c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11, 1272893353); c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174); d = hh(d, a, b, c, k[0], 11, -358537222); c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835); c = hh(c, d, a, b, k[15], 16, 530742520); b = hh(b, c, d, a, k[2], 23, -995338651);
        a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10, 1126891415); c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571); d = ii(d, a, b, c, k[3], 10, -1894986606); c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359); d = ii(d, a, b, c, k[15], 10, -30611744); c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379); c = ii(c, d, a, b, k[2], 15, 718787259); b = ii(b, c, d, a, k[9], 21, -343485551);
        x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3]);
      }
      function cmn(q, a, b, x, s, t) { a = add32(add32(a, q), add32(x, t)); return add32((a << s) | (a >>> (32 - s)), b); }
      function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
      function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
      function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
      function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
      function md51(s) {
        var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
        for (i = 64; i <= s.length; i += 64) { md5cycle(state, md5blk(s.substring(i - 64, i))); }
        s = s.substring(i - 64);
        var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
        for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) { md5cycle(state, tail); for (i = 0; i < 16; i++) tail[i] = 0; }
        tail[14] = n * 8;
        md5cycle(state, tail);
        return state;
      }
      function md5blk(s) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) { md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24); }
        return md5blks;
      }
      var hex_chr = '0123456789abcdef'.split('');
      function rhex(n) { var s = '', j = 0; for (; j < 4; j++) s += hex_chr[(n >> (j * 8 + 4)) & 0x0f] + hex_chr[(n >> (j * 8)) & 0x0f]; return s; }
      function hex(x) { for (var i = 0; i < x.length; i++) x[i] = rhex(x[i]); return x.join(''); }
      function add32(a, b) { return (a + b) & 0xFFFFFFFF; }
      return hex(md51(string));
    }

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('btnLogin');
      const errEl = document.getElementById('errorMsg');
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      if (!username || !password) {
        errEl.textContent = '请输入用户名和密码';
        errEl.style.display = 'block';
        return;
      }

      btn.disabled = true;
      btn.textContent = '登录中...';
      errEl.style.display = 'none';

      try {
        const passwordHash = md5(password);
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ username, passwordHash })
        });
        const data = await res.json();
        if (res.ok) {
          window.location.href = '/';
        } else {
          errEl.textContent = data.error || '登录失败';
          errEl.style.display = 'block';
        }
      } catch (err) {
        errEl.textContent = '网络错误，请重试';
        errEl.style.display = 'block';
      } finally {
        btn.disabled = false;
        btn.textContent = '登 录';
      }
    });
  </script>
</body>
</html>`;
}

export function renderDashboardPage(username: string, role: string) {
	return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>数据管理 - D1</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f5f7fa; color: #333; }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header h1 { font-size: 18px; font-weight: 500; }
    .header-right { display: flex; align-items: center; gap: 16px; }
    .header-right span { font-size: 14px; opacity: 0.9; }
    .badge {
      background: rgba(255,255,255,0.2);
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
    }
    .btn-logout {
      background: rgba(255,255,255,0.2);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.3);
      padding: 6px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
    }
    .btn-logout:hover { background: rgba(255,255,255,0.3); }
    .container { max-width: 1200px; margin: 24px auto; padding: 0 24px; }
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .toolbar h2 { font-size: 18px; font-weight: 600; }
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      transition: opacity 0.2s;
    }
    .btn:hover { opacity: 0.85; }
    .btn-primary { background: #667eea; color: #fff; }
    .btn-danger { background: #e74c3c; color: #fff; }
    .btn-sm { padding: 4px 10px; font-size: 12px; }
    table {
      width: 100%;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border-collapse: collapse;
    }
    th, td { padding: 12px 14px; text-align: left; border-bottom: 1px solid #eee; font-size: 13px; }
    th { background: #f8f9fa; color: #666; font-weight: 600; white-space: nowrap; }
    td { word-break: break-all; }
    tr:hover td { background: #f8f9fa; }
    .actions { display: flex; gap: 6px; white-space: nowrap; }
    .empty { text-align: center; padding: 40px; color: #999; }

    /* Modal */
    .modal-overlay {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 100;
      align-items: center;
      justify-content: center;
    }
    .modal-overlay.active { display: flex; }
    .modal {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      width: 480px;
      max-width: 90vw;
      max-height: 80vh;
      overflow-y: auto;
    }
    .modal h3 { margin-bottom: 20px; font-size: 18px; }
    .modal .form-group { margin-bottom: 14px; }
    .modal label { display: block; margin-bottom: 4px; font-size: 13px; color: #666; }
    .modal input, .modal textarea {
      width: 100%;
      padding: 8px 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 13px;
    }
    .modal input:focus, .modal textarea:focus { outline: none; border-color: #667eea; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
    .btn-cancel { background: #eee; color: #333; }

    .toast {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 6px;
      color: #fff;
      font-size: 14px;
      z-index: 200;
      animation: slideIn 0.3s ease;
    }
    .toast.success { background: #27ae60; }
    .toast.error { background: #e74c3c; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  </style>
</head>
<body>
  <div class="header">
    <h1>D1 数据管理</h1>
    <div class="header-right">
      <span>${username}</span>
      <span class="badge">${role}</span>
      <button class="btn-logout" onclick="logout()">退出登录</button>
    </div>
  </div>

  <div class="container">
    <div class="toolbar">
      <h2>用户数据</h2>
      <button class="btn btn-primary" onclick="openAddModal()">+ 新增数据</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>用户</th>
          <th>code</th>
          <th>msg</th>
          <th>info</th>
          <th>data</th>
          <th>tm</th>
          <th>创建时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody id="dataBody">
        <tr><td colspan="9" class="empty">加载中...</td></tr>
      </tbody>
    </table>
  </div>

  <!-- Add/Edit Modal -->
  <div class="modal-overlay" id="editModal">
    <div class="modal">
      <h3 id="modalTitle">新增数据</h3>
      <input type="hidden" id="editId" />
      <div class="form-group">
        <label>code</label>
        <input type="number" id="editCode" value="0" />
      </div>
      <div class="form-group">
        <label>msg</label>
        <input type="number" id="editMsg" value="0" />
      </div>
      <div class="form-group">
        <label>info</label>
        <input type="text" id="editInfo" />
      </div>
      <div class="form-group">
        <label>data</label>
        <textarea id="editData" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label>tm (时间戳)</label>
        <input type="number" id="editTm" />
      </div>
      <div class="modal-actions">
        <button class="btn btn-cancel" onclick="closeModal()">取消</button>
        <button class="btn btn-primary" onclick="saveData()">保存</button>
      </div>
    </div>
  </div>

  <!-- Delete Confirm Modal -->
  <div class="modal-overlay" id="deleteModal">
    <div class="modal">
      <h3>确认删除</h3>
      <p>确定要删除这条数据吗？此操作不可撤销。</p>
      <input type="hidden" id="deleteId" />
      <div class="modal-actions">
        <button class="btn btn-cancel" onclick="closeDeleteModal()">取消</button>
        <button class="btn btn-danger" onclick="confirmDelete()">删除</button>
      </div>
    </div>
  </div>

  <script>
    const currentRole = '${role}';
    let allData = [];

    function showToast(msg, type = 'success') {
      const t = document.createElement('div');
      t.className = 'toast ' + type;
      t.textContent = msg;
      document.body.appendChild(t);
      setTimeout(() => t.remove(), 3000);
    }

    async function loadData() {
      try {
        const res = await fetch('/api/user-data');
        const json = await res.json();
        if (res.ok) {
          allData = json.data || [];
          renderTable();
        } else {
          if (res.status === 401) window.location.href = '/login';
          showToast(json.error || '加载失败', 'error');
        }
      } catch (e) {
        showToast('网络错误', 'error');
      }
    }

    function escapeHtml(str) {
      if (str === null || str === undefined) return '';
      return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function renderTable() {
      const body = document.getElementById('dataBody');
      if (allData.length === 0) {
        body.innerHTML = '<tr><td colspan="9" class="empty">暂无数据</td></tr>';
        return;
      }
      body.innerHTML = allData.map(row => \`<tr>
        <td>\${row.id}</td>
        <td>\${escapeHtml(row.username || row.user_id)}</td>
        <td>\${row.code}</td>
        <td>\${row.msg}</td>
        <td>\${escapeHtml(row.info)}</td>
        <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="\${escapeHtml(row.data)}">\${escapeHtml(row.data)}</td>
        <td>\${row.tm}</td>
        <td>\${row.created_at}</td>
        <td class="actions">
          <button class="btn btn-primary btn-sm" onclick="openEditModal(\${row.id})">编辑</button>
          <button class="btn btn-danger btn-sm" onclick="openDeleteModal(\${row.id})">删除</button>
        </td>
      </tr>\`).join('');
    }

    function openAddModal() {
      document.getElementById('modalTitle').textContent = '新增数据';
      document.getElementById('editId').value = '';
      document.getElementById('editCode').value = '0';
      document.getElementById('editMsg').value = '0';
      document.getElementById('editInfo').value = '';
      document.getElementById('editData').value = '';
      document.getElementById('editTm').value = Math.floor(Date.now() / 1000);
      document.getElementById('editModal').classList.add('active');
    }

    function openEditModal(id) {
      const row = allData.find(r => r.id === id);
      if (!row) return;
      document.getElementById('modalTitle').textContent = '编辑数据';
      document.getElementById('editId').value = row.id;
      document.getElementById('editCode').value = row.code;
      document.getElementById('editMsg').value = row.msg;
      document.getElementById('editInfo').value = row.info || '';
      document.getElementById('editData').value = row.data || '';
      document.getElementById('editTm').value = row.tm || '';
      document.getElementById('editModal').classList.add('active');
    }

    function closeModal() {
      document.getElementById('editModal').classList.remove('active');
    }

    async function saveData() {
      const id = document.getElementById('editId').value;
      const body = {
        code: parseInt(document.getElementById('editCode').value) || 0,
        msg: parseInt(document.getElementById('editMsg').value) || 0,
        info: document.getElementById('editInfo').value,
        data: document.getElementById('editData').value,
        tm: parseInt(document.getElementById('editTm').value) || Math.floor(Date.now() / 1000),
      };

      try {
        const url = id ? '/api/user-data/' + id : '/api/user-data';
        const method = id ? 'PUT' : 'POST';
        const res = await fetch(url, {
          method,
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (res.ok) {
          showToast(id ? '更新成功' : '创建成功');
          closeModal();
          loadData();
        } else {
          showToast(json.error || '操作失败', 'error');
        }
      } catch (e) {
        showToast('网络错误', 'error');
      }
    }

    function openDeleteModal(id) {
      document.getElementById('deleteId').value = id;
      document.getElementById('deleteModal').classList.add('active');
    }

    function closeDeleteModal() {
      document.getElementById('deleteModal').classList.remove('active');
    }

    async function confirmDelete() {
      const id = document.getElementById('deleteId').value;
      try {
        const res = await fetch('/api/user-data/' + id, { method: 'DELETE' });
        const json = await res.json();
        if (res.ok) {
          showToast('删除成功');
          closeDeleteModal();
          loadData();
        } else {
          showToast(json.error || '删除失败', 'error');
        }
      } catch (e) {
        showToast('网络错误', 'error');
      }
    }

    async function logout() {
      await fetch('/api/logout', { method: 'POST' });
      window.location.href = '/login';
    }

    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el) {
          el.classList.remove('active');
        }
      });
    });

    loadData();
  </script>
</body>
</html>`;
}
