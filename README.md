Nody.js
=======

# introduce #
nody.js DHTML javascript lib

# 한국어 소개 #
Nody.js는 DHTML 페이지를 만들기위한 라이브러리이다.
인터페이스를 완성하고 있으며 1.0이 될때까지 수시로 api가 변경될 예정이다.

## 특징 #
1. 객체지향 개발을 흉내낼수 있다.
2. 직관적인 Node 생성이 가능하다.
3. 각종 enumeration이 존재한다.

## 알아둘점 #
현재 버전은 코드의 실행시간은 여타 성숙한 자바스크립트 라이브러리에 비해 느립니다.

## 간단예제 #
본 라이브러리의 기본적인 컨샙을 이해하기 위한 예제이다.

### 모듈생성 #
Nody의 모듈은 클래스와 비슷한 개념이다.

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


### 상속 #
        
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
        
### 태그생성 #

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
테이블 생성예제 ()

```javascript
        _TABLE(""
            _A("::link1"),
            _A("::link2"),
            _A("::link3")
        );
```
```html
        <table>
            <tbody>
                <tr><a>link1</a></tr>
                <tr><a>link2</a></tr>
                <tr><a>link3</a></tr>
            </tbody>
        </table>
```


### 셀렉트 #

#### 선택방법 1 #
```javascript
        FIND("div.target");
        //result=> [div.target,div.target...]
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

