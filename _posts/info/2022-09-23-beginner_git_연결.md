---
layout: single
title: 🧐느즈막히 시작하는 git(local)
categories: info
tag: [git, sourcetree]
toc: true
---

## 1. git?
git은 '분산 버전관리 시스템'이다. 또는 이러한 명령어를 가리킨다.
> 참조 : https://ko.wikipedia.org/wiki/%EA%B9%83_(%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4)

조금 풀어 설명하자면 git은 저장소(repository)에 파일이나 폴더의 버전을 분산하여 관리할수 있는 시스템인것이다.
이전 SVN 등과 같은 저장소 관리 시스템들이 있었는데 모든 버전관리시스템을 이길수 있었던 이유는 분산 덕분이라고 볼 수 있다.

* git은 저장소 버전관리 시스템이다. 분산을 곁들인...


## 2. git 시작하기(command)
git이 설치되어 있다고 보고 시작해보자.
예제의 터미널 툴은 MobaXterm를 사용한다.

### 2.1 MobaXterm 간단한 사용법
<pre>
<img src="/images/git/img.png"/>
start local terminal 클릭

<img src="/images/git/img_1.png"/>
cd /drivers/c/
* c 드라이버로 이동

</pre>

### 2.2 local에서 시작하기
<pre>
a. 폴더 생성
   mkdir [폴더명] && cd [폴더명]
   ex) mkdir gitsample && cd gitsample 

b. 저장소 생성하기
   git init
   
c. 저장소 삭제하기
   rm -rf .git
</pre>

### 2.3 local에서 변경된 파일 관리
<pre>
a. 파일 C or U or D
   // 수정후 저장 
   $ vi gittest.txt 

b. Staging area로 이동
   git add [폴더 or 파일]
   
   // 현재 폴더 이하 전체 모든 변경내용 [폴더 or 파일]
   $ git add .
    
   // 전체 변경된 모든내용 [폴더 or 파일]
   $ git add -A
    
   // 현재 폴더에 있는 gittest.txt 파일  
   $ git add gittest.txt
   
   // 뭐가 바꼈는지 하나씩 확인하면서 파일 add
   $ git add -p
   * perl 패키지 필요
        
c. Staging area에서 내리기
   git reset HEAD [폴더 or 파일]
   $ git reset HEAD .
   
d. 변경 상태 확인(Staging area)
   $ git status
   <img src="/images/git/img_2.png"/>
   // commit 된 파일의 상태는 확인되지 않는다.
   
e. 변경(commit) 기록
   git commit -m "[커밋 메세지]"
   $ git commit -m "first commit"
   
f. 변경(commit) 상태 확인
   $ git log
   // 'test' 이런식의 commit message는 작성하지 말자.
   <img src="/images/git/img_3.png"/>
   
d. 변경(commit) 상태 되돌리기 
   // [방법 1] commit을 취소하고 해당 파일들은 staged 상태로 워킹 디렉터리에 보존
   $ git reset --soft HEAD^
   
   // [방법 2] commit을 취소하고 해당 파일들은 unstaged 상태로 워킹 디렉터리에 보존
   $ git reset --mixed HEAD^ // 기본 옵션
   $ git reset HEAD^ // 위와 동일
   $ git reset HEAD~2 // 마지막 2개의 commit을 취소
   
   // [방법 3] commit을 취소하고 해당 파일들은 unstaged 상태로 워킹 디렉터리에서 삭제
   $ git reset --hard HEAD^
   
   [참조] https://gmlwjd9405.github.io/2018/05/25/git-add-cancle.html
   
e. 최종 변경(commit) 메세지 변경
   $ git commit --amend
</pre>

### 2.3 local에서 브런치 관리
<img src="/images/git/img_8.gif"/>

<pre>
a. 브런치 생성
   git branch [브런치명]
   
   $ git branch develop
   
   // 현재 branch merge하면서 전환
   $ git branch -m develop2
   
b. 브런치 리스트 확인
   $ git branch
   <img src="/images/git/img_4.png"/>
   
   // git branch -m develop 했을경우
   <img src="/images/git/img_5.png"/>
   
   // git branch develop 했을경우
   <img src="/images/git/img_6.png"/>
   
c. 브런치 전환하기
   git checkout [브런치명]
   
   $ git checkout develop
   <img src="/images/git/img_7.png"/>
   
</pre>