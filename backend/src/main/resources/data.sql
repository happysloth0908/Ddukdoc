INSERT INTO `role` (id, name) VALUES
      (1, '공통'),
      (2, '채권자'),
      (3, '채무자'),
      (4, '고용인'),
      (5, '피고용인'),
      (6, '교육생');

-- 문서 템플릿 등록
INSERT INTO templates (id,code, name, category, signature_type, description, created_at, updated_at)
VALUES
    (1,'G1', '차용증', '일반', '채무자, 채권자', '차용 계약을 위한 문서', NOW(), NOW()),
    (2, 'G2', '근로계약서', '근로', '고용인, 피고용인', '근로계약을 위한 문서', NOW(), NOW()),
    (3, 'S1', '노트북 반출서약서', '싸피', 'unilateral', '노트북 반출에 대한 서약서', NOW(), NOW()),
    (4, 'S2', '노트북 수령확인서', '싸피', 'unilateral', '노트북 수령을 확인하는 문서', NOW(), NOW()),
    (5, 'S3', '출결 확인서', '싸피', 'unilateral', '출결을 확인하는 문서', NOW(), NOW()),
    (6, 'S4', '출결 변경요청서', '싸피', 'unilateral', '출결 변경을 요청하는 문서', NOW(), NOW()),
    (7, 'S5', '소스코드 반출 요청서', '싸피', 'unilateral', '소스코드 반출 요청 문서', NOW(), NOW()),
    (8, 'S6', '프로젝트 활용 동의서', '싸피', 'unilateral', '프로젝트 활용 동의 문서', NOW(), NOW());


-- 필드 등록 (차용증 G1의 세부 필드)
-- 필드 등록 (차용증 G1의 세부 필드)
INSERT INTO template_fields (id, role_id, template_id, name, type, field_label, is_required, `display_order`, `field_group`, max_length, description, placeholder, created_at, updated_at)
VALUES
-- 차용 정보
(1, 1, (SELECT id FROM templates WHERE code = 'G1'), 'loan_purpose', 'VARCHAR(200)', '차용 목적', TRUE, 1, '기본정보', 200, '차용 목적 입력', '예: 사업자금', NOW(), NOW()),
(2, 1, (SELECT id FROM templates WHERE code = 'G1'), 'loan_date', 'DATE', '차용 일자', TRUE, 2, '기본정보', NULL, '차용한 날짜', 'YYYY-MM-DD', NOW(), NOW()),

-- 원금 (한글 표기 + 숫자 표기)
(3, 1, (SELECT id FROM templates WHERE code = 'G1'), 'principal_amount_text', 'VARCHAR(255)', '원금 (한글)', TRUE, 3, '기본정보', 255, '한글로 표기된 원금', '예: 금 백만원정', NOW(), NOW()),
(4, 1, (SELECT id FROM templates WHERE code = 'G1'), 'principal_amount_numeric', 'BIGINT', '원금 (숫자)', TRUE, 4, '기본정보', NULL, '숫자로 표기된 원금', '예: 1,000,000', NOW(), NOW()),

-- 변제 정보
(5, 1, (SELECT id FROM templates WHERE code = 'G1'), 'interest_rate', 'DECIMAL(5,2)', '이자율 (%)', TRUE, 5, '변제조건', NULL, '연이자율', '예: 3.5', NOW(), NOW()),
(6, 1, (SELECT id FROM templates WHERE code = 'G1'), 'repayment_date', 'DATE', '원금 변제일', TRUE, 6, '변제조건', NULL, '변제할 날짜', 'YYYY-MM-DD', NOW(), NOW()),

-- 계좌 정보
(7, 1, (SELECT id FROM templates WHERE code = 'G1'), 'bank_name', 'VARCHAR(100)', '은행명', TRUE, 7, '입금정보', 100, '입금받을 은행', '예: 국민은행', NOW(), NOW()),
(8, 1, (SELECT id FROM templates WHERE code = 'G1'), 'account_holder', 'VARCHAR(100)', '예금주', TRUE, 8, '입금정보', 100, '예금주 이름', '예: 홍길동', NOW(), NOW()),
(9, 1, (SELECT id FROM templates WHERE code = 'G1'), 'account_number', 'VARCHAR(50)', '계좌번호', TRUE, 9, '입금정보', 50, '입금 계좌번호', '예: 123-456-789', NOW(), NOW()),
(10, 1, (SELECT id FROM templates WHERE code = 'G1'), 'interest_payment_date', 'INT', '이자 지급일 (매월)', TRUE, 10, '입금정보', NULL, '매월 몇 일에 지급하는지', '예: 25', NOW(), NOW()),

-- 지연 변제 관련
(11, 1, (SELECT id FROM templates WHERE code = 'G1'), 'late_interest_rate', 'DECIMAL(5,2)', '지연 이자율 (%)', TRUE, 11, '변제조건', NULL, '연체 발생 시 이자율', '예: 5.0', NOW(), NOW()),
(12, 1, (SELECT id FROM templates WHERE code = 'G1'), 'loss_of_benefit_conditions', 'INT', '지연 횟수', TRUE, 12, '변제조건', NULL, '기한의 이익 상실 사유', '예: 3', NOW(), NOW()),

-- 특약사항
(13, 1, (SELECT id FROM templates WHERE code = 'G1'), 'special_terms', 'TEXT', '특약사항', FALSE, 13, '기타', NULL, '특별 약정 사항', '예: 없음', NOW(), NOW()),

-- 채권자 정보
(14, 2, (SELECT id FROM templates WHERE code = 'G1'), 'creditor_name', 'VARCHAR(100)', '채권자 성명', TRUE, 14, '채권자 정보', 100, '채권자 이름', '예: 김철수', NOW(), NOW()),
(15, 2, (SELECT id FROM templates WHERE code = 'G1'), 'creditor_address', 'VARCHAR(200)', '채권자 주소', TRUE, 15, '채권자 정보', 200, '채권자 주소', '예: 서울시 강남구', NOW(), NOW()),
(16, 2, (SELECT id FROM templates WHERE code = 'G1'), 'creditor_contact', 'VARCHAR(50)', '채권자 연락처', TRUE, 16, '채권자 정보', 50, '채권자 전화번호', '예: 010-1234-5678', NOW(), NOW()),
(17, 2, (SELECT id FROM templates WHERE code = 'G1'), 'creditor_id', 'VARCHAR(100)', '채권자 주민등록번호', TRUE, 17, '채권자 정보', 100, '주민등록번호', '예: 801212-1234567', NOW(), NOW()),

-- 채무자 정보
(18, 3, (SELECT id FROM templates WHERE code = 'G1'), 'debtor_name', 'VARCHAR(100)', '채무자 성명', TRUE, 18, '채무자 정보', 100, '채무자 이름', '예: 이영희', NOW(), NOW()),
(19, 3, (SELECT id FROM templates WHERE code = 'G1'), 'debtor_address', 'VARCHAR(200)', '채무자 주소', TRUE, 19, '채무자 정보', 200, '채무자 주소', '예: 부산시 해운대구', NOW(), NOW()),
(20, 3, (SELECT id FROM templates WHERE code = 'G1'), 'debtor_contact', 'VARCHAR(50)', '채무자 연락처', TRUE, 20, '채무자 정보', 50, '채무자 전화번호', '예: 010-9876-5432', NOW(), NOW()),
(21, 3, (SELECT id FROM templates WHERE code = 'G1'), 'debtor_id', 'VARCHAR(100)', '채무자 주민등록번호', TRUE, 21, '채무자 정보', 100, '주민등록번호', '예: 901010-2345678', NOW(), NOW());



-- 근로계약서 필드 등록 G2
INSERT INTO template_fields (id, template_id, role_id, name, type, field_label, is_required, `display_order`, `field_group`, max_length, description, placeholder, created_at, updated_at)
VALUES
-- 계약 날짜
(22,2, 1, 'contract_date', 'DATE', '계약 날짜', TRUE, 1, '계약 정보', NULL, '계약 체결일', 'YYYY-MM-DD', NOW(), NOW()),

-- 사업주 정보
(23,2, 4, 'employer_name', 'VARCHAR(100)', '사업주 이름', TRUE, 2, '사업주 정보', 100, '사업주 이름', '예: 파리바게트', NOW(), NOW()),
(24,2, 4, 'employer_business_number', 'VARCHAR(20)', '사업자등록번호', TRUE, 3, '사업주 정보', 20, '사업자 등록번호', '예: 123-45-67890', NOW(), NOW()),
(25,2, 4, 'employer_contact', 'VARCHAR(50)', '사업주 연락처', TRUE, 4, '사업주 정보', 50, '사업주 연락처', '예: 02-1234-5678', NOW(), NOW()),
(26,2, 4, 'employer_address', 'VARCHAR(200)', '사업장 소재지', TRUE, 5, '사업주 정보', 200, '사업장 주소', '예: 서울시 강남구', NOW(), NOW()),

-- 근로자 정보
(27,2, 5, 'employee_name', 'VARCHAR(100)', '근로자 이름', TRUE, 6, '근로자 정보', 100, '근로자 이름', '예: 김철수', NOW(), NOW()),
(28,2, 5, 'employee_birthdate', 'DATE', '근로자 생년월일', TRUE, 7, '근로자 정보', NULL, '생년월일', 'YYYY-MM-DD', NOW(), NOW()),
(29,2, 5, 'employee_contact', 'VARCHAR(50)', '근로자 연락처', TRUE, 8, '근로자 정보', 50, '근로자 연락처', '예: 010-1234-5678', NOW(), NOW()),

-- 계약 기간
(30,2, 1, 'contract_start_date', 'DATE', '계약 시작일', TRUE, 9, '계약 정보', NULL, '계약 시작일', 'YYYY-MM-DD', NOW(), NOW()),
(31,2, 1, 'contract_end_date', 'DATE', '계약 종료일', TRUE, 10, '계약 정보', NULL, '계약 종료일', 'YYYY-MM-DD', NOW(), NOW()),

-- 근무 장소 및 업무
(32,2, 4, 'work_location', 'VARCHAR(200)', '근무장소', TRUE, 11, '근무 정보', 200, '근무지', '예: 서울시 강남구', NOW(), NOW()),
(33,2, 5, 'job_description', 'VARCHAR(200)', '담당 업무', TRUE, 12, '근무 정보', 200, '업무 내용', '예: 고객 상담', NOW(), NOW()),

-- 근무시간 및 휴게시간
(34,2, 1, 'work_days', 'VARCHAR(50)', '근무일 (요일)', TRUE, 13, '근무 정보', 50, '근무일', '예: 월~금', NOW(), NOW()),
(35,2, 1, 'work_start_time', 'TIME', '근무 시작 시간', TRUE, 14, '근무 정보', NULL, '출근 시간', '예: 10:00', NOW(), NOW()),
(36,2, 1, 'work_end_time', 'TIME', '근무 종료 시간', TRUE, 15, '근무 정보', NULL, '퇴근 시간', '예: 19:00', NOW(), NOW()),
(37,2, 1, 'break_time_start', 'TIME', '휴게 시작 시간', TRUE, 16, '근무 정보', NULL, '휴게 시간 시작', '예: 12:30', NOW(), NOW()),
(38,2, 1, 'break_time_end', 'TIME', '휴게 종료 시간', TRUE, 17, '근무 정보', NULL, '휴게 시간 종료', '예: 13:30', NOW(), NOW()),

-- 임금 정보
(39,2, 5, 'hourly_wage', 'INT', '시급', TRUE, 18, '임금 정보', NULL, '시급 금액', '예: 10,030(최저시급)', NOW(), NOW()),
(40,2, 1, 'payment_date', 'INT', '급여 지급일', TRUE, 19, '임금 정보', NULL, '월급 지급일', '예: 10', NOW(), NOW()),
(41,2, 1, 'salary_period_start', 'DATE', '급여 계산 시작일', TRUE, 20, '임금 정보', NULL, '급여 계산 시작', 'YYYY-MM-DD', NOW(), NOW()),
(42,2, 1, 'salary_period_end', 'DATE', '급여 계산 종료일', TRUE, 21, '임금 정보', NULL, '급여 계산 종료', 'YYYY-MM-DD', NOW(), NOW()),

-- 휴일 정보
(43,2, 1, 'weekly_holiday', 'VARCHAR(50)', '주휴일', TRUE, 22, '휴일 및 휴가', 50, '주휴일 입력', '예: 일요일', NOW(), NOW()),

-- 기타 사항 1 (필수)
(44,2, 1, 'extra_notes', 'TEXT', '기타 사항', TRUE, 25, '기타사항', NULL, '기타 사항 입력', '기본적으로 제공되는 기타 사항', NOW(), NOW());


-- 소스코드 반출 검토 요청서
INSERT INTO template_fields (id, template_id, role_id, name, type, field_label, is_required, `display_order`, `field_group`, max_length, description, placeholder, created_at, updated_at)
VALUES
--  신청자 기본 정보
(45, 7, 6, 'affiliation', 'VARCHAR(50)', '소속', TRUE, 1, '신청자 정보', 100, '소속 입력', '예: 대전 5반', NOW(), NOW()),
(46, 7, 6, 'applicant_name', 'VARCHAR(50)', '이름', TRUE, 2, '신청자 정보', 100, '이름 입력', '예: 홍길동', NOW(), NOW()),
(47, 7, 6, 'applicant_contact', 'VARCHAR(50)', '연락처', TRUE, 3, '신청자 정보', 50, '연락처 입력', '예: 010-1234-5678', NOW(), NOW()),

--  반출 정보
(48, 7, 6, 'export_purpose', 'TEXT', '반출 목적', TRUE, 4, '반출 정보', NULL, '반출 목적 입력', '예: 포트폴리오 제출 ', NOW(), NOW()),
(49, 7, 6, 'export_destination', 'TEXT', '반출처', TRUE, 5, '반출 정보', NULL, '반출처 입력', '예: ○○기업 재출', NOW(), NOW()),
(50, 7, 6, 'export_date', 'DATE', '반출 일정', TRUE, 6, '반출 정보', NULL, '반출 예정 날짜', 'YYYY-MM-DD', NOW(), NOW()),
(51, 7, 6, 'return_date', 'DATE', '반납 일정', TRUE, 7, '반출 정보', NULL, '반납 예정 날짜', 'YYYY-MM-DD //무기한으로 작성 불가', NOW(), NOW()),

--  프로젝트 정보
(52, 7, 6, 'project_name', 'TEXT', '프로젝트 명', TRUE, 8, '프로젝트 정보', NULL, '프로젝트 이름 입력', '예: 뚝딱뚝Doc', NOW(), NOW()),

--  반출 대상 및 방법
(53, 7, 6, 'export_target', 'TEXT', '반출 대상', TRUE, 9, '반출 대상', NULL, '반출할 소스코드 설명', '예: SSAFY 깃랩 url', NOW(), NOW()),
(54, 7, 6, 'export_method', 'TEXT', '반출 방법', TRUE, 10, '반출 대상', NULL, '반출 방법 입력', '예: 반출 github url', NOW(), NOW()),

--  자가점검 체크리스트 (O/X 선택)
(55, 7, 6, 'self_check_code_review', 'VARCHAR(10)', '자가점검 체크리스트_1', TRUE, 11, '자가점검 체크리스트', 10, '본인(팀)이 직접 개발한 프로젝트 결과물인가?', 'O/X', NOW(), NOW()),
(56, 7, 6, 'self_check_ssafy_code', 'VARCHAR(10)', '자가점검 체크리스트_2', TRUE, 13, '자가점검 체크리스트', 10, 'SSAFY에서 제공한 스켈레톤 코드 비중이 20% 이내인가?', 'O/X', NOW(), NOW()),
(57, 7, 6, 'self_check_open_source', 'VARCHAR(10)', '자가점검 체크리스트_3', TRUE, 15, '자가점검 체크리스트', 10, 'SSAFY에서 제공한 이미지, 데이터셋, 에셋 라이센스 등 프로젝트 개발 목적으로 제공된 리소스 원본이 포함되지 않았는가?', 'O/X', NOW(), NOW()),
(58, 7, 6, 'self_check_third_party', 'VARCHAR(10)', '자가점검 체크리스트_4', TRUE, 17, '자가점검 체크리스트', 10,'SSAFY의 보안 기준 또는 타인의 저작권을 침해할 우려가 없는가?',  'O/X', NOW(), NOW()),
(59, 7, 6, 'self_check_security_check', 'VARCHAR(10)', '자가점검 체크리스트_5', TRUE, 19, '자가점검 체크리스트', 10, '참조된 소스코드, 라이브러리 등의 출처를 명시하였는가?', 'O/X', NOW(), NOW()),
(60, 7, 6, 'self_check_purpose_limit', 'VARCHAR(10)', '자가점검 체크리스트_6', TRUE, 21,'자가점검 체크리스트', 10, '학습용 프로젝트가 해당하지 않고 포트폴리오를 인정할 만한 독창적인 프로젝트 코드인가?', 'O/X', NOW(), NOW());

-- 소스코드 반출 검토 요청서 자가점검 체크리스트의 조치사항 필드 추가
INSERT INTO template_fields (id, template_id, role_id, name, type, field_label, is_required, `display_order`, `field_group`, max_length, description, placeholder, created_at, updated_at)
VALUES
-- 자가점검 체크리스트 항목별 조치사항
(92, 7, 6, 'self_check_code_review_action', 'TEXT', '항목1 조치사항', FALSE, 12, '자가점검 체크리스트', NULL, '본인(팀)이 직접 개발한 프로젝트 결과물인가?에 대한 조치사항', '필요시 조치사항 입력', NOW(), NOW()),

(93, 7, 6, 'self_check_ssafy_code_action', 'TEXT', '항목2 조치사항', FALSE, 14, '자가점검 체크리스트', NULL, 'SSAFY에서 제공한 스켈레톤 코드 비중이 20% 이내인가?에 대한 조치사항', '필요시 조치사항 입력', NOW(), NOW()),

(94, 7, 6, 'self_check_open_source_action', 'TEXT', '항목3 조치사항', FALSE, 16, '자가점검 체크리스트', NULL, 'SSAFY에서 제공한 이미지, 데이터셋, 에셋 라이센스 등 프로젝트 개발 목적으로 제공된 리소스 원본이 포함되지 않았는가?에 대한 조치사항', '필요시 조치사항 입력', NOW(), NOW()),

(95, 7, 6, 'self_check_third_party_action', 'TEXT', '항목4 조치사항', FALSE, 18, '자가점검 체크리스트', NULL, 'SSAFY의 보안 기준 또는 타인의 저작권을 침해할 우려가 없는가?에 대한 조치사항', '필요시 조치사항 입력', NOW(), NOW()),

(96, 7, 6, 'self_check_security_check_action', 'TEXT', '항목5 조치사항', FALSE, 20, '자가점검 체크리스트', NULL, '참조된 소스코드, 라이브러리 등의 출처를 명시하였는가?에 대한 조치사항', '필요시 조치사항 입력', NOW(), NOW()),

(97, 7, 6, 'self_check_purpose_limit_action', 'TEXT', '항목6 조치사항', FALSE, 22, '자가점검 체크리스트', NULL, '학습용 프로젝트가 해당하지 않고 포트폴리오로 인정할 만한 독창적인 프로젝트인가?에 대한 조치사항', '필요시 조치사항 입력', NOW(), NOW());


-- 노트북 반출 신청서
INSERT INTO template_fields (id, template_id, role_id, name, type, field_label, is_required, `display_order`, `field_group`, max_length, description, placeholder, created_at, updated_at)
VALUES
--  신청자 기본 정보
(61, 3, 6, 'export_date', 'DATE', '반출 일자', TRUE, 1, '반출 정보', NULL, '노트북 반출 날짜', 'YYYY-MM-DD', NOW(), NOW()),
(62, 3, 6, 'return_due_date', 'DATE', '반납 예정일', TRUE, 2, '반출 정보', NULL, '반납 예정 날짜', 'YYYY-MM-DD', NOW(), NOW()),
(63, 3, 6, 'location', 'VARCHAR(50)', '소속', TRUE, 3, '사용자 정보', 100, '소속 입력', '예: 대전 1반', NOW(), NOW()),
(64, 3, 6, 'student_id', 'VARCHAR(50)', '학번', TRUE, 4, '사용자 정보', 50, '학번 입력', '예: 1238000', NOW(), NOW()),
(65, 3, 6, 'contact_number', 'VARCHAR(50)', '연락처', TRUE, 5, '사용자 정보', 50, '연락처 입력', '예: 010-8336-8012', NOW(), NOW()),
(66, 3, 6, 'applicant_name', 'VARCHAR(50)', '이름', TRUE, 6, '사용자 정보', 100, '신청자 이름 입력', '예: 홍길동', NOW(), NOW());


-- 출결 확인서
INSERT INTO template_fields (id, template_id, role_id, name, type, field_label, is_required, `display_order`, `field_group`, max_length, description, placeholder, created_at, updated_at)
VALUES
    (67, 5, 6, 'student_name', 'VARCHAR(50)', '성명', TRUE, 1, '신청자 정보', 100, '신청자 성명 입력', '예: 홍길동', NOW(), NOW()),
    (68, 5, 6, 'student_birthdate', 'DATE', '생년월일', TRUE, 2, '신청자 정보', NULL, '생년월일 입력', 'YYYY-MM-DD', NOW(), NOW()),

-- 출결 정보
    (69, 5, 6, 'attendance_datetime', 'DATE', '일시', TRUE, 3, '출결 정보', NULL, '출결 날짜', 'YYYY-MM-DD ', NOW(), NOW()),
    (70, 5, 6, 'attendance_time', 'VARCHAR(10)', '출결 시간대 (오전/오후/종일)', TRUE, 4, '출결 정보', 10, '출결 시간대 선택', '오전/오후/종일 중 하나', NOW(), NOW()),

-- 공가 / 사유 선택
    (71, 5, 6, 'is_public_absence', 'VARCHAR(10)', '공가 / 사유', TRUE, 5, '출결 정보', NULL, '공가 또는 그 외 선택', '공가 /일반 사유 중 하나', NOW(), NOW()),

-- 선택한 사유 내용 (공가/사유 선택에 따라 자동 입력)
    (72, 5, 6, 'absence_reason', 'TEXT', '공가/사유 내용', TRUE, 6, '출결 정보', NULL, '공가 또는 일반 사유 내용', '예 : 병원 진료', NOW(), NOW()),

-- 세부 내용
    (73, 5, 6, 'absence_detail', 'TEXT', '세부 내용', TRUE, 7, '출결 정보', NULL, '세부 내용 입력', '예: 병원 진료 사유작성', NOW(), NOW()),

-- 장소 입력
    (74, 5, 6, 'location', 'VARCHAR(200)', '장소', TRUE, 8, '출결 정보', 200, '장소 입력', '예: 병원 명', NOW(), NOW()),

-- 신청자 정보
    (75, 5, 6, 'applicant_name', 'VARCHAR(50)', '이름', TRUE, 9, '신청자 정보', 100, '신청자 이름 입력', '예: 홍길동', NOW(), NOW()),
    (76, 5, 6, 'submitted_date', 'DATE', '신청 날짜', TRUE, 10, '신청 정보', NULL, '신청 날짜 입력', 'YYYY-MM-DD', NOW(), NOW()),

-- 증빙서류 (파일 여러 개 가능)
    (77, 5, 6, 'proof_documents', 'TEXT', '증빙서류 (이미지 URL 리스트)', TRUE, 11, '증빙서류', NULL, '증빙서류 업로드 (JSON 배열 형태)', '파일 여러 개 업로드 가능', NOW(), NOW());


-- 출결 변경서
INSERT INTO template_fields (id, template_id, role_id, name, type, field_label, is_required, `display_order`, `field_group`, max_length, description, placeholder, created_at, updated_at)
VALUES
--  신청자 기본 정보
(78, 6, 6, 'student_campus', 'VARCHAR(50)', '소속 캠퍼스', TRUE, 1, '신청자 정보', 100, '소속 캠퍼스 입력', '예: 서울캠퍼스', NOW(), NOW()),
(79, 6, 6, 'student_class', 'int', '반', TRUE, 2, '신청자 정보', 50, '반 입력', '예: 1', NOW(), NOW()),
(80, 6, 6, 'student_name', 'VARCHAR(50)', '성명', TRUE, 3, '신청자 정보', 100, '신청자 성명 입력', '예: 홍길동', NOW(), NOW()),
(81, 6, 6, 'student_birthdate', 'DATE', '생년월일', TRUE, 4, '신청자 정보', NULL, '생년월일 입력', 'YYYY-MM-DD', NOW(), NOW()),

-- 시스템 변경 요청 사유 (라디오 버튼 선택)
(82, 6, 6, 'attendance_issue_type', 'int', '시스템 변경 요청 사유', TRUE, 5, '출결 변경 사유', 50, '변경 요청 사유 선택', '1/2/3/4', NOW(), NOW()),

-- 기존 출결 정보 및 변경 정보
(83, 6, 6, 'original_attendance_datetime', 'DATETIME', '출결 일시', TRUE, 6, '출결 변경 정보', NULL, '기존 출결 일시 입력', 'YYYY-MM-DD HH:MM', NOW(), NOW()),
(84, 6, 6, 'updated_attendance_datetime', 'DATETIME', '변경 일시', TRUE, 7, '출결 변경 정보', NULL, '변경된 출결 일시 입력', 'YYYY-MM-DD HH:MM', NOW(), NOW()),

-- 변경 사유 상세 입력
(85, 6, 6, 'attendance_change_reason', 'TEXT', '변경 사유', TRUE, 8, '출결 변경 정보', NULL, '변경 사유 입력', '상세 내용을 입력하세요', NOW(), NOW()),

-- 신청자 정보
(86, 6, 6, 'applicant_name', 'VARCHAR(100)', '교육생명', TRUE, 9, '신청자 정보', 100, '신청자 이름 입력', '예: 홍길동', NOW(), NOW()),
(87, 6, 6, 'submitted_date', 'DATE', '신청 날짜', TRUE, 10, '신청 정보', NULL, '신청 날짜 입력', 'YYYY-MM-DD', NOW(), NOW());

-- 프로젝트 활용 동의서
INSERT INTO template_fields (id, template_id, role_id, name, type, field_label, is_required, `display_order`, `field_group`, max_length, description, placeholder, created_at, updated_at)
VALUES
--  프로젝트 이름
(88, 8, 6, 'project_name', 'VARCHAR(255)', '프로젝트 이름', TRUE, 1, '프로젝트 정보', 255, '프로젝트명 입력', '예: 뚝딱뚝Doc', NOW(), NOW()),
--  작성 날짜
(89, 8, 6, 'submitted_date', 'DATE', '날짜', TRUE, 2, '기본 정보', NULL, '동의서 작성 날짜 입력', 'YYYY-MM-DD', NOW(), NOW()),
--  교육생 생년월일
(90, 8, 6, 'student_birthdate', 'DATE', '생년월일', TRUE, 3, '기본 정보', NULL, '교육생 생년월일 입력', 'YYYY-MM-DD', NOW(), NOW()),
--  교육생 성명
(91, 8, 6, 'student_name', 'VARCHAR(50)', '성명', TRUE, 4, '기본 정보', 100, '교육생 성명 입력', '예: 홍길동', NOW(), NOW());

