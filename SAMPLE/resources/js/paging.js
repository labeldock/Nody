// auther : labeldock (http://github.com/labeldock)

var PagenationController = function(pagenationContainer,pagelistContainer,initData,listLength,pageLength){

	//한개의 컨테이너만 허용
	this.pagenationContainer = $(pagenationContainer).eq(0);
	this.pagelistContainer   = $(pagelistContainer).eq(0);

	// 한페이지에 보여줄 페이지 갯수
	this.pageDisplayLength = pageLength || 5;
	// 한페이지에 보여줄 리스트 갯수
	this.listDisplayLenght = listLength || 15;
	// 현재 (장)페이지 index
	this.currentPageCount  = 0;
	// 현재 리스팅된 페이지의 index
	this.currentSelectPageItemIndex = 0;

	// data넣기
	this.setContents = function(arrayData){
		if (typeof arrayData == "object") {
			this.contents = arrayData;
		} else {
			this.contents = [];
		}
	};
	this.setContents(initData);

	//페이지를 그리는 방법
	this.drawInPageItem = function(index){
		//내부적인 카운팅은 0부터 시작하기에 index+1을 해줌
		return $("<a/>",{href:"javascript:;"}).text(index+1);
	};

	//리스트를 그리는 방법
	this.drawInListItem = function(data){
		return $("<tr/>").text(data);
	};
	// 리스트가 비었을때 그리는 방법
	this.drawInEmptyListItem = function(){
		return undefined;
	};
	// 페이지가 액티브 되었을때
	this.shouldActivePageItem = function(node){
		return $(node).addClass("selected");
	};
	// 페이지가 액티브 되지 않았을때
	this.shouldDeactivePageItem = function(node){
		//return node;
		return $(node).css("opacity","0.4");
	};

	this.getPageMaxIndex = function(){
		// 정수로 딱 떨어지면 -1해야합니다.
		var fixIndex = this.contents.length / this.listDisplayLenght;
		var calIndex = Math.floor(this.contents.length / this.listDisplayLenght);
		if (calIndex == fixIndex) return calIndex - 1;
		return calIndex
	};
	this.getPageMaxCount = function(){
		return Math.floor(this.contents.length / (this.listDisplayLenght * this.pageDisplayLength));
	}
	// 현재값들로 화면을 뿌려줌
	this.needDisplay = function(){

		// 존재가능한 페이지 index입니다. (넘치는 index에 대해 disable 하기위한 값)
		var maxPageIndex = this.getPageMaxIndex();

		// 페이지를 그립니다.
		var pContainer = $(this.pagenationContainer).empty();
		var pageIndex      = this.currentPageCount * this.pageDisplayLength;
		var endPageIndex   = pageIndex + this.pageDisplayLength;
		for(;pageIndex<endPageIndex;pageIndex++){

			var drawNode = this.drawInPageItem(pageIndex);
			pContainer.append( drawNode );

			// 액티브 상태라면
			if (this.currentSelectPageItemIndex == pageIndex){
				this.shouldActivePageItem(drawNode);
			} else {
				// 액티브 상태가 아닌것은 이벤트 부여
				var thisObject = this;
				// 클릭시 페이지 이동 이벤트 부여
				if (pageIndex <= maxPageIndex) {
					$(drawNode).data("index",pageIndex);
					$(drawNode).click(function(){
						thisObject.needDisplayWithIndex( $(this).data("index") );
					});
				} else {
					this.shouldDeactivePageItem( drawNode );
				}
			}
		}

		// 리스트를 그립니다.
		var lContainer   = $(this.pagelistContainer).empty();
		var listIndex    = this.currentSelectPageItemIndex * this.listDisplayLenght;
		var endListIndex = listIndex + this.listDisplayLenght;

		for(;listIndex<endListIndex;listIndex++){

			//데이타를 그려 넣는다
			var drawContent = this.contents[listIndex];
			if (drawContent) {
				//유효데이터
				var drawNode    = this.drawInListItem( drawContent );
				$(drawNode).data("model",drawContent);
				lContainer.append( drawNode );
			} else {
				//빈데이터
				var drawEmptyNode = this.drawInEmptyListItem();
				// 반환값이 존재하면
				if ($(drawEmptyNode).length > 0) {
					lContainer.append( drawEmptyNode );
				}
			}

		}
	}

	// 액티브 값과 함께
	this.needDisplayWithIndex = function(index){
		//파라메터 검사
		if (typeof index != "number") return console.warn("needDisplayWithIndex의 파라메터는 반드시 Number 여야 합니다!");
		// 현재 인덱스
		this.currentPageCount = Math.floor(index/this.pageDisplayLength);
		this.currentSelectPageItemIndex = index;
		// 화면 그리기
		this.needDisplay();

	};
	//페이지 번호가 1씩 추가
	this.needNextPageIndex = function(){
		this.currentPageCount
		var needTo = this.currentSelectPageItemIndex + 1;
		if (needTo <= this.getPageMaxIndex()) this.needDisplayWithIndex(needTo);
	}
	//페이지 번호가 1씩 감소
	this.needPrevPageIndex = function(){
		var needTo = this.currentSelectPageItemIndex - 1;
		if (needTo >= 0) this.needDisplayWithIndex(needTo);
	}
	//페이지 한장씩 올라감
	this.needNextPageCount = function(){
		var needTo = this.currentPageCount + 1;
		if (needTo > this.getPageMaxCount()) return this.needDisplayWithIndex(this.getPageMaxIndex());
		if (needTo <= this.getPageMaxCount()) this.needDisplayWithIndex(needTo * this.pageDisplayLength);
	}
	//페이지 한장씩 내려감
	this.needPrevPageCount = function(){
		var needTo = this.currentPageCount - 1;
		if (needTo < 0) {
			if(this.currentSelectPageItemIndex > 0) return this.needDisplayWithIndex(0);
		} else {
			this.needDisplayWithIndex(needTo * this.pageDisplayLength);
		}
	}
	//가장 처음 페이지를 선택함
	this.needFirstPageCount = function(){
		if (this.currentSelectPageItemIndex != 0) this.needDisplayWithIndex(0);
	}
	//가장 마지막 페이지를 선택함
	this.needLastPageCount = function(){
		// maxIndex / currentPageCount
		if (this.currentPageCount != this.getPageMaxIndex()) this.needDisplayWithIndex(this.getPageMaxIndex());
	}
	this.listEvent = function(target,event,method){
		$(this.pagelistContainer).on(event,target,function(e){
			this.__changeOwner__ = method;
			this.__changeOwner__( $(this).data("model") );
			delete this["__changeOwner__"];
		});
	}
};

