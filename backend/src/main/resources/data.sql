-- Insert into user table
INSERT INTO user ( firstname, lastname, email, password, role, team_id, locked, enabled) VALUES ('Samiha', 'Draa', 'sam@example.com', '$2y$13$fX5AV/NJ5aQqK5nD45.dr.lSc9vwjsqCSulq4ATPwfMJcp2Tq2fKK', 'USER',4, FALSE, TRUE);
INSERT INTO user ( firstname, lastname, email, password, role, team_id, locked, enabled) VALUES ('Adam', 'Doum', 'doum@example.com', '$2y$13$SLXpPJGaCAbCvZ4D6vVRE.vPNtqOPp6PreQ3bJDQhF3Q3t/hOlYTe', 'ADMIN',5, FALSE, TRUE);
INSERT INTO user ( firstname, lastname, email, password, role, team_id, locked, enabled) VALUES ('Hicham', 'Doum', 'hich@example.com', '$2y$13$fEUeq3qqcrXm.G2yYh.AM.EWh3qzu77zRB1uB.MVfAJGTVNbyA1.u', 'ADMIN',5, FALSE, TRUE);

-- Insert into reservation table
INSERT INTO reservation (reservation_date, nb_time_slot, work_station_id, user_id, reservation_type_id) VALUES ('2023-11-01', 3, 101, 1, 1);
INSERT INTO reservation (reservation_date, nb_time_slot, work_station_id, user_id, reservation_type_id) VALUES ('2023-10-22', 2, 102, 2, 1);
INSERT INTO reservation (reservation_date, nb_time_slot, work_station_id, user_id, reservation_type_id) VALUES ('2023-10-25', 4, 104, 2, 3);
INSERT INTO reservation (reservation_date, nb_time_slot, work_station_id, user_id, reservation_type_id) VALUES ('2023-10-25', 3, 104, 3, 2);
INSERT INTO reservation (reservation_date, nb_time_slot, work_station_id, user_id, reservation_type_id) VALUES ('2023-11-22', 1, 100, 1, 2);
INSERT INTO reservation (reservation_date, nb_time_slot, work_station_id, user_id, reservation_type_id) VALUES ('2023-11-26', 1, 10, 1, 20);

--Insert into country table
INSERT INTO country (name) VALUES ('Belgium');
INSERT INTO country (name) VALUES ('France');
INSERT INTO country (name) VALUES ('Morocco');
INSERT INTO country (name) VALUES ('Germany');

--Insert into city table
INSERT INTO city (name, country_id) VALUES ('Brussels', 1);
INSERT INTO city (name, country_id) VALUES ('Antwerp', 1);
INSERT INTO city (name, country_id) VALUES ('Paris', 2);
INSERT INTO city (name, country_id) VALUES ('Bordeaux', 2);
INSERT INTO city (name, country_id) VALUES ('Lyon', 2);
INSERT INTO city (name, country_id) VALUES ('Rabat', 3);
INSERT INTO city (name, country_id) VALUES ('Agadir', 3);
INSERT INTO city (name, country_id) VALUES ('Berlin', 4);
INSERT INTO city (name, country_id) VALUES ('Dusseldorf', 4);

-- Insert into office table
INSERT INTO office (name, city_id) VALUES ('Bd Adolph Max n° 130 1000 Bruxelles', 1);
INSERT INTO office (name, city_id) VALUES ('Rue Blabla n° 50 1080 Molenbeek', 1);
INSERT INTO office (name, city_id) VALUES ('Amerikalei n° 13 2000 antwerp', 2);
INSERT INTO office (name, city_id) VALUES ('Bd de la defence n°152 92400 Courbevoie', 3);
INSERT INTO office (name, city_id) VALUES ('Bd de la Jeunesse n°15', 4);
INSERT INTO office (name, city_id) VALUES ('Rue Haute n°109', 5);
INSERT INTO office (name, city_id) VALUES ('Rue de Bruxelles n°40 Ocean ', 6);
INSERT INTO office (name, city_id) VALUES ('Rue Ankara n°67 ', 7);
INSERT INTO office (name, city_id) VALUES ('Office 1 ', 8);
INSERT INTO office (name, city_id) VALUES ('Office 2 ', 8);
INSERT INTO office (name, city_id) VALUES ('Office 1 ', 9);

-- Insert into zone table
INSERT INTO zone (name, office_id) VALUES ('Zone A', 1);
INSERT INTO zone (name, office_id) VALUES ('Zone B', 1);
INSERT INTO zone (name, office_id) VALUES ('Zone C', 1);
INSERT INTO zone (name, office_id) VALUES ('Floor 1', 2);
INSERT INTO zone (name, office_id) VALUES ('Floor 2', 2);
INSERT INTO zone (name, office_id) VALUES ('Zone A', 3);
INSERT INTO zone (name, office_id) VALUES ('Zone B', 3);
INSERT INTO zone (name, office_id) VALUES ('Zone A', 4);
INSERT INTO zone (name, office_id) VALUES ('Zone B', 4);
INSERT INTO zone (name, office_id) VALUES ('Zone C', 4);
INSERT INTO zone (name, office_id) VALUES ('Floor 1', 5);
INSERT INTO zone (name, office_id) VALUES ('Floor 2', 5);
INSERT INTO zone (name, office_id) VALUES ('Floor 3', 5);


-- Insert into department table
INSERT INTO department (name) VALUES ('COM');
INSERT INTO department (name) VALUES ('HR');
INSERT INTO department (name) VALUES ('IT');

-- Insert into team table
INSERT INTO team (name, department_id, member_Quota, team_Quota_Max, team_Quota_Min) VALUES ('Equip1', 1, 2.5, 2.5, 1);
INSERT INTO team (name, department_id, member_Quota, team_Quota_Max, team_Quota_Min) VALUES ('Equip2', 2, 2, 2.5, 1);
INSERT INTO team (name, department_id, member_Quota, team_Quota_Max, team_Quota_Min) VALUES ('DevTeam',3, 2.5, 2.5, 1);
INSERT INTO team (name, department_id, member_Quota, team_Quota_Max, team_Quota_Min) VALUES ('DevOpsTeam', 3, 2.5, 2.5, 1);
INSERT INTO team (name, department_id, member_Quota, team_Quota_Max, team_Quota_Min) VALUES ('TestTeam', 3, 2.5, 2.5, 1);

-- Insert into reservation_type table
INSERT INTO reservation_type (name) VALUES ('Individual space');
INSERT INTO reservation_type (name) VALUES ('Collaborative space');
INSERT INTO reservation_type (name) VALUES ('Team day');

--Insert into work_area table
INSERT INTO work_area (name) VALUES ('Quiet space');
INSERT INTO work_area (name) VALUES ('Working space');
INSERT INTO work_area (name) VALUES ('Meeting space');

--Insert into equipment
INSERT INTO equipment (name) VALUES ('Hp Thunderbolt docking');
INSERT INTO equipment (name) VALUES ('Hp Ultra slim docking');
INSERT INTO equipment (name) VALUES ('Keyboard');
INSERT INTO equipment (name) VALUES ('Mouse');
--
--Insert into screen
INSERT INTO screen (name) VALUES ('No screen');
INSERT INTO screen (name) VALUES ('Standard screen');
INSERT INTO screen (name) VALUES ('Large screen');
INSERT INTO screen (name) VALUES ('Double standard screen');
INSERT INTO screen (name) VALUES ('Double large screen');

--Insert into furniture
INSERT INTO furniture (name) VALUES ('Normal desk');
INSERT INTO furniture (name) VALUES ('Adjustable desk');
INSERT INTO furniture (name) VALUES ('Normal chair');
INSERT INTO furniture (name) VALUES ('Adjustable chair');

