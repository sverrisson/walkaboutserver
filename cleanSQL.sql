CREATE TABLE Client
(
  ID char(36) NOT NULL PRIMARY KEY,
  At datetime,
  Name varchar(45),
  Type varchar(30)
);
GO

CREATE TABLE Session
(
  ID int NOT NULL PRIMARY KEY,
  ClientID char(36) NOT NULL,
  At datetime,
  Name varchar(55),
  Description text
);
GO

CREATE TABLE Metadata
(
  ID int NOT NULL PRIMARY KEY,
  SessionID int NOT NULL,
  At datetime,
  AccX int,
  AccY int,
  AccZ int
);
GO