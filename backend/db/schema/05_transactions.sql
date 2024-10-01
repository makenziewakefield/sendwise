DROP TABLE IF EXISTS transactions CASCADE;
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    category VARCHAR(50) NOT NULL,
    amount_in DECIMAL(10, 2) NOT NULL,
    amount_out DECIMAL(10, 2),
    description TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
