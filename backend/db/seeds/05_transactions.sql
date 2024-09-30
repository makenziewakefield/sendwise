-- Alice's Transactions (user_id = 1)
INSERT INTO transactions (user_id, category, amount_in, amount_out, description, date)
VALUES
    (1, 'Salary', 3500.00, 0.00, 'Monthly salary', '2024-09-30 09:00:00'),
    (1, 'Groceries', 0.00, 150.00, 'Weekly grocery shopping', '2024-09-25 15:30:00'),
    (1, 'Utilities', 0.00, 200.00, 'Electricity bill', '2024-09-20 14:00:00'),
    (1, 'Dining', 0.00, 75.00, 'Dinner with friends', '2024-09-15 20:00:00'),
    (1, 'Shopping', 0.00, 250.00, 'New clothes', '2024-09-10 13:45:00'),
    (1, 'Salary', 3500.00, 0.00, 'Monthly salary', '2024-08-31 09:00:00'),
    (1, 'Rent', 0.00, 1200.00, 'Monthly rent', '2024-08-05 10:00:00'),
    (1, 'Travel', 0.00, 500.00, 'Weekend getaway', '2024-07-15 08:30:00'),
    (1, 'Healthcare', 0.00, 150.00, 'Doctor visit', '2024-06-20 11:00:00'),
    (1, 'Entertainment', 0.00, 100.00, 'Concert tickets', '2024-05-30 19:00:00'),
    (1, 'Salary', 3500.00, 0.00, 'Monthly salary', '2024-05-31 09:00:00'),
    (1, 'Education', 0.00, 300.00, 'Online course', '2024-04-10 14:30:00'),
    (1, 'Gifts', 0.00, 120.00, 'Birthday gift for mom', '2024-03-15 16:00:00'),
    (1, 'Transport', 0.00, 60.00, 'Monthly bus pass', '2024-02-01 08:00:00'),
    (1, 'Salary', 3700.00, 0.00, 'Monthly salary with raise', '2024-01-31 09:00:00'),
    (1, 'Shopping', 0.00, 400.00, 'New smartphone', '2023-12-10 12:00:00'),
    (1, 'Groceries', 0.00, 180.00, 'Thanksgiving grocery shopping', '2023-11-22 16:30:00'),
    (1, 'Utilities', 0.00, 220.00, 'Internet and phone bill', '2023-10-05 09:30:00'),
    (1, 'Salary', 3500.00, 0.00, 'Monthly salary', '2023-09-30 09:00:00'),
    (1, 'Travel', 0.00, 1000.00, 'Summer vacation', '2023-08-01 07:00:00');

-- Bob's Transactions (user_id = 2)
INSERT INTO transactions (user_id, category, amount_in, amount_out, description, date)
VALUES
    (2, 'Salary', 4000.00, 0.00, 'Monthly salary', '2024-09-30 09:15:00'),
    (2, 'Groceries', 0.00, 200.00, 'Monthly grocery haul', '2024-09-22 11:30:00'),
    (2, 'Utilities', 0.00, 150.00, 'Water bill', '2024-09-18 14:30:00'),
    (2, 'Dining', 0.00, 100.00, 'Anniversary dinner', '2024-09-10 19:00:00'),
    (2, 'Transport', 0.00, 50.00, 'Gas refill', '2024-09-05 17:00:00'),
    (2, 'Salary', 4000.00, 0.00, 'Monthly salary', '2024-08-31 09:15:00'),
    (2, 'Rent', 0.00, 1400.00, 'Monthly rent', '2024-08-03 10:00:00'),
    (2, 'Healthcare', 0.00, 200.00, 'Dental checkup', '2024-07-20 09:00:00'),
    (2, 'Entertainment', 0.00, 150.00, 'Movie night and dinner', '2024-06-15 18:30:00'),
    (2, 'Shopping', 0.00, 300.00, 'New laptop accessories', '2024-05-30 13:00:00'),
    (2, 'Salary', 4000.00, 0.00, 'Monthly salary', '2024-05-31 09:15:00'),
    (2, 'Travel', 0.00, 800.00, 'Flight tickets for vacation', '2024-04-22 10:00:00'),
    (2, 'Education', 0.00, 250.00, 'Programming course', '2024-03-10 15:00:00'),
    (2, 'Gifts', 0.00, 150.00, 'Wedding gift for friend', '2024-02-14 11:30:00'),
    (2, 'Salary', 4200.00, 0.00, 'Monthly salary with bonus', '2024-01-31 09:15:00'),
    (2, 'Utilities', 0.00, 180.00, 'Electricity bill', '2023-12-10 16:00:00'),
    (2, 'Groceries', 0.00, 220.00, 'Christmas dinner shopping', '2023-12-23 14:30:00'),
    (2, 'Transport', 0.00, 70.00, 'Car maintenance', '2023-11-05 11:00:00'),
    (2, 'Salary', 4000.00, 0.00, 'Monthly salary', '2023-10-31 09:15:00'),
    (2, 'Shopping', 0.00, 500.00, 'New winter wardrobe', '2023-10-15 12:00:00');

-- Carol's Transactions (user_id = 3)
INSERT INTO transactions (user_id, category, amount_in, amount_out, description, date)
VALUES
    (3, 'Salary', 4500.00, 0.00, 'Monthly salary', '2024-09-30 09:30:00'),
    (3, 'Groceries', 0.00, 180.00, 'Weekly grocery run', '2024-09-28 10:00:00'),
    (3, 'Utilities', 0.00, 120.00, 'Internet bill', '2024-09-15 15:00:00'),
    (3, 'Dining', 0.00, 90.00, 'Lunch with colleagues', '2024-09-08 13:00:00'),
    (3, 'Transport', 0.00, 40.00, 'Uber rides', '2024-09-03 18:30:00'),
    (3, 'Salary', 4500.00, 0.00, 'Monthly salary', '2024-08-31 09:30:00'),
    (3, 'Rent', 0.00, 1600.00, 'Monthly rent', '2024-08-02 11:00:00'),
    (3, 'Shopping', 0.00, 350.00, 'New smartphone', '2024-07-20 14:00:00'),
    (3, 'Healthcare', 0.00, 100.00, 'Pharmacy expenses', '2024-06-18 09:30:00'),
    (3, 'Entertainment', 0.00, 80.00, 'Concert tickets', '2024-05-30 20:00:00'),
    (3, 'Salary', 4500.00, 0.00, 'Monthly salary', '2024-05-31 09:30:00'),
    (3, 'Education', 0.00, 400.00, 'Language course fees', '2024-04-15 11:00:00'),
    (3, 'Travel', 0.00, 1200.00, 'Summer vacation package', '2024-03-20 09:00:00'),
    (3, 'Gifts', 0.00, 150.00, 'Mother's Day gift', '2024-02-10 16:30:00'),
    (3, 'Salary', 4700.00, 0.00, 'Monthly salary with raise', '2024-01-31 09:30:00'),
    (3, 'Utilities', 0.00, 200.00, 'Electricity and water bill', '2023-12-12 14:00:00'),
    (3, 'Groceries', 0.00, 250.00, 'New Year's Eve party supplies', '2023-12-30 11:30:00'),
    (3, 'Transport', 0.00, 60.00, 'Monthly subway pass', '2023-11-01 08:00:00'),
    (3, 'Salary', 4500.00, 0.00, 'Monthly salary', '2023-10-31 09:30:00'),
    (3, 'Shopping', 0.00, 300.00, 'New laptop bag and accessories', '2023-10-05 13:30:00');

-- Dave's Transactions (user_id = 4)
INSERT INTO transactions (user_id, category, amount_in, amount_out, description, date)
VALUES
    (4, 'Salary', 5000.00, 0.00, 'Monthly salary', '2024-09-30 09:45:00'),
    (4, 'Groceries', 0.00, 220.00, 'Bi-weekly grocery shopping', '2024-09-26 16:00:00'),
    (4, 'Utilities', 0.00, 180.00, 'Electricity and gas bill', '2024-09-20 11:30:00'),
    (4, 'Dining', 0.00, 150.00, 'Family dinner at restaurant', '2024-09-14 19:30:00'),
    (4, 'Transport', 0.00, 100.00, 'Car fuel', '2024-09-05 08:00:00'),
    (4, 'Salary', 5000.00, 0.00, 'Monthly salary', '2024-08-31 09:45:00'),
    (4, 'Rent', 0.00, 1800.00, 'Monthly rent', '2024-08-03 10:30:00'),
    (4, 'Shopping', 0.00, 500.00, 'New laptop', '2024-07-15 13:00:00'),
    (4, 'Healthcare', 0.00, 250.00, 'Annual health checkup', '2024-06-22 10:00:00'),
    (4, 'Entertainment', 0.00, 200.00, 'Theater tickets', '2024-05-28 19:00:00'),
    (4, 'Salary', 5000.00, 0.00, 'Monthly salary', '2024-05-31 09:45:00'),
    (4, 'Education', 0.00, 1000.00, 'Professional certification course', '2024-04-10 14:00:00'),
    (4, 'Travel', 0.00, 2000.00, 'Family vacation', '2024-03-01 07:00:00'),
    (4, 'Gifts', 0.00, 300.00, 'Anniversary gift for spouse', '2024-02-14 12:00:00'),
    (4, 'Salary', 5500.00, 0.00, 'Monthly salary with bonus', '2024-01-31 09:45:00'),
    (4, 'Utilities', 0.00, 220.00, 'Internet and phone bill', '2023-12-15 16:30:00'),
    (4, 'Groceries', 0.00, 300.00, 'Holiday season grocery shopping', '2023-12-22 10:00:00'),
    (4, 'Transport', 0.00, 150.00, 'Car maintenance', '2023-11-10 14:30:00'),
    (4, 'Salary', 5000.00, 0.00, 'Monthly salary', '2023-10-31 09:45:00'),
    (4, 'Shopping', 0.00, 400.00, 'New winter coat', '2023-10-20 15:00:00');

-- Eve's Transactions (user_id = 5)
INSERT INTO transactions (user_id, category, amount_in, amount_out, description, date)
VALUES
    (5, 'Salary', 4800.00, 0.00, 'Monthly salary', '2024-09-30 10:00:00'),
    (5, 'Groceries', 0.00, 190.00, 'Weekly organic produce', '2024-09-27 11:00:00'),
    (5, 'Utilities', 0.00, 130.00, 'Water and trash service', '2024-09-18 14:00:00'),
    (5, 'Dining', 0.00, 80.00, 'Brunch with friends', '2024-09-08 11:30:00'),
    (5, 'Transport', 0.00, 45.00, 'Bike repair', '2024-09-02 16:00:00'),
    (5, 'Salary', 4800.00, 0.00, 'Monthly salary', '2024-08-31 10:00:00'),
    (5, 'Rent', 0.00, 1500.00, 'Monthly rent', '2024-08-01 09:00:00'),
    (5, 'Shopping', 0.00, 250.00, 'New yoga equipment', '2024-07-25 13:30:00'),
    (5, 'Healthcare', 0.00, 180.00, 'Dentist appointment', '2024-06-20 15:00:00'),
    (5, 'Entertainment', 0.00, 70.00, 'Art gallery admission', '2024-05-30 14:00:00'),
    (5, 'Salary', 4800.00, 0.00, 'Monthly salary', '2024-05-31 10:00:00'),
    (5, 'Education', 0.00, 350.00, 'Photography workshop', '2024-04-18 09:30:00'),
    (5, 'Travel', 0.00, 900.00, 'Weekend spa retreat', '2024-03-15 08:00:00'),
    (5, 'Gifts', 0.00, 100.00, 'Housewarming gift for friend', '2024-02-10 15:00:00'),
    (5, 'Salary', 5000.00, 0.00, 'Monthly salary with bonus', '2024-01-31 10:00:00'),
    (5, 'Utilities', 0.00, 150.00, 'Electricity bill', '2023-12-10 13:00:00'),
    (5, 'Groceries', 0.00, 220.00, 'Holiday dinner ingredients', '2023-12-23 09:00:00'),
    (5, 'Transport', 0.00, 55.00, 'Bike tune-up', '2023-11-05 10:30:00'),
    (5, 'Salary', 4800.00, 0.00, 'Monthly salary', '2023-10-31 10:00:00'),
    (5, 'Shopping', 0.00, 180.00, 'New fall wardrobe', '2023-10-15 14:00:00');