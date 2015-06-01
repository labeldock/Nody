![Nody.js](/logo/nodyjs-small.png)
==================================
Nody.js는 데이터 관점에서 Node를 쉽게 구성하기 위한 라이브러리입니다. 
(여기서의 Node란 DOM의 Node를 말하는것입니다.)

## Feature #
  - Nody plays well with another library
  - Nody helps create node as CSS Style
  - 노드를 찾은 후 바로 다른 파라메터 안에 다른 액션을 사용할 수 있습니다.
  - 템플릿 사용이 편하며 표현이 매우 다양합니다.
  - 바인딩을 쉽게 구현할수 있습니다.

#### 노드생성 예제
```javascript
MAKE('button.btn.btn-default#btn-action');
MAKE('input[type=checkbox][checked]');
MAKE('div',
	MAKE('a',MAKE('span','first value')),
	MAKE('a',MAKE('span','second value'))
);
```
```javascript
MAKES('div>a>span::first value+span::second value');
MAKES('ul>li.item-$*3');
MAKES('table>thead>tr>td^^tbody>tr>td');
```


#### 노드선택 예제
```javascript
FIND('div','#wrapper'); //=> [element...]
FIND('ul li',0); //=> element
FIND('ul li',jQuery).attr('role','list-item');  // => [li[role=list-item]]
```

#### 템플릿 사용 예제
```javascript
MAKES('ul#ul','body');

var temp = new NFTemplate('<li nf-class="index" nf-value="item-value"></li>');
	temp.renderTo('#ul',
		[
			{'index':'index1','item-value':'A'},
			{'index':'index1','item-value':'B'},
			{'index':'index1','item-value':'C'},
			{'index':'index1','item-value':'D'}
		]
	);
```
  
#### 파셜 및 바인딩 예제
```javascript
MAKES('div#placeholder-$*2','body');

var dataContext = new NFDataContext({name:'hello world'});

new NFPresentor('#placeholder-1',dataContext,['<input type="text" nf-bind="name">'],true);
new NFPresentor('#placeholder-2',dataContext,['<input type="text" nf-bind="name">'],true);
```

```
	Nody가 불러와진 상태에서 콘솔로 바로 실행해 보세요.
	(Just do it in console before include the Nody.js)
	아래의 데모를 통해 Nody를 실행해불 수 있습니다.
```

# Live demo #
<a href="http://nineten11.net/nody/">http://nineten11.net/nody/</a>

## Compatibility #
  - IE9+
  - chrome4+
  - safari4+
  - firefox
  - opera
  
  
## Nody 0.24 ~ 0.30 TODO #
Nody는 아직 설계상 문제점을 가지고 있어 수정이 더 들어갈 예정입니다.

#### 적용예정리스트
  
  - 모듈생성이 Nody에 덜 의존적인 방법에 대한 검토.
  - IE8지원을 위한 코드 개발을 중단합니다. 더불어 Polyfill 코드를 줄입니다.
  - 데이터의 시간별 제어가 가능하도록 Timeline, TimePoints 모듈이 추가됩니다.
  - 탬플릿 API사용의 직관성이 떨어진다 판단하여 Template 모듈 재설계
  - ContentLoader의 하위모듈(3개)의 통일성이 떨어져 재설계
  - ActiveController의 should... API가 어플리케이션 동작의 신뢰성을 떨어트려 재설계
  - Form모듈 강화 (리모트폼 구현)
  - Touch모듈이 Pointer이벤트 모델과 비슷하게 재설계
  - 패키지 그룹의 컨샙이 명확하도록 분리 (core,util,interface,webenv,selector,node,ui)
  - 통신모듈의 재설계
  
#### 0.24 업데이트
  - [x] 테스트 및 데이터압축 툴로 middleman을 사용하게 되었습니다.
  - [x] middleman으로 빌드시 자동으로 dist에 배포됩니다.
  - [x] requirejs의 AMD를 지원합니다.
  - [ ] 새로운 스타일시트 헬퍼 codykit적용
  - [ ] Nody와 관련된 객체와 함수를 window.nody에 모두 담는것을 검토.
  - [ ] window.nody의 축약어 적용 "nd" 노드상의 nf어트리뷰트도 모두 nd로 적용.
  - [ ] 모듈의 "NF" 접두어를 제거.
  - [ ] Nody에 등록된 함수들의 이름이 uppercase 로 고정되는것을 제거
  
## 프로젝트의 방향 #
본 라이브러리는 베타버전이며 아직도 많은 API들이 없어지고 생기고 있습니다.
현재 중점은 구체적인 UI구현부는 제거될것이고 데이터, 타이밍, 이벤트, 네트워크의 베이스코드는 강화하될 예정입니다.
