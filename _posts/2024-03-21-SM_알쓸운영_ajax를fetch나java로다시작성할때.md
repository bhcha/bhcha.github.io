---
layout: single
title: 알쓸운영 - jquery ajax통신 프로젝트를 fetch나 java로 재구현할때
categories: SM
tag: [sm, web, fetch, java, oracle CPU]
#toc: true
#author_profile: false
#sidebar:
#    nav: "docs"
---

잘사용하던 오래된 시스템을 한쪽의 사정만으로 고쳤을때 별거 아님에도 생각보다 문제가 발생하는 경우가 많다. 
오늘 직원한분이 우리 시스템에 SSL을 적용했는데 한 업체가 SSL을 지원하지 않아 통신이 되지 않는데 업체와 소통이 안된다고 얘기해왔다.
차근차근 이야기를 들어봤다.

액션은 한 프로세스가 종료후 A업체와 api통신 하는게 전부
1. 기존에는 ajax로 통신했었고 잘되었다.
2. https로 변경하다보니 https -> http로 일반적인 방법으로 호출을 못하는데 상대 업체에서는 언제 인증서를 적용할지 모르는 상황
3. 직원분께서 우선 DB에 저장했다가 Java 배치를 돌리며 업체에 발송하는 프로세스로 변경<span style="color:red">(실패)</span> 


ajax는 대충 아래와 같이 구축되어 있었다.
```javascript
let params = {
    userid : 'bhcha',
    passwd : 'passwd'
};

function doAjax() {
    params.type = 'ajax';

    $.ajax({
        type : "POST",
        url : "http://localhost:8080/communicationTest",
        data :	params,
        dataType :	'application/json',
        success : function(result, status) {
        }
    });
}

doAjax();
```

이걸 보고 우리 직원분은 java로 재구현 하였는데 httpclient lib를 이용해서 httppost를 사용하여 보냈는데 문제는 content-type을 application/json으로 지정하면서 발생했다.
**결론부터 말하자면 content-type을 지우던가 `application/x-www-form-urlencoded` 이렇게 발송 하면 된다.**
```java
// 문제가 되는 부분
httpPost.setHeader("Content-Type", "application/json;charset=UTF-8");
```

충분히 헷갈릴 수 있는 부분이다. 당신이 주니어라면 말이다...~~하지만 당신은 주니어가 아닌걸~~  
ajax가 아닌 fetch를 이용할때도 흔히들 하는 실수인데 fetch로 비슷하게 구현해보면 아래와 같다.

```javascript
let params = {
    userid : 'bhcha',
    passwd : 'passwd'
};

function doFetch() {
    params.type = 'fetch';
    
    const response = fetch("http://localhost:8080/communicationTest", {
        method: "POST", // *GET, POST, PUT, DELETE 등
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(params),
    });
}

doFetch();
```

### ajax로 발송할때
<img src="/images/sm/img_2.png" style="width: 70%">  

### fetch로 발송할때
<img src="/images/sm/img_3.png" style="width: 70%">

눈여겨 봐야 할곳은 content-type이다. ajax, fetch 둘 다 `application/json` 선언하여 발송되는 컨텐츠의 타입이 다르게 발송된다. 
이때 spring에서 `@RequestParam annotation`이나 `HttpServletRequest를 이용하여 getParameter`를 했을경우 ajax, fetch 두개의 예제는 
다르게 수신된다. 요즘도 이렇게 코딩을 하는지 모르겠지만 예전 레거시 시스템들의 경우 아래와 같이 request를 map으로 만드는 경우가 많았다.

```java
public static Map<String, String> extractParameters(HttpServletRequest request) {
    Map<String, String> parametersMap = new HashMap<>();

    Enumeration<String> parameterNames = request.getParameterNames();
    while (parameterNames.hasMoreElements()) {
        String paramName = parameterNames.nextElement();
        String paramValue = request.getParameter(paramName);
        parametersMap.put(paramName, paramValue);
    }

    return parametersMap;
}
```
해당 소스에서는 fetch나 httpclient의 content-type을 `application/json`로 발송했을 경우 값이 전달되지 않는다.  
아마 업체에서는 이런식으로 수신 받고 있었을 것이고 우리직원분은 계속 `application/json` 이렇게 발송하고 있었던 것이었다.