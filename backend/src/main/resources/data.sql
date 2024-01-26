-- Insert into user table
INSERT INTO user ( firstname, lastname, email, password, role, team_id, locked, enabled) VALUES ('Samiha', 'Draa', 'sam@example.com', '$2y$13$fX5AV/NJ5aQqK5nD45.dr.lSc9vwjsqCSulq4ATPwfMJcp2Tq2fKK', 'USER',4, FALSE, TRUE);
INSERT INTO user ( firstname, lastname, email, password, role, team_id, locked, enabled) VALUES ('Adam', 'Doum', 'doum@example.com', '$2y$13$SLXpPJGaCAbCvZ4D6vVRE.vPNtqOPp6PreQ3bJDQhF3Q3t/hOlYTe', 'ADMIN',5, FALSE, TRUE);
INSERT INTO user ( firstname, lastname, email, password, role, team_id, locked, enabled) VALUES ('Hicham', 'Doum', 'hich@example.com', '$2y$13$fEUeq3qqcrXm.G2yYh.AM.EWh3qzu77zRB1uB.MVfAJGTVNbyA1.u', 'ADMIN',5, FALSE, TRUE);

-- Insert into reservation table
INSERT INTO reservation (reservation_date, morning, afternoon, work_station_id, user_id, reservation_type_id) VALUES ('2024-01-26',true ,true, 1, 1, 1);
INSERT INTO reservation (reservation_date, morning, afternoon, work_station_id, user_id, reservation_type_id) VALUES ('2024-01-26',true, true, 2, 2, 1);
INSERT INTO reservation (reservation_date, morning, afternoon, work_station_id, user_id, reservation_type_id) VALUES ('2024-02-02', false, true, 3, 2, 3);
INSERT INTO reservation (reservation_date, morning, afternoon, work_station_id, user_id, reservation_type_id) VALUES ('2023-10-25',true, true, 1, 3, 2);
INSERT INTO reservation (reservation_date, morning, afternoon, work_station_id, user_id, reservation_type_id) VALUES ('2023-11-22',false, true, 3, 1, 2);
INSERT INTO reservation (reservation_date, morning, afternoon, work_station_id, user_id, reservation_type_id) VALUES ('2024-01-17',true, false, 2, 1, 20);

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

-- Insert into userPreference table
INSERT INTO user_preference (user_id, country_id, city_id, office_id, zone_id, reservation_type_id, work_area_id, screen_id ) VALUES (1, 3, 7, 8, 1, 1, 1,5);
INSERT INTO user_preference (user_id, country_id, city_id, office_id, zone_id, reservation_type_id, work_area_id, screen_id ) VALUES (2, 1, 2, 2, 1, 1, 3,3);
-- INSERT INTO team (user_id, counytry_id, city_id, office_id, zone_id, reservation_type_id, work_area_id, screen_id ) VALUES (1, 1, 2, 2, 1, 1, 4);
-- INSERT INTO team (user_id, counytry_id, city_id, office_id, zone_id, reservation_type_id, work_area_id, screen_id ) VALUES (1, 1, 2, 2, 1, 1, 4);

--Insert into userPreferenceEquipmentIds
INSERT INTO user_preference_equipment_ids (user_preference_id, equipment_id) VALUES (1, 2);
INSERT INTO user_preference_equipment_ids (user_preference_id, equipment_id) VALUES (1, 4);
INSERT INTO user_preference_equipment_ids (user_preference_id, equipment_id) VALUES (2, 1);
INSERT INTO user_preference_equipment_ids (user_preference_id, equipment_id) VALUES (1, 3);

--Insert into userPreferenceFurnitureIds
INSERT INTO user_preference_furniture_ids (user_preference_id, furniture_id) VALUES (1, 1);
INSERT INTO user_preference_furniture_ids (user_preference_id, furniture_id) VALUES (1, 2);
INSERT INTO user_preference_furniture_ids (user_preference_id, furniture_id) VALUES (1, 4);
INSERT INTO user_preference_furniture_ids (user_preference_id, furniture_id) VALUES (2, 2);
INSERT INTO user_preference_furniture_ids (user_preference_id, furniture_id) VALUES (2, 3);

-- Insert into WorkStation table
INSERT INTO Work_station ( work_place, zone_id, work_area_id, screen_id, active) VALUES ('1.01',1, 1, 1, true);
INSERT INTO Work_station ( work_place, zone_id, work_area_id, screen_id, active) VALUES ('1.02', 1, 2, 1, true);
INSERT INTO Work_station ( work_place, zone_id, work_area_id, screen_id, active) VALUES ('1.03',1, 2, 1, true);
INSERT INTO Work_station ( work_place, zone_id, work_area_id, screen_id, active) VALUES ('2.01', 2, 2, 2, true);
INSERT INTO Work_station ( work_place, zone_id, work_area_id, screen_id, active) VALUES ('2.02', 2, 2, 2, true);
INSERT INTO Work_station ( work_place, zone_id, work_area_id, screen_id, active) VALUES ('2.03', 2, 3, 3, true);
INSERT INTO Work_station ( work_place, zone_id, work_area_id, screen_id, active) VALUES ('2.04', 2, 2, 3, true);
INSERT INTO Work_station ( work_place, zone_id, work_area_id, screen_id, active) VALUES ('3.01', 3, 1, 4, false);
INSERT INTO Work_station ( work_place, zone_id, work_area_id, screen_id, active) VALUES ('3.02', 3, 2, 5, true);
INSERT INTO Work_station ( work_place, zone_id, work_area_id, screen_id, active) VALUES ('1.04', 1, 3, 5, true);
INSERT INTO Work_station ( work_place, zone_id, work_area_id, screen_id, active) VALUES ('2.05', 2, 1, 2, true);
INSERT INTO Work_station ( work_place, zone_id, work_area_id, screen_id, active) VALUES ('3.04', 3, 2, 2, true);
INSERT INTO Work_station ( work_place, zone_id, work_area_id, screen_id, active) VALUES ('1.05', 1, 1, 2, false);
INSERT INTO Work_station ( work_place, zone_id, work_area_id, screen_id, active) VALUES ('2.06', 2, 2, 1, true);
INSERT INTO Work_station ( work_place, zone_id, work_area_id, screen_id, active) VALUES ('3.05', 3, 2, 5, true);
INSERT INTO Work_station ( work_place, zone_id, work_area_id, screen_id, active) VALUES ('1.06',1, 1, 1, false);
INSERT INTO Work_station ( work_place, zone_id, work_area_id, screen_id, active) VALUES ('1.07', 1, 1, 1,true);

--Insert into workStationEquipmentIds
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (1,1);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (1,2);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (2, 1);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (2, 2);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (2, 3);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (3, 3);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (3, 1);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (4, 2);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (4, 4);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (5, 2);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (5, 3);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (6, 1);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (6, 2);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (7, 3);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (7, 4);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (8, 4);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (8, 1);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (9, 2);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (9, 4);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (9, 3);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (10, 4);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (10, 3);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (11,1 );
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (11, 3);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (12, 2);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (16,1);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (16,2);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (17,1);
INSERT INTO work_station_equipment_ids (work_station_id, equipment_id) VALUES (17,2);

--Insert into userPreferenceFurnitureIds
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (1, 1);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (1, 3);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (2, 2);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (2, 4);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (3, 2);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (3, 4);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (4, 1);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (4, 3);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (5, 1);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (5, 3);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (6, 3);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (7, 4);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (8, 3);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (8, 1);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (9, 1);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (9, 3);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (10, 2);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (10, 4);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (11, 1);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (11, 4);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (12, 2);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (12, 3);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (13, 4);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (13, 1);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (14, 2);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (14, 4);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (16, 1);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (16, 3);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (17, 1);
INSERT INTO work_station_furniture_ids (work_station_id, furniture_id) VALUES (17, 3);
