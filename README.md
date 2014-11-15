Nody.js
=======

# help me #
```
	This is not a complete sentence in English. Please help me to write English
```

# Sample #
<a href="http://nineten11.net/nody/">http://nineten11.net/nody/</a>


# Table of Contents
  - [Introduce](#introduce)
  - [Featrue](#feature)
  - [Orientation](#orientation)
  - [Simple showcase](#simple-showcase)
    - [Tag Generator](#showcase-tag-generator)
      - [Case1](#showcase-tag-generator-01)
      - [Case2](#showcase-tag-generator-02)
      - [Case3](#showcase-tag-generator-03)
      - [Case4](#showcase-tag-generator-04)
    - [셀렉트](#showcase-select)
      - [Case1](#showcase-select-01)
      - [Case2](#showcase-select-02)
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

### Attention #
Nody는 jQuery와 달리 단순 노드를 핸들링 하기 위한 라이브러리가 아니다. 
본 라이브러리는 데이터의 관점에서 노드를 핸들링하기 편하도록 함수나 컨트롤러가 제공된다.

### Compatibility #
#### Recommend #
  - IE10+
  - chrome4+
  - firefoe 16+
  - safari4+
  - opera 15+

#### Minimum #
  - Core Module : IE8+ 
  - Node Module : IE9+

<a name="feature"/>
## Featrue #
1. 직관적인 Node 생성이 가능하다.
2. 인라인 코딩을 지향한다.
3. 뷰를 제어하기 위한 컨트롤러가 제공된다.
4. 코어의 객체지향 모듈을 사용하여 제작되었다.


<a name="orientation"/>
## Orientation #
본 라이브러리는 로직의 통일성과 손쉬운 구현을 중요시여겨 객체지향 모델로 만들어졌다.


<a name="simple-showcase"/>
## Simple showcase #
To understand the basic concepts of this library for example.



<a name="showcase-tag-generator"/>
### Tag Generator #
MAKE, 또는 MAKE_[태그이름] 을 사용하여 태그생성이 가능하다.
```
아래 html결과물은 실질적으로 개행이 되지 않으나 이해를 돕기위해 개행과 들여쓰기를 집어넣었다.
```


<a name="showcase-tag-generator-01"/>
#### Case 1 #
css 스타일로 구현 가능

```javascript
        MAKE("div#hello.world[my=code]:disabled::foo"); 
```
```html
        <div id="hello" class="world" my="code" disabled>foo</div>
```

#### Case 2 #
오브젝트를 값을 사용하여 만들수 있음
```javascript
        MAKE("div",{dataset:{hello:"world",data:"set"},"id":"hello","class":"world"}); 
```
```html
        <div id="hello" class="world" data-hello="world" data-data="set"></div>
```

<a name="showcase-tag-generator-02"/>
#### Case 3 #        
_[tagName] 방식으로 가능

```javascript
        MAKE_LI(".list::helloWorld");
```
```html
        <li class="list">helloWorld</li>
``` 

<a name="showcase-tag-generator-03"/>
#### Case 4 #
파라메터를 중첩하여 생성가능

```javascript
        MAKE("ul",
          MAKE_LI(".item::list1"),
          MAKE_LI(".item::list2")
        );
```
```html
        <ul>
           <li class="item">list1</li>
           <li class="item">list2</li>
        </ul>
``` 

<a name="showcase-tag-generator-04"/>
#### Case 5 #
테이블 생성예제

```javascript
        MAKE_TABLE("#my-table",
            MAKE("a[href=#]::link1"),
            MAKE("a[href=#]::link2"),
            MAKE("a[href=#]::link3")
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
#### 선택방법 1 #
```javascript
        FIND("div.target");
        //result=> [div.target,div.target...]  <= native array
        //
```

<a name="showcase-select-02"/>
#### 선택방법 2 #
```javascript
        FIND("div.target",jQuery);
        //result=> jQuery Object
```
응용
```html
        <div class="target" foo="bar"></div>
        <script>
            FIND("div.target",jQuery).attr("foo");
            //result=> bar
        </script>
```

<a name="showcase-enumerate"/>
### enumerate #

<a name="showcase-enumerate-each"/>
#### Each #
```javascript
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
        _Array([1,3,5]).map(function(v){
            return v+1;
        });
        // => [2,4,6]
```

<a name="showcase-enumerate-inject"/>
#### Inject #
```javascript
        _Array([2,4,6]).inject({},function(injectObject,value,index){
            injectObject[index] = value;
        });
        //=>{0:2,1:4,2:6}
```

<a name="showcase-enumerate-eachback"/>
#### Eachback #
```javascript
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
	_ZString("Total \\(10~20)%").get(); //=> "Total 17%"
	_ZString("Total \\(10~20)%").get(); //=> "Total 12%"
	_ZString("Total \\(10~20)%").get(); //=> "Total 15%"
	//choice param
	_ZString("\\(Boy,Girl) say \\(hello,bye,hi)").get(); //=> "Boy say hello"
	_ZString("\\(Boy,Girl) say \\(hello,bye,hi)").get(); //=> "Girl say hi"
	_ZString("\\(Boy,Girl) say \\(hello,bye,hi)").get(); //=> "Boy say bye"
```

<a name="showcase-zstring-02"/>
#### With Param #
\\{} 구문은 내부에서 연산후 값을 뽑는다
```javascript
	//range string
	_ZString("Result : \\{$0+$1}","2","3").get(); //=> "Result : 5"
	_ZString("Result : \\{$0-$1}","2","3").get(); //=> "Result : -1"
	_ZString("Result : \\{$0*$1}","2","3").get(); //=> "Result : 6"
	_ZString("Result : \\{$0/$1}","2","3").get(); //=> "Result : 0.6666666666666666"
	_ZString("Result : \\{$0+' '+$1}","not","enough").get(); //=> "Result : not enough"
```

<a name="showcase-zstring-03"/>
#### Random Param #
파라메터 또한 랜덤값을 주어줄수 있다.
```javascript
	//range string
	_ZString("\\(10~20) - \\{$0}","\\?20~30").get(); //=> "16 - 21"
	_ZString("\\(10~20) - \\{$0}","\\?20~30").get(); //=> "17 - 23"
	_ZString("\\(10~20) - \\{$0}","\\?20~30").get(); //=> "12 - 28"
```

<a name="showcase-zstring-03"/>
#### To many array #
$i 는 index값이다 toArray(길이)로 지정하여 많은 값이 생성 가능하다.
```javascript
	//range string
	_ZString("Result[\\{$i+1}] : \\{10*$i+$0}","\\?1~9").toArray(5);
	//=> ["Result[1] : 7", "Result[2] : 15", "Result[3] : 29", "Result[4] : 38", "Result[5] : 44"]
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
            "var!name":"Dog name"
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
  
#### 0.7 변동사항 #
 - EL..., Make 함수들을 Nody와 Make모듈로 컨트롤 할수 있습니다.
 - Area, AreaContent 모듈이 제거되었고 ZString 모듈로 대체되었습니다.
 - 성능을 높이기 위한 작업이 되었습니다.

#### 0.6 변동사항 #
  - 모듈인 "Type"이 제거되고 단순 함수 "IS"로 대체되었습니다.
  - DataGrid, DataRender, DataViewController 등의 이전 MVVM모듈이 제거되었습니다.
  - 완전히 새로 작성된 MVVM관련 모듈인 DataContext, ManagedData, ViewModel, DataContextViewController이 추가되었습니다. 이로서 메모리 관리가 최적화 되었고와 렌더링 프로세싱을 최소화 하였습니다.
  - ELDATA가 추가되었습니다. 노드의 DATASET에 접근할수 있습니다.