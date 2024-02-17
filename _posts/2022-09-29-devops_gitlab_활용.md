---
layout: single
title: DevOps_Gitlab 활용(MR)
categories: Devops
tag: [DEVOPS, gitlab, docker, gitlab runner, gitlab ci/cd sql, 내부통제, SQL, gitlab mr]
toc: true
---

## 1. 프로젝트에 MR(Merge request) 활용하기
프로젝트에 '기획, 디자이너, 퍼블리셔, 프론트엔드, 백엔드' 구성원들이 투입되었다고 생각해보자. 구색은 그럴듯하지만 프로세스가 
제대로 잡혀 있지 않다면 소규모 개발보다 더 힘들어지게 된다. 이럴때 gitlab을 이용해 프로세스를 잡아보자.

> Merge request는 무엇을 할 수 있을까요?
요구사항 및 이슈 관리, 코멘트로 커뮤니케이션, 커밋리스트를 통한 협업활동, 파이프라인을 통해 테스트와 결과 확인, merge 승인을 통한 운영관리

### 1.1 역할배분
프로젝트를 하나 만들고 기획자에게 Maintainer 권한을 디자이너, 퍼블리셔, 개발자에게 developer 권한을 부여하자.
<img src="/images/devops/img_36.png" /> 

### 1.2 이슈등록
프로젝트를 진행하던중 화면을 변경해야 하는 일이 생겼다. 기획자는 이슈를 등록하여 기록을 남기고 이를 활용하여 업무분담을 할 수 있다.

