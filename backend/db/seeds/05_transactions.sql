-- Alice's Transactions (user_id = 1)
INSERT INTO transactions (user_id, category, amount_in, amount_out, description)
VALUES
    (1, 'Groceries', 0.00, 150.00, 'Weekly grocery shopping'),
    (1, 'Travel', 0.00, 300.00, 'Flight tickets for vacation'),
    (1, 'Dining', 0.00, 75.00, 'Dinner with friends'),
    (1, 'Shopping', 0.00, 250.00, 'New clothes and accessories'),
    (1, 'Healthcare', 0.00, 100.00, 'Dentist appointment'),
    (1, 'Entertainment', 0.00, 50.00, 'Concert tickets'),
    (1, 'Utilities', 0.00, 200.00, 'Water and electricity bills'),
    (1, 'Transport', 0.00, 30.00, 'Monthly bus pass'),
    (1, 'Rent', 0.00, 900.00, 'Apartment rent payment'),
    (1, 'Gifts', 0.00, 120.00, 'Birthday gift for friend');

-- Bob's Transactions (user_id = 2)
INSERT INTO transactions (user_id, category, amount_in, amount_out, description)
VALUES
    (2, 'Entertainment', 0.00, 60.00, 'Movie tickets and snacks'),
    (2, 'Healthcare', 0.00, 200.00, 'Doctor visit and medication'),
    (2, 'Dining', 0.00, 80.00, 'Lunch at a cafe'),
    (2, 'Groceries', 0.00, 120.00, 'Weekly grocery shopping'),
    (2, 'Shopping', 0.00, 300.00, 'New phone and accessories'),
    (2, 'Travel', 0.00, 400.00, 'Weekend trip to the beach'),
    (2, 'Education', 0.00, 150.00, 'Online course fee'),
    (2, 'Utilities', 0.00, 180.00, 'Internet and electricity bills'),
    (2, 'Transport', 0.00, 40.00, 'Gas for car'),
    (2, 'Rent', 0.00, 850.00, 'Apartment rent payment');

-- Carol's Transactions (user_id = 3)
INSERT INTO transactions (user_id, category, amount_in, amount_out, description)
VALUES
    (3, 'Utilities', 0.00, 120.00, 'Electricity bill'),
    (3, 'Shopping', 0.00, 250.00, 'Clothes and accessories'),
    (3, 'Groceries', 0.00, 130.00, 'Weekly grocery shopping'),
    (3, 'Dining', 0.00, 60.00, 'Dinner at a restaurant'),
    (3, 'Entertainment', 0.00, 90.00, 'Concert tickets'),
    (3, 'Healthcare', 0.00, 75.00, 'Pharmacy expenses'),
    (3, 'Rent', 0.00, 900.00, 'Apartment rent payment'),
    (3, 'Education', 0.00, 250.00, 'Online course tuition'),
    (3, 'Transport', 0.00, 30.00, 'Taxi rides'),
    (3, 'Travel', 0.00, 500.00, 'Flight to visit family');

-- Dave's Transactions (user_id = 4)
INSERT INTO transactions (user_id, category, amount_in, amount_out, description)
VALUES
    (4, 'Rent', 0.00, 900.00, 'Monthly apartment rent'),
    (4, 'Transport', 0.00, 50.00, 'Monthly bus pass'),
    (4, 'Groceries', 0.00, 140.00, 'Weekly grocery shopping'),
    (4, 'Shopping', 0.00, 200.00, 'New shoes and jacket'),
    (4, 'Dining', 0.00, 100.00, 'Dinner at a fancy restaurant'),
    (4, 'Utilities', 0.00, 170.00, 'Gas and electricity bills'),
    (4, 'Entertainment', 0.00, 60.00, 'Video game purchase'),
    (4, 'Healthcare', 0.00, 150.00, 'Medical check-up'),
    (4, 'Travel', 0.00, 400.00, 'Weekend trip to the mountains'),
    (4, 'Education', 0.00, 100.00, 'New programming book');

-- Eve's Transactions (user_id = 5)
INSERT INTO transactions (user_id, category, amount_in, amount_out, description)
VALUES
    (5, 'Dining', 0.00, 80.00, 'Dinner at a restaurant'),
    (5, 'Education', 0.00, 500.00, 'Online course tuition'),
    (5, 'Groceries', 0.00, 110.00, 'Weekly grocery shopping'),
    (5, 'Shopping', 0.00, 250.00, 'New clothes and shoes'),
    (5, 'Healthcare', 0.00, 200.00, 'Medical expenses'),
    (5, 'Entertainment', 0.00, 70.00, 'Movie night with friends'),
    (5, 'Travel', 0.00, 350.00, 'Vacation flight tickets'),
    (5, 'Utilities', 0.00, 150.00, 'Electricity and water bills'),
    (5, 'Rent', 0.00, 950.00, 'Monthly rent payment'),
    (5, 'Gifts', 0.00, 120.00, 'Gift for family member');