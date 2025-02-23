---
layout: single
title: 🔄DevOps_Gitlab CI/CD로 SQL 실행
categories: Devops
tag: [DEVOPS, gitlab, docker, gitlab runner, gitlab ci/cd sql, 내부통제, SQL]
toc: true
---

## 1. gitlab CI/CD로 SQL 실행하기
결과물부터 먼저 보시죠.
<img src="/images/devops/img_31.png"/>

## 2. 준비물
### 2.1 환경
<pre>
a. docker(선택)
b. gitlab
c. gitlab-runner
d. sqlplus
</pre>

### 2.2 프로세스
<pre>
a. develop 권한을 가진 유저가 csr번호.sql로 쿼리문을 작성한다.
   // 예제는 구분을 위해 select.sql로 진행
   $ echo "select 1 from dual;" > 512345.sql
     
   // 예제는 구분을 위해 insert.sql로 진행
   $ echo "INSERT INTO WWW_LOG (DIV, CONTENT, REGDATE) VALUES ('gitlab', '테스트', TO_DATE('2022-09-23 14:22:17', 'YYYY-MM-DD HH24:MI:SS'));" > 422345.sql
     

b. /^develop_.*$/ 정규표현식에 맞는 브런치를 push한다.
   $ git branch develop_20220927
   $ git add .
   $ git commit -m "execute sql"
   $ git push -uf origin develop_20220927

c. ci/cd에서 결과물과 같이 sql이 각각 실행된다.
   <img src="/images/devops/img_31.png"/>

d. developer는 merge requests를 요청한다.
   <img src="/images/devops/img_32.png"/>

e. maintainer가 확인후 merge requests를 수락하면 commit된 sql들이 운영서버로 실행된다.
   <img src="/images/devops/img_33.png"/>
</pre>

### 2.3 권한설정
위 프로세스를 가능하게 하려면 관리자 권한과 개발자 권한을 분리해야 한다.
gitlab > 프로젝트선택 > Project information > Members
화면에서 권한 설정이 가능하다.
<img src="/images/devops/img_34.png"/>

### 2.4 gitlab-ci.yml 파일 작성
위 프로세스를 가능하게 만든 스크립트 이다. 필자의 부족한 리눅스 커맨드 실력으로 겨우겨우 만든거니 어느정도 감안하고 보길 바란다.
<pre>
stages:          # List of stages for jobs, and their order of execution
  - build

build:
  stage: build
  script:
    - echo " -- branch -- "
    - echo $CI_COMMIT_REF_NAME
    - echo " -- event -- "
    - echo "$CI_PIPELINE_SOURCE"

#################################################################
##                  dev branch(dev DB server)                  ##
#################################################################
build-dev-job:       # This job runs in the build stage, which runs first.
  rules:
    # - if: '$CI_COMMIT_REF_NAME =~ /^develop.*$/'
    - if: '$CI_COMMIT_REF_NAME =~ /^develop_.*$/'

  stage: build
  before_script: 
    - export DIFF=$(git diff-tree --no-commit-id --name-only --diff-filter=A --diff-filter=M -r $(git rev-parse --verify HEAD) -- *.sql | xargs echo | sed 's/ /","/g' | sed -e 's/^/"/' | sed 's/$/"/')
    
  script:
    - |+
      if [ $DIFF  == "\"\"" ] 
      then
         echo '변경파일없음....'
         exit 1
      else
         echo '있음'
      fi
    - echo "Compiling the code..."
    # 상태가 추가나 변경이고 확장자가 sql인 commit list로 처리할려고 했으나
    - |+
      for i in $(git diff-tree --no-commit-id --name-only --diff-filter=A --diff-filter=M -r $(git rev-parse --verify HEAD) -- *.sql)
      do
         echo "$i"
         cat "$i"
      done

    # 하나의 job에서 모든 sql이 실행되는게 좋아 보이지 않아 job을 나누는 프로세스를 만들어 보았다.
    # 먼저 아래와 같이 만든후 jsonnet을 활용하여 jobs.yml 파일로 만들어
    # artifact에 올린다음 트리거에서 해당 yml파일을 활용한다.
    - |+
      echo 'local job(thing) =
      {
        stage: "deploy",
        image: "alpine:latest",
        script: 
          "export NLS_LANG=KOREAN_KOREA.AL32UTF8 && /opt/oracle/instantclient_21_4/sqlplus [계정]/[비밀번호]@\"[개발서버IP]:1521/[SID]\" @ "+ thing
      };

      local things = ['$DIFF$'];
      {
        [x]: job(x)
        for x in things
      }' > blueprint.jsonnet
    - jsonnet blueprint.jsonnet > jobs.yml
    - cat jobs.yml

  artifacts:
    paths:
    - jobs.yml

###################################################################
##                  main branch(real DB server)                  ##
###################################################################
exec-dev-jobs:
  rules:
    - if: '$CI_COMMIT_REF_NAME =~ /^develop_.*$/'
  stage: build
  needs:
    - build-dev-job
  trigger:
    strategy: depend
    include:
    - artifact: jobs.yml
      job: build-dev-job


build-main-job:       # This job runs in the build stage, which runs first.
  rules:
    #- if: $CI_PIPELINE_SOURCE == 'merge_request_event' && $CI_COMMIT_REF_NAME == 'main'
    - if: $CI_PIPELINE_SOURCE == 'push' && $CI_COMMIT_REF_NAME == 'main'

  stage: build
  before_script: 
    # merge된 파일을 gitmergefilelist로 작성
    - git log -1 -m --name-only --pretty="format:" -- *.sql --diff-filter=M > gitmergefilelist
    - export DIFF=$(sed '/^$/d' gitmergefilelist | sort | uniq | xargs echo | sed 's/ /","/g' | sed -e 's/^/"/' | sed 's/$/"/')
    
  script:
    - |+
      if [ $DIFF  == "\"\"" ] 
      then
         echo '변경파일없음....'
         exit 1
      else
         echo '있음'
      fi
    - echo "Compiling the code..."

    # 하나의 job에서 모든 sql이 실행되는게 좋아 보이지 않아 job을 나누는 프로세스를 만들어 보았다.
    # 먼저 아래와 같이 만든후 jsonnet을 활용하여 jobs.yml 파일로 만들어
    # artifact에 올린다음 트리거에서 해당 yml파일을 활용한다.
    - |+
      echo 'local job(thing) =
      {
        stage: "deploy",
        image: "alpine:latest",
        when: "manual",
        script: 
          "export NLS_LANG=KOREAN_KOREA.AL32UTF8 && /opt/oracle/instantclient_21_4/sqlplus [계정]/[비밀번호]@\"[운영서버IP]:1521/[SID]\" @ "+ thing
      };

      local things = ['$DIFF$'];
      {
        [x]: job(x)
        for x in things
      }' > blueprint.jsonnet
    - jsonnet blueprint.jsonnet > jobs.yml
    - cat jobs.yml

  artifacts:
    paths:
    - jobs.yml


exec-main-jobs:
  rules:
    # - if: $CI_PIPELINE_SOURCE == 'merge_request_event' && $CI_COMMIT_REF_NAME == 'main'
    - if: $CI_PIPELINE_SOURCE == 'push' && $CI_COMMIT_REF_NAME == 'main'
  stage: build
  needs:
    - build-main-job
  trigger:
    strategy: depend
    include:
    - artifact: jobs.yml
      job: build-main-job

</pre>

내용은 push된 항목들 가져와서 sql을 실행하는거라고 보면 된다. 다만 브런치별로 