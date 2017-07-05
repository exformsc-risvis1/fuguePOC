#!groovy

properties([
  parameters([
    string(
      name: 'VERSION',
      defaultValue: 'v1.0.0',
      description: 'The Version of your App.',
    ),
  ])
])

node('docker') {
  ws {
    try {
      def conf = [
        NAME: 'exfo-poc',
        TAG: "${env.BRANCH_NAME}-${env.BUILD_NUMBER}",
        REGISTRY: '995127052041.dkr.ecr.us-east-1.amazonaws.com',
        NAMESPACE: 'helloworld-prod',
        DEPLOYMENT: "hello-world"
      ]

      stage('Checkout') {
        checkout scm
      }

      stage('Docker Build') {
        conf.DOCKER_IMAGE = "${conf.REGISTRY}/${conf.NAME}:${conf.TAG}"
        image = docker.build("${conf.DOCKER_IMAGE}")
      }

      stage('Docker Push') {
        docker.withRegistry("https://${conf.REGISTRY}", 'ecr:us-east-1:Jenkins-user') {
        docker.image("${conf.DOCKER_IMAGE}").push('latest')
        }
      }

      stage('Kubernetes Deploy') {
        sh("kubectl --kubeconfig=kubernetes/identity/config apply -f kubernetes/deploy/hello-world_namespace.yaml")
        sh("kubectl --kubeconfig=kubernetes/identity/config apply -f kubernetes/deploy/hello-world_deployment.yaml")
        sh("kubectl --kubeconfig=kubernetes/identity/config apply -f kubernetes/deploy/hello-world_service.yaml")
        sh("kubectl --kubeconfig=kubernetes/identity/config apply -f kubernetes/deploy/hello-world_ingress.yaml")
      }  
    }finally {
    stage('cleanup') {
      echo "doing some cleanup..."
    }
  }
}
}
