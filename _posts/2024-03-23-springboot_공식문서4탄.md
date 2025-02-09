---
layout: single
title: Spring Boot - 공식문서(Quickstart)로 살펴보는 스프링부트 4탄 - Accessing data with MySQL(MariaDB)
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
DB가 필요하여 미뤄뒀던 [오라클클라우드](../../cloud/cloud_오라클클라우드)를 가입 하여 DB를 설치해서 연결해보기로 했다. 설치는 maria db로 진행하였다.
공식 문서는 mysql이지만 설치가 번거롭기에 mariadb로 진행하였다.


## 0. What You Will Build - 구축할 내용
<img src="/images/spring/img_13.png">  

MySQL 데이터베이스를 만들고 Spring 애플리케이션을 빌드한 다음 새로 만든 데이터베이스에 연결해보자.

`How to complete this guide`, `Starting with Spring Initializr` 이 두스텝은 기존 공식문서 1~3탄에서 진행했기때문에 gradle dependency만 추가하도록 하자.
```properties
dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	implementation 'org.springframework.boot:spring-boot-starter-web'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
	runtimeOnly 'org.mariadb.jdbc:mariadb-java-client'
}
```
`Create the Database`은 오라클 클라우드에서 작업을 했기에 아래 테스트용 테이블만 생성하도록 하자. 
> 오라클클라우드 maria db에서 계정은 oclude로 생성하였다.

```sql
create database db_example; -- Creates the new database
```

## 1. Create the application.properties File
`src/main/resources`밑에 application.properties 파일이 없으면 만들어주자.
