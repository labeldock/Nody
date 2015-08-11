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

#### 0.29.1 업데이트
  - [x] Adobe Air의 스토리지 관련 지원을 제거하였습니다.
  - [x] 내부에서 STORE 모듈 영역이 분리되었습니다.
  - [x] 인스턴트 데이터를 취급하는 FLASH 모듈이 추가되었습니다.
  - [x] LocalStorage와 SessionStorage의 기능을 모두 지원합니다.
  - [x] LocalStorage와 SessionStorage의 기능을 모두 지원합니다.
  - [x] Contexts 모듈의 기능을 좀 더 최소화함
  - [x] ActiveContexts 모듈을 완전히 다시 작성함.
  - [ ] 다중 Partial모듈 셋팅시 하위 Partial모듈의 셋팅을 가져오는것을 검토합니다.
  - [ ] 코어:모든 모듈에 공통적으로 release를 추가하는것을 검토.
  - [ ] 코어:Source관리 모듈이 아닌 모듈이 훨씬 많아 Source관리 메서드 제거 검토.
  - [ ] LinkData에 behavior 추가에 대한 검토.
  - [ ] 테스트페이지의 컨텐츠가 모두 version2labs.github.io로 옮겨집니다.
  - [ ] Contexts와 ActiveContexts의 API가 재설계 됩니다.
  - ( 코드량이 이전과 동일함 ^____^ : \[source:311\] \[min:175\])
  
#### 0.28 업데이트
  - [x] Partial모듈의 파셜노드들의 재사용성이 강화되었습니다.
  - [x] String모듈이 StringSource로 명칭 변경
  - [x] ZString모듈이 제거됨
  - [x] Number모듈이 제거됨 추후 NumberSource로 새로 작성할 계획
  - [x] UID, Meta모듈이 제거됨
  - [x] Request모듈이 재작성됨
  - [x] Open모듈이 제거되고 open메서드가 추가됨
  - [x] HTMLOpen모듈이 제거됨
  - [x] ManagedData모듈이 LinkData로 명칭 변경
  - [x] 일대다 DataContext - Presentor의 관계에서 중요한 버그 수정
  - (\[source:-21kB(303)\] \[min:-15kB(175)\])

  
## 프로젝트의 방향 #
데이터를 쉽게 뷰로 구성하고 반영할 수 있도록 할것입니다.
타이밍 이벤트, 네트워크에 대한 강화가 이루어질것입니다.
