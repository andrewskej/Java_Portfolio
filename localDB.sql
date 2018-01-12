-- --------------------------------------------------------
-- 호스트:                          localhost
-- 서버 버전:                        5.7.20-log - MySQL Community Server (GPL)
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- o2 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `o2` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `o2`;

-- 테이블 o2.board 구조 내보내기
CREATE TABLE IF NOT EXISTS `board` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `writer` varchar(50) NOT NULL DEFAULT 'Guest',
  `title` varchar(50) NOT NULL,
  `content` mediumtext NOT NULL,
  `regdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `password` varchar(50) NOT NULL,
  `hit` int(11) NOT NULL DEFAULT '0',
  `imgsrc` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idx`),
  KEY `FK_board_member` (`writer`),
  CONSTRAINT `FK_board_member` FOREIGN KEY (`writer`) REFERENCES `member` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 o2.items 구조 내보내기
CREATE TABLE IF NOT EXISTS `items` (
  `ITEMNO` int(50) NOT NULL AUTO_INCREMENT,
  `ITEMNAME` varchar(50) DEFAULT NULL,
  `ITEMPRICE` varchar(50) DEFAULT NULL,
  `ITEMTYPE` varchar(50) DEFAULT NULL,
  `ITEMUSE` varchar(50) DEFAULT NULL,
  `ITEMIMG` varchar(50) DEFAULT NULL,
  `ITEMDESC` varchar(2000) DEFAULT NULL,
  `ITEMDATE` date DEFAULT NULL,
  `ITEMSTOCK` int(50) DEFAULT NULL,
  PRIMARY KEY (`ITEMNO`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 o2.member 구조 내보내기
CREATE TABLE IF NOT EXISTS `member` (
  `authId` varchar(50) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50),
  `hash` varchar(50) DEFAULT NULL,
  `salt` varchar(50) DEFAULT NULL,
  `displayname` varchar(50) DEFAULT NULL,
  `level` varchar(50) DEFAULT 'user',
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 o2.message 구조 내보내기
CREATE TABLE IF NOT EXISTS `message` (
  `message` varchar(5000) NOT NULL,
  `regdate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 o2.mycart 구조 내보내기
CREATE TABLE IF NOT EXISTS `mycart` (
  `CARTNAME` varchar(50) NOT NULL,
  `ITEMNO` int(50) DEFAULT NULL,
  `ITEMNAME` varchar(50) DEFAULT NULL,
  `PRICE` int(50) DEFAULT NULL,
  `QUANTITY` int(50),
  `CARTNO` int(50) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`CARTNO`),
  KEY `FK_mycart_member` (`CARTNAME`),
  CONSTRAINT `FK_mycart_member` FOREIGN KEY (`CARTNAME`) REFERENCES `member` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 o2.orderlist 구조 내보내기
CREATE TABLE IF NOT EXISTS `orderlist` (
  `ORDERLISTNAME` varchar(50),
  `ORDERNO` varchar(50) NOT NULL,
  `ORDERDATE` date DEFAULT NULL,
  `ITEMNAME` varchar(50) DEFAULT NULL,
  `STATUS` varchar(50) DEFAULT NULL,
  `ADDRESS` varchar(50) DEFAULT NULL,
  `ITEMNO` int(50) DEFAULT NULL,
  `QUANTITY` int(50) DEFAULT NULL,
  `PRICE` int(50) DEFAULT NULL,
  `TOTAL` int(50) DEFAULT NULL,
  PRIMARY KEY (`ORDERNO`),
  KEY `FK_orderlist_member` (`ORDERLISTNAME`),
  CONSTRAINT `FK_orderlist_member` FOREIGN KEY (`ORDERLISTNAME`) REFERENCES `member` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 o2.review 구조 내보내기
CREATE TABLE IF NOT EXISTS `review` (
  `RID` varchar(50) DEFAULT NULL,
  `REVIEWNO` int(50) NOT NULL,
  `STAR` varchar(50) DEFAULT NULL,
  `CONTENT` varchar(2000) DEFAULT NULL,
  `ITEMNO` int(50) DEFAULT NULL,
  `ITEMNAME` varchar(50) DEFAULT NULL,
  `REGDATE` date DEFAULT NULL,
  PRIMARY KEY (`REVIEWNO`),
  KEY `FK_review_member` (`RID`),
  CONSTRAINT `FK_review_member` FOREIGN KEY (`RID`) REFERENCES `member` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.
-- 테이블 o2.sessions 구조 내보내기
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 내보낼 데이터가 선택되어 있지 않습니다.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
