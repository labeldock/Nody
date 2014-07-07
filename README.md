Nody.js
=======

# introduce #
nody.js DHTML javascript lib
(developement version)

# 한국어 소개 #
Nody.js는 DHTML 페이지를 만들기위한 라이브러리이다.
개발버전이며 인터페이스를 완성하고 있으며 1.0이 될때까지 수시로 api가 변경될 예정이다.

## 특징 #
1. 직관적인 Node 생성이 가능하다.
2. 각종 enumeration이 존재한다.
3. 객체지향 개발을 흉내낼수 있다.

## 알아둘점 #
현재 버전은 코드의 실행시간은 여타 성숙한 자바스크립트 라이브러리에 비해 느립니다.

## 간단예제 #
본 라이브러리의 기본적인 컨샙을 이해하기 위한 예제이다.

### 태그생성 #
_EL, 또는 _[태그이름] 을 사용하여 태그생성이 가능하다.
```
아래 html결과물은 실질적으로 개행이 되지 않으나 이해를 돕기위해 개행과 들여쓰기를 집어넣었다.
```

#### 생성방법 1 #
css 스타일로 구현 가능

```javascript
        _EL("div#hello.world[my=code]"); 
```
```html
        <div id="hello" class="world" my="code"></div>
```

#### 생성방법 2 #        
_[tagName] 방식으로 가능

```javascript
        _LI("::helloWorld");
```
```html
        <li>helloWorld</li>
``` 

#### 생성방법 3 #
파라메터를 중첩하여 생성가능

```javascript
        _UL(
          _LI(".item::list1"),
          _LI(".item::list2")
        );
```
```html
        <ul>
           <li class="item">list1</li>
           <li class="item">list2</li>
        </ul>
``` 

#### 생성방법 4 #
테이블 생성예제

```javascript
        _TABLE("#my-table",
            _A("::link1"),
            _A("::link2"),
            _A("::link3")
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


### 셀렉트 #

#### 선택방법 1 #
```javascript
        FIND("div.target");
        //result=> [div.target,div.target...]  <= native array
        //
```

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

### 배열처리 #

#### each #
```javascript
       _Array([1,2,3]).each(function(value,index){
           console.log(value,index)
       });
       //log => 1,0
       //log => 2,1
       //log => 3,2
```

#### map #
```javascript
        _Array([1,3,5]).map(function(v){
            return v+1;
        });
        // => [2,4,6]
```

#### inject #
```javascript
        _Array([2,4,6]).inject({},function(injectObject,value,index){
            injectObject[index] = value;
        });
        //=>{0:2,1:4,2:6}
```

#### eachback #
```javascript
       _Array([1,2,3]).eachback(function(value,index){
           console.log(value,index)
       });
       //log => 3,2
       //log => 2,1
       //log => 1,0
```

#### object each #
_Array와 마찬가지로 _Object도 동일하게 동작하도록 하는게 원칙입니다.
```javascript
        var sample = [];
        _Object({1:2,2:3,4:5}).each(function(value,key){
            sample.push(key+value);
        });
        console.log(sample);
        //=>["12", "23", "45"]
```

### 파싱 #
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

### TypeInsepct #

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

#### type::as #
as 는 스트링 값만을 위한 api이다
```javascript
        _Type("123     ").as("string>4"); //=> false
        _Type("        ").as("nothing"); //=> true
```

### 글자 #

#### byteSize #
바이트사이즈를 출력할수 있다.
```javascript
        _String("McDonald's").getByteSize(); //=> 10
        _String("맥도널드").getByteSize(); //=>8
        _String("マクドナルド").getByteSize(); //=>12
```
#### string model #
class attribute 같은 string의 추가제거에 사용가능하다.
```javascript
        _String("McDonald's").addModel("good").get(); //=>"McDonald's good"
        _String("McDonald's").removeModel("Mc").get(); //=>"McDonald's"
        _String("McDonald's").removeModel("McDonald's").get(); //=>""
```

### 숫자 #
Nody는 글자사이의 숫자를 인식한다. 내부적으로 숫자로
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


### 모듈(Like Class) #
Nody의 모듈은 클래스와 비슷한 개념이다.

#### 모듈생성 #

```javascript
        makeModule("Zombie",{
          run:function(){
            this.energy = this.energy - 5;
          },
          walk:function(){
            this.energy--;
          },
          getEnergy:function(){
            return this.energy;
          }
        },function(energyPoint){
          this.energy = energyPoint;
        });
        
        var zombie = new Zombie(10);
        zombie.run();
        zombie.getEnergy(); // => 5
        zombie.walk();
        zombie.getEnergy(); // => 4
```



#### 상속 #
        
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
        


