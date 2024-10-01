DROP TABLE IF EXISTS transactions CASCADE;
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    category_id INT REFERENCES categories(id),
    amount_in DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    amount_out DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    description TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transfer_id INTEGER REFERENCES transfers(id) ON DELETE CASCADE -- Link to Transfer
);