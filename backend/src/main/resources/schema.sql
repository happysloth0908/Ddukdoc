-- 테스트 사용자 추가 (ID 9999로 고정 - 기억하기 쉬운 숫자)
INSERT INTO users (id, email, name, social_provider, social_key, user_type, created_at, updated_at)
VALUES (1, 'test@example.com', 'TestUser', 'KAKAO','test123','TEST', NOW(), NOW());

-- 필요한 경우 추가 사용자 권한 정보 등을 더 넣을 수 있습니다.
-- 예: 관리자 권한 테스트 사용자
INSERT INTO users (id, email, name, social_provider, social_key, user_type, created_at, updated_at)
VALUES (2, 'admin@example.com', 'AdminUser','KAKAO','test124', 'ADMIN', NOW(), NOW());