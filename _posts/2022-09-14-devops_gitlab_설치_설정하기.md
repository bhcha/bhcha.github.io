---
layout: single
title: DevOps_Gitlab설치
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

###1.2 Docker 활용하기 (참고)
<pre>
a. 컨테이너 상태확인
    docker ps -a

b. 컨테이너 로그확인
    docker logs -f [컨테이너ID]

c. 컨테이너 멈춤
    docker stop [컨테이너ID]

d. 컨테이너 삭제
    docker rm [컨테이너ID]

e. 컨테이너 접속(중요)
   docker exec -it gitlab /bin/bash 
</pre>

Gitlab, Docker 설치가 완료되었다. 

## 2. 도입기능 검토
- - -
이제부터 해야될것을 다시 보고 어떤것들이 필요한지 한번 생각해보자.
### 2.1 DB에 운영자가 직접 접근 가능
<pre>
- <span style="color:#ff3d3d">문제</span> : 데이터베이스 DB Tool로 직접적근 가능하며 DML,DDL 이용이 가능한상황
- <span style="color:#1691fb">해결</span> : 정책수립후 DB접근제어툴(Chakra Max) 활용
    

- <span style="color:#ff3d3d">문제</span> : 데이터베이스 접근제어시 운영에 어려운이 발생. DBA에게 조회를 제외한 모든 내용을 정리하여 실행을 요청해야하나 수동으로 해야해서 불필요한 리소스 과투입이 예상됨.
- <span style="color:#1691fb">해결</span> : Gitlab CI/CD를 활용해 프로세스 구축 
</pre>

### 2.2 Jekins의 사용자 암호 보안정책
<pre>
- gitlab 암호화 정책으로 보완가능
    https://about.gitlab.com/hadbook/security/password-procedure.html
- Gitlab 인증(Mailing)
- Gitlab 유저/그룹관리
</pre>
### 2.3 Git 도입
<pre>
- Docker Gitlab 컨테이너 생성시 자동으로 Git설치되어 해결.
</pre>


## 3. Gitlab 설정하기
- - -
Gitlab 설치가 끝나면 Gitlab Container로 접속하자.

<pre>
docker exec -it gitlab /bin/bash
</pre>
