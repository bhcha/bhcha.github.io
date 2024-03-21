---
layout: single
title: Spring Boot - 공식문서 보며 따라하는 스프링부트(2탄 - Building a RESTful Web Service)
categories: Spring
tag: [Java, SpringBoot, IntelliJ, Java17, Spring3.2]
toc: true
#author_profile: false
#sidebar:
#    nav: "docs"
---

> [이전 : quickstart](../springboot_공식문서1탄)
 

> <span style="color:red">* </span> 표시는 공식문서에는 없는 첨언이다.

> reference : spring.io > [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service)  
> IDE : IntelliJ  
> Java : 17  
> Spring : 3.2  
> Build Tool : Gradle



## 0. What You Will Build - 구축할 내용

이렇게 호출하면
```
http://localhost:8080/greeting
```

이런결과를 받고
```json
{"id":1,"content":"Hello, World!"}
```

name 파라미터를 붙여 값을전달하며 호출 하면
```
http://localhost:8080/greeting?name=User
```
아래과 같은 결과물을 받을수 있게 구축할 예정
```json
{"id":1,"content":"Hello, User!"}
```


## 1. Create a Resource Representation Class - 리소스 표현 클래스 생성
아래와 같은 결과물을 받기 위해서 리소스 표현 클래스를 만들어야 한다.
```json
{"id":1,"content":"Hello, World!"}
``` 
경로:"src/main/java/com/example/restservice/"에 Greeting.java 파일을 만들어주자.    
<img src="/images/spring/img_4.png">  
해당 파일에 아래 소스를 입력해주자.  
```java
package com.spring.bhcha.restservice;

public record Greeting(long id, String content) { }
```
> Jackson JSON이라는 라이브러리를 사용하는데 웹 스타터에 포함된 라이브러리이다.  

> <span style="color:red">* </span> record는 jdk14이상에서 지원하는 class로 "일반적으로 데이터베이스 결과, 쿼리 결과, 서비스 정보 등의 데이터를 단순히 보관하기 위해 클래스를 작성합니다."라는 목적을 가진 클래스이다.  
> 참조 : [참조사이트](https://www.baeldung.com/java-record-keyword)


## 2. Create a Resource Controller - 리소스 컨트롤러 만들기
새로운 컨트롤러를 하나 생성해야한다. 경로:"src/main/java/com/example/restservice/"에 GreetingController.java 파일을 만들어주자.
```java
package com.example.restservice;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetingController {

	private static final String template = "Hello, %s!";
	private final AtomicLong counter = new AtomicLong();

	@GetMapping("/greeting")
	public Greeting greeting(@RequestParam(value = "name", defaultValue = "World") String name) {
		return new Greeting(counter.incrementAndGet(), String.format(template, name));
	}
}
```

심플한데 많은 기능이 부여되어 있다. 
### 1) `@GetMapping`어노테이션은 /greeting에 대한 HTTP GET 요청이 greeting() 메서드에 매핑하는 역할이다.
> Post방식을 이용하려면 `@PostMapping`를 모두를 파생하며 동의어 역할을 하는 `@RequestMapping` 어노테이션도 있다. get방식으로 사용하려면 `@RequestMapping(메서드=GET)`  

### 2) `@RequestParam`는 파라미터로 'name'을 받겠다는 의미이며 값이 없으면 World로 치환해서 이용하겠다는 의미이다.
### 3) `@RestController`는 `@Controller`와 `@ResponseBody`를 모두 포함하기 위한 약어이다.
> <span style="color:red">* </span> `@Controller`는 MVC에서 C에 해당하는 내용으로 차후 MVC를 보면서 따로 알아보고 `@ResponseBody`는 요청의 response의 body에 해당 내용을 실어보내기 위한 어노테이션이다.  

### 4) 별도 JSON으로 변환할 필요는 없다. Jackson 2가 포함되어 있어 Spring의 [MappingJackson2HttpMessageConverter](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/http/converter/json/MappingJackson2HttpMessageConverter.html)가 자동으로 선택되어 Greeting 인스턴스를 JSON으로 변환한다.


* 현재까지의 폴더 구조  
<img src="/images/spring/img_5.png">

## 3. Try it - 실행
### 1) 터미널 실행
단축키 : mac > option + f12
명령어 실행 : mac > ./gradlew bootRun

### 2) IntelliJ 버튼으로 실행
<img src="/images/spring/img.png" alt="">  
버튼을 눌러 실행  

### 3) 배포 파일로 만들어 실행
a. 터미널 실행  
```shell
# mac 터미널 실행 단축키
option + f12   
# gradle build 커맨드 
./gradlew build
```


<span style="color:red">* </span> intelliJ를 이용하여 배포파일 생성  
<img src="/images/spring/img_7.png" alt="">

* 파일 경로  
  <img src="/images/spring/img_6.png" alt="">


b. Java파일 실행    
```shell
java -jar build/libs/프로젝트명-0.1.0.jar
```


## 4. Test the Service - 서비스 테스트
```
http://localhost:8080/greeting?name=bhcha
```
?name=bhcha와 같은 querystring은 `@RequestParam`에 값으로 전달된다.  
* 결과  
  <img src="/images/spring/img_8.png" alt="">


[//]: # (> [다음 : Consuming a RESTful Web Service]&#40;../springboot_공식문서3탄&#41;)