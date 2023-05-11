void setBuildStatus(String message, String state) {
    step([
        $class: "GitHubCommitStatusSetter",
        reposSource: [$class: "ManuallyEnteredRepositorySource", url: env.GIT_URL],
        contextSource: [$class: "ManuallyEnteredCommitContextSource", context: "ci/jenkins/${STAGE_NAME}"],
        errorHandlers: [[$class: "ChangingBuildStatusErrorHandler", result: "UNSTABLE"]],
        statusResultSource: [$class: "ConditionalStatusResultSource", results: [[$class: "AnyBuildResult", message: message, state: state]]]
    ]);
}

pipeline {
    agent any
    
    stages {
        stage('Build') {
            environment {
                DOCKERHUB_USERNAME = credentials('DOCKERHUB_USERNAME')
            }
            steps {
                setBuildStatus("Building container", "PENDING");
                sh 'docker build -f ./Dockerfile -t $DOCKERHUB_USERNAME/tessera-backend-dev .'
            }
            post {
                success {
                    setBuildStatus("Container built successfully", "SUCCESS");
                }
                failure {
                    setBuildStatus("Container build failed", "FAILURE");
                }
            }
        }

        stage('Test') {
            environment {
                BASE_URL = credentials('BASE_URL')
                PORT = credentials('PORT')
                MONGODB_URI = credentials('MONGODB_URI')
                EMAIL_HOST = credentials('EMAIL_HOST')
                EMAIL_PORT = credentials('EMAIL_PORT')
                EMAIL_USER = credentials('EMAIL_USER')
                EMAIL_PASS = credentials('EMAIL_PASS')
                SECRETJWT = credentials('SECRETJWT')
                FACEBOOK_CLIENT_ID = credentials('FACEBOOK_CLIENT_ID')
                FACEBOOK_CLIENT_SECRET = credentials('FACEBOOK_CLIENT_SECRET')
                GOOGLE_CLIENT_ID = credentials('GOOGLE_CLIENT_ID')
                GOOGLE_CLIENT_SECRET = credentials('GOOGLE_CLIENT_SECRET')
                DOCKERHUB_USERNAME = credentials('DOCKERHUB_USERNAME')
            }
            steps {
                setBuildStatus("Running tests", "PENDING");
                sh 'docker run \
                    -e BASE_URL \
                    -e PORT \
                    -e MONGODB_URI \
                    -e EMAIL_HOST \
                    -e EMAIL_PORT \
                    -e EMAIL_USER \
                    -e EMAIL_PASS \
                    -e SECRETJWT \
                    -e FACEBOOK_CLIENT_ID \
                    -e FACEBOOK_CLIENT_SECRET \
                    -e GOOGLE_CLIENT_ID \
                    -e GOOGLE_CLIENT_SECRET \
                    -e AWS_S3_BUCKET \
                    -e AWS_S3_ACCESS_KEY \
                    -e AWS_S3_SECRET_KEY \
                    -e AWS_S3_REGION \
                    $DOCKERHUB_USERNAME/tessera-backend-dev sh -c "CI=true npm run test:ci"'
                
            }
            post {
                success {
                    setBuildStatus("Passed all tests", "SUCCESS");
                }
                failure {
                    setBuildStatus("One or more tests failed", "FAILURE");
                }
            }
        }

        stage('Push') {
            environment {
                DOCKERHUB_USERNAME = credentials('DOCKERHUB_USERNAME')
                DOCKERHUB_ACCESS_TOKEN = credentials('DOCKERHUB_ACCESS_TOKEN')
            }
            steps {
                setBuildStatus("Pushing container", "PENDING");
                sh 'echo $DOCKERHUB_ACCESS_TOKEN | docker login -u $DOCKERHUB_USERNAME --password-stdin'
                sh 'docker push $DOCKERHUB_USERNAME/tessera-backend-dev'

            }
            post {
                success {
                    setBuildStatus("Container pushed", "SUCCESS");
                }
                failure {
                    setBuildStatus("Failed to push to Docker Hub", "FAILURE");
                }
            }
        }

        stage('Deploy') {
            steps {
                setBuildStatus("Deploying", "PENDING");
                build job: "deploy", wait: true
            }
            post {
                success {
                    setBuildStatus("Deployed successfully", "SUCCESS");
                }
                failure {
                    setBuildStatus("Deployment failed", "FAILURE");
                }
            }
        }
    }
    
    post {
        always {
            deleteDir()
        }
    }
}