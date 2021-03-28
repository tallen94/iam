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
-- Table structure for table `authorization_visibility`
--

DROP TABLE IF EXISTS `authorization_visibility`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `authorization_visibility` (
  `resource_from` varchar(50) NOT NULL,
  `resource_to` varchar(255) NOT NULL,
  `visibility` varchar(10) NOT NULL,
  KEY `get_idx` (`resource_from`,`resource_to`),
  KEY `resource_to` (`resource_to`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `authorization_privileges`
--

DROP TABLE IF EXISTS `authorization_privilege`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `authorization_privilege` (
  `resource_from` varchar(50) NOT NULL,
  `resource_to` varchar(255) NOT NULL,
  `privilege` varchar(10) NOT NULL,
  KEY `get_idx` (`resource_from`,`resource_to`),
  KEY `resource_to` (`resource_to`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cluster`
--

DROP TABLE IF EXISTS `cluster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cluster` (
  `name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `description` varchar(1024) NOT NULL,
  KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `environment`
--

DROP TABLE IF EXISTS `environment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `environment` (
  `name` varchar(255) NOT NULL,
  `description` text,
  `username` varchar(50) NOT NULL,
  `cluster` varchar(255) NOT NULL,
  `data` varchar(1024) NOT NULL,
  `state` varchar(10) NOT NULL,
  KEY `get_idx` (`name`, `username`, `cluster`),
  KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `dataset`
--

DROP TABLE IF EXISTS `dataset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dataset` (
  `name` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `cluster` varchar(50) NOT NULL,
  `environment` varchar(50) NOT NULL,
  `executable` text NOT NULL,
  `tag` text NOT NULL,
  `description` varchar(1024) NOT NULL,
  KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `image`
--

DROP TABLE IF EXISTS `image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `image` (
  `username` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `imageRepo` varchar(255) NOT NULL,
  `imageTag` varchar(1024) NOT NULL,
  `state` varchar(50) NOT NULL,
  KEY `get_idx` (`name`, `username`),
  KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `executable`
--

DROP TABLE IF EXISTS `executable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `executable` (
  `name` varchar(255) NOT NULL,
  `data` varchar(1024) NOT NULL,
  `description` text,
  `input` varchar(1024) DEFAULT NULL,
  `output` varchar(1024) DEFAULT NULL,
  `exe` varchar(50) NOT NULL,
  `uuid` varchar(64) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `environment` varchar(255) NOT NULL,
  `cluster` varchar(255) NOT NULL,
  `visibility` varchar(10) DEFAULT NULL,
  KEY `get_idx` (`name`, `username`, `exe`),
  KEY `username` (`username`, `exe`)
) ENGINE=InnoDB AUTO_INCREMENT=372 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `job`
--

DROP TABLE IF EXISTS `job`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job` (
  `name` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `description` text,
  `enabled` boolean NOT NULL,
  `schedule` varchar(50) NOT NULL,
  `executable` text NOT NULL,
  `jobData` text,
  KEY `k1` (`username`),
  UNIQUE KEY `k2` (`name`, `username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `job_run`
--

DROP TABLE IF EXISTS `job_run`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_run` (
  `username` varchar(50) NOT NULL,
  `cluster` varchar(255) NOT NULL,
  `environment` varchar(255) NOT NULL,
  `exe` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `uid` varchar(64) NOT NULL,
  `status` varchar(10) NOT NULL,
  `createdOn` datetime(3) NOT NULL,
  `updatedOn` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `route`
--

DROP TABLE IF EXISTS `route`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `route` (
  `username` varchar(50) NOT NULL,
  `cluster` varchar(50) NOT NULL,
  `environment` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `exe` varchar(50) NOT NULL,
  `route` varchar(50) NOT NULL,
  KEY `username` (`username`,`name`,`exe`,`cluster`,`environment`),
  KEY `username_2` (`username`,`exe`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `username` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `username_2` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_password`
--

DROP TABLE IF EXISTS `user_password`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_password` (
  `username` varchar(100) NOT NULL,
  `passwordHash` varchar(1024) NOT NULL,
  `salt` varchar(20) NOT NULL,
  KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_session`
--

DROP TABLE IF EXISTS `user_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_session` (
  `username` varchar(100) NOT NULL,
  `token` varchar(64) NOT NULL,
  KEY `token` (`token`),
  KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_token`
--

DROP TABLE IF EXISTS `user_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_token` (
  `username` varchar(100) NOT NULL,
  `tokenId` varchar(50) NOT NULL,
  `tokenSecretHash` varchar(1024) NOT NULL,
  `tokenSalt` varchar(20) NOT NULL,
  KEY `tokenId` (`tokenId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `secret`
--

DROP TABLE IF EXISTS `secret`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `secret` (
  `name` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `description` text,
  KEY `k1` (`name`, `username`),
  KEY `k2` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `migration_version`
--

DROP TABLE IF EXISTS `migration_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migration_version` (
  `version` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

INSERT INTO migration_version(`version`) VALUES (0);

CREATE USER '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';
GRANT SELECT ON `$MYSQL_DATABASE`.* TO '$MYSQL_USER'@'%';
GRANT UPDATE ON `$MYSQL_DATABASE`.* TO '$MYSQL_USER'@'%';
GRANT DELETE ON `$MYSQL_DATABASE`.* TO '$MYSQL_USER'@'%';
GRANT INSERT ON `$MYSQL_DATABASE`.* TO '$MYSQL_USER'@'%';
GRANT CREATE ON `$MYSQL_DATABASE`.* TO '$MYSQL_USER'@'%';

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-13 13:33:10
