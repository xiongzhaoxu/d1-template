-- 给 info 字段添加唯一索引
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_data_info ON user_data(info);
