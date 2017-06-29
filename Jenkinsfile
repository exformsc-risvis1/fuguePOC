#!groovy

properties([
  parameters([
    string(
      name: 'K8S_CLUSTER',
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
        REGISTRY: '432690205111.dkr.ecr.us-east-1.amazonaws.com,
        VERSION: 'v1.0.0',
        HOSTNAME: 'hello-world.evry.fun',
        DEPLOY: 'true',
      ]

      stage('Checkout') {
        checkout scm
      }

      stage('Docker Build') {
        conf.DOCKER_IMAGE = "${conf.REGISTRY}/${conf.NAME}:${conf.TAG}"
        image = docker.build(conf.DOCKER_IMAGE)
      }

      stage('Docker Push') {
        docker.withRegistry("https://${conf.REGISTRY}", conf.REGISTRY) {
          image.push()
        }
      }

      stage("Kubernetes Deploy") {
        def Boolean dryrun = conf.DEPLOY != 'true'

        kubernetesDeploy(conf, [k8sCluster: env.K8S_CLUSTER, dryrun: dryrun])
      }
    } catch (InterruptedException e) {
      throw e
    } catch (e) {
      throw e
    } finally {
      step([$class: 'WsCleanup'])
      // Wait for Jenkins asynchronous resource disposer to pick up before we
      // close the connection to the worker node.
      sleep 10
    }
  }
}
