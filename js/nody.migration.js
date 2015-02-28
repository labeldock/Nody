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