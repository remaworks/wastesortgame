pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: jenkins-agent
spec:
  serviceAccountName: jenkins
  containers:
  - name: nodejs
    image: node:20-alpine
    command: ["sleep"]
    args: ["99d"]
    workingDir: /home/jenkins/agent
  - name: docker
    image: docker:cli
    command: ["sleep"]
    args: ["99d"]
    privileged: true
    workingDir: /home/jenkins/agent
    env:
    - name: CONTAINERD_ADDRESS
      value: /run/k3s/containerd/containerd.sock
    volumeMounts:
    - name: docker-sock
      mountPath: /var/run/docker.sock
    - name: containerd-sock
      mountPath: /run/k3s/containerd/containerd.sock
    - name: k3s-bin
      mountPath: /usr/local/bin/k3s
      readOnly: true
    - name: k3s-data
      mountPath: /var/lib/rancher/k3s/data
      readOnly: true
  - name: kubectl
    image: alpine/k8s:1.29.2
    command: ["sleep"]
    args: ["99d"]
    workingDir: /home/jenkins/agent
  volumes:
  - name: docker-sock
    hostPath:
      path: /var/run/docker.sock
  - name: containerd-sock
    hostPath:
      path: /run/k3s/containerd/containerd.sock
  - name: k3s-bin
    hostPath:
      path: /usr/local/bin/k3s
  - name: k3s-data
    hostPath:
      path: /var/lib/rancher/k3s/data
'''
        }
    }
    stages {
        stage('Build') {
            steps {
                container('nodejs') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        stage('Build & Import Image') {
            steps {
                container('docker') {
                    sh 'docker build -t wastesortgame:canary .'
                    sh 'docker tag wastesortgame:canary wastesortgame:stable'
                    sh 'docker save -o wastesortgame.tar wastesortgame:canary wastesortgame:stable'
                    sh 'ls -lh wastesortgame.tar'
                    sh '/usr/local/bin/k3s ctr -n k8s.io images import wastesortgame.tar'
                    sh 'rm wastesortgame.tar'
                    sh 'sleep 5'
                }
            }
        }
        stage('Deploy Preview') {
            steps {
                container('kubectl') {
                    sh 'kubectl rollout restart deployment wastesortgame-preview -n default'
                    sh 'kubectl rollout status deployment wastesortgame-preview -n default --timeout=300s'
                }
            }
        }
    }
}
