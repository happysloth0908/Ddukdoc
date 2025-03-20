FROM openjdk:17-jdk-slim

ARG JAR_FILE=build/libs/*.jar

# 기본 값 dev지만 JenkinsFile에서 환경에 따라 덮어씌울 예정
ARG SPRING_PROFILE=dev

# jar 파일 복제
COPY ${JAR_FILE} app.jar

# 실행 명령어
ENTRYPOINT ["java", "-Dspring.profiles.active=${SPRING_PROFILE}", "-jar", "app.jar"]