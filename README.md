![Nody.js](/logo/nodyjs-small.png)
==================================
Nody.js는 데이터 관점에서 표준적인 방법으로 DOM을 쉽게 구성하기 위한 라이브러리입니다. 

## Feature #
  - 다른 라이브러리와 친근하게 사용할수 있도록 설계하고 있습니다.
  - 객체지향 디자인을 따르고 있습니다.
  - 다양한 Enumulator가 존재합니다.
  - 콘솔에서 손쉽게 사용할수 있게 설계되었습니다.
  - 영향받은 언어나 라이브러리 : Ruby, CoreData, Backbone, jQuery, Emmet

#### Basic example
```javascript
nd.make('button.btn.btn-default#btn-action');
//=> <button class="btn btn-default" id="btn-action"></button>

nd.make('div',
	nd.make('a',nd.make('span','first value')),
	nd.make('a',nd.make('span','second value'))
);
//=> <div><a><span>first value</span></a><a><span>second value</span></a></div>

nd.makes('div>a>span::first value+span::second value');
//=> [ <div><a><span>first value</span><span>second value</span></a></div> ]

nd.makes('ul>li.item-$*3');
//=> [ <ul><li class="item-1"></li><li class="item-2"></li><li class="item-3"></li></ul> ]

nd.find('div','#wrapper'); 
//=> [element...]

nd.find('ul li',0); 
//=> element

//you also using like jquery
nd.node('#foo').addClass("bar").text("hello");
//=> [ <div id="foo" class="bar">hello</div> ]
```

#### Other 
   - Data
   - Binder
   - Form
   - Template
   - Partial
   - MVVM
  
link => <a href="http://version2labs.github.io/build/nodyjs.html">http://version2labs.github.io/build/nodyjs.html</a>

## Compatibility #
  - IE9+
  - chrome4+
  - safari4+
  - firefox
  - opera
  
  
## Update history #

#### 0.29.7 업데이트
  - [x] Adobe Air의 스토리지 관련 지원을 제거하였습니다.
  - [x] 내부에서 STORE 모듈 영역이 분리되었습니다.
  - [x] 인스턴트 데이터를 취급하는 FLASH 모듈이 추가되었습니다.
  - [x] LocalStorage와 SessionStorage의 기능을 모두 지원합니다.
  - [x] Contexts 모듈의 기능을 좀 더 최소화함
  - [x] ActiveContexts 모듈을 완전히 다시 작성함.
  - [x] 노드 쿼리 핸들러에 expval이 추가됨.
  - [x] Partial 모듈의 "group", "value"키워드가 "for", "val"로 변경됨.
  - [x] 테스트 페이지 변경 및 웹페이지 컨텐츠를 version2labs.github.io로 옮깁니다.
  - [x] KIT 싱글턴 패키지가 DATAKIT으로 이름 변경, 메서드 업데이트
  - [ ] 메모리 자동 해제를 위해 모든 모듈에 release를 추가함.
  - [ ] 모듈의 Source관리 메서드 제거.
  - ( 코드가 증가함 : \[min:178(+3)kB\])
  
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
  - (\[min:-15kB(175)\])

  
## 프로젝트의 방향 #
데이터를 쉽게 뷰로 구성하고 반영할 수 있도록 할것입니다. 타이밍 이벤트, 네트워크에 대한 강화가 이루어질것입니다.

#### 1.0 beta1 까지
필요없는 메서드 제거, 각 모듈과 메서드 이름이 일관성 유지, 각 모듈별 공통 인터페이스 통합, MVVM 모듈 검토 및 클라우드 데이터 사용 가능성 검토가 끝나면 1.0 넘버링이 붙을 예정입니다.
