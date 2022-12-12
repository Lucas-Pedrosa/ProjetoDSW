CREATE DATABASE  IF NOT EXISTS `liber` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `liber`;
-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: liber
-- ------------------------------------------------------
-- Server version	8.0.31-0ubuntu0.20.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `bookid` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `author` varchar(100) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `link` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`bookid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (3,'É assim que acaba','Colleen Hoover','Lily, uma jovem que se mudou de uma cidadezinha do Maine para Boston, se formou em marketing e abriu a própria floricultura.','/images/assim-que-acaba.jpg'),(4,'O homem mais rico da Babilônia','George S Clason','O homem mais rico da Babilônia é um clássico sobre como multiplicar riqueza e solucionar problemas financeiros.','/images/homem-mais-rico.jpg'),(5,'A revolução dos bichos: Um conto de fadas','George Orwell','Narra a insurreição dos animais de uma granja contra seus donos. Progressivamente, porém, a revolução degenera numa tirania ainda mais opressiva que a dos humanos.','/images/revolucao-dos-bichos.jpg'),(6,'A Biblioteca da Meia-Noite','Matt Haig','Arrependida das escolhas que fez no passado, Nora Seed vive se perguntando o que poderia ter acontecido caso tivesse vivido de maneira diferente.','/images/biblioteca.jpg');
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `followers`
--

DROP TABLE IF EXISTS `followers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `followers` (
  `userid` varchar(50) NOT NULL,
  `followerid` varchar(50) NOT NULL,
  PRIMARY KEY (`userid`,`followerid`),
  KEY `followerid` (`followerid`),
  CONSTRAINT `followers_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON DELETE CASCADE,
  CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`followerid`) REFERENCES `users` (`userid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `followers`
--

LOCK TABLES `followers` WRITE;
/*!40000 ALTER TABLE `followers` DISABLE KEYS */;
INSERT INTO `followers` VALUES ('3be4715f-69c0-487a-982b-4de7cda443ab','d6a3a0db-6527-45d2-8f3f-9a3f42dc87ab'),('b5630d28-7116-40a3-8751-6351ecb53f77','d6a3a0db-6527-45d2-8f3f-9a3f42dc87ab'),('f7c5fb54-2414-460e-b19a-09c67794430e','d6a3a0db-6527-45d2-8f3f-9a3f42dc87ab');
/*!40000 ALTER TABLE `followers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userid` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `name` varchar(50) NOT NULL,
  `password` varchar(200) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('3be4715f-69c0-487a-982b-4de7cda443ab','joao@gmail.com','João','$2b$10$NBVDH4Jcl9/rBRj6nWTsduARzaPAUzg/hMiKUzxKBAitO.JFXdska','2022-12-11 17:07:14'),('ab05f517-1623-413a-9ca5-87e86930e889','ana@gmail.com','Ana','$2b$10$xxnuRxSVbG9YMgl9AS2zI.QxJXFXpDIy1tMJwuUkducNFJ38rQBhq','2022-12-11 17:15:36'),('b5630d28-7116-40a3-8751-6351ecb53f77','gustavo@gmail.com','Gustavo','$2b$10$/eGtLSRtSgwSGMexlwHs0eEuhUbh5.0MQv0hWbkHwSih/g4opwDXi','2022-12-11 17:52:55'),('d6a3a0db-6527-45d2-8f3f-9a3f42dc87ab','carlos@gmail.com','Carlos','$2b$10$HVfEiF5w90tC6nwq4P5iKu10cD4yL0a7OBHSg1GiKuS4sI9qbuiMK','2022-12-11 17:52:27'),('f7c5fb54-2414-460e-b19a-09c67794430e','pedro@gmail.com','Pedro','$2b$10$ztAozay2bXqRyMKfBRaLFOa4e6YcllDrhDVydc3WNfuPEw4fgpqVC','2022-12-11 17:06:57');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'liber'
--

--
-- Dumping routines for database 'liber'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-12  0:57:16
