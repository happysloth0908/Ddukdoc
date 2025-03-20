pipeline {
    agent any

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
                    // Docker Compose 사용하여 배포
                    if (env.DEPLOY_ENV == 'production') {
                        sh "docker-compose -f docker-compose-prod.yml up -d --force-recreate backend-prod"
                    } else {
                        sh "docker-compose -f docker-compose-dev.yml up -d --force-recreate backend-dev"
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
            echo "Deployment to ${env.DEPLOY_ENV} completed successfully!"
        }
        failure {
            echo "Deployment to ${env.DEPLOY_ENV} failed!"
        }
    }
}