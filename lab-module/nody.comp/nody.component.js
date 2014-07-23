// important!
// It is lab version

// nody.component

makeModule("PageControl",{
	setPageViewContext:function(context){ this.PageControlContext = FINDZERO(context); },
	drawPageView:function(navigationStart){
		// 네비게이션 전체
		var naviTotal  = Math.ceil(this.PageControlItemLength < 1 ? 1 : this.PageControlItemLength / this.PagePerLength)+1;
		var naviStart  = isNaN(navigationStart) ? (Math.floor((this.PageCurrent-1) / this.PageControlDisplayLength) * this.PageControlDisplayLength + 1) : parseInt(navigationStart);
		var naviEnd    = naviStart + this.PageControlDisplayLength;

		if(naviEnd > naviTotal) naviEnd = naviTotal;
		
		if(this.PageCurrent >= naviEnd) this.PageCurrent = naviEnd - 1;
		
		var pageControl = this;
		
		var items = (naviStart < 2) ? [ _LI(".action.mute::이전") ] : [ ELON(_LI(".action::이전"),"click",function(){ pageControl.drawPageView( naviStart - pageControl.PageControlDisplayLength ); }) ];
		for(var i=naviStart,l=naviStart+this.PageControlDisplayLength;i<l;i++) {
			if(i < naviTotal){
				items.push( ELON( _LI( ("[data-index="+i+"]" + ((i==this.PageCurrent) ? ".active::" + i : "::" + i))), "click", function(){ pageControl.page( ELATTR(this,"data-index") ); }) )
			} else {
				items.push( _LI(".mute::"+i) );
			}
		}
		items.push( (naviEnd == naviTotal) ? _LI(".action.mute::다음") : ELON( _LI(".action::다음"),"click",function(){ pageControl.drawPageView(  naviEnd ) }) );
		ELAPPEND(ELEMPTY(this.PageControlContext),_UL(".pagecontrol",items));
	},
	updatePageView:function(pageCurrent,pagePerLength,itemLength,pageDisplayLength){
		// property set
		if(isNaN(pageCurrent) == true)   return console.error("PageControl::updatePageView 첫번째 파라매터 값이 올바르지 않습니다. => ",pageCurrent);
		if(isNaN(pagePerLength) == true) return console.error("PageControl::updatePageView 두번째 파라매터 값이 올바르지 않습니다. => ",pagePerLength);
		if(isNaN(itemLength) == true)    return console.error("PageControl::updatePageView 세번째 파라매터 값이 올바르지 않습니다. => ",itemLength);
		
		this.PageCurrent              = parseInt(pageCurrent);
		this.PagePerLength            = parseInt(pagePerLength);
		this.PageControlItemLength    = parseInt(itemLength);
		this.PageControlDisplayLength = isNaN(pageDisplayLength) ? 10 : parseInt(pageDisplayLength);
		
		if(ISELNODE(this.PageControlContext)){	
			this.drawPageView();
		} else {
			console.warn("PageControl::updatePageView 페이지를 업데이트 하려하였지만 타겟 context가 존재하지 않습니다.");
		}
	},
	page:function(index){
		var el = FINDZERO("[data-index="+index+"]",this.PageControlContext);
		if( this.PageCurrent !== index && ISELNODE(el) == true ){
			FIND("ul.pagecontrol > li.active",this.PageControlContext,DATAEACH,function(el){ ELATTR(el,"class",""); });
			ELATTR(el,"class","active");
			this.PageCurrent = index;
			CALL(this.EventListener,this,index);
		}
	},
	pageEvent:function(eventListenr){
		if(typeof eventListenr == "function"){
			this.EventListener = eventListenr;
		} else {
			console.warn("PageControl::setEventListener:: 전체 페이지 값이 잘못되었습니다.")
		}
		return this;
	},
	setup:function(currentPage,totalPage,after){
		currentPage = _Number(currentPage).number();
		
		if(isNaN(totalPage) == true){
			if(typeof totalPage !== "undefined") console.warn("PageControl::init:: 전체 페이지 값에 잘못된 값이 들어왔습니다.");
			totalPage = currentPage;
		} else {
			var tp = _Number(totalPage).number();
			if(currentPage > tp){
				console.warn("PageControl::init:: 페이지의 값이 너무 큽니다. => 현재페이지, 전체페이지",currentPage,totalPage);
				totalPage = currentPage;
			} else {
				totalPage = totalPage;
			}
		}
		typeof currentPage
		this.PageControlContext = undefined;
		this.PageCurrent        = currentPage;
		this.PagePerLength      = totalPage;
		if(typeof after == "function"){
			CALL(after,this);
		} else if(typeof currentPage == "function"){
			CALL(currentPage,this);
		}
		return this;
	},
	getPageOfCurrent:function() { return this.PageCurrent; },
	setPagePerLength:function(number)  { this.PagePerLength = isNaN(number) ? 10 : parseInt(number);   },
	getPagePerLength:function()  { return this.PagePerLength;  }
},function(currentPage,totalPage){
	this.setup.apply(this,Array.prototype.slice.apply(arguments));
});
W.PageControl = function(){ return new PageControlType(arguments); };
makeModule("PageViewController",{
	getItemLength       : function(){ return this.Source.length; },
	getCurrentPageIndex : function(){ return this.CurrentPageIndex; },
	getTotalPageIndex   : function(){ return Math.ceil(this.Source.length/this.ItemPerPage); },
	getCurrentPageData  : function(){ return _Array(this.Source).getSubarr( (this.CurrentPageIndex-1) * this.ItemPerPage, this.ItemPerPage).toArray(); },
	changePageIndex     : function(index){
		this.CurrentPageIndex   = index;
		if(this.RemoteSource){
			var own = this;
			this.RemoteSource.call(this,this.CurrentPageIndex,this.ItemPerPage,function(data,totalLength){
				own.Source.length = parseInt(totalLength);
				var gap = (own.CurrentPageIndex-1)*own.ItemPerPage;
				for(var i=0,l=data.length;i<l;i++){
					own.Source[i+gap] = data[i];	
				}
				own.__updateData();
			});
		} else {
			this.__updateData();
		}
	},
	__updateData:function(){
		this.PageControl.updatePageView ( 
			this.CurrentPageIndex,
			this.ItemPerPage,
			this.Source.length,
			this.PageLength
		);
		this.CurrentPageIndex = this.PageControl.PageCurrent;
		this.Table.refresh( this.getCurrentPageData() );
	},
	getData:function(data){
		if(arguments.length == 0) return this.Source;
		var source = _Array(this.Source);
		if( !isNaN(data) ) {
			return this.Source[data];
		} else {
			var index = source.indexOf(data);
			if(index > -1) return this.Source[index];
			return undefined;
		}
	},
	refresh:function(data){
		if(typeof data == "function"){
			this.Source = [];
			this.RemoteSource = data;
		} else {
			this.Source = _Array(data).toArray();
		}
		this.changePageIndex(1);
		return this;
	},
	removeData:function(data,update){
		if( isNaN(data) ){
			this.Source = _Array(this.Source).remove(data).toArray();
			if(update !== false) this.__updateData();
		} else {
			arguments.callee.call(this,this.getData(data),update);
		}
		return this;
	},
	removeDatas:function(){
		var targets = [];
		var own     = this;
		_Array(arguments).flatten().inject(this,function(c,own){ 
			_Array(c).each(function(t){
				var data = own.getData(t);
				if(data) targets.push(data);
			});
		});
		_Array(targets).inject(this,function(c){
			own.removeData(c);
		});
		this.__updateData();
		return this;
	},
	appendData:function(data){
		_Array(data).inject(this.Source,function(data,source){ source.push(data); });
		this.__updateData();
		return this;
	},
	prependData:function(data){
		var setDatas = _Array(data);
		_Array(this.Source).each(function(data){ setDatas.push(data); });
		this.Source = setDatas.toArray();
		this.__updateData();
		return this;
	},
	setItemPerPage:function(val){
		if(!isNaN(val)){ 
			this.ItemPerPage = parseInt(val);
			this.__updateData();
		}
	},
	setPageLength:function(val){
		if(!isNaN(val)){ 
			this.PageLength = parseInt(val);
			this.__updateData();
		}
	},
	find:function(search){
		var result = [];
		_Array( this.Table.getContexts() ).each(function(c){ FIND(search,c,_Array).each(function(node){ result.push(node); }); });
		return _Array(result).unique().toArray();
	},
	findData:function(search){ return _Array(this.find(search)).map(function(e){ return e._data }).filter().unique().toArray(); }
},function(data,pageContext,arrayDataContext,arrayDataRender){
	//default
	this.CurrentPageIndex    = 1;
	this.ItemPerPage         = 10;
	this.PageLength          = 5;
	
	//소스 컨트롤
	//remote source alpha
	if(typeof data == "function"){
		this.Source = [];
		this.RemoteSource = data;
	} else {
		this.Source              = _Array(data).toArray();
		this.RemoteSource        = undefined;
	}
	
	//페이지
	this.PageControl = _PageControl(this.getCurrentPageIndex(),this.getTotalPageIndex());
	this.PageControl.setPagePerLength(this.ItemPerPage);
	this.PageControl.setPageViewContext(pageContext);
	this.PageControl.updatePageView(this.CurrentPageIndex,this.ItemPerPage,this.Source.length,this.PageLength);
	
	//page event
	var own = this;
	this.PageControl.pageEvent(function(){ own.changePageIndex( own.PageControl.getPageOfCurrent() ); });
	
	//뷰컨트롤
	this.Table = _ArrayViewController.apply(undefined,_Array(arguments).subarr(2).insert(this.getCurrentPageData()).toArray());
	
	//ifExsistRemoteData
	if(this.RemoteSource){
		this.changePageIndex(1);
	}
});


// spinJS
// remove target!
(function(t,e){if(typeof exports=="object")module.exports=e();else if(typeof define=="function"&&define.amd)define(e);else t.Spinner=e()})(this,function(){"use strict";var t=["webkit","Moz","ms","O"],e={},i;function o(t,e){var i=document.createElement(t||"div"),o;for(o in e)i[o]=e[o];return i}function n(t){for(var e=1,i=arguments.length;e<i;e++)t.appendChild(arguments[e]);return t}var r=function(){var t=o("style",{type:"text/css"});n(document.getElementsByTagName("head")[0],t);return t.sheet||t.styleSheet}();function s(t,o,n,s){var a=["opacity",o,~~(t*100),n,s].join("-"),f=.01+n/s*100,l=Math.max(1-(1-t)/o*(100-f),t),u=i.substring(0,i.indexOf("Animation")).toLowerCase(),d=u&&"-"+u+"-"||"";if(!e[a]){r.insertRule("@"+d+"keyframes "+a+"{"+"0%{opacity:"+l+"}"+f+"%{opacity:"+t+"}"+(f+.01)+"%{opacity:1}"+(f+o)%100+"%{opacity:"+t+"}"+"100%{opacity:"+l+"}"+"}",r.cssRules.length);e[a]=1}return a}function a(e,i){var o=e.style,n,r;i=i.charAt(0).toUpperCase()+i.slice(1);for(r=0;r<t.length;r++){n=t[r]+i;if(o[n]!==undefined)return n}if(o[i]!==undefined)return i}function f(t,e){for(var i in e)t.style[a(t,i)||i]=e[i];return t}function l(t){for(var e=1;e<arguments.length;e++){var i=arguments[e];for(var o in i)if(t[o]===undefined)t[o]=i[o]}return t}function u(t){var e={x:t.offsetLeft,y:t.offsetTop};while(t=t.offsetParent)e.x+=t.offsetLeft,e.y+=t.offsetTop;return e}function d(t,e){return typeof t=="string"?t:t[e%t.length]}var p={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",direction:1,speed:1,trail:100,opacity:1/4,fps:20,zIndex:2e9,className:"spinner",top:"auto",left:"auto",position:"relative"};function c(t){if(typeof this=="undefined")return new c(t);this.opts=l(t||{},c.defaults,p)}c.defaults={};l(c.prototype,{spin:function(t){this.stop();var e=this,n=e.opts,r=e.el=f(o(0,{className:n.className}),{position:n.position,width:0,zIndex:n.zIndex}),s=n.radius+n.length+n.width,a,l;if(t){t.insertBefore(r,t.firstChild||null);l=u(t);a=u(r);f(r,{left:(n.left=="auto"?l.x-a.x+(t.offsetWidth>>1):parseInt(n.left,10)+s)+"px",top:(n.top=="auto"?l.y-a.y+(t.offsetHeight>>1):parseInt(n.top,10)+s)+"px"})}r.setAttribute("role","progressbar");e.lines(r,e.opts);if(!i){var d=0,p=(n.lines-1)*(1-n.direction)/2,c,h=n.fps,m=h/n.speed,y=(1-n.opacity)/(m*n.trail/100),g=m/n.lines;(function v(){d++;for(var t=0;t<n.lines;t++){c=Math.max(1-(d+(n.lines-t)*g)%m*y,n.opacity);e.opacity(r,t*n.direction+p,c,n)}e.timeout=e.el&&setTimeout(v,~~(1e3/h))})()}return e},stop:function(){var t=this.el;if(t){clearTimeout(this.timeout);if(t.parentNode)t.parentNode.removeChild(t);this.el=undefined}return this},lines:function(t,e){var r=0,a=(e.lines-1)*(1-e.direction)/2,l;function u(t,i){return f(o(),{position:"absolute",width:e.length+e.width+"px",height:e.width+"px",background:t,boxShadow:i,transformOrigin:"left",transform:"rotate("+~~(360/e.lines*r+e.rotate)+"deg) translate("+e.radius+"px"+",0)",borderRadius:(e.corners*e.width>>1)+"px"})}for(;r<e.lines;r++){l=f(o(),{position:"absolute",top:1+~(e.width/2)+"px",transform:e.hwaccel?"translate3d(0,0,0)":"",opacity:e.opacity,animation:i&&s(e.opacity,e.trail,a+r*e.direction,e.lines)+" "+1/e.speed+"s linear infinite"});if(e.shadow)n(l,f(u("#000","0 0 4px "+"#000"),{top:2+"px"}));n(t,n(l,u(d(e.color,r),"0 0 1px rgba(0,0,0,.1)")))}return t},opacity:function(t,e,i){if(e<t.childNodes.length)t.childNodes[e].style.opacity=i}});function h(){function t(t,e){return o("<"+t+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',e)}r.addRule(".spin-vml","behavior:url(#default#VML)");c.prototype.lines=function(e,i){var o=i.length+i.width,r=2*o;function s(){return f(t("group",{coordsize:r+" "+r,coordorigin:-o+" "+-o}),{width:r,height:r})}var a=-(i.width+i.length)*2+"px",l=f(s(),{position:"absolute",top:a,left:a}),u;function p(e,r,a){n(l,n(f(s(),{rotation:360/i.lines*e+"deg",left:~~r}),n(f(t("roundrect",{arcsize:i.corners}),{width:o,height:i.width,left:i.radius,top:-i.width>>1,filter:a}),t("fill",{color:d(i.color,e),opacity:i.opacity}),t("stroke",{opacity:0}))))}if(i.shadow)for(u=1;u<=i.lines;u++)p(u,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(u=1;u<=i.lines;u++)p(u);return n(e,l)};c.prototype.opacity=function(t,e,i,o){var n=t.firstChild;o=o.shadow&&o.lines||0;if(n&&e+o<n.childNodes.length){n=n.childNodes[e+o];n=n&&n.firstChild;n=n&&n.firstChild;if(n)n.opacity=i}}}var m=f(o("group"),{behavior:"url(#default#VML)"});if(!a(m,"transform")&&m.adj)h();else i=a(m,"animation");return c});
makeGetter("INDICATOR",function(context,text,parent){
	var targetContext = FINDZERO(context);
	if(ISELNODE(targetContext) == true){
		//spin
		var indicator = new Spinner({
		  lines: 9, // The number of lines to draw
		  length: 2, // The length of each line
		  width: 4, // The line thickness
		  radius: 8, // The radius of the inner circle
		  corners: 1, // Corner roundness (0..1)
		  rotate: 0, // The rotation offset
		  direction: 1, // 1: clockwise, -1: counterclockwise
		  color: '#000', // #rgb or #rrggbb or array of colors
		  speed: 1, // Rounds per second
		  trail: 60, // Afterglow percentage
		  shadow: false, // Whether to render a shadow
		  hwaccel: false, // Whether to use hardware acceleration
		  className: 'spinner', // The CSS class to assign to the spinner
		  zIndex: 2e9, // The z-index (defaults to 2000000000)
		  top: 'auto', // Top position relative to parent in px
		  left: 'auto' // Left position relative to parent in px
		}).spin(targetContext);

		this.stop = function(){
			indicator.stop();
			ELREMOVE(indicator);
			return true;
		};

		return this;
	} else {
		console.warn("Indicator::인디케이터를 활성할수 없습니다. 컨텍스트 경로가 올바르지 않습니다. =>", context, targetContext);
	}
});

makeModule("Loader",{
	clear:function(){
		if(this.LoaderCurrent) this.LoaderViews[this.LoaderCurrent] = _Array(this.LoaderContext.children).each(function(el){ ELREMOVE(el); }); return this;
	},
	clearSource:function(){
		this.clear();
		this.LoaderCurrent = undefined;
		this.LoaderViews   = {};
		return this;
	},
	executeScriptForCurrentEnum:function(loadArguments,completeBlock){
		var own      = this;
		var loadEnum = this.LoaderCurrent;
		//
		var scripts = _Array(FIND("script",this.LoaderContext));
		scripts.each(function(scriptDom){
			var javascript = scriptDom.innerHTML;
			try {
				eval(javascript);
			} catch(e){
				console.error("스크립트 구문 오류로 스크립트 실행이 정지되었습니다. => ",MAX(javascript,200));
				throw e;
			}
		});
		if(typeof this.LoaderEvent == "object") {
			if(loadEnum in this.LoaderEvent) {
				var currentLoadEvent = this.LoaderEvent[loadEnum];
				switch(typeof currentLoadEvent){
					case "function":
						currentLoadEvent.apply(this.LoaderContext,loadArguments);
						break;
					case "string":
						if(/(\.js|\.js\s)$/.test(currentLoadEvent)){
							var scriptPath = _Client.getAbsolutePath(currentLoadEvent,_Client.scriptUrl());
							new Open(scriptPath,function(javascript){
								try {
									var r = eval("("+javascript+")");
									if(typeof r == "function"){ r.apply(own.LoaderContext,loadArguments); }
								} catch(e1) {
									try {
										eval(javascript);
									} catch(e2) {
										console.error("Loader::executeScriptForCurrentEnum 외부스크립트 오류 스크립트 구문 오류로 스크립트 실행이 정지되었습니다. => ",MAX(javascript,200));
										throw e1;
									}
								}		
							},function(){
								console.error("Loader::executeScriptForCurrentEnum 외부스크립트를 가져오는데 실패하였습니다.. => ",currentLoadEvent," => ",scriptPath);
							});
							
						} else {
							console.error("Loader::executeScriptForCurrentEnum .js로 끝나는 자바스크립트만 가능합니다.");
						}
						break;
					default: break;
				}
			}
		}
		return APPLY(completeBlock,this);
	},
	statusChange:function(loadPath,loadEnum,after) { 
		var result = CALL(this.LoaderBindEvent,this,loadPath,loadEnum,"before",this.LoaderContext);
		if(result !== false) { 
			CALL(after,this,function(){
				CALL(this.LoaderBindEvent,this,loadPath,loadEnum,"after",this.LoaderContext);
			});
		}
		return result;
	},
	link: function (linkText){
		if(this.LoaderCurrent){
			this.Source[this.LoaderCurrent] = linkText;
			this.load.apply(this,_Array(arguments).subarr(1).insert(this.LoaderCurrent).toArray());
		} else {
			console.error("불러진 컨텐츠가 없습니다.");
		}
	},
	load: function (loadEnum){
		if(loadEnum in this.Source){
			var loadArguments = Array.prototype.slice.call(arguments);
			loadArguments.shift();
			this.statusChange(loadEnum,"load",function(completeBlock){
				this.clear();
				this.LoaderCurrent = loadEnum;
				var own = this;
				var loadPath  = this.Source[loadEnum];
				if(typeof loadPath == "function"){
					var result = loadPath(loadEnum);
					if(typeof result == "string"){ loadPath = result; }
				}
				//ELEMENT(s) or URL
				if( typeof loadPath == "string" ){
					//element
					var indicator = INDICATOR(this.LoaderContext);
					_Open(loadPath + (loadPath.indexOf("?") > -1 ? "&token=" : "?token=") +_Client.base64Random(2),{
						"dataType":"dom",
						"success":function(doms){
							indicator.stop();
							_Array(doms).each(function(el){ ELAPPEND(own.LoaderContext,el); });
							own.executeScriptForCurrentEnum(loadArguments,completeBlock);
						},
						"error":function(){
							console.error("Loader::load 페이지를 불러오는데 실패하였습니다. :path => ",loadPath);
							APPLY(completeBlock,own);
						}
					});
				} else {
					var elfind = FIND(loadPath);
					if( elfind.length < 1 ){
						console.error("Loader::load 불러올 엘리먼트가 존재하지 않습니다. => ",loadPath);
					} else {
						_Array(elfind).each(function(el){ ELAPPEND(own.LoaderContext,el); });
						this.executeScriptForCurrentEnum(loadArguments,completeBlock);
					}
				}
			});
		} else {
			console.error("Loader::load::정의되지 않은 Enum을 호출할수 없습니다. => ",loadEnum,this);
		}
		return this;
	},
    open: function (loadEnum) {
		if(this.LoaderCurrent !== loadEnum) if(loadEnum in this.LoaderViews){
			var openArgument = _Array(arguments).subarr(1).toArray();
			this.statusChange(loadEnum,"open",function(completeBlock){
				var own = this;
				this.clear();
				this.LoaderCurrent = loadEnum;
				this.LoaderViews[loadEnum].each( function(el){ ELAPPEND(own.LoaderContext,el); });
				APPLY(completeBlock,own,openArgument);
			});
		} else {
			this.load(loadEnum);
		}
		return this;
    }
},function(context,navs,loadEvent,chageEvent){
	// context    => 컨텐츠를 채울 곳
	// navs       => object: key value로 해당이 호출되면 context에 내용이 체워짐
	// loadEvent  => navs key과 같은 데이터가 불러와질때 호출되는 이벤트
	// chageEvent => 모든 이벤트의 집합
	this.Source          = navs;
	this.LoaderCurrent   = undefined;
	this.LoaderContext   = FINDZERO(context);
	this.LoaderEvent     = TOOBJECT(loadEvent);
	this.LoaderBindEvent = chageEvent;
	this.LoaderViews     = {};
});
makeModule("Color",{
	getColorSource : function(){
		console.log(this.OriginSource);
		switch(this.OriginSource[0]){
			case "HEX" : return this.Utility.HEXToHSV(this.OriginSource[1]); break;
			case "RGB" : return this.Utility.HEXToHSV(this.OriginSource.shift()); break;
			case "RGBA": return this.Utility.HEXToHSV(this.OriginSource.shift()); break;
			case "HSV" : var c = this.OriginSource;  return [c[1],c[2],c[3]] ; break;
			case "HSVA": var c = this.OriginSource; return [c[1],c[2],c[3]] ; break;
			default:
				console.log("Color::getColorSource Source형식이 지원하지 않습니다.");
				break;
		}
	},
	isValid:function(){return this.OriginSource?true:false;},
	//getProps
	getFiltedHSV:function(){
		var s = CLONE(this.Source);
		for(var key in this.ColorFilter) {
			if(this.ColorFilter[key] !== 0) switch(key) {
				case "cold"  : s[0]+=s[0]; break;
				case "light" : s[1]+=s[1]; break;
				case "bright": s[2]+=s[2]; break;
				default      : console.warn("Color::getFiltedHSV 알수 없는 필터값이 존재합니다. =>",key); break;
			}
		}
		return s;
	},
    getHSV :function() { return STRING("hsv(", STRINGC.apply(undefined,this.getFiltedHSV()),")"); },
	getHEX :function() { return STRING("#",this.Utility.HSVToHEX(this.getFiltedHSV()));},
    getRGB :function() { return STRING("rgb(", STRINGC.apply(undefined,this.Utility.HSVToRGB(this.getFiltedHSV())),")"); },
	getRGBA:function() { return STRING("rgba(",STRINGC.apply(undefined,this.Utility.HSVToRGB(this.getFiltedHSV())),","+this.alpha+")"); },
    //filter
    bright:function(level){ this.ColorFilter["bright"]+= NUMBER(level,10); return this; },
    dark  :function(level){ this.ColorFilter["bright"]-= NUMBER(level,10); return this; },
    cold  :function(level){ this.ColorFilter["cold"]  += NUMBER(level,10); return this; },
    warm  :function(level){ this.ColorFilter["cold"]  -= NUMBER(level,10); return this; },
    light :function(level){ this.ColorFilter["light"] += NUMBER(level,10); return this; },
	bold  :function(level){ this.ColorFilter["light"] -= NUMBER(level,10); return this; },
	//utility
	Utility:{
	    HEXToRGB: function(hex) {
	        var hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
	        return [hex >> 16, (hex & 0x00FF00) >> 8, (hex & 0x0000FF)];
	    },
	    HEXToHSV: function(hex) { return this.RGBToHSV(this.HEXToRGB(hex)); },
	    RGBToHSV: function(rgb_array) {
	        var r = rgb_array[0] / 255;
	        var g = rgb_array[1] / 255;
	        var b = rgb_array[2] / 255;
	        var H, S, V, C;
	        V = Math.max(r, g, b);
	        C = V - Math.min(r, g, b);
	        H = (C === 0 ? null : V == r ? (g - b) / C : V == g ? (b - r) / C + 2 : (r - g) / C + 4);
	        H = ((H + 360) % 6) * 60 / 360;
	        S = C === 0 ? 0 : C / V;
	        return [360 * (H || 1), 100 * S, 100 * V];
	    },
	    HSVToRGB: function(hsb_array) {
	        var rgb = {};
	        var h = Math.round(hsb_array[0]),
	            s = Math.round(hsb_array[1] * 255 / 100),
	            v = Math.round(hsb_array[2] * 255 / 100);
	        if (s == 0) {
	            rgb.r = rgb.g = rgb.b = v;
	        } else {
	            var t1 = v;
	            var t2 = (255 - s) * v / 255;
	            var t3 = (t1 - t2) * (h % 60) / 60;
	            if (h == 360) h = 0;
	            if (h < 60) {
	                rgb.r = t1;
	                rgb.b = t2;
	                rgb.g = t2 + t3;
	            } else if (h < 120) {
	                rgb.g = t1;
	                rgb.b = t2;
	                rgb.r = t1 - t3;
	            } else if (h < 180) {
	                rgb.g = t1;
	                rgb.r = t2;
	                rgb.b = t2 + t3;
	            } else if (h < 240) {
	                rgb.b = t1;
	                rgb.r = t2;
	                rgb.g = t1 - t3;
	            } else if (h < 300) {
	                rgb.b = t1;
	                rgb.g = t2;
	                rgb.r = t2 + t3;
	            } else if (h < 360) {
	                rgb.r = t1;
	                rgb.g = t2;
	                rgb.b = t1 - t3;
	            } else {
	                rgb.r = 0;
	                rgb.g = 0;
	                rgb.b = 0;
	            }
	        }
	        return [Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b)];
	    },
	    RGBToHEX: function(rgb_array) {
	        var hex = [rgb_array[0].toString(16), rgb_array[1].toString(16), rgb_array[2].toString(16)];
			for(var i=0,l=hex.length;i<l;i++) if(hex[i].length < 2) hex[i] = "0"+hex[i];
			return hex.join("");
	    },
	    HSVToHEX: function(hsv) { return this.RGBToHEX(this.HSVToRGB(hsv)); }
	}
},function(p1){
	p1               = p1.toUpperCase().trim();
	this.alpha       = 1;
	this.ColorFilter = { "bright":0, "cold" :0, "light" :0 };
	//
	if(/(hex|\#|)[0-9a-f]{3}/i.test(p1)){
		if(/([0-9a-f]{6})/i.test(p1)){
			//hex6
			this.OriginSource = /([0-9a-f]{6})/i.exec(p1);
			this.OriginSource[0] = "HEX";
		} else {
			//hex3
			this.OriginSource = /([0-9a-f]{3})/i.exec(p1);
			this.OriginSource[0] = "HEX";
			this.OriginSource[1] = this.OriginSource[1].replace(/[0-9a-f]/gi,function(s){return s+s;});
		}
	} else if(/\D+(\d+)\D+(\d+)\D+(\d+)/i.test(p1)) {
		if(/hsva\D+(\d+)\D+(\d+)\D+(\d+)\D+([\.\d]+)/i.test(p1)){
			this.OriginSource = /\D+(\d+)\D+(\d+)\D+(\d+)\D+([\.\d]+)/i.exec(p1);
			this.OriginSource[0] = "HSVA";
			this.alpha = parseFloat(this.OriginSource[4]);
		} else if(/hsv\D+(\d+)\D+(\d+)\D+(\d+)/i.test(p1)){
			this.OriginSource = /\D+(\d+)\D+(\d+)\D+(\d+)/i.exec(p1);
			this.OriginSource[0] = "HSV";
		} else if(/\D+(\d+)\D+(\d+)\D+(\d+)\D+([\.\d]+)/i.test(p1)){
			this.OriginSource = /\D+(\d+)\D+(\d+)\D+(\d+)\D+([\.\d]+)/i.exec(p1);
			this.OriginSource[0] = "RGBA";
			this.alpha = parseFloat(this.OriginSource[4]);
		} else {
			this.OriginSource = /\D+(\d+)\D+(\d+)\D+(\d+)/i.exec(p1);
			this.OriginSource[0] = "RGB";
		}
	}
	if(!this.isValid()){ console.error("Color::파라메터의 형식에 대응할 수 올바르지 없습니다. white로 대응합니다.=> ",p1); this.OriginSource=["HEX","FFFFFF"]; };
	this.Source = this.getColorSource();
},function(){
	switch(this.OriginSource[0]){
		case "HEX"  : return this.getHEX();  break;
		case "RGB"  : return this.getRGB();  break;
		case "RGBA" : return this.getRGBA(); break;
		case "HSV"  : return this.getHSV();  break;
		default: console.log("Color::getColorSource Source형식이 지원하지 않습니다."); break;
	}
});