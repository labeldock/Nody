![Nody.js](/logo/nodyjs-small.png)
==================================
Nody.js는 데이터 관점에서 표준적인 방법으로 DOM을 쉽게 구성하기 위한 라이브러리입니다. 

## Feature #
  - Nody plays well with another library
  - Nody helps create node as CSS Style
  - 노드를 찾은 후 바로 다른 파라메터 안에 다른 액션을 사용할 수 있습니다.
  - 템플릿 사용이 편하며 표현이 매우 다양합니다.
  - 바인딩을 쉽게 구현할수 있습니다.

#### Example of create node
```javascript
nd.make('button.btn.btn-default#btn-action');
//=> <button class="btn btn-default" id="btn-action"></button>

nd.make('input[type=checkbox][checked]');
//=> <input type="checkbox" checked="" value="">

nd.make('div',
	nd.make('a',nd.make('span','first value')),
	nd.make('a',nd.make('span','second value'))
);
//=> <div><a><span>first value</span></a><a><span>second value</span></a></div>
```
```javascript
nd.makes('div>a>span::first value+span::second value');
//=> [ <div><a><span>first value</span><span>second value</span></a></div> ]

nd.makes('ul>li.item-$*3');
//=> [ <ul><li class="item-1"></li><li class="item-2"></li><li class="item-3"></li></ul> ]

nd.makes('table>thead>tr>td^^tbody>tr>td');
//=> [ <table><thead><tr><td></td></tr><tbody><tr><td></td></tr></tbody></thead></table> ]

nd.makes('h1::title+p::subtitle+section>header+.content+footer');
//=> [ <h1>title</h1>, <p>subtitle</p>, <section><header></header><div class="content"></div><footer></footer></section> ]
```


#### Example of selector
```javascript
nd.find('div','#wrapper'); //=> [element...]
nd.find('ul li',0); //=> element
nd.find('ul li',jQuery).attr('role','list-item');  // => [li[role=list-item]]
```

#### Example of binding
```html
	<input id="bind1">
	<p>
		Input value is <span id="bind2"></span>
	</p>
```
```javascript
var binder = new nd.Binder(10); // initial value
binder.bindNode("#bind1");
binder.bindNode("#bind2");
// That's it! :)
```

#### Example of binding 2
```html
	<input id="bind1">
	<input id="bind2">
	<p>
		First input value is <span id="bind1-1"></span>
	</p>
	<p>
		Second input value is <span id="bind2-1"></span>
	</p>
```
```javascript
var binder = new nd.Binder({"bind1":5,"bind2":10}); // initial value
binder.bindNode("#bind1","bind1");
binder.bindNode("#bind1-1","bind1");

binder.bindNode("#bind2","bind2");
binder.bindNode("#bind2-1","bind2");
```

#### Example of template
```javascript
nd.makes('ul#ul','body');

var temp = new nd.Template('<li nd-class="index" nd-value="item-value"></li>');
	temp.renderTo('#ul',
		[
			{'index':'index1','item-value':'A'},
			{'index':'index1','item-value':'B'},
			{'index':'index1','item-value':'C'},
			{'index':'index1','item-value':'D'}
		]
	);
```
  
#### Example of partial (and binding)
```javascript
nd.makes('div#placeholder-$*2','body');

var dataContext = new nd.DataContext({name:'hello world'});

new nd.Presentor('#placeholder-1',dataContext,['<input type="text" nd-bind="name">'],true);
new nd.Presentor('#placeholder-2',dataContext,['<input type="text" nd-bind="name">'],true);
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
Nody는 AMD로 지원을 전환하면서부터 0.26까지는 매우 불안정 할 예정입니다.
0.27부터는 안정화 되면서 api변경이 줄것으로 예상됩니다.

#### 0.25.7 업데이트
  - [x] dateExp, timeStampExp, timeScaleExp 업데이트 및 추가
  - [x] TimeProps 모듈 추가
  - [ ] Timeline 모듈 추가
  - [x] Binder모듈 디자인골 달성
  - [ ] MVVM그룹과 Binder모듈을 통합
  - [ ] 데이터와 연동이 자연스럽게 연결되는 ActiveController 업데이트
  - [ ] ActiveController의 should... API가 어플리케이션 동작의 신뢰성을 떨어트려 재설계
  - [ ] 새로운 스타일시트 헬퍼 codykit적용
  - [ ] Form모듈 강화 (리모트폼 구현)
  - [ ] Touch모듈이 Pointer이벤트 모델과 비슷하게 재설계
  - [ ] ContentLoader의 하위모듈(3개)의 통일성이 떨어져 재설계
  - [ ] 패키지 그룹의 컨샙이 명확하도록 분리 (core,util,interface,webenv,selector,node,ui)
  - [ ] 통신모듈의 재설계
  - (316+)
  
#### 0.25.6 업데이트
  - [X] 메서드 디자인의 변화 map, getMap 등의 패턴이 setMap, map으로 변경
  - [X] 문자 연산 퍼포먼스를 약간 더 빠르게 함
  - [X] node template의 컨샙을 명확히 함
  - [X] nd.makes에서 template태그 생성을 제대로 지원합니다.
  - [X] Template모듈 초기화시 좀 더 다양하고 합리적인 방법으로 만들수 있게 하였습니다.
  - [X] node template의 컨샙을 명확히 함
  - [X] MVVM 모듈 안정화
  - [X] 모듈 메서드 버그 fix
  - [X] ActiveStatus > ViewAndModel > FormController 상속관계 성립
  - [X] ActiveStatus > ViewAndModel > RoleController 상속관계 성립
  - [X] Touch, ScrollBox, ScrollTrack 모듈 제거됨
  - [x] RoleComponent의 구체화
  - [x] 여러객체의 값을 동기화 시켜주는 Binder모듈이 새로 추가됨 특별한 부분은 값이 바인딩될때 객체마다의 권한과 결정에 따라 트렌젝션 같은 처리가 가능
  - [x] 파싱의 효율을 높이기 위해 Number에 모듈 메서드가 추가됨
  - (-13kb:316)
  
#### 0.24.9 업데이트 
  - [x] 테스트 및 데이터압축 툴로 middleman을 사용하게 되었습니다.
  - [x] middleman으로 빌드시 자동으로 dist에 배포됩니다.
  - [x] requirejs의 AMD를 지원합니다.
  - [x] Nody와 관련된 객체와 함수를 window.nody에 모두 담는것을 검토.
  - [x] window.nody의 축약어 적용 "nd" 노드상의 nf어트리뷰트도 모두 nd로 적용.
  - [x] 모듈의 "NF" 접두어를 제거.
  - [x] Nody에 등록된 함수들의 이름이 uppercase 로 고정되는것을 제거
  - [x] ::is isNok 제거, isTextNumber와 isText가 asNumber와 asString로 변경
  - [x] 코어 업데이트 : 메서드의 이름이 "++"로 시작하면 모듈 메서드로 추가됩니니다.(super호출 불가능)
  - [x] Template에 html(string) 파셜 추가
  - (+28kb:329)
  
  
## 프로젝트의 방향 #
데이터를 쉽게 뷰로 구성하고 반영할 수 있도록 할것입니다.
타이밍 이벤트, 네트워크에 대한 강화가 이루어질것입니다.
