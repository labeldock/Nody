![Nody.js](/logo/nodyjs-small.png)
==================================
# Introduce #
Nody.js는 데이터 관점에서 Node를 쉽게 구성하기 위한 라이브러리이다. 

## Feature #

  - 다른 라이브러리와 이질감 없이 사용할 수 있습니다.(Nody plays well with another library)
  - CSS스타일로 노드를 생성할 수 있습니다.(Nody helps create node as CSS Style)
```javascript
MAKE('div');
MAKE('button.btn.btn-default#btn-action');
MAKE('input[type=checkbox][checked]');
MAKE('div',
	MAKE('a',MAKE('span','first value')),
	MAKE('a',MAKE('span','second value'))
);

MAKETO('div#foo, div#bar, div#third','body');
```

  - 노드를 찾은 후 바로 다른 파라메터 안에 다른 액션을 사용할 수 있습니다.(Nody can find node and mix function)
```javascript
FIND('div','#wrapper');
FIND('ul li',0); //=> nth-child 0
FIND('ul li',jQuery).css('color','red');
```

  - 템플릿 사용이 편하며 표현이 매우 다양합니다.(Nody is easy to make node with template and data)
```javascript
MAKETO('ul#ul','body');

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
  
  - 바인딩을 쉽게 구현할수 있습니다.(Nody is easy to bind node)

```javascript
MAKETO('div#placeholder-1, div#placeholder-2','body');

var dataContext = new NFDataContext({name:'hello world'});

new NFPresentor('#placeholder-1',dataContext,['<input type="text" nf-bind="name">'],true);
new NFPresentor('#placeholder-2',dataContext,['<input type="text" nf-bind="name">'],true);
```

```
	Nody가 불러와진 상태에서 콘솔로 바로 실행해 보세요.
	(Just do it in console before include the Nody.js)
	
	혹은 아래의 데모를 통해 Nody를 실행해불 수 있습니다.
```

# Live demo #
<a href="http://nineten11.net/nody/">http://nineten11.net/nody/</a>

## Compatibility #
### Recommend #
  - IE9+
  - chrome4+
  - safari4+
  
### Incomplete Support #
  - IE8+
  - firefox
  - opera

## Version info #

#### 0.21.5
- IE8에서 쿼리셀렉터가 동작하도록 조정
- 순수 Nody셀렉터 엔진 완전제거
- 얼티네네이티브 셀렉터 엔진을 Sizzle로 변경


## 예정된 계획 #

#### 0.23 예정
- 0.22.x 버전 버그수정 및 호환성 향상을 목표로 합니다.


#### 0.30 예정
- Rails의 기본 패턴에 최적화된 MVVM + Remote 컨트롤 제작 
- 사용되지 않는 API가 다수 제거 될것입니다.

#### 0.31 예정
- 1.0 배포를 위한 전체적인 호환성 및 퍼포먼스 검토가 이루어질 것입니다.