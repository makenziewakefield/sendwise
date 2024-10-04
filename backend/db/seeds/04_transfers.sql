INSERT INTO transfers (sender_id, recipient_id, amount, description)
VALUES
    (1, 2, 50.00, 'Payment for lunch'),         -- Alice to Bob
    (1, 4, 500.00, 'Birthday gift'),            -- Alice to Dave
    (1, 3, 75.00, 'Shared travel expenses'),    -- Alice to Carol
    (1, 5, 200.00, 'Help with rent'),           -- Alice to Eve
    (1, 4, 300.00, 'Concert tickets'),          -- Alice to Dave
    (1, 2, 150.00, 'Groceries repayment'),      -- Alice to Bob
    (1, 3, 90.00, 'Restaurant dinner'),         -- Alice to Carol
    (1, 5, 250.00, 'Vacation fund'),            -- Alice to Eve
    (1, 2, 120.00, 'Gift for birthday'),        -- Alice to Bob
    (1, 4, 350.00, 'Loan repayment'),           -- Alice to Dave
    (1, 5, 100.00, 'Charity donation'),         -- Alice to Eve
    (2, 1, 200.00, 'Dinner bill'),              -- Bob to Alice
    (3, 1, 300.00, 'Travel expenses share'),    -- Carol to Alice
    (4, 1, 400.00, 'Concert tickets repayment'),-- Dave to Alice
    (5, 1, 500.00, 'Emergency fund support'),   -- Eve to Alice
    (2, 1, 250.00, 'Hotel booking refund'),     -- Bob to Alice
    (3, 1, 150.00, 'Movie night'),              -- Carol to Alice
    (4, 1, 350.00, 'Vacation repayment'),       -- Dave to Alice
    (5, 1, 450.00, 'Birthday gift'),            -- Eve to Alice
    (2, 3, 120.00, 'Gift'),                     -- Bob to Carol
    (3, 1, 75.00, 'Shared expenses'),           -- Carol to Alice
    (4, 5, 200.00, 'Loan repayment'),           -- Dave to Eve
    (5, 4, 300.00, 'Money transfer'),           -- Eve to Dave
    (3, 2, 90.00, 'Refund'),                    -- Carol to Bob
    (5, 1, 100.00, 'Donation');                 -- Eve to Alice