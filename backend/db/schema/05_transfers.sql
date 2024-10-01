DROP TABLE IF EXISTS transfers CASCADE;
CREATE TABLE transfers (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    recipient_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    method VARCHAR(4) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    CONSTRAINT check_transfer_method CHECK (method IN ('Bank', 'Cash'))
);