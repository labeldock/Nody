![Nody.js](/source/logo/nodyjs-small.png)
==================================
Nody.js는 데이터 관점에서 Node를 쉽게 구성하기 위한 라이브러리입니다. 


## Feature #

  - 다른 라이브러리와 이질감 없이 사용할 수 있습니다.(Nody plays well with another library)
  - CSS스타일로 노드를 생성할 수 있습니다.(Nody helps create node as CSS Style)
  - 노드를 찾은 후 바로 다른 파라메터 안에 다른 액션을 사용할 수 있습니다.(Nody can find node and mix function)
  - 템플릿 사용이 편하며 표현이 매우 다양합니다.(Nody is easy to make node with template and data)
  - 바인딩을 쉽게 구현할수 있습니다.(Nody is easy to bind node)

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
### Recommend #
  - IE9+
  - chrome4+
  - safari4+
  
### Incomplete Support #
  - IE8+
  - air 13+
  - firefox
  - opera

## Project History #
2013년 Nody의 베이스코드는 에니메이션을 쉽게 구성하기위한 라이브러리였습니다. 
에니메이션과 함께 계속하여 업데이트된 Nody는 데이터 결합, 객체지향, 인터페이스등의 기능들이 보강이되었고
이미 많은 훌륭한 에니메이션 라이브러리들의 존재의 이유로 현재는 에니메이션과 UI부분이 제거되고 데이터, 노드 조작에 중점을 두고 만들어지고 있습니다.


## 프로젝트의 방향 #
본 라이브러리는 베타버전이며 아직도 많은 API들이 없어지고 생기고 있습니다.
현재 중점은 UI구현과 관련된 모듈은 제거될것이고 데이터, 타이밍, 이벤트, 네트워크쪽은 강화하될 예정입니다.


## Version info #

#### 0.23 에서 변경될 내용

적용완료
- nf 탬플릿을 위한 새 표현 추가 
```
MAKE('div[[foo]]');     => <div nf-value="foo"></div>
MAKE('div[[foo|src]]'); => <div nf-src="foo"></div>
```
- MAKES 에멧스타일 기술 가능('>','+','^','*','$',',' 문 지원)
```
MAKES('b::list+ul>li::item-$*3'); =>
[
    <b>list</b>,
    <ul><li>item-1</li><li>item-2</li><li>item-3</li></ul>
]
```
- TAGS, ZTEMP 추가
- BEZIERCURVEMAKE 추가

적용예정
- NFTemplate init규칙이 변경될 것입니다.
- NFTimeline 이 추가될것입니다.


## 예정된 계획 #

#### 0.30 예정
- Rails의 기본 패턴에 최적화된 MVVM + Remote 컨트롤 제작 
- 사용되지 않는 API가 다수 제거 될것입니다.

#### 0.31 예정
- 1.0 배포를 위한 전체적인 호환성 및 퍼포먼스 검토가 이루어질 것입니다.
