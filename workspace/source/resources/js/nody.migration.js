nody.method('ELTHE',function(node,selectText,extraData){			
	if(NODYENV.matchesSelector) return NODYENV.matchesSelector(node,selectText);
	
	var tagInfo = SELECTINFO(selectText);
	for(var key in tagInfo){
		switch(key){
			case "tagName": if(node.tagName.toLowerCase() !== tagInfo.tagName) return false; break;
			case "class":
				var infoClass = tagInfo[key];
				var nodeClass = ELATTR(node,key);
				
				if( (infoClass === null) ) {
					if(nodeClass === null) { return false; }
					continue;
				}
				
				if(typeof nodeClass === "string"){
					var hasNotClass = false;
					
					nodeClass = nodeClass.split(" ");
					infoClass = infoClass.split(" ");
				
					for(var i=0,l=infoClass.length;i<l;i++){
						var findFlag = false;
						for(var i2=0,l2=nodeClass.length;i2<l2;i2++){
							if(nodeClass[i2] == infoClass[i]) {
								findFlag = true;
								break;
							}
						}
						if(findFlag == false){
							hasNotClass = true;
							break;
						}
					}
					if(hasNotClass == true) return false;
				} else {
					return false;
				}
				break;
			case "::":
				if(ELVALUE(node) !== tagInfo[key]) return false;
				break;
			case ":":
				for(var metaKey in tagInfo[key]){
					switch(metaKey){
						case "not"  : if( NUT.THE(node,tagInfo[key][metaKey]) ) return false; break;
						case "focus": if(!NUT.HASFOCUS(node)) return false; break;
						case "eq"   : case "nth-child":
							if(!node.parentElement) return false;
							if(DATAINDEX(node.parentElement.children,node) !== node,tagInfo[key][metaKey]) return false;
							break;
						case "even":
							if(!node.parentElement) return false;
							if( (DATAINDEX(node.parentElement.children,node)%2) ) return false;
							break;
						case "odd":
							if(!node.parentElement) return false;
							if( !(DATAINDEX(node.parentElement.children,node)%2) ) return false;
							break;
						case "first-child":
							if(!node.parentElement) return false;
							if( DATAINDEX(node.parentElement.children,node) !== 0 ) return false;
							break;
						case "last-child":
							if( DATAINDEX(node.parentElement.children,node) !== (node.parentElement.children.length - 1) ) return false;
							break;
					}
				}
				break;
			default :
				var nodeValue = ELATTR(node,key);
				var infoValue = tagInfo[key];
				
				if ( nodeValue == null ) {
					return false;
				} else if (infoValue == null) {
					switch(key.toLowerCase()){
						case "disabled": 
							if("disabled" in node){
								if(node.disabled == false) return false;
							}
						case "readonly":
							if("readonly" in node){
								if(node.readOnly == false) return false;
							}
						case "checked":
							if("checked" in node){
								if(node.checked == false) return false;
							}
						default:
							//true
						break;	
					}
				} else if (infoValue !== nodeValue){
					return false;
				}
				break;
		}
	}
	return true;
});

// IS Helper
//"Structure#QueryDataInfo":function(querys){
//	this.keymap(OUTERSPLIT(querys,",",["()"]),function(query){
//		var querySplit = [];
//		
//		query.trim()
//		.replace(/[\n]|[\s]{2,}/g," ")
//		.replace(/\s*(\>|\+)\s*/g,function(s){ return s.replace(/\s/g,""); })
//		.replace(/(\[[\w\=\_\-]+\]|\:\w+\([^\)]+\)|[\w\-\_\.\#\:]+\([^\)]+\)|[\w\-\_\.\#\:]+)(\s|\>|)/g,function(s){ 
//			querySplit.push(s);
//		});
//		
//		return querySplit;
//	});
//},

nody.method("ELIS",function(node,selectText,advenceResult){
	//
	if(!ISELNODE(node)) return false;
	if((typeof selectText === "undefined") || selectText == "*" || selectText == "") return true;
	
	var judgement, inspectData = StructureInit("QueryDataInfo",selectText);
	
	inspectData.each(function(querys,queryCase,index){
		// querys,queryCase,index
		// "[name]" => ["name"], "[name]"
		if(judgement == true) return false;
		
		if(querys.length == 0){
			judgement = false;
		} else if(querys.length == 1) {
			judgement = NUT.THE(node,querys[0]);
		} else {
			var allNodes   = [node].concat(NUT.PARENTS(node));
			var findThe    = 0;
			var lastResult = true;
			//console.log(allNodes);
			for(var i=querys.length-1;i>-1;i--){
				if(lastResult == false) return false;
				switch(querys[i].substr(querys[i].length-1)){
					case " ":
						//console.log("case ' '");
						for(var f=findThe+1,l=allNodes.length-findThe;f<l;f++){
							findThe++;
							var queryText = querys[i].trim();
							//console.log(NUT.THE(allNodes[f],queryText),allNodes[f],queryText);
							if( NUT.THE(allNodes[f],queryText) ){
								lastResult = true;
								break;
							} else {
								lastResult = false;
							}
						}
						break;
					case ">":
						//console.log("case '>'");
						findThe++;
						var queryText = querys[i].trim();
						if(NUT.THE(allNodes[findThe],queryText)){
							lastResult = true;
						} else {
							lastResult = false;
							break;
						}
						break;
					default:
						//console.log("case 'd'");
						if( NUT.THE(allNodes[findThe],querys[i]) ){
							lastResult = true;
						} else {
							lastResult = false;
						}
						break;
				}
				//console.log("target=>",allNodes[findThe],"query=>",querys[i],lastResult);
			}
			judgement = lastResult;
		}
	});
	return judgement;
});

nody.extendModule("NFArray","NFRange",{},function(a,b,c){
	var ok,left,right,plusCount;
	if((typeof a === "number") && (typeof b === "number")){
		left = a;
		right = b;
		plusCount = c;
		ok = true;
	} else if(typeof a === "string") {
		if( /(\d+)\~(\d+)/.test(a) == true ){
			var result = /(\d+)\~(\d+)/.exec(a);
			left   = parseInt(result[1]);
			right  = parseInt(result[2]);
			plusCount = b;
			ok     = true;
		}
	}
	if (ok == true){
		plusCount = isNaN(plusCount) ? 1 : parseInt(plusCount);
		
		if(left == right){
			this.push(left);
			return ;
		} else if(left < right){
			for(;left<=right;left=left+plusCount)this.push(left);
			return ;
		} else {
			for(;right<=left;right=right+plusCount)this.push(right);
			return ;
		}
	} else {
		this.setSource(a);
	}		
});


//value 값이 있는 엘리먼트 컨트롤
nody.module("NFInside",{
	__setInputConfig:function(){ ELATTR(this.Source,"autocomplete","off"); },
	__maskIgnoreKeyCode:[9,16,17,18,27,36,37,38,39,40,91,92],
	__maskApply:function(name){
		this.__setInputConfig();
		var ignoreMaskKeyCodes = new NFArray(this.__maskIgnoreKeyCode);
		var params             = new NFArray(arguments).subarr(1).toArray();
		var eventTarget        = this.Source;
		ELON(eventTarget,"keydown",function(e){
			if( !ignoreMaskKeyCodes.has(e.keyCode) ){
				setTimeout(function(){
					var n = new NFNumber(ELVALUE(eventTarget));
					ELVALUE(eventTarget,n[name].apply(n,params));
				},0);
			}
		});
	},
	getDateValue:function(format){
		var dateValue = ELVALUE(this.Source);
		return IS(dateValue,/(\d+)\D+(\d+)\D+(\d+)/,_NFString(dateValue).printf(/(\d+)\D+(\d+)\D+(\d+)/,[1],"년 ",[2],"월 ",[3],"일"),dateValue);
	},
	maskNumber:function(mask,reverse){
		if(this.Source) return this.__maskApply("getNumberTextFormat",mask,reverse); 
		return console.warn("Inside:: inside source invalid");
	},
	maskPhoneNumber:function(p,s){ 
		if(this.Source) return this.__maskApply("getPhoneNumber"); 
		return console.warn("Inside:: inside source invalid");
	},
	maskDecimal:function(p,s){ 
		if(this.Source) return this.__maskApply("getDecimal",p,s); 
		return console.warn("Inside:: inside source invalid");
	},	
	is:function(test,tb,fb){ return IS(this.getValue(),test,tb,fb); },
	as:function(test,tb,fb){ return AS(this.getValue(),test,tb,fb); },
	print:function(beforePrint,afterPrint){
		var targetWindow   = window.open('','','left=0,top=0,width=1,height=1,toolbar=0,scrollbars=0,status =0');
		var targetDocument = targetWindow.document;
		var own            = this;
		var pointer        = CREATE("div#pointer");
		ELBEFORE(this.Source,pointer);
		var parentNode     = this.Source.parentNode;
		var headInfo       = new NFArray(W.document.head.childNodes).filter(function(node){ if(ISELNODE(node)) if(node.tagName !== "SCRIPT") return true; return false; });
		headInfo.insert(CREATE("base" ,{href:NFClient.url().replace(/\/[^\/]*$/,"/")})).push(CREATE("style",{html:"@media print{ body{ background-color:#FFFFFF; background-image:none; color:#000000 } #ad{ display:none;} #leftbar{ display:none;} #contentarea{ width:100%;} }"}));
		targetDocument.head.innerHTML = headInfo.map(function(node){ return node.outerHTML; }).join("");
		var onbeforeprint = function(){
			CALL(beforePrint,own.Source,own.Source);
			own.addClass("print");
			targetDocument.body.appendChild(own.Source);
		};
		var onafterprint  = function(){
			own.removeClass("print");
			CALL(afterPrint,own.Source,own.Source);
			ELBEFORE(pointer,own.Source);
			ELREMOVE(pointer);
			targetWindow.close();
		};
		//print 시작
		onbeforeprint();
		setTimeout(function(){
			targetWindow.print();
			onafterprint();
		},1);
	},
	getValue:function(){ return ELVALUE(this.Source); },
	number  :function(){ return new NFNumber(ELVALUE(this.Source)).number(); }
},function(el){
	this.Source = FSINGLE(el)[0];
	if(!this.Source) console.warn("Inside의 초기값을 설정하지 못했습니다. command =>",el);
});


nody.extendModule("NFQuery","NFContext2D",{
	setCanvasSize:function(width,height){
		this._drawTarget.setAttribute("width",width);
		this._drawTarget.setAttribute("height",height);
		this._drawTargetWidth  = width;
		this._drawTargetHeight = height;
	},
	addDrawRect:function(m){
		this._drawRect.push(m);
	},
	needDraw:function(){
		var _ = this;
		var dirtyRectParam = {
			width:this._drawTargetWidth,
			height:this._drawTargetHeight,
			horizontalCenter:this._drawTargetWidth/2,
			verticalCenter:this._drawTargetHeight/2,
			top:0,
			left:0,
			right:this._drawTargetWidth,
			bottom:this._drawTargetHeight
		}
		DATAEACH(this._drawRect,function(m){
			if(typeof m === "function") m(dirtyRectParam,_._drawTarget.getContext('2d'));
		});
		return this;
	},
	addCrossLine:function(top,right,bottom,left,lineColor,offsetX,offsetY){
		top = TONUMBER(top);
		right = TONUMBER(right);
		bottom = TONUMBER(bottom);
		left = TONUMBER(left);
		offsetX = TONUMBER(offsetX);
		offsetY = TONUMBER(offsetY);
		
		lineColor = lineColor || "#777";
		//alpha = alpha || 1.0;
		
		this.addDrawRect(function(b,c){
			var quickStroke = function(m){
				c.beginPath();
				//c.globalAlpha = alpha;
				c.strokeStyle = lineColor;
				m(b,c);
				c.closePath();
				c.stroke();
			};
			if(top) {
				quickStroke(function(b,c){
					c.lineWidth = top;
					c.moveTo(b.horizontalCenter + offsetX, b.verticalCenter + offsetY);
					c.lineTo(b.horizontalCenter + offsetX, b.top);
				});
			}
			if(right) {
				quickStroke(function(b,c){
					c.lineWidth = right;
					c.moveTo(b.horizontalCenter + offsetX, b.verticalCenter + offsetY);
					c.lineTo(b.right,b.verticalCenter + offsetY);
				});
			}
			if(bottom) {
				quickStroke(function(b,c){
					c.lineWidth = bottom;
					c.moveTo(b.horizontalCenter + offsetX, b.verticalCenter + offsetY);
					c.lineTo(b.horizontalCenter + offsetX, b.bottom);
				});
			}
			if(left) {
				quickStroke(function(b,c){
					c.lineWidth = left;
					c.moveTo(b.horizontalCenter + offsetX, b.verticalCenter  + offsetY);
					c.lineTo(b.left,b.verticalCenter + offsetY);
				});
			}
		});
		return this;
	},
	toURL:function(){
		return this._drawTarget.toDataURL();
	},
	backgroundTo:function(target,fill){
		var target = FSINGLE(target)[0];
		if(target) {
			ELSTYLE(target,"background-image",ZSTRING("url(\"\\{$0}\")",this.toURL()));
		}
	},
	backgroundToResponder:function(fill){
		this.backgroundTo(this._responder,fill);
	}
},function(width,height){
	this._drawRect   = [];
	this._drawTarget = MAKE("canvas");
	this.setSource(this._drawTarget);
	if(typeof width === "string" || typeof width === "object") this._responder = FSINGLE(width)[0];
	if(this._responder){
		this.setCanvasSize(this._responder.offsetWidth,this._responder.offsetHeight);
	} else {
		this.setCanvasSize(width,height || width);	
	}
});

// Model은 순수 데이터 모델에 접근하기 위해 사용합니다.
nody.extendModule("NFObject","NFModel",{
	exports:function(context,forceData){
		var exportContext = DATACONTEXT(context);
		if(!exportContext) { exportContext = this.DataContext; }
		if(exportContext){
			if( ISELNODE(exportContext) == true ){
				_NFForm(exportContext,this.ModelSelectRule).checkin(this.Source);
			} else {
				for(var key in this.Source) if( key in exportContext || forceData == true ) exportContext[key] = this.Source[key];
			}
		}
	},
	imports:function(target){
		var dataContext = DATACONTEXT(target);
		if (dataContext) {
			this.DataContext = dataContext;
			if(ISELNODE(this.DataContext)){
				this.Source = _NFForm(this.DataContext,this.ModelSelectRule).checkout();
				return this;
			} else {
				this.Source = this.DataContext;
				return this;
			}
		}
		console.error("Model :: 시리얼라이저 다음 초기화 인자가 올바르지 않습니다. => ", target);
	},
	replace:function(key,value){
		if(typeof key === "string"){
			switch(typeof value){
				case "number" : case "string" :
					this.Source[key] = value;
					break;
				case "function" :
					this.Source[key] = value.call(this,key[value]);
					break;
				defualt :
				console.warn("Model::replace >> replace는 number string function만 지원 합니다.  들어온 값=>",value,typeof value);
					break;
			}
			return this.Source;
		}
	},
	trace:function(){
		console.log("Model :: trace == ",this.DataContext);
		var messege = [];
		for(var key in this.Source) messege.push(" :"+key+"   => "+ TOS(this.Source[key]) );
		console.log(messege.join("\n"));
		console.log("Model :: trace end == ",this.Source);
		return this;
	}
},function(target,selectRule){
	switch(typeof rule){
		case "string":
			this.ModelSelectRule = rule+",[name],[control]";
			break;
		default :
			this.ModelSelectRule = "[name],[control]";
			break;
	}
	this.imports(target);
});

nody.makeModule("Color",{
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
nody.module("NFTimeCounter",{
	timeoutHandler:function(){
		if(this._timeout)clearTimeout(this._timeout);
		if( this._moveEnd > (+(new Date())) ) {
			CALL(this._whenMoving,this,100 - ( this._moveEnd - (+new Date())) / this.duration * 100);
			var _ = this;
			this._timeout = setTimeout(function(){ _.timeoutHandler.call(_) },this.rate);
		} else {
			this.moveStart = null;
			this.moveEnd   = null;
			CALL(this._whenMoving,this,100);
			CALL(this._whenMoveFinish,this,100);
		}
	},
	start:function(){
		var _ = this;
		this._moveStart = (+(new Date()));
		this._moveEnd   = this._moveStart + this.duration;
		this.timeoutHandler();
	},
	whenCounting   :function(m){ this._whenMoving = m; },
	whenCountFinish:function(m){ this._whenMoveFinish = m; }
},function(counting,finish,ms,rate,now){
	if(counting)this.whenCounting(counting);
	if(finish)this.whenCountFinish(finish);
	this.duration = typeof ms   === 'number' ? ms   : 300;
	this.rate     = typeof rate === 'number' ? rate : 20;
	if(finish === true || ms === true || rate === true || now === true) { this.start() }
});

nody.METHOD("TAGSTACKS",function(){
	var stakes = new String(""),stakee = new String("");
	for(var i=0,l=arguments.length;i<l;i++){
		if(typeof arguments[i] === "string"){
			stakes += new String("<");
			stakes += arguments[i];
			stakes += new String(">");
			var ee = new String("</");
			ee += arguments[i];
			ee += new String(">");
			stakee = ee + stakee;
		} else {
			console.warn("TAGSTAKE:: 허용하지 않습니다.")
		}
	}
	return [stakes,stakee]; 
});


N.MODULE("ContentLoaderBase",{
	"+_ActiveController":undefined,
	getActiveController:function(){ return this._ActiveController; },
	_setEvent:function(eventType,eventName,method){
		var _ = this;
		N.dataEach(eventName,function(eventName){
			if(eventName == "!global"){
				if(typeof method === "function") _.ContentLoaderBaseEvents[eventType] = method;
			} else {
				if((typeof eventName === "string") && (typeof method === "function"))
				return  _.ContentLoaderBaseEvents[eventType][eventName] = method;
			}
		});
	},
	whenAnyLoad:function(method){
		this._setEvent("AnyLoadEvent","!global",method);
	},
	whenAnyActive:function(method){
		this._setEvent("AnyActiveEvent","!global",method);
	},
	whenAnyInactive:function(method){
		this._setEvent("AnyInactiveEvent","!global",method);
	},
	whenAnyActiveToggle:function(openMethod,disappearMethod){
		this.whenAnyActive(openMethod);
		this.whenAnyInactive(disappearMethod);
	},
	whenLoad:function(eventName,method){
		this._setEvent("ContainerLoadEvents",eventName,method);
	},
	//열때마다 일어나는 이벤트
	whenActive:function(eventName,method){
		this._setEvent("ContainerOpenEvents",eventName,method);
	},
	//보임이 없어질때마다 일어나는 이벤트
	whenInactive:function(eventName,method){
		this._setEvent("ContainerInactiveEvents",eventName,method);
	},
	whenActiveToggle:function(eventName,openMethod,disappearMethod){
		this.whenActive(eventName,openMethod);
		this.whenInactive(eventName,disappearMethod);
	},
	getNameOfActive:function(){
		return this.ContainerActiveKeys.join(" ");
	},
	getURLOfActive:function(){
		return this.Source[this.ContainerActiveKeys.last()];
	},
	_triggeringActiveEvents:function(container,activeName,containerEvent,userArgs){
		// 로드가 완료되었을때
		if( containerEvent.match("load")) {
			N.APPLY(this.ContentLoaderBaseEvents.AnyLoadEvent,container,userArgs);
			N.APPLY(this.ContentLoaderBaseEvents.ContainerLoadEvents[activeName],container,userArgs);
		}
		if( containerEvent.match("active")) {
			N.APPLY(this.ContentLoaderBaseEvents.AnyActiveEvent,container,userArgs);
			N.APPLY(this.ContentLoaderBaseEvents.ContainerOpenEvents[activeName],container,userArgs);
		}
	},
	_triggeringInactiveEvents:function(container,inactiveName){
		N.APPLY(this.ContentLoaderBaseEvents.AnyInactiveEvent,container);
		N.APPLY(this.ContentLoaderBaseEvents.ContainerInactiveEvents[inactiveName],container);
	},
	loadHTML:function(loadKey,loadPath,success,error){
		var _ = this;

		//함수일때
		if(typeof loadPath === "function") loadPath = loadPath(N.APPLY(loadPath,this));

		//ELEMENT(s) or URL
		switch(typeof loadPath){
			case "string":
				new N.Open(loadPath + (loadPath.indexOf("?") > -1 ? "&token=" : "?token=") + N.Util.base36Random(2),{
					"dataType":"dom",
					"success":function(doms){
						_.saveContainerContents(doms,loadKey);
						N.CALL(success,_,loadKey,doms);
					},
					"error":function(){
						console.error("ContentLoaderBase::URL링크에서 데이트럴 찾지 못했습니다"+loadPath);
						N.CALL(error,_,loadKey);
					}
				});
				break;
			case "object":
				//엘리먼트 배열로 들어올경우
				var doms = N.findLite(loadPath);

				//loadPath가 빈 배열이라면 정상적인 처리로 간주합니다.
				if( doms.length < 1 && !N.isArray(loadPath) ){
					console.error("ContentLoaderBase::불러올 엘리먼트가 존재하지 않습니다."+loadPath);
					N.CALL(error,_,loadKey);
				} else {
					_.saveContainerContents(doms,loadKey);
					N.CALL(success,_,loadKey,doms);
				}
				break;
			default :
				console.log("ContentLoaderBase::올바르지 않은 loadPath =>",loadPath,loadKey);
				N.CALL(error,_,loadKey);
				return false;
				break;
		}
		return true;
	},
	//컨테이너 컨텐츠
	saveContainerContents:function(doms,key){
		if(typeof key === "string") { this.ContainerContents[key] = N.toArray(doms); }
	},
	loadContainerContents:function(key){
		return this.ContainerContents[key];
	},
	removeContainer:function(key){
		delete Containers[key];
		return this;
	},
	//
	addContainer:function(container,key){
		var findContainer = N.findLite(container)[0];
		if(!findContainer) return console.warn(key,"의 컨테이너를 찾을 수 없습니다.");
		this.ContainerPlaceholder[key] = findContainer;
		return this;
	},
	needActiveController:function(){

		this._ActiveController = N.APPLY(N.ActiveController.new,undefined,arguments);
		return this._ActiveController;
	},
	currentActiveController:function(){
		return this._ActiveController;
	}
},function(baseParam,setupMethod){
	this.Source = {};
	this.ContainerPlaceholder = {};
	this.ContainerContents    = {};
	this.ContainerActiveKeys  = new N.Array();

	// 로드될때 이벤트입니다.
	this.ContentLoaderBaseEvents = {
		"AnyLoadEvent":undefined,
		"AnyActiveEvent":undefined,
		"AnyInactiveEvent":undefined,
		"ContainerLoadEvents":{},
		"ContainerOpenEvents":{},
		"ContainerInactiveEvents":{}
	};

	N.CALL(setupMethod,this);

	switch(typeof baseParam){
		case "object":
			N.extend(this.Source,baseParam);
			break;
		case "function":
			var _ = this;
			var baseFunctionResult = baseParam.call(this,this);
			if(typeof baseFunctionResult === "object") N.extend(this.Source,baseFunctionResult);
			break;
	}
});

var nody_loader_script_start = function(container){
	N.find("script",container,N.dataEach,function(scriptNode){
		var script = scriptNode.innerHTML;
		N.TRY_CATCH(function(){
			eval.call(script);
		},function(e){
			console.error("다음의 스크립트 구문 오류로 스크립트 실행이 정지되었습니다. => ",N.max(script,200));
			throw e;
		});
	});
};

N.EXTEND_MODULE("ContentLoaderBase","MultiContentLoader",{
	loadWithProperty:function(loadset,success){
		//lo
		if(typeof loadset !== "object") return console.error("loadAll이 중지되었습니다.");
		var _ = this;
		var successFire = new N.Fire(N.propsLength(loadset),function(){ N.CALL(success,_); });
		N.propsEach(loadset,function(loadPath,loadKey){
			var placeholder = _.ContainerPlaceholder[loadKey];
			if(!placeholder) {
				successFire.touch();
				return console.error("미리 정의되어있지 않은 플레이스 홀드키가 존재함 =>",loadKey);
			}
			_.loadHTML(loadKey,loadPath,function(key,doms){
				_.Source[loadKey] = _.Source[loadPath];
				N.node.append(placeholder,doms);
				nody_loader_script_start(placeholder);
				_._triggeringActiveEvents(placeholder,key,"load");
				successFire.touch();
			},function(){
				successFire.touch();
			});
		});
	},
	active:function(name){
		var activeHTML = this.loadContainerContents(name);
		if( !activeHTML ) return console.warn("정의되지 않은 컨테이너를 active하려고 함 => ",name);

		//이미 엑티브된 컨테이너는 아무것도 발생하지 않음
		if( this.ContainerActiveKeys.has(name) ) return false;

		//멀티 액티브가 아니면 다른 active값을 inactive시킴
		if( this.multiActive == false ) {
			var _ = this;
			this.ContainerActiveKeys.each(function(wasActive){
				_.inactive(wasActive);
			});
		}
		//액티브 된 이벤트를 전달
		var loadArguments = Array.prototype.slice.call(this,1);
		this._triggeringActiveEvents(this.ContainerPlaceholder[name],name,"active",loadArguments);
		this.ContainerActiveKeys.push(name);
	},
	inactive:function(name){
		if( this.ContainerActiveKeys.has(name)) {
			this.ContainerActiveKeys.remove(name);
			this._triggeringInactiveEvents(this.ContainerPlaceholder[name],name);
		}
	},
	inactiveAll:function(){
		var _ = this;
		this.ContainerActiveKeys.each(function(name){
			this._triggeringInactiveEvents(this.ContainerPlaceholder[name],name);
		});
		this.ContainerActiveKeys.clear();
	}
},function(containers,baseParam){
	//컨테이너 추가;
	var _ = this;
	this._super(baseParam,function(){
		N.propsEach(containers,function(container,key){
			_.addContainer(container,key);
		});
		this.multiActive = false;
	});
});

N.EXTEND_MODULE("ContentLoaderBase","ContentLoader",{
	_inactiveActivatedContents:function(removeInPlaceholder){
		var _ = this;
		this.ContainerActiveKeys.each(function(activatedKey){
			_.saveContainerContents(_.ContainerPlaceholder[activatedKey].children,activatedKey);
			_._triggeringInactiveEvents(_.ContainerPlaceholder[activatedKey],activatedKey);
			if(removeInPlaceholder) _.ContainerPlaceholder[activatedKey].innerHTML = "";
		});
		this.ContainerActiveKeys.clear();
	},
	//무조건 새로 불러옴
	load:function(loadKey){
		if(loadKey in this.Source){
			var _             = this;
			var loadArguments = Array.prototype.slice.call(arguments,1);

			//이전 컨테이너를 Inactive한다고 통보
			this._inactiveActivatedContents(true);

			return this.loadHTML(loadKey,this.Source[loadKey],function(key,doms){
				N.node.append(_.ContainerPlaceholder[key],doms);
				nody_loader_script_start(_.ContainerPlaceholder[key]);
				_.ContainerActiveKeys.push(key);
				_._triggeringActiveEvents(_.ContainerPlaceholder[key],key,"load active",loadArguments);
			});
		} else {
			console.warn("불러올 소스의 경로가 존재하지 않습니다. => ",loadKey,this.ContainerPlaceholder,this.Source);
		}
	},
	active:function(loadKey){
		//불러와있다면 아무것도 실행하지 않음
		if( this.ContainerActiveKeys.has(loadKey) ) return false;

		//파라메터를 배열로 변환
		var openArguments = Array.prototype.slice.call(arguments);

		//로드한 컨텐츠가 아예 존재하지 않으면 load를 진행한다.
		var loadedHTMLContents = this.loadContainerContents(loadKey);
		if(!loadedHTMLContents) return this.load.apply(this,openArguments);

		//이전 컨테이너를 Inactive한다고 통보
		this._inactiveActivatedContents(true);

		N.node.append( this.ContainerPlaceholder[loadKey], loadedHTMLContents );
		this.ContainerActiveKeys.push(loadKey);
		openArguments.shift();
		this._triggeringActiveEvents(this.ContainerPlaceholder[loadKey],loadKey,"active",openArguments);
		return true;
	},
	// 현재 열려있는 페이지를 강제적으로 링크파라메터로 불러옴
	link: function (linkText){
		loadHTML(linkText,undefined,function(key,doms){
			var placeholder = this.ContainerPlaceholder[this.ContainerActiveKeys.last()];
			placeholder.innerHTML = "";
			N.node.append(placeholder,doms);
		});
	}
},function(container,baseParam){
	var _container = N.findLite(container)[0],_ = this;
	if (_container){
		this._super(baseParam,function(){
			//defaultContainer를 보존합니다.
			var dcf = "initialContainer";
			this.addContainer(_container,dcf);
			this.saveContainerContents(_container.children,dcf);
			this.ContainerActiveKeys.push(dcf);
		});
		//다른컨테이너도 플레이스 홀더 설정을 합니다.
		N.propsEach(this.Source,function(value,key){ _.addContainer(_container,key); });
	} else {
		console.error("ContentLoader::해당 컨테이너를 찾을수 없습니다. Navigation Controller의 작동을 완전히 중지합니다.=> ",container);
	}
});

N.EXTEND_MODULE("ContentLoaderBase","TabContents",{
	_inactiveActivatedContents:function(removeInPlaceholder){
		var _ = this;
		this.ContainerActiveKeys.each(function(activatedKey){
			_._triggeringInactiveEvents(_.ContainerPlaceholder[activatedKey],activatedKey);
			N.node.style( _.ContainerPlaceholder[activatedKey],'display','none');
		});
		this.ContainerActiveKeys.clear();
	},
	callAsLoad:function(loadKey,loadArguments,after){
		if(loadKey in this.Source){
			var _ = this;
			return this.loadHTML(loadKey,this.Source[loadKey],function(key,doms){
				N.node.append(_.ContainerPlaceholder[key],doms);
				nody_loader_script_start(_.ContainerPlaceholder[key]);
				_._triggeringActiveEvents(_.ContainerPlaceholder[key],key,"load",loadArguments);
				N.CALL(after,this);
			});
		} else {
			console.warn("불러올 소스의 경로가 존재하지 않습니다. [loadKey : ",loadKey,'] [placeholder(all) => ',this.ContainerPlaceholder,'] [Source => ',this.Source,']');
		}
	},
	//무조건 새로 불러옴
	load:function(loadKey){
		this.callAsLoad(loadKey,Array.prototype.slice.call(arguments,1));
	},
	active:function(loadKey){
		//불러와있다면 아무것도 실행하지 않음
		if( this.ContainerActiveKeys.has(loadKey) ) return false;

		//파라메터를 배열로 변환
		var openArguments = Array.prototype.slice.call(arguments);

		//이전 컨테이너를 Inactive한다고 통보
		this._inactiveActivatedContents(true);

		this.ContainerActiveKeys.push(loadKey);
		N.node.style( this.ContainerPlaceholder[loadKey], 'display', 'block' );

		this._triggeringActiveEvents(this.ContainerPlaceholder[loadKey],loadKey,"active",openArguments.slice(1));
		return true;
	},
	addContainer:function(contents,name,noAppend){
		var newContainer = N.make('div',{style:'height:100%;display:none;','data-container-name':name},contents);
		this._super(newContainer,name);
		if(noAppend !== false) N.node.append(this.view,newContainer);
		if(name !== "initial-contents") this.callAsLoad(name);
	},
	needFormController:function(target){
		if(!target || typeof target === 'object') {
			if(!this._globalFormController) this._globalFormController = new N.FormController(this.view);
			this._globalFormController.addViewStatus(target);
			return this._globalFormController;
		}
		if(!(typeof target === 'string' || typeof target === 'number')) return console.error('문자열 타겟이 아니면 폼컨트롤러를 반환할수 없습니다.');
		if(!this.ContainerPlaceholder[target]) return console.error('존재하지 않은 컨트롤러 키의 폼컨트롤러를 호출하였습니다',target);
		if(!this._viewsFormController) this._viewsFormController = [];
		if(!this._viewsFormController[target]) this._viewsFormController[target] = new N.FormController(this.ContainerPlaceholder[target]);
		return this._viewsFormController[target];
	}
},function(container,baseParam){
	this.view = N.findLite(container)[0], _ = this;

	if (this.view){
		//베이스 파라메터가 존재하지 않으면 현재 컨테이너의 컨텐츠를 기본 파라메터로 봄
		var noConfigMode = false;

		var _ = this;
		var initialContents = this.view.children;
		this._super(function(){
			if(typeof baseParam === 'function') {
				var result = baseParam.call(_,_);
				return (!result) ? N.inject(initialContents,function(inj,node,i){ inj[i] = node; }) : result;
			}
			return baseParam;
		},function(){
			this.addContainer(initialContents,"initial-contents");
		});

		//다른컨테이너도 플레이스 홀더 설정을 합니다.
		N.propsEach(this.Source,function(value,key){
			_.addContainer( noConfigMode ? value : undefined,key);
		});
	} else {
		console.error("TabContents::해당 컨테이너를 찾을수 없습니다. Navigation Controller의 작동을 완전히 중지합니다.=> ",container);
	}
});