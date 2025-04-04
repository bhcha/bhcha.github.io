파일명 : docker-compose.yml  

설정되어 있는것 :   
### 1. context-path
ex) scdf.com/dataflow

### 2. repository 연결
nexus 연결

```yml
services:
  dataflow-server:
    user: root
    # jdk17로 설정하지 않으면 spring bot 3.X지원 안함.
    # 정확하게는 spring boot 3.X대는 java 17이상이어야 하는데 jdk17옵션을 빼면 기본적으로 jdk11로 지정되고 있음.
    image: springcloud/spring-cloud-dataflow-server:2.11.5-jdk17
    container_name: dataflow-server
    ports:
      - "9393:9393"
    environment:
      # URI Path 설정시 ex:)https://dataflow.com/dataflow가 홈인경우
      - SERVER_SERVLET_CONTEXT_PATH=/dataflow
      - TZ=Asia/Seoul
      - LANG=en_US.utf8
      - LC_ALL=en_US.utf8
      - JAVA_OPTS=-Duser.timezone=Asia/Seoul -Dfile.encoding=UTF-8 -Dsun.jnu.encoding=UTF-8
      # Set CLOSECONTEXTENABLED=true to ensure that the CRT launcher is closed.
      - SPRING_CLOUD_KUBERNETES_ENABLED=false
      - SPRING_CLOUD_DATAFLOW_APPLICATIONPROPERTIES_TASK_SPRING_CLOUD_TASK_CLOSECONTEXTENABLED=true
      - SPRING_CLOUD_SKIPPER_CLIENT_SERVER_URI=${SKIPPER_URI:-http://skipper-server:7577}/api
      # (Optionally) authenticate the default Docker Hub access for the App Metadata access.
      - SPRING_CLOUD_DATAFLOW_CONTAINER_REGISTRY_CONFIGURATIONS_DEFAULT_USER=${METADATA_DEFAULT_DOCKERHUB_USER}
      - SPRING_CLOUD_DATAFLOW_CONTAINER_REGISTRY_CONFIGURATIONS_DEFAULT_SECRET=${METADATA_DEFAULT_DOCKERHUB_PASSWORD}
      - SPRING_CLOUD_DATAFLOW_CONTAINER_REGISTRYCONFIGURATIONS_DEFAULT_USER=${METADATA_DEFAULT_DOCKERHUB_USER}
      - SPRING_CLOUD_DATAFLOW_CONTAINER_REGISTRYCONFIGURATIONS_DEFAULT_SECRET=${METADATA_DEFAULT_DOCKERHUB_PASSWORD}
      
      # nexus
      - MAVEN_REMOTEREPOSITORIES_REPO1_URL=http://---------------/repository/dataflow-proxy/
      - MAVEN_REMOTEREPOSITORIES_REPO1_AUTH_USERNAME=admin
      - MAVEN_REMOTEREPOSITORIES_REPO1_AUTH_PASSWORD=P@ssw0rd1!
    depends_on:
      - skipper-server
    restart: always
    volumes:
      - ${HOST_MOUNT_PATH:-.}:${DOCKER_MOUNT_PATH:-/home/cnb/scdf}
    command: ["java", "-Duser.timezone=Asia/Seoul", "-jar", "/app.jar"]


  app-import-stream:
    image: springcloud/baseimage:1.0.4
    container_name: dataflow-app-import-stream
    depends_on:
      - dataflow-server

  app-import-task:
    image: springcloud/baseimage:1.0.4
    container_name: dataflow-app-import-task
    depends_on:
      - dataflow-server
    command: >
      /bin/sh -c "
        ./wait-for-it.sh -t 360 dataflow-server:9393;
        wget -qO- '${DATAFLOW_URI:-http://dataflow-server:9393}/apps' --no-check-certificate --post-data='uri=${TASK_APPS_URI:-https://dataflow.spring.io/task-maven-3-0-x&force=true}';
        echo 'Maven Task apps imported'"

  skipper-server:
    user: root
    #    image: springcloud/spring-cloud-skipper-server:${SKIPPER_VERSION:-2.11.3-SNAPSHOT}${BP_JVM_VERSION:-}
    image: springcloud/spring-cloud-skipper-server:2.11.5-jdk17
    container_name: skipper-server
    ports:
      - "7577:7577"
      - ${APPS_PORT_RANGE:-20000-20195:20000-20195}
    environment:
      - TZ=Asia/Seoul
      - LANG=en_US.utf8
      - LC_ALL=en_US.utf8
      - JDK_JAVA_OPTIONS=-Dfile.encoding=UTF-8 -Dsun.jnu.encoding=UTF-8
      - SERVER_PORT=7577
      - SPRING_CLOUD_KUBERNETES_ENABLED=false
      - SPRING_CLOUD_SKIPPER_SERVER_PLATFORM_LOCAL_ACCOUNTS_DEFAULT_PORTRANGE_LOW=20000
      - SPRING_CLOUD_SKIPPER_SERVER_PLATFORM_LOCAL_ACCOUNTS_DEFAULT_PORTRANGE_HIGH=20190
      - LOGGING_LEVEL_ORG_SPRINGFRAMEWORK_CLOUD_SKIPPER_SERVER_DEPLOYER=ERROR
      # nexus
      - MAVEN_REMOTEREPOSITORIES_REPO1_URL=http://10.0.101.103:3412/repository/dataflow-proxy/
      - MAVEN_REMOTEREPOSITORIES_REPO1_AUTH_USERNAME=admin
      - MAVEN_REMOTEREPOSITORIES_REPO1_AUTH_PASSWORD=P@ssw0rd1!

    restart: always
    volumes:
      - ${HOST_MOUNT_PATH:-.}:${DOCKER_MOUNT_PATH:-/home/cnb/scdf}
      - /home/workday:/home/workday
    command: ["java", "-Duser.timezone=Asia/Seoul", "-jar", "/app.jar"]


```

파일명 : docker-compose-mysql.yml
```yml
services:
  mysql:
    image: mysql:5.7
    container_name: dataflow-mysql
    platform: linux/amd64
    environment:
      LANG: en_US.utf8
      LC_ALL: en_US.utf8
      JDK_JAVA_OPTIONS: '-Dfile.encoding=UTF-8 -Dsun.jnu.encoding=UTF-8'
      MYSQL_DATABASE: dataflow
      MYSQL_ROOT_PASSWORD: rootpw
      MYSQL_ROOT_HOST: '%'
      TZ: Asia/Seoul
    expose:
      - 3306
    ports:
      - 3306:3306
    volumes:
      - '/etc/localtime:/etc/localtime:ro'
      - /etc/localtime:/etc/localtime:ro     # cent os
    command:
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci

  dataflow-server:
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/dataflow?permitMysqlScheme
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=rootpw
      - SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.mariadb.jdbc.Driver
    depends_on:
      - mysql

  skipper-server:
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/dataflow?permitMysqlScheme
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=rootpw
      - SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.mariadb.jdbc.Driver
    depends_on:
      - mysql

```

파일명 : docker-compose-kafka.yml
```yml

services:

  kafka-broker:
    image: confluentinc/cp-kafka:5.5.2
    container_name: dataflow-kafka
    expose:
      - "9092"
    ports:
      - 9092:9092
    environment:
      - LANG=en_US.utf8
      - LC_ALL=en_US.utf8
      - JDK_JAVA_OPTIONS=-Dfile.encoding=UTF-8 -Dsun.jnu.encoding=UTF-8
      - KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://kafka-broker:9092
      - KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181
      - KAFKA_ADVERTISED_HOST_NAME=kafka-broker
      - KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1
      - KAFKA_LOG4J_ROOT_LOGLEVEL=ERROR
      - KAFKA_LOG4J_LOGGERS=org.apache.zookeeper=ERROR,org.apache.kafka=ERROR,kafka=ERROR,kafka.cluster=ERROR,kafka.controller=ERROR,kafka.coordinator=ERROR,kafka.log=ERROR,kafka.server=ERROR,kafka.zookeeper=ERROR,state.change.logger=ERROR
    depends_on:
      - zookeeper

  zookeeper:
    image: confluentinc/cp-zookeeper:5.5.2
    container_name: dataflow-kafka-zookeeper
    expose:
      - "2181"
    environment:
      - ZOOKEEPER_CLIENT_PORT=2181

  dataflow-server:
    environment:
      - SPRING_CLOUD_DATAFLOW_APPLICATIONPROPERTIES_STREAM_SPRING_CLOUD_STREAM_KAFKA_BINDER_BROKERS=PLAINTEXT://kafka-broker:9092
      - SPRING_CLOUD_DATAFLOW_APPLICATIONPROPERTIES_STREAM_SPRING_CLOUD_STREAM_KAFKA_STREAMS_BINDER_BROKERS=PLAINTEXT://kafka-broker:9092
      - SPRING_CLOUD_DATAFLOW_APPLICATIONPROPERTIES_STREAM_SPRING_CLOUD_STREAM_KAFKA_BINDER_ZKNODES=zookeeper:2181
      - SPRING_CLOUD_DATAFLOW_APPLICATIONPROPERTIES_STREAM_SPRING_CLOUD_STREAM_KAFKA_STREAMS_BINDER_ZKNODES=zookeeper:2181
      - SPRING_CLOUD_DATAFLOW_APPLICATIONPROPERTIES_STREAM_SPRING_KAFKA_STREAMS_PROPERTIES_METRICS_RECORDING_LEVEL=DEBUG
    depends_on:
      - kafka-broker

  skipper-server:
    environment:
      - SPRING_CLOUD_DATAFLOW_APPLICATIONPROPERTIES_STREAM_SPRING_CLOUD_STREAM_KAFKA_BINDER_BROKERS=PLAINTEXT://kafka-broker:9092
      - SPRING_CLOUD_DATAFLOW_APPLICATIONPROPERTIES_STREAM_SPRING_CLOUD_STREAM_KAFKA_STREAMS_BINDER_BROKERS=PLAINTEXT://kafka-broker:9092
      - SPRING_CLOUD_DATAFLOW_APPLICATIONPROPERTIES_STREAM_SPRING_CLOUD_STREAM_KAFKA_BINDER_ZKNODES=zookeeper:2181
      - SPRING_CLOUD_DATAFLOW_APPLICATIONPROPERTIES_STREAM_SPRING_CLOUD_STREAM_KAFKA_STREAMS_BINDER_ZKNODES=zookeeper:2181
      - SPRING_CLOUD_DATAFLOW_APPLICATIONPROPERTIES_STREAM_SPRING_KAFKA_STREAMS_PROPERTIES_METRICS_RECORDING_LEVEL=DEBUG
    depends_on:
      - kafka-broker

  app-import-stream:
    command: >
      /bin/sh -c "
        ./wait-for-it.sh -t 360 dataflow-server:9393;
        wget -qO- '${DATAFLOW_URI:-http://dataflow-server:9393}/dataflow/apps' --no-check-certificate --post-data='uri=${STREAM_APPS_URI:-https://dataflow.spring.io/kafka-maven-latest&force=true}';
        wget -qO- '${DATAFLOW_URI:-http://dataflow-server:9393}/dataflow/apps/sink/dataflow-tasklauncher/${DATAFLOW_VERSION:-2.11.3-SNAPSHOT}' --no-check-certificate --post-data='uri=maven://org.springframework.cloud:spring-cloud-dataflow-tasklauncher-sink-kafka:${DATAFLOW_VERSION:-2.11.3-SNAPSHOT}';
        echo 'Maven Stream apps imported'"
```