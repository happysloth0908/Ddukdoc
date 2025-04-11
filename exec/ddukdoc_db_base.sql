-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        11.4.4-MariaDB - mariadb.org binary distribution
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- ddukdoc 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `ddukdoc` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `ddukdoc`;

-- 테이블 ddukdoc.blockchain_records 구조 내보내기
CREATE TABLE IF NOT EXISTS `blockchain_records` (
  `document_id` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `block_number` bigint(20) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `validation_status` varchar(20) NOT NULL,
  `network_name` varchar(50) NOT NULL,
  `transaction_hash` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKees2729oyja391k6fdacauo74` (`document_id`),
  CONSTRAINT `FKees2729oyja391k6fdacauo74` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테이블 데이터 ddukdoc.blockchain_records:~0 rows (대략적) 내보내기
DELETE FROM `blockchain_records`;

-- 테이블 ddukdoc.documents 구조 내보내기
CREATE TABLE IF NOT EXISTS `documents` (
  `creator_id` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pin` int(11) DEFAULT NULL,
  `recipient_id` int(11) DEFAULT NULL,
  `template_id` int(11) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `ipfs_hash` varchar(255) DEFAULT NULL,
  `return_reason` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `status` enum('DELETED','RETURNED','SIGNED','WAITING') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3hajddxk6ytka1h7c9uphfje2` (`creator_id`),
  KEY `FKp6ttp0w46ixidnk21dxy8w0ff` (`recipient_id`),
  KEY `FK854a9xn57ofqd0df68lajm0og` (`template_id`),
  CONSTRAINT `FK3hajddxk6ytka1h7c9uphfje2` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK854a9xn57ofqd0df68lajm0og` FOREIGN KEY (`template_id`) REFERENCES `templates` (`id`),
  CONSTRAINT `FKp6ttp0w46ixidnk21dxy8w0ff` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테이블 데이터 ddukdoc.documents:~0 rows (대략적) 내보내기
DELETE FROM `documents`;

-- 테이블 ddukdoc.document_evidences 구조 내보내기
CREATE TABLE IF NOT EXISTS `document_evidences` (
  `document_id` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhsje1w15b2i37x8dhwbrhjkhy` (`document_id`),
  KEY `FKa2ot3ktouga214ix9aaqtxshb` (`user_id`),
  CONSTRAINT `FKa2ot3ktouga214ix9aaqtxshb` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKhsje1w15b2i37x8dhwbrhjkhy` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테이블 데이터 ddukdoc.document_evidences:~0 rows (대략적) 내보내기
DELETE FROM `document_evidences`;

-- 테이블 ddukdoc.document_field_values 구조 내보내기
CREATE TABLE IF NOT EXISTS `document_field_values` (
  `document_id` int(11) DEFAULT NULL,
  `field_id` int(11) DEFAULT NULL,
  `filled_by` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `field_value` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpjsofs0op612xy3i57v4obm39` (`document_id`),
  KEY `FKiukjshfqyumekpvs3qxl51fov` (`field_id`),
  KEY `FKqf8vypgr6gg4838qi32052g96` (`filled_by`),
  CONSTRAINT `FKiukjshfqyumekpvs3qxl51fov` FOREIGN KEY (`field_id`) REFERENCES `template_fields` (`id`),
  CONSTRAINT `FKpjsofs0op612xy3i57v4obm39` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`),
  CONSTRAINT `FKqf8vypgr6gg4838qi32052g96` FOREIGN KEY (`filled_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테이블 데이터 ddukdoc.document_field_values:~0 rows (대략적) 내보내기
DELETE FROM `document_field_values`;

-- 테이블 ddukdoc.notifications 구조 내보내기
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `is_read` bit(1) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `variable` int(11) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `notification_type` varchar(50) NOT NULL,
  `message` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9y21adhxn0ayjhfocscqox7bh` (`user_id`),
  CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테이블 데이터 ddukdoc.notifications:~0 rows (대략적) 내보내기
DELETE FROM `notifications`;

-- 테이블 ddukdoc.role 구조 내보내기
CREATE TABLE IF NOT EXISTS `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테이블 데이터 ddukdoc.role:~6 rows (대략적) 내보내기
DELETE FROM `role`;
INSERT INTO `role` (`id`, `name`) VALUES
	(1, '공통'),
	(2, '채권자'),
	(3, '채무자'),
	(4, '고용인'),
	(5, '피고용인'),
	(6, '교육생');

-- 테이블 ddukdoc.signatures 구조 내보내기
CREATE TABLE IF NOT EXISTS `signatures` (
  `document_id` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7h3u1gbbulfoe5x33ao8hvfvw` (`document_id`),
  KEY `FKontwx5k1knpn815wxho7hjr88` (`user_id`),
  CONSTRAINT `FK7h3u1gbbulfoe5x33ao8hvfvw` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`),
  CONSTRAINT `FKontwx5k1knpn815wxho7hjr88` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테이블 데이터 ddukdoc.signatures:~0 rows (대략적) 내보내기
DELETE FROM `signatures`;

-- 테이블 ddukdoc.templates 구조 내보내기
CREATE TABLE IF NOT EXISTS `templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `code` varchar(10) DEFAULT NULL,
  `signature_type` varchar(20) NOT NULL,
  `category` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKq29dtfrj97gkqt015sdyurqcm` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테이블 데이터 ddukdoc.templates:~8 rows (대략적) 내보내기
DELETE FROM `templates`;
INSERT INTO `templates` (`id`, `created_at`, `updated_at`, `code`, `signature_type`, `category`, `name`, `description`) VALUES
	(1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', 'G1', '채무자, 채권자', '일반', '차용증', '차용 계약을 위한 문서'),
	(2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', 'G2', '고용인, 피고용인', '근로', '근로계약서', '근로계약을 위한 문서'),
	(3, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', 'S1', 'unilateral', '싸피', '노트북 반출서약서', '노트북 반출에 대한 서약서'),
	(4, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', 'S2', 'unilateral', '싸피', '노트북 수령확인서', '노트북 수령을 확인하는 문서'),
	(5, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', 'S3', 'unilateral', '싸피', '출결 확인서', '출결을 확인하는 문서'),
	(6, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', 'S4', 'unilateral', '싸피', '출결 변경요청서', '출결 변경을 요청하는 문서'),
	(7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', 'S5', 'unilateral', '싸피', '소스코드 반출 요청서', '소스코드 반출 요청 문서'),
	(8, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', 'S6', 'unilateral', '싸피', '프로젝트 활용 동의서', '프로젝트 활용 동의 문서');

-- 테이블 ddukdoc.template_fields 구조 내보내기
CREATE TABLE IF NOT EXISTS `template_fields` (
  `display_order` int(11) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `is_required` bit(1) NOT NULL,
  `max_length` int(11) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `template_id` int(11) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `field_group` varchar(50) DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `field_label` varchar(255) NOT NULL,
  `placeholder` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfbbmrlvvgj6gjxld550wnsb82` (`role_id`),
  KEY `FKhqpu2j7g4ol8ydvq2rgyrqs7j` (`template_id`),
  CONSTRAINT `FKfbbmrlvvgj6gjxld550wnsb82` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `FKhqpu2j7g4ol8ydvq2rgyrqs7j` FOREIGN KEY (`template_id`) REFERENCES `templates` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테이블 데이터 ddukdoc.template_fields:~97 rows (대략적) 내보내기
DELETE FROM `template_fields`;
INSERT INTO `template_fields` (`display_order`, `id`, `is_required`, `max_length`, `role_id`, `template_id`, `created_at`, `updated_at`, `field_group`, `type`, `name`, `description`, `field_label`, `placeholder`) VALUES
	(1, 1, b'1', 200, 1, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '기본정보', 'VARCHAR(200)', 'loan_purpose', '차용 목적 입력', '차용 목적', '예: 사업자금'),
	(2, 2, b'1', NULL, 1, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '기본정보', 'DATE', 'loan_date', '차용한 날짜', '차용 일자', 'YYYY-MM-DD'),
	(3, 3, b'1', 255, 1, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '기본정보', 'VARCHAR(255)', 'principal_amount_text', '한글로 표기된 원금', '원금 (한글)', '예: 금 백만원정'),
	(4, 4, b'1', NULL, 1, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '기본정보', 'BIGINT', 'principal_amount_numeric', '숫자로 표기된 원금', '원금 (숫자)', '예: 1,000,000'),
	(5, 5, b'1', NULL, 1, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '변제조건', 'DECIMAL(5,2)', 'interest_rate', '연이자율', '이자율 (%)', '예: 3.5'),
	(6, 6, b'1', NULL, 1, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '변제조건', 'DATE', 'repayment_date', '변제할 날짜', '원금 변제일', 'YYYY-MM-DD'),
	(7, 7, b'1', 100, 1, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '입금정보', 'VARCHAR(100)', 'bank_name', '입금받을 은행', '은행명', '예: 국민은행'),
	(8, 8, b'1', 100, 1, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '입금정보', 'VARCHAR(100)', 'account_holder', '예금주 이름', '예금주', '예: 홍길동'),
	(9, 9, b'1', 50, 1, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '입금정보', 'VARCHAR(50)', 'account_number', '입금 계좌번호', '계좌번호', '예: 123-456-789'),
	(10, 10, b'1', NULL, 1, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '입금정보', 'INT', 'interest_payment_date', '매월 몇 일에 지급하는지', '이자 지급일 (매월)', '예: 25'),
	(11, 11, b'1', NULL, 1, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '변제조건', 'DECIMAL(5,2)', 'late_interest_rate', '연체 발생 시 이자율', '지연 이자율 (%)', '예: 5.0'),
	(12, 12, b'1', NULL, 1, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '변제조건', 'INT', 'loss_of_benefit_conditions', '기한의 이익 상실 사유', '지연 횟수', '예: 3'),
	(13, 13, b'0', NULL, 1, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '기타', 'TEXT', 'special_terms', '특별 약정 사항', '특약사항', '예: 없음'),
	(14, 14, b'1', 100, 2, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '채권자 정보', 'VARCHAR(100)', 'creditor_name', '채권자 이름', '채권자 성명', '예: 김철수'),
	(15, 15, b'1', 200, 2, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '채권자 정보', 'VARCHAR(200)', 'creditor_address', '채권자 주소', '채권자 주소', '예: 서울시 강남구'),
	(16, 16, b'1', 50, 2, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '채권자 정보', 'VARCHAR(50)', 'creditor_contact', '채권자 전화번호', '채권자 연락처', '예: 010-1234-5678'),
	(17, 17, b'1', 100, 2, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '채권자 정보', 'VARCHAR(100)', 'creditor_id', '주민등록번호', '채권자 주민등록번호', '예: 801212-1234567'),
	(18, 18, b'1', 100, 3, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '채무자 정보', 'VARCHAR(100)', 'debtor_name', '채무자 이름', '채무자 성명', '예: 이영희'),
	(19, 19, b'1', 200, 3, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '채무자 정보', 'VARCHAR(200)', 'debtor_address', '채무자 주소', '채무자 주소', '예: 부산시 해운대구'),
	(20, 20, b'1', 50, 3, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '채무자 정보', 'VARCHAR(50)', 'debtor_contact', '채무자 전화번호', '채무자 연락처', '예: 010-9876-5432'),
	(21, 21, b'1', 100, 3, 1, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '채무자 정보', 'VARCHAR(100)', 'debtor_id', '주민등록번호', '채무자 주민등록번호', '예: 901010-2345678'),
	(1, 22, b'1', NULL, 1, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '계약 정보', 'DATE', 'contract_date', '계약 체결일', '계약 날짜', 'YYYY-MM-DD'),
	(2, 23, b'1', 100, 4, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '사업주 정보', 'VARCHAR(100)', 'employer_name', '사업주 이름', '사업주 이름', '예: 파리바게트'),
	(3, 24, b'1', 20, 4, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '사업주 정보', 'VARCHAR(20)', 'employer_business_number', '사업자 등록번호', '사업자등록번호', '예: 123-45-67890'),
	(4, 25, b'1', 50, 4, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '사업주 정보', 'VARCHAR(50)', 'employer_contact', '사업주 연락처', '사업주 연락처', '예: 02-1234-5678'),
	(5, 26, b'1', 200, 4, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '사업주 정보', 'VARCHAR(200)', 'employer_address', '사업장 주소', '사업장 소재지', '예: 서울시 강남구'),
	(6, 27, b'1', 100, 5, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '근로자 정보', 'VARCHAR(100)', 'employee_name', '근로자 이름', '근로자 이름', '예: 김철수'),
	(7, 28, b'1', NULL, 5, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '근로자 정보', 'DATE', 'employee_birthdate', '생년월일', '근로자 생년월일', 'YYYY-MM-DD'),
	(8, 29, b'1', 50, 5, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '근로자 정보', 'VARCHAR(50)', 'employee_contact', '근로자 연락처', '근로자 연락처', '예: 010-1234-5678'),
	(9, 30, b'1', NULL, 1, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '계약 정보', 'DATE', 'contract_start_date', '계약 시작일', '계약 시작일', 'YYYY-MM-DD'),
	(10, 31, b'1', NULL, 1, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '계약 정보', 'DATE', 'contract_end_date', '계약 종료일', '계약 종료일', 'YYYY-MM-DD'),
	(11, 32, b'1', 200, 4, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '근무 정보', 'VARCHAR(200)', 'work_location', '근무지', '근무장소', '예: 서울시 강남구'),
	(12, 33, b'1', 200, 5, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '근무 정보', 'VARCHAR(200)', 'job_description', '업무 내용', '담당 업무', '예: 고객 상담'),
	(13, 34, b'1', 50, 1, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '근무 정보', 'VARCHAR(50)', 'work_days', '근무일', '근무일 (요일)', '예: 월~금'),
	(14, 35, b'1', NULL, 1, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '근무 정보', 'TIME', 'work_start_time', '출근 시간', '근무 시작 시간', '예: 10:00'),
	(15, 36, b'1', NULL, 1, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '근무 정보', 'TIME', 'work_end_time', '퇴근 시간', '근무 종료 시간', '예: 19:00'),
	(16, 37, b'1', NULL, 1, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '근무 정보', 'TIME', 'break_time_start', '휴게 시간 시작', '휴게 시작 시간', '예: 12:30'),
	(17, 38, b'1', NULL, 1, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '근무 정보', 'TIME', 'break_time_end', '휴게 시간 종료', '휴게 종료 시간', '예: 13:30'),
	(18, 39, b'1', NULL, 5, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '임금 정보', 'INT', 'hourly_wage', '시급 금액', '시급', '예: 10,030(최저시급)'),
	(19, 40, b'1', NULL, 1, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '임금 정보', 'INT', 'payment_date', '월급 지급일', '급여 지급일', '예: 10'),
	(20, 41, b'1', NULL, 1, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '임금 정보', 'DATE', 'salary_period_start', '급여 계산 시작', '급여 계산 시작일', 'YYYY-MM-DD'),
	(21, 42, b'1', NULL, 1, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '임금 정보', 'DATE', 'salary_period_end', '급여 계산 종료', '급여 계산 종료일', 'YYYY-MM-DD'),
	(22, 43, b'1', 50, 1, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '휴일 및 휴가', 'VARCHAR(50)', 'weekly_holiday', '주휴일 입력', '주휴일', '예: 일요일'),
	(25, 44, b'1', NULL, 1, 2, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '기타사항', 'TEXT', 'extra_notes', '기타 사항 입력', '기타 사항', '기본적으로 제공되는 기타 사항'),
	(1, 45, b'1', 100, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '신청자 정보', 'VARCHAR(50)', 'affiliation', '소속 입력', '소속', '예: 대전 5반'),
	(2, 46, b'1', 100, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '신청자 정보', 'VARCHAR(50)', 'applicant_name', '이름 입력', '이름', '예: 홍길동'),
	(3, 47, b'1', 50, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '신청자 정보', 'VARCHAR(50)', 'applicant_contact', '연락처 입력', '연락처', '예: 010-1234-5678'),
	(4, 48, b'1', NULL, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '반출 정보', 'TEXT', 'export_purpose', '반출 목적 입력', '반출 목적', '예: 포트폴리오 제출 '),
	(5, 49, b'1', NULL, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '반출 정보', 'TEXT', 'export_destination', '반출처 입력', '반출처', '예: ○○기업 재출'),
	(6, 50, b'1', NULL, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '반출 정보', 'DATE', 'export_date', '반출 예정 날짜', '반출 일정', 'YYYY-MM-DD'),
	(7, 51, b'1', NULL, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '반출 정보', 'DATE', 'return_date', '반납 예정 날짜', '반납 일정', 'YYYY-MM-DD //무기한으로 작성 불가'),
	(8, 52, b'1', NULL, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '프로젝트 정보', 'TEXT', 'project_name', '프로젝트 이름 입력', '프로젝트 명', '예: 뚝딱뚝Doc'),
	(9, 53, b'1', NULL, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '반출 대상', 'TEXT', 'export_target', '반출할 소스코드 설명', '반출 대상', '예: SSAFY 깃랩 url'),
	(10, 54, b'1', NULL, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '반출 대상', 'TEXT', 'export_method', '반출 방법 입력', '반출 방법', '예: 반출 github url'),
	(11, 55, b'1', 10, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '자가점검 체크리스트', 'VARCHAR(10)', 'self_check_code_review', '본인(팀)이 직접 개발한 프로젝트 결과물인가?', '자가점검 체크리스트_1', 'O/X'),
	(13, 56, b'1', 10, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '자가점검 체크리스트', 'VARCHAR(10)', 'self_check_ssafy_code', 'SSAFY에서 제공한 스켈레톤 코드 비중이 20% 이내인가?', '자가점검 체크리스트_2', 'O/X'),
	(15, 57, b'1', 10, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '자가점검 체크리스트', 'VARCHAR(10)', 'self_check_open_source', 'SSAFY에서 제공한 이미지, 데이터셋, 에셋 라이센스 등 프로젝트 개발 목적으로 제공된 리소스 원본이 포함되지 않았는가?', '자가점검 체크리스트_3', 'O/X'),
	(17, 58, b'1', 10, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '자가점검 체크리스트', 'VARCHAR(10)', 'self_check_third_party', 'SSAFY의 보안 기준 또는 타인의 저작권을 침해할 우려가 없는가?', '자가점검 체크리스트_4', 'O/X'),
	(19, 59, b'1', 10, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '자가점검 체크리스트', 'VARCHAR(10)', 'self_check_security_check', '참조된 소스코드, 라이브러리 등의 출처를 명시하였는가?', '자가점검 체크리스트_5', 'O/X'),
	(21, 60, b'1', 10, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '자가점검 체크리스트', 'VARCHAR(10)', 'self_check_purpose_limit', '학습용 프로젝트가 해당하지 않고 포트폴리오를 인정할 만한 독창적인 프로젝트 코드인가?', '자가점검 체크리스트_6', 'O/X'),
	(1, 61, b'1', NULL, 6, 3, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '반출 정보', 'DATE', 'export_date', '노트북 반출 날짜', '반출 일자', 'YYYY-MM-DD'),
	(2, 62, b'1', NULL, 6, 3, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '반출 정보', 'DATE', 'return_due_date', '반납 예정 날짜', '반납 예정일', 'YYYY-MM-DD'),
	(3, 63, b'1', 100, 6, 3, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '사용자 정보', 'VARCHAR(50)', 'location', '소속 입력', '소속', '예: 대전 1반'),
	(4, 64, b'1', 50, 6, 3, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '사용자 정보', 'VARCHAR(50)', 'student_id', '학번 입력', '학번', '예: 1238000'),
	(5, 65, b'1', 50, 6, 3, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '사용자 정보', 'VARCHAR(50)', 'contact_number', '연락처 입력', '연락처', '예: 010-8336-8012'),
	(6, 66, b'1', 100, 6, 3, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '사용자 정보', 'VARCHAR(50)', 'applicant_name', '신청자 이름 입력', '이름', '예: 홍길동'),
	(1, 67, b'1', 100, 6, 5, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '신청자 정보', 'VARCHAR(50)', 'student_name', '신청자 성명 입력', '성명', '예: 홍길동'),
	(2, 68, b'1', NULL, 6, 5, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '신청자 정보', 'DATE', 'student_birthdate', '생년월일 입력', '생년월일', 'YYYY-MM-DD'),
	(3, 69, b'1', NULL, 6, 5, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '출결 정보', 'DATE', 'attendance_datetime', '출결 날짜', '일시', 'YYYY-MM-DD '),
	(4, 70, b'1', 10, 6, 5, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '출결 정보', 'VARCHAR(10)', 'attendance_time', '출결 시간대 선택', '출결 시간대 (오전/오후/종일)', '오전/오후/종일 중 하나'),
	(5, 71, b'1', NULL, 6, 5, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '출결 정보', 'VARCHAR(10)', 'is_public_absence', '공가 또는 그 외 선택', '공가 / 사유', '공가 /일반 사유 중 하나'),
	(6, 72, b'1', NULL, 6, 5, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '출결 정보', 'TEXT', 'absence_reason', '공가 또는 일반 사유 내용', '공가/사유 내용', '예 : 병원 진료'),
	(7, 73, b'1', NULL, 6, 5, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '출결 정보', 'TEXT', 'absence_detail', '세부 내용 입력', '세부 내용', '예: 병원 진료 사유작성'),
	(8, 74, b'1', 200, 6, 5, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '출결 정보', 'VARCHAR(200)', 'location', '장소 입력', '장소', '예: 병원 명'),
	(9, 75, b'1', 100, 6, 5, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '신청자 정보', 'VARCHAR(50)', 'applicant_name', '신청자 이름 입력', '이름', '예: 홍길동'),
	(10, 76, b'1', NULL, 6, 5, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '신청 정보', 'DATE', 'submitted_date', '신청 날짜 입력', '신청 날짜', 'YYYY-MM-DD'),
	(11, 77, b'1', NULL, 6, 5, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '증빙서류', 'TEXT', 'proof_documents', '증빙서류 업로드 (JSON 배열 형태)', '증빙서류 (이미지 URL 리스트)', '파일 여러 개 업로드 가능'),
	(1, 78, b'1', 100, 6, 6, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '신청자 정보', 'VARCHAR(50)', 'student_campus', '소속 캠퍼스 입력', '소속 캠퍼스', '예: 서울캠퍼스'),
	(2, 79, b'1', 50, 6, 6, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '신청자 정보', 'int', 'student_class', '반 입력', '반', '예: 1'),
	(3, 80, b'1', 100, 6, 6, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '신청자 정보', 'VARCHAR(50)', 'student_name', '신청자 성명 입력', '성명', '예: 홍길동'),
	(4, 81, b'1', NULL, 6, 6, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '신청자 정보', 'DATE', 'student_birthdate', '생년월일 입력', '생년월일', 'YYYY-MM-DD'),
	(5, 82, b'1', 50, 6, 6, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '출결 변경 사유', 'int', 'attendance_issue_type', '변경 요청 사유 선택', '시스템 변경 요청 사유', '1/2/3/4'),
	(6, 83, b'1', NULL, 6, 6, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '출결 변경 정보', 'DATETIME', 'original_attendance_datetime', '기존 출결 일시 입력', '출결 일시', 'YYYY-MM-DD HH:MM'),
	(7, 84, b'1', NULL, 6, 6, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '출결 변경 정보', 'DATETIME', 'updated_attendance_datetime', '변경된 출결 일시 입력', '변경 일시', 'YYYY-MM-DD HH:MM'),
	(8, 85, b'1', NULL, 6, 6, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '출결 변경 정보', 'TEXT', 'attendance_change_reason', '변경 사유 입력', '변경 사유', '상세 내용을 입력하세요'),
	(9, 86, b'1', 100, 6, 6, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '신청자 정보', 'VARCHAR(100)', 'applicant_name', '신청자 이름 입력', '교육생명', '예: 홍길동'),
	(10, 87, b'1', NULL, 6, 6, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '신청 정보', 'DATE', 'submitted_date', '신청 날짜 입력', '신청 날짜', 'YYYY-MM-DD'),
	(1, 88, b'1', 255, 6, 8, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '프로젝트 정보', 'VARCHAR(255)', 'project_name', '프로젝트명 입력', '프로젝트 이름', '예: 뚝딱뚝Doc'),
	(2, 89, b'1', NULL, 6, 8, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '기본 정보', 'DATE', 'submitted_date', '동의서 작성 날짜 입력', '날짜', 'YYYY-MM-DD'),
	(3, 90, b'1', NULL, 6, 8, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '기본 정보', 'DATE', 'student_birthdate', '교육생 생년월일 입력', '생년월일', 'YYYY-MM-DD'),
	(4, 91, b'1', 100, 6, 8, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '기본 정보', 'VARCHAR(50)', 'student_name', '교육생 성명 입력', '성명', '예: 홍길동'),
	(12, 92, b'0', NULL, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '자가점검 체크리스트', 'TEXT', 'self_check_code_review_action', '본인(팀)이 직접 개발한 프로젝트 결과물인가?에 대한 조치사항', '항목1 조치사항', '필요시 조치사항 입력'),
	(14, 93, b'0', NULL, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '자가점검 체크리스트', 'TEXT', 'self_check_ssafy_code_action', 'SSAFY에서 제공한 스켈레톤 코드 비중이 20% 이내인가?에 대한 조치사항', '항목2 조치사항', '필요시 조치사항 입력'),
	(16, 94, b'0', NULL, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '자가점검 체크리스트', 'TEXT', 'self_check_open_source_action', 'SSAFY에서 제공한 이미지, 데이터셋, 에셋 라이센스 등 프로젝트 개발 목적으로 제공된 리소스 원본이 포함되지 않았는가?에 대한 조치사항', '항목3 조치사항', '필요시 조치사항 입력'),
	(18, 95, b'0', NULL, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '자가점검 체크리스트', 'TEXT', 'self_check_third_party_action', 'SSAFY의 보안 기준 또는 타인의 저작권을 침해할 우려가 없는가?에 대한 조치사항', '항목4 조치사항', '필요시 조치사항 입력'),
	(20, 96, b'0', NULL, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '자가점검 체크리스트', 'TEXT', 'self_check_security_check_action', '참조된 소스코드, 라이브러리 등의 출처를 명시하였는가?에 대한 조치사항', '항목5 조치사항', '필요시 조치사항 입력'),
	(22, 97, b'0', NULL, 6, 7, '2025-04-11 10:47:14.000000', '2025-04-11 10:47:14.000000', '자가점검 체크리스트', 'TEXT', 'self_check_purpose_limit_action', '학습용 프로젝트가 해당하지 않고 포트폴리오로 인정할 만한 독창적인 프로젝트인가?에 대한 조치사항', '항목6 조치사항', '필요시 조치사항 입력');

-- 테이블 ddukdoc.users 구조 내보내기
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `social_key` varchar(100) NOT NULL,
  `social_provider` enum('KAKAO','SSAFY') NOT NULL,
  `user_type` enum('ADMIN','GENERAL','SSAFY','TEST') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테이블 데이터 ddukdoc.users:~2 rows (대략적) 내보내기
DELETE FROM `users`;
INSERT INTO `users` (`id`, `created_at`, `deleted_at`, `updated_at`, `name`, `email`, `social_key`, `social_provider`, `user_type`) VALUES
	(1, '2025-04-11 10:47:14.000000', NULL, '2025-04-11 10:47:14.000000', 'TestUser', 'test@example.com', 'test123', 'KAKAO', 'TEST'),
	(2, '2025-04-11 10:47:14.000000', NULL, '2025-04-11 10:47:14.000000', 'AdminUser', 'admin@example.com', 'test124', 'KAKAO', 'ADMIN');

-- 테이블 ddukdoc.user_doc_role 구조 내보내기
CREATE TABLE IF NOT EXISTS `user_doc_role` (
  `document_id` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKernuqg3sp9vmuldqilpp0apal` (`document_id`),
  KEY `FKq506n4n9frvpa1gweitul3cpn` (`role_id`),
  KEY `FKoamcvpcexxhtm9im3axi7a1sd` (`user_id`),
  CONSTRAINT `FKernuqg3sp9vmuldqilpp0apal` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`),
  CONSTRAINT `FKoamcvpcexxhtm9im3axi7a1sd` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKq506n4n9frvpa1gweitul3cpn` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 테이블 데이터 ddukdoc.user_doc_role:~0 rows (대략적) 내보내기
DELETE FROM `user_doc_role`;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
