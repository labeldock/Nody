![Nody.js](/logo/nodyjs-small.png)
==================================
# Introduce #
Nody.js는 데이터 관점에서 Node를 쉽게 구성하기 위한 라이브러리이다. 

## Feature #

  - Nody plays well with another library
  - Nody helps create node as CSS Style
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

  - Nody can find node and mix function
```javascript
FIND('div','#wrapper');
FIND('ul li',0); //=> nth-child 0
FIND('ul li',jQuery).css('color','red');
```

  - Nody is easy to make node with template and data
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
  
  - Nody is easy to bind node

```javascript
MAKETO('div#placeholder-1, div#placeholder-2','body');

var dataContext = new NFDataContext({name:'hello world'});

new NFPresentor('#placeholder-1',dataContext,['<input type="text" nf-bind="name">'],true);
new NFPresentor('#placeholder-2',dataContext,['<input type="text" nf-bind="name">'],true);
```

```
	Just do it in console before include the Nody.js
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