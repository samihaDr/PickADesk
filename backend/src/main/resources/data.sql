-- Insert into user table
INSERT INTO user ( firstname, lastname, email, password, role, locked, enabled) VALUES ('Samiha', 'Draa', 'sam@example.com', '$2y$13$fX5AV/NJ5aQqK5nD45.dr.lSc9vwjsqCSulq4ATPwfMJcp2Tq2fKK', 'USER', FALSE, TRUE);
INSERT INTO user ( firstname, lastname, email, password, role, locked, enabled) VALUES ('Adam', 'Doum', 'doum@example.com', '$2y$13$SLXpPJGaCAbCvZ4D6vVRE.vPNtqOPp6PreQ3bJDQhF3Q3t/hOlYTe', 'ADMIN', FALSE, TRUE);
INSERT INTO user ( firstname, lastname, email, password, role, locked, enabled) VALUES ('Hicham', 'Doum', 'hich@example.com', '$2y$13$fEUeq3qqcrXm.G2yYh.AM.EWh3qzu77zRB1uB.MVfAJGTVNbyA1.u', 'ADMIN', FALSE, TRUE);

-- Insert into reservation table
INSERT INTO reservation (reservation_date, nb_time_slot, work_station_id, user_id, reservation_type_id) VALUES ('2023-11-01', 3, 101, 1, 1);
INSERT INTO reservation (reservation_date, nb_time_slot, work_station_id, user_id, reservation_type_id) VALUES ('2023-10-22', 2, 102, 2, 1);
INSERT INTO reservation (reservation_date, nb_time_slot, work_station_id, user_id, reservation_type_id) VALUES ('2023-10-25', 4, 104, 2, 3);
INSERT INTO reservation (reservation_date, nb_time_slot, work_station_id, user_id, reservation_type_id) VALUES ('2023-10-25', 3, 104, 3, 2);