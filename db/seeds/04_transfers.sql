INSERT INTO transfers (sender_id, recipient_id, amount, description)
VALUES
    (1, 2, 50.00, 'Payment for lunch'),         -- Alice to Bob
    (2, 3, 120.00, 'Gift'),                     -- Bob to Carol
    (3, 1, 75.00, 'Shared expenses'),           -- Carol to Alice
    (4, 5, 200.00, 'Loan repayment'),           -- Dave to Eve
    (5, 4, 300.00, 'Money transfer'),           -- Eve to Dave
    (1, 4, 500.00, 'Birthday gift'),            -- Alice to Dave
    (3, 2, 90.00, 'Refund'),                    -- Carol to Bob
    (5, 1, 100.00, 'Donation');                 -- Eve to Alice