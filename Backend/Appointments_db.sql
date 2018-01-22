--CREATE DATABASE COMMAND:
--sqlite3 appointment.db

--CREATE APPOINTMENT TABLE
CREATE TABLE IF NOT EXISTS appointment (
	id INTEGER PRIMARY KEY,
	date DATETIME NOT NULL,
	detail TEXT NOT NULL
	);
	
--EXAMPLE DATA
insert into appointment (date, detail) values (datetime('now'),'Test 1');
insert into appointment (date, detail) values (datetime('now'),'Test 2');
insert into appointment (date, detail) values (datetime('now'),'Test 3'); 