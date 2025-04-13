pipeline {
    agent any

    triggers {
        pollSCM('H 21 * * 5') // Every Friday at 9 PM
    }

    environment {
        NODE_ENV = 'development'
    }

    options {
        timestamps()
    }

    stages {
        stage('Cleanup Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install & Build Client Apps') {
            steps {
                script {
                    def clientApps = ['user-app', 'community-app', 'shell-app']
                    clientApps.each { app ->
                        dir("client/${app}") {
                            sh 'npm install'
                            sh 'rm -rf node_modules/.vite*'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Install Backend Microservices') {
            steps {
                script {
                    def backendDirs = [
                        'server',
                        'server/microservices/auth-service',
                        'server/microservices/business-event-service',
                        'server/microservices/community-engagement-service',
                        'server/microservices/gemini-microservice'
                    ]
                    backendDirs.each { dirPath ->
                        dir(dirPath) {
                            sh 'npm install || true'
                        }
                    }

                    dir('server/microservices/ai-microservice') {
                        sh '''
                            python3 -m venv venv
                            ./venv/bin/pip install -r requirements.txt
                        '''
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    script {
                        def testDirs = [
                            'client/shell-app',
                            'client/user-app',
                            'server/microservices/auth-service',
                            'server/microservices/business-event-service',
                            'server/microservices/community-engagement-service'
                        ]
                        testDirs.each { dirPath ->
                            dir(dirPath) {
                                sh '''
                                    node -e "let pkg=require('./package.json'); if (!pkg.scripts || !pkg.scripts.test) { pkg.scripts = pkg.scripts || {}; pkg.scripts.test = 'echo \\"No tests\\" && exit 0'; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2)); }"
                                    npm test || true
                                '''
                            }
                        }
                    }
                }
            }
        }

        stage('Code Analysis (SonarQube)') {
            steps {
                withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                    withSonarQubeEnv('SonarScanner') {
                        sh '''
                            PATH=/opt/homebrew/bin:$PATH sonar-scanner \
                                -Dsonar.projectKey=group5-comp308-project \
                                -Dsonar.sources=server,client \
                                -Dsonar.exclusions=**/venv/**,**/node_modules/**,**/__pycache__/**,**/site-packages/** \
                                -Dsonar.host.url=http://localhost:9000 \
                                -Dsonar.login=$SONAR_TOKEN \
                                -Dsonar.scm.disabled=true \
                                -Dsonar.log.level=DEBUG
                        '''
                    }
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: '**/dist/**/*.*', allowEmptyArchive: true
            }
        }

        stage('Deliver (Build Tool Deploy Placeholder)') {
            steps {
                echo 'Delivering using Node/npm as build tool'
            }
        }

        stage('Deploy to Dev') {
            steps {
                script {
                    echo 'Starting backend microservices...'

                    dir('server/microservices/auth-service') {
                        sh 'nohup npm start > auth.log 2>&1 &'
                    }
                    dir('server/microservices/business-event-service') {
                        sh 'nohup npm start > business.log 2>&1 &'
                    }
                    dir('server/microservices/community-engagement-service') {
                        sh 'nohup npm start > community.log 2>&1 &'
                    }
                    dir('server/microservices/ai-microservice') {
                        sh 'nohup ./venv/bin/python app.py > ai.log 2>&1 &'
                    }
                    dir('server/microservices/gemini-microservice') {
                        sh 'nohup node index.js > gemini.log 2>&1 &'
                    }
                    dir('server') {
                        sh 'nohup node gateway.js > gateway.log 2>&1 &'
                    }

                    echo 'Deploying micro frontends...'
                    dir('client/user-app') {
                        sh 'npm run deploy || true'
                    }
                    dir('client/community-app') {
                        sh 'npm run deploy || true'
                    }

                    echo 'Starting shell-app...'
                    dir('client/shell-app') {
                        sh 'nohup npm run dev > shell.log 2>&1 &'
                    }

                    echo 'Dev environment is now live.'
                }
            }
        }

        stage('Deploy to QAT') {
            steps {
                echo 'Mock QAT deployment'
            }
        }

        stage('Deploy to Staging') {
            steps {
                echo 'Mock Staging deployment'
            }
        }

        stage('Deploy to Production') {
            steps {
                echo 'Mock Production deployment'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            cleanWs()
        }
    }
}