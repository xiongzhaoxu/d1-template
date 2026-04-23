-- 0003_create_user_data_table.sql

-- 创建用户数据表
CREATE TABLE IF NOT EXISTS user_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    code INTEGER DEFAULT 0,
    msg INTEGER DEFAULT 0,
    info TEXT,
    remark TEXT DEFAULT '',
    data TEXT,
    tm INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_data_user_id ON user_data(user_id);
CREATE INDEX IF NOT EXISTS idx_user_data_tm ON user_data(tm);

-- 可选：如果每个用户只能有一条数据，加上唯一约束
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_data_unique ON user_data(user_id);

-- 给 info 字段添加唯一索引
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_data_info ON user_data(info);