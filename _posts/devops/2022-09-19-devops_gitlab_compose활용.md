---
layout: single
title: 🔄DevOps_Gitlab Dokcer Compose
categories: Devops
tag: [DEVOPS, gitlab, docker, gitlab runner, gitlab ci/cd, docker compose]
toc: true
---

> 다시 처음부터 시작한다. 이전포스팅은 글쓴게 아까워 남겨놓기로 했다. 완전한 실패라고 보기는 어렵고 과정을 통해 느낌바가 있으니
> 헛수고는 아니라고 생각한다.

### 잘못한점 : 하나의 Container에 Gitlab, Gitlab-runner, Sqlplus, postfix등 모든 서비스 설치 및 설정. 
### 보완점 : 각각의 컨터이너에 서비스를 구축하고 Docker-compose를 활용하여 배포한다.


## 1. Docker Compose 설치
<pre>
a. Docker Compose 설치
   $ sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$ (uname -s)-$ (uname -m)" -o /usr/local/bin/docker-compose

   * 위 url로 했을시 아래와 같이 안될때가 있다 그럴때는 아래 url로 설치해보자
   <img src="/images/devops/img_41.png"/>
   $ sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

b. 권한부여
   $ chmod +x /usr/local/bin/docker-compose
c. 심볼릭 링크 설정
   $ ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
d. 버전 확인
   $ docker-compose -version 
</pre>


## 2. Docker Compose 설정
Docker Compose를 이용해 설치하고자 하는 서비스의 yml을 작성해보자.
서비스는 Gitlab, Gitlab-runner, Sqlplus이다.  

### 2.1 기초작업
<pre>
a. docker 폴더 생성
   $ mkdir /data/docker
   $ chmod 755 /data/docker

b. Yml 작성
   $ vi docker-compose.yml

 - docker-compose.yml 내용
# [IP ADDRESS] 사용하고자하는 IP
version: "3.7"
    
services:
  # gitlab 설치
  gitlab:
    image: 'gitlab/gitlab-ce:latest'
    container_name: gitlab
    restart: always
    hostname: '[IP ADDRESS]'
    environment:
      # 설치하면서 셋팅될 정보
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://[IP ADDRESS]:4000'
        gitlab_rails['gitlab_shell_ssh_port'] = 8022
        gitlab_rails['smtp_enable'] = true
        gitlab_rails['smtp_address'] = "smtp.gmail.com"
        gitlab_rails['smtp_port'] = 587
        gitlab_rails['smtp_user_name'] = "[메일ID]@gmail.com"
        gitlab_rails['smtp_password'] = "[비밀번호]"
        gitlab_rails['smtp_domain'] = "smtp.gmail.com"
        gitlab_rails['smtp_authentication'] = "login"
        gitlab_rails['smtp_enable_starttls_auto'] = true
        gitlab_rails['smtp_openssl_verify_mode'] = 'peer'
        
    ports:
      - '4000:4000'
      - '8022:22'
    volumes:
      # host 폴더:container 폴더
      - '/data/gitlab/data:/var/opt/gitlab'
      - '/data/gitlab/logs:/var/log/gitlab'
      - '/data/gitlab/config:/etc/gitlab'


c. 폴더 권한
   $ cd /data
   $ mkdir gitlab
   $ cd gitlab
   $ mkdir data
   $ mkdir logs
   $ mkdir config
   $ chown -R $ USER:$ USER /data/gitlab
   $ chmod -R 755 /data/gitlab
   
   $ cd /data
   $ mkdir gitlab-runner
   $ cd gitlab-runner
   $ mkdir config
   $ chown -R $ USER:$ USER /data/gitlab-runner
</pre>


### 2.2 Dockerfile 작성
1차 목표는 gitlab ci/cd를 이용해 sql을 실행하는것이다. 그러기 위해
gitlab-runner와 sqlplus가 설치된 docker container가 필요하다. custom image를 만들기 위해 Dockerfile을 작성해보자.

<pre>

a. 폴더생성
   $ mkdir gitlab-runner && cd gitlab-runner

b. Dockerfile 생성
   $ vi Dockerfile

c. 내용작성
FROM gitlab/gitlab-runner:v14.6.1

RUN \
      apt-get update && \
      apt-get install -y apache2


ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y dialog apt-utils && apt-get install -y wget && apt-get install -y unzip && apt-get install libaio1 libaio-dev && apt install jsonnet

RUN wget https://download.oracle.com/otn_software/linux/instantclient/214000/instantclient-basic-linux.x64-21.4.0.0.0dbru.zip

RUN wget https://download.oracle.com/otn_software/linux/instantclient/214000/instantclient-sqlplus-linux.x64-21.4.0.0.0dbru.zip

RUN mkdir -p /opt/oracle

RUN unzip -d /opt/oracle instantclient-basic-linux.x64-21.4.0.0.0dbru.zip

RUN unzip -d /opt/oracle instantclient-sqlplus-linux.x64-21.4.0.0.0dbru.zip


WORKDIR /opt/oracle/instantclient_21_4

RUN cd /opt/oracle/instantclient_21_4 && find . -type f | sort

ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_21_4:$LD_LIBRARY_PATH

ENV PATH=$LD_LIBRARY_PATH:$PATH

SHELL ["/bin/bash", "-c"]


d. build
   docker build -t [이미지명]:[TAG]
   $ docker build -t docker_gitlab-runner-:01

e. docker 이미지 확인
   $ docker images
   <img src="/images/devops/img_30.png"/>
</pre>

### 2.4 docker-compose.yml 변경

생성한 이미지로 컨테이너를 만들기 위해 docker compose yml 파일을 수정해보자.

<pre>
a. docker-compose.yml 파일 열기
   $ vi docker-compose.yml

b. docker-compose.yml 내용 추가
   [...생략]
  gitlab-runner:
    build: ./gitlab-runner
    container_name: gitlab-runner
    restart: always
    volumes:
      - '/data/gitlab-runner/config:/etc/gitlab-runner'
      - '/var/run/docker.sock:/var/run/docker.sock'
</pre>

### 2.5 docker compose 실행
docker-compose.yml에 정의되어 있는 모든 서비스 컨테이너를 한번에 생성한다.
이때 반드시 해당 파일이 있는 폴더경로로 접근하여 아래 명령어를 실행해야 한다.
<pre>
$ docker-compose up -d
* -d 옵션은 백그라운드 옵션
</pre>
모든 서비스 컨테이너를 한번에 내리고 삭제하려면 up의 반대인 down명령어를 이용하면 된다.
<pre>
$ docker-compose down
* -v 옵션은 volumn까지 삭제
</pre>
로그확인
<pre>
$ docker-compose logs -f
</pre>
상태확인
<pre>
$ docker-compose ps
</pre>
<img src="/images/devops/img_29.png"/>

여기까지 한번에 2가지의 컨테이너가 생성되었다.


[//]: # (아래 참조링크는 ubuntu 이미지를 만들었을때 내가 겪었던 멘붕을 잘 정리해주신분이 계셔서 남겨두었다.)

[//]: # (>참조 : https://www.popit.kr/%EA%B0%9C%EB%B0%9C%EC%9E%90%EA%B0%80-%EC%B2%98%EC%9D%8C-docker-%EC%A0%91%ED%95%A0%EB%95%8C-%EC%98%A4%EB%8A%94-%EB%A9%98%EB%B6%95-%EB%AA%87%EA%B0%80%EC%A7%80/)

[//]: # (FROM ubuntu:18.04)

[//]: # ()
[//]: # (RUN \\)

[//]: # (      apt-get update && \\)

[//]: # (      apt-get install -y apache2)

[//]: # ()
[//]: # (ARG DEBIAN_FRONTEND=noninteractive)

[//]: # (RUN apt-get update && apt-get install -y dialog apt-utils && apt-get install -y wget && apt-get install -y unzip && apt-get install libaio1 libaio-dev)

[//]: # (RUN wget https://download.oracle.com/otn_software/linux/instantclient/214000/instantclient-basic-linux.x64-21.4.0.0.0dbru.zip)

[//]: # (RUN wget https://download.oracle.com/otn_software/linux/instantclient/214000/instantclient-sqlplus-linux.x64-21.4.0.0.0dbru.zip)

[//]: # (RUN mkdir -p /opt/oracle)

[//]: # (RUN unzip -d /opt/oracle instantclient-basic-linux.x64-21.4.0.0.0dbru.zip)

[//]: # (RUN unzip -d /opt/oracle instantclient-sqlplus-linux.x64-21.4.0.0.0dbru.zip)

[//]: # ()
[//]: # (WORKDIR /opt/oracle/instantclient_21_4)

[//]: # (RUN cd /opt/oracle/instantclient_21_4 && find . -type f | sort)

[//]: # (ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_21_4:$ LD_LIBRARY_PATH)

[//]: # (ENV PATH=$ LD_LIBRARY_PATH:$ PATH)

[//]: # ()
[//]: # (EXPOSE 80)

[//]: # (SHELL ["/bin/bash", "-c"])

[//]: # ()


[//]: # ()


[//]: # (</pre>)

