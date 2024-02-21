---
layout: single
title: 로지텍 Mx Keys for mac 윈도우에서 사용하기(레지스트리변경) 
categories: info
tag: [키보드]
toc: true
#author_profile: false
#sidebar:
#    nav: "docs"
---

키보드에 크게 관심이 없다가 최근 맥북을 구입했는데 무슨 바람이 불었는지 키보드도 사야겠다는 결심이 들었다. 
평소에는 1만원짜리 유선키보드로 잘 이용할정도로 무신경한편이라 타건감? 그런건 중요하지 않았다. 
또 관심없는건 정말 안알아보는편이라 어떤 기계식키보드가 사무용으로 적합한지 몰라 무접점 키보드를 알아보던도중 
Mx Keys라는 키보드를 추천 받게되었다. 키보드는 노트북 자판간은 뭐라그랬는데 관심이 없어 기억을 하지 않았다.  

몇일간 핫딜이 안뜨나 기웃거리던 도중 MX Keys for mac이 10만원 이하이길래 맥북과 윈도우 같이 사용이 가능하다해서 덜컥 사버렸다.  
사무실로 배송이 왔고 우선 윈도우에 연결해서 쓰는데 윈도우키와 alt키가 반대였다.

검색을 해보니 PowerToys라는 프로그램을 사용하면 해결이 된다고 하여 기분좋게 설치를 하고 실행했다. 키보드 배열 변경이 잘되었으나 먼가 이상했다.
몇번에 한번은 변경된 배열로 누르는대도 alt키를 누르는데 윈도우가 호출되었다. 
나만그런건지 모르겠는데 변경된 키보드 배열이 백프로 적용되지 않았다.

그래서 찾은 방법이 레지스트리 변경이다.

## 1. 문제인식
1) command(window)키와 option(alt) 배열을 서로 바꾸어 주어야 한다.  
2) 한영키가 오른쪽 option이고 mx keys를 적응못하는 가장큰 이유가 한영키가 오른쪽 엄지로 안눌러질만큼의 스페이스바 길이다. 그래서 어차피 맥북은 한/영변경이 caps이기때문에 한영키를 caps로 변경하기로 했다.

## 2. 레지스트리변경
### 1) 레지스트리 창 오픈
```
win+R → regedit 입력
```  
<img src="/images/info/img.png" alt="">

### 2) 영역에 아래 경로 입력  
```
컴퓨터\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout
```
<img src="/images/info/img_1.png" alt="">

### 3) 파일생성
```
영역 마우스오른쪽 클릭 → 새로 만들기(N) → 이진값(B) → 파일명 : Scancode Map
```
<img src="/images/info/img_2.png" alt="">

### 4) 파일내용 변경
Scancode Map 더블클릭해서 오픈후 아래 내용을 그대로 기입하면 된다.
어차피 복붙 안되니 직접 입력하여야 한다.
<img src="/images/info/img_3.png" alt="">
```
해석하자면 총 3개를 바꿀건데 한/영키를 caps키에 덮어씌우고 option(alt)키를 command(win)키로
command(win)키를 option(alt)키로 변경한다. 라는 내용이다.
```

이진값을 알아내는건 다른 블로그의 이진값들을 참조하던가 아래 경로를 통해 KeyboardTest라는 프로그램을 받아 확인가능하다.
https://www.passmark.com/products/keytest/
그런데 다른 블로그나 정보들로 조합을 잘해봐도 안되는 경우들이 많았다.

문제가 두가지 남았는데 망할 for mac 키보드는 ins키가 fn키로 fn키는 regedit으로도 변경이 불가능하다.  
일반 사용자 분들은 ins키를 막아버릴정도로 많이 사용하지 않으시지만 필자가 사용하는 intellij에서 ins키로 자주쓰는 단축키가 두개가 있다.
> generate(alt+ins), Column Selection Mode(alt+shift+ins)  

키보드를 갖다 버리고 싶지만 오픈하면 환불이 불가하기에 단축키를 mac용으로 변경해서 쓰고 있다.
> generate(command+n), Column Selection Mode(command+shift+8)

키보드를 변경할때는 신중을 기하도록 하자.