---
layout: single
title: Spring Boot - 공식문서 보며 따라하는 스프링부트(3탄 - Consuming a RESTful Web Service)
categories: Spring
tag: [Java, SpringBoot, IntelliJ, Java17, Spring3.2]
toc: true
#author_profile: false
#sidebar:
#    nav: "docs"
---

> [이전 : Building a RESTful Web Service](../springboot_공식문서2탄)

> <span style="color:red">* </span> 표시는 공식문서에는 없는 첨언이다.

> reference : spring.io > [Consuming a RESTful Web Service](https://spring.io/guides/gs/consuming-rest)  
> IDE : IntelliJ  
> Java : 17  
> Spring : 3.2  
> Build Tool : Gradle



## 0. What You Will Build - 구축할 내용

Spring의 RestTemplate을 사용하여 http://localhost:8080/api/random 에서 
임의의 Spring Boot 검색하는 애플리케이션을 빌드합니다.

