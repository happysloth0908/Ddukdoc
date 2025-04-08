FROM openjdk:17-jdk-slim

ARG JAR_FILE=build/libs/*.jar

# jar 파일 복제
COPY ${JAR_FILE} app.jar

# docker-compose에서 설정한 SPRING_PROFILES_ACTIVE 환경변수를 사용..........
ENTRYPOINT ["java", "-jar", "app.jar"]