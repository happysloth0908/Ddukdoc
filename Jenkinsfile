pipeline {
    agent any

    tools {
        nodejs 'NodeJS 22.14'  // Jenkins에 설정한 Node.js 이름 (Global Tool Configuration)
    }

    environment {
        // 기본값 설정
        DEPLOY_ENV = "${env.DEPLOY_ENV ?: 'development'}"
        // 변수 대체 방식 수정
        ENV_FILE = "active_${DEPLOY_ENV}_env.txt"
        ACTIVE_ENV = sh(script: "cat /home/ubuntu/${ENV_FILE} || echo 'blue'", returnStdout: true).trim()
        INACTIVE_ENV = "${ACTIVE_ENV == 'blue' ? 'green' : 'blue'}"
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
                    env.BLOCKCHAIN_CHANGES = changedFiles.contains('contracts/') ? 'true' : 'false'

                    echo "Frontend 변경 여부: ${env.FRONTEND_CHANGES}"
                    echo "Backend 변경 여부: ${env.BACKEND_CHANGES}"
                    echo "Blockchain API 변경 여부: ${env.BLOCKCHAIN_CHANGES}"
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

//        stage('Determine Active Environment') {
//            when {
//                expression { return env.BACKEND_CHANGES == 'true' }
//            }
//            steps {
//                script {
//
//                    // 디버깅
//                    sh "echo '--- 파일 존재 확인 ---'"
//                    sh "ls -la /home/ubuntu/ | grep active"
//
//                    sh "echo '--- 파일 내용 확인 ---'"
//                    sh "cat /home/ubuntu/active_dev_env.txt || echo '파일 읽기 실패'"
//
//                    sh "echo '--- 명령어 결과 테스트 ---'"
//                    def testResult = sh(script: "echo 'test output'", returnStdout: true).trim()
//                    echo "테스트 결과: ${testResult}"
//
//                    // 현재 활성화된 환경 확인
//                    if (env.DEPLOY_ENV == 'production') {
//                        // 여기서 바로 변수에 할당하지 않고 출력 확인
//                        echo "Production 환경 파일 읽기 시도"
//                        def activeEnvOutput = sh(script: "cat /home/ubuntu/active_prod_env.txt || echo 'blue'", returnStdout: true)
//                        echo "파일 내용 출력: ${activeEnvOutput}"
//                        // 변수 트림 후 할당
//                        def activeEnv = activeEnvOutput.trim()
//                        echo "트림 후 값: ${activeEnv}"
//                        // 환경 변수 설정
//                        env.ACTIVE_ENV = activeEnv
//                        env.INACTIVE_ENV = activeEnv == 'blue' ? 'green' : 'blue'
//                    } else {
//                        echo "개발 환경 파일 읽기 시도"
//                        def activeEnvOutput = sh(script: "cat /home/ubuntu/active_dev_env.txt || echo 'blue'", returnStdout: true)
//                        echo "파일 내용 출력: ${activeEnvOutput}"
//                        // 변수 트림 후 할당
//                        def activeEnv = activeEnvOutput.trim()
//                        echo "트림 후 값: ${activeEnv}"
//                        // 환경 변수 설정
//                        env.ACTIVE_ENV = activeEnv
//                        env.INACTIVE_ENV = activeEnv == 'blue' ? 'green' : 'blue'
//                    }
//
//                    echo "현재 활성 환경: ${env.ACTIVE_ENV}"
//                    echo "배포할 환경: ${env.INACTIVE_ENV}"
//                }
//            }
//        }

        stage('Blockchain API Build') {
            when {
                expression { return env.BLOCKCHAIN_CHANGES == 'true' }
            }
            steps {
                script {
                    try {
                        dir('contracts') {
                            // 환경변수 파일 처리
                            withCredentials([file(credentialsId: 'blockchain-api-env', variable: 'BLOCKCHAIN_ENV')]) {
                                sh '''
                            cp $BLOCKCHAIN_ENV .env.tmp
                            ls -la .env.tmp
                            mv -f .env.tmp .env
                            ls -la .env
                        '''
                            }

                            // Docker 이미지 빌드
                            sh "docker build -t blockchain-api:latest ."

                            // 이미지 생성 확인
                            sh "docker images | grep blockchain-api || echo '이미지가 없습니다'"
                        }
                    } catch (Exception e) {
                        env.FAILURE_STAGE = 'Blockchain API 빌드'
                        env.FAILURE_MESSAGE = e.getMessage()
                        throw e
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
                            // sh """
                            // docker build -t ddukdoc-backend:${env.DEPLOY_ENV} \
                            // --build-arg SPRING_PROFILE=${env.SPRING_PROFILE} . || echo "Docker 빌드 실패"
                            // """

                            if (env.DEPLOY_ENV == 'production') {
                                sh """
                                docker build -t ddukdoc-backend:production-${env.INACTIVE_ENV} \
                                --build-arg SPRING_PROFILE=${env.SPRING_PROFILE} . || echo "Docker 빌드 실패"
                                """
                            } else {
                                sh """
                                docker build -t ddukdoc-backend:development-${env.INACTIVE_ENV} \
                                --build-arg SPRING_PROFILE=${env.SPRING_PROFILE} . || echo "Docker 빌드 실패"
                                """
                            }

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

        stage('SonarQube Analysis - Backend') {
            when {
                allOf {
                    expression { return env.BACKEND_CHANGES == 'true' }
                    expression { return env.DEPLOY_ENV == 'development' }
                }
            }
            steps {
                script {
                    try {
                        withSonarQubeEnv('sonarqube') {
                            dir('backend') {
                                sh """
                                    ./gradlew sonar \\
                                    -Dsonar.projectKey=S12P21B108 \\
                                    -Dsonar.java.binaries=build/classes/java/main \\
                                    -Dsonar.java.source=17 \\
                                    -Dsonar.sourceEncoding=UTF-8 \\
                                    -Dsonar.exclusions=**/resources/**
                                """
                            }
                        }
                    } catch (Exception e) {
                        echo "SonarQube Backend 분석 중 오류가 발생했습니다: ${e.getMessage()}"
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

                            // dist 폴더가 있는지 확인
                            sh 'ls -la dist/ || echo "dist 폴더가 없습니다"'

                            // 환경에 맞게 dist 폴더 이름 변경 (이미 있으면 먼저 삭제)
                            sh "rm -rf ${env.DEPLOY_ENV} || true"
                            sh "mv dist ${env.DEPLOY_ENV}"
                            sh "ls -la ${env.DEPLOY_ENV}/"
                        }
                    } catch (Exception e) {
                        env.FAILURE_STAGE = 'Frontend 빌드'
                        env.FAILURE_MESSAGE = e.getMessage()
                        throw e
                    }
                }
            }
        }

        stage('SonarQube Analysis - Frontend') {
            when {
                allOf {
                    expression { return env.FRONTEND_CHANGES == 'true' }
                    expression { return env.DEPLOY_ENV == 'development' }
                }
            }
            steps {
                script {
                    try {
                        def scannerHome = tool 'sonarqube'
                        withSonarQubeEnv('sonarqube') {
                            dir('frontend') {
                                sh """
                                ${scannerHome}/bin/sonar-scanner \\
                                -Dsonar.projectKey=S12P21B108-fe \\
                                -Dsonar.sources=src \\
                                -Dsonar.sourceEncoding=UTF-8 \\
                                -Dsonar.typescript.tsconfigPath=sonar-tsconfig.json \\
                                -Dsonar.exclusions=node_modules/**
                                """
                            }
                        }
                    } catch (Exception e) {
                        echo "SonarQube Frontend 분석 중 오류가 발생했습니다: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Deploy Blockchain API') {
            when {
                expression { return env.BLOCKCHAIN_CHANGES == 'true' }
            }
            steps {
                script {
                    try {
                        // 그냥 항상 운영환경에서만 배포되도록 설정
                        sh "docker-compose -f /home/ubuntu/docker-compose-prod.yml config"
                        sh "docker-compose -f /home/ubuntu/docker-compose-prod.yml up -d --force-recreate blockchain-api"

                        // 컨테이너 실행 상태 확인
                        sh "docker ps | grep blockchain-api"
                    } catch (Exception e) {
                        env.FAILURE_STAGE = 'Blockchain API 배포'
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
                            //sh "docker-compose -f /home/ubuntu/docker-compose-prod.yml config"
                            // sh "docker-compose -f /home/ubuntu/docker-compose-prod.yml up -d --force-recreate backend-prod"
                            sh """
                                docker-compose -f /home/ubuntu/docker-compose-prod.yml stop backend-prod-${env.INACTIVE_ENV} || true
                                docker-compose -f /home/ubuntu/docker-compose-prod.yml rm -f backend-prod-${env.INACTIVE_ENV} || true
                                docker-compose -f /home/ubuntu/docker-compose-prod.yml up -d backend-prod-${env.INACTIVE_ENV}
                                """
                        } else {
                            // 개발 환경 배포
                            // sh "docker-compose -f /home/ubuntu/docker-compose-dev.yml config"
                            // sh "docker-compose -f /home/ubuntu/docker-compose-dev.yml up -d --force-recreate backend-dev"
                            sh """
                            docker-compose -f /home/ubuntu/docker-compose-dev.yml stop backend-dev-${env.INACTIVE_ENV} || true
                            docker-compose -f /home/ubuntu/docker-compose-dev.yml rm -f backend-dev-${env.INACTIVE_ENV} || true
                            docker-compose -f /home/ubuntu/docker-compose-dev.yml up -d backend-dev-${env.INACTIVE_ENV}
                            """
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
                        dir("frontend/${env.DEPLOY_ENV}") {
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


        stage('Healthcheck') {
            when {
                expression { return env.BACKEND_CHANGES == 'true' }
            }
            steps {
                script {
                    try {
                        // 새 배포가 정상적으로 시작되었는지 확인
                        def port
                        def healthUrl

                        if (env.DEPLOY_ENV == 'production') {
                            port = env.INACTIVE_ENV == 'blue' ? '8080' : '8081'
                            healthUrl = "http://backend-prod-${env.INACTIVE_ENV}:8085/api/actuator/health"
                        } else {
                            port = env.INACTIVE_ENV == 'blue' ? '8085' : '8086'
                            healthUrl = "http://backend-dev-${env.INACTIVE_ENV}:8085/api/actuator/health"
                        }

                        // 헬스체크 요청 및 응답 확인 (최대 10회 시도)
                        def isHealthy = false
                        def attempts = 0

                        while (!isHealthy && attempts < 15) {
                            def response = sh(script: "curl -s -o /dev/null -w '%{http_code}' ${healthUrl} || echo '000'", returnStdout: true).trim()

                            if (response == '200') {
                                isHealthy = true
                                echo "새 환경(${env.INACTIVE_ENV})이 정상 동작 중입니다."
                            } else {
                                attempts++
                                echo "헬스체크 실패 (${attempts}/10). 5초 후 다시 시도합니다... (응답 코드: ${response})"
                                sleep 5
                            }
                        }

                        if (!isHealthy) {
                            error "새 환경(${env.INACTIVE_ENV}) 헬스체크 실패. 배포를 중단합니다."
                        }
                    } catch (Exception e) {
                        env.FAILURE_STAGE = '헬스체크'
                        env.FAILURE_MESSAGE = e.getMessage()
                        throw e
                    }
                }
            }
        }

        stage('Switch Traffic (Optional)') {
            when {
                expression { return env.BACKEND_CHANGES == 'true' }
            }
            steps {
                script {
                    try {
                        // 자동 전환 여부 확인 (기본적으로 비활성화)
                        def autoSwitch = true

                        if (autoSwitch) {
                            echo "트래픽 자동 전환 시작: ${env.ACTIVE_ENV} -> ${env.INACTIVE_ENV}"

                            if (env.DEPLOY_ENV == 'production') {
                                // Nginx 설정 파일에서 활성 환경 변수 업데이트
                                sh """
                                sed -i 's/set \\\$active_backend "backend-prod-[^"]*";/set \\\$active_backend "backend-prod-${env.INACTIVE_ENV}";/g' /home/ubuntu/nginx/conf/default.conf
                                
                                # Nginx 설정 테스트 및 리로드
                                docker exec nginx nginx -t && docker exec nginx nginx -s reload
                                
                                # 활성 환경 정보 저장
                                echo "${env.INACTIVE_ENV}" > /home/ubuntu/active_prod_env.txt
                                """
                            } else {
                                // 개발 환경 Nginx 설정 업데이트
                                sh """
                                sed -i 's/server backend-dev-[^:]*:8085;/server backend-dev-${env.INACTIVE_ENV}:8085;/g' /home/ubuntu/nginx/conf/dev.conf
                                
                                # Nginx 설정 테스트 및 리로드
                                docker exec nginx nginx -t && docker exec nginx nginx -s reload
                                
                                # 활성 환경 정보 저장
                                echo "${env.INACTIVE_ENV}" > /home/ubuntu/active_dev_env.txt
                                """
                            }

                            echo "트래픽 전환 완료: ${env.ACTIVE_ENV} -> ${env.INACTIVE_ENV}"
                        } else {
                            echo "자동 트래픽 전환이 비활성화되어 있습니다. 필요시 switch-environment.sh 스크립트를 사용하여 수동으로 전환하세요."
                            echo "전환 명령어: sudo /home/ubuntu/switch-environment.sh ${env.DEPLOY_ENV}"
                        }
                    } catch (Exception e) {
                        env.FAILURE_STAGE = '트래픽 전환'
                        env.FAILURE_MESSAGE = e.getMessage()
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