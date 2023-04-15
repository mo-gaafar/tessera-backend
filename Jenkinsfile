void setBuildStatus(String message, String state) {
    step([
        $class: "GitHubCommitStatusSetter",
        reposSource: [$class: "ManuallyEnteredRepositorySource", url: "https://github.com/mo-gaafar/tessera-backend/"],
        contextSource: [$class: "ManuallyEnteredCommitContextSource", context: "ci/jenkins/build-status"],
        errorHandlers: [[$class: "ChangingBuildStatusErrorHandler", result: "UNSTABLE"]],
        statusResultSource: [ $class: "ConditionalStatusResultSource", results: [[$class: "AnyBuildResult", message: message, state: state]] ]
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
                sh 'docker build -f ./Dockerfile -t $DOCKERHUB_USERNAME/tessera-backend-dev .'
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
        }

        stage('Push') {
            environment {
                DOCKERHUB_USERNAME = credentials('DOCKERHUB_USERNAME')
                DOCKERHUB_ACCESS_TOKEN = credentials('DOCKERHUB_ACCESS_TOKEN')
            }
            steps {
                sh 'echo $DOCKERHUB_ACCESS_TOKEN | docker login -u $DOCKERHUB_USERNAME --password-stdin'
                sh 'docker push $DOCKERHUB_USERNAME/tessera-backend-dev'
            }
        }

        stage('Deploy') {
            steps {
                build job: "deploy", wait: true
            }
        }
    }
    
    post {
        always {
            deleteDir()
        }
        success {
            setBuildStatus("Build succeeded", "SUCCESS");
        }
        failure {
            setBuildStatus("Build failed", "FAILURE");
        }
    }
}