-- Alice's Transactions (user_id = 1)
INSERT INTO transactions (user_id, category, amount_in, amount_out, description, date)
VALUES
    (1, 'Groceries', 0.00, 150.00, 'Weekly grocery shopping', '2024-10-01'),
    (1, 'Travel', 0.00, 1300.00, 'Flight tickets for vacation', '2024-10-04'),
    (1, 'Dining', 0.00, 75.00, 'Dinner with friends', '2024-09-30'),
    (1, 'Shopping', 0.00, 250.00, 'New clothes and accessories', '2024-09-01'),
    (1, 'Healthcare', 0.00, 100.00, 'Dentist appointment', '2024-09-21'),
    (1, 'Entertainment', 0.00, 250.00, 'Concert tickets', '2024-09-15'),
    (1, 'Utilities', 0.00, 200.00, 'Water and electricity bills', '2024-09-10'),
    (1, 'Transport', 0.00, 30.00, 'Monthly bus pass', '2024-09-20'),
    (1, 'Rent', 0.00, 500.00, 'Apartment rent payment', '2024-10-02'),
    (1, 'Gifts', 0.00, 120.00, 'Birthday gift for friend', '2024-10-03');

-- Bob's Transactions (user_id = 2)
INSERT INTO transactions (user_id, category, amount_in, amount_out, description, date)
VALUES
    (2, 'Entertainment', 0.00, 60.00, 'Movie tickets and snacks', '2024-09-29'),
    (2, 'Healthcare', 0.00, 200.00, 'Doctor visit and medication', '2024-09-16'),
    (2, 'Dining', 0.00, 80.00, 'Lunch at a cafe', '2024-09-25'),
    (2, 'Groceries', 0.00, 120.00, 'Weekly grocery shopping', '2024-09-11'),
    (2, 'Shopping', 0.00, 300.00, 'New phone and accessories', '2024-09-17'),
    (2, 'Travel', 0.00, 400.00, 'Weekend trip to the beach', '2024-09-19'),
    (2, 'Education', 0.00, 150.00, 'Online course fee', '2024-09-07'),
    (2, 'Utilities', 0.00, 180.00, 'Internet and electricity bills', '2024-09-12'),
    (2, 'Transport', 0.00, 40.00, 'Gas for car', '2024-09-23'),
    (2, 'Rent', 0.00, 850.00, 'Apartment rent payment', '2024-09-05');

-- Carol's Transactions (user_id = 3)
INSERT INTO transactions (user_id, category, amount_in, amount_out, description, date)
VALUES
    (3, 'Utilities', 0.00, 120.00, 'Electricity bill', '2024-09-26'),
    (3, 'Shopping', 0.00, 250.00, 'Clothes and accessories', '2024-09-30'),
    (3, 'Groceries', 0.00, 130.00, 'Weekly grocery shopping', '2024-09-22'),
    (3, 'Dining', 0.00, 60.00, 'Dinner at a restaurant', '2024-09-18'),
    (3, 'Entertainment', 0.00, 90.00, 'Concert tickets', '2024-09-15'),
    (3, 'Healthcare', 0.00, 75.00, 'Pharmacy expenses', '2024-09-09'),
    (3, 'Rent', 0.00, 900.00, 'Apartment rent payment', '2024-09-05'),
    (3, 'Education', 0.00, 250.00, 'Online course tuition', '2024-09-11'),
    (3, 'Transport', 0.00, 30.00, 'Taxi rides', '2024-09-28'),
    (3, 'Travel', 0.00, 500.00, 'Flight to visit family', '2024-09-21');

-- Dave's Transactions (user_id = 4)
INSERT INTO transactions (user_id, category, amount_in, amount_out, description, date)
VALUES
    (4, 'Rent', 0.00, 900.00, 'Monthly apartment rent', '2024-09-05'),
    (4, 'Transport', 0.00, 50.00, 'Monthly bus pass', '2024-09-19'),
    (4, 'Groceries', 0.00, 140.00, 'Weekly grocery shopping', '2024-09-24'),
    (4, 'Shopping', 0.00, 200.00, 'New shoes and jacket', '2024-09-16'),
    (4, 'Dining', 0.00, 100.00, 'Dinner at a fancy restaurant', '2024-09-25'),
    (4, 'Utilities', 0.00, 170.00, 'Gas and electricity bills', '2024-09-27'),
    (4, 'Entertainment', 0.00, 60.00, 'Video game purchase', '2024-09-29'),
    (4, 'Healthcare', 0.00, 150.00, 'Medical check-up', '2024-09-13'),
    (4, 'Travel', 0.00, 400.00, 'Weekend trip to the mountains', '2024-09-10'),
    (4, 'Education', 0.00, 100.00, 'New programming book', '2024-09-22');

-- Eve's Transactions (user_id = 5)
INSERT INTO transactions (user_id, category, amount_in, amount_out, description, date)
VALUES
    (5, 'Dining', 0.00, 80.00, 'Dinner at a restaurant', '2024-09-23'),
    (5, 'Education', 0.00, 500.00, 'Online course tuition', '2024-09-17'),
    (5, 'Groceries', 0.00, 110.00, 'Weekly grocery shopping', '2024-09-27'),
    (5, 'Shopping', 0.00, 250.00, 'New clothes and shoes', '2024-09-15'),
    (5, 'Healthcare', 0.00, 200.00, 'Medical expenses', '2024-09-21'),
    (5, 'Entertainment', 0.00, 70.00, 'Movie night with friends', '2024-09-29'),
    (5, 'Travel', 0.00, 350.00, 'Vacation flight tickets', '2024-09-19'),
    (5, 'Utilities', 0.00, 150.00, 'Electricity and water bills', '2024-09-10'),
    (5, 'Rent', 0.00, 950.00, 'Monthly rent payment', '2024-09-05'),
    (5, 'Gifts', 0.00, 120.00, 'Gift for family member', '2024-09-11');
