---
layout: single
title: 🧐느즈막히 시작하는 git(remote)
categories: info
tag: [git, sourcetree]
toc: true
---

## 1. 원격 저장소

local로만 git을 사용하는 케이스는 거이 없다. 원격 저장소를 관리할 줄 알아야 다른사람들과 함께 일할 수 있다.
리모트 저장소를 관리하는 방법에 대해 알아보자.

## 2. git  연결
````
a. 원격 저장소 복제
   git clone [url]

b. 리모트 저장소 추가하기
   git remote add [단축이름] [url]
   $ git remote add pb https://github.com/paulboone/ticgit
````


### 2.1 git 원격 저장소에서 내려받기
````
a. 원격 저장소에 있는 데이터를 모두 확인하기
   git fetch [url or 단축이름]
   * 실제로 가지고 와서 merge 하지 않는다.
   
b. 원격 저장소에 있는 데이터 모두 가져오기
   git pull [url or 단축이름]
````

### 2.2 git 원격 저장소에 올리기
````
a. 원격 저장소에 모두 밀어넣기
   git push [url or 단축이름] [브랜치]
   $ git push origin master
   * commit된 항목들만
````

여기까지가 git 초급(?) 단계인것 같다. 이렇게만 간단하면 얼마나 좋을까.
하지만 실제 여러사람이 같이 일하는 경우 발생할수 있는 문제의 가지수는 굉장히 다양하다.
이런것들을 포스팅해보고 사내 주니어 or 미경험자분들에게 교육을 해보고 싶으나
필자 또한 모든 케이스를 겪은게 아니기 때문에 정리하기가 쉽지가 않다.

그래서 생각한 방법은 직접 경험 시켜드릴 수 있는 환경을 제공해드리는 노선을 선택했다. 어떤식으로
제공할지는 아래를 참고하도록 하자.

* 아직 미작성(git lab으로 정적 사이트 만들기)