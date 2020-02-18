-- MySQL dump 10.13  Distrib 5.7.29, for Linux (x86_64)
--
-- Host: iam-local    Database: iam
-- ------------------------------------------------------
-- Server version	5.7.29

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

--
-- Current Database: `iam`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `iam` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `iam`;

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
  `description` text,
  `input` varchar(1024) DEFAULT NULL,
  `output` varchar(1024) DEFAULT NULL,
  `exe` varchar(50) DEFAULT NULL,
  `uuid` varchar(64) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `environment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=368 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `executable`
--

LOCK TABLES `executable` WRITE;
/*!40000 ALTER TABLE `executable` DISABLE KEYS */;
INSERT INTO `executable` VALUES (151,'add-exe','INSERT INTO executable(username, uuid, name, data, exe, input, output, description, environment) \nVALUES ({username},{uuid},{name},{data},{exe},{input},{output},{description},{environment})','Add an executable.','{\"username\":\"\", \"uuid\":\"\", \"name\": \"\", \"data\":\"\", \"exe\":\"\", \"input\":\"\", \"output\":\"\", userId: 0, \"environment\":\"\"}',NULL,'query','6b5cad68-e468-42ae-939b-eddd5834cd3f','admin','base'),(152,'get-exe-by-name','SELECT * FROM executable WHERE name={name};','Get executable by name','{\"name\":\"\"}',NULL,'query','78306b13-f569-4720-b2ed-7ba2e95acb90','admin','base'),(153,'get-exe-by-type','SELECT * FROM executable WHERE exe={exe};','Get and executable by type','{\"exe\":\"\"}',NULL,'query','6cb53e34-eb3c-4915-acf4-72c4ee11f852','admin','base'),(161,'add-user','INSERT INTO user (email, password, username) VALUES ({email},{password},{username});\n\nSELECT * from user WHERE username={username};',NULL,'{\"email\":\"\", \"username\":\"\", \"password\":\"\"}',NULL,'query','2b5ed3c0-272b-4a17-a189-f91d4a8caffc','admin','base'),(162,'get-user','SELECT * FROM user WHERE email={email};','Gets a user record by email','{\"email\":\"\"}',NULL,'query','b029a461-ba46-41f8-903e-25cf629917c2','admin','base'),(163,'hash_password','{\"command\":\"python\",\"args\":\"\"}','### Purpose\nTakes in an object with field \'password\' and sha256 hashes it','{\"password\":\"\"}','{\"password\":\"\"}','function','09b9e74b-0347-4e79-8d73-644f21407058','admin','base'),(164,'authenticate_password','{\"command\":\"python\",\"args\":\"\"}','Checks if two passwords are equal','[[{\"password\":\"\"}], {\"password\":\"\"}]',NULL,'function','36b47d5a-989a-4d07-afda-a2b0f1071010','admin','base'),(169,'get-exe-by-type-name','SELECT * FROM executable WHERE exe={exe} AND name={name};','Get an executable by type and name','{\"exe\":\"\",\"name\":\"\"}',NULL,'query','af13753d-51b8-44aa-981f-b4671a7060bc','admin','base'),(173,'get-all-user','SELECT * FROM user;','Get all users','null',NULL,'query','17e212b4-94df-4e09-8d53-c9a43c295cf5','admin','base'),(185,'gen-token','{\"command\":\"python\",\"args\":\"\"}','Generates a random token','{\"user\":{\"id\":\"\"}}',NULL,'function','4dc6d403-cfcc-4dfc-8577-81f381fe72a9','admin','base'),(190,'update-exe','UPDATE executable  SET data={data}, input={input}, output={output}, description={description}, environment={environment} WHERE exe={exe} AND name={name};','Update an executable','{\"data\":\"\",\"input\":\"\",\"output\":\"\",\"exe\":\"\",\"name\":\"\",\"description\":\"\",\"username\":\"\"}',NULL,'query','357078fc-98c1-4fc0-b08b-45e008aa56d5','admin','base'),(193,'delete-exe','DELETE FROM executable WHERE exe={exe} AND name={name};','Deletes an executable by type and name','{\"exe\":\"\",\"name\":\"\"}',NULL,'query','3a5105bf-42bb-45e4-8b44-9b7651fba0ed','admin','base'),(204,'store-token','INSERT INTO session_token(token, userId, username) \nVALUES ({token}, {userId}, {username}); \n\nSELECT {token} AS token, {userId} AS userId, {username} as username;','stores a users token','{\"token\":\"\", \"userId\":\"\"}',NULL,'query','676bb917-3463-4b27-837f-3bac3d96377d','admin','base'),(205,'delete-token','DELETE FROM session_token WHERE token={token};','deletes a token','{\"token\":\"\"}',NULL,'query','fe5f3d91-f702-4f82-8b92-d6af987f8bb5','admin','base'),(206,'map-store-token','{\"command\":\"python\",\"args\":\"\"}','maps results from store token query','[\"any\", [\"any\"]]',NULL,'function','7cf134b3-9581-41d9-932f-f6a73fbeb386','admin','base'),(207,'get-token','SELECT * FROM session_token WHERE token={token};','gets a token record by token','{\"token\":\"\"}',NULL,'query','a69cd6c7-164e-417d-92cd-350f96c72b8a','admin','base'),(208,'validate-token','{\"args\":\"\",\"command\":\"python\"}','checks if a list has more than one value, returns the first element if it does.','[]',NULL,'function','9342d8bc-081f-43bb-a334-3bacdb054253','admin','base'),(210,'gen-token-2','{\"args\":\"\",\"command\":\"python\"}','Generates a token','[any, [{\"userId\":\"\"}]]]',NULL,'function','8244002b-67e8-4cb0-aaf2-fc32db48f715','admin','base'),(219,'get-exe-for-user','SELECT * FROM executable WHERE exe={exe} AND username={username};        ','get executable for user','{\"exe\":\"\", \"userId\": \"\"}',NULL,'query','dceb7598-8f21-49f6-844f-7e62b133a383','admin','base'),(223,'next-date','{\"args\":\"\",\"command\":\"python\"}','Calculates the next date for a given cron expression','{\"cronExpr\": \"*/5 * * * *\"}',NULL,'function','08ffd722-e80a-43e4-b4b1-7e1e78df3970','admin','base'),(225,'queue-job','INSERT INTO job_queue(id, visible, data, jobId) VALUES ({date}, 1, {data}, {jobId});\n\n\n\n\n\n\n','inserts a job into the queue','{\"data\":\"\", \"date\": 0, \"jobId\": 0}',NULL,'query','2db8beb4-940b-4354-9e4e-fc4faa291711','admin','base'),(226,'get-n-jobs','START TRANSACTION;\n\n-- Dequeue the records into a temp table\nCREATE TEMPORARY TABLE `{table}` (\n    SELECT id FROM job_queue \n    WHERE visible=1 \n    AND id <= UNIX_TIMESTAMP()\n    LIMIT {size}\n);\n\n-- Update the visibility\nUPDATE job_queue \nSET visible=0 \nWHERE id IN (SELECT id FROM `{table}`) \nAND visible=1;\n\n-- Select the job rows\nSELECT * \nFROM job_queue \nWHERE id IN (SELECT id FROM `{table}`);\n\nDROP TABLE `{table}`;\n\nCOMMIT;\n\n\n\n\n\n','dequeues {size} jobs from the job queue','{\"table\":\"\",\"size\":0}',NULL,'query','2370de28-7d67-407c-8c32-b3bb2c8ee781','admin','base'),(229,'ack-job','DELETE FROM job_queue WHERE id={id} AND visible = 0;\n\n\n\n\n\n\n\n','acknowledge/deletes a job from the queue','{\"id\": 0}',NULL,'query','f87c0157-b431-4189-9468-7bdaaa96069d','admin','base'),(230,'requeue-job','UPDATE job_queue SET visible=1 WHERE id={id} AND visible = 0;\n\n\n\n\n\n\n\n','makes a job visible again','{\"id\":0}',NULL,'query','3c27a8df-899b-4e09-9a44-d6b19f643909','admin','base'),(259,'enable-job','{\"args\":\"\",\"command\":\"python\"}','enables a job object','{\"data\":{\"enabled\":\"\"}}',NULL,'function','6159135f-dafe-433d-bf3a-80dde7fe7aa7','admin','base'),(270,'search-executable','SELECT name, exe, username FROM executable  WHERE name LIKE {searchText};        ','searches executables by name','{\"searchText\":\"\"}',NULL,'query','63119543-fe40-4c23-bf7f-dec111ecba82','admin','base'),(271,'group-by-type','{\"args\":\"\",\"command\":\"python\"}','groups a list of objects by type','[{\"type\":\"\"}]',NULL,'function','572718d7-46f5-4f77-aaff-9aa9eb66125b','admin','base'),(297,'map-get-n-jobs','{\"args\":\"\",\"command\":\"python\"}','maps results from get-n-jobs query','[]',NULL,'function','978d7849-7598-401b-8bbb-12cb3fbd941f','admin','base'),(298,'get-exe-by-id','SELECT * FROM executable WHERE id={id};\n\n\n\n','gets an executable by id','{\"id\":0}',NULL,'query','f76713b4-0503-46e1-b6c1-5fda749f4685','admin','base'),(307,'disable-job','{\"args\":\"\",\"command\":\"python\"}','disables a job','[{\"data\":{\"enabled\":\"\"}}]',NULL,'function','67edd85a-7df4-4e9f-9b78-486936ebccf6','admin','base'),(322,'search-steplists','SELECT * FROM executable WHERE data LIKE {query}    ','search steplists','{\"query\":\"\"}',NULL,'query','66a0b6e3-bd97-4360-889d-760bcb9b81ad','admin','base'),(334,'add-user','{\"nodes\":[{\"id\":\"1\",\"name\":\"hash_password\",\"exe\":\"function\",\"username\":\"admin\"},{\"id\":\"2\",\"name\":\"add-user\",\"exe\":\"query\",\"username\":\"admin\"},{\"id\":\"3\",\"name\":\"gen-token\",\"exe\":\"function\",\"username\":\"admin\"},{\"id\":\"4\",\"name\":\"store-token\",\"exe\":\"query\",\"username\":\"admin\"},{\"id\":\"5\",\"name\":\"map-store-token\",\"exe\":\"function\",\"username\":\"admin\"}],\"edges\":[{\"source\":\"1\",\"target\":\"2\",\"id\":\"aco7h\"},{\"source\":\"2\",\"target\":\"3\",\"id\":\"ai3c8\"},{\"source\":\"3\",\"target\":\"4\",\"id\":\"a9i32\"},{\"source\":\"4\",\"target\":\"5\",\"id\":\"al8mm\"}]}','','[{\"email\":\"\", \"username\":\"\", \"password\":\"\"}]','','graph','9467756f-3056-42e6-970a-7df21b0ddf51','admin','base'),(335,'authenticate-user','{\"nodes\":[{\"id\":\"1\",\"name\":\"get-user\",\"exe\":\"query\",\"username\":\"admin\"},{\"id\":\"2\",\"name\":\"hash_password\",\"exe\":\"function\",\"username\":\"admin\"},{\"id\":\"3\",\"name\":\"authenticate_password\",\"exe\":\"function\",\"username\":\"admin\"}],\"edges\":[{\"source\":\"1\",\"target\":\"3\"},{\"source\":\"2\",\"target\":\"3\"}]}','','','','graph','c718c8db-4a70-4eaa-ab0e-f0e894c3f80b','admin','base'),(336,'gen-token','{\"nodes\":[{\"id\":\"1\",\"name\":\"get-user\",\"exe\":\"query\",\"username\":\"admin\"},{\"id\":\"2\",\"name\":\"hash_password\",\"exe\":\"function\",\"username\":\"admin\"},{\"id\":\"3\",\"name\":\"authenticate_password\",\"exe\":\"function\",\"username\":\"admin\"},{\"id\":\"4\",\"name\":\"gen-token\",\"exe\":\"function\",\"username\":\"admin\"},{\"id\":\"5\",\"name\":\"store-token\",\"exe\":\"query\",\"username\":\"admin\"},{\"id\":\"6\",\"name\":\"map-store-token\",\"exe\":\"function\",\"username\":\"admin\"}],\"edges\":[{\"source\":\"1\",\"target\":\"3\"},{\"source\":\"2\",\"target\":\"3\"},{\"source\":\"3\",\"target\":\"4\"},{\"source\":\"4\",\"target\":\"5\"},{\"source\":\"5\",\"target\":\"6\"}]}','','','','graph','1704a696-db7d-44a3-a4d8-d47f4372c3a6','admin','base'),(337,'validate-token','{\"nodes\":[{\"id\":\"1\",\"name\":\"get-token\",\"exe\":\"query\",\"username\":\"admin\"},{\"id\":\"2\",\"name\":\"validate-token\",\"exe\":\"function\",\"username\":\"admin\"}],\"edges\":[{\"source\":\"1\",\"target\":\"2\"}]}','','','','graph','c5347c70-88c8-4b14-aa62-b99ac18802e8','admin','base'),(338,'gen-token-2','{\"nodes\":[{\"id\":\"1\",\"exe\":\"function\",\"name\":\"gen-token\",\"username\":\"admin\"},{\"id\":\"2\",\"exe\":\"query\",\"name\":\"store-token\",\"username\":\"admin\"},{\"id\":\"3\",\"exe\":\"function\",\"name\":\"map-store-token\",\"username\":\"admin\"}],\"edges\":[{\"source\":\"1\",\"target\":\"2\"},{\"source\":\"2\",\"target\":\"3\"}]}','','','','graph','1e813fa2-6fe3-4961-8d98-335f90052dba','admin','base'),(347,'get-exe-environment','select data from executable where exe=\'environment\' and name=(select environment from executable where name={name} and username={username} and exe={exe})','','','','query','6a43d622-ad31-40ca-b2f2-0054d64305e5','admin','base'),(348,'base','{\"host\":\"base.default\",\"port\":\"80\",\"imageRepo\":\"icanplayguitar94/iam\",\"replicas\":\"1\",\"memory\":\"500Mi\",\"cpu\":\"500m\",\"type\":\"executor\"}','Base environment for all other environments','{\"tag\":\"icanplayguitar94/iam:base-environments\"}','','environment','68ce63d7-6db7-4ec1-b0a7-d1f29a42be31','admin','environment-builder'),(349,'build-environment','{\"command\":\"bash\",\"args\":\"{tag} {image}\"}','This is a python program. I require input from stdin and I write my output to stdout.','{\"tag\":\"\",\"image\":\"\"}','','function','043bd8b0-1e57-4dd4-943f-b9ca97df51d2','admin','environment-builder'),(350,'environment-builder','{\"host\":\"environment-builder.default\",\"port\":\"80\",\"imageRepo\":\"icanplayguitar94/iam\",\"replicas\":\"1\",\"memory\":\"500Mi\",\"cpu\":\"500m\",\"type\":\"executor\"}','This is an environment.','{\"tag\":\"icanplayguitar94/iam:environment-builder\"}','','environment','5f5ee2a9-c675-4f3e-8ab8-44bc9c9a053d','admin','environment-builder'),(351,'python','{\"host\":\"python.default\",\"port\":\"80\",\"imageRepo\":\"icanplayguitar94/iam\",\"replicas\":\"1\",\"memory\":\"500Mi\",\"cpu\":\"500m\",\"type\":\"executor\"}','This is an environment.','{\"tag\":\"icanplayguitar94/iam:python\"}','','environment','03eeedea-40a3-4a96-a83e-f869f392aad8','admin','environment-builder'),(352,'restore-filesystem','{\"command\":\"python\",\"args\":\"\"}','This is a python program. I require input from stdin and I write my output to stdout.','{\"filesystem\":\"iam-filesystem\"}','string','function','6e3b64f0-21d4-4a41-80e3-d7ee9b290414','admin','aws'),(353,'backup-filesystem','{\"command\":\"python\",\"args\":\"\"}','This is a python program. I require input from stdin and I write my output to stdout.','{\"filesystem\":\"\", \"bucket\":\"\"}','','function','4a431eea-5095-4705-a312-47f41323e251','admin','aws'),(354,'aws','{\"host\":\"aws.default\",\"port\":\"80\",\"imageRepo\":\"icanplayguitar94/iam\",\"replicas\":\"1\",\"memory\":\"500Mi\",\"cpu\":\"500m\",\"type\":\"executor\"}','This is an environment.','{\"tag\":\"icanplayguitar94/iam:aws\"}','','environment','23390a65-c3f6-4e72-ae2f-d54f134ecae5','admin','environment-builder'),(355,'kubectl-ep','{\"command\":\"bash\",\"args\":\"{svc}\"}','This is a python program. I require input from stdin and I write my output to stdout.','{\"svc\":\"\"}','','function','56817fd6-2d25-4a8f-b6ed-d7fd550bd834','admin','environment-builder'),(356,'get-svc-endpoints','{\"command\":\"python\",\"args\":\"\"}','This is a python program. I require input from stdin and I write my output to stdout.','{\"svc\":\"\"}','{\"endpoints\":\"\"}','function','102715d1-fed5-443a-888d-630bc1493d03','admin','python'),(357,'get-env-functions','select name from executable where exe=\"function\" and environment={environment}','This is a mysql query. These are used to get data or save data.','{\"environment\":\"\"}','','query','09e82aa5-4540-47cf-89ac-223ba3dc4cc5','admin','base'),(358,'update-env-programs','{\"command\":\"python\",\"args\":\"\"}','This is a python program. I require input from stdin and I write my output to stdout.','','','function','98c8e4b4-2818-47a9-a3ad-0bfcf1de295d','admin','python'),(359,'update-env-programs','{\"nodes\":[{\"id\":\"1\",\"name\":\"get-svc-endpoints\",\"exe\":\"function\",\"username\":\"admin\"},{\"id\":\"2\",\"name\":\"get-env-functions\",\"exe\":\"query\",\"username\":\"admin\"},{\"id\":\"3\",\"name\":\"update-env-programs\",\"exe\":\"function\",\"username\":\"admin\"}],\"edges\":[{\"source\":\"1\",\"target\":\"3\"},{\"source\":\"2\",\"target\":\"3\"}]}','','[{\"svc\":\"\"},{\"environment\":\"\"}]','','graph','74ca1c85-5529-4956-a480-2971ecafd8f4','admin','base'),(360,'pass','{\"command\":\"python\",\"args\":\"\"}','This is a python program. I require input from stdin and I write my output to stdout.','','','function','8e707414-9e4b-4013-acf0-c368f6d67649','admin','python'),(361,'update-env-program','{\"nodes\":[{\"id\":\"1\",\"name\":\"get-svc-endpoints\",\"exe\":\"function\",\"username\":\"admin\"},{\"id\":\"2\",\"name\":\"pass\",\"exe\":\"function\",\"username\":\"admin\"},{\"id\":\"3\",\"name\":\"update-env-programs\",\"exe\":\"function\",\"username\":\"admin\"}],\"edges\":[{\"source\":\"1\",\"target\":\"3\"},{\"source\":\"2\",\"target\":\"3\"}]}','','[{\"svc\":\"\"},[{\"name\":\"\"}]]','','graph','cd2e5a6b-4823-4236-a2fb-47efde822b19','admin','base'),(362,'get-env-pools','select * from executable where exe=\"pool\" and environment={environment};','This is a mysql query. These are used to get data or save data.','{\"environment\":\"\"}','','query','9b42dd94-a4e7-48f7-8a1c-405d303e2834','admin','base'),(363,'download-file','{\"command\":\"python\",\"args\":\"\"}','This is a python program. I require input from stdin and I write my output to stdout.','{\"host\":\"example\", \"path\":\"\", \"dest\":\"\"}','','function','7472c7b3-4c71-4ddf-8957-ef67ab0188bd','admin','base'),(364,'pool1','{\"username\":\"admin\",\"exe\":\"function\",\"name\":\"hash_password\",\"poolSize\":\"2\"}','This is pool.','','','pool','c0b5b435-a712-4ee0-a9ee-b252c8646b5f','admin','base'),(365,'update-env-pool','{\"nodes\":[{\"id\":\"1\",\"name\":\"get-svc-endpoints\",\"exe\":\"function\",\"username\":\"admin\"},{\"id\":\"2\",\"name\":\"pass\",\"exe\":\"function\",\"username\":\"admin\"},{\"id\":\"3\",\"name\":\"run-env-pool\",\"exe\":\"function\",\"username\":\"admin\"}],\"edges\":[{\"source\":\"1\",\"target\":\"3\"},{\"source\":\"2\",\"target\":\"3\"}]}','','[{\"svc\":\"\"},{\"username\":\"\", \"name\":\"\"}]','','graph','da19c962-b9e8-427e-94a5-4c00dee43897','admin','base'),(366,'run-env-pool','{\"command\":\"python\",\"args\":\"\"}','This is a python program. I require input from stdin and I write my output to stdout.','{\"value\":\"example\"}','{\"value\":\"example\"}','function','e54ec9bc-e0bd-4c10-839c-4933a73d0dd0','admin','python'),(367,'kubectl-apply','{\"command\":\"bash\",\"args\":\"{file}\"}','This is a python program. I require input from stdin and I write my output to stdout.','{\"file\":\"\"}','','function','49bc44a2-44db-4f2e-84d7-3a1c08249df3','admin','environment-builder');
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
-- Dumping data for table `job_queue`
--

LOCK TABLES `job_queue` WRITE;
/*!40000 ALTER TABLE `job_queue` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_queue` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `session_token`
--

LOCK TABLES `session_token` WRITE;
/*!40000 ALTER TABLE `session_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `session_token` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-02-17 20:34:38
-- Create Users
CREATE USER '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';
GRANT SELECT ON `$MYSQL_DATABASE`.* TO '$MYSQL_USER'@'%';
GRANT UPDATE ON `$MYSQL_DATABASE`.* TO '$MYSQL_USER'@'%';
GRANT DELETE ON `$MYSQL_DATABASE`.* TO '$MYSQL_USER'@'%';
GRANT INSERT ON `$MYSQL_DATABASE`.* TO '$MYSQL_USER'@'%';
GRANT CREATE ON `$MYSQL_DATABASE`.* TO '$MYSQL_USER'@'%';
