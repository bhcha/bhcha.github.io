---
layout: single
title: 
categories: info
tag: [info]
toc: true
---

## 📚 1. 상황
내가 만들었다고 이런것을 제대로 고민했을까 싶긴하지만 오늘도 역시나 남이 한것에 대한 문제를 파악하고 고치는 시간이 있었다.

어떤 시스템의 댓글이 중복으로 보이는 현상이었다. 원인을 하나씩 파악해보자.

>해당시스템은 React,Spring Boot로 구성된 시스템이다. 

---

## 2. 원인 파악
내가 만들고 모든 구조가 파악이 끝난경우가 아니면 문제를 파악하기 위해서 택하는 방법은 '소거법'이다.  
### 1) 데이터의 문제인가?
테이블을 확인해서 데이터가 정말 중복으로 들어가 있는지 확인한다.

### 2) 백엔드의 문제인가?
api를 통해 리턴되는 데이터의 문제가 없는지 파악한다.