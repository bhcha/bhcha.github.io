---
layout: single
title: Spring Boot - 공식문서(Quickstart)로 살펴보는 스프링부트(3탄 - Consuming a RESTful Web Service)
categories: Spring
tag: [Java, SpringBoot, IntelliJ, Java17, Spring3.2]
toc: true
#author_profile: false
#sidebar:
#    nav: "docs"
---

> [이전 : Building a RESTful Web Service](../springboot_공식문서2탄)

> reference : spring.io > [Consuming a RESTful Web Service](https://spring.io/guides/gs/consuming-rest)  
> IDE : IntelliJ  
> Java : 17  
> Spring : 3.2  
> Build Tool : Gradle



## 0. What You Will Build - 구축할 내용
<img src="/images/spring/img_12.png">  

Spring의 RestTemplate을 사용하여 http://localhost:8080/api/random 에서 
임의의 Spring Boot 검색하는 애플리케이션을 빌드합니다.

## 1. Fetching a REST Resource - 리소스 가져오기 
해당 애플리케이션을 이용하기위해선 다른 애플리케이션 하나가 필요하다. [quoters프로젝트](ttps://github.com/spring-guides/quoters)
위 프로젝트를 받아 실행시킨 애플리케이션을 RestTemplate로 호출하는게 프로젝트의 목표이다.
```link
    http://localhost:8080/api/random
```
```json
{
    type: "success",
    value: {
        id: 10,
        quote: "Really loving Spring Boot, makes stand alone Spring apps easy."
    }
}
```

브라우저를 통해 호출하거나 curl을 통해 호출하는 방법도 있으나 그렇게 좋은 방법은 아니다.  

데이터를 포함할 도메인 클래스를 아래 경로에 만들어주자.  
<img src="/images/spring/img_9.png">  
```java
package com.spring.bhcha.consumingrest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Value(Long id, String quote) { }
```

```java
package com.spring.bhcha.consumingrest;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record Quote(String type, Value value) { }
```
`@JsonIgnoreProperties`은 이 유형에 바인딩되지 않은 속성은 모두 무시해야 함을 나타낸다.
JSON문서와 키가 일치 하지 않는 경우 `@JsonProperty`어노테이션을 사용해야 한다.

## 2. Finishing the Application 
[quoters프로젝트](ttps://github.com/spring-guides/quoters) 이 프로젝트를 받아 실행시키자. 그냥 실행시키게 되면 port가 8080으로 서비스가 작동하니
application.properties파일에 아래와 같이 설정해주자.
```properties
server.port=8081
```

다시 원래 프로젝트로 돌아와 아래 코드를 작성해보자.
```java
package com.example.consumingrest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class ConsumingRestApplication {

	private static final Logger log = LoggerFactory.getLogger(ConsumingRestApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(ConsumingRestApplication.class, args);
	}

	@Bean
	public RestTemplate restTemplate(RestTemplateBuilder builder) {
		return builder.build();
	}

	@Bean
	@Profile("!test")
	public CommandLineRunner run(RestTemplate restTemplate) throws Exception {
		return args -> {
			Quote quote = restTemplate.getForObject(
					"http://localhost:8081/api/random", Quote.class);
			log.info(quote.toString());
		};
	}
}
```
실행시키면 [quoters프로젝트]의 `/api/random`를 호출하여 Quote에 할당해준다. 이것을 `RestTemplate`을 이용 하는것이 이번작업이다.

flutter를 공부할때 공식문서를 보고 굉장히 재밌게 해서 간만에 스프링부트 공부하는거 인강 같은걸 안보고 해보자는 의미에서 공식문서를 보는데 생각보다 별로인것 같다.
남은 database, security, restdoc까지만 정리해야겠다.