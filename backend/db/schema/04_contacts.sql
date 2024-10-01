DROP TABLE IF EXISTS contacts CASCADE;
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    contact_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE(user_id, contact_id)
);