pipeline {
    agent any

    stages {
        

        stage('Build') {
            agent{
                docker{ // Setting up the build environment in a Docker container
                    image 'node:18-alpine'
                    reuseNode true // workspace will be reused across stages
                }
            }
            steps {
                sh '''
                    ls -la
                    npm install
                    npm run build
                    ls -la
                '''
            }
        }
        
        stage('Run Tests'){
            parallel {
                stage ('Unit Tests') {
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
                            junit 'jest-results/junit.xml' // Publish JUnit test results
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
                        sh '''
                            npm install serve
                            node_modules/.bin/serve -s build &
                            sleep 10
                            npx playwright test --reporter=html
                        ''' 
                    }
                    post {
                        always {
                            publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, icon: '', keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'Playwright HTML Report', reportTitles: '', useWrapperFileDirectly: true])
                        }
                    }
                }
            }
        }
    }
    

}
