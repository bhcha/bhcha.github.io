---
layout: single
title: DevOps_Gitlab CI/CD로 SQL 처리
categories: Devops
tag: [DEVOPS, gitlab, docker, gitlab runner, gitlab ci/cd, oracle sql, sqlplus 설치]
---


> 여기까지 작업하고 보니 컨테이너를 전혀 활용하지 못하고 있었다. 모놀리식 아키텍쳐에 익숙해져 있어서 그런지 MSA아키텍쳐를 전혀 활용하지 못했다.
> 다음 포스팅은 Docker-compose를 이용해 서비스를 각각의 컨테이너로 구축해보도록 한다.

## 1. CI/CD활용
일반적으로 CI/CD를 활용해서 가장 많이 쓰는 기능은 개발서버 배포->테스트->Merge->운영서버 배포가 아닐까 싶다.
이 작업도 하긴 해야되지만 지금당장 급하지 않으니 지금 남아있는 문제중 가장 번거로운 작업인 sql처리를 해보자.

### 1.1 현상황
운영자가 DB Tool을 이용하여 운영DB에 접속할수 있고 DML, DDL등 모든게 접근 가능한 상황. 이를 지적받아 앞으로는
DBA가 모든 작업을 맡아야 함.

### 1.2 문제점
DBA가 DML을 처리하기 위해서는 아래와 같은 프로세스를 수행해야한다.

<pre>
운영자가 테스트 서버에서 쿼리 작성 -> 테스트 성공 -> DML을 DBA에게 메일로 전달 -> DBA 처리후 통보 -> 운영테스트
</pre>
이작업을 몇번만 메모장으로 작성하고 메일로 전달하다보면 현타가 크게 온다.
이를 아래와 같이 변경해보자.
<pre>
운영자가 sql파일 커밋 -> Job을 통해 개발서버에 자동실행 -> 테스트 성공시 -> DBA가 Merge 수행 -> 운영테스트
</pre>
이렇게 되면 수기로 메일을 보낼필요도 없고 Merge request를 통해 DBA가 처리하기때문에 따로 연락할 필요도 없어진다.

### 1.3 사전준비
이것을 가능하기 위해서 어떤게 필요할까? 

<pre>
a. 리눅스에서 쿼리를 실행할수 있는 방법(필자의 환경은 Oracle)
   - sqlplus로 처리가능
b. 원격으로 접속 환경 
   - sqlplus 원격으로 실행시킬수 있게 환경 설정
c. sql을 실행시킬 job
</pre>

해야될 내용이 정리 되었으면 실행해보자.

### 1.4 Docker Sqlplus 활용
현재 환경은 아래와 같이 구성되어 있다.
![](../images/img_17.png)

Case 1. Docker에서 Host Sqlplus활용

결론부터 말하면 이건 실패했다. 바쁜사람은 Case 2를 보는게 나을것 같다.
이걸하기위해 수많은 작업을 했지만 해결못한게 있다. 
혹시 성공하신분 있으면 알려주세요....
아님 다른방법이나...
<pre>
a. Host 연결
   - host에 연결하기위해선 network 설정이 필요하다. 두가지 방법 중 하나 택1
     · vi /etc/hosts에서 host 추가
       <img src="../images/img_18.png"/>
     · docker run 옵션에 호스트 추가
       옵션 : --add-host host.docker.internal:host-gateway \
       * https://bhcha.github.io/devops/devops_gitlab_%EC%84%A4%EC%B9%98_%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0/#11-docker-gitlab-container-%EA%B5%AC%EC%B6%95

b. ssh 연결 테스트(Docker)
   - 도커 커맨드라인 연결
     docker exec -it gitlab /bin/bash 
   - ssh root/root1234@host.docker.internal
     <img src="../images/img_19.png"/>
     root 비밀번호를 기재하였음에도 비밀번호를 물어본다.

여기까지 작업했을때 CI/CD Job에서 shell command를 날렸을때 비밀번호를 물어보는거에 대한 대응이 힘들기 때문에 
비밀번호 없이 접근이 가능해야된다고 생각했다.

c. ssh 비밀번호 없이 연결
   - 공개키 생성(Docker)
     ssh-keygen -t rsa
     * 질문들에 대해서 다 Enter로 넘어가자.
   - 공개키 생성(Docker)
     ssh-keygen -t rsa -N '' -f /root/.ssh/id_rsa
     * 덮어쓸거냐고 물어보면 y
   - 공개키를 Host로 전송(Docker)
     scp /root/.ssh/id_rsa.pub root@host.docker.internal:/root/id_rsa.pub
   - 공개키 등록(Host)
     mkdir /root/.ssh
     chmod 700 /root/.ssh
     touch /root/.ssh/authorized_keys
     chmod 644 /root/.ssh/authorized_keys
     cat /root/id_rsa.pub >> /root/.ssh/authorized_keys
     <img src="../images/img_20.png"/>

d. 다시 접속 테스트
   <img src="../images/img_21.png"/>
   그러면 ssh를 통해서 커맨드를 날려보자.
   ssh root/root1234@host.docker.internal ls
   정상적으로 목록이 조회되는것을 확인할 수 있다. 그러면 여기에 sqlplus만 실행하면 끝!
   인줄 알았으나 커맨드를 찾을수 없다고 나온다. 
   <img src="../images/img_22.png"/>
   host에서는 잘되는데 말이다.
   <img src="../images/img_23.png"/>
   그래서 절대경로로 실행해 보았다.
   <img src="../images/img_24.png"/>
   이런 메세지가 나타나며 실패했다. 환경변수가 셋팅도 제대로 되어있는데 끝끝내 성공하지 못했다.
</pre>

Case 2. Docker sqlplus 실행
<pre>
   일반적인 Docker 구성은 gitlab과 같은 컨테이너 구성, Oracle 컨테이너 구성 이런식으로 알고 있다.
   하지만 현재 셋팅되어 있는 구성을 변경할수 없어 최대한 있는그대로 해야되는 상황.
   결국 타협하여 Gitlab Container에 sqplus를 설치했다.

   a. Basic Package 다운로드 
      wget https://download.oracle.com/otn_software/linux/instantclient/214000/instantclient-basic-linux.x64-21.4.0.0.0dbru.zip
   b. splplus Package 다운로드 
      wget https://download.oracle.com/otn_software/linux/instantclient/214000/instantclient-sqlplus-linux.x64-21.4.0.0.0dbru.zip
   c. 폴더생성
      mkdir -p /opt/oracle
   d. 패키지 압축해제
      unzip -d /opt/oracle instantclient-basic-linux.x64-21.4.0.0.0dbru.zip
      unzip -d /opt/oracle instantclient-sqlplus-linux.x64-21.4.0.0.0dbru.zip
   e. 환경변수 등록
      cd /opt/oracle/instantclient_21_4 && find . -type f | sort
      export LD_LIBRARY_PATH=/opt/oracle/instantclient_21_4:$LD_LIBRARY_PATH
      export PATH=$LD_LIBRARY_PATH:$PATH
      source ~/.bashrc
   f. sqlplus 실행(실패)
      <img src="../images/img_25.png"/>
   g. 당황하지 말고 libaio 설치
      apt-get install libaio1 libaio-dev
   h. sqlplus 실행(성공)
      <img src="../images/img_26.png"/>
</pre>

### 1.5 Sqlplus 원격접속
<pre>
   a. 원격접속 테스트
   sqlplus [ID]/[PASSWORD]@[IP]:1521/[SID]
   * 특수문자가 있다면 반드시 \를 넣어줘야 한다.(password포함)
     예)test!1234 입력시 bash: !1234: event not found 이런메세지가 리턴되며 실행이 되지않는다.

   b. Test Sql 작성
   vi test.sql > select 1 from dual; > :wq(저장)

   c. 원격접속후 sql실행
   sqlplus [ID]/[PASSWORD]@[IP]:1521/[SID] @test.sql
   <img src="../images/img_28.png"/>

   성공!
</pre>
