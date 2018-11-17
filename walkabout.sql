-- Walkabout
-- CREATE DATABASE Walkabout;
-- GO

CREATE SCHEMA Walkabout;
GO

-- CREATE DATABASE Walkabout;
-- DROP TABLE IF EXISTS Walkabout.Client;
-- GO
-- DROP TABLE IF EXISTS Walkabout.Session;
-- GO
-- DROP TABLE IF EXISTS Walkabout.Metadata;
-- GO

-- Table: Client
CREATE TABLE Walkabout.Client
(
  ID char(36) NOT NULL PRIMARY KEY,
  At datetime,
  Name varchar(45),
  Type varchar(30)
);
GO

-- Table: Session
CREATE TABLE Walkabout.Session
(
  ID int NOT NULL PRIMARY KEY,
  ClientID CHAR(36) NOT NULL REFERENCES Client(ID),
  At datetime,
  Name varchar(55),
  Description text
);
GO

-- Table: Metadata
CREATE TABLE Walkabout.Metadata
(
  ID int NOT NULL PRIMARY KEY,
  SessionID int NOT NULL REFERENCES Session(ID),
  At datetime,
  AccX int,
  AccY int,
  AccZ int
);
GO

