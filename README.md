Nody.js
=======
Node + Friendly

# Sample #
<a href="http://nineten11.net/nody/">http://nineten11.net/nody/</a>


# Table of Contents
  - [Introduce](#introduce)
  - [Featrue](#feature)
  - [Simple showcase](#simple-showcase)
    - [Tag Generator](#showcase-tag-generator)
      - [Case1](#showcase-tag-generator-01)
      - [Case2](#showcase-tag-generator-02)
      - [Case3](#showcase-tag-generator-03)
      - [Case4](#showcase-tag-generator-04)
    - [셀렉트](#showcase-select)
      - [Select](#showcase-select-01)
	  - [Return node](#showcase-select-02)
      - [Switch to other selector](#showcase-select-03)
    - [Template & Partial](#showcase-template)
      - [Import template node](#showcase-template-01)
      - [Partial template node](#showcase-template-02)
	  - [Create template node](#showcase-template-03)
	  - [템플릿 안에 노드를 파셜하기](#showcase-template-04)
    - [MVVM](#showcase-mvvm)
      - [Basic](#showcase-template-01)
      - [With template](#showcase-template-02)
    - [Enumerate](#showcase-enumerate)
      - [Each](#showcase-enumerate-each)
      - [Map](#showcase-enumerate-map)
      - [Inject](#showcase-enumerate-inject)
      - [Each back](#showcase-enumerate-eachback)
      - [Object each](#showcase-enumerate-object-each)
    - [Parsing](#showcase-parsing)
    - [Type Inspect](#showcase-type-inspect)
      - [Type::IS](#showcase-type-inspect-is)
      - [Type::AS](#showcase-type-inspect-as)
    - [String](#showcase-string)
      - [ByteSize](#showcase-string-01) 
      - [String Model](#showcase-string-02) 
	- [ZString](#showcase-zstring)
	  - [Basic](#showcase-zstring-01)
	  - [With Param](#showcase-zstring-02)
	  - [Random Param](#showcase-zstring-03)
	  - [To many array](#showcase-zstring-05)
    - [Number](#showcase-number)
    - [Module](#showcase-module)
      - [Module::new](#showcase-module-new)
      - [Module::super](#showcase-module-super)
      - [Module::Inheritance](#showcase-module-inheritance)
	  - [Module::Default Veriable](#showcase-module-veriable)
  - [Version](#version-info)

<a name="introduce"/>
# introduce #
Nody.js는 DHTML 페이지를 쉽게 구성하고 제작하기 위한 라이브러리이다.

### Feature #
Nody는...

  1. 직관적인 Node 생성이 가능하다.
  2. 데이터의 관점에서 노드를 핸들링하기 위한 함수나 컨트롤러가 제공된다.
  3. 인라인 코딩을 지향한다.
  4. 내부적으로 객체지향을 구현하고 있다.

### Compatibility #
#### Recommend #
  - IE10+
  - chrome4+
  - firefoe 16+
  - safari4+
  - opera 15+

#### Minimum #
  - 일반적으로 IE9에서 동작되는것으로 확인되나 IE8까지 지원하도록 작업중이다.

<a name="simple-showcase"/>
## Simple showcase #
To understand the basic concepts of this library for example.



<a name="showcase-tag-generator"/>
### Tag Generator #
MAKE("...")이나 _Make("...") 태그생성이 가능하다.
```
아래 html결과물은 실질적으로 개행이 되지 않으나 이해를 돕기위해 개행과 들여쓰기를 집어넣었다.
```


<a name="showcase-tag-generator-01"/>
#### Case 1 #
css 스타일로 구현 가능

```javascript
        MAKE("div#hello.world[my=code]:disabled","foo"); 
```
```html
        <div id="hello" class="world" my="code" disabled>foo</div>
```

<a name="showcase-tag-generator-02"/>
#### Case 2 #
오브젝트를 값을 사용하여 만들수 있음
```javascript
        MAKE("div",{dataset:{hello:"world"},"id":"hello","class":"world",html:"foo"}); 
```
```html
        <div id="hello" class="world" data-hello="world">foo</div>
```

<a name="showcase-tag-generator-03"/>
#### Case 3 #
파라메터를 중첩하여 생성가능

```javascript
        MAKE('ul',
          MAKE('li.item','list1'),
          MAKE('li.item','list2')
        );
```
```html
        <ul>
           <li class="item">list1</li>
           <li class="item">list2</li>
        </ul>
``` 

<a name="showcase-tag-generator-04"/>
#### Case 4 #
테이블 생성예제

```javascript
        MAKE("table#my-table",
            MAKE("a[href=#]","link1"),
            MAKE("a[href=#]","link2"),
            MAKE("a[href=#]","link3")
        );
```
```html
        <table id="my-table">
            <tbody>
                <tr>
					<td>
						<a href="#">link1</a>
					</td>
				</tr>
                <tr>
					<td>
						<a href="#">link2</a>
					</td>
				</tr>
                <tr>
					<td>
						<a href="#">link3</a>
					</td>
				</tr>
            </tbody>
        </table>
```

<a name="showcase-select"/>
### 셀렉트 #

<a name="showcase-select-01"/>
#### Select #
```javascript
        FIND("div.target");
        //result => [div.target,div.target...]  <= native array
```

<a name="showcase-select-02"/>
#### Return node #
```javascript
		// Z(ero)Find
		ZFIND("div.target");
		//result => Element (<div class="target"></div>)
```

<a name="showcase-select-03"/>
#### Switch to other selector #
```javascript
        FIND("div.target",jQuery);
        //result=> [object jQuery]
```
<a name="showcase-template"/>
### Template & Partial #

<a name="showcase-template-01"/>
#### Import template node #
Tag
```html
		<!-- Container -->
		<ul id="container"></ul>
		
		<!-- Template -->
		<template id="li-temp">
			<li class="foo">bar</li>
		</template>
```
Script
```javascript
		for(var i=0,l=3;i<l;i++) _Template("template#li-temp").appendTo("ul#container");
```
Result
```html
		<ul id="container">
			<li class="foo">bar</li>
			<li class="foo">bar</li>
			<li class="foo">bar</li>
		</ul>
```

<a name="showcase-template-02"/>
#### Partial template node #
Tag
```html
		<template id="menu-item">
			<a node-href="hrefKey">
				<img node-src="srcKey">
				<span node-value="spanValueKey"></span>
				<input type="text" node-value="inputValueKey">
			</a>
		</template>
```
Script
```javascript
		var data = {
			"hrefKey"       : "#first",
			"srcKey"        : "somewhere.png",
			"spanValueKey"  : "InnerHTML value",
			"inputValueKey" : "Input value"
		};
		
		_Template("template#menu-item",data); => Result
```
Result
```html
	<a href="#first">
		<img src="somewhere.png">
		<span>InnerHTML value</span>
		<input type="text" value="Input value">
	</a>
```
<a name="showcase-template-03"/>
#### Create template node #
자바스크립트로 Template태그를 만들수 있다.
```javascript
		var template = MAKETEMP(
			TAG("ul.list",
				TAG("li.item"),
				TAG("li.item"),
				TAG("li.item")
		));
```
```html
	<template>
		<ul class="list">
			<li class="item"></li>
			<li class="item"></li>
			<li class="item"></li>
		</ul>
	</template>
```

다음과 같이 클론 가능하다.
```javascript 
		// import node
		document.importNode(template.content);
		//or
		_Template(template).get();
		//or
		IMPORTNODE(template);
```		

<a name="showcase-template-04"/>
#### 템플릿 안에 노드를 파셜하기 #
```html
	<div id="container">
	</div>
	<template id="part">
		<ul node-placeholder="list"></ul>
	</template>
```
```javascript
	_Template("#part",{
		"list":[MAKE("li.item::item1"),MAKE("li.item::item2")]
	}).appendTo("#container");
```
Result
```html
	<div id="container">
		<ul>
			<li class="item">item1</li>
			<li class="item">item2</li>
		</ul>
	</div>
```

<a name="showcase-mvvm"/>
### MVVM #

특징
  - 다중의 뎁스구조 지원
  - 데이터 모델의 구조를 미리 정의하지 않음
  - 일부만 따로 렌더링 할 수 있음
  - 실시간 바인드 지원

<a name="showcase-mvvm-01"/>  
#### Basic #
```javascript
	// Original data
	var data = [
		{index:"1",value:"one"},
		{index:"2",value:"two"},
		{index:"3",value:"three"}
	];
	
	// Presentation object
	var dataContext = _DataContext(data);
	
	// Draw model
	var viewModel = _ViewModel(
	//depth1
	function(){
		return this.placeholder("ul.top");
	},
	//depth2
	function(){
		return MAKE("li",MAKE("span",{href:this.data("index")}),this.bind("value","input?text"));
	});
	
	// View controller
	var viewController = _DataContextViewController("#container",dataContext,viewModel);
	viewController.needDisplay(); // draw view start
	
	//Get data
	dataContext.getJSONObject(); => [{index:"1",value:"one"},{index:"2",value:"two"},{index:"3",value:"three"}]
```
Result
```html
		<section id="container">
			<ul class="top">
				<li><span>1</span><input type="text" value="one"></li>
				<li><span>2</span><input type="text" value="two"></li>
				<li><span>3</span><input type="text" value="three"></li>
			</ul>
		</section>
```

<a name="showcase-mvvm-02"/>  
#### With template #

```html
	<template id="table" hidden>
		<table>
			<thead>
				<tr>
					<th>index</th>
					<th>value</th>
				</tr>
			</thead>
			<tbody node-placeholder></tbody>
		</table>
	</template>
	<template id="tbody-item">
		<tr>
			<td node-value="index"></td>
			<td node-value="value"></td>
		</tr>
	</template>
	
```
```javascript
		var dataContext = _DataContext(data);
		var viewModel = _ViewModel("template#table","template#tbody-item");
		var viewController = _DataContextViewController("#container",dataContext,viewModel);
		viewController.needDisplay();
```
Result
```html
	<section id="container">
		<table>
			<thead>
				<tr>
					<th>index</th>
					<th>value</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>1</td>
					<td>one</td>
				</tr>
				<tr>
					<td>2</td>
					<td>two</td>
				</tr>
				<tr>
					<td>3</td>
					<td>three</td>
				</tr>
			</tbody>
		</table>
	</section>
```

<a name="showcase-enumerate"/>
### enumerate #
참고 : 대문자로 호출하는 함수는 _Array,_Object 와 같은 모듈보다 훨씬 빠르다.

<a name="showcase-enumerate-each"/>
#### Each #
```javascript
		DATAEACH([1,2,3],function(value,index){
			console.log(value,index)
		});
		//or
		_Array([1,2,3]).each(function(value,index){
			console.log(value,index)
		});
		//log => 1,0
		//log => 2,1
		//log => 3,2
```

<a name="showcase-enumerate-map"/>
#### Map #
```javascript
		DATAMAP([1,3,5],function(v){
			return v+1;
		});
		//or
        _Array([1,3,5]).map(function(v){
            return v+1;
        });
        // => [2,4,6]
```

<a name="showcase-enumerate-inject"/>
#### Inject #
```javascript
		INJECTOBJECT([2,4,6],function(injectObject,value,index){
			injectObject[index] = value;
		});
		//or
		INJECTOBJECT([2,4,6],function(injectObject,value,index){
			injectObject[index] = value;
		},{});
		//or
        _Array([2,4,6]).inject({},function(injectObject,value,index){
            injectObject[index] = value;
        });
        //=>{0:2,1:4,2:6}
```

<a name="showcase-enumerate-eachback"/>
#### Eachback #
```javascript
		DATAEACHBACK([1,2,3],function(){
			console.log(value,index)
		});
		//or
		_Array([1,2,3]).eachback(function(value,index){
		   console.log(value,index)
		});
		//log => 3,2
		//log => 2,1
		//log => 1,0
```

<a name="showcase-enumerate-object-each"/>
#### Object each #
_Array와 마찬가지로 _Object도 동일하게 동작하도록 하는게 원칙입니다.
```javascript
		
        var sample = [];
        _Object({1:2,2:3,4:5}).each(function(value,key){
            sample.push(key+value);
        });
        console.log(sample);
        //=>["12", "23", "45"]
		
		//or
		ENUMERATION({1:2,2:3,4:5},function(value,key){
			console.log(key+value);
		});
```

<a name="showcase-parsing"/>
### Parsing #
TOOBJECT 파싱기능은 Json이거나 명확하지 않은 텍스트를 오브젝트로  파싱 가능하다.
```javascript
        TOOBJECT("{'hello':'world','foo':'bar','1':2}");
        TOOBJECT("{hello:world,foo:bar,1:2}");
        TOOBJECT("hello:world,foo:bar,1:2");
        /*
        result(3 case equal) => {"hello":"world","foo":"bar","1",2}
        */
        //but top case is 10x more fast (native json parsing)
```

<a name="showcase-type-inspect"/>
### TypeInsepct #

<a name="showcase-type-inspect-is"/>
#### type::is #
```javascript
        
        IS("123","string"); //=> true
        IS("123","number"); //=> false
        IS("123","nothing"); //=> false
        IS("123","meaning"); //=> true
        IS("0","meaning"); //=> true
        IS(0,"meaning"); //=> false
        IS("123","string>5"); //=> false
        IS("123456","string>5"); //=> true
        IS(123456,"text>5"); //=> true
        IS(123456,"number<100"); //=> false
        IS({},"object"); //=> true
        IS([],"array"); //=> true
        //multi test
        IS([],"nothing array"); //=> true
        IS({},"nothing object"); //=> true
        IS(12,"nothing number"); //=> false
        IS(0,"nothing number"); //=> true
        IS(0,"nothing text"); //=> true
        IS(0,"nothing string"); //=> false
```

<a name="showcase-type-inspect-as"/>
#### type::as #
as 는 스트링 값만을 위한 api이다
```javascript
        AS("123     ","string>4"); //=> false
        AS("        ","string==1"); //=> false
		AS("        ","string==0"); //=> true
```


<a name="showcase-string"/>
### String #

<a name="showcase-string-01"/>
#### byteSize #
바이트사이즈를 출력할수 있다.
```javascript
        _String("McDonald's").getByteSize(); //=> 10
        _String("맥도널드").getByteSize(); //=>8
        _String("マクドナルド").getByteSize(); //=>12
```

<a name="showcase-string-02"/>
#### String model #
class attribute 같은 string의 추가제거에 사용가능하다.
```javascript
        _String("McDonald's").addModel("good").get(); //=>"McDonald's good"
        _String("McDonald's").removeModel("Mc").get(); //=>"McDonald's"
        _String("McDonald's").removeModel("McDonald's").get(); //=>""
```

<a name="showcase-zstring"/>
### ZString #
ZString은 렌덤 택스트 생성을 위해 만들어졌다. 첫번째 파라메터는 메인텍스트 그외 파라메터는 서브텍스트 이다. 
메인 파라메터는 \\(), \\{} 규칙이 존재하고 서브파라메터는 \\! \\? 규칙이 존재한다.

<a name="showcase-zstring-01"/>
#### Basic #
\\() 구문은 곧바로 값을 환산하여 뽑아준다.
```javascript
	//range param
	ZSTRING("Total \\(10~20)%"); //=> "Total 17%"
	ZSTRING("Total \\(10~20)%"); //=> "Total 12%"
	ZSTRING("Total \\(10~20)%"); //=> "Total 15%"
	//choice param
	ZSTRING("\\(Boy,Girl) say \\(hello,bye,hi)"); //=> "Boy say hello"
	ZSTRING("\\(Boy,Girl) say \\(hello,bye,hi)"); //=> "Girl say hi"
	ZSTRING("\\(Boy,Girl) say \\(hello,bye,hi)"); //=> "Boy say bye"
```

<a name="showcase-zstring-02"/>
#### With Param #
\\{} 구문은 내부에서 연산후 값을 뽑는다
```javascript
	//range string
	ZSTRING("Result : \\{$0+$1}","2","3"); //=> "Result : 5"
	ZSTRING("Result : \\{$0-$1}","2","3"); //=> "Result : -1"
	ZSTRING("Result : \\{$0*$1}","2","3"); //=> "Result : 6"
	ZSTRING("Result : \\{$0/$1}","2","3"); //=> "Result : 0.6666666666666666"
	ZSTRING("Result : \\{$0+' '+$1}","not","enough"); //=> "Result : not enough"
```

<a name="showcase-zstring-03"/>
#### Random Param #
파라메터 또한 랜덤값을 주어줄수 있다.
```javascript
	//range string
	ZSTRING("\\(10~20) - \\{$0}","\\?20~30"); //=> "16 - 21"
	ZSTRING("\\(10~20) - \\{$0}","\\?20~30"); //=> "17 - 23"
	ZSTRING("\\(10~20) - \\{$0}","\\?20~30"); //=> "12 - 28"
```

<a name="showcase-zstring-03"/>
#### To many array #
ZSTRING을 실제로 _ZString모듈을 호출하여 값을 반환한다. 직접적으로 _ZString모듈을 호출하여 많은 값의 생성 가능하다.
```javascript
	//range string
	_ZString("Result[\\{$i+1}] : \\{10*$i+$0}","\\?1~9").toArray(5);
	//=> ["Result[1] : 7", "Result[2] : 15", "Result[3] : 29", "Result[4] : 38", "Result[5] : 44"]
```
### ZNumber #
```javascript
	ZNUMBER("20~30"); //=> 21
	ZNUMBER("20~30"); //=> 28
	ZNUMBER("$0 + $1","\\?10~20","10"); //=> 22
	ZNUMBER("$0 + $1","\\?10~20","10"); //=> 30
	
```
<a name="showcase-number"/>
### 숫자 #
Nody는 글자사이의 숫자를 인식한다. 내부적으로 숫자를 글자로 취급한다.
```javascript
        _Number(3000).getNumber(); //=> "3000"
        _Number(3000).getDecimal(); //=> "3,000"
        _Number("halfby $3000 dance").number(); //=> 3000
        _Number("halfby $3000 dance").getNumber(); //=> "3000"
        _Number("halfby $3000 dance").getDecimal(); //=> "3,000"
        _Number("halfby $3000 dance").getPrefix(); //=> "halfby $"
        _Number("halfby $3000 dance").getSuffix(); //=> " dance"
        _Number("hello world").number(); // => 0
        
```

<a name="showcase-module"/>
### Module (Like Class) #
Nody의 모듈은 Nody의 코어 라이브러리이다. 객체지향 개발을 흉내내기 위한 api이다.

<a name="showcase-module-new"/>
#### new 호출 #
```javascript
    makeModule("Cat",{},function(name){ console.log(name+" : 'Meow'"); });
    
    // General way
    var pinkCat = new Cat("PinkCat"); // console.log => PinkCat : 'Meow'
    
    // Lazy way
    var blueCat = _Cat("blueCat");    // console.log => BlueCat : 'Meow'
```

<a name="showcase-module-super"/>
#### super 호출 #

```javascript
        makeModule("Dog",{
            bark:function(){
                return "bark";
            }
        },function(type){
            console.log(type+"Dog are born");
        });
        
        extendModule("ShockDog",{
            bark:function(){
                return this._super()+"!!";
            }
        },function(){
            this._super("Shock");
        });
        
        var shockDog = new ShockDog(); // console.log => "ShockDog are born"
        shockDog.bark(); // => "bark!!"
```

<a name="showcase-module-veriable"/>
#### default instance veriable 호출 #

```javascript
        makeModule("Dog",{
            "+name":"Dog name"
        },function(){});
		
		var dog = new Dog();
		dog.name; // => "Dog name"
```


<a name="showcase-module-inheritance"/>
#### Inheritance #
        
```javascript
        extendModule("Zombie","ZombieDog",{
          bark:function(){
            this.energy = this.energy - 2;
          }
        },function(energyPoint){
          this._super(energyPoint - 5);
        });
        
        var zombieDog = new ZombieDog(10);
        zombieDog.walk();
        zombieDog.bark();
        zombieDog.getEnergy(); // => 2
```
<a name="version-info"/>
## Version info #

#### 0.11 정보
- 사용법 단순화를 위한 API디자인과, IE9 호환성 작업 및 성능최적화 작업이 주로 이루어질 예정입니다.
<!-- Firefox bug fix