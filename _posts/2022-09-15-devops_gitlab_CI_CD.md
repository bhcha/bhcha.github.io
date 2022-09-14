---
layout: single
title: DevOps_Gitlab CI/CD
categories: Devops
tag: [DEVOPS, gitlab, docker, gitlab runner, gitlab ci/cd, 내부통제]
---


## 1. Centos에 Gitlab 설치하기
- - -
###1.1 Docker Gitlab Container 구축
<pre>
a. 도커 이미지검색
    docker search gitlab/gitlab-ce

b. gitlab 내려받기
    docker pull gitlab/gitlab-ce

c. gitlab 실행
    docker run --detach \
      --hostname gitlab.dcm.com \
      --publish localhost:4000:80 \
      --name gitlab \
      --restart always \
      --add-host host.docker.internal:host-gateway \
      --volume $GITLAB_HOME/config:/etc/gitlab \
      --volume $GITLAB_HOME/logs:/var/log/gitlab \
      --volume $GITLAB_HOME/data:/var/opt/gitlab \
      --shm-size 256m \
      gitlab/gitlab-ce


d. 컨테이너 실행상태 확인
    docker ps

e. gitlab 접속하여 확인
    localhost:4000
</pre>
