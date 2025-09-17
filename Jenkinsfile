pipeline {

    agent any

    environment {
        NETLIFY_SITE_ID = '19e6486f-30b6-40e4-8e6c-0906e445989f'
        NETLIFY_AUTH_TOKEN = credentials('netlify-token')
        REACT_APP_VERSION = "1.0.$BUILD_ID"
    }

    stages {
        
        stage('Build') {
            agent{
                docker{
                    image 'node:18-alpine'
                    reuseNode true
            }
            steps {
                sh '''
                    npm install
                    npm run build
                '''
            }
        }

        stage('Tests'){
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    npm test
                ''' 
            }
            post {
                always {
                    junit 'jest-results/junit.xml'
                }
            }
        }

        stage ('Deploy to Staging') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }

            steps {
                sh '''
                    npm install netlify-cli@20.1.1
                    npm install node-jq
                    ./node_modules/.bin/netlify status
                    ./node_modules/.bin/netlify deploy --dir=build --json > deploy-staging-output.json
                '''
                script {
                    env.STAGING_URL = sh(script: "node_modules/.bin/node-jq -r '.deploy_url' deploy-staging-output.json", returnStdout: true)
                }    
            }

        }

        stage ('Staging E2E Tests') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.54.0-noble'
                    reuseNode true 
                }
            }

            environment {
                CI_ENVIRONMENT_URL = "${env.STAGING_URL}"
            }

            steps {
                sh '''
                    npx playwright test --reporter=html
                ''' 
            }
            post {
                always {
                    publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright HTML Report', useWrapperFileDirectly: true])
                }
            }
        }

        stage ('Approval for Production') {
            steps {
                timeout(time: 15, unit: 'MINUTES') {
                    input message: 'Approve deployment to production?', ok: 'Deploy'
                }
            }
        }

        stage ('Deploy Production') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }

            steps {
                sh '''
                    npm install netlify-cli@20.1.1
                    ./node_modules/.bin/netlify status
                    ./node_modules/.bin/netlify deploy --dir=build --prod
                '''    
            }

        }
    }
}