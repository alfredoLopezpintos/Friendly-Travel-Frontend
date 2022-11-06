pipeline {
    agent any
    environment {
        AWS_DEFAULT_REGION = "us-east-1"
        ENV_NAME="${env.GIT_BRANCH == 'Friendly-Travel-Frontend/main' ? 'production' : 'dev'}"
    	CI=false
    }
    stages {
        // stage("Retrieve Cognito Parameters") {
        //     agent { 
        //         docker{
        //             image 'amazon/aws-cli:2.7.28'
        //             label 'Docker'
        //             args '-u root --entrypoint ""'
        //         }    
        //     }
        //     steps {
        //         script {                                 
        //             withCredentials([usernamePassword(credentialsId: 'tmt_aws_credentials', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
        //                 catchError(buildResult: 'UNSTABLE'){
        //                     userpool_id = sh(script: "aws cognito-idp list-user-pools --max-results 20 --query 'reverse(sort_by(UserPools, &CreationDate))[?Name==`TMT-Pool-${env.ENV_NAME}`].Id | [0]'", returnStdout: true).trim()
        //                     userpool_id=userpool_id.replaceAll("\"", "");
        //                     client_id = sh(script: "aws cognito-idp list-user-pool-clients --max-results 1 --query 'UserPoolClients[].ClientId | [0]' --user-pool-id ${userpool_id}", returnStdout: true).trim()
        //                     client_id=client_id.replaceAll("\"", "");
        //                     base_url=sh(script: "aws apigateway get-rest-apis --query 'items[?name==`TMTApi${env.ENV_NAME}`].id | [0]'", returnStdout: true).trim()
        //                     base_url=base_url.replaceAll("\"", "");
        //                     base_url="https://${base_url}.execute-api.us-east-1.amazonaws.com"
        //                 }
        //             }
        //         }
        //     }    
        
        // }
        stage("Test & Build"){            
            agent any
            steps {
                // script{
                //     data="""
                //     REACT_APP_BASE_URL=${base_url}
                //     REACT_APP_USER_POOL=${userpool_id}
                //     REACT_APP_CLIENT_ID=${client_id}
                //     """
                //     writeFile(file: '.env', text: data)
                // }
                // sh 'npm ci'
                // sh 'npm run test -- --watchAll=false'
                sh 'npm run build'
                stash includes: 'build/', name: 'build_app' 
            }
        }
        stage("Destroy old deployment"){
            when {
                anyOf{
                    equals expected: 'Friendly-Travel-Frontend/develop', actual: env.GIT_BRANCH
                    // equals expected: 'front-end/main', actual: env.GIT_BRANCH
                }
                equals expected:"SUCCESS", actual:currentBuild.currentResult
            }
            agent any
            steps{
            //     withCredentials([usernamePassword(credentialsId: 'tmt_aws_credentials', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
            //         sh "bash -c 'aws s3 rm --recursive s3://dev-tmt-bucket/ | true'"
                    sh "bash -c 'aws s3 rm --recursive s3://dev-friendly-bucket/front-end/ | true'"
            //         sh "aws cloudformation delete-stack --stack-name 'TMT-Frontend-${env.ENV_NAME}'"
            //         sh "aws cloudformation wait stack-delete-complete --stack-name 'TMT-Frontend-${env.ENV_NAME}'"
            //     }
            }
        }
        stage("Deploy"){
            when {
                anyOf{
                    equals expected: 'Friendly-Travel-Frontend/develop', actual: env.GIT_BRANCH
                    // equals expected: 'front-end/main', actual: env.GIT_BRANCH
                }
                equals expected:"SUCCESS", actual:currentBuild.currentResult
            }
            agent any
            steps{
                script{
                    // withCredentials([usernamePassword(credentialsId: 'tmt_aws_credentials', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                        sh(script: "aws s3 cp template.yaml s3://friendly-bucket/front-end/")
                        sh(script: "aws cloudformation create-stack --stack-name 'Friendly-Frontend-${env.ENV_NAME}' --template-url 'https://friendly-bucket.s3.amazonaws.com/front-end/template.yaml' --parameter ParameterKey=Stage,ParameterValue='${env.ENV_NAME}' --capabilities CAPABILITY_IAM")
                        unstash "build_app"
                        sh(script: "aws cloudformation wait stack-create-complete --stack-name 'Friendly-Frontend-${env.ENV_NAME}'")
                        sh(script: "aws s3 cp ./build s3://dev-friendly-bucket/front-end/ --recursive")
                    // }
                }
            }
        }
    }
    // post{
    //     failure {
    //         script{
    //             GIT_COMMITTER_EMAIL=sh(script:"git --no-pager show -s --format='%ae' ${env.GIT_COMMIT}", returnStdout: true)
    //         }
    //             emailext to: "${GIT_COMMITTER_EMAIL}",
    //             attachLog: true,
    //             subject: "jenkins build: ${currentBuild.currentResult}-${env.JOB_NAME}",
    //             compressLog: true,
    //             body: "${currentBuild.currentResult}: Job ${env.JOB_NAME} - Environment: ${env.ENV_NAME}\nMore Info can be found here: ${env.BUILD_URL}"
    //     }
    // }
}
