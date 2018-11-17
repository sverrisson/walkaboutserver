-- Walkabout
-- CREATE DATABASE Walkabout;

-- CREATE DATABASE Walkabout;
-- DROP TABLE IF EXISTS Walkabout.Client;
-- GO
-- DROP TABLE IF EXISTS Walkabout.Session;
-- GO
-- DROP TABLE IF EXISTS Walkabout.Metadata;
-- GO

CREATE SCHEMA Walkabout

-- Table: Client
CREATE TABLE Client
(
  ID char(36) NOT NULL PRIMARY KEY,
  At datetime,
  Name varchar(45),
  Type varchar(30)
)

-- Table: Session
CREATE TABLE MSession
(
  ID int NOT NULL PRIMARY KEY,
  ClientID CHAR(36) NOT NULL REFERENCES Client(ID),
  At datetime,
  Name varchar(55),
  Description text,
  FOREIGN KEY (ClientID) REFERENCES Client(ID)
)

-- Table: Metadata
CREATE TABLE Metadata
(
  ID int NOT NULL PRIMARY KEY,
  SessionID int NOT NULL REFERENCES Session(ID),
  At datetime,
  AccX int,
  AccY int,
  AccZ int,
  FOREIGN KEY (SessionID) REFERENCES MSession(ID)
)

GO

