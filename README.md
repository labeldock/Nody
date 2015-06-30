![Nody.js](/logo/nodyjs-small.png)
==================================
Nody.js는 데이터 관점에서 표준적인 방법으로 DOM을 쉽게 구성하기 위한 라이브러리입니다. 

## Feature #
  - Nody plays well with another library.
  - Nody helps create node as CSS Style.
  - 바인딩을 쉽게 구현할수 있습니다.
  - MVVM모듈이 내장되어있습니다.
  - 영향받은 언어나 라이브러리 : Ruby, Cocoa, Backbone, jQuery, Emmet

#### Example of create node
```javascript
nd.make('button.btn.btn-default#btn-action');
//=> <button class="btn btn-default" id="btn-action"></button>

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

#### Example of template
```javascript
var temp = new nd.Template('<li nd-class="index" nd-value="text"></li>');
	temp.renderTo('#ul',
		[
			{'index':'index1','text':'A'},
			{'index':'index1','text':'B'},
			{'index':'index1','text':'C'},
			{'index':'index1','text':'D'}
		]
	);
```

#### Example of partial (and binding)
```javascript
var dataContext = new nd.DataContext({name:'hello world'});

new nd.Presentor('#placeholder-1',dataContext,['<input type="text" nd-bind="name">'],true);
new nd.Presentor('#placeholder-2',dataContext,['<input type="text" nd-bind="name">'],true);
```

# Live demo #
<a href="http://version2labs.github.io/build/nodyjs.html">http://version2labs.github.io/build/nodyjs.html</a>

## Compatibility #
  - IE9+
  - chrome4+
  - safari4+
  - firefox
  - opera
  
  
## Update history #

#### 0.28.x 업데이트
  - [ ] 테스트페이지의 컨텐츠가 모두 version2labs.github.io로 옮겨집니다.
  - [ ] Contexts와 ActiveContexts의 API가 재설계 됩니다.
  - (\[source:-11kB(313)\] \[min:-9kB(181)\])
  
#### 0.27.x 업데이트
  - [x] Array모듈 연산시 반복문 오버헤드를 줄었습니다.
  - [x] Template모듈이 Template모듈과 Partial모듈로 기능이 분리되었습니다. 
  - [x] Template노드의 초기화부터 Partial렌더링까지 연산이 20배 이상 빨라졌습니다.
  - [x] 모듈생성&확장시 프로토타입을 생략하고 초기화 가능해졌습니다.
  - [x] data...함수와 다르게 진짜 배열만 동작하는 array...함수가 생겼습니다.
  - [x] clone함수가 재정의 되었습니다.
  - [x] 어떤 영역에 대한 노드 포함여부를 확인하기 위한 insideNode, outsideNode 함수가 생겼습니다.
  - [x] RoleController에서 콜백으로 role을 정의할수 있도록 변경되었습니다.
  - [x] NodeArray에 html, appendHTML, prependHTML 함수가 생겼습니다.
  - [x] 'node' 함수가 생겼고 '$' 싱글턴 오브젝트가 사라졌습니다. 여전히 싱글턴으로 사용가능하며 함수 자체는 NodeArray모듈의 초기화 함수 입니다.
  - [x] 새로운 드로세라에서 nody 객체가 좀 더 확연히 드러나도록 코어를 수정하였습니다.
  - [x] node.css 함수가 생겼습니다. nd.node.css("#foo",".active"); 이런식으로 어트리뷰트를 추가할수 있습니다.
  - [x] ContentLoader의 재정의 및 개발
  - (\[source:+5kB(324)\] \[min:+3kB(190)\])

  
## 프로젝트의 방향 #
데이터를 쉽게 뷰로 구성하고 반영할 수 있도록 할것입니다.
타이밍 이벤트, 네트워크에 대한 강화가 이루어질것입니다.
