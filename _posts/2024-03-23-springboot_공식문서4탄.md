---
layout: single
title: Spring Boot - 공식문서(Quickstart)로 살펴보는 스프링부트(4탄 - Accessing data with MySQL)
categories: Spring
tag: [Java, SpringBoot, IntelliJ, Java17, Spring3.2, mysql]
toc: true
#author_profile: false
#sidebar:
#    nav: "docs"
---

> [이전 : Building a RESTful Web Service](../springboot_공식문서2탄)

> reference : spring.io > [Accessing data with MySQL](https://spring.io/guides/gs/accessing-data-mysql)  
> IDE : IntelliJ  
> Java : 17  
> Spring : 3.2  
> Build Tool : Gradle

## Before starting
DB가 필요하여 미뤄뒀던 [오라클클라우드](../../cloud/cloud_오라클클라우드)를 가입 하여 DB를 설치해서 연결해보기로 했다.


## 0. What You Will Build - 구축할 내용
<img src="/images/spring/img_13.png">  

MySQL 데이터베이스를 만들고 Spring 애플리케이션을 빌드한 다음 새로 만든 데이터베이스에 연결해보자.
