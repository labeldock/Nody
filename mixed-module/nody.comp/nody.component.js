// important!
// It is lab version
extendModule("String","AreaContent",{
	getContentInfo:function(rLength){
		var r = {"type":null,"value":null,"maxLength":null,"pattern":[0]};
		// source :
		// pattern : 
		var pattern;
		var source = this.Source.replace(/\|[^\|]*\|$/,function(s){
			pattern = s.substr(1,s.length-2);
			return "";
		});
		pattern = (typeof pattern=="undefined")?null:pattern.split("&&");
		
		//patterProgress
		if( ISARRAY(pattern) ) if( !(pattern.length == 1 && pattern[0] == "") ){
			r.pattern = [];
			for(var pi=0,l=pattern.length;pi<l;pi++){
				var pp = /([^\:]*)(\:(\~\+|\+\+|\+|\--|)(.*)|)/.exec(pattern[pi]);
				if(!pp)console.warn("inValid pattern => ",pattern[pi]);
				
				// default relativeValue
				var patternVar    = 0;
				var patternRepeat = pp[1]=="" ? 1 : ZONERANGE(pp[1]);
				var patternImp    = pp[3]==""?"+":pp[3];
				var patternValue  = pp[4];
				
				//console.log("patternRepeat,patternVar,patternImp,patternValue",patternRepeat,patternVar,patternImp,patternValue);
				
				var patternArray = [];
				switch(patternImp){
					case "++":
						for(var i=0;i<patternRepeat;i++){
							patternVar += ZONERANGE(patternValue);
							patternArray.push( patternVar );
						}
						break;
					case "~+":
						patternArray.push( patternVar );
						for(var i=1;i<patternRepeat;i++){
							patternVar += ZONERANGE(patternValue);
							patternArray.push( patternVar );
						}
						break;
					case "--":
						for(var i=0;i<patternRepeat;i++){
							patternVar -= ZONERANGE(patternValue);
							patternArray.push( patternVar );
						}
					case "+": default:
						for(var i=0;i<patternRepeat;i++) patternArray.push( ZONERANGE(patternValue) );
						break;
				}
				if(patternArray.length){
					r.pattern = r.pattern.concat( patternArray );
				}
			}
		}
		//number
		if(/(\s|)(^\d+\~\d+|\d+)(\s|)$/.test(source)){				
			r.type   = "rangeNumber";
			r.value  = source;
			r.maxLength = r.pattern.length;
			return r;
		}
		//plain before
		if(source.indexOf(",")>0){
			if(typeof rLength == "number" && rLength != 1){
				r.type   = "operatedArray";
				r.value  = [];
				TIMES(rLength,function(){ r.value.push(ZONECHOICE(source)); });
				r.maxLength = r.value.length;
			} else {
				r.type   = "randomArray";
				r.maxLength = 1;
				r.value  = source;
			}
			return r;
		}
		//plain
		if(typeof rLength == "number" && rLength != 1 ){
			r.type   = "operatedArray";
			r.value  = [];
			TIMES(rLength,function(){ r.value.push(source) });
			r.maxLength = r.value.length;;
		} else {
			r.type   = "plain";
			r.maxLength = 1;
			r.value  = source;
		}
		return r;
	},
	getLength:function(){
		var info = this.getContentInfo();
		if(info) switch(info.type){
			case "rangeNumber": return info.maxLength; break;
			case "randomArray": return info.maxLength; break;
			case "plain"      : return info.maxLength; break;
		}
		return 0;
	},
	getContents:function(maxLength){
		var info   = this.getContentInfo(maxLength);
		//console.log("info## ",this.Source,TOSTRING(info),"ppl =>",maxLength);
		if(info){
			switch(info.type){
				case "rangeNumber":
					return DATAMAP(info.pattern,function(pvalue){
						//console.log("info.value",info.value,ZONERANGE(info.value),pvalue);
						return ZONERANGE(info.value) + pvalue;
					});
					break;
				case "randomArray":
					return [ZONECHOICE(info.value)];
					break;
				case "plain":
					return [info.value];
					break;
				case "operatedArray":
					return info.value;
					break;
				default:
					
					break;
			}
		}
		return[];
	},
	getContent:function(index){return this.getContents()[TONUMBER(index)];}
},function(param){
	if( ISARRAY(param) ) param = param.join(",");
	this._super(param);
	this.Source = this.Source;
},function(i){return this.getContent(i)});

extendModule("Array","Area",{
	getContents:function(length){
		var maxLength=0;
		if(typeof length == "number") maxLength = length;
		else this.each(function(content){ var len = content.getLength(); if(len > maxLength) maxLength = len; });
		//
		var result = ARRAYINARRAY(maxLength);
		this.each(function(content){
			var tileData = content.getContents(maxLength);
			for(var i=0,l=tileData.length;i<l;i++)result[i].push(tileData[i]);
		});
		return result;
	},
	getRowContents:function(index){
		index = typeof index == "number" ? index : 0;
		return this.getContents(index+1)[index];
	},
	getColumnContents:function(index,length){
		index = typeof index == "number" ? index : 0;
		return DATAMAP(this.getContents(length),function(row){
			return row[index];
		});
	},
	getJoinContents:function(joinText,length){
		if(typeof joinText == "number"){
			length   = joinText;
			joinText = "";
		} else {
			joinText = typeof joinText == "string" ? joinText : "";
		}
		return DATAMAP(this.getContents(length),function(lineData){ return lineData.join(joinText); });
	},
	getLineContents:function(joinText,length){
		var joinContents = this.getJoinContents(joinText,length);
		for(var i=0,l=joinContents.length-1;i<l;i++){ joinContents[i] = joinContents[i]+"\n"; }
		return joinContents.join("");
	},
	getStringContents:function(a,b){
		return this.getLineContents(a,b);
	}
},function(){
	var contents = Array.prototype.slice.call(arguments);
	var pushData = [];
	for(var i=0,l=contents.length;i<l;i++) pushData.push( new AreaContent(contents[i]) );
	this.setSource(pushData);
});

makeSingleton("ActiveRecordPlugins",{
	addPlugin:function(moduleName,moduleInit){
		var names = moduleName.trim().split(" ");
		if(typeof moduleInit == "function"){
			for(var key in names) this.Plugins[names[key]] = moduleInit;
		} else {
			console.error("ActiveRecordPlugins::",names,"에 해당하는 모듈이 함수이여야 합니다. 초기화 할수 없습니다.",moduleInit);
		}
		
	},
	getPlugin:function(name){ return this.Plugins[name]; },
	initPlugin:function(name,path,option,moduleOption){ 
		if( this.getPlugin(name) ){
			return this.Plugins[name](name,path,option,moduleOption);
		} else {
			console.error("ActiveRecordPlugins:: 존재하지 않는 플러그인을 호출하엿습니다. 플러그인 이름 => ",name)
		}
	}
},function(){
	this.Plugins = {};
});

ActiveRecordPlugins.addPlugin("http https json jsonp dom xml",function(type,path,option,moduleOption){
	return new (function requestPlugin(aType,aPath,aOption,aModuleOption){
		this.path            = aPath;
		this.option          = TOOBJECT(aOption);
		this.option.dataType = aType;
		this.moduleOption    = aModuleOption;
		this.command         = function(path,data,success,error,scope){
			if(typeof data   !== "undefined") this.option.data 		  = data;
			if(typeof success == "function")  this.option.success     = success;
			if(typeof error   == "function")  this.option.error       = error;
			if(typeof scope   == "object")    this.moduleOption.scope = scope;
			_Open(this.path + path, this.option,this.moduleOption);
		}
	})(type,path,option,moduleOption);
});

makeModule("ActiveRecord",{
	command:function(path,data,success,error,scope){
		var recordModule = ActiveRecordPlugins.initPlugin(this.ActiveRecordType,this.ActiveRecordPath,this.ActiveRecordOption,this.ActiveRecordModuleOption);
		if(recordModule) { recordModule.command(path,data,success,error,scope); };
	},
	commandToRoot:function(data,success,error,space) { return this.command("",data,success,error,space); },
	commandWithEntity:function(entitiy,data,success,error,space){
		var entitiyValue = this.ActiveRecordOption[entitiy];
		this.command( entitiyValue ,data,success,error,space);
	},
	C:function(data,success,error,requestSpace){
		this.commandWithEntity("create",_Object(data).trance(this.ActiveRecordOption["tranceCreate"],this.ActiveRecordOption["tranceOnly"]).getConcat(this.ActiveRecordOption["constCreate"]),success,error);
	},
	R:function(data,success,error,requestSpace){
		this.commandWithEntity("read",_Object(data).trance(this.ActiveRecordOption["tranceRead"],this.ActiveRecordOption["tranceOnly"]).getConcat(this.ActiveRecordOption["constRead"]),success,error);
	},
	U:function(data,success,error,requestSpace){
		this.commandWithEntity("update",_Object(data).trance(this.ActiveRecordOption["tranceUpdate"],this.ActiveRecordOption["tranceOnly"]).getConcat(this.ActiveRecordOption["constUpdate"]),success,error);
	},
	D:function(data,success,error,requestSpace){
		//uniquezKey process
		data = CLONE(TOOBJECT(data));
		if("deleteKey" in this.ActiveRecordOption) if( IS(data[this.ActiveRecordOption.deleteKey],"!nothing")) {
			var deleteValue = data[this.ActiveRecordOption.deleteKey];
			data = {};
			data[this.ActiveRecordOption.deleteKey] = deleteValue;
		}
		this.commandWithEntity("delete",_Object(data).trance(this.ActiveRecordOption["tranceDelete"],this.ActiveRecordOption["tranceOnly"]).getConcat(this.ActiveRecordOption["constDelete"]),success,error);
	}
},function(type,path,option,moduleOption){
	this.ActiveRecordType         = type;
	this.ActiveRecordPath         = path;
	this.ActiveRecordOption       = CLONE(TOOBJECT(option));
	this.ActiveRecordModuleOption = CLONE(TOOBJECT(moduleOption));
});

//******************
makeModule("Ranking",{
	getFlagRank:function(v){
		if(v == true) return (-1);
		if(v == false) return (-2);
		if(v == undefined) return (-3);
		return (-4);
	},
	worst:function(rankData){
		if( _Array(rankData).isNothing() == true){
			return this.RankingNothing;
		} else {
			switch(this.RankingType){
				case "object":
					var rankResult = CLONE(this.Source);
					//
					var rankAttribute = [];
					for(var key in this.Source) rankAttribute(key);
					//
					for(var i=0,l=rankData.length;i<l;i++){
						for(var i2=0,l2=rankAttribute.length;i2<l2;i2++){
							if( this.getFlagRank(rankResult[rankAttribute[i2]]) > this.getFlagRank(validateResults[i][rankAttribute[i2]]) ){
								rankResult[rankAttribute[i2]] = validateResults[i][rankAttribute[i2]];
							}
						}
					}
					return rankResult;
			
					break;
				case "boolean":
					var flagResult = true;
					for(var i=0,l=rankData.length;i<l;i++){
						if( this.getFlagRank(flagResult) > this.getFlagRank(rankData[i]) ){
							flagResult = rankData[i];
						}
					}
					return flagResult;
					break;
				defualt:
					console.warn("Ranking :: worst 해당 타입으로 랭킹을 매길수 없습니다.",this.RankingType);
					return undefined;
					break;
			}
		}
	}
},function(defualt,nothing){
	if(typeof firstValue == "undefined"){
		this.Source         = defualt;
		this.RankingNothing = nothing;
		this.RankingType    = "boolean";
	} else {
		this.Source         = defualt;
		this.RankingNothing = nothing;
		this.RankingType    = typeof defualt;
	}
});


//******************
//Type
makeModule("Type",{
	isThis       : function ( ) { switch(typeof this.Source){case"object":if(this.isNull())return"null";if(this.isElement())return"element";if(this.isJquery())return"jquery";if(this.isArray())return"array";default:return typeof this.Source;}},
	isUndefined  : function (tb,fb) {return this.is((typeof this.Source == "undefined") ,tb,fb);},
	isDefined    : function (tb,fb) {return this.is((typeof this.Source !== "undefined"),tb,fb);},
	isNull       : function (tb,fb) {return this.is(this.Source === null?true:false      ,tb,fb);},
	isNil        : function (tb,fb) {return this.is(this.Source ==  null?true:(typeof this.Source == "undefined")?true:false,tb,fb);},
	isFunction   : function (tb,fb) {return this.is((typeof this.Source == "function")  ,tb,fb);},
	isBoolean    : function (tb,fb) {return this.is((typeof this.Source == "boolean")   ,tb,fb);},
	isObject     : function (tb,fb) {return this.is((typeof this.Source == "object")    ,tb,fb);},
	isString     : function (tb,fb) {return this.is((typeof this.Source == "string")    ,tb,fb);},
	isNumber     : function (tb,fb) {return this.is((typeof this.Source == "number")    ,tb,fb);},
	isText       : function (tb,fb) {return this.is((typeof this.Source == "string" || typeof this.Source == "number"),tb,fb);},
	isNumberText : function (tb,fb) {
		return this.is(_Number(this.Source).isANumber(),tb,fb);},
	isTextNumber : function (tb,fb) { 
		var numberValue = _Number(this.Source).getNumberText();
		if(numberValue == "") numberValue = undefined;
		return this.is(!isNaN(numberValue),tb,fb);
	},
	isElement      : function (tb,fb) {return this.is(W.ISELNODE       ,tb,fb);},
	isJquery       : function (tb,fb) {return this.is(W.ISJQUERY       ,tb,fb);},
	isArray        : function (tb,fb) {return this.is(W.ISARRAY        ,tb,fb);},
	isUnderBrowser : function (tb,fb) {return this.is(W.ISUNDERBROWSER ,tb,fb);},
	isNothing      : function (tb,fb) {return this.is(W.ISNOTHING      ,tb,fb);},
	isEnough       : function (tb,fb) {return this.un(W.ISNOTHING      ,tb,fb);},
	isPhoneNumber  : function (tb,fb) {return this.isText() ? /\d{6,11}/.test( _Number(this.Source).getNumberText() ) : false;  },
	isEmail        : function (tb,fb) {return this.isText() ? /^[\w]+\@[\w]+\.[\.\w]+/.test(this.Source) : false;  },
	isAscii        : function (tb,fb) {return this.isText() ? /^[\x00-\x7F]*$/.test(this.Source) : false;  },
	__rInfo:function(info,result,caseResult){
		var flag = undefined;
		if(typeof result == "boolean" && caseResult == undefined) flag = result;
		if(typeof result == "boolean" && typeof caseResult == "boolean") flag = caseResult && result;
		if(info == true){
			return { "type":result,"condition":caseResult,"success":flag };
		} else {
			return flag;
		}
	},
	__validateSize:function(option,value,info,optimizer,sizeType){
		var size;
		var switchValue = typeof sizeType == "string" ? sizeType : typeof this.Source;
		switch( switchValue ){
			case "numberText" :
				size = _Number(this.Source).number();
				break;
			case "number" :
				size = parseInt(this.Source);
				break;
			case "object" : 
				if( this.isArray() == false ){
					size = 0;
					for(var key in this.Source) size ++;
				}
				break;
			case "textNumber" : case "text" : case "email" : case "ascii" :
				size = optimizer == true ? (this.Source + "").trim().length : (this.Source + "").length;
				break;
			case "string" : //or array
				size = optimizer == true ? this.Source.trim().length : this.Source.length;
				break;
			default :
				return this.__rInfo(info,false,undefined);
				break;
		}
		switch(option){
			case ">": try { 
				return size > parseInt(value); 
			} catch(e) { return this.__rInfo(info,true,false); }
				break;
			case "<": try { 
				return size < parseInt(value); 
			} catch(e) { return this.__rInfo(info,true,false); }
				break;
			case "=":case "==": try { 
				return size == parseInt(value); 
			} catch(e) { return this.__rInfo(info,true,false); }
				break;
			default : console.log("Type::validateRule::size::치명적인 오류 => 허용하지 않는 option =>",option);
				break;
		}
		return this.__rInfo(info,false,false);
	},
	__validateInterface:function(valType,option,value,info,optimizer){
		var result;
		switch(valType){
			case "string"    : result = this.isString(); break;
			case "number"    : result = this.isNumber(); break;
			case "numberText": result = this.isNumberText(); break;
			case "textNumber": result = this.isTextNumber(); break;
			case "text"      : result = this.isText(); break;
			case "array"     : result = this.isArray(); break;
			case "object"    : result = this.isObject(); break;
			case "email"     : result = this.isEmail(); break;
			case "ascii"     : result = this.isAscii(); break;
		}
		if(option.length > 0 && value.length > 0) {
			if(result == false) return this.__rInfo(info,false,false);
			switch(option){
				case ">": case "<": case "=": case "==":
					var caseResult = this.__validateSize.call(this,option,value,info,optimizer,valType);
					return this.__rInfo(info,result,caseResult);
					break;
				case ":":
					switch(valType){
						case "string":
						case "numberText":
						case "text":
							if( valType=="string" && result == true){
								var text = optimizer == true ? this.Source.trim() : this.Source;
								if(value == "able"){
									return this.__rInfo(info,result, text.length > 0 );
								} else if(value=="unable") {
									return this.__rInfo(info,result, text.length < 1 );
								} else {
									console.log("string::",value,"토큰을 알수가 없군요");
								}
							}
							
							break;
						case "textNumber":
							if( result == true ){
								var numberValue = _Number(this.Source).getNumberText();
								var text = optimizer == true ? (this.Source + "").trim() : this.Source + "";
								if(value == "zero"){
									return this.__rInfo(info,result, numberValue == 0 );
								} else if(value == "able"){
									return this.__rInfo(info,result, numberValue > 0 );
								} else if(value=="unable") {
									return this.__rInfo(info,result, numberValue < 1 );
								} else {
									console.log("numberText::",value,"토큰을 알수가 없군요");
								}
							}
							break;
						case "object":
						case "email":
						case "ascii":
							result = false;
							break;
					}
				default:
					break;
			}
		}
		return this.__rInfo(info,result);
	},
	//is 의 string이 들어갈경우 처리
	validateRule:{
		"string"     : function(option,value,info,optimizer){ return this.__validateInterface("string",option,value,info,optimizer); },
		"number"     : function(option,value,info,optimizer){ return this.__validateInterface("number",option,value,info,optimizer); },
		"numberText" : function(option,value,info,optimizer){ return this.__validateInterface("numberText",option,value,info,optimizer); },
		"textNumber" : function(option,value,info,optimizer){ return this.__validateInterface("textNumber",option,value,info,optimizer); },
		"text"       : function(option,value,info,optimizer){ return this.__validateInterface("text",option,value,info,optimizer); },
		"array"      : function(option,value,info,optimizer){ return this.__validateInterface("array",option,value,info,optimizer); },
		"object"     : function(option,value,info,optimizer){ return this.__validateInterface("object",option,value,info,optimizer); },
		"email"      : function(option,value,info,optimizer){ return this.__validateInterface("email",option,value,info,optimizer); },
		"ascii"      : function(option,value,info,optimizer){ return this.__validateInterface("ascii",option,value,info,optimizer); },
		"phoneNumber": function(a,b,c,o){ return this.__rInfo(c,this.isPhoneNumber());},
		"undefined"  : function(a,b,c,o){ return this.__rInfo(c,this.isUndefined());  },
		"null"       : function(a,b,c,o){ return this.__rInfo(c,this.isNull());       },
		"nil"        : function(a,b,c,o){ return this.__rInfo(c,this.isNil());        },
		"defined"    : function(a,b,c,o){ return this.__rInfo(c,this.isDefined());    },
		"nothing"    : function(a,b,c,o){ return this.__rInfo(c,this.isNothing(undefined,undefined,o));},
		"enough"     : function(a,b,c,o){ return this.__rInfo(c,this.isEnough(undefined,undefined,o)); },
		"meaning"    : function(a,b,c,o){ return this.__rInfo(c,this.isEnough(undefined,undefined,o)); },
		"usefull"    : function(a,b,c,o){ return this.__rInfo(c,this.isEnough(undefined,undefined,o)); },
		"true"       : function(){ return true;  },
		"false"      : function(){ return false; }
	},
	is:function(testf,tB,fB,optimizer,info){
		var test = testf;
		switch(typeof test){
			case "function":
				test = test(this.Source);
				break;
			case "string" :
				var model = test.trim().split(" ");
				var validateResults = model.length == 0 ? [this.__rInfo(info,undefined)] : [];
		
				for (var i=0,l=model.length;i<l;i++) {
					var param = /(\w*)([\>\<\=\:]{0,2})([\S]*)/.exec(model[i]);
					//validation이 존재하는지 확인
					if(param[1] in this.validateRule){
						validateResults.push( this.validateRule[param[1]].call(this,param[2],param[3],info,optimizer) );
					}
				}
				if(info == true){
					var rank = _Ranking({"type":true,"condition":true,"success":true},{"type":undefined,"condition":undefined,"success":undefined});
					return rank.worst(validateResults);
				} else {
					var rank = _Ranking(true,undefined);
					test = rank.worst(validateResults);
				}
				break;
			case "object" :
				if((test instanceof RegExp) && (typeof this.Source == "string" || typeof this.Source == "number")){
					test = test.test(this.Source+"");
				} else {
					test = false;
				}
				break;
		}
		if(test === true){
			return (typeof tB === "function") ? tB.call(this,this.Source) : (typeof tB !== "undefined") ? tB : true;
		} else if(test === false){
			return (typeof fB === "function") ? fB.call(this,this.Source) : (typeof tB !== "undefined") ? fB : false;
		} else {
			console.error("Type::is::error test 값이 올바르지 않습니다. =>",testf,"  source =>",this.Source);
			return undefined;
		}
	},
	un:function(test,fB,tB,optimizer){
		tB = typeof tB == "undefined" ? true  : tB;
		fB = typeof fB == "undefined" ? false : fB;
		return this.is(test,fB,tB,optimizer);
	},
	info:function(test,optimizer){ return this.is(test,undefined,undefined,optimizer,true); },
	//optimizer됨
	as:function(test,tB,fB,info){ return this.is(test,tB,fB,true,info); },
	asInfo:function(test,tB,fB,info){ return this.is(test,tB,fB,true,true); },
	isInstance : function(o){
		if (this.isObject()) if ( this.Source.__NativeHistroy__ ) {
			if(typeof o == "undefined") return true;
			for(var i=0, length = this.Source.__NativeHistroy__.length; i < length; i++) if( this.Source.__NativeHistroy__[i] == o) return true;
		}
		return false;
	}
});


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


//피드가능한 노드오브젝트 인터페이스
makeModule("FeedNode",{
	//최상위 노드에게 메서드 호출
	feedFromTop:function(f,d){ d=(typeof d === "number")?d++:0; if(this.NodeParent) return this.NodeParent.feedToTop(f,d); return f.call(this,d); },
	//아래부터 현재까지 메서드 호출
	feedup:function(ff,depth,infinityTop){
		depth = (typeof depth === "undefined" ? 0 : depth ); 
		if(depth == infinityTop) return undefined;
		var feedData = [];
		this.NodeChildrens.each(function(feednode){
			var feed = feednode.feedup.call(feednode,ff,depth + 1,infinityTop);
			if(typeof feed !== undefined) feedData.push(feed);	
		});
		return ff.call(this,feedData,depth);
	},
	//현재부터 아래로 호출
	feeddown:function(ff,cutIndex,depth,feedData){
		depth = (typeof depth === "undefined" ? 0 : depth ); 
		var feedData = [];
		if(depth == cutIndex) return undefined;
		this.NodeChildrens.each(function(feednode){
			var feed = feednode.feeddown.call(feednode,ff,cutIndex,depth + 1);
			if(typeof feed !== undefined) feedData.push(feed);
		});
		return ff.call(this,feedData,depth);
	},
	injectNode:function(){ return AArray.prototype.inject.apply(new AArray(this.NodeChildrens),Array.prototype.slice.call(arguments)); },
	isEqualNode:function(obj){ return (obj instanceof this.constructor); },
	getChildNodes:function(){ return this.NodeChildrens.clone(); },
	removeChildNode:function(obj){ return this.NodeChildrens.remove(obj); },
	addChildNode:function(obj,n){
		if(this.isEqualNode(obj)){ this.NodeChildrens.push(obj,n); obj.setParentNode(this,false); return true; } 
		console.error("NodeInterface error #1",obj); return false;
	},
	setParentNode:function(obj,n){
		if(n == false) {
			this.NodeParent = obj;
			return true;
		} else {
			if(this.isEqualNode(obj)){
				if(this.NodeParent) this.NodeParent.removeChildNode(this);
				this.NodeParent = obj;
				this.NodeParent.addChildNode(this);
			}
		}
	},
	getParentNode:function(){ return this.NodeParent; },
	getTopNode:function(){ var topNode; this.feedFromTop(function(){ topNode = this; }); return topNode; }
},function(){
	this.NodeChildrens = _Object();
	this.NodeParent    = undefined;
});

extendModule("FeedNode","ViewController",{
		//override tree interface
		setTreeParent:function(p){ if(this._super(p)){ this.parentViewController = p; return true; } return false; },
		//debuging
		trace:function(){
			console.log(":: ViewController :: trace :: start");
			console.log(":",this.Parent,"::parent::");
			this.Childrens.each(function(o,k){
				console.log(":",k,"  => ",o);
			});
			console.log(":: ViewController :: trace :: end");
		},
		// view controller
		// controller gs
		addChildViewController:function(context,property,viewStatus){
			var nvc     = new ViewController(context,property,viewStatus,this);
			var nvcName = PASCAL(ELTRACE(nvc.view,"id"));
			this.addChildNode(nvc,nvcName);
			return nvc;
		},
		getChildViewController:function(s){ 
			return this.NodeChildrens.Source[s];
		},
		hasChildViewController:function(s){ return s in this.NodeChildrens.Source; },		
		// view controller
		// status
		//이 값은 status가 순간적으로 바뀔때에만 구할수 있습니다.
		getPreviousStatus:function(){ return this.PreviousViewStatus; },
		//상환관련
		getStatus:function(status){
			if( typeof status === "string" || typeof status === "number" ){
				return this.CurrentViewStatus == status;
			} else {
				return this.CurrentViewStatus;
			}
		},
		setStatus:function(setStatus){
			this.CurrentViewStatus = status;
		},
		isStatus:function(statusName){ 
			var inspects = TOARRAY(statusName," ");
			for(var i=0,l=inspects.length;i<l;i++) if(this.CurrentViewStatus == statusName) return true;
			return false;
		},
		notStatus:function(statusName){ return !this.isStatus(statusName); },
		frameStatusSetter:function(setStatus,forced,touched){
			if(typeof setStatus === "string" || typeof setStatus === "number"){
				if( IS(setStatus,"text>0") ) {
					if(typeof setStatus === "string") setStatus = setStatus.trim();
					if(forced || this.CurrentViewStatus !== setStatus){
						if(setStatus in this.ViewStatus){
							if(typeof this.ViewStatus[setStatus] === "function"){
								this.PreviousViewStatus = this.CurrentViewStatus;
								this.CurrentViewStatus  = setStatus;
								var result               = this.ViewStatus[setStatus].apply(this,_Array(arguments).subarr(3).toArray());
								this.PreviousViewStatus = undefined;
								return result;
							} else {
								if(!touched) console.warn("FrameController::frameStatusSetter:: 처음 정의의 다음의 status가 반드시 함수로 정의되어야 합니다. =>",setStatus);
							}
						} else {
							if(!touched) console.warn("FrameController::frameStatusSetter:: 정의되지 않은 status를 호출하였습니다.",setStatus,this.ViewStatus);
						}
					}
				} else {
					if(!touched) console.warn("FrameController::frameStatusSetter:: status값이 올바르지 않습니다. (문자형 필요)",setStatus);
				}
			} else {
				console.warn("FrameController::frameStatusSetter:: 불러올 status값은 숫자나 문자여야 합니다. 올바르지 않습니다.",setStatus);
			}
			if(typeof setStatus === "string" || typeof setStatus === "number"){
				if(typeof setStatus === "string") setStatus = setStatus.trim();
				if( AS(setStatus,"text>0") ) if(setStatus in this.ViewStatus) if(typeof this.ViewStatus[setStatus] === "function") {
					var result = this.ViewStatus[setStatus].apply(this,_Array(arguments).subarr(1).toArray());
					this.CurrentViewStatus = setStatus;
					return result;
				}
			}
		},
		// 불러운 내용도 다시 불러온다 // 내용을 부른다 // 내용을 부를때 에러가 나도 표시하지 않는다
		loadChildStatus:function(){
			var args = Array.prototype.slice.call(arguments);
			this.NodeChildrens.each(function(frame){ frame.setupStatus.apply(frame,args); });
			return this;
		},
		touchChildStatus:function(){
			var args = Array.prototype.slice.call(arguments);
			this.NodeChildrens.each(function(frame){ frame.touchStatus.apply(frame,args); });
			return this;
		},
		//칠드런까지 함께 설정한다.
		setupStatus:function() { 
			var args = Array.prototype.slice.call(arguments);
			var statusValue = args.shift();
			args.unshift(statusValue,true,true);
			this.frameStatusSetter.apply(this,args);
			this.loadChildStatus.apply(this,Array.prototype.slice.call(arguments));
			return 
		},
		loadStatus :function() { 
			var args = Array.prototype.slice.call(arguments);
			var statusValue = args.shift();
			args.unshift(statusValue,true,false);
			return this.frameStatusSetter.apply(this,args); 
		},
		status     :function() { 
			var args = Array.prototype.slice.call(arguments);
			var statusValue = args.shift();
			args.unshift(statusValue,false,false);
			return this.frameStatusSetter.apply(this,args); 
		},
		touchStatus:function() { 
			var args = Array.prototype.slice.call(arguments);
			var statusValue = args.shift();
			args.unshift(statusValue,false,true);
			return this.frameStatusSetter.apply(this,args); 
		},
		syncStatusWith:function(moduleName){
			var module = this.parentViewController.get(moduleName);
			if(module) {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				args.unshift(this.getStatus());
				return module.setupStatus.apply(module,args);
			} else {
				console.error("ViewController::syncStatusWith 동기화할 대상을 찾을수 없습니다. => ",moduleName);
			}
		},
		//w is wrapper (function)
		find      : function(s,w) { return FIND(s,       this.ControllerElement, w); },
		findClass : function(s,w) { return this.find("."+s.split(" ").join("."), w); },
		findName  : function(s,w) { return this.find("[name="+s+"]",             w); },
		findId    : function(s,w) { return this.find("#"+s,                      w); },
		parentFind: function(s,w) { var p = this.getTreeParent();    if(!p){ console.warn("부모가 존재하지 않습니다"); return this.find(s,w); } else { return p.find(s,w) } },
		topFind   : function(s,w) { var p = this.getTreeTopParent(); if(!p){ console.warn("부모가 존재하지 않습니다"); return this.find(s,w); } else { return p.find(s,w) } },
		//control view
		form      : function(a,b){ return new Form(this.ControllerElement,a,b); },
		controls  : function(a)  { return new Controls(a,this.ControllerElement); },
		// view controller
		// default Data
		//default Data가 있는지 확인
		hasDefaultData:function(name){
			name = (typeof name === "string" || typeof name === "number") ? name  : "defualtData" ;
			return (typeof this.DefaultDataModels[name] === "undefined") ? false : true ;
		},
		setDefaultDataWithName:function(data,name){
			if(typeof name === "string" || typeof name === "number"){
				this.DefaultDataModels[name] = data;
			} else {
				console.warn("FrameController::setDefaultDataWithName 두번째 파라메터값은 반드시 String이나 Number이여야 합니다. param => ",data,name);
			}
		},
		getDefaultDataList:function(){ return CLONE(this.DefaultDataModels); },
		getDefaultData:function(index){
			if( typeof index === "undefined") {
				//아무거나 나옴
				if("defualtData" in this.DefaultDataModels) return CLONE(this.DefaultDataModels[key]);
				for(var key in this.DefaultDataModels) return CLONE(this.DefaultDataModels[key]);
			} else {
				return CLONE(this.DefaultDataModels[index]);
			}
		},
		//
		setControllerData:function(data){
			this.FrameControllerHasData = data;
			return this.FrameControllerHasData;
		},
		getControllerData:function(key){
			if( typeof key === "undefined" ){
				return this.FrameControllerHasData;
			} else {
				if(typeof this.FrameControllerHasData === "object"){
					return this.FrameControllerHasData[key];
				}
			}
		},
		removeControllerData :function(){
			delete this["FrameControllerHasData"];
			return this;
		},
		//
		hasControllerData :function(){ return (typeof this.FrameControllerHasData !== "undefined") },
		//
		setParentControllerData:function(data){
			var pn = this.getParentNode();
			if(pn) return pn.setControllerData(data);
			console.warn("ViewController :: setParentControllerData :: 부모객체가 없는데 호출하였습니다.",this,data);
		},
		getParentControllerData:function(key){
			var pn = this.getParentNode();
			if(pn) return pn.getControllerData();
			console.warn("ViewController :: getParentControllerData :: 부모객체가 없는데 호출하였습니다.",this,key);
		},
		removeParentControllerData:function(){
			var pn = this.getParentNode();
			if(pn) { pn.removeControllerData(); } else { console.warn("ViewController :: removeParentControllerData :: 부모객체가 없는데 호출하였습니다.",this); }
			return this;
		},
		hasParentControllerData:function(){
			var pn = this.getParentNode();
			if(pn) { return pn.hasControllerData(); } 
			console.warn("ViewController :: hasParentControllerData :: 부모객체가 없는데 호출하였습니다.",this);
		},
		//model controller
		modelOfControllerData:function(){ if( this.hasControllerData () == true) return _Model(this.FrameControllerHasData); },
		modelOfControllerView:function(){ if( typeof this.ControllerElement !== "undefined") return _Model(this.ControllerElement); },
		//
		updateControllerDataFilter:function(f) { this.FrameControllerUpdateDataFilter = f; return this; },
		exportsControllerDataFilter:function(f){ this.FrameControllerExportsDataFilter = f; return this; },
		//뷰에 있는 데이터를 데이터 모델로 가져옵니다.
		updateControllerData:function(overwrite){
			var d = this.modelOfControllerView().data()
			if (typeof this.FrameControllerUpdateDataFilter === "function") d = this.FrameControllerUpdateDataFilter(d);
		
			if( this.hasControllerData () == false || overwrite == true){
				this.setControllerData(d);
			} else {
				if(typeof this.FrameControllerHasData === "object"){
					_Object(this.FrameControllerHasData).concat(d);
				} else {
					console.error("FrameController::다음 데이터에 updateControllerData를 실행 할 수 없습니다.",this.FrameControllerHasData);
				}
			}
			if(typeof overwrite === "function"){
				return overwrite(this.getControllerData());
			} else {
				return this.getControllerData();
			}
		},
		//데이터 모델을 뷰로 뿌려줍니다.
		exportsControllerData:function(){
			if( this.hasControllerData () == true ){
				var d = this.getControllerData();
				if (typeof this.FrameControllerExportsDataFilter === "function") d = this.FrameControllerExportsDataFilter(d);
				_Model(d).exports(this.ControllerElement);
			} else {
				console.warn("프레임 데이터가 존재하지 않아 뷰로 적용되지 못하였습니다.");
			}
		},
		getMemberController:function(s){
			var pn = this.getParentNode();
			if(pn && (typeof s === "string" || typeof s === "number")){
				if("get" in pn){
					return pn.get(s);
				} else {
					console.warn("ViewController :: getMemberController :: parentViewController이 올바르지 않습니다. get이 존재하지 않음");
				}
			} else {
				console.warn("ViewController :: getMemberController :: FrameController의 parentViewController이 존재하지 않거나 파라메터가 올바르지 않습니다. (parentViewController,param)",this.parentViewController,s);
			}
		}
	},function(context,property,viewStatus,parentViewController){
		this._super();
		// view context
		var c = ZFIND(context);
		if( ISELNODE(c) == false ) console.error("FrameController::context => 현재 Context안에 해당 영역을 찾지 못했습니다. \ncontext는 고정적인 element에 지정하는것이 좋습니다. params =>",context,property,viewStatus);
		this.ControllerElement = c;
		this.view              = c;

		//status data
		this.ViewStatus   = CLONE(TOOBJECT(viewStatus));
		this.CurrentViewStatus = undefined;
	
		//attribute & default data
		property = CLONE(TOOBJECT(property,"init"));
		this.DefaultDataModels = {};
		for(var key in property) {
			var keySign = /([\#]+|)(.*)/.exec(key);
			if(keySign[1] == ""){
				if(key in this){
					console.warn("FrameController:: error key => "+ key +" 추가 하려는 '메서드'는 이미 존재하는 메서드입니다. 추가할수 없습니다.");
				} else {
					this[key] = property[key];
				}
			} else {
				if(keySign[2] in this.DefaultDataModels){
					console.warn("FrameController:: error key => "+ key +" 추가 하려는 '기본 데이터'는 이미 존재하는 메서드입니다. 추가할수 없습니다.");
				} else {
					this.DefaultDataModels[keySign[2]] = CLONE(property[key]);
				}
			}
		}
		//parent
		this.setTreeParent(parentViewController);
	
		//init
		if( ("init" in this) && (typeof this.init === "function") ){
			this.init.call(this,this,c,this.parentViewController);
			delete this["init"];
		}
	},function(s){
		return this.getChildViewController(s);
	}
);