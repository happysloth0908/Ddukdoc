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

        stage('Backend Build') {
            when {
                expression { return env.BACKEND_CHANGES == 'true' }
            }
            steps {
                dir('backend') {

                    // application-secret.yml 파일 생성
                    writeFile file: 'src/main/resources/application-secret.yml', text: "${APPLICATION_SECRET}"

                    // 환경변수를 application-dev.yml 또는 application-prod.yml에 적용
                    script {
                        def profileFile = "src/main/resources/application-${env.SPRING_PROFILE.split(',')[0]}.yml"

                        // 플레이스홀더를 Jenkins에 등록된 환경 변수로 대체
                        sh """
                        sed -i "s|\\\${DB_URL}|${DB_URL}|g" "${profileFile}"
                        sed -i "s|\\\${DB_USERNAME}|${DB_USERNAME}|g" "${profileFile}"
                        sed -i "s|\\\${DB_PASSWORD}|${DB_PASSWORD}|g" "${profileFile}"
                        """

                        // 여기에 추가 설정 작업들
                    }

                    sh 'chmod +x ./gradlew'
                    sh './gradlew clean build -x test'

                    // Docker 이미지 빌드
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

                    sh "docker rm -f backend-dev || true"

                    // Docker Compose 사용하여 배포
                    if (env.DEPLOY_ENV == 'production') {
                        sh "docker-compose -f /home/ubuntu/docker-compose-dev.yml up -d --force-recreate backend-prod"
                    } else {
                        sh "docker-compose -f /home/ubuntu/docker-compose-dev.yml up -d --force-recreate backend-dev"
                    }
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
            echo "환경 : ${env.DEPLOY_ENV} 성공!"
        }
        failure {
            echo "환경 : ${env.DEPLOY_ENV} 실패!"
        }
    }
}