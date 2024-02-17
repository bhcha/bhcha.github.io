---
layout: single
title: DevOps_Gitlab설치
categories: Devops
tag: [DEVOPS, gitlab, docker, gitlab runner, gitlab ci/cd, 내부통제]
toc: true
---

> 해당작업은 Container 운영에 대한 이해도가 없이 진행하다 보니 다하고 뒤엎었다. 결국 docker-compose로 
> 작업했으니 바쁘신분들은 Docker-compose에 대한 포스팅을 보길 바란다.
> https://bhcha.github.io/devops/devops_gitlab_compose%ED%99%9C%EC%9A%A9/


## 1. Centos에 Gitlab 설치하기
### 1.1 Docker Gitlab Container 구축
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

### 1.2 Docker 활용하기 (참고)
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
- Gitlab 암호화 정책으로 보완가능
  https://about.gitlab.com/hadbook/security/password-procedure.html
- Gitlab 인증(Mailing)
- Gitlab 유저/그룹관리
</pre>
### 2.3 Git 도입
<pre>
- Docker Gitlab 컨테이너 생성시 자동으로 Git설치되어 해결.
</pre>


## 3. Gitlab 초기 설정하기
초기설정관련하여 아주 정리가 잘되어 있는 블로그가 있다.

https://wikidocs.net/16279

* 해당 블로그에서 주의해야 할점은 firewall관련 설정인데 <span style="color:#ff3d3d">아래와 같은 메세지가 뜨면 사용하고 있지 않다</span>는것이다. 
사용하고 있지 않은 상태에서 해당 메세지를 해결하기 위해 방화벽을 켰을시 기존에 사용중이던 시스템이 블락될수도 있다. 서버관리자가 아니라면 섣불리 켜지 말자.
<img src="/images/firewall.png"/>
* 해당 블로그 내용은 docker에 설치하는것이 아니라 조금 다를수 있다.

아래 내용들은 필요한 부분만 정라한것이다.
Gitlab 설치가 끝나면 Gitlab Container로 접속하자.

<pre>
  $ docker exec -it gitlab /bin/bash
</pre>

최초 비밀번호는 아래 파일에 기재되어 있다.
<pre>
  $ vi /etc/gitlab/initial_root_password
</pre>

만약 파일을 찾을수 없다면 아래 명령어로 root 패스워드를 초기화해주자.
<pre>
a. gitlab console창 실행
   $ gitlab-rails console -e production
   //....조금기다리기....
b. 첫번째 유저 찾기
   # user = User.where(id: 1).first
c. 비밀번호 설정
   # user.password='변경할비밀번호'
   # user.password_confirmation='변경할비밀번호'
d. 저장
   # user.save
</pre>

[//]: # ( ### 3.1 메일전송 에이전트 POSTFIX 설치하기)

[//]: # (#apt저장소를 업데이트 하자.)

[//]: # (<pre>)

[//]: # (apt-get update)

[//]: # (</pre>)

[//]: # ()
[//]: # (postfix를 설차하자.)

[//]: # (<pre>)

[//]: # (apt-get install mailutils)

[//]: # (</pre>)

[//]: # ()
[//]: # (아래와 같은 설정이 나오는데 따라해보자.)

[//]: # (<pre>)

[//]: # (2. Internet Site )

[//]: # (</pre>)

[//]: # (![]&#40;/images/img.png&#41;)

[//]: # ()
[//]: # (<pre>)

[//]: # (hostname 입력 )

[//]: # (</pre>)

[//]: # (![img_1.png]&#40;/images/img_1.png&#41;)

[//]: # (설정이 잘못되었으면 아래 명령어를 입력해 다시 설정하자.)

[//]: # (<pre>)

[//]: # (dpkg-reconfigure postfix)

[//]: # (</pre>)

### 3.1 인증메일 설정하기
#### 3.1.1 설정파일 확인하기
<pre>
vi /etc/gitlab/gitlab.rb
</pre>

아래로 내리다보면 smtp 관련 설정을 확인할 수 있다.
<img src="/images/devops/gitlab_smtp.png"/>
여기에 회사 SMTP서버를 기재하면 되는데,,,,,SMTP 서버를 관리하는 부서에서 제공을 안해준다.

깔끔하게 포기하고 구글 SMTP를 이용해보자.
회사내 구글계정을 쓰고 싶은데 문제는 2차인증이 필요한 서비스라 이것도 불가능하다.
그래서 결국 내 정보를 가지고 우리 파트 계정을 새로 생성하기로했다.



#### 3.1.2 구글 SMTP 설정(번외)
<pre>
1. 구글 계정생성->2차인증설정
2. 계정설정->보안>앱비밀번호->기기용 앱 비밀번호 설정
</pre>


#### 3.1.3 설정파일에 SMTP설정하기
위 과정을 마치면 위 설정을 아래와 같이 바꿔보자.
<pre>
1. #(주석)제거
2. 나머지는 똑같이 작성
3. smtp_password 부분은 기기용 앱 비밀번호를 기재
</pre>
<img src="/images/devops/gitlab_smtp_set.png"/>

설정을 반영해보자.
<pre>
$ gitlab-ctl reconfigure
</pre>

제대로 설정이 되었는지 메일을 발송해보자.
<pre>
$ gitlab-rails console
</pre>
위 명령어 입력후 수초에서 수분정도 기다리면 아래와 같은 커맨드 입력 창이 나타난다.
<img src="/images/devops/img_2.png"/>
아래와 같이 입력!
<pre>
# Notify.test_email('example@gmail.com', 'GitLab 메일링 테스트입니다', 'GitLab SMTP를 수정하였기에 메일링 테스트를 진행합니다.').deliver_now
</pre>
성공적으로 발송되었다.
<img src="/images/devops/img_3.png"/>

여기까지 완료되었다면 사용자 가입시 인증메일이 발송되고 관리자가 인증하는 프로세스가 추가된것이다.
[도입기능 검토](#2-도입기능-검토)내용중 암호화 정책관련 내용이 어느정도 해소되었다.
다음은 Gitlab의 꽃 CI/CD에 대해 알아보자.

이대로 했는데 안되면 알려주세요.