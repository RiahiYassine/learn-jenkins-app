pipeline {
    agent any

    stages {
        
        /*
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
                    npm ci
                    npm run build
                    ls -la
                '''
            }
        }
        */
        stage ('Test') {
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
                    npm install -g serve
                    serve -s build
                    npx playwright test
                ''' 
            }
        }

    }


    post {
        always {
            junit 'test-results/junit.xml' // Publish JUnit test results
        }
    }

}
