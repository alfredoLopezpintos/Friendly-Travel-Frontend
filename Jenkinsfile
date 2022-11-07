pipeline {
    agent any
    tools {
        nodejs '18.12.1'
    }
    environment {
        AWS_DEFAULT_REGION = "us-east-1"
        ENV_NAME="${env.GIT_BRANCH == 'Friendly-Travel-Frontend/main' ? 'production' : 'dev'}"
    	CI=false
    }
    stages {
        stage("Test & Build"){            
            agent any
            steps {
                sh 'npm ci'
                sh 'npm run build'
                stash includes: 'build/', name: 'build_app' 
            }
        }
        stage("Destroy old deployment"){
            agent any
            steps{
                withAWS(credentials: 'friendly_credentials_aws', region: 'us-east-1') {
                    sh "bash -c 'aws s3 rm --recursive s3://${env.ENV_NAME}-friendly-bucket/ | true'"
                    sh "aws cloudformation delete-stack --stack-name 'Friendly-Frontend-${env.ENV_NAME}'"
                    sh "aws cloudformation wait stack-delete-complete --stack-name 'Friendly-Frontend-${env.ENV_NAME}'"
                }
            }
        }
        stage("Deploy"){
            agent any
            steps{
                script{
                    withAWS(credentials: 'friendly_credentials_aws', region: 'us-east-1') {
                        sh(script: "aws s3 cp template.yaml s3://friendly-bucket/front-end/")
                        sh(script: "aws cloudformation create-stack --stack-name 'Friendly-Frontend-${env.ENV_NAME}' --template-url 'https://friendly-bucket.s3.amazonaws.com/front-end/template.yaml' --parameter ParameterKey=Stage,ParameterValue='${env.ENV_NAME}' --capabilities CAPABILITY_IAM")
                        unstash "build_app"
                        sh(script: "aws cloudformation wait stack-create-complete --stack-name 'Friendly-Frontend-${env.ENV_NAME}'")
                        sh(script: "aws s3 cp ./build s3://${env.ENV_NAME}-friendly-bucket/ --recursive")
                    }
                }
            }
        }
    }
    post{
        failure {
            script{
                GIT_COMMITTER_EMAIL=sh(script:"git --no-pager show -s --format='%ae' ${env.GIT_COMMIT}", returnStdout: true)
            }
                emailext to: "${GIT_COMMITTER_EMAIL}",
                attachLog: true,
                subject: "jenkins build: ${currentBuild.currentResult}-${env.JOB_NAME}",
                compressLog: true,
                body: "${currentBuild.currentResult}: Job ${env.JOB_NAME} - Environment: ${env.ENV_NAME}\nEl build fallo. Mas info puede ser encontrada aqui: ${env.BUILD_URL}\n\nGrupo Tranqui."
        }
        success {
            script{
                GIT_COMMITTER_EMAIL=sh(script:"git --no-pager show -s --format='%ae' ${env.GIT_COMMIT}", returnStdout: true)
                withAWS(credentials: 'friendly_credentials_aws', region: 'us-east-1') {
                    DOMAIN_NAME=sh(script: "aws cloudfront list-distributions --query 'DistributionList.Items[].{DomainName: DomainName, OriginDomainName: Origins.Items[0].DomainName} | [0].DomainName'")
                }
            }
                emailext to: "${GIT_COMMITER_EMAIL}",
                attachLog: true,
                subject: "Build FRONTEND exitoso: ${currentBuild.currentResult}-${env.JOB_NAME}",
                compressLog: true,
                body: "El nuevo dominio es: ${DOMAIN_NAME}\n\nGrupo Tranqui."
        }
    }
}
