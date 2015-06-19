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

#### Example of bind value inspect
```html
	<input id="bind1">
	<p>
		First input value is <span id="bind2"></span>
	</p>
```
```javascript
var binder = new nd.Binder(10); // initial value
binder.bindNode("#bind1");
binder.bindNode("#bind2");
binder.inspect(function(value){
	//if input is empty then execute transaction with return false;
	if(value === ""){ return false; }
});
```

#### Example of binding with many properties
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
  
  
## Update history #

#### 0.27.x 업데이트
  - [x] 'node' 함수가 생겼고 '$' 싱글턴 오브젝트가 사라졌습니다. node는 NodeQuery모듈의 초기화 함수 입니다.
  - [ ] $some 의 표현의 제거되어 테스트페이지를 고쳐야 됩니다.
  - [ ] 테스트페이지에 새로운 스타일시트 헬퍼 codykit적용.
  - [x] 새로운 드로세라에서 nody 객체가 좀 더 확연히 드러나도록 코어를 수정하였습니다.
  - [x] node.css 함수가 생겼습니다. nd.node.css("#foo",".active"); 이런식으로 어트리뷰트를 추가할수 있습니다.
  - [ ] 데이터와 연동이 자연스럽게 연결되는 ActiveController 업데이트
  - [ ] ActiveController의 should... API가 어플리케이션 동작의 신뢰성을 떨어트려 재설계
  - [ ] ContentLoader의 하위모듈(3개)의 통일성이 떨어져 재설계
  - [ ] TimeProperties 모듈에서 Cubicbezior 공식이 도입될수 있도록 반영.
  - [ ] Form모듈의 리모트폼 구현

  - [ ] 패키지 그룹의 컨샙이 명확하도록 분리 (core,util,interface,webenv,selector,node,ui)
  - [ ] 통신모듈의 재설계
  - (\[source:+5kB(324)\] \[min:+3kB(190)\])

#### 0.26.x 업데이트
  - [x] TimeProps 모듈 추가
  - [x] Timeline 모듈 추가
  - [x] Manage모듈의 효과적인 사용이 가능해짐
  - [x] makes의 표현식과 exp의 표현식을 결합함 ".list-$*4" 와 ".list-\\{$i*4}"는 같은 표현식임 ".list-\\{(($i+20)*20)-5}" 이런식으로 다양하게 숫자를 만들어낼수 있게되었음.
  - [x] FormController가 뷰상태에 초점이 맞춰졌고 초기화 순서가 변경됨
  - [x] MVVM 모듈 그룹과 Binder, ModuleEventManager, Template 모듈을 완전히 통합
  - [x] DataContext의 데이터를 다시 데이터로 업데이트 할 수 있게 되었습니다. 이로서 렌더링 부하가 줄었습니다.
  - [x] 이미 렌더링이 끝난 ViewModel을 다시 재활용이 가능하도록 업데이트 하였습니다.
  - (\[source:+17kB(319)\] \[min:+10kB(187)\])
  
## 프로젝트의 방향 #
데이터를 쉽게 뷰로 구성하고 반영할 수 있도록 할것입니다.
타이밍 이벤트, 네트워크에 대한 강화가 이루어질것입니다.
