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
                    image 'mcr.microsoft.com/playwright:v1.39.0-jammy'
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
        }

    }


    post {
        always {
            junit 'test-results/junit.xml' // Publish JUnit test results
        }
    }

}
