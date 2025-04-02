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
                script {
                    try {
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
                        sed -i "s|\\\${REDIS_HOST}|${env.REDIS_HOST}|g" "${profileFile}" || echo "REDIS_HOST 치환 실패"
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
                    } catch (Exception e) {
                        // 오류 메시지 저장
                        env.FAILURE_STAGE = 'Backend 빌드'
                        env.FAILURE_MESSAGE = e.getMessage()
                        // 오류를 다시 던져서 파이프라인 실패 처리
                        throw e
                    }
                }
            }
        }

        stage('Frontend Build') {
            when {
                expression { return env.FRONTEND_CHANGES == 'true' }
            }
            steps {
                script {
                    try {
                        dir('frontend') {
                            withCredentials([file(credentialsId: 'frontend-env-file', variable: 'ENV_FILE')]) {
                                sh '''
                            cp $ENV_FILE .env.tmp
                            ls -la .env.tmp
                            mv -f .env.tmp .env
                            ls -la .env
                            sed -i "s|\\\\${URL}|${URL}|g" .env || echo ".env에서 URL 치환 실패"
                            cat .env  # 치환 결과 확인용
                        '''
                            }

                            sh 'node -v'
                            sh 'npm -v'
                            sh 'npm install'
                            sh 'npm run build'

                            sh 'ls -la ${DEPLOY_ENV}/'

                            // dist 폴더가 있는지 확인
                            sh 'ls -la dist/ || echo "dist 폴더가 없습니다"'

                            // 환경에 맞게 dist 폴더 이름 변경 (이미 있으면 먼저 삭제)
                            sh 'rm -rf ${DEPLOY_ENV} || true'
                            sh 'mv dist ${DEPLOY_ENV}'
                            sh 'ls -la ${DEPLOY_ENV}/'
                        }
                    } catch (Exception e) {
                        env.FAILURE_STAGE = 'Frontend 빌드'
                        env.FAILURE_MESSAGE = e.getMessage()
                        throw e
                    }
                }
            }
        }

        stage('Deploy Backend') {
            when {
                expression { return env.BACKEND_CHANGES == 'true' }
            }
            steps {
                script {
                    try {
                        if (env.DEPLOY_ENV == 'production') {
                            try {
                                sh "docker-compose -f /home/ubuntu/docker-compose-prod.yml config"
                                sh "docker-compose -f /home/ubuntu/docker-compose-prod.yml up -d --force-recreate backend-prod"
                            } catch (Exception e) {
                                echo "Docker Compose 실행 실패, Docker run으로 시도합니다."
                                sh "docker rm -f backend-prod || true"
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
                                sh "docker-compose -f /home/ubuntu/docker-compose-dev.yml up -d --force-recreate backend-dev"
                            } catch (Exception e) {
                                echo "Docker Compose 실행 실패, Docker run으로 시도합니다."
                                sh "docker rm -f backend-dev || true"
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
                        sh "docker ps | grep backend"
                    } catch (Exception e) {
                        env.FAILURE_STAGE = 'Backend 배포'
                        env.FAILURE_MESSAGE = e.getMessage()
                        throw e
                    }
                }
            }
        }

        stage('Deploy Frontend') {
            when {
                expression { return env.FRONTEND_CHANGES == 'true' }
            }
            steps {
                script {
                    try {
                        dir('frontend/${env.DEPLOY_ENV}') {
                            // 배포 경로 확인 및 생성
                            sh "mkdir -p ${env.DEPLOY_PATH}"
                            sh "rm -rf ${env.DEPLOY_PATH}/*"
                            sh "cp -r * ${env.DEPLOY_PATH}/"
                            sh "ls -la ${env.DEPLOY_PATH}/"
                        }
                    } catch (Exception e) {
                        // 오류 메시지 저장
                        env.FAILURE_STAGE = 'Frontend 배포'
                        env.FAILURE_MESSAGE = e.getMessage()
                        // 오류를 다시 던져서 파이프라인 실패 처리
                        throw e
                    }
                }
            }
        }
    }

    post {
        success {
            echo "환경 : ${env.DEPLOY_ENV} 배포 성공!"
            sh "docker ps | grep backend"

            script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                def changes = ""

                if (env.FRONTEND_CHANGES == 'true') {
                    changes += "Frontend"
                }
                if (env.BACKEND_CHANGES == 'true') {
                    if (changes) {
                        changes += ", Backend"
                    } else {
                        changes += "Backend"
                    }
                }
                if (!changes) {
                    changes = "설정 변경"
                }

                mattermostSend(
                        color: 'good',
                        message: "✅ 배포 성공: ${env.JOB_NAME} #${env.BUILD_NUMBER}\n" +
                                "👤 작성자: ${Author_ID} (${Author_Name})\n" +
                                "🔄 변경사항: ${changes}\n" +
                                "🌐 환경: ${env.DEPLOY_ENV}\n" +
                                "🔍 <${env.BUILD_URL}|상세 정보 보기>",
                        endpoint: 'https://meeting.ssafy.com/hooks/pmu7f349wb8y5q1djoar94k8mc',
                        channel: '78077804f0d7f41a4976e15a024145e8'
                )
            }
        }

        failure {
            echo "환경 : ${env.DEPLOY_ENV} 배포 실패!"
            echo "실패 원인을 확인합니다."
            sh "docker ps -a | grep backend || echo '백엔드 컨테이너가 없습니다'"

            script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()

                // 실패 단계와 메시지 확인
                def failStage = env.FAILURE_STAGE ?: "알 수 없음"
                def failMessage = env.FAILURE_MESSAGE ?: "자세한 로그를 확인해주세요"

                mattermostSend(
                        color: 'danger',
                        message: "❌ 배포 실패: ${env.JOB_NAME} #${env.BUILD_NUMBER}\n" +
                                "👤 작성자: ${Author_ID} (${Author_Name})\n" +
                                "⚠️ 실패 단계: ${failStage}\n" +
                                "📝 실패 내용: ${failMessage}\n" +
                                "🌐 환경: ${env.DEPLOY_ENV}\n" +
                                "🔍 <${env.BUILD_URL}|상세 정보 보기>",
                        endpoint: 'https://meeting.ssafy.com/hooks/pmu7f349wb8y5q1djoar94k8mc',
                        channel: '78077804f0d7f41a4976e15a024145e8'
                )
            }
        }

        always {
            echo "빌드 및 배포 과정이 종료되었습니다."
        }
    }
}