pipeline {
    agent any // Run pipeline on any available Jenkins agent

    stages {
        
        stage('Build') {
            agent{
                docker{ // Use a Docker container as build environment
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
            parallel {
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
                stage ('E2E Tests') {
                    agent {
                        docker {
                            image 'mcr.microsoft.com/playwright:v1.54.0-noble'
                            reuseNode true 
                        }
                    }
                    steps {
                        // Serve the built application in the background, save the server process ID, and wait for it to be ready
                        // Run Playwright end-to-end tests with an HTML report
                        // Finally stop the server to clean up the process
                        sh '''
                            npm install serve
                            node_modules/.bin/serve -s build &
                            SERVER_PID=$!
                            sleep 10
                            npx playwright test --reporter=html
                            kill $SERVER_PID
                        ''' 
                    }
                    post {
                        always {
                            // Publish Playwright HTML report in Jenkins UI
                            publishHTML([
                                allowMissing: false, 
                                alwaysLinkToLastBuild: false, 
                                keepAll: false, 
                                reportDir: 'playwright-report', 
                                reportFiles: 'index.html', 
                                reportName: 'Playwright HTML Report', 
                                useWrapperFileDirectly: true])
                        }
                    }
                }
            }
        }

        stage ('Deploy') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }

            steps {
                // Install Netlify CLI inside the Docker container, specifically in the local project directory not globally (- g) because of permission issues.
                sh '''
                    npm install netlify-cli
                    node_modules/.bin/netlify --version
                '''    
            }

        }
    }
    
}