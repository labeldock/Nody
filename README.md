Nody.js
=======
# introduce #
Nody.js는 데이터 관점에서 Node를 쉽게 구성하기 위한 라이브러리이다.

## Feature #
  1. Easy make node
  2. Easy find node
  3. Easy bind node

# Sample #
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

### 0.20.10 정보
- nody-[...] 문이 nf-[...] 문으로 변경됩니다.

### 0.20.9 까지
- 노드의 작업성능 향상 (NFTemplate가 8배 정도 빨라짐)
- ZDATE 추가 (날짜를 빠르게 인식하기 위한 함수)
- 함수를 배열로 인식하는 버그 수정
- NFArray에 timesmap 추가
- FLAGRANDOM추가 (true,false를 확률적으로 도출할 수 있음)
- ELSTYLE 버그 픽스
- NFTemplate :: setNodeValue => setNodeData
- NFTemplate nf-src 문이 제거되며 nf-value로 사용가능
- 이제부터 ELVALUE에서 img, script등의 value는 src로 link는 rel로 접근합니다.
- NFTabContents 모듈 추가
- 추후 모든 Contents로더 모듈들은 NFFormController를 지원하도록 변경될 예정입니다.
- FINDON,FINDPARENT 컨티뉴틸리티 규칙 변경
- FINDOFFSET 추가
- ELTRACE 클래스 인식 에러 수정
- NFFormController isStatus 추가
- NFActiveControllerManager 기능 대폭 향상 (아직 완전하지 않은 기능)
- NFPresentor의 needActiveController를 노드 기준으로 가능하도록 지원
- NFPresentor에서 렌더 결과에 데이터컨텍스트 정보 삽입
- NFScrollBox에서 절대값 스크롤링 지원 추가
- 모든 기본 모듈은 'NF' Prefix가 붙도록 디자인이 바뀌었습니다.
- ZFIND가 제거되었습니다. FIND('.some',0); 의 식으로 사용합니다.
- NFForm, NFFormController의 데이터 I/O API가 setFormData, getFormData로 변경되었습니다.
- NFNumber 업데이트
- ELVALUE에서 img값은 src속성을 참조하게 됩니다.
- NFArray에서 getSortFirst getSortLast 추가
- Base64UniqueRandom 키 생성시 기본적으로 고정적인 prefix를 지정할 수 있게 하였습니다.
- FINDIN, FINDPARENT, FINDPARENTS등에서 다양한 파라메터를 대응할 수 있도록 향상
- ELPUT의 심각한 오류 수정
- NFQuery에 putTo 함수 추가
- NFResize 모듈추가 (엘리먼트가 resize될 경우 이벤트가 발생됩니다.)
- NFScrollTrack 모듈추가

## 예정된 계획 #

#### 0.21 예정
- 호환성 및 안정성 검토

#### 0.22 예정
- NFContext2D는 지워질것 입니다. 기본적으로 이 모듈이 탑재된 이유는 canvas와 img가 상호간 리소스를 쉽게 교환하기 위해서였습니다. API가 따로 제작될것입니다.
- 웹 컴포넌트 모듈들은 되도록이면 기본 Nody에서 떨어질 것입니다. (NFScrollBox, NFZoomBox, NFScrollTrack)


#### 0.30 예정
- Rails의 기본 패턴에 최적화된 MVVM + Remote 컨트롤 제작 
- NFArray, NFObject API가 좀 더 정리될 예정입니다.

#### 0.31 예정
- 1.0 배포를 위한 전체적인 호환성 및 퍼포먼스 검토가 이루어질 것입니다.