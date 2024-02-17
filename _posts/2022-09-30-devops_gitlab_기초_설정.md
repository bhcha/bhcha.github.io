---
layout: single
title: DevOps_Gitlab 기초설정
categories: Devops
tag: [gitlab기초, DEVOPS, gitlab]
toc: true
---

gitlab을 활용해보기 앞서 기본적인 설정을 해보자.

## 1. 프로젝트 생성
> 왼쪽상단위 Menu > Create new project > Create blank project > 내용입력 > Create Project

## 2. 프로젝트 멤버관리
<img src="/images/devops/img_37.png"/>

프로젝트 선택 > Project > Members

### 2.1 멤버 추가
<img src="/images/devops/img_38.png"/>

우측상단 Invite members 선택

### 2.2 멤버 role 설정
<img src="/images/devops/img_39.png"/>

<pre>
// All
Owner : 프로젝트 생성자.

// Merge
Maintainer(PM) : 해당 프로젝트와 관련된 모든권한

// Merge Request
Developer : 브런치 생성및 push 가능(protected 브랜치는 불가능). 
            Merge Request 가능. 
            코드리뷰 가능.
Reporter : 이슈 관리 가능. 
           Merge Request 요청 가능

// Comment
Guest : 프로젝트를 직접적으로 수행하지는 않지만, 프로젝트에 커멘트를 남기거나 그룹 / 프로젝트 조회가 가능한 권한
</pre>

## 3 Labels 설정
대표 label 설정 - 해당기능은 모든프로젝트에 적용되는 것은 아니고 추천 label 정도로 이용된다.

> 왼쪽 상단 메뉴 > Admin > Labels

<img src="/images/devops/img_40.png"/>
> 왼쪽 메뉴 > Project information > Labels
* issue에서 사용할 Label을 설정 할 수 있다.
* Label은 하나의 issue에 n개 설정 할 수 있다.

<pre>
a. gitlab에서 기본적으로 제안하는 label
   gitlab 공식문서에 해당 상태들에 대한 상세설명은 없다.
   link: https://docs.gitlab.com/ee/user/project/labels.html

   1) bug  버그
   2) confirmed : 확인
   3) critical : 치명적
   4) discussion : 논의
   5) documentation : 서류작성
   6) enhancement : 강화
   7) suggestion : 제안
   8) support : 지원

b. 칸반보드 상태
   위와 같이 label을 사용하면 이슈 상태에 대해서만 관리가 되기 때문에 칸반의 진행상태들을 label로 같이 설정해서 이용하기를 제안한다.
   구분이 되도록 'Status::'를 붙여 구분지어 준다.
   1) Status::Backlog - 해야될일
   2) Status::In Progress - 진행중인 일
   3) Status::Peer Review - 동료평가
   4) Status::In Test - 테스트
   5) Status::Done - 완료
   6) Status::Blocked - 어떠한 사유로 인해 멈춰진 상태

c. 팀구분
   Gitlab에는 그룹이 존재하지만 역할별 구분은 미비한것으로 보인다.
   예를 들어, 한 그룹에서도 개발팀, 디자인팀등 여러 역할이 구분될것임으로 역할도 label로 구분하여 관리하면 좋을것 같다.
   구분이 되도록 'Team::'를 붙여 구분지어 준다.
   1) Team::develop - 개발
   2) Team::design - 디자인
   3) Team::plan - 기획
   4) Team::publish - 퍼블리쉬
</pre>
 