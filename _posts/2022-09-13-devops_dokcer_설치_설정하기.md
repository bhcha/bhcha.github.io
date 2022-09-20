---
layout: single
title: DevOps_docker설치
categories: Devops
tag: [DEVOPS, gitlab, docker, gitlab runner, gitlab ci/cd, 내부통제]
---



> 필자는 Devops를 처음해본다. 끼워 맞추기 정도의 수준이니 감안하고 보기 바란다.


현 회사에서 처음으로 '내부통제' 라는것을 만나게 되었다.

전체적으로는 이해하지 못했지만 IT 시스템측면에서 보면 돈과 관련된 기능들을 잘관리하고 있는지
관리하고 있지 않다면 왜그런지 소명해야하고 앞으로 어떤식으로 관리해야하는지 그에대해 특정기한내로 적용해야 한다.

예약시스템을 예로 들었을때 IT관리자가 악용해서 성수기 추첨을 조작한다거나 돈을 빼돌린다거나 하는 것을
관리 하는것이다. 게임쪽에서 유명한 [궁댕이맨 사건] [1] 같은것을 통제하는 정책으로 보면 될것 같다.

내부통제를 보완점을 보다보니 시스템으로 접근하면 쉽게 처리될것들이 눈에 들어왔다. 그래서 그것들을
하나씩 적용해보기로 했다.

## 1. 환경이해하기
아래는 필자가 다니고 있는 회사의 환경이다.

[이미지]

- 서버구성 : 개발서버(SVN, Jekins, 개발DB), 이중화된 운영서버, DB운영서버
- OS : centos
- DB : Oracle

여기서 내부통제관련 문제가 되는 부분과 추가도입 내용은 아래와 같다. 
- DB서버에 운영자가 직접적으로 접근 가능하다는것
- Jekins의 사용자 암호 보안정책
- Jekins의 권한관리
- git 도입


## 2. Centos에 Docker 설치하기

이부분은 많은 블로그들에 잘정리되어 있으니 빠르게 넘어가자.
참고했던 블로그 위주로 정리하겠다. 

처음 설치할때는 아무생각없이 개발서버에 gitlab을 설치했는데 설정하고나니 여러서버에 설치해야되는 상황이었다.
그래서 docker도 맛볼겸 써보기로 했다.


### 2.1 Centos에 Docker 설치
    a. Yum-utils 업데이트 
        yum install -y yum-utils

    b. Docker-ce 레포 추가
        yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

    c. Docker 설치
        yum install docker-ce docker-ce-cli containerd.io -y

    d. Docker 시작
        systemctl start docker

    e. Docker 서비스등록
        systemctl enable docker


여기까지 설치가 완료 되었다. 
도커에 대해 3페이지 정도 분량으로 잘 정리되어 있는 블로그가 있으니 한번 읽어보면 좋을것 같다.

https://tech.cloudmt.co.kr/2022/06/29/%EB%8F%84%EC%BB%A4%EC%99%80-%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88%EC%9D%98-%EC%9D%B4%ED%95%B4-1-3-%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88-%EC%82%AC%EC%9A%A9%EB%B2%95/



[1]: https://namu.wiki/w/%EB%8D%98%EC%A0%84%EC%95%A4%ED%8C%8C%EC%9D%B4%ED%84%B0%20%EC%A7%81%EC%9B%90%20%EA%B6%8C%ED%95%9C%20%EB%82%A8%EC%9A%A9%20%EB%85%BC%EB%9E%80