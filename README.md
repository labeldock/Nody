Nody.js
=======

# help me #
```
	This is not a complete sentence in English. Please help me to write English
```


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
      - [Type::Is](#showcase-type-inspect-is)
      - [Type::As](#showcase-type-inspect-as)
    - [String](#showcase-string)
      - [ByteSize](#showcase-string-01) 
      - [String Model](#showcase-string-02) 
    - [Number](#showcase-number)
    - [Module](#showcase-module)
      - [Module::new](#showcase-module-new)
      - [Module::super](#showcase-module-super)
      - [Module::Inheritance](#showcase-module-inheritance)
	  - [Module::Default Veriable](#showcase-module-veriable)
  - [Version](#version-info)

<a name="introduce"/>
# introduce #

Nody.js is inline style DHTML javascript library.
Now 'nody' is developement version.
api change from time to time be until version 1.0.
Api stated in document was completed.


Nody.js는 DHTML 페이지를 만들기위한 라이브러리이다.
개발버전이며 인터페이스를 완성하고 있으며 1.0이 될때까지 내부적으로 수시로 api가 변경될 예정이다.
해당 도큐먼트에 노출된 API는 완성체이며 api변경은 없을 예정이다.

### Attention #
Nody는 jQuery와 같이 노드를 핸들링 하기 위한 라이브러리가 아니다. 
본 라이브러리는 데이터의 관점에서 노드를 핸들링하기 편하도록 하기위해 만들어지고 있다.

### Compatibility #
#### Recommend #
IE10+, chrome4+, firefoe 16+, safari4+, opera 15+

#### Minimum #
  - Core Module : IE8+ 
  - Node Module : IE9+

<a name="feature"/>
## Featrue #
### English #
1. Node create intuitive
2. Line development-oriented
3. Interface implementations exist
4. Can imitate object-oriented development.
 

### Korean #
1. 직관적인 Node 생성이 가능하다.
2. 인라인 코딩을 지향한다.
3. 각종 인터페이스 구현체가 존재한다.
4. 코어만 따로 띄어내어 객체지향 개발을 흉내낼수도 있다.





<a name="orientation"/>
## Orientation #
본 라이브러리는 로직의 통일성과 손쉬운 구현을 중요시여겨 객체지향 모델을 따라 만들어졌다.
따라서 코드의 실행시간은 여타 성숙한 자바스크립트 라이브러리에 비해 느릴수 있으나 최적화 작업은 계속 진행되고 있다.



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

<a name="showcase-tag-generator-02"/>
#### Case 2 #        
_[tagName] 방식으로 가능

```javascript
        MAKE_LI("::helloWorld");
```
```html
        <li>helloWorld</li>
``` 

<a name="showcase-tag-generator-03"/>
#### Case 3 #
파라메터를 중첩하여 생성가능

```javascript
        MAKE_UL(
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
#### Case 4 #
테이블 생성예제

```javascript
        MAKE_TABLE("#my-table",
            MAKE_A("::link1"),
            MAKE_A("::link2"),
            MAKE_A("::link3")
        );
```
```html
        <table id="my-table">
            <tbody>
                <tr><td><a>link1</a></td></tr>
                <tr><td><a>link2</a></td></tr>
                <tr><td><a>link3</a></td></tr>
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
#### each #
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
        
        _Type("123").is("string"); //=> true
        _Type("123").is("number"); //=> false
        _Type("123").is("nothing"); //=> false
        _Type("123").is("meaning"); //=> true
        _Type("0").is("meaning"); //=> true
        _Type(0).is("nothing"); //=> true
        _Type("123").is("string>5"); //=> false
        _Type("123456").is("string>5"); //=> true
        _Type(123456).is("text>5"); //=> true
        _Type(123456).is("number<100"); //=> false
        _Type({}).is("object"); //=> true
        _Type([]).is("array"); //=> true
        //multi
        _Type([]).is("nothing array"); //=> true
        _Type({}).is("nothing object"); //=> true
        _Type(12).is("nothing number"); //=> false
        _Type(0).is("nothing number"); //=> true
        _Type(0).is("nothing text"); //=> true
        _Type(0).is("nothing string"); //=> false
```

<a name="showcase-type-inspect-as"/>
#### type::as #
as 는 스트링 값만을 위한 api이다
```javascript
        _Type("123     ").as("string>4"); //=> false
        _Type("        ").as("nothing"); //=> true
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
#### string model #
class attribute 같은 string의 추가제거에 사용가능하다.
```javascript
        _String("McDonald's").addModel("good").get(); //=>"McDonald's good"
        _String("McDonald's").removeModel("Mc").get(); //=>"McDonald's"
        _String("McDonald's").removeModel("McDonald's").get(); //=>""
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
0.5에서 새로 추가되었습니다. 아직 테스트가 완료되지 않았습니다.
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
#### 5.0 변동사항 #
  - 모듈 생성시 초기화 값 지정이 생겼습니다. 이름을 "var!..."으로 지으면 됩니다. (배타)
  - _EL 이 MAKE로 바뀌었습니다.
  - _DIV 와 같은 표현을 MAKE_DIV로 바꾸었습니다.
  - DHTML과 관련없는 API가 줄었습니다
