pipeline {
    agent any

    environment {
        // application-secret.yml 내용을 credentials에서 가져오기
        APPLICATION_SECRET = credentials('APPLICATION-SECRET')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Determine Environment') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'main' || env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'prod') {
                        env.DEPLOY_ENV = 'production'
                        env.BACKEND_PORT = '8080'
                        env.BACKEND_CONTAINER = 'backend-prod'
                        env.DEPLOY_PATH = '/usr/share/nginx/html'
                        env.SPRING_PROFILE = 'prod,secret'
                    } else if (env.BRANCH_NAME == 'develop' || env.BRANCH_NAME == 'dev') {
                        env.DEPLOY_ENV = 'development'
                        env.BACKEND_PORT = '8085'
                        env.BACKEND_CONTAINER = 'backend-dev'
                        env.DEPLOY_PATH = '/usr/share/nginx/html/dev'
                        env.SPRING_PROFILE = 'dev,secret'
                    } else {
                        error "Branch ${env.BRANCH_NAME} is not configured for deployment"
                    }

                    echo "Deploying to ${env.DEPLOY_ENV} environment"
                }
            }
        }

        stage('Check Changes') {
            steps {
                script {
                    // 변경된 파일 목록 가져오기
                    def changedFiles = sh(script: "git diff --name-only HEAD^ HEAD || echo 'initial commit'", returnStdout: true).trim()

                    env.FRONTEND_CHANGES = changedFiles.contains('frontend/') ? 'true' : 'false'
                    env.BACKEND_CHANGES = changedFiles.contains('backend/') ? 'true' : 'false'

                    echo "Frontend changes: ${env.FRONTEND_CHANGES}"
                    echo "Backend changes: ${env.BACKEND_CHANGES}"
                }
            }
        }

        stage('Backend Build') {
            when {
                expression { return env.BACKEND_CHANGES == 'true' }
            }
            steps {
                dir('backend') {
                    // 1. application-secret.yml 파일 생성
                    writeFile file: 'src/main/resources/application-secret.yml', text: "${APPLICATION_SECRET}"

                    // 2. 환경변수를 application-dev.yml 또는 application-prod.yml에 적용
                    script {
                        def profileFile = "src/main/resources/application-${env.SPRING_PROFILE.split(',')[0]}.yml"

                        // 플레이스홀더를 Jenkins에 등록된 환경 변수로 대체
                        sh """
                        sed -i "s|\\\${DB_URL}|${DB_URL}|" "${profileFile}"
                        sed -i "s|\\\${DB_USERNAME}|${DB_USERNAME}|" "${profileFile}"
                        sed -i "s|\\\${DB_PASSWORD}|${DB_PASSWORD}|" "${profileFile}"
                        """

                        // 환경에 따라 Redis 호스트 설정
                        if (env.DEPLOY_ENV == 'development') {
                            // 개발 환경에서는 docker-compose의 redis-dev 컨테이너 사용
                            sh """
                            sed -i "s|localhost|redis-dev|" "${profileFile}"
                            """
                        } else {
                            // 운영 환경에서는 ElastiCache 엔드포인트 사용
                            sh """
                            sed -i "s|localhost|${REDIS_ENDPOINT}|" "${profileFile}"
                            """
                        }

                        // 결과 확인 (디버깅용, 실제 배포 시 제거)
                        sh "cat ${profileFile}"
                    }

                    // 3. 빌드 수행
                    sh 'chmod +x ./gradlew'
                    sh './gradlew clean build -x test'

                    // 4. Docker 이미지 빌드 - 프로필만 전달하고 나머지는 yml에 직접 주입됨
                    sh """
                    docker build -t ddukdoc-backend:${env.DEPLOY_ENV} \
                    --build-arg SPRING_PROFILE=${env.SPRING_PROFILE} .
                    """
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
                    script {
                        if (env.DEPLOY_ENV == 'production') {
                            sh 'cp .env.production .env'
                        } else {
                            sh 'cp .env.development .env'
                        }
                    }

                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy Backend') {
            when {
                expression { return env.BACKEND_CHANGES == 'true' }
            }
            steps {
                script {
                    // 기존 컨테이너 중지 및 제거
                    sh "docker stop ${env.BACKEND_CONTAINER} || true"
                    sh "docker rm ${env.BACKEND_CONTAINER} || true"

                    // 새 컨테이너 실행 - 프로필만 환경 변수로 전달 (나머지는 yml에 포함됨)
                    sh """
                    docker run -d --name ${env.BACKEND_CONTAINER} \
                    --network app-network \
                    -p ${env.BACKEND_PORT}:${env.BACKEND_PORT} \
                    -e SERVER_PORT=${env.BACKEND_PORT} \
                    -e SPRING_PROFILES_ACTIVE=${env.SPRING_PROFILE} \
                    ddukdoc-backend:${env.DEPLOY_ENV}
                    """
                }
            }
        }

        stage('Deploy Frontend') {
            when {
                expression { return env.FRONTEND_CHANGES == 'true' }
            }
            steps {
                dir('frontend/build') {
                    sh "rm -rf ${env.DEPLOY_PATH}/*"
                    sh "cp -r * ${env.DEPLOY_PATH}/"
                }
            }
        }
    }

    post {
        success {
            echo "Deployment to ${env.DEPLOY_ENV} completed successfully!"
        }
        failure {
            echo "Deployment to ${env.DEPLOY_ENV} failed!"
        }
    }
}