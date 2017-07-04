#!groovy

properties([
  parameters([
    string(
      name: 'K8S_CLUSTER_AK',
      defaultValue: 'kubernetes',
      description: 'The Kubernetes Cluster you want to deploy to',
    ),
  ])
])

node('docker') {
  ws {
    try {
      def conf = [
        NAME: 'exfodemo',
        TAG: "${env.BRANCH_NAME}-${env.BUILD_NUMBER}",
        REGISTRY: '432690205111.dkr.ecr.us-east-1.amazonaws.com',
        VERSION: 'v1.0.0',
        HOSTNAME: 'hello-world.evry.fun',
        DEPLOY: 'false',
      ]

      stage('Checkout') {
        checkout scm
      }

      stage('Docker Build') {
        conf.DOCKER_IMAGE = "${conf.REGISTRY}/${conf.NAME}:${conf.TAG}"
        image = docker.build("${conf.DOCKER_IMAGE}")
      }

      stage('Docker Push') {
        docker.withRegistry("https://${conf.REGISTRY}", 'ecr:us-east-1:poc-ecr-credentials') {
        docker.image("${conf.DOCKER_IMAGE}").push('latest')
        }
      }

      stage('Kubernetes Deploy') {
        sh("kubectl --kubeconfig=kubernetes/identity/config --namespace=production apply -f kubernetes/deploy/hello-world.yaml")
        sh("kubectl --kubeconfig=kubernetes/identity/config --namespace=production apply -f kubernetes/deploy/hello-world_service.yaml")
        sh("kubectl --kubeconfig=kubernetes/identity/config --namespace=production apply -f kubernetes/deploy/hello-world_ingress.yaml")
      }  
    }finally {
    stage('cleanup') {
      echo "doing some cleanup..."
    }
  }
}
}