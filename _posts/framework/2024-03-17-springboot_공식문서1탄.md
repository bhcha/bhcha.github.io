---
layout: single
title: 🏗Spring Boot - 공식문서(Quickstart)로 살펴보는 스프링부트 1탄 - Quickstart
categories: framework
tag: [Java, SpringBoot, IntelliJ, Java17, Spring3.2]
toc: true
#author_profile: false
#sidebar:
#    nav: "docs"
---

아무도 시키지 않았지만 회사의 레거시 시스템을 갈아엎어야 되는 상황.  
필자는 몇년전부터 주언어를 Javascript로 정하고 공부하고 있던 터라 가급적 Javascript와 함수형으로 짜고 싶지만 그건 나의 욕심이고 회사에서 사용하기 위해서는 
다시 SpringBoot와 Java를 꺼내야 할것 같아 다시 처음부터 공부해보기로 했다. 블로그와 인프런 등 많은 강의들이 있지만 공식문서만 보면서 처음부터 해보려 한다.  

현재 본인팀의 상황은 점진적인 마이그레이션이나 차세대프로젝트가 불가능한 상황이라 플랫폼으로 구축하여 분산하는 전략을 세웠다. 
* 사실 아무도 하자고한것도 아니고 혼자 끄적그리면서 혼자 공부겸 조금씩 해보려 한다. 그래서 블로그에 먼저 정리하면서 해보고 잘될것 같으면 회사에서 수면위로 올리고 아니면 드랍할 예정이다.

> reference : spring.io > [quickstart](https://spring.io/quickstart)  
> IDE : IntelliJ  
> Java : 17  
> Spring : 3.2  
> Build Tool : Gradle


## 0. What You Will Build - 구축할 내용
<img src="/images/spring/img_10.png" alt="">

## 1. Start a new Spring Boot project - 새 Spring Boot 프로젝트 시작
### 1) IntelliJ > New Project > Spring Initializr  
<img src="/images/spring/img_2.png" alt="">
* 공식문서에서 추천한 "BellSoft Liberica JDK version 17." 사용  

### 2) Web > Spring Web 선택
<img src="/images/spring/img_1.png" alt="">  

## 2. Add your code - 코드추가
경로 : src > main > java > com > spring > bhcha > BhchaApplication.Java
```java
package com.spring.bhcha;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class BhchaApplication {

	public static void main(String[] args) {
		SpringApplication.run(BhchaApplication.class, args);
	}


	@GetMapping("/hello")
	public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
		return String.format("Hello %s!", name);
	}
}
```

<span style="color:red">* </span> 공식문서에서는 restful에 포함되는 내용이나 첫설명에 포함하는게 좋을것 같아 포함시켰다.

* `@SpringBootApplication` 어노테이션은 아래 내용들을 포함하는 어노테이션이다.  
* `@Configuration` 애플리케이션 컨텍스트에 대한 빈 정의의 소스로서 클래스에 태그를 지정합니다.
* `@EnableAutoConfiguration` : 클래스 경로 설정, 기타 빈 및 다양한 속성 설정을 기반으로 빈 추가를 시작하도록 Spring Boot에 알립니다. 예를 들어, spring-webmvc가 클래스 경로에 있는 경우 이 어노테이션은 애플리케이션을 웹 애플리케이션으로 플래그를 지정하고 DispatcherServlet 설정과 같은 주요 동작을 활성화합니다.
* `@ComponentScan` : com/example 패키지에서 다른 컴포넌트, 구성 및 서비스를 찾아 컨트롤러를 찾을 수 있도록 Spring에 지시합니다.


## 3. Try it - 실행
### 1) 터미널 실행
```shell
# mac 터미널 실행 단축키
option + f12   
# gradle 실행 커맨드 
./gradlew bootRun
``` 

### 2) IntelliJ 버튼으로 실행
<img src="/images/spring/img.png" alt="">  
버튼을 눌러 실행  

<img src="/images/spring/img_3.png" alt="">    
결과물!

## 4. Pop quiz
URL끝에 ?name=Amy를 붙이면 어떤일이 일어 날까요?


여기까지 quickstart 끝!  

> [다음 : Building a RESTful Web Service](../springboot_공식문서2탄)