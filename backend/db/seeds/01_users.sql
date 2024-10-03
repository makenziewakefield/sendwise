-- Updated user wallet balances to avoid negative balance issues.
INSERT INTO users (first_name, last_name, username, email, password, wallet_balance)
VALUES 
    ('Alice', 'Johnson', 'alice', 'alice@example.com', '$2a$10$FIgDZn5xGMXN.Lq57eCyAuBAYODjHn4l4Q74NQxQN/63kxJ2BDRIK', 5000.00),
    ('Bob', 'Smith', 'bob', 'bob@example.com', '$2a$10$FIgDZn5xGMXN.Lq57eCyAuBAYODjHn4l4Q74NQxQN/63kxJ2BDRIK', 6000.00),
    ('Carol', 'Williams', 'carol', 'carol@example.com', '$2a$10$FIgDZn5xGMXN.Lq57eCyAuBAYODjHn4l4Q74NQxQN/63kxJ2BDRIK', 7000.00),
    ('Dave', 'Brown', 'dave', 'dave@example.com', '$2a$10$FIgDZn5xGMXN.Lq57eCyAuBAYODjHn4l4Q74NQxQN/63kxJ2BDRIK', 8000.00),
    ('Eve', 'Davis', 'eve', 'eve@example.com', '$2a$10$FIgDZn5xGMXN.Lq57eCyAuBAYODjHn4l4Q74NQxQN/63kxJ2BDRIK', 4000.00);
