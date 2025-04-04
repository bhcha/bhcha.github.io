# Spring Cloud Data Flow Shell & Skipper Shell 사용법

> 솔직히 CLI는 멋있다. 
 
## 1. Dataflow Shell

### 주요 기능
- **스트림 및 태스크 정의 생성, 배포, 모니터링**  
  SCDF 서버의 다양한 기능을 커맨드라인에서 수행할 수 있습니다.
- **애플리케이션 등록 및 관리**  
  스트림과 배치 작업을 정의하고 관리하며, 애플리케이션을 등록하고 배포 상태를 모니터링할 수 있습니다.

### 용도
- **데이터 파이프라인 관리 및 모니터링**  
  SCDF 서버와 상호 작용하여 데이터 파이프라인을 관리하고 모니터링하는 데 사용됩니다.
- **자동화 및 스크립팅**  
  반복적인 작업을 자동화하거나, GUI 대신 커맨드라인 환경에서 작업을 선호하는 사용자에게 유용합니다.

### 설치법
> [공식 문서 참고](https://dataflow.spring.io/docs/installation/local/manual/#downloading-server-jars)

```bash
# wget으로 다운로드
wget https://repo.maven.apache.org/maven2/org/springframework/cloud/spring-cloud-dataflow-shell/2.11.5/spring-cloud-dataflow-shell-2.11.5.jar

# 또는 curl로 다운로드
curl -O https://repo.maven.apache.org/maven2/org/springframework/cloud/spring-cloud-dataflow-shell/2.11.5/spring-cloud-dataflow-shell-2.11.5.jar
```

### 사용법

#### 1. 접속
```bash
java -jar spring-cloud-dataflow-shell-2.11.5.jar --dataflow.uri=#{url정보}
```
> *contextpath 등을 설정하면 바로 연결이 안되므로 `uri`를 지정해야 합니다.*

#### 2. 명령어 목록 확인
```bash
help
```

#### 3. app 등록
```bash
app register --name file-sync-start --type processor --uri maven://com.idstrust:file-sync-start-processor:jar:1.0.0
app register --name file-sync-pusher --type processor --uri maven://com.idstrust:file-sync-pusher-processor:jar:1.0.0
app register --name file-sync-finish --type sink --uri maven://com.idstrust:file-sync-finish-sink:jar:1.0.0
```



---

## 2. Skipper Shell

### 주요 기능
- **애플리케이션의 배포, 업그레이드, 롤백**  
  애플리케이션의 라이프사이클 관리를 커맨드라인에서 수행할 수 있습니다.
- **패키지 검색 및 관리**  
  패키지 검색, 설치, 업그레이드, 롤백 등의 작업을 지원합니다.

### 용도
- **애플리케이션 배포 및 버전 관리**  
  Skipper 서버와 상호 작용하여 스트림 애플리케이션의 버전 관리, 배포 전략 설정, 롤백 등의 작업을 수행하는 데 사용됩니다.
- **지속적인 배포 파이프라인 구축**  
  스트림 애플리케이션의 지속적인 배포(CD) 파이프라인을 구축하거나, 배포 상태를 모니터링하고 관리하는 데 유용합니다.

> [공식 문서 참고](https://docs.spring.io/spring-cloud-skipper/docs/2.11.5/reference/htmlsingle/#getting-started-installing-skipper)

```bash
# wget으로 다운로드 (공식 문서 기준)
wget http://repo.spring.io/5/org/springframework/cloud/spring-cloud-skipper-shell/2.11.5/spring-cloud-skipper-shell-2.11.5.jar

# 또는 curl로 다운로드
curl -O http://repo.spring.io/5/org/springframework/cloud/spring-cloud-skipper-shell/2.11.5/spring-cloud-skipper-shell-2.11.5.jar
```

> **⚠ 현재 공식 문서 기준 Skipper Shell 다운로드 링크(위 URL)는 404 오류가 발생합니다.**  
> 따라서 Maven Repository에서 직접 다운로드해야 합니다.

```bash
# wget으로 다운로드 (Maven Repository)
wget https://repo1.maven.org/maven2/org/springframework/cloud/spring-cloud-skipper-shell/2.11.5/spring-cloud-skipper-shell-2.11.5.jar

# 또는 curl로 다운로드
curl -O https://repo1.maven.org/maven2/org/springframework/cloud/spring-cloud-skipper-shell/2.11.5/spring-cloud-skipper-shell-2.11.5.jar
```

### 사용법

#### 1. 접속
```bash
java -jar spring-cloud-skipper-shell-2.11.5.jar
```
> *Skipper는 일반적으로 context path 설정이 필요하지 않습니다.*

#### 2. 명령어 목록 확인
```bash
help
```

---

## 🚀 참고 사항
- SCDF 및 Skipper Shell을 활용하면 **GUI 없이도 스트림 및 태스크 애플리케이션을 쉽게 관리할 수 있습니다.**
- **Skipper Shell의 공식 다운로드 URL이 404 오류를 반환하므로, Maven Central Repository에서 다운로드해야 합니다.**

🚀 **SCDF 및 Skipper Shell을 활용하여 효율적인 데이터 파이프라인을 구축하세요!** 🚀
