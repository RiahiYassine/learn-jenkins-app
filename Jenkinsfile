pipeline {

    agent any // Run pipeline on any available Jenkins agent

    environment {
        NETLIFY_SITE_ID = '19e6486f-30b6-40e4-8e6c-0906e445989f'
        NETLIFY_AUTH_TOKEN = credentials('netlify-token') // Use Jenkins credentials for Netlify authentication
    }

    stages {
        
        stage('Build') {
            agent{
                docker{
                    image 'node:18-alpine'
                    reuseNode true // workspace will be reused across stages
                }
            }
            steps {
                sh '''
                    npm install
                    npm run build
                '''
            }
        }

        stage('Tests'){
            stage ('Unit Tests') {
                agent {
                    docker {
                        image 'node:18-alpine'
                        reuseNode true // Reuse workspace to access node_modules and build artifacts
                    }
                }
                steps {
                    sh '''
                        npm test
                    ''' 
                }
                post {
                    always {
                        junit 'jest-results/junit.xml' // Publish JUnit test results for Jenkins reporting
                    }
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
                // Install Netlify CLI inside the Docker container, specifically in the local project directory not globally (- g) because of permission issues.
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
                always { // Publish Playwright HTML report in Jenkins UI
                    publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright HTML Report', useWrapperFileDirectly: true])
                }
            }
        }

        stage ('Approval for Production') {
            steps {
                timeout(time: 15, unit: 'MINUTES') { // Wait for manual approval for 15 minute
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
                // Install Netlify CLI inside the Docker container, specifically in the local project directory not globally (- g) because of permission issues.
                sh '''
                    npm install netlify-cli@20.1.1
                    ./node_modules/.bin/netlify status
                    ./node_modules/.bin/netlify deploy --dir=build --prod
                '''    
            }

        }
    }
    
}