---
layout: single
title: DevOps_Gitlab CI/CD
categories: Devops
tag: [DEVOPS, gitlab, docker, gitlab runner, gitlab ci/cd, 내부통제]
---

## 1. CI/CD란?
지속적 통합(Continuous integration)/지속적 배포(Continuous Deployment)의 약어로 문자그대로의 의미이다.

* 혹자는 지속적 개발(Continuous Develop)까지 포함된다 한다.

개념 설명을 한번도 안하다가 갑자기 하는것은 해당 개념을 통해 당면한 문제를 해결하기 때문이다.
devops포스팅에서 다루고 있는 Gitlab은 현재 점유율1위로 CI/CD기능을 폭넓게 쓸수 있는 툴이다.
문제를 Gitlab CI/CD를 통해 해결해보자.


## 2. Gitlab CI/CD 사전준비
### 2.1 Gitlab runner 설치
```linux
일반적인 cenos환경에서는 아래와 같이 진행하면 된다. 
필자는 docker compose를 통해 진행했으니 넘어가야되면 된다.
a. repository 추가
    curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | bash

b. gitlab-runner 설치
    apt install gitlab-runner

c. gitlab-runner 서비스등록
    service gitlab-runner start 
```

### 2.2 Gitlab runner 등록
<pre>
a. gitlab project 설정확인
   gitlab 접속(localhost:4000) > Project 선택 > 왼쪽상단 Menu 선택 > Settings 메뉴 > CI/CD > Runner Expand 
   [그림1] Gitlab CI/CD Runners 정보 확인
   <img src="../images/img_4.png"/>
b. gitlab-runner container 접속
   docker exec -it gitlab-runner /bin/bash
c. gitlab-runner 등록
    gitlab-runner register
    * 해제는 gitlab-runner register --name [runnername] 
</pre>
[그림1]을  보고 아래와 같이 입력
<img src="../images/img_5.png"/>

다시 Gitlab CI/CD Runners 정보로 돌아가보면 아래와같이 초록불을 확인 할 수 있다.

### 2.3 Gitlab CI/CD 테스트
이제 CI/CD테스트를 해보자.
<pre>
a. MENU > CI/CD > Editor 메뉴이동
b. Configure pipeline 버튼 선택
   <img src="../images/img_8.png"/>
c. 설정은 건들이지 말고 Commit cahnges 클릭
   * 해당내용들은 shell에 echo 커맨드를 날려서 출력하는게 전부라 시스템영향을 주지 않는다. 
   * 이렇게 새로운 (Pipeline)파이프라인이 추가되었다.
   <img src="../images/img_9.png"/>
d. MENU > CI/CD > Pipelines 메뉴이동
   <img src="../images/img_11.png"/>
</pre>
> Status : 상태\
> Pipeline : 파이프라인\
> Stages : Editor에서 설정한 스테이지(Job들의 모음)

설정도 마쳤고 Pipeline도 생성이 끝났지만 어떤이유에서인지 동작이 되지 않는다.
파이프라인 상세상태를 확인하기 위해 <span style="color:red">①</span>을 눌러보자.

![](../images/img_10.png)
멈춰있는 Job<span style="color:red">①</span>을 선택하면 아래와같은 메세지가 나타난다. 

![](../images/img_12.png)
<pre>
e. CI settings click Or Menu > Settings > CI/CD > Runner Expand
f. CI/CD 설정을 변경하기 위해 Edit버튼을 눌러보자.
<img src="../images/img_13.png" width="50%"/>
g. Run untagged jobs 체크 > Save changes
<img src="../images/img_14.png"/>
h. 파이프라인을 다시 시작해보자.
<img src="../images/img_15.png"/>
i. 성공!
</pre>

어떤 동작들이 수행되었는지 보려면 Job을 누르면 아래와 같은 창이 나타난다.

![](../images/img_16.png)

여기까지 CI/CD설정이 완료되었다. 다음번엔 해당기능을 활용하여 남아있는 문제를 처리해보자.