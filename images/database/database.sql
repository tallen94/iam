CREATE DATABASE  IF NOT EXISTS `iam` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `iam`;
-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: iam-local    Database: iam
-- ------------------------------------------------------
-- Server version	5.7.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Create Users
CREATE USER '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';
GRANT SELECT ON `$MYSQL_DATABASE`.* TO '$MYSQL_USER'@'%';
GRANT UPDATE ON `$MYSQL_DATABASE`.* TO '$MYSQL_USER'@'%';
GRANT DELETE ON `$MYSQL_DATABASE`.* TO '$MYSQL_USER'@'%';
GRANT INSERT ON `$MYSQL_DATABASE`.* TO '$MYSQL_USER'@'%';


--
-- Table structure for table `executable`
--

DROP TABLE IF EXISTS `executable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `executable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `data` varchar(1024) NOT NULL,
  `userId` int(11) NOT NULL,
  `description` text,
  `input` varchar(1024) DEFAULT NULL,
  `output` varchar(1024) DEFAULT NULL,
  `exe` varchar(50) DEFAULT NULL,
  `uuid` varchar(64) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=339 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `executable`
--

LOCK TABLES `executable` WRITE;
/*!40000 ALTER TABLE `executable` DISABLE KEYS */;
INSERT INTO `executable` VALUES (151,'add-exe','INSERT INTO executable(username, uuid, name, data, exe, input, output, userId, description)  \nVALUES ({username},{uuid},{name},{data},{exe},{input},{output},{userId},{description});',12,'Add an executable.','{\"username\":\"\", \"uuid\":\"\", \"name\": \"\", \"data\":\"\", \"exe\":\"\", \"input\":\"\", \"output\":\"\", userId: 0}',NULL,'query','6b5cad68-e468-42ae-939b-eddd5834cd3f','admin'),(152,'get-exe-by-name','SELECT * FROM executable WHERE name={name};',12,'Get executable by name','{\"name\":\"\"}',NULL,'query','78306b13-f569-4720-b2ed-7ba2e95acb90','admin'),(153,'get-exe-by-type','SELECT * FROM executable WHERE exe={exe};',12,'Get and executable by type','{\"exe\":\"\"}',NULL,'query','6cb53e34-eb3c-4915-acf4-72c4ee11f852','admin'),(161,'add-user','INSERT INTO user (email, password, username) VALUES ({email},{password},{username});\n\nSELECT {token} AS token, {userId} AS userId, {username} as username;',12,NULL,'{\"email\":\"\", \"username\":\"\", \"password\":\"\"}',NULL,'query','2b5ed3c0-272b-4a17-a189-f91d4a8caffc','admin'),(162,'get-user','SELECT * FROM user WHERE email={email};',12,'Gets a user record by email','{\"email\":\"\"}',NULL,'query','b029a461-ba46-41f8-903e-25cf629917c2','admin'),(163,'hash_password','{\"command\":\"python\",\"args\":\"\"}',12,'### Purpose\nTakes in an object with field \'password\' and sha256 hashes it','{\"password\":\"\"}','{\"password\":\"\"}','function','09b9e74b-0347-4e79-8d73-644f21407058','admin'),(164,'authenticate_password','{\"command\":\"python\",\"args\":\"\"}',12,'Checks if two passwords are equal','[[{\"password\":\"\"}], {\"password\":\"\"}]',NULL,'function','36b47d5a-989a-4d07-afda-a2b0f1071010','admin'),(169,'get-exe-by-type-name','SELECT * FROM executable WHERE exe={exe} AND name={name};',12,'Get an executable by type and name','{\"exe\":\"\",\"name\":\"\"}',NULL,'query','af13753d-51b8-44aa-981f-b4671a7060bc','admin'),(173,'get-all-user','SELECT * FROM user;',12,'Get all users','null',NULL,'query','17e212b4-94df-4e09-8d53-c9a43c295cf5','admin'),(175,'add-user','[{\"exe\":\"function\",\"name\":\"hash_password\"},{\"exe\":\"query\",\"name\":\"add-user\"},{\"exe\":\"pipe\",\"name\":\"gen-token-2\",\"steps\":[{\"exe\":\"function\",\"name\":\"gen-token\"},{\"exe\":\"query\",\"name\":\"store-token\"},{\"exe\":\"function\",\"name\":\"map-store-token\"}]}]',12,'Adds a new user with email and password','{\"email\":\"\", \"username\":\"\", \"password\":\"\"}','{}','pipe','3dcdd196-011e-463e-a103-5709c8326beb','admin'),(178,'authenticate-user','[{\"name\":\"get-user-hash-password\",\"steps\":[{\"name\":\"get-user\",\"exe\":\"query\",\"username\":\"admin\"},{\"name\":\"hash_password\",\"exe\":\"function\",\"username\":\"admin\"}],\"exe\":\"async\",\"username\":\"admin\"},{\"name\":\"authenticate_password\",\"exe\":\"function\",\"username\":\"admin\"}]',12,'Authenticates a user','[{\"email\":\"\"},{\"password\":\"\"}]',NULL,'pipe','2a77cb89-7576-479e-885a-dd2088a50e10','admin'),(185,'gen-token','{\"command\":\"python\",\"args\":\"\"}',12,'Generates a random token','{\"user\":{\"id\":\"\"}}',NULL,'function','4dc6d403-cfcc-4dfc-8577-81f381fe72a9','admin'),(186,'gen-token','[{\"name\":\"authenticate-user\",\"exe\":\"pipe\",\"username\":\"admin\"},{\"name\":\"gen-token\",\"exe\":\"function\",\"username\":\"admin\"},{\"name\":\"store-token\",\"exe\":\"query\",\"username\":\"admin\"},{\"name\":\"map-store-token\",\"exe\":\"function\",\"username\":\"admin\"}]',12,'Generates a user token provided valid credentials','[{\"email\":\"\"},{\"password\":\"\"}]',NULL,'pipe','9bebc864-38e2-4479-9ab8-eb66d1a1cfad','admin'),(190,'update-exe','UPDATE executable  SET data={data}, input={input}, output={output}, description={description} WHERE exe={exe} AND name={name};',12,'Update an executable','{\"data\":\"\",\"input\":\"\",\"output\":\"\",\"exe\":\"\",\"name\":\"\",\"description\":\"\"}',NULL,'query','357078fc-98c1-4fc0-b08b-45e008aa56d5','admin'),(193,'delete-exe','DELETE FROM executable WHERE exe={exe} AND name={name};',12,'Deletes an executable by type and name','{\"exe\":\"\",\"name\":\"\"}',NULL,'query','3a5105bf-42bb-45e4-8b44-9b7651fba0ed','admin'),(204,'store-token','INSERT INTO session_token(token, userId, username) \nVALUES ({token}, {userId}, {username}); \n\nSELECT {token} AS token, {userId} AS userId, {username} as username;',12,'stores a users token','{\"token\":\"\", \"userId\":\"\"}',NULL,'query','676bb917-3463-4b27-837f-3bac3d96377d','admin'),(205,'delete-token','DELETE FROM session_token WHERE token={token};',12,'deletes a token','{\"token\":\"\"}',NULL,'query','fe5f3d91-f702-4f82-8b92-d6af987f8bb5','admin'),(206,'map-store-token','{\"args\":\"\",\"command\":\"python\"}',12,'maps results from store token query','[\"any\", [\"any\"]]',NULL,'function','7cf134b3-9581-41d9-932f-f6a73fbeb386','admin'),(207,'get-token','SELECT * FROM session_token WHERE token={token};',12,'gets a token record by token','{\"token\":\"\"}',NULL,'query','a69cd6c7-164e-417d-92cd-350f96c72b8a','admin'),(208,'validate-token','{\"args\":\"\",\"command\":\"python\"}',12,'checks if a list has more than one value, returns the first element if it does.','[]',NULL,'function','9342d8bc-081f-43bb-a334-3bacdb054253','admin'),(209,'validate-token','[{\"name\":\"get-token\",\"exe\":\"query\",\"username\":\"admin\"},{\"name\":\"validate-token\",\"exe\":\"function\",\"username\":\"admin\"}]',12,'Checks if a token is valid','{\"token\":\"\"}',NULL,'pipe','a60dcd25-519e-449d-aeb1-9fa1dd38e9c5','admin'),(210,'gen-token-2','{\"args\":\"\",\"command\":\"python\"}',12,'Generates a token','[any, [{\"userId\":\"\"}]]]',NULL,'function','8244002b-67e8-4cb0-aaf2-fc32db48f715','admin'),(211,'gen-token-2','[{\"exe\":\"function\",\"name\":\"gen-token\",\"username\":\"admin\"},{\"exe\":\"query\",\"name\":\"store-token\",\"username\":\"admin\"},{\"exe\":\"function\",\"name\":\"map-store-token\",\"username\":\"admin\"}]',12,NULL,'{\"user\":{\"id\":\"\"}}',NULL,'pipe','a8274cdd-8f1a-4d1c-8213-36f4aa461d7f','admin'),(219,'get-exe-for-user','SELECT * FROM executable WHERE exe={exe} AND userId={userId};        ',12,'get executable for user','{\"exe\":\"\", \"userId\": \"\"}',NULL,'query','dceb7598-8f21-49f6-844f-7e62b133a383','admin'),(223,'next-date','{\"args\":\"\",\"command\":\"python\"}',12,'Calculates the next date for a given cron expression','{\"cronExpr\": \"*/5 * * * *\"}',NULL,'function','08ffd722-e80a-43e4-b4b1-7e1e78df3970','admin'),(225,'queue-job','INSERT INTO job_queue(id, visible, data, jobId) VALUES ({date}, 1, {data}, {jobId});\n\n\n\n\n\n\n',12,'inserts a job into the queue','{\"data\":\"\", \"date\": 0, \"jobId\": 0}',NULL,'query','2db8beb4-940b-4354-9e4e-fc4faa291711','admin'),(226,'get-n-jobs','START TRANSACTION;\n\n-- Dequeue the records into a temp table\nCREATE TEMPORARY TABLE `{table}` (\n    SELECT id FROM job_queue \n    WHERE visible=1 \n    AND id <= UNIX_TIMESTAMP()\n    LIMIT {size}\n);\n\n-- Update the visibility\nUPDATE job_queue \nSET visible=0 \nWHERE id IN (SELECT id FROM `{table}`) \nAND visible=1;\n\n-- Select the job rows\nSELECT * \nFROM job_queue \nWHERE id IN (SELECT id FROM `{table}`);\n\nDROP TABLE `{table}`;\n\nCOMMIT;\n\n\n\n\n\n',12,'dequeues {size} jobs from the job queue','{\"table\":\"\",\"size\":0}',NULL,'query','2370de28-7d67-407c-8c32-b3bb2c8ee781','admin'),(229,'ack-job','DELETE FROM job_queue WHERE id={id} AND visible = 0;\n\n\n\n\n\n\n\n',12,'acknowledge/deletes a job from the queue','{\"id\": 0}',NULL,'query','f87c0157-b431-4189-9468-7bdaaa96069d','admin'),(230,'requeue-job','UPDATE job_queue SET visible=1 WHERE id={id} AND visible = 0;\n\n\n\n\n\n\n\n',12,'makes a job visible again','{\"id\":0}',NULL,'query','3c27a8df-899b-4e09-9a44-d6b19f643909','admin'),(259,'enable-job','{\"args\":\"\",\"command\":\"python\"}',12,'enables a job object','{\"data\":{\"enabled\":\"\"}}',NULL,'function','6159135f-dafe-433d-bf3a-80dde7fe7aa7','admin'),(260,'enable-job','[{\"name\":\"get-exe-by-type-name\",\"exe\":\"query\",\"username\":\"admin\"},{\"name\":\"unescape-data\",\"exe\":\"function\",\"username\":\"admin\"},{\"name\":\"enable-job\",\"exe\":\"function\",\"username\":\"admin\"},{\"name\":\"update-exe\",\"exe\":\"query\",\"username\":\"admin\"}]',12,'Enables a job','{\"name\":\"\",\"type\":\"JOB\"}',NULL,'pipe','10345a38-e7d1-40c7-a462-e46f51417f46','admin'),(263,'clone2','{\"args\":\"{root} {host} {dest} {user}\",\"command\":\"python\"}',12,'clone to another host. must have ssh access...','{\"host\":\"\", \"dest\":\"\", \"user\":\"\"}',NULL,'function','982b1dca-eeb5-4589-b246-ada6ce6a1fe2','admin'),(270,'search-executable','SELECT * FROM executable  WHERE name LIKE {searchText} AND userId <> 12;        ',12,'searches executables by name','{\"searchText\":\"\"}',NULL,'query','63119543-fe40-4c23-bf7f-dec111ecba82','admin'),(271,'group-by-type','{\"args\":\"\",\"command\":\"python\"}',12,'groups a list of objects by type','[{\"type\":\"\"}]',NULL,'function','572718d7-46f5-4f77-aaff-9aa9eb66125b','admin'),(296,'dequeue-jobs','[{\"name\":\"get-n-jobs\",\"exe\":\"query\",\"username\":\"admin\"},{\"name\":\"map-get-n-jobs\",\"exe\":\"function\",\"username\":\"admin\"}]',12,'pulls jobs off the queue','{\"table\":\"\",\"size\":0}',NULL,'pipe','4d4b0ebc-4ee1-491e-9d28-3268f5d19b05','admin'),(297,'map-get-n-jobs','{\"args\":\"\",\"command\":\"python\"}',12,'maps results from get-n-jobs query','[]',NULL,'function','978d7849-7598-401b-8bbb-12cb3fbd941f','admin'),(298,'get-exe-by-id','SELECT * FROM executable WHERE id={id};\n\n\n\n',12,'gets an executable by id','{\"id\":0}',NULL,'query','f76713b4-0503-46e1-b6c1-5fda749f4685','admin'),(303,'unescape-data','{\"args\":\"\",\"command\":\"python\"}',12,'unescapes a field called data on the first object in a list','[{\"data\":\"\"}]',NULL,'function','5fd1cbc8-0a32-45f0-9985-6f6ddc0edc40','admin'),(304,'test','{\"args\":\"\",\"command\":\"python\"}',12,'prints hello','',NULL,'function','d8145ca5-c140-4321-a4be-c64f9122ff68','admin'),(307,'disable-job','{\"args\":\"\",\"command\":\"python\"}',12,'disables a job','[{\"data\":{\"enabled\":\"\"}}]',NULL,'function','67edd85a-7df4-4e9f-9b78-486936ebccf6','admin'),(308,'disable-job','[{\"name\":\"get-exe-by-type-name\",\"exe\":\"query\",\"username\":\"admin\"},{\"name\":\"unescape-data\",\"exe\":\"function\",\"username\":\"admin\"},{\"name\":\"disable-job\",\"exe\":\"function\",\"username\":\"admin\"},{\"name\":\"update-exe\",\"exe\":\"query\",\"username\":\"admin\"}]',12,'disables a job','{\"name\":\"\",\"type\":\"JOB\"}',NULL,'pipe','6c982f50-8c78-4e5a-834c-ba0cc1566f7c','admin'),(322,'search-steplists','SELECT * FROM executable WHERE data LIKE {query}    ',12,'search steplists','{\"query\":\"\"}',NULL,'query','66a0b6e3-bd97-4360-889d-760bcb9b81ad','admin'),(328,'new-program','{\"command\":\"python\",\"args\":\"\"}',12,'This is a python program','{\"value\":\"example\"}','{\"example\":\"value\"}','function',NULL,'admin'),(334,'add-user','{\"nodes\":[{\"id\":\"1\",\"exe\":\"function\",\"name\":\"hash_password\"},{\"id\":\"2\",\"exe\":\"query\",\"name\":\"add-user\"},{\"id\":\"3\",\"exe\":\"function\",\"name\":\"gen-token\"},{\"id\":\"4\",\"exe\":\"query\",\"name\":\"store-token\"},{\"id\":\"5\",\"exe\":\"function\",\"name\":\"map-store-token\"}],\"edges\":[{\"source\":\"1\",\"target\":\"2\"},{\"source\":\"2\",\"target\":\"3\"},{\"source\":\"3\",\"target\":\"4\"},{\"source\":\"4\",\"target\":\"5\"}]}',12,'','','','graph','9467756f-3056-42e6-970a-7df21b0ddf51','admin'),(335,'authenticate-user','{\"nodes\":[{\"id\":\"1\",\"name\":\"get-user\",\"exe\":\"query\",\"username\":\"admin\"},{\"id\":\"2\",\"name\":\"hash_password\",\"exe\":\"function\",\"username\":\"admin\"},{\"id\":\"3\",\"name\":\"authenticate_password\",\"exe\":\"function\",\"username\":\"admin\"}],\"edges\":[{\"source\":\"1\",\"target\":\"3\"},{\"source\":\"2\",\"target\":\"3\"}]}',12,'','','','graph','c718c8db-4a70-4eaa-ab0e-f0e894c3f80b','admin'),(336,'gen-token','{\"nodes\":[{\"id\":\"1\",\"name\":\"get-user\",\"exe\":\"query\",\"username\":\"admin\"},{\"id\":\"2\",\"name\":\"hash_password\",\"exe\":\"function\",\"username\":\"admin\"},{\"id\":\"3\",\"name\":\"authenticate_password\",\"exe\":\"function\",\"username\":\"admin\"},{\"id\":\"4\",\"name\":\"gen-token\",\"exe\":\"function\",\"username\":\"admin\"},{\"id\":\"5\",\"name\":\"store-token\",\"exe\":\"query\",\"username\":\"admin\"},{\"id\":\"6\",\"name\":\"map-store-token\",\"exe\":\"function\",\"username\":\"admin\"}],\"edges\":[{\"source\":\"1\",\"target\":\"3\"},{\"source\":\"2\",\"target\":\"3\"},{\"source\":\"3\",\"target\":\"4\"},{\"source\":\"4\",\"target\":\"5\"},{\"source\":\"5\",\"target\":\"6\"}]}',12,'','','','graph','1704a696-db7d-44a3-a4d8-d47f4372c3a6','admin'),(337,'validate-token','{\"nodes\":[{\"id\":\"1\",\"name\":\"get-token\",\"exe\":\"query\",\"username\":\"admin\"},{\"id\":\"2\",\"name\":\"validate-token\",\"exe\":\"function\",\"username\":\"admin\"}],\"edges\":[{\"source\":\"1\",\"target\":\"2\"}]}',12,'','','','graph','c5347c70-88c8-4b14-aa62-b99ac18802e8','admin'),(338,'gen-token-2','{\"nodes\":[{\"id\":\"1\",\"exe\":\"function\",\"name\":\"gen-token\",\"username\":\"admin\"},{\"id\":\"2\",\"exe\":\"query\",\"name\":\"store-token\",\"username\":\"admin\"},{\"id\":\"3\",\"exe\":\"function\",\"name\":\"map-store-token\",\"username\":\"admin\"}],\"edges\":[{\"source\":\"1\",\"target\":\"2\"},{\"source\":\"2\",\"target\":\"3\"}]}',12,'','','','graph','1e813fa2-6fe3-4961-8d98-335f90052dba','admin');
/*!40000 ALTER TABLE `executable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_queue`
--

DROP TABLE IF EXISTS `job_queue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_queue` (
  `id` bigint(20) NOT NULL,
  `visible` int(11) NOT NULL,
  `data` varchar(1024) DEFAULT NULL,
  `jobId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `jobId` (`jobId`),
  CONSTRAINT `job_queue_ibfk_1` FOREIGN KEY (`jobId`) REFERENCES `executable` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `session_token`
--

DROP TABLE IF EXISTS `session_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `session_token` (
  `token` varchar(64) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(500) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-11-10 21:27:46
