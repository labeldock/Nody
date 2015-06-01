(function(){	
	
	nody.MODULE("MixedMoment",{
		getCommand:function(name){
			var args = CLONEARRAY(arguments);
			args.shift();
			return this.Source[name].apply(this.Source,args);
		},
		setCommand:function(name){
			var args = CLONEARRAY(arguments);
			args.shift();
			this.Source[name].apply(this.Source,args);
			return this;
		},
		format:function(){ return this.Source.format.apply(this.Source,CLONEARRAY(arguments)); },
		clone:function(){ var c = new MixedMoment(this.Source); c.CalendarStartDay = this.CalendarStartDay; return c},
		//
		"var!calendarToggle":function(year,month,date){
			console.log("toogle",year,month,date);
		},
		setDrawStartDay:function(dayValue){
			if(typeof dayValue == "number") this.CalendarStartDay = dayValue;
			return this;
		},
		drawCalendarHeaderRow:function(filter){
			var momentlang = this.Source.clone();
			var startDay   = this.CalendarStartDay;
			return MAKE("tr",TIMESMAP(7,function(i){ 
				var t = TURNINDEX(i+startDay,7);
				return (typeof filter == "function") ? filter(MAKE("td",{html:momentlang.day(t).format("dddd")})) : MAKE("td",{html:momentlang.day(t).format("dddd")});
			}));
		},
		drawCalendarBodyRows:function(){
			var owner          = this;
			var firstMoment    = this.Source.clone().date(1);
			var year           = firstMoment.year();
			var month          = firstMoment.month()+1;
			var lastMoment     = firstMoment.clone().add(1,'months').date(0);
			var startDay       = TURNINDEX(firstMoment.day()-this.CalendarStartDay,7);
			var beforeDate     = firstMoment.clone().date(0).date() - startDay;
			var calendarBodies = ARRAYARRAY(6);
			
			;
			// before month
			
			for(var i=0,l=startDay;i<l;i++) calendarBodies[0].push(CREATE("td.before",beforeDate+i+1));
			
			//
			var count = lastMoment.date()+startDay;
			
			// current month
			for(var i=startDay,l=count;i<l;i++){
				var date    = i-startDay+1;
				var makedTd = CREATE("td",{html:date,dataset:{"year":year,"month":month,"date":date}});
				calendarBodies[ Math.floor(i/7) ].push(makedTd);
			} 
		
			// after month
			for(var i=count,l=42,ai=1;i<l;i++){
				calendarBodies[ Math.floor(i/7) ].push( CREATE("td.after",ai) );
				ai++;
			}
			
			return DATAMAP(calendarBodies,function(tds){
				return MAKE("tr",tds);
			});
		}
	},function(input, format, locale, strict){
		//require mement
		if(!moment) console.error('moment가 반드시 로드되어야 합니다.');
		
		//current module
		this.CalendarStartDay=0;
		
		if( (arguments.length == 1) && (typeof input == "string") && (input.length == 2) ){
			this.Source = moment(undefined,undefined,input);
		} else if( ((typeof input == "string") && (typeof format == "string")) && (format.length == 2) ){
			this.Source = moment(input,undefined,format);
		} else {
			this.Source = moment.apply(undefined,CLONEARRAY(arguments));
		}
	});
	
	var root  = nody.url.scriptRoot();
	nody.include(root + "moment-with-locales.js");
	
	//스와이퍼 컨트롤러
	//require jQuery, iDangerous Swiper
	nody.MODULE('MixedSwiper',{
		swipeNext:function(){
			this.SourceSwiper.swipeNext();
		},
		swipePrev:function(){
			this.SourceSwiper.swipePrev();
		},
		swipeTo:function(to){
			this.SourceSwiper.swipeTo(to);
		},
		whenSlideChangeStart:function(m){
			if(typeof m === 'function') this.SourceSwiper.onSlideChangeStart = m;
		},
		whenSlideChangeEnd:function(m){
			if(typeof m === 'function') this.SourceSwiper.onSlideChangeEnd = m;
		},
		whenSlideClick:function(f){
			var _ = this;
			if(typeof f === 'function') $(this.SourceWrapper).on('click','.swiper-slide',function(){
				if(!_.swiperControllerStillChanging) CALL(f,this.currentTarget);
			});
		},
		slideHandler:function(left,right){
			var _ = this;
			$(left).on('click',function(){
				_.swipePrev();
			});
			$(right).on('click',function(){
				_.swipeNext();
			});
		},
		getActiveIndex:function(){
			return this.SourceSwiper.activeIndex;
		},
		getSlideItems:function(order){
			return CLONEARRAY(this.SourceViews);
		},
		getSlides:function(){
			return CLONEARRAY(this.SourceSwiper.slides);
		},
		needDisplay:function(additionOption){
			this.SourceSwiper = new Swiper(this.SourceContainer[0],MARGE(this.Source,additionOption));
			lastSW = this.SourceSwiper;
			var _ = this.SourceSwiper;
			$(window).resize(function(){
				_.resizeFix();
			});
		}
	},function(swiperContainer,swiperViews,paginationContainer,needDisplay){
		// 컨테이너를 swipe-container로
		// 안의 wrapper와 slide는 Controller가 알아서 만들어줍니다.
		this.SourceContainer   = $(swiperContainer).eq(0);
		this.SourceContainerID = '#' + ELUNIQUEID(this.SourceContainer);
		this.SourceWrapper     = MAKE('div.swiper-wrapper');
		this.SourceContainer.addClass('swiper-container');
		this.SourceContainer.append(this.SourceWrapper);
		this.SourceViews = swiperViews;
		//스와이프중 클릭이벤트를 방지하기 위한 속성입니다.
		this.swiperControllerStillChanging = false;
	
		//스와이퍼 랩퍼를 스와이퍼 컨테이너에 붙여넣습니다.
		$(this.SourceWrapper).append(DATAMAP(this.SourceViews,function(node){
			return MAKE('div.swiper-slide',node);
		}));
	
		var _ = this;
		//스와이퍼 파라메터 값입니다.
		this.Source = {
			mode:'horizontal',
			slidesPerView:1,
			watchActiveIndex: true,
			centeredSlides: true,
			resizeReInit: true,
			keyboardControl: false,
			grabCursor: true,
			onSlideChangeStart:function(){
				_.swiperControllerStillChanging = true;
			},
			onSlideChangeEnd:function(){
				setTimeout(function(){
					_.swiperControllerStillChanging = false;
				},5);
			}
		};
	
		if(paginationContainer){
			var pagenationContainerID = '#'+ELUNIQUEID(paginationContainer);
			if(pagenationContainerID) {
				this.Source.pagination = pagenationContainerID;
				this.Source.paginationClickable = true;
			}
		};
	
		if(CALLBACK(needDisplay,this) === true) this.needDisplay();
	});

	//require jQuery, Bootstrap Modal
	nody.EXTEND_MODULE('NFTemplate','MixedBSModal',{
		setModalOpener:function(openButton){
			var _ = this;
			$(openButton).on('click',function(){
				_.show();
			});
		},
		show:function(data){
			if(CALL(this._whenModalWillShow,this) !== false) {
				$(this).modal('show');
				if(data) this.setNodeData(data);
			}			
			return this;
		},
		hide:function(){
			if(CALL(this._whenModalWillHide,this) !== false) $(this).modal('hide');
			return this;
		},
		submit:function(){
			if(APPLY(this._whenModalSubmit,this,Array.prototype.slice.call(arguments)) !== false) $(this).modal('hide');
		},
		//Ready이벤트는 한번만 호출되며 노드가 이벤트를 받을 준비가 되었을때 호출됩니다.
		whenModalReady:function(m){
			this._whenModalReady = m;
		},
		whenModalSubmit:function(m){
			this._whenModalSubmit = m;
			return this;
		},
		whenModalCancle:function(m){
			this._whenModalCancel = m;
			return this;
		},
		whenModalWillHide:function(m){
			this._whenModalWillHide = m;
			return this;
		},
		whenModalDidHide:function(m){
			this._whenModalDidHide = m;
			return this;
		},
		whenModalWillShow:function(m){
			this._whenModalWillShow = m;
			return this;
		},
		whenModalDidShow:function(m){
			this._whenModalDidShow = m;
			return this;
		},
		on:function(event,target,method){
			$(this).on(event,target,method);
			return this;
		}
	},function(modalTemplate,modalOpenToggler,modalData){
		
		this._super(modalTemplate,modalData,true);
		this._readyCall = false;
		var _ = this;
		
		if(modalOpenToggler) $(modalOpenToggler).on('click',function(){ _.show(); });
	
	
		//모달을 가운데 정렬하기 위한 값들입니다.
		this.modalCenterHandler = function(){
			//참조
			//http://www.minimit.com/articles/solutions-tutorials/vertical-center-bootstrap-3-modals
			var $clone = $(this).clone().css('display', 'block').appendTo('body');
			var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
			top = top > 0 ? top : 0;
			$clone.remove();
			$(this).find('.modal-content').css("margin-top", top);
		};
		var centerHandleOwner = this;
		var centerHandlerDelegate = function(){ _.modalCenterHandler.call(centerHandleOwner); };
		
		
		$(this)
		.on('click','.modal-cancle,.modal-close',function(e){
			e.preventDefault();
			if( CALL(_._whenModalWillHide,_,e) !== false ) _.hide();
		})
		.on('click','.modal-submit',function(e){
			e.preventDefault();
			if( CALL(_._whenModalSubmit,_,e,$(this).data('submit')) !== false ) if( CALL(_._whenModalWillHide,_,e) !== false ) _.hide();
		})
		.on('show.bs.modal',function(e){
			//모달을 가운데 정렬하기 위해 사용되는 변수입니다.
			var __ = this; centerHandleOwner =  this;
			
			var t = setTimeout(function(){
				if(!_._readyCall) {
					CALL(_._whenModalReady,_,e,_);
					_._readyCall = true;
				}
				CALL(_._whenModalDidShow,_,e,_);
				
				//모달은 가운데로
				setTimeout(function(){
					_.modalCenterHandler.call(__);
				},10);
				clearTimeout(t);
			},160);
			
			$(window).on('resize',centerHandlerDelegate);
		})
		.on('hidden.bs.modal',function(e){
			CALL(_._whenModalDidHide,_,e);
			$(window).off('resize',centerHandlerDelegate);
		});
	});
		
})();
