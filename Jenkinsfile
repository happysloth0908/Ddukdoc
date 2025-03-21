pipeline {
    agent any

    tools {
        nodejs 'NodeJS 22.14'  // Jenkins에 설정한 Node.js 이름 (Global Tool Configuration)
    }

    stages {
        stage('Debug Variables') {
            steps {
                echo "DEPLOY_ENV: ${env.DEPLOY_ENV}"
                echo "SPRING_PROFILE: ${env.SPRING_PROFILE}"
                echo "DEPLOY_PATH: ${env.DEPLOY_PATH}"
                echo "DB 관련 환경변수가 설정되어 있는지 확인합니다."
                sh 'env | grep DB_ || echo "DB 환경변수가 없습니다"'
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Changes') {
            steps {
                script {
                    // 변경된 파일 목록 가져오기
                    def changedFiles = sh(script: "git diff --name-only HEAD^ HEAD || echo 'initial commit'", returnStdout: true).trim()

                    env.FRONTEND_CHANGES = changedFiles.contains('frontend/') ? 'true' : 'false'
                    env.BACKEND_CHANGES = changedFiles.contains('backend/') ? 'true' : 'false'

                    echo "Frontend 변경 여부: ${env.FRONTEND_CHANGES}"
                    echo "Backend 변경 여부: ${env.BACKEND_CHANGES}"
                }
            }
        }

        stage('Network Check') {
            steps {
                script {
                    def networkExists = sh(script: "docker network ls | grep app-network || true", returnStdout: true).trim()
                    if (networkExists.isEmpty()) {
                        sh "docker network create app-network"
                        echo "app-network 생성됨"
                    } else {
                        echo "app-network 이미 존재함"
                    }
                }
            }
        }

        stage('Backend Build') {
            when {
                expression { return env.BACKEND_CHANGES == 'true' }
            }
            steps {
                dir('backend') {
                    // application-secret.yml 파일 생성
                    withCredentials([file(credentialsId: 'APPLICATION-SECRET', variable: 'APP_SECRET')]) {
//                         sh 'echo "$APP_SECRET" > src/main/resources/application-secret.yml'
//                         sh 'ls -la src/main/resources/application-secret.yml || echo "파일 생성 실패"'
                        sh '''
                            cp "$APP_SECRET" src/main/resources/application-secret.yml
                            chmod 644 src/main/resources/application-*.yml
                        '''
                    }

                    // 환경변수를 application-dev.yml 또는 application-prod.yml에 적용
                    script {
                        // 프로파일 파일 존재 확인
                        def profileName = env.SPRING_PROFILE.split(',')[0]
                        def profileFile = "src/main/resources/application-${profileName}.yml"

                        sh "ls -la src/main/resources/ | grep application"
                        sh "ls -la ${profileFile} || echo '프로파일 파일이 없습니다'"

                        // 플레이스홀더를 Jenkins에 등록된 환경 변수로 대체
                        sh """
                        sed -i "s|\\\${DB_URL}|${env.DB_URL}|g" "${profileFile}" || echo "DB_URL 치환 실패"
                        sed -i "s|\\\${DB_USERNAME}|${env.DB_USERNAME}|g" "${profileFile}" || echo "DB_USERNAME 치환 실패"
                        sed -i "s|\\\${DB_PASSWORD}|${env.DB_PASSWORD}|g" "${profileFile}" || echo "DB_PASSWORD 치환 실패"
                        """
                    }

                    sh 'chmod +x ./gradlew'
                    sh './gradlew clean build -x test'

                    // 빌드 결과물 확인
                    sh 'ls -la build/libs/ || echo "빌드 실패"'

                    // Docker 이미지 빌드
                    sh """
                    docker build -t ddukdoc-backend:${env.DEPLOY_ENV} \
                    --build-arg SPRING_PROFILE=${env.SPRING_PROFILE} . || echo "Docker 빌드 실패"
                    """

                    // 이미지 생성 확인
                    sh "docker images | grep ddukdoc-backend || echo '이미지가 없습니다'"
                }
            }
        }

        stage('Frontend Build') {
            when {
                expression { return env.FRONTEND_CHANGES == 'true' }
            }
            steps {
                dir('frontend') {
                    // 환경에 따른 .env 파일 선택
                    withCredentials([file(credentialsId: 'frontend-env-file', variable: 'ENV_FILE')]) {
                        sh '''
                            cp $ENV_FILE .env.tmp
                            ls -la .env.tmp  # 생성된 권한 확인
                            mv -f .env.tmp .env
                            ls -la .env      # 교체 후 권한 확인
                        '''
                    }

                    // 직접 npm 명령어 실행 (Docker 없이)
                    sh 'node -v'  // Node.js 버전 확인
                    sh 'npm -v'   // npm 버전 확인
                    sh 'npm install'
                    sh 'npm run build'

                    // 빌드 결과물 확인
                    sh 'ls -la build/ || echo "빌드 디렉토리가 없습니다"'
                }
            }
        }

        stage('Deploy Backend') {
            when {
                expression { return env.BACKEND_CHANGES == 'true' }
            }
            steps {
                script {
                    // docker-compose 파일 존재 여부 확인
                    sh "ls -la /home/ubuntu/docker-compose-dev.yml || echo 'docker-compose 파일이 없습니다'"

                    // 기존 컨테이너 제거
                    sh "docker rm -f backend-dev || true"

                    // Docker Compose 대신 직접 실행 시도
                    if (env.DEPLOY_ENV == 'production') {
                        // 프로덕션 환경 배포
                        try {
                            sh "docker-compose -f /home/ubuntu/docker-compose-dev.yml up -d backend-prod"
                        } catch (Exception e) {
                            echo "Docker Compose 실행 실패, Docker run으로 시도합니다."
                            sh """
                            docker run -d --name backend-prod \
                            --network app-network \
                            -p 8080:8080 \
                            -e SERVER_PORT=8080 \
                            -e SPRING_PROFILES_ACTIVE=${env.SPRING_PROFILE} \
                            --restart unless-stopped \
                            ddukdoc-backend:${env.DEPLOY_ENV}
                            """
                        }
                    } else {
                        // 개발 환경 배포
                        try {
                            sh "docker-compose -f /home/ubuntu/docker-compose-dev.yml config"
                            sh "docker-compose -f /home/ubuntu/docker-compose-dev.yml up -d backend-dev"
                        } catch (Exception e) {
                            echo "Docker Compose 실행 실패, Docker run으로 시도합니다."
                            sh """
                            docker run -d --name backend-dev \
                            --network app-network \
                            -p 8085:8085 \
                            -e SERVER_PORT=8085 \
                            -e SPRING_PROFILES_ACTIVE=${env.SPRING_PROFILE} \
                            --restart unless-stopped \
                            ddukdoc-backend:${env.DEPLOY_ENV}
                            """
                        }
                    }

                    // 컨테이너 실행 상태 확인
                    sh "docker ps | grep backend || echo '백엔드 컨테이너가 실행되지 않았습니다'"
                }
            }
        }

        stage('Deploy Frontend') {
            when {
                expression { return env.FRONTEND_CHANGES == 'true' }
            }
            steps {
                dir('frontend/build') {
                    // 배포 경로 확인 및 생성
                    sh "mkdir -p ${env.DEPLOY_PATH} || echo '디렉토리 생성 실패'"
                    sh "rm -rf ${env.DEPLOY_PATH}/* || echo '파일 삭제 실패'"
                    sh "cp -r * ${env.DEPLOY_PATH}/ || echo '파일 복사 실패'"
                    sh "ls -la ${env.DEPLOY_PATH}/ || echo '배포 경로 확인 실패'"
                }
            }
        }
    }

    post {
        success {
            echo "환경 : ${env.DEPLOY_ENV} 배포 성공!"
            sh "docker ps | grep backend"
        }
        failure {
            echo "환경 : ${env.DEPLOY_ENV} 배포 실패!"
            echo "실패 원인을 확인합니다."
            sh "docker ps -a | grep backend || echo '백엔드 컨테이너가 없습니다'"
        }
        always {
            echo "빌드 및 배포 과정이 종료되었습니다."
        }
    }
}