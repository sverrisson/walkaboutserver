-- Walkabout Tables

CREATE TABLE Client
(
  ID char(36) NOT NULL PRIMARY KEY,
  At datetime NOT NULL,
  Name varchar(50) NOT NULL,
  Type varchar(50) NOT NULL,
  SystemVersion VARCHAR(30)
);
GO

CREATE TABLE MSession
(
  ID int NOT NULL PRIMARY KEY,
  ClientID char(36) NOT NULL,
  At datetime NOT NULL,
  Name varchar(100),
  Description text,
  FOREIGN KEY (ClientID) REFERENCES Client(ID)
);
GO

CREATE TABLE Metadata
(
  ID int NOT NULL PRIMARY KEY,
  SessionID int NOT NULL,
  At datetime NOT NULL,
  AccX int NOT NULL,
  AccY int NOT NULL,
  AccZ int NOT NULL,
  FOREIGN KEY (SessionID) REFERENCES MSession(ID)
);
GO

