//Nody CoreFoundation
(+(function(W,NativeCore){
	var version = "0.1.2";
	// Author                 // hojung ahn (open9.net)
	// Concept                // DHTML RAD TOOL
	// tested in              // IE9 + (on 4.0) & webkit2 & air13
	// lincense               // MIT lincense
	if(typeof W.nody !== "undefined"){ W.nodyLoadException = true; throw new Error("already loaded ATYPE core loadded => " + W.nody + " current => " + version); return ; } else { W.nody = version; }
	//CONSOLE FIX
	if (typeof W.console !== "object"){W.console = {};} 'log info warn error count assert dir clear profile profileEnd"'.replace(/\S+/g,function(n){ 
		if(!(n in W.console)){W.console[n] = function(){
			if(typeof air == "object")if("trace" in air){
				var args = Array.prototype.slice.call(arguments);
				var traces = [];
				for(var i=0,l=args.length;i<l;i++){
					switch(typeof args[i]){
						case "string":case "number":
							traces.push(args[i]);
							break;
						case "boolean":
							traces.push(args[i]?"true":"false");
							break;
						default:
							traces.push(TOSTRING(args[i]));
							break;
					}
					
				}
				air.trace( traces.join(", ") ); 
			}
		};} 
	});
	//Bench Mark
	var MARKO = {};W.MARK = function(name){ if(typeof name == "string" || typeof name == "number") { name = name+""; if(typeof MARKO[name] == "number") { console.info("MARK::"+name+" => "+ (+new Date() - MARKO[name])); delete MARKO[name]; } else { console.info("MARK START::"+name); MARKO[name] = +new Date(); } } };
	//IE8 TRIM FIX
	if(!String.prototype.trim) String.prototype.trim = function() { return this.replace(/(^\s*)|(\s*$)/gi, "");TOS };
	//IE7 JSON FIX
	var __aJSONCount__ = "JSON" in W ? 1 : 0; 
	W.aJSON = {
		 "parse"     : function (jtext) { 
			if(__aJSONCount__ < 1){ __aJSONCount__++; console.info("현재 사용하고 있는 환경에서는 JSON이 내장되지 않아 nody의 오브젝트 해석기가 사용됩니다. 본 해석기는 완전히 JSON.stringify와 똑같이 작동되지 않습니다."); }
			 var result;
			 try { result = eval('(' + jtext + ')'); } catch(e) { result = OBJECT(jtext); }
			 return result;
		 },
		 "stringify" : function (obj)   {
			if(__aJSONCount__ < 1){ __aJSONCount__++; console.info("현재 사용하고 있는 환경에서는 JSON이 내장되지 않아 nody의 오브젝트 해석기가 사용됩니다. 본 해석기는 완전히 JSON.stringify와 똑같이 작동되지 않습니다."); }
			return W.TOSTRING(obj,Number.POSITIVE_INFINITY,true);
 		}
	};
	if(typeof W.JSON == "undefined"){W.JSON = aJSON;};
	//IE8 Success FIX
	if (typeof W.success == "function"){W.success = "success";};
	//IE8 function bind FIX
	if (!Function.prototype.bind) { Function.prototype.bind = function (oThis) { if (typeof this !== "function") { /* closest thing possible to the ECMAScript 5 internal IsCallable function */ throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable"); } var aArgs = Array.prototype.slice.call(arguments,1), fToBind = this, fNOP = function () {}, fBound = function () { return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments))); }; fNOP.prototype = this.prototype; fBound.prototype = new fNOP(); return fBound; }; }
	
	//NativeCore console trace
	W.NativeTrace = function(){ return TOSTRING(NativeCore); };
	//NativeCore Start
	var NativeFactoryObject = function(type,name,sm,gm){
		if( !(name in NativeCore.Modules) ){
			var nativeProto,setter,getter;
			switch(type){
				case "object":
					nativeProto = {};
					setter      = typeof sm == "function" ? function(v){  sm.apply(this,Array.prototype.slice.call(arguments)); return this; } : function(v){ this.Source = v; return this; };
					getter      = gm?gm:function(){return this.Source;};
					break;
				case "array":
					nativeProto = [];
					setter      = typeof sm == "function" ? sm : function(v){ return this.replace(v); };
					getter      = function(){ return this.toArray.apply(this,arguments); };
					break;
				
				default:
					throw new Error("NativeFactoryObject :: 옳지않은 타입이 이니셜라이징 되고 있습니다. => " + type)
					break;	
			}
			var nativeConstructor = function(){ if(typeof this.set == "function"){ this.set.apply(this,Array.prototype.slice.apply(arguments)); } };
			NativeCore.Modules[name]               = nativeConstructor;
			NativeCore.Modules[name].prototype     = nativeProto;
			NativeCore.Modules[name].prototype.set = setter;
			NativeCore.Modules[name].prototype.get = getter;
			//native concept
			NativeCore.Modules[name].prototype.__NativeType__        = type;
			NativeCore.Modules[name].prototype.__NativeHistroy__     = [name];
			NativeCore.Modules[name].prototype.__NativeClass__       = function(n){ return this.__NativeHistroy__[this.__NativeHistroy__.length - 1] == n };
			//
			NativeCore.Modules[name].prototype.constructor = nativeConstructor;
			NativeCore.Modules[name].prototype._super = function(){
				//scope start
				var currentScopeDepth,currentScopeModuleName,currentScopePrototype,currentMethodName,currentCallMethod=arguments.callee.caller,superScope = 0;
				for(scopeMax=this.__NativeHistroy__.length;superScope<scopeMax;superScope++){
					currentScopeDepth       = (this.__NativeHistroy__.length - 1) - superScope ;
					currentScopeModuleName  = this.__NativeHistroy__[currentScopeDepth];
					currentScopePrototype = NativeCore.Modules[currentScopeModuleName].prototype.constructor.prototype;
					currentMethodName;
					for(var key in currentScopePrototype){
						if(key !== "_super" && currentScopePrototype[key] == currentCallMethod){
							currentMethodName = key;
							break;
						}
					}
					if(typeof currentMethodName !== "undefined"){ break; }
				}
				if(typeof currentMethodName == "undefined"){
					console.error("NodyNativeCore::_super::해당 함수에 그러한 프로토타입이 존재하지 않습니다.",currentCallMethod);
					return undefined;
				}
				//next scope
				var i=0,result=undefined;
				for(var i=0,l=currentScopeDepth;i<l;i++){
					var nextScopeDepth       = this.__NativeHistroy__.length - superScope - 2;
					var nextScopeName        = this.constructor.prototype.__NativeHistroy__[nextScopeDepth];
					var nextScopeConstructor = NativeCore.Modules[nextScopeName];
					var nextScopePrototype   = nextScopeConstructor.prototype;
					var nextSuperMethod      = nextScopeConstructor.prototype[currentMethodName];
					superScope++;
					if(typeof nextSuperMethod == "function"){
						if(currentCallMethod !== nextSuperMethod){
							result = nextSuperMethod.apply(this,Array.prototype.slice.call(arguments));
							break;
						}
					} else {
						break;
					}
				}
				return result;
			};
			return true;
		} else {
			console.error("NodyNativeCore :: already exsist module =>",name);
			return false;
		}
	};
	var NativeFactoryExtend = function(name,methods,setflag,getflag){
		if( (typeof methods == "object") && (name in NativeCore.Modules)){
			var protoObject = NativeCore.Modules[name].prototype;
			if(typeof setflag == "function"){ methods.set = setflag; setflag = true; }
			if(typeof getflag == "function"){ methods.get = getflag; getflag = true; }
			for(var key in methods){ switch(key){
				case "constructor":case "_super":
					break;
				case "__NativeHistroy__":
					protoObject[key] = Array.prototype.slice.call(methods[key]);
					break;
				case "set": if(setflag == true) protoObject[key] = methods[key]; break;
				case "get": if(getflag == true) protoObject[key] = methods[key]; break;
				default   : protoObject[key] = methods[key]; break;
			} }
			return true;
		} else {
			//no exsist prototype object
			return false;
		}
	};
	var NativeFactoryDeploy = function(name){
		if(name in NativeCore.Modules) {
			//shortcutConstructor\
			W["_"+name] = function(){
				var scArgs = Array.prototype.slice.call(arguments);
				scArgs.unshift(NativeCore.Modules[name]);
				return new (Function.prototype.bind.apply(NativeCore.Modules[name],scArgs)); 
			};
			NativeCore.Modules[name].prototype.__GlobalConstructor__ = window["_"+name];
			//newConstructor
			W[ (/^(Object|Array|String|Number)$/.test(name) ? "A"+name : name) ] = NativeCore.Modules[name];
		}
	}
	W.makeModule = function(name,proto,setter,getter){
		if(NativeFactoryObject("object",name)){
			NativeFactoryExtend(name,proto,setter,getter);
			NativeFactoryDeploy(name);
		}
	};
	W.makeArrayModule = function(name,proto,setter,getter){
		if(NativeFactoryObject("array",name)){
			NativeFactoryExtend(name,proto,setter,getter);
			NativeFactoryDeploy(name);
		}
	};
	W.extendModule = function(parentName,name,methods,setter,getter){
		var parentConstructor = NativeCore.Modules[parentName];
		if(typeof parentConstructor == "undefined"){
			throw new Error("확장할 behavior ("+parentName+")가 없습니다"+TOSTRING(NativeCore.Modules));
			return false;
		}
		
		//새 오브젝트 만들기
		if(NativeFactoryObject(parentConstructor.prototype.__NativeType__,name)){
			var extendConstructor = NativeCore.Modules[name];
			NativeFactoryExtend(name,parentConstructor.prototype,true,true);
			NativeFactoryExtend(name,methods,setter,getter);
			extendConstructor.prototype["__NativeHistroy__"].push(name);
			// 비헤이비어 만들기
			NativeFactoryDeploy(name);
		}
	};
	//Getter:Core
	W.makeGetter    = function(n,m){ var name=n.toUpperCase(); W[name]=m; NativeCore.Getters.push(name); };
	//Kit:Core
	W.makeSingleton = function(n,m,i){var o=i?i:function(){};o.prototype=m;o.prototype.constructor=o;o.prototype.toGetter=function(){
		for(var k in o.prototype) switch(k){
			case "toGetter":case "constructor":break;
			default: W.makeGetter(k,o.prototype[k]); break;
		}
	};W[n]=new o();NativeCore.Singletons[n]=W[n];};
	W.makeGetters   = function(o){ if(typeof o == "obwiject") for(var k in o) W.makeGetter(k,o[k]); };
})(window,{
	Getters:[],
	Singletons:{},
	Modules:{}
}));
//Nody Foundation
(+(function(W){
	if(W.nodyLoadException==true){ throw new Error("Nody Process Foundation init cancled"); return;}
	W.makeSingleton("AFoundationUtility",{
		"CONTINUTILITY":function(func,over,owner){
			return function(){
				var args = Array.prototype.slice.apply(arguments);
				for(var i=NUMBER(over,1),l=args.length;i<l;i++) if(typeof args[i] == "function"){
					return args[i].apply(owner,[func.apply(owner,args.slice(0,i))].concat(args.slice(i+1,l))); 
					break;
				}
				return func.apply(owner,args);
			}
		}
	});
	AFoundationUtility.toGetter();
	
	W.makeSingleton("AFoundation",{
		"TOLENGTH":function(v,d){
			switch(typeof v){ case "number":return (v+"").length;break;case "string":return v.length;case "object":if("length" in v)return v.length;}
			return (typeof d=="undefined")?0:d;
		},
		"TONUMBER":function(v,d){
			switch(typeof v){ case "number":return v;case "string":var r=v*1;return isNaN(r)?0:r;break; }
			switch(typeof d){ case "number":return d;case "string":var r=d*1;return isNaN(r)?0:r;break; }
			return 0;
		},
		"TURNINDEX":function(index,maxIndex){ if(index < 0) { var abs = Math.abs(index); index = maxIndex-(abs>maxIndex?abs%maxIndex:abs); }; return (maxIndex > index)?index:index%maxIndex; },
		"RETURNINDEX":function(index,maxIndex){ return TONUMBER(maxIndex,TOLENGTH(index))-TURNINDEX(index,maxIndex)-1; },
		"TILE":function(v,l){
			var base;
			switch(typeof v){
				case "string":case "number": base = v; break;
				case "object":if(ISARRAY(v)) base = v; break;
			}
			if(typeof base == "undefined"){ return ; } else {
				var baseLength = TOLENGTH(v);
				var result,len = TONUMBER(l,baseLength);
				switch(typeof base){
					case "string": result=""; for(var i=0;i<len;i++)result+=v[TURNINDEX(i,baseLength)]; return result;
					case "number": 
						var vm = [];
						(v+"").replace(/\d/g,function(s){vm.join(s*1);});
						result=0 ; for(var i=0;i<len;i++)result+=vm[TURNINDEX(i,baseLength)]; return result;
						break;
				}
			}
		},
		"CLIP":function(s,l,e){
			if(typeof s!=="number")s=s+"";
			if(typeof s!=="string")return s;
			if(typeof l=="number"){return (s.length > l) ? s.substr(0,l) : "developed..."; } else { return s.trim(); }
		},
		"DEFAULT"   :function(v,d){ return typeof v !== "undefined" ? v : d; },
		"ISJQUERY"  :function(o){ return (typeof o == "object" && o !== null ) ? ("jquery" in o) ? true : false : false; },
		"ISARRAY"   :function(a){ return (typeof a == "object" || typeof a == "function") ? ( a !== null && ((a instanceof Array || a instanceof NodeList || ISJQUERY(a) || ( !isNaN(a.length) && isNaN(a.nodeType))) ) ? true : false) : false; },
		// 엘리먼트인지 확인
		"ISWINDOW"  :function(a){ if(typeof a == "object") return "navigator" in a; return false; },
		"ISDOCUMENT":function(a){ return typeof a == "object" ? a.nodeType == 9 ? true : false : false; },
		"ISELNODE"  :function(a){ if(a == null) return false; if(typeof a == "object") if(a.nodeType == 1 || ISDOCUMENT(a) ) return true; return false;},
		"HASELNODE" :function(a){ if( ISARRAY(a) ){ for(var i=0,l=a.length;i<l;i++) if(ISELNODE(a[i])) return true; return false; } else { return ISELNODE(a); } },
		"ISTEXTNODE":function(a){ if(a == null) return false; if(typeof a == "object") if(a.nodeType == 3 || a.nodeType == 8) return true; return false;},
		//배열형인지 검사 (jquery sizzle도 배열로 취급)
		"ISUNDERBROWSER":function(o){
			var v = o?o:9;
	        if (navigator.appVersion.indexOf("MSIE") != -1) return parseInt(v) > parseInt(navigator.appVersion.split("MSIE")[1]);
	        return false;
		},
		"ISTEXT" :function(v){ return (typeof v == "string" || typeof v == "number") ? true : false; },
		//배열이 아니면 배열로 만들어줌
		"TOARRAY":function(t,s){ if(typeof t=="undefined" && arguments.length < 2) return []; if(typeof t == "string" && typeof s == "string"){ return t.split(s); } else if(ISARRAY(t) == true) { return t; } else { return [t]; } },
		"MVARRAY":function(v) { var mvArray = []; if( ISARRAY(v) ) { if("toArray" in v){ Array.prototype.splice.apply(mvArray,v.toArray()); } else { for(var i=0,l=v.length;i<l;i++) mvArray.push(v[i]); } } else { if(v||v==0) mvArray.push(v); return this; } return mvArray; },
		"DATAUNIQUE" :function() {
			var value  = [];
			var result = [];
			for(var ai=0,li=arguments.length;ai<li;ai++){
				var mvArray = MVARRAY(arguments[ai]);
				for(var i=0,l=mvArray.length;i<l;i++){
					var unique = true;
					for(var i2=0,l2=result.length;i2<l2;i2++){
						if(mvArray[i] == result[i2]){
							unique = false;
							break;
						}
					}
					if(unique==true)result.push(mvArray[i]);
				}
			}
			return result;
		},
		//배열의 하나추출
		"ZERO"   :function(t){ return typeof t == "object" ? typeof t[0] == "undefined" ? undefined : t[0] : t; },
		//배열의 뒤
		"LAST"   :function(t){ return ISARRAY(t) ? t[t.length-1] : t; },
		//문자열로 넘김
		"TOSTRING":function(tosv,depth,jsonfy){
			if(typeof depth == "undefined") depth = 10;
			if(depth < 1) return "...";
			switch(typeof tosv){
				case "string" : return jsonfy==true ? '"' + (tosv+"") + '"' :tosv+""; break;
				case "number" : return (tosv+""); break;
				case "object" : 
					if(tosv==null){
						return jsonfy==true ? '"null"' : "null";
					} else if(ISELNODE(tosv)) {
						if(tosv == document) { return '"[document]"'; }
						//node3
						var tn = tosv.tagName.toLowerCase();
						var ti = _Type(tosv.id).isNothing(function(){
							return "";
						}, function(id){
							return "#"+id ;
						});
						var tc = _Type(tosv.className).isNothing(function(){
							return "";
						}, function(className){
							return "." + className.split(" ").join(".");
						});
						return jsonfy==true ? '"'+tn+ti+tc+'"' : tn+ti+tc; 
					} else if(ISTEXTNODE(tosv)) {
						return '#text '+tosv.textContent;
					} else if(ISARRAY(tosv)){
						//array
						var result = [];
						for(var i=0,l=tosv.length;i<l;i++) result.push(TOSTRING(tosv[i],depth-1,jsonfy));
						return "["+(jsonfy==true?result.join(","):result.join(", "))+"]";
					} else if(tosv.jquery){
						//jquery
						var result = _Array(tosv).map(function(o){ return _Lazy(o).tos(); }).join(", ");
						return jsonfy==true ? '"$['+result+']"' : "$["+result+"]";
					} else {
						//object
						var kv = [];
						for(var key in tosv) kv.push( (jsonfy==true ?  ('"' + key + '"') : key) + ":" + TOSTRING(tosv[key],depth-1,jsonfy)); 
						return "{"+(jsonfy==true?kv.join(","):kv.join(", "))+"}";
					}
					break;
				case "boolean"   : 
					if(jsonfy==true) return tosv ? '"true"' : '"false"';
					return tosv?"true":"false";
				case "undefined" : return jsonfy==true ? '"undefined"' : "undefined";
				default          : if("toString" in tosv){
					return jsonfy==true ? '"'+ tosv.toString() +'"' : tosv.toString();
				} else {
					return jsonfy==true ? '"[typeof ' + typeof tosv + ']"' : "[typeof " + typeof tosv + "]"; 
				}
				break;
			}
		},
		// 스트링 변환 (오브젝트의 경우 4단계 이하로 내려가지 않음)
		"TOS"  : function(tosv,jsonfy){ return TOSTRING(tosv,4,jsonfy); },
		"MAX"  : function(target,length,suffix){
			if(typeof target == "string"){
				length = isNaN(length) ? 100 : parseInt(length);
				suffix = typeof suffix == "string" ? suffix : "...";
				if( target.length > length ){
					return target.substr(0,length) + suffix;
				}
			}
			return target;
		},
		// 복사
		"MV"  : function(t) { 
			switch(typeof t){
				case "undefined":
				return t;
					break;
				case "number": return t+0; break;
				case "string": return t+"";break;
				case "object":
				if(t instanceof Date){var r=new Date();r.setTime(t.getTime());return r;}
				if(t instanceof Array){var r=[]; for(var i=0,length=t.length;i<length;i++)r[i]=t[i];return r;}
				if( ISELNODE(t) == true ) return t;
				if(t instanceof Object){var r={};for(var k in t)if(t.hasOwnProperty(k))r[k]=t[k];return r;}
				default :
					console.error("MV::copy failed : target => ",t);
					return t;
				break;
			}
		},
		"STRINGFUNCTION":function(j,ss){
			var r = [];
			for(var i=0,l=ss.length;i<l;i++){
				switch(typeof ss[i]){
					case "string": r.push(ss[i]); break;
					case "number": r.push(ss[i]+""); break;
					default: break;
				}
			}
			return r.join(j);
		},
		"STRING" :function(){ return STRINGFUNCTION("" ,Array.prototype.slice.apply(arguments));},
		"STRINGS":function(){ return STRINGFUNCTION(" ",Array.prototype.slice.apply(arguments));},
		"STRINGC":function(){ return STRINGFUNCTION(",",Array.prototype.slice.apply(arguments));},
		"NUMBERFUCTION":function(n,r,f){ if(!isNaN(n) && n !== "") return f(n); if(typeof r == "number") return r; return 0; },
		"INTEGER":function(n,r){ return NUMBERFUCTION(n,r,parseInt);   },
		"NUMBER" :function(n,r){ return NUMBERFUCTION(n,r,parseFloat); },
		
		//thread
		"THREAD":function(f,s) { var t = function(){ f.call(s); }; setTimeout(t,0); return t; },
		//wrap
		"ISWRAP":function(c,w){
			if(typeof c == "string"){
				c = c.trim();
				w = typeof w !== "undefined" ? TOARRAY(w) : ['""',"''","{}","[]"];
				for(var i=0,l=w.length;i<l;i++){
					var wf = w[i].substr(0,w[i].length-1);
					var we = w[i].substr(w[i].length-1);
					if(c.indexOf(wf)==0 && c.substr(c.length-1) == we) return true;
				}
			}
			return false;
		},
		"UNWRAP":function(c,w){
			if(typeof c == "string"){
				c = c.trim();
				w = typeof w !== "undefined" ? TOARRAY(w) : ['""',"''","{}","[]","<>"];
				for(var i=0,l=w.length;i<l;i++) if(ISWRAP(c,w[i])) return c.substring(w[i].substr(0,w[i].length-1).length,c.length-1);
			}
			return c;
		},
		"WRAP":function(c,w){
			if(!ISWRAP(c,w)){
				c = typeof c == "string" ? c.trim() : "";
				w = typeof w == "string" ? w.length > 1 ? w : '""' : '""';
				return w.substr(0,w.length-1) + c + w.substr(w.length-1);
			}
			return c;
		},
		"DQURT":function(c){
			if(typeof c == "string"){ if(ISWRAP(c,'""')) return c; return '"'+UNWRAP(c,"''")+'"'; }
			return c;
		},
		"SQURT":function(c){
			if(typeof c == "string"){ if(ISWRAP(c,"''")) return c; return "'"+UNWRAP(c,'""')+"'"; }
			return c;
		},
		"INDEXES":function(c,s){
			if(typeof c == "string" || typeof c == "number"){
				var idx = [],mvc = c+"",s = s+"",prog = 0,next;
				do {
					var i = mvc.indexOf(s,prog);
					if(i > -1){
						prog = s.length + (i);
						idx.push(prog-s.length); 
						next = true;
					} else {
						next = false;
					}
				} while(next)
				return idx;
			}
		},
		"SPLITINDEXES":function(c,idx){
			if(typeof c == "string" && ISARRAY(idx)){
				var indexes = MV(idx);
				indexes.push(c.length);
				var result  = [];
				var past    = 0;
				for(var i=0,l=indexes.length;i<l;i++){
					result.push(c.substring(past,indexes[i]));
					past = indexes[i]+1;
				}
				return result;
			}
		},
		"SIMPLERANGE":function(result){
			if(result){
				var sFlag    = [];
				sFlag.length = result.length; 
				for(var si=0,sl=result.length;si<sl;si++) for(var sfi=0,sfl=result.length;sfi<sfl;sfi++) if(si !== sfi) if(result[si][0] < result[sfi][0]) if(result[si][1] > result[sfi][1]) sFlag[sfi] = false;
				var sResult = [];
				for(var sri=0,srl=sFlag.length;sri<srl;sri++) if(sFlag[sri] !== false) sResult.push(result[sri]);
				return sResult;
			}
		},
		"INDEXESRANGE":function(f,e){
			if(ISARRAY(f) && ISARRAY(e)){
				var flag = [];
				var value= [];
				var fi = 0;
				var ei = 0;
				var next;
				do {
					var fiv = f[fi];
					var eiv = e[ei];
					if(typeof fiv == "undefined" && typeof eiv == "undefined"){
						next = false;
					} else {
						if(typeof eiv == "undefined" || (eiv > fiv)){
							flag.push(true);
							value.push(fiv);
							fi++;
						} else {
							flag.push(false);
							value.push(eiv);
							ei++;
						}
						next = true;
					}
				} while (next);
				var result = [];
				var pos    = [];
				var neg    = [];
				for(var i=0,l=flag.length;i<l;i++){
					var cFlag = flag[i];
					var nFlag = flag[i+1];
					if(cFlag){
						pos.push(value[i]);
					} else {
						neg.push(value[i]);
						if(neg.length >= pos.length && (nFlag==true || typeof nFlag == "undefined")){
							for(var ii=0,ll=neg.length;ii<ll;ii++){
								if(pos.length == 0){
									neg.length = 0;
									break;
								} else {
									result.push([pos.shift(),neg[neg.length - 1]]);
									neg.length = neg.length-1;
								}
							}
						}
					}
				}
				return result;
			} else if(ISARRAY(f) && typeof e == "undefined"){
				var result = [];
				var stack  = [];
				for(var i=0,l=f.length;i<l;i++){
					stack.push(f[i]);
					if(stack.length > 1) result.push(stack);
				}
				return result;
			} else {
				console.warn("INDEXESRANGE::두번째까지 파라메터는 array여야 합니다.",f,e);
			}
		},
		"OUTERSPLIT":function(c,s,w){
			if(typeof c == "string"){
				if(typeof s !== "string" || s.length == 0) s=",";
				if(s.length > 1){
					console.wran("OUTERSPLIT:: 두번째 파라메터는 1글자만 지원합니다. => ",s);
					s = s.substr(0,1);
				}
				w = typeof w !== "undefined" ? TOARRAY(w) : ["{}","[]"];
				c = UNWRAP(c,w);
				var outSplit = [];
				for(var i=0,l=w.length;i<l;i++){
					var fv   = w[i].substr(0,w[i].length-1);
					var ev   = w[i].substr(w[i].length-1);
					var fidx = INDEXES(c,fv);
					if(fv == ev){
						outSplit = outSplit.concat(INDEXESRANGE(fidx));
					} else {
						var eidx = INDEXES(c,ev);
						outSplit = outSplit.concat(INDEXESRANGE(fidx,eidx));
					}
				}
				outSplit = SIMPLERANGE(outSplit);
				var splitPoints  = INDEXES(c,s);
				var splitIndexes = [];
				for(var si=0,sl=splitPoints.length;si<sl;si++){
					var point = splitPoints[si];
					var pass  = true;
					for(var oi=0,ol=outSplit.length;oi<ol;oi++){
						if(point > outSplit[oi][0] && point < outSplit[oi][1]){
							pass = false;
							break;
						}
					}
					if(pass == true) splitIndexes.push(point);
				}
				return SPLITINDEXES(c,splitIndexes);
			}
		},
		//TextCase관련 함수
		"CASEARRAY":function(s,c){
			if(typeof c == "string") return s.split(c) ;
			if(typeof s !== "string")return console.error("CASEARRAY::첫번째 파라메터는 반드시 String이여야 합니다. // s =>",s);
			s = s.replace(/^\#/,"");
			//kebab
			var k = s.split("-");
			if(k.length > 1) return k;
			//snake
			var _ = s.split("_");
			if(_.length > 1) return _;
			//Cap
			return s.replace(/[A-Z][a-z]/g,function(s){return "%@"+s;}).replace(/^\%\@/,"").split("%@");
		},
		//PascalCase
		"PASCAL":function(s){ var words = CASEARRAY(s); for(var i=0,l=words.length;i<l;i++) words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase(); return words.join(""); },
		//camelCase
		"CAMEL":function(s){ var words = CASEARRAY(s); for(var i=1,l=words.length;i<l;i++) words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase(); words[0] = words[0].toLowerCase(); return words.join(""); },
		//snake_case
		"SNAKE":function(s){ var words = CASEARRAY(s); for(var i=0,l=words.length;i<l;i++) words[i] = words[i].toLowerCase(); return words.join("_"); },
		//kebab-case
		"KEBAB":function(s){ var words = CASEARRAY(s); for(var i=0,l=words.length;i<l;i++) words[i] = words[i].toLowerCase(); return words.join("-"); },
		//타입검사
		"ISTYPE":function(t,v) {
			//real
			if(t instanceof v) return true;
			//tName
			var vn = ((typeof v == "function") ? v["__NatvieContstructorName__"] : v);
			//inspect
			if( (typeof t=="object") && (typeof vn=="string") ) if("__NativeHistroy__" in t) {
				var his = t["__NativeHistroy__"];
				
				for(var i=0,l=his.length;i<l;i++){
					if(his[i] == vn) return true;
				}
			}
			return false;
		},
		//함수실행
		"APPLY" : function(f,owner,args) { 
			if(typeof f == "function"){
				var mvArgs = MVARRAY(args);
				try {
					if(mvArgs.length > 0){
						return f.apply(owner,mvArgs);
					} else {
						return f.call(owner);
					}
				} catch(e) {
					for(key in console) if(console[key] == f) { return f.apply(console,mvArgs); } 
					throw e;
				}
				
			}
		},
		"CALL"     : function(f,owner) { 
			if(typeof f == "function"){
				if(typeof APPLY == "undefined"){ alert("apply가 존재하지 않음"); }
				try {
					var args = Array.prototype.slice.apply(arguments);
					args.shift();
					args.shift();
					return APPLY(f,owner,args);
				} catch(e) {
					throw e;
				}
			}
		},
		"CALLBACK" : function(f){ 
			if(typeof f == "function"){
				var args = Array.prototype.slice.apply(arguments);
				args.shift();
				return APPLY(f,undefined,args);
			}
		},
		// 함수면 호출 아니면 리턴
		"JOB" : function(f,a,owner){ if( typeof f == "function" ){ return f.call(owner,a); } return f; },
		// 함수가 존재하면 호출하여 콜백한다
		"FJOB": function(f,v,owner){ if( typeof f == "function" ){ return f.call(owner,v); } return v; },
		// 각각의 값의 function실행
		"DATAEACH"    :CONTINUTILITY(function(v,f){ var ev=TOARRAY(v); for(var i=0,l=ev.length;i<l;i++) f(ev[i],i); return ev; },2),
		// 각각의 값의 function실행
		"DATAEACHBACK":CONTINUTILITY(function(v,f){ var ev=TOARRAY(v); for(var i=0,l=ev.length;i<l;i++) f(ev[i],i); return ev; },2),
		// 각각의 값을 배열로 다시 구해오기
		"DATAMAP"     :CONTINUTILITY(function(v,f){ var rv=[],ev=TOARRAY(v); for(var i=0,l=ev.length;i<l;i++) rv.push(f(ev[i],i)); return rv; },2),
		// 각각의 값을 배열로 다시 구해오되 undefined는 제거합니다
		"DATAGATHER"  :CONTINUTILITY(function(v,f){ var rv=[],ev=TOARRAY(v); for(var i=0,l=ev.length;i<l;i++) { var def = f(ev[i],i); if(typeof def !== "undefined") rv.push(); } return rv; },2),
		// 배열을 댑스를 모두 제거합니다.
		"DATAFLATTEN":function(){ var result = []; function arrayFlatten(args){ DATAEACH(args,function(arg){ if(ISARRAY(arg)) return DATAEACH(arg,arrayFlatten); result.push(arg); }); } arrayFlatten(arguments); return result; },
		// 배열을 댑스를 모두 제거합니다.
		"DATAFILTER":function(inData,filterMethod){
			var data = TOARRAY(inData);
			if(typeof filterMethod == "undefined") { filterMethod = function(a){ return typeof a == "undefined" ? false : true; }; } 
			if(typeof filterMethod == "function"){
				var result=[];
				DATAEACH(data,function(v,i){ if(filterMethod(v,i)==true) result.push(v); });
				return result;
			}
			return [];
		},
		"DATAINDEX":function(data,compare){ var v = TOARRAY(data); for(var i in v) if(compare == v[i]) return TONUMBER(i); },
		//
		"ISNOTHING":function(o){ 
	        if (typeof o == "undefined")return true;
			if (typeof o == "string")return o.trim().length < 1 ? true : false;
			if (typeof o == "object"){
				if(ISELNODE(o)) return false;
				if(o == null ) return true;
				if(ISARRAY(o)) {
					o = o.length;
				} else {
		            var count = 0; for (var prop in o) { count = 1; break; } o = count;
				}
			}
	        if (typeof o == "number")return o < 1 ? true : false;
	        if (typeof o == "function")return false;
			if (typeof o == "boolean")return !this.Source;
			console.warn("ISNOTHING::이 타입에 대해 알아내지 못했습니다. nothing으로 간주합니다.",o);
	        return true;
		},
		"ISMEANING":function(o){ return !ISNOTHING(o); },
		"ISENOUGH" :function(o){ return !ISNOTHING(o); },
		"FLAG"     :function(flagParam,secondParam){
			if(typeof flagParam == "boolean") return flagParam;
			var flagValue;
			if(typeof flagParam == "object"){
				if ("result" in flagParam) {
					flagValue = flagParam.result;
				} else {
					flagValue = undefined;
				}
			} else if(typeof flagParam ==  "function"){
				flagValue = APPLY(flagParam,undefined,secondParam);
			} else {
				flagValue = flagParam;
			}
			if(typeof flagValue == "string"){
				var fs = flagValue.trim().toLowerCase();
				if(fs == "true" || fs == "0" || flagValue == "yes" || flagValue == "ok"){
					return true;
				} else {
					return false;
				}
			}
			if(typeof flagValue == "number") if(flagValue == 0) return true; return false;
			console.warn("FLAG::flag가 처리할수 없는 값입니다. =>", flagParam);
			return false;
		},
		//
		"ALERT":function(v){ W.alert(TOS(v)); return v; },
		"ELALERT":function(){ W.alert(FIND(v)); return v; }
	});
	AFoundation.toGetter();
	
	var objectCommonInterface = {
		"getKeys":function(rule){
			var r = [];
			if(typeof rule == "string"){
				this.each(function(v,k){ if(k.indexOf(rule) > -1){ r.push(k); }});
			} else if(rule instanceof RegExp) {
				this.each(function(v,k){ if(rule.test(k)){ r.push(k) }});
			} else {
				this.each(function(v,k){ r.push(k); });
			}
			return r;
		}
	}
	
	//******************
	// AArray
	makeArrayModule("Array",{
		// 요소 각각에 형식인수를 넘기며 한번씩 호출한다.
		each     : function(method) { for ( var i = 0, l = this.length ; i < l  ; i++) { if( method(this[i],i) == false ) break; } return this; },
		getKeys  : objectCommonInterface.getKeys,
		eachBack : function(method) { for ( var i = this.length - 1    ; i > -1 ; i--) { if( method(this[i],i) == false ) break; } return this; },
		//첫번째 요소 반환.
		zero:function() { return this[0]; },
		//마지막 요소 반환.
		last:function() { return this[this.length - 1]},
		// 값을 추가한다.
		push : function(v,i){ switch(typeof i){ case "string": case "number": this[i] = v; break; default: Array.prototype.push.call(this,v); break; } return this; },
		//해당 값을 당 배열로 바꾼다
		replace   : function(v){
			if( ISARRAY(v) ) {
				if("toArray" in v){
					Array.prototype.splice.apply(this,[0,this.length].concat(v.toArray()));
				} else {
					this.length = 0;
					for(var i=0,l=v.length;i<l;i++) Array.prototype.push.call(this,v[i]);
				}
				return this;
			} else {
				this.length = 0;
				if(v||v==0) Array.prototype.push.call(this,v);
				return this;
			}
		},
		select:function(v){ return this.replace(v); },
		//배열의 길이를 조절합니다.
		max:function(length) { this.length = length > this.length ? this.length : length; return this; },
		min:function(length,undefTo){var count=parseInt(length);if(typeof count=="number")if(this.length<count)for(var i=this.length;i<count;i++)this.push(undefTo);return this;},
		//원하는 위치에 대상을 삽입합니다.
		insert: function(v,a){ this.min(a); var pull=[],a=a?a:0; for(var i=a,l=this.length;i<l;i++)pull.push(this[i]); return this.max(a).push(v).concat(pull); },
		// 순수 Array로 반환
		toArray  : function()  { return Array.prototype.slice.call(this); },
		//내부요소 모두 지우기
		clear   : function() { this.length = 0; return this; },
		
		//
		getFirst:function(){ return ZERO(this); },
		getLast :function(){ return LAST(this); },
		
		//뒤로부터 원하는 위치에 대상을 삽입합니다.
		behind: function(v,a){ return this.insert(v, this.length - (isNaN(a) ? 0 : parseInt(a)) ); },
		//원하는 위치에 대상을 덮어씁니다.
		overwrite : function(v,a){ this.min(a+1); this[a] = v; return this; },
		//양방향에 대상을 삽입합니다.
		getBoth:function(f,l){ return this.save().insert(f).push(l);   },
		both:function(f,l)   { return this.replace(this.getBoth(f,l)); },
		// 현재의 배열을 보호하고 새로운 배열을 반환한다.
		save    : function(v){ return this.__GlobalConstructor__(this); },
		//요소안의 array 녹이기
		getFlatten : function(){var _result=_Array();this.each(function(value){if(_Type(value).isArray()){_result.concat(value);}else{_result.push(value);}});return _result;},
		flatten    : function(){return this.replace(this.getFlatten());},
		//다른 배열 요소를 덛붙인다.
		getConcat : function(){
			return _Array(arguments).inject(this.save(),function(v,_a){
				_Array(v).each(function(v2){
					_a.push(v2);
				});
			});
		},
		concat    : function(){ return this.replace(this.getConcat.apply(this,arguments)); },			
		// 리턴한 요소를 누적하여 차례로 전달함
		inject:function(firstValue,method) { for(var i = 0,l = this.length;i<l;i++) { var returnValue = method(this[i],firstValue,i); if(typeof returnValue !== "undefined") firstValue = returnValue; } return firstValue; },
		// 리턴되는 오브젝트로 새 배열은 만들어냅니다.
		mapUtil: { "&":function(owner,param){ return owner.getMap(function(a){ if(typeof a == "object") return a[param]; return undefined;}); }},
		getMap : function(process,start) { if(typeof process=="function"){var result=[];for(var i=(typeof start == "number" ? start : 0),l=this.length;i<l;i++)result.push(process(this[i],i,this.length));return _Array(result);}else if(typeof getOrder=="string"){process=process.trim();for(var key in this.mapUtil)if(process.indexOf(key)==0){var tokenWith=process[key.length]==":"?true:false;var param=tokenWith?process.substr(key.length+1):process.substr(key.length);return _Array(this.mapUtil[key](this,param));}}return _Array(); },
		map : function(process) { return this.replace(this.getMap(process)); },
		
		// index가 maxIndex한계값이 넘으면 index가 재귀되어 반환된다.
		turning:function(maxIndex,method){
			var NI = parseInt(maxIndex);
		   	var t  = function(cIndex) { if(cIndex < 0) { var abs = Math.abs(cIndex); cIndex = NI-(abs>NI?abs%NI:abs); }; return (NI > cIndex)?cIndex:cIndex%NI; };
			var ti = function(cIndex) { return { "turning" : t(cIndex), "group"   : Math.floor(cIndex/NI) } };
			for(var i = 0; i < this.length ; i++) { var tio = ti(i); method(this[i],tio.turning,tio.group,i); }
			return this;
		},
		// true를 반환하면 새 배열에 담아 리턴합니다.
		getFilter   : function(filterMethod) { 
			if(typeof filterMethod == "undefined") { filterMethod = function(a){ return typeof a == "undefined" ? false : true; }; } 
			if(typeof filterMethod == "function"){
				var result=[]; 
				this.each(function(v,i){ if(true==filterMethod(v,i)){ result.push(v); } });
				return _Array(result);
			}
			return _Array();
		},
		filter      : function(filterMethod) { return this.replace(this.getFilter(filterMethod)); },
		// undefined요소를 제거한다.
		getCompact : function(){ return this.getFilter(function(a){ return a == undefined ? false : true; }); },
		compact    : function(){ return this.replace(this.getCompact());},
		// 파라메터 함수가 모두 true이면 true입니다.
		passAll:function(passMethod) { for(var i=0,l=this.length;i<l;i++) if(passMethod(this[i],i) != true) return false; return true; },
		// 하나라도 참이면 true입니다
		passAny:function(passMethod) { for(var i=0,l=this.length;i<l;i++) if(passMethod(this[i],i) == true) return true; return false; },
		//substr처럼 array를 자른다.
		getSubArray:function(fi,li,infinity){
			fi = isNaN(fi) == true ? 0 : parseInt(fi);
			li = isNaN(li) == true ? 0 : parseInt(li);
			var nl,ns,result = _Array();
			if (fi > li) {
				nl = fi;
				ns = li;
			} else {
				nl = li;
				ns = fi;
			}
			//제한
			if(infinity !== true){
				nl = nl < this.length ? nl : this.length;
				ns = ns > 0 ? ns : 0;
			}
			for(var i=ns,l=nl;i<l;i++) result.push(this[i]);
			return result;
		},
		subarray:function() { return this.replace(this.getSubArray.apply(this,arguments));},
		getSubarr:function(fi,li) { return this.getSubArray(fi,li ? li + fi : this.length); },
		subarr:function(fi,li){return this.replace(this.getSubarr(fi,li));},
		//해당 인덱스 요소를 옮김 (자리바꿈)
		getLeft:function(index){ if(index < 1) return this.save(); if(index > this.length-1) return this.save(); var t1 = this[index]; var t2 = this[index-1]; return this.save().overwrite(t1,index-1).overwrite(t2,index); },
		left:function(index){ return this.replace(this.getLeft(index)); },
		getRight:function(index){ if(index < 0) return this.save(); if(index > this.length-2) return this.save(); var t1 = this[index]; var t2 = this[index+1]; return this.save().overwrite(t1,index+1).overwrite(t2,index); },
		right:function(index){ return this.replace(this.getRight(index)); },
		//해당되는 인덱스를 제거
		getDrop:function(index){ index=index?index:0;return this.getSubArray(index).getConcat(this.getSubarr(index+1)); },
		drop:function(index) { return this.replace(this.getDrop(index)); },
		// 인수와 같은 요소를 제거한다.
		getRemove:function(target) { return this.getFilter(function(t){ if(t == target) return false; return true; }); },
		remove:function(target) { return this.replace(this.getRemove(target)); },
		// 요소중의 중복된 값을 지운다.
		getUnique:function(){var result=_Array();this.each(function(selfObject){if(result.passAll(function(target){return selfObject!=target;}))result.push(selfObject);});return result;},
		unique:function(){return this.replace(this.getUnique());},
		// 인수가 요소안에 갖고있다면 true가 반환
		has : function(h) { return this.passAny(function(o) { return o == h; }); },
		// 다른 요소를 반환
		getOther:function(){
			var exception = Array.prototype.slice.call(arguments);
			return this.getFilter(function(o){ for(var i=0,l=exception.length;i<l;i++) if(exception[i] == o) { return false;} return true; });
		},
		other:function(){ return this.replace(this.getOther.apply(this,Array.prototype.slice.apply(arguments))); },
		// 원하는 type만 남기고 리턴
		getType : function(wanted) { return this.getFilter(function(v){ return _Type(v).is(wanted); }); },
		type    : function(watend) { return this.replace(this.getType(watend)); },
		// 같은 요소를 반환
		getEqual:function(v){ return this.getFilter(function(fv){return fv == v ? true : false; }); },
		equal:function(v)   { return this.replace(this.getEqual(v)); },
		// 컨스트럭터를 비교하기 위한
		getEqualClass:function(v){
			this.getFilter(function(ref){
				if(typeof ref == "object" || typeof ref == "function"){
					if(ref.constructor == v) return true;
				}
			});
		},
		equalClass:function(v){ return this.replace(this.getEqualClass(v)); },
		// index위치에 있는 요소를 얻어온다.
		eq:function(index,length){if(isNaN(length))length=1;return this.getSubarr(index,length);},
		// 요소중 처음으로 일치하는 index를 반환한다.
		indexOf:function(target){var result=-1;this.each(function(t,i){if(t==target){result=i;return false;}});return result;},
		lastIndexOf:function(target){var result=-1;this.eachBack(function(t,i){if(t==target){result=i;return false;}});return result;},
		// 첫번째부터 참인 오브젝트만 반환합니다. //마지막부터 참인
		firstMatch:function(matchMethod){var result;this.each(function(value,index){if(matchMethod(value,index)==true){result=value;return false;}});return result;},
		lastMatch:function(matchMethod){var result;this.eachBack(function(value,index){if(matchMethod(value,index)==true){result=value;return false;}});return result;},
		// undefined를 제외한 가장 처음의 
		useFirst : function(){ return this.firstMatch(function(matchValue){ if(typeof matchValue !== "undefined") return true; }); },
		useLast  : function(){ return this.lastMatch (function(matchValue){ if(typeof matchValue !== "undefined") return true; }); },
		//정렬합니다.
		getSortBy:function(sortInspector){},
		getSort:function(positive){positive=typeof positive=="undefined"?true:false;var clone=this.getRefactory();return positive?clone.sort():clone.sort().reverse();},
		//사용성 증가를 위한 코드
		isNothing:function(){ if(this.length == 0) return true; return false; },
		isEnough:function(){ if(this.length > 0) return true; return false;   },
		//요소안의 string까지 split하여 flaatten을 실행
		getStringFlatten:function(){ return this.save().map(function(t){ if(typeof t == "string") return t.split(" "); if(ISARRAY(t)) return _Array(t).flatten().type("string"); }).remove(undefined).flatten(); },
		stringFlatten:function(){ return this.replace( this.getStringFlatten() ); },
		getDeepFlatten:function(){function arrayFlatten(_array){var result=_Array();_array.each(function(value){if(_Type(value).isArray()){result.concat(arrayFlatten(_Array(value)));}else{result.push(value);}});return result;}return arrayFlatten(this);},
		deepFlatten:function(){ return this.replace(this.getDeepFlatten()); },
		//그룹 지어줌
		getGrouping:function(length,reverse){
			var result=[];
			if(reverse == true){
				this.save().reverse().turning(length,function(obj,i,g){if(!result[g])result[g]=[];result[g].push(obj);});
				return _Array(result).map( function(groups){ return _Array(groups).reverse().toArray(); } ).reverse();
			}
			this.turning(length,function(obj,i,g){if(!result[g])result[g]=[];result[g].push(obj);});
			return _Array(result);
		},
		grouping:function(length,reverse){ return this.replace(this.getGrouping(length,reverse)); },
		//랜덤으로 내용을 뽑아줌
		getRandom:function(length){
			if(typeof length == "undefined") return this[Math.floor(Math.random() * this.length)];
			if(length > this.length) length = this.length;
			var result = _Array();
			var targets = this.save();
			for(var i=0,l=length;i<l;i++){
				var v = Math.floor(Math.random() * targets.length);
				result.push(targets[v]);
				targets.drop(v);
			}
			return result;
		},
		join:function(t,p,s){ return (ISTEXT(p)?p:"")+Array.prototype.join.call(this,t)+((ISTEXT(s))?s:""); },
	
		joint:function(t,p,s){ return (ISTEXT(p)?p+(ISTEXT(t)?t:""):"")+Array.prototype.join.call(this,t)+((ISTEXT(s))?(ISTEXT(t)?t:"")+s:""); },
		//Object로 반환
		keyPair:function(key,value){
			if (!ISTEXT(key)) key = "key";
			if (!ISTEXT(value)) value = "value";
			var r = {};
			this.each(function(data){
				if(typeof data == "object" || typeof data == "function"){
					if(key in data){
						r[data[key]] = data[value];
						return r;
					}
				}
			});
			return r;
		},
		//수학계산
		getRatio:function(joinText){
			var gcd = _Number(parseInt(this[0])).getGCD(parseInt(this[1]));
			if(joinText) return [this[0]/gcd,this[1]/gcd].join(joinText);
			return _Array(this[0]/gcd,this[1]/gcd);
		},
		ratio:function(joinText){
			var ratioValue    = this.getRatio(joinText);
			return this.replace((typeof ratioValue == "string")?[ratioValue]:ratioValue);
		}
	});
	//******************
	//Object
	makeModule("Object",{
		//each
		each:function(f){ for(key in this.Source){ var r = f(this.Source[key],key); if(typeof r == false) {break;} } return this; },
		getKeys:objectCommonInterface.getKeys,
		eachBack:function(method){ var keys = this.getKeys(); for ( var i = keys.length - 1 ; i > -1 ; i--) { if( method(keys[i],i) == false ) break; } return this; },
		//첫번째 요소 반환.
		zero:function(){ for(var k in this.Source) return this.Source[k]; },
		//마지막 요소 반환.
		last:function(){ var keys = this.getKeys(); return this.Source[keys[keys.length-1]];},
		// 값을 추가한다
		push:function(value,key){ if( typeof key == "string" || typeof key == "number" ){ this.Source[key] = value; } else { var i = 0; var ex = true; do { if(i in this.Source){ i++; } else { ex = false; this.Source[i] = value; } } while (ex); } return this; },
		replace:function(obj,k){ 
			obj = OBJECT(obj,k); if(typeof obj == "object"){ for(var key in this.Source) delete this.Source[key]; for(var k in obj) this.Source[k] = obj[k]; } return this; 
		},
		select:function(obj){
			
		},
		// 길이를 조절합니다
		max :function(){
			
		},
		min :function(){
			
		},
		clone:function(){return MV(this.Source); },
		save:function() {return this.__GlobalConstructor__(MV(this.Source)); },
		//key value get setter
		prop:function(k,v){
			if(ISTEXT(k) && arguments.length > 1){
				this.Source[k] = v;
				return this;
			} else if (ISTEXT(k)) { 
				return this.Source[k];
			} else if(typeof k == "object"){
				for(var kk in key) this.prop(kk,key[kk]);
				return this;
			} else {
				return this.Source; 
			};
		},
		//모든 프로퍼티에 적용
		propAll:function(dv){for(var key in this.Source) this.Source[key] = dv;return this;},
		//키값판별
		propIs    :function(key,test,t,f) { var t = _Type(this.Source[key]); return t.is.apply(t,_Array(arguments).subarr(1).toArray()); },
		propUn    :function(key,test,t,f) { var t = _Type(this.Source[key]); return t.un.apply(t,_Array(arguments).subarr(1).toArray()); },
		propAs    :function(key,test,t,f) { var t = _Type(this.Source[key]); return t.as.apply(t,_Array(arguments).subarr(1).toArray()); },
		//오브젝트에 키를 가지고 있는지 확인
		has:function(key){ return key in this.Source; },
		//그러한 value가 존재하는지 확인
		hasValue:function(value){
			var result = false;
			this.each(function(v,k){ if(value == v){ result = true; return false; } });
			return result;
			return key in this.Source; 
		},
		
		
		//map
		getMap:function(f,ksel){ 
			if(typeof f == "function"){
				var result = MV(this.Source);
				var keys   = this.getKeys(ksel);
				for(var i=0,l=keys.length;i<l;i++) result[keys[i]] = f(this.Source[keys[i]],keys[i]);
				return result; 
			} else { 
				return MV(this.Source);
			} 
		},
		map:function() { return this.replace( this.getMap.apply(this,arguments) ); },
		//inject 
		inject:function(o,f,ksel){ if(typeof f == "function") { this.getMap(function(v,k){ var or = f(v,o,k); if(typeof or !== "undefined") { o=or; } },ksel); return o; } },
		//key getter
		data:function(k,v){
			if(typeof v !== "function" && typeof v !== "undefined") { throw new Error("Object::data 메서드는 setter가 아닙니다."); };
			if (typeof k == "string"){
				if(typeof v == "function"){
					return v(this.Source[k]);
				} else {
					return this.Source[k];
				}
			} else if(k instanceof RegExp || ISARRAY(k)){
				var keys   = this.getKeys(rule),result = {};
				for(var key in keys) result[key] = keys[key];
				return result;
			} else {
				return this.Source; 
			};
		},
		//inspect key value
		isSame:function(obj){ var originObject = this.Source; var judgement = true; _Object(obj).each(function(v,k){ if( !(k in originObject) || originObject[k] !== v){ judgement = false; return false; } }); return judgement; },
		isEqual:function(obj){ var _obj = _Object(obj); var oObj = this.Source; var iObj = _obj.get(); var oKeys = this.getKeys().sort(); var iKeys = _obj.getKeys().sort(); if(oKeys.length !== iKeys.length) return false; for(var i=0,l=oKeys.length;i<l;i++){ if(oKeys[i] !== iKeys[i]) return false; if(oObj[oKeys[i]] !== iObj[iKeys[i]]) return false; } return true; },
		//오브젝트를 배열로 반환함
		hashes:function(key,val){ key = typeof key !== "string" ? "key" : key; val = typeof val !== "string" ? "value" : val; var r=[]; for(var k in this.Source){ var o = {}; o[key] = k; o[val] = this.Source[k]; r.push(o); } return r; },
		//
		join:function(a,b){ a = typeof a == "string" ? a : ":"; b = typeof b == "string" ? b : ","; return this.inject([],function(v,i,k){ i.push(k+a+TOSTRING(v)); }).join(b); },
		//toParam
		getEncodeObject : function(useEncode){ return this.inject({},function(val,inj,key){ inj[ (useEncode == false ? key : _String(key).getEncode()) ] = (useEncode == false ? val : _String(val).getEncode()); }); },
		encodeObject    : function(){ return this.replace(this.getEncodeObject.apply(this,arguments)); },
		//jsonString으로 반환
		stringify:function(){ return JSON.stringify(this.Source); },
		changeKey:function(original, change){ if(typeof original == "string" && typeof change == "string") { this.Source[change] = this.Source[original]; delete this.Source[original]; } return this.Source; },
		//String의 순차적으로 오브젝트 반환  "1 2 3 4" => {"1":"2","3":"4"}
		getKvo:function(arg,split){ split = typeof split == "string" ? split : " "; arg = arg.split(split); var source = MV(this.Source); var keyName = undefined; _Array(arg).turning(2,function(value,i){ if(i == 0) { keyName = value; } else if(i == 1) { if(typeof keyName !== "undefined") { switch(value){ case "''": case '""': case "'": case '"': source[keyName] = ""; break; default : source[keyName] = value; break ; } } keyName = undefined; } }); return source; },
		kvo:function(arg){ return this.replace(this.getKvo.call(this,arg)); },
		//오브젝트의 키를 지우고자 할때
		removeAll:function(){ for( var key in this.Source ) delete this.Source[key]; return this.Source; },
		getRemove:function(){ var source = this.Source; _Array(arguments).stringFlatten().each(function(key){ delete source[key]; }); return this.Source; },
		remove:function(key){ return this.replace( this.getRemove.apply(this,arguments) ); },
		//존재하지 않는 키벨류값을 적용함;
		getTouch:function(key,value){ var m = MV(this.Source);_Array(key).stringFlatten().each(function(key){ if(!(key in m)) m[key] = value; }); return m; },
		touch:function(key,value){ return this.replace( this.getTouch.apply(this,arguments) ); },
		//키의 배열을 받는다
		keys:function(){ var result = []; for (key in this.Source) result.push(key); return result; },
		//값의 배열을 받는다
		values:function(){ var result = []; for (key in this.Source) result.push(this.Source[key]); return result; },
		getValue:function(key){ return this.Source[key]; },
		//다른 오브젝트와 함칠때
		getConcat:function(){ var result = this.clone(); for(var i=0,l=arguments.length;i<l;i++){ _Object(arguments[i]).each(function(v,k){ result[k] = v; }); }; return result; },
		concat:function(){ this.replace(this.getConcat.apply(this,arguments)); return this; },
		//다른 오브젝트와 함칠때 이미 있는 값은 오버라이드 하지 않음
		getSafeConcat:function(){ var result = this.clone(); for(var i=0,l=arguments.length;i<l;i++){ _Object(arguments[i]).each(function(v,k){ if( (k in result) == false) result[k] = v; }); } return result; },
		safeConcat:function(){ this.replace(this.getSafeConcat.apply(this,arguments)); return this; }
	}, function(p,n,s){
		if(typeof s == "string"){
			this.Source = {};
			this[s].apply(this,_Array(arguments).subarr(0,2).toArray());
		} else {
			this.Source = OBJECT(p,n);
		}
	});
	
	
	W._Split = function(text,s){
		if(typeof s == "undefined"){
			var result = [];
			text.replace((typeof s == "undefined" ? /\S+/gi : s ),function(text_s){ result.push(text_s); });
			return _Array(result);
		} else if (typeof s == "string"){
			return _Array(text.split(s));
		} else {
			console.warn("_Split에 상이한 값이 들어왔음 => ", s);
			return _Array(text);
		}
	};
	W._Repeat = function(value,repeat){
		var _a = _Array();
		for(var i=0,l=(isNaN(repeat) == true ? 1 : parseInt(repeat) );i<l;i++)_a.push(JOB(value));
		return _a;
	};
	extendModule("Array","Range",{},function(a,b){
		b = isNaN(b) ? 1 : parseInt(b);
		if(typeof a == "string"){
			if( /(\d+)\~(\d+)/.test(a) == true ) {
				var result = /(\d+)\~(\d+)/.exec(a);
				var left   = parseInt(result[1]);
				var right  = parseInt(result[2]);
			
				if(left == right){
					this.push(left);
					return ;
				} else if(left < right){
					for(;left<=right;left=left+b)this.push(left);
					return ;
				} else {
					for(;right<=left;right=right+b)this.push(right);
					return ;
				}
			}
		}
		this.replace(a);
	});
	
	
	
	//******************
	//String
	makeModule("String",{
		getEncode:function(){ return encodeURI(this.Source); },
		getDecode:function(){ return decodeURI(this.Source); },
		encode:function(){this.Source = this.getEncode();return this;},
		decode:function(){this.Source = this.getDecode();return this;},
		getByteSize:function(){
			//http://okjsp.net/bbs?seq=30371
			var temp_estr = escape(this.Source);
			var s_index   = 0;
			var e_index   = 0;
			var temp_str  = "";
			var cnt       = 0;
			// 문자열 중에서 유니코드를 찾아 제거하면서 갯수를 센다.
			while ((e_index = temp_estr.indexOf("%u", s_index)) >= 0) {
				// 제거할 문자열이 존재한다면
				temp_str += temp_estr.substring(s_index, e_index);
				s_index = e_index + 6;
				cnt ++;
			}
			temp_str += temp_estr.substring(s_index);
			temp_str = unescape(temp_str);  // 원래 문자열로 바꾼다.
			// 유니코드는 2바이트 씩 계산하고 나머지는 1바이트씩 계산한다.
			return ((cnt * 2) + temp_str.length) + "";
		},
		eachLine:function(f){
			if(typeof f == "function"){
				var i = 0;
				var r = this.Source.replace(/[^\n]*\n/gi,function(s){
					return f(s,i++);
				});
			}
			return r;
		},
		getTabSize:function(){
			var tabInfo = /^([\s\t]*)(.*)/.exec(this.Source);
			var tab   = tabInfo[1].replace(/[^\t]*/g,"").length;
			var space = tabInfo[1].replace(/[^\s]*/g,"").length - tab;
			return tab + Math.floor(space / 4);
		},
		//탭을 정렬함
		getAlignTab:function(tabSize,tabString){
			if(typeof tabSize == "number" || typeof tabSize == "string" ) tabSize = parseInt(tabSize);
			if(typeof tabSize != "number") tabSize = this.getTabSize();
			if(typeof tabString !== "string") tabString = "\t";
			if(tabSize < 0) tabSize = 0;
			var result = "";
			for(var i = 0; i < tabSize; i++) result += tabString;
			return result + /^([\s\t]*)(.*)/.exec(this.Source)[2];
		},
		//탭음 밀어냄
		getTabOffset:function(offset,tabString){
			offset = parseInt(offset);
			if(typeof offset == "number") return _Split(this.Source,"\n").map(function(text){
				return _String(text).getAlignTab(_String(text).getTabSize() + offset,tabString);
			}).join("\n");
			return this.Source;
		},
		trim:function(trimParam,autoTrim){
			original = this.Source;
			if(autoTrim) original = this.Source.trim();
			var trim_s = trimParam?trimParam:" ";
			trim_s = trim_s.replace(" ","\\s")
			try {
				this.Source = new RegExp("^(["+trim_s+"]*)(.*[^"+trim_s.split("|").join("^")+"])(["+trim_s+"]*)$").exec(original)[2];
				return this;
			} catch(error) {
				return this.Source;
			}
		},
		//content
		abilityFunction  : function(fs,is,js){ var origin = (js==true) ? OUTERSPLIT(this.Source,fs,["{}","[]",'""',"''"]) : this.Source.trim().split(fs); if(origin[origin.length-1].trim()=="") origin.length = origin.length-1;  return _Array(origin).passAll(function(s,i){ return s.indexOf(is) > 0; }) ? origin.length : 0; },
		abilityObject    : function(){ return this.abilityFunction(",",":",true); },
		abilityParameter : function(){ return this.abilityFunction("&","="); },
		abilityCss       : function(){ return this.abilityFunction(";",":"); },
		isContent:function(absoluteWrap){
			var o = this.abilityObject();
			var c = this.abilityCss();
			var p = this.abilityParameter();
			if(ISWRAP(this.Source,"[]")) return "array";
			if(absoluteWrap == true) if(ISWRAP(this.Source,"''",'""') == true) return "plain";
			if( (absoluteWrap == true && ISWRAP(this.Source,"{}")) || (o > 0 && o >= c && o >= p) ){
				return "object";
			} 
			if(p > 0) return "parameter";
			if(o > 0) return "css";
			return "plain";
		},
		getContentFunction:function(fs,is,js){
			return _Array( (js==true) ? OUTERSPLIT(this.Source,fs,["{}","[]",'""',"''"]) : this.Source.trim().split(fs) ).inject({},function(s,inj){
				var v = s.substr(s.indexOf(is)+1);
				if(s.trim().length > 0) inj[ UNWRAP(s.substr(0,s.indexOf(is)),['""',"''"]) ] = UNWRAP((js == true) ? _String(v).getContent(true) : v,['""',"''"]);
				return inj;
			});
		},
		getContent:function(absoluteWrap){
			switch(this.isContent(absoluteWrap)){
				case "object"       : return this.getContentFunction(",",":",true); break;
				case "parameter"    : return this.getContentFunction("&","="); break;
				case "css"          : return this.getContentFunction(";",":"); break;
				case "array"        :
					var a = OUTERSPLIT(this.Source,",",["{}","[]",'""',"''"]);
					if(a == ""){
						return [];
					} else {
						return _Array(a).inject([],function(s,inj){
							inj.push(UNWRAP( _String(s).getContent(true) , ["''",'""'] )); 
							return inj; 
						});
					}
					break;
				case "plain" : 
					if(!isNaN(this.Source) && this.Source !== ""){
						return parseFloat(this.Source);
					} else {
						return this.Source;
					}
				break;
			};
		},
		getJSON:function(){ return JSON.stringify(this.getContent());},
		//reverse
		getReverse : function() { return this.Source.split("").reverse().join(""); },
		reverse    : function()   { this.Source = this.getReverse(); return this; },
		//printf
		getPrintf:function(f){
			if(typeof f == "object"){
				if(f instanceof RegExp){
					if( f.test(this.Source) ) {
						f = f.exec(this.Source);
					} else {
						//debugger;
						console.warn("String::getPrintf::printf 할수 없습니다.",this.Source,f);
						return this.Source;
					}
				}
				var result  = "";
				for(var i=1,l=arguments.length;i<l;i++){
					switch(typeof arguments[i]){
						case "object":
							if(typeof arguments[i][0] == "string" || typeof arguments[i][0] == "number") if(arguments[i][0] in f) result = result + f[arguments[i][0]];
							break;
						case "number": case "string":
							result = result + arguments[i];
							break;
						default:break;
					}
				}
				return result;
			} else if(typeof f == "string" || typeof f == "number"){
				var i = -1;
				var p = Array.prototype.slice.call(arguments);
				return this.Source.replace(/%@/gi,function(){
					i++;
					if(typeof p[i] == "string" || typeof p[i] == "number"){
						return p[i]+"";
					} else {
						return "";
					}
				});
			} else {
				console.warn("getPrintf::파라메터가 존재하지거나 올바르지 않습니다.",arguments);
				return this.Source+"";
			}
		},
		printf:function(){
			this.Source = this.getPrintf.apply(this,arguments);
			return this.Source;
		},
		//remove
		getRemove:function(target){
			var index = this.Source.indexOf(target);
			if(index < 0)return this.Source;
			var targetLength = target.length;
			return this.Source.substr(0,index) + this.Source.substr(index + targetLength,this.Source.length);
		},
		remove:function(target){
			this.Source = this.getRemove(target);
			return this;
		},
		//model
		getRemoveModel:function(target,space){
			space = space ? space : " ";
			var models = this.Source.split(space);
			var reg = (target instanceof RegExp) ? target : new RegExp(target);
			var result = [];
			for (var i=0,l=models.length;i<l;i++) if(reg.test(models[i]) == false) result.push(models[i]);
			return result.join(space);
		},
		removeModel:function(target,space){
			this.Source = this.getRemoveModel(target,space);
			return this;
		},
		hasModel:function(target,space){
			space = space ? space : " ";
			var models = this.Source.split(space);
			for (var i=0,l=models.length;i<l;i++) if(models[i] == target)  return true;
			return false;
		},
		getAddModel:function(target,space) { space = space ? space : " ";if(this.hasModel(target,space)) return this.Source; return this.Source + space + target; },
		addModel:function(target,space){
			this.Source = this.getAddModel(target,space);
			return this;
		},
		//prefix suffix
		getFix:function(p,s){ return (typeof p == "string"?p:"") + this.Source + (typeof s == "string"?s:""); }
	},function(param,jsonfy){
		if( typeof param == "undefined" || param == null ){
			this.Source = ""
		} else {
			this.Source = TOSTRING(param,10,jsonfy);
		}
	});

	// Number
	extendModule("String","Number",{
		// number core
		// spot 1:prefix 2:integer 3:floatValue 4:suffix
		__NumberInfo  : function(value){
			return /([\D]*)([\d\,]+|)+(\.[\d]+|)([\D]*)/.exec(value);
		},
		isNotANumber:function(){ var i = this.__NumberInfo(this.Source)[2]; if(i=="" || i.length < 1) return true; return false; },
		isANumber:function(){return !this.isNotANumber();},
		getNumberInfo : function(spot){
			var i = this.__NumberInfo(this.Source);
			//integer
			
			//, remove // 001 => 1;
			i[2] = i[2].replace(/\,/gi,"").replace(/(^[0]+\d|^[0])/,function(s){
				var lastChar = s.charAt(s.length-1);
				return lastChar == "0" ? "0" : lastChar;
			});
			
			// minors
			if(i[2] !== "0")  i[1] = i[1].replace(/(\-|\-\s)$/,function(s){ i[2] = "-" + i[2]; return ""; });
			
			//number
			if( (i[2]=="")  && (i[3]=="" )) i[5] = "";
			if( (i[2]!=="") && (i[3]=="" )) i[5] = i[2];
			if( (i[2]!=="") && (i[3]!=="")) i[5] = i[2]+i[3];
			if( (i[2]=="")  && (i[3]!=="")) i[5] = "0"+i[3];
			//float
			if( i[3] !== "") i[3] = "0"+i[3];
			//nothing
			if( i[2] == "") i[2] = "0";
			if( i[3] == "") i[3] = "0";
			if( i[5] == "") i[5] = "0";
		
			//result
			if(typeof spot == "number") return i[spot];
			var info =  { "prefix" : i[1], "suffix" : i[4], "integer" : i[2] * 1, "floatValue" : i[3] * 1, "number" : i[5] };
			if(typeof spot == "string") return info[spot];
			return info;
		},
		setNumberInfo : function(value,position){
			var i = this.getNumberInfo();
			switch(position){
				case 1: case "prefix"     : i["prefix"]     = value; break;
				case 4: case "suffix"     : i["suffix"]     = value; break;
				case 2: case "integer"    : i["integer"]    = value; break;
				case 3: case "floatValue" : i["floatValue"] = value; break;
				case 5: case "number"     : i["integer"]    = value; i["floatValue"] = 0; break;
				default: break;
			}
			this.Source = i.prefix + (parseInt(i.integer) + parseFloat(i.floatValue)) + i.suffix;
		},
		// getter // setter
		getInteger : function()  { return this.getNumberInfo(2); },
		getFloat   : function()  { return this.getNumberInfo(3); },
		getNumber  : function()  { return this.getNumberInfo(5); },
		getPrefix  : function()  { return this.getNumberInfo(1); }, 
		getSuffix  : function()  { return this.getNumberInfo(4); },
		integer    : function() { var p = this.getInteger(); return typeof p == "string" ? p*1 : this;},
		floatValue : function() { var p = this.getFloat();   return typeof p == "string" ? p*1 : this;},
		number     : function() { var p = this.getNumber();  return typeof p == "string" ? p*1 : this;},
		// already not support minus
		getTrunc : function(s) { var n = this.number(); return isNaN(s) ? (Math[n > 0 ? "floor" : "ceil"](n)) : (Math[n > 0 ? "floor" : "ceil"](n * Math.pow(0.1,parseInt(s))) * Math.pow(10,parseInt(s))); },
		trunc    : function(s){ this.setNumberInfo( this.getTrunc(s) , 5 ); return this; },
		//size
		less:function(n){
			if( n == isNaN(n) ) return false;
			if( this.isNotANumber() ) return false;
			return this.number() < parseFloat(n);
		},
		great:function(){
			if( n == isNaN(n) ) return false;
			if( this.isNotANumber() ) return false;
			return this.number() > parseFloat(n);
		},
		// math
		percentIn:function(withValue,trunc){
			//소비자가격을 입력하였다면 판매가격도 동기화된다
			var lv = _Number(withValue).number();
			var rv = this.number();
			var result = 0;
		
			//할인율 계산하고 적용
			if(rv > lv){
				result = 0;
			} else {
				result = ((lv - rv) / lv) * 100;
				result = isNaN(result) ? 0 : result;
			}
		
			if(typeof trunc == "number"){return _Number(result).getTrunc(trunc);}
			return result;
		},
		// expression
		expression:function(senceParameter,option){
			var senceNumber  = _Number(senceParameter);
			var optionNumber = _Number(option);
			var result       = NaN;
			switch ( senceNumber.prefix() ) {
				case "+"  : result = this.number() + senceNumber.number(); break;
				case "-"  : result = this.number() - senceNumber.number(); break;
				case "x"  : case "*" : result = this.number() * senceNumber.number(); break;
				case "/"  : result = this.number() / senceNumber.number(); break;
				case "%"  : result = this.number() % senceNumber.number(); break;
				case "++" : result = this.number() + 1; break;
				case "--" : result = this.number() - 1; break;
				case "."  : result = this.number(); break;
				case ".x" : case "?." : result = this.integer(); break;
				case "x." : case ".?" : result = this.floatValue(); break;
				case "?//": result = this.getSuffix(); break;
				case "//?": result = this.getPrefix(); break;
			}
			if(typeof targetPoint == "string"){
				var execResult = /(\+\=|)([0-9]+)(\.[0-9]|)/.exec(targetPoint);
				if(execResult[1] == "+="){
					if(execResult[3] == ""){
						targetPoint = parseInt(execResult[2]) + this.currentValue[0];
					} else {
						targetPoint = parseFloat(execResult[2] + execResult[3]) + this.currentValue[0];
					}
				}
			}
			return result;
		},
		// mask core
		defaultTranslation:{
            '0': {pattern: /\d/},
            '9': {pattern: /\d/, optional: true},
            '#': {pattern: /\d/, recursive: true},
            'A': {pattern: /[a-zA-Z0-9]/},
            'D': {pattern: /[a-zA-Z]/}
		},
		defaultOption:{},
		__Format:function(value,mask,reverse){
			//mask value
			switch(typeof mask){
				case "function" : mask = mask(value); break;
				case "string"   : break;
			}
			if(typeof mask !== "string") console.error("Number::getFormat::첫번째 파라메터는 반드시 string이나 function으로 string이 꼭 되도록 해주세요.",typeof mask,mask);
			//defaultOptions
			skipMaskChars = false;
			//idea by http://igorescobar.github.io/jQuery-Mask-Plugin/
            var buf = [];
            var m = 0; 
			var maskLen = mask.length;
            var v = 0;
			var valLen = value.length;
            var offset = 1;
			var addMethod = "push";
            var resetPos = -1;
            var lastMaskChar,check;
			//
            if (reverse) {
                addMethod = "unshift";
                offset = -1;
                lastMaskChar = 0;
                m = maskLen - 1;
                v = valLen - 1;
                check = function () {
                    return m > -1 && v > -1;
                };
            } else {
                lastMaskChar = maskLen - 1;
                check = function () {
                    return m < maskLen && v < valLen;
                };
            }

            while (check()) {
                var maskDigit   = mask.charAt(m);
                var valDigit    = value.charAt(v);
	
                var translation = this.defaultTranslation[maskDigit];
                if (translation) {
                    if (valDigit.match(translation.pattern)) {
                        buf[addMethod](valDigit);
                         if (translation.recursive) {
                            if (resetPos === -1) {
                                resetPos = m;
                            } else if (m === lastMaskChar) {
                                m = resetPos - offset;
                            }
                            if (lastMaskChar === resetPos) {
                                m -= offset;
                            }
                        }
                        m += offset;
                    } else if (translation.optional) {
                        m += offset;
                        v -= offset;
                    }
                    v += offset;
                } else {
                    if (!skipMaskChars) {
                        buf[addMethod](maskDigit);
                    }
        
                    if (valDigit === maskDigit) {
                        v += offset;
                    }

                    m += offset;
                }
            }
            var lastMaskCharDigit = mask.charAt(lastMaskChar);
            if (maskLen === valLen + 1 && !this.defaultTranslation[lastMaskCharDigit]) { buf.push(lastMaskCharDigit); }
            return buf.join("");
		},
		getNumberFormat : function(mask,reverse){
			if(this.getNumber().indexOf("-") == 0){
				return "-" + this.__Format(this.getNumber().substr(1),mask,reverse);
			} else {
				return this.__Format(this.getNumber(),mask,reverse);
			}
		},
		numberFormat    : function(){ this.Source = this.getFormat.apply(this,arguments); return this; },
		getNumberText       : function(v) { return this.Source.replace(/\D/gi,""); },
		getNumberTextFormat : function(mask,reverse){ return this.__Format(this.getNumberText(),mask,reverse); },
		numberTextFormat    : function(){ this.Source = this.getFormat.apply(this,arguments); return this; },
		//format getter
		getPhoneNumber : function(){
			return this.getNumberTextFormat(function(number){
				if( /^02/.test(number) == true ) {
					if(number.length < 10){
						return "(00)000-00000";
					} else {
						return "(00)0000-0000";
					}
				} else if(/^1/.test(number) == true){
					return "0000-0000";
				} else {
					if(number.length < 11) {
						return "(000)000-00000";
					} else {
						return "(000)0000-0000";
					}
				}
			});
		},
		getDecimal:function(p,s){ return  _String(this.getNumberFormat("#,##0",true)).getFix(p,s);  },
		// calc line
		getPercentOf : function(maxValue)     { return this.number()/maxValue?maxValue:0*100;         },
		getPointOf   : function(lengthValue)  { return lengthValue?lengthValue:0/this.integer()*100;  },
		getLengthOf  : function(percentValue) { return this.integer()*percentValue?percentValue:0/100 },
		getGCD:function(value){
			function gcd(p, q){
			    if(q==0)return p;
			    var r = p % q;
			    return gcd(q, r);
			}
			return gcd(this.integer(),value);
		},
		// P1 전체 그룹의 갯수
		// P2 전체 그룹의 current는 몇번째 그룹인지
		getGroupsCount:function(groupLength,current){
			if(typeof current == "undefined") return Math.ceil(this.integer() / groupLength);
			return Math.floor(current / groupLength);
		},
		getTurning:function(cIndex){
			var integer = this.integer();
			if(cIndex<0){var abs=Math.abs(cIndex);cIndex=integer-(abs>integer?abs%integer:abs); };
			return (integer>cIndex)?cIndex:cIndex%integer();
		},
		getTurningInfo:function(cIndex){
			return {
				"turning" : this.getTurning(cIndex),
				"group"   : Math.floor(cIndex/this.Source)
			}
		}
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
						var rankResult = MV(this.Source);
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
	
	
	//******************
	//ClientKit
	makeSingleton("_Client",{
		agent :function(t){ 
			if(typeof t == "string"){
				return ((navigator.userAgent||navigator.vendor||window.opera).toLowerCase().indexOf(t.toLowerCase()) > -1);
			} else {
				return navigator.userAgent||navigator.vendor||window.opera;
			}
		},
		width :function(){ return (window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth); },
		height:function(){ return (window.innerHeight|| document.documentElement.clientHeight|| document.getElementsByTagName('body')[0].clientHeight); },
		bound :function(){ return {"width":this.width(),"height":this.height()}; },
		//document path
		url      : function()    { return window.document.URL.toString(); },
		urlInfo  : function(url)    {
			if(typeof url == "object") {
				if( url["ConstructorMark"] ==  ("ClientURLInfo" + W.nody)){
					return url;
				} else {
					null;
				}
			}
			try {
				var info = /([\w]+)(\:[\/]+)([^/]*\@|)([\w\d\.\-\_\+]+)(\:[\d]+|)(\/|)([\w\d\.\/\-\_]+|)(\?[\d\w\=\&\%]+|)(\#[\d\w]*|)/.exec(url?url:this.url());
				return {
					"ConstructorMark" : "ClientURLInfo" + W.nody,
					"url"      : this.url(),
					"protocol" : info[1],
					"divider"  : info[2],
					"userinfo" : info[3],
					"hostname" : info[4],
					"port"     : info[5].substring(1),
					"path"     : info[6]+info[7],
					"query"    : info[8],
					"fragment" : info[9],
					"filename" : /(\/|)([\w\d\.\-\_]+|)$/.exec(info[6]+info[7])[2]
				}
			} catch(e) {
				return null;
			}
		},
		root      : function(url,slash) { var h = this.urlInfo(url); return h.protocol + h.divider + h.hostname + (h.port != ""?":"+h.port:h.port) + (slash==false?"":"/"); },
		protocol  : function(url) { var h = this.urlInfo(url); return h.protocol; },
		uri       : function(url) { var h = this.urlInfo(url); return h.path;     },
		filename  : function(url) { var h = this.urlInfo(url); return h.filename; },
		filepath  : function(url,slash) { 
			var h = this.urlInfo(url);
			var root = h.protocol + h.divider + h.hostname + (h.port != ""?":"+h.port:h.port);
			return root + h.path.replace(/\/[^\/]+$/,"") + (slash==false?"":"/");
		},
		getAbsolutePath:function(url,fp){
			if(ISNOTHING(url)){
				return this.url();
			} else if(ISTEXT(url)){
				if(this.urlInfo(url)==null){
					url = url.trim();
					if(url.indexOf("./") == 0) { url = url.substr(2); } 
					if(url.indexOf("/") == 0 ){
						return this.root(undefined,false)+url;
					} else {
						var rootUp = 0;
						var filePath    = this.filepath(fp);
						var replacePath = url.replace(/\.\.\//gi,function(s){ rootUp++;return "";});
						for(var i=0;i<rootUp;i++) filePath = filePath.replace(/[^\/]+\/$/,"");
						return filePath + replacePath;
					}
				}
			}
			return url;
		},
		query     : function(url) { var h = this.urlInfo(url); return h.query;    },
		fragment  : function(url) { var h = this.urlInfo(url); return h.fragment; },
		queryData : function(url) { var h = this.urlInfo(url); return OBJECT(h.query); },
		//script path
		scriptUrl  : function()   { 
			return (function(){ 
				var find    = false;
				console.log(document.getElementsByTagName('script') instanceof NodeList );
				console.log(ISARRAY(document.getElementsByTagName('script')));
				
				var scripts = _Array(document.getElementsByTagName('script'));
				console.log("scripts.length",scripts.length);
				
				var scriptString = scripts.filter(function(s){ 
										console.log("hihi",s.toString(),ELTRACE(s) );
										if(ISELNODE(s)){	
											if(!find) if(s.src.search("nody") > -1) {find=true; return true;} 
										}
									}).useFirst().src;
									console.log(scriptString);
				// ie7 fix 
				if(!/^[\w]+\:\//.test(scriptString)) scriptString = _Client.root() + scriptString;
				return scriptString;
			})(); 		
		},
		scriptInfo : function(url) { return this.urlInfo(url?url:this.scriptUrl()); },
		scriptName : function(url) { return this.scriptInfo(url).filename },
		scriptPath : function(url) { return this.scriptInfo(url).path     },
		scriptRoot : function(url) { return /(.*\/|\/|)[^\/]*$/.exec(this.scriptInfo(url).path)[1] },
		//cookie
		setCookie:function (name, value, expire, path) { document.cookie = name + "=" + escape(value) + ((expire == undefined) ?"" : ("; expires=" + expire.toGMTString())) + ";path=" + (typeof path == "undefined"?"/":escape(path)) },
		getCookie:function (name,path) {
		  var search = name + "="; 
		  if (document.cookie.length > 0) {
		    var offset = document.cookie.indexOf(search); 
		    if (offset != -1){
		        offset += search.length;
		        var end = document.cookie.indexOf(";", offset);
		        if (end == -1) 
		          end = document.cookie.length; 
		        return unescape(document.cookie.substring(offset, end)); 
		    }
		  }
		  return null;
		},
		usingCookie:function (name) { if(this.getCookie(name))return true;return false; },
		touchCookie:function (name, expireTime, cookieValue) {
			if(!this.getCookie(name)) {
				if(!cookieValue)cookieValue = "true";
				//expireTime default 16h
				if(!expireTime) expireTime  = 57600000;
				var now    = new Date();
				var expire = new Date();
				expire.setTime(now.getTime()+expireTime);
			    setCookie(name, cookieValue, expire); 
				return true;
			}
			return false;
		},
		removeCookie:function(name,path){ path = ";path=" + (typeof path == "undefined"? "/" : escape(path)); document.cookie=name+"="+path+";expires=Thu, 01 Jan 1970 00:00:01 GMT"; },
		encodeString:function(v){ return TOSTRING(v,99,true); },
		decodeString:function(v){ 
			if(typeof v == "string") { 
				try{ 
					if(typeof v == "string"){
						if( v.charAt(0)=="\"" && v.charAt(v.length-1)=="\"" ){
							return v.substr(1,v.length-2);
						} else {
							return eval("(" + v + ")");
						}
					}
				} catch(e) {
					console.error("decodeString::디코딩실패 ->",v,"<-");throw e;
				}
			}
			return v; 
		},
		setLocalData:function(k,v){
			if(this.agent("adobeair")){
				 var utf8v = new air.ByteArray();
				 utf8v.writeUTFBytes(this.encodeString(v));
				 air.EncryptedLocalStore.setItem(k,utf8v);
			} else {
				return this.setCookie(k,this.encodeString(v));
			}
		},
		getLocalData:function(k){
			if(this.agent("adobeair")){
				var bi = air.EncryptedLocalStore.getItem(k);
				if(bi==null){
					return undefined;
				} else {
					return this.decodeString(bi.readUTFBytes(bi.bytesAvailable));
				}
			} else {
				return this.decodeString(this.getCookie(k));
			}
		},
		usingLocalData:function(k){
			if(this.agent("adobeair")){
				return (air.EncryptedLocalStore.getItem(k) ? true : false);
			} else {
				return this.usingCookie(k);
			}
		},
		touchLocalData:function(k,v){
			if(this.agent("adobeair")){
				if( !this.usingLocalData ) this.setLocalData(k,v);
			} else {
				return this.touchCookie(k,v);
			}
		},
		removeLocalData:function(k){
			if(this.agent("adobeair")){
				air.EncryptedLocalStore.removeItem(k);
			} else {
				return this.removeCookie(k);
			}
		},
		//random
		base64Token  : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
		base64Random : function(length,codeAt,codeLength){
			length     = (isNaN(length)) ? 1 : parseInt(length);
			codeAt     = (isNaN(codeAt)) ? 0 : parseInt(codeAt);
			codeLength = (isNaN(codeLength)) ? 64 - codeAt : parseInt(codeLength);
			var result = "";
			for(var i=0,l=length;i<l;i++) result = result + this.base64Token.charAt( codeAt + parseInt(Math.random() * codeLength) );
			return result;
		},
		random:function(length) { return parseInt(this.base64Random(length,52,10)); },
		numberRandom:function(length) { return this.base64Random(length,52,10); },
		base36Random:function(length) { return this.base64Random(length,26,36); },
		//include
		include:function(aFilename){
			var filetype = /\.([^\.]+)$/.exec(aFilename)[1];
			if (filetype=="js"){ 
				//if aFilename is a external JavaScript file
				var fileref=document.createElement('script');
				fileref.setAttribute("type","text/javascript");
				fileref.setAttribute("src", aFilename);
			}
			else if (filetype=="css") {
				//if aFilename is an external CSS file
				var fileref=document.createElement("link");
				fileref.setAttribute("rel", "stylesheet");
				fileref.setAttribute("type", "text/css");
				fileref.setAttribute("href", aFilename);
			}
			document.getElementsByTagName("head")[0].appendChild(fileref);
		},
		//clipboard
		setClipboard:function(s){
			//http://stackoverflow.com/questions/7713182/copy-to-clipboard-for-all-browsers-using-javascript
		    if( window.clipboardData && clipboardData.setData ) { 
				clipboardData.setData("Text", s); 
			} else {
		        // You have to sign the code to enable this or allow the action in about:config by changing
		        user_pref("signed.applets.codebase_principal_support", true);
		        netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
		        var clip = Components.classes['@mozilla.org/widget/clipboard;[[[[1]]]]'].createInstance(Components.interfaces.nsIClipboard);
		        if (!clip) return;
		        // create a transferable
		        var trans = Components.classes['@mozilla.org/widget/transferable;[[[[1]]]]'].createInstance(Components.interfaces.nsITransferable);
		        if (!trans) return;
		        // specify the data we wish to handle. Plaintext in this case.
		        trans.addDataFlavor('text/unicode');
		        // To get the data from the transferable we need two new objects
		        var str = new Object();
		        var len = new Object();
		        var str = Components.classes["@mozilla.org/supports-string;[[[[1]]]]"].createInstance(Components.interfaces.nsISupportsString);
		        var copytext=meintext;
		        str.data=copytext;
		        trans.setTransferData("text/unicode",str,copytext.length*[[[[2]]]]);
		        var clipid=Components.interfaces.nsIClipboard;
		        if (!clip) return false;
		        clip.setData(trans,null,clipid.kGlobalClipboard);      
		    }
		},
		getCursorPoint:function(e) {
		    e = e || window.event; 
			var cursor = { x: 0, y: 0 };
		    if (e.pageX || e.pageY) {
		        cursor.x = e.pageX;
		        cursor.y = e.pageY;
		    } else {
		        cursor.x = e.clientX + 
		        (document.documentElement.scrollLeft || 
		        document.body.scrollLeft) - 
		        document.documentElement.clientLeft;
		        cursor.y = e.clientY + 
		        (document.documentElement.scrollTop || 
		        document.body.scrollTop) - 
		        document.documentElement.clientTop;
		    }
		    return cursor;
		},
		isMobile:function(){
			// http://detectmobilebrowser.com/mobile
			var a = this.agent();
			return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4));
		},
		getWindowsVersion:function(){
			return ( navigator.appVersion.indexOf("MSIE") === -1 ) ? -1 : parseInt( /MSIE\s([0-9]+)/.exec(navigator.appVersion)[1] );
		},
		getNTVersion:function(){
			//nt == 6 => vista, 7, 8
			//nt == 5 => xp
			//nt == 4 => old windows
			//nt == -1 => other os
			var version = navigator.appVersion;
			var nt = -1;
			if( version.indexOf("NT") != -1 ){
				try       { return parseInt( /NT\s([0-9]+)/.exec(version)[1] ); } 
				catch (e) { return 4; }
			}
	    if(version.indexOf("9x 4.90") != -1) return 0;
	    if(version.indexOf("98") != -1)      return 0;
	    if(version.indexOf("95") != -1)      return 0;
	    if(version.indexOf("Win16") != -1)   return 0;
	    if(version.indexOf("Windows") != -1) return 0;
		   return -1;
		},
		getIEVersion:function(){
			return (navigator.appVersion.indexOf("MSIE") === -1) ? -1 : parseInt( /MSIE\s([0-9]+)/.exec(navigator.appVersion)[1] );
		},
		//flash version check
		getFlashVersion:function(){
		    // ie
		    try {
		      try {
		        var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
		        try { axo.AllowScriptAccess = 'always'; }
		        catch(e) { return '6,0,0'; }
		      } catch(e) {}
		      return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
		    // other browsers
		    } catch(e) {
		      try {
		        if(navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin){
		          return (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
		        }
		      } catch(e) {}
		    }
			//maybe plugin not exist
		    return '0,0,0';
		},
		getMajorFlashVersion:function(){
			return parseInt(this.getFlashVersion().split(',')[0]);
		}
	});
	
	//******************
	//UID //Meta
	W.ManagedUIDObjectData = [];
	makeSingleton("UID",{
		get:function(idObject){
			if(typeof idObject == "object" || typeof idObject == "function"){
				for(var i=0,l=W.ManagedUIDObjectData.length;i<l;i++) if(W.ManagedUIDObjectData[i] == idObject) return i;
				W.ManagedUIDObjectData.push(idObject);
				return W.ManagedUIDObjectData.length - 1;
			}
		},
		getObject:function(i){
			return W.ManagedUIDObjectData[i];
		},
		destroy:function(idObject){
			switch(typeof idObject){
				case "object":
					for(var i=0,l=W.ManagedUIDObjectData.length;i<l;i++) if(W.ManagedUIDObjectData[i] == idObject) {
						W.ManagedUIDObjectData[i] = undefined;
						return i;
					}
					break;
				case "number":
					idObject = parseInt(idObject);
					if(typeof W.ManagedUIDObjectData[idObject] !== "undefined"){
						W.ManagedUIDObjectData[idObject] = undefined;
						return idObject;
					}
					break;
				default: break;
			}
		}
	});
	W.ManagedMetaObjectData = [];
	makeModule("Meta",{
		//validate
		isVaild :function() { return this.Source == false ? false : true; },
		//data
		data    :function(v){ if(this.isVaild()){ return W.ManagedMetaObjectData[this.Source]; } },
		getOwner:function() { if(this.isVaild()) return UID.getObject(this.Source); },
		//prop
		getProp :function(propName){ if(typeof propName == "string" || typeof propName == "number"){ return W.ManagedMetaObjectData[this.Source][propName]; } },
		setProp :function(propName,value){ if(typeof propName == "string" || typeof propName == "number"){ W.ManagedMetaObjectData[this.Source][propName] = value;} return this; },
		hasProp :function(propName){ if(typeof propName == "string" || typeof propName == "number") return (propName in W.ManagedMetaObjectData[this.Source]); return false; },
		removeProp:function(propName){ if( this.hasProp(propName) ) delete anagedMetaObjectData[this.Source][propName]; return this; },
		//Destroy
		destroy   :function() { if(this.isVaild()){ W.ManagedMetaObjectData[this.Source] = undefined; UID.destroy(this.Source); return true;} return false; },
		lastProp:function(propName){ var r = this.getProp(propName); this.destroy(); return r; },
		lastData:function(){ var r = this.data(); this.destroy(); return r; },
		destroyTimeout:function(time){ var own = this; setTimeout(function(){ own.destroy(); },NUMBER(time));}
	},function(v,d){
		if(typeof v == "object" || typeof v == "function"){
			this.Source = UID.get(v);
			if(!(this.Source in W.ManagedMetaObjectData)){
				if(typeof d == "object"){
					W.ManagedMetaObjectData[this.Source] = MV(d);
				} else if(typeof d == "undefined"){
					W.ManagedMetaObjectData[this.Source] = {};
				} else {
					console.warn("Meta::init::Meta의 셋팅할 property값은 Object만 가능합니다. => ",v,d)
					W.ManagedMetaObjectData[this.Source] = {};
				}
			}
		} else {
			console.error("Meta::init::Meta는 Object나 function만 가능합니다. => ",v,d)
			this.Source = false;
		}
	});
	_Meta.trace = function(){
		var r = ["TRACE MetaData"];
		for(var i=0,l=W.ManagedUIDObjectData.length;i<l;i++){
			r.push(MAX(TOSTRING(W.ManagedUIDObjectData[i]),40) + "  ||  " + TOSTRING(W.ManagedMetaObjectData[i]));
		}
		return r.join("\n");
	}
	//***************
	//deprecated uid
	//******************
	//UIDInterface
	makeModule("UIDInterface",{},function(){this.__uid__ = _Meta(this).get();});
	
	
})(window));
//Nody DHTML Foundation
(+(function(W){
	if(W.nodyLoadException==true){ throw new Error("Nody DHTML Foundation init cancled"); return;}
	/******************
	E,R element command Extention*/
	makeSingleton("ElementFoundation",{
		//테그의 속성을 text로 표현합니다.
		"TAGINFO"   : function(tagProperty,attrValue,dataValue){
			//name refactory
			var name = (typeof tagProperty == "undefined") ? "*" : tagProperty ;
			name = name.trim();
			
			var attributedToken = {};
			attributedToken.tagName  = "";
	
			//value attr in tagMeta & tagValue
			name = name.replace(/(\:[\w\-]+\([\S]+\)|\:\:.*$|\:[\w\-]+)/gi,function(s){ 
				if(s.indexOf("::") == 0){
					attributedToken.tagValue = s.substr(2);
				} else {
					
					var la = /(\:[\w\-\_]+|[\w\-\_]+)(\(.*\)|)$/.exec( s.toLowerCase().trim() );
					var ls = la[1].trim();
					var lv = la[2].substr(1,la[2].length-2).trim();
					console.log("la",s,TOSTRING(la));
					switch(ls){
						case ":disabled": case ":readonly": case ":checked":
							attributedToken[ls.toLowerCase().substr(1)] = true;
							break;
						case ":eq": case ":nth-child":
							if(!("@meta" in attributedToken)) attributedToken["@meta"] = {};
							attributedToken["@meta"][ls.substr(1)] = (lv == "even" || lv == "odd" ) ? lv : TONUMBER(lv);
							break;
						case ":contains": case ":has": case ":not":
							if(!("@meta" in attributedToken)) attributedToken["@meta"] = {};
							attributedToken["@meta"][ls.substr(1)] = lv;
							break;
						case ":first-child": case ":last-child": case ":only-child": case ":even": case ":odd":
							if(!("@meta" in attributedToken)) attributedToken["@meta"] = {};
							attributedToken["@meta"][ls.substr(1)] = null;
							break;
						default :
							try{
								var capture = /([\w]+)\(([\S\,]+)\)/i.exec(ls);
								if(ISNOTHING(capture)) throw new Error("unsupported");
								attributedToken[capture[1]] = UNWRAP(capture[2],["",'']);
							} catch(e){
								console.warn("TAGINFO::지원하지 않는 메타키 입니다. => ",s," <=",tagProperty);
							}
							break;
					}
				}
				return "";
			});
			//name = name.replace(/(\:\:.*$)/i,function(s){ attributedToken.tagValue = s.substr(2); return ""});
			
			//both attribute case
			name = name.replace(/\[([\w\-]+)\=([^\]]*)\]/gi,function(s){
				var attr = /\[([\w\-]+)\=([^\]]*)\]/gi.exec(s);
				attributedToken[attr[1]] = attr[2];
				return "";
			});
	
			//single attribute case
			name = name.replace(/\[([\w\-^\=]+)\]/gi,function(s){
				var attr = /\[([\w\-^\=]+)\]/gi.exec(s);
				attributedToken[attr[1]] = null;
				return "";
			});
	
			//tag
			name.replace(/^([\w\*]*)/gi,function(s){attributedToken.tagName = s;});
			
			if(attributedToken.tagName == ""){
				delete attributedToken["tagName"];
			} else {
				attributedToken.tagName = attributedToken.tagName.toLowerCase();
				switch(attributedToken.tagName){
					case "input" : break;
					case "checkbox": case "file": case "hidden": case "hidden": case "password": case "radio": case "submit": case "text": case "reset": case "image": case "number" :
						attributedToken["type"] = attributedToken.tagName;
						attributedToken.tagName = "input";
					default: break;
				}
			}
			//attribute id
			name.replace(/(\#[\w\-]+)/i,function(s){ attributedToken["id"] = s.substr(1); });
			
			//attribute class
			name.replace(/(\.[\w\-]+)/gi,function(s){ 
				if (typeof attributedToken["class"] == "undefined") {
					attributedToken["class"] = "";						
					attributedToken["class"] = attributedToken["class"] + s.substr(1);
				} else {
					attributedToken["class"] = attributedToken["class"] + " " + s.substr(1);
				}
			});
	
			//attribute name
			name.replace(/(\![\w\-]+)/i,function(s){ 
				if(attributedToken["tagName"] == "option"){
					attributedToken["value"] = s.substr(1); 
				} else {
					attributedToken["name"] = s.substr(1); 
				}
			});
	
			//attribute type
			name.replace(/(\?[\w\-]+)/i,function(s){ attributedToken["type"] = s.substr(1); });
	
			//value attr in attrValue
			var attrvals = MV(OBJECT(attrValue,"html"));
			if(attrvals["html"]) { 
				attributedToken.tagValue = attrvals["html"]; delete attrvals["html"]; 
			}
			for(var key in attrvals) { attributedToken[key] = attrvals[key]; };
	
			//data attr
			var datavals = MV(OBJECT(dataValue,"value"));
			for(var key in datavals) { attributedToken[ "data-" + key ] = attrvals[key]; };
			
			return attributedToken;
		},
		//css스타일 태그를 html스타일 태그로 바꿉니다.
		"TAG"      : function(tagProperty,attrValue,dataValue){
			//tagInfo
			var tagInfo = TAGINFO(tagProperty,attrValue,dataValue);
			if(!("tagName" in tagInfo) || tagInfo.tagName == "*") tagInfo.tagName = "div";
			//make attribute text
			var attributedTexts = "";
			for(var name in tagInfo) switch(name){
				case "tagName":case "tagValue":case "@meta": break;
				default:
					var atValue = tagInfo[name];
					if(typeof atValue == undefined || atValue == null){
						attributedTexts = attributedTexts + (" " + name);
					} else {
						attributedTexts = attributedTexts + (" " + name + '="'+ (atValue+"").trim() +'"');
					}
					break;
			}
			attributedTexts = attributedTexts.trim();
	
			//common attribute process
			var name     = "<" + tagInfo.tagName + (attributedTexts.length < 1 ? "" : (" " + attributedTexts));
			
			var tagValue = "tagValue" in tagInfo ? tagInfo.tagValue : "";

			//close tag
			if(tagInfo.tagName.toLowerCase() == "input"){
				if(tagValue){
					name = name + ' value="' + tagValue + '"/>';
				} else {
					name = name + '/>';
				}
			} else {
				name = name + '>' + tagValue + '</' + tagInfo.tagName + '>';
			}
			return name;
		},
		"NODEZERO":function(v){
			if( ISARRAY(v) ) for(var i=0,l=v.length;i<v;i++) if(ISELNODE(v[i])) return v[i];
			if( ISELNODE(node) ) return v;
			return ;
		},
		"NODEATTR":function(node,v1,v2){
			if(!ISELNODE(node)) { console.error("NODEATTR은 element만 가능합니다. => 들어온값" + TOS(node)); return null; }
			if(typeof v1 == "object") {
				for(var k in v1) node.setAttribute(k,k1[v]);
			} else if(typeof v1 == "string"){
				var readMode   = typeof v2 == "undefined";
				var lowerKey = v1.toLowerCase();
				switch(lowerKey){
					case "readonly":
						if("readOnly" in node){
							if(readMode){
								return node.readOnly;
							} else {
								node.readOnly = v2;
								return node;
							}
						} 
						break;
					case "disabled": case "checked":
						if(lowerKey in node){
							if(readMode){
								return node[lowerKey];
							} else {
								node[lowerKey] = v2;
								return node;
							}
						}
						break;
				}
				if(readMode){
					var result = (node.getAttribute && node.getAttribute(v1)) || null;
			        if( !result ) {
			            var attrs = node.attributes;
			            if(!ISNOTHING(attrs)){
			            	var length = attrs.length;
			            	for(var i = 0; i < length; i++) if(attrs[i].nodeName === v1) result = attrs[i].nodeValue;
			            }
			        }
			        return result;
				} else {
					node.setAttribute(v1,v2);
				}
			}
			return node;
		},
		"NODEPARENTS":function(node){
			if(!ISELNODE(node)) return;
			var finded = [];
			var findWhile = function(node){
				if(node.parentElement){
					finded.push(node.parentElement);
					findWhile(node.parentElement);
				}
			};
			findWhile(node);
			return finded;
		},
		"NODEPARENT":function(node){
			if(!ISELNODE(node)) return ;
			return node.parentElement;
		},

		//포커스 상태인지 검사합니다.
		"NODEHASFOCUS":function(node){ return document.activeElement == node; },
		"ELHASFOCUS":function(aSel){ return document.activeElement == FINDZERO(aSel); },
		//케럿을 움직일수 있는 상태인지 검새합니다.
		"ELCARETPOSSIBLE":function(aSel){ var node = FINDZERO(aSel); if( ELHASFOCUS(node) == true) if(node.contentEditable == true || window.getSelection || document.selection) return true; return false; },
		//node the
		"NODETHE":function(node,selectText,extraData){
			var tagInfo = TAGINFO(selectText);
			for(var key in tagInfo){
				switch(key){
					case "tagName":
						if(node.tagName.toLowerCase() !== tagInfo.tagName) return false;
						break;
					case "class":
						var nodeClass = ELATTR(node,key);
						var infoClass = tagInfo[key];
						if(typeof nodeClass == "string"){
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
					case "tagValue":
						if(ELVALUE(node) !== tagInfo[key]) return false;
						break;
					case "@meta":
						for(var metaKey in tagInfo[key]){
							switch(metaKey){
								case "not":
									if( NODETHE(node,tagInfo[key][metaKey]) ) return false;
									break;
								case "focus":
									if(!NODEHASFOCUS(node)) return false;
									break;
								case "eq": case "nth-child":
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
		},
		"NODEIS":function(node,value,extraData){
			//
			if(!ISELNODE(node)) return false;
			if(typeof value !== "string") return true;
			value = value.trim();
			if(value == "*" || value == "") return true;
			
			var queryCase = OUTERSPLIT(value,",",["()"]); 
			var judgement;
			for(var qi=0,ql=queryCase.length;qi<ql;qi++){
				//
				if(judgement == true) break;
				//
				var selectText = queryCase[qi];
				var querys = [];
				selectText.trim()
				.replace(/[\n]|[\s]{2,}/g," ")
				.replace(/\s*(\>|\+)\s*/g,function(s){ return s.replace(/\s/g,""); })
				.replace(/[\w\-\_\.\#\:]+(\s|\>|)/g,function(s){ querys.push(s); });
				//
				//console.log("qi",qi,"ql",ql,"each",querys,"qlenght",querys.length);
				if(querys.length == 0){
					judgement = false;
				} else if(querys.length == 1) {
					judgement = NODETHE(node,querys[0]);
				} else {
					var allNodes   = [node].concat(NODEPARENTS(node));
					var findThe    = 0;
					var lastResult = true;
					//console.log(allNodes);
					for(var i=querys.length-1;i>-1;i--){
						if(lastResult == false) break;
						switch(querys[i].substr(querys[i].length-1)){
							case " ":
								//console.log("case ' '");
								for(var f=findThe+1,l=allNodes.length-findThe;f<l;f++){
									findThe++;
									var queryText = querys[i].trim();
									console.log(NODETHE(allNodes[f],queryText),allNodes[f],queryText);
									if( NODETHE(allNodes[f],queryText) ){
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
								if(NODETHE(allNodes[findThe],queryText)){
									lastResult = true;
								} else {
									lastResult = false;
									break;
								}
								break;
							default:
								//console.log("case 'd'");
								if( NODETHE(allNodes[findThe],querys[i]) ){
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
			}
			return judgement;
		},
		"FEEDERASCEND":function(feeder,filter,ascend){
			if(typeof filter !== "function") console.error("FEEDASCEND의 두번째 파라메터는 function이여야 합니다");
			var ascendMethod
			switch(typeof ascend){case "function":ascendMethod=ascend;break;case "string":ascendMethod=function(fo){return fo[ascend];};break;default:return;break;}
			if(typeof feeder == "object"){
				var result;
				var current = feeder;
				do {
					var stopWhile = true;
					if( filter.call(current,current) ){
						
					} else {
						current = ascendMethod(current);
						if(typeof current == "object") stopWhile = false;
					}
				} while(stopWhile);
				return result;
			}
		},
		"FEEDERDOWN_WHILE":function(feeder,stopFilter,findChild){
			if( stopFilter.call(feeder,feeder) !== false ){
				var childs = TOARRAY(findChild.call(feeder,feeder));
				for(var i=0,l=childs.length;i<l;i++) FEEDERDOWN_WHILE(childs[i],stopFilter,findChild);
			}
		},
		"FEEDERDOWN":function(feeder,filter,feeddown){
			if(typeof filter !== "function") console.error("DATAFEEDDOWN 두번째 파라메터는 function이여야 합니다");
			var feeddownMethod;
			switch(typeof feeddown){case "function":feeddownMethod=feeddown;break;case "string":feeddownMethod=function(fd){return fd[feeddown];};break;default:return;break;}
			if(typeof feeder == "object") FEEDERDOWN_WHILE(feeder,filter,feeddownMethod,2);
		},
		"ELQUERY":function(query,root){
			if(typeof query !== "string" || ISNOTHING(query)) return [];
			var root   = ISDOCUMENT(root)?document.body.parentElement:ISELNODE(root)?root:document.body.parentElement;
			var result = [];
			FEEDERDOWN(root,function(node){ if( NODEIS(this,query) ) result.push(this); },"children");
			return result;
		},
		"ELTQ":function(query){
			MARK("elquerySPEED");
			var elquery_result = ELQUERY(query);
			MARK("elquerySPEED");
			MARK("sizzleSPEED");
			var sizzle_result  = ELQUERY(query);
			MARK("sizzleSPEED");
			console.log("##result same? => ",elquery_result.length == sizzle_result.length);
			console.log("elquery::("+elquery_result.length+")",elquery_result);
			console.log("sizzle::("+sizzle_result.length+")",sizzle_result);
			return elquery_result;
		},
		"ELATTR":function(sel,v1,v2){
			var node = FINDZERO(sel);
			return NODEATTR(node,v1,v2);
		},
		//css스타일로 el의 상태를 확인합니다.
		"ELIS":function(sel,value){
			var node = FINDZERO(sel);
			return NODEIS(node,value);
		},
		//선택한 element중 대상만 남깁니다.
		"ELFILTER":function(sel,filter){
			var targets = FIND(sel);
			if(typeof filter !== "string") {
				console.warn("ELFILTER는 string filter만 대응합니다.");
				return targets;
			} else {
				var result  = [];
				for(var i=0,l=targets.length;i<l;i++) if(ELIS(targets[i],filter)) result.push(targets[i]);
				return result;
			}
		},
		//el의 중요값을 찾습니다.
		"ELVALUE":function(aNode,value){
			var node,nodes = FIND(aNode);
			if(nodes.length == 0){
				return;
			} else if(nodes.length > 1){
				var nodeZero     = nodes[0];
				var nodeZeroName = ELATTR(nodeZero,"name");
				// radio group
				if(ELATTR(nodeZero,"type") == "radio"){
					//read write
					if(!ISNOTHING(nodeZeroName)){
						if(ISTEXT(value)){
							var findEl = FINDZERO(ELFILTER(nodes,"[type=radio][name="+nodeZeroName+"]::"+value));
							if(findEl) findEl.checked = true;
							return findEl;
						} else {
							var checkedEl  = ELFILTER(nodes,"[type=radio][name="+nodeZeroName+"]:checked");
							var selectedEl = FINDZERO(checkedEl);
							if(selectedEl){
								return selectedEl.value;
							} else {
								return "";
							}
						}
					}
				}
			}
			node     = ZERO(nodes);
			nodeName = node.tagName.toLowerCase();
			switch(nodeName){
				case "input": case "option": case "textarea":
					//get
					if(nodeName == "option"){
						var selNode = ELQUERY(":selected",node);
						if( ISELNODE(selNode) ) return selNode.value;
						return node.value;
					} else {
						if(typeof value == "undefined") return node.value;
					}
					
					
					//set
					var setVal = value+"";
				
					if(ELCARETPOSSIBLE(node)){
						var gap = node.value.length - value.length;
						var cur = ELCARET(node);
						node.value = value;
						ELCARET(node,cur-gap)
						ELTRIGGER(node,"value_change");
						return node;
					} else {
						node.value = value;
						ELTRIGGER(node,"value_change");
						return node;
					}
					break;
				case "select":
					if(typeof value == "undefined") return node.value;
					var valEl = FIND("[value="+ value +"]",node);
					if(valEl.length > 0) {
						var selEl = ZERO(valEl);
						selEl.selected = true;
						ELTRIGGER(node,"value_change");
						return selEl;
					}
					return false;
					break;
				default :
					if(typeof value == "undefined") return node.innerText;
					node.innerText = value;
				break;
			}
			return node;
		},
		"ELHASATTR":function(sel,name,hideConsole){
			var node = FINDZERO(sel);
			if( ISELNODE(node) ) { return ELATTR(sel,name) == null ? false : true; }
			if(hideConsole !== true) console.error("ELHASATTR:: 알수없는 node값 입니다. => " + TOS(node) );
			return false;
		},
		//get css style tag info
		"ELTRACE"   :function(target,sign,withValue){
			var t = FINDZERO(target);
			if( ISELNODE(t) ){
				switch(sign){
				case "tag"   : return t.tagName.toLowerCase(); break;
				case "id"    : return ELATTR(t,"id");          break;
				case "class" : return ELATTR(t,"class");       break;
				case "name"  : return ELATTR(t,"name");        break;
				case "value" : return ELVALUE(t);              break;
				default :
					var r = t.tagName.toLowerCase();
					var b;
					b = ELATTR(t,"id");    if(b) r = r + "#"+b;
					b = ELATTR(t,"class"); if(b) r = r + "."+b.split(" ").join(".");
					b = ELATTR(t,"name");  if(b) r = r + "[name="+b+"]"
					if( ((typeof sign == "undefined") && (withValue == true)) || ((sign == true) && (typeof withValue == "undefined")) ){
						b = ELVALUE(t); if(!ISNOTHING(b)) r = r + ":" + b;
					}
					return r;
					break;
				}
			} else {
				console.warn("ELTRACE::target is not element or selector // target =>",target);
			}
		},
		"FINDFUNCTION":function(find,root){
			if (typeof root !== "undefined"){
				if( ISELNODE(root) && ISELNODE(find) ){
					var finded = ELQUERY(ELTRACE(find),root);
					for(var i=0,l=finded.length;i<l;i++) {
						if(finded[i] == find) return [find];
					}
				}
				var findCollection = [];
				var roots = FINDFUNCTION(root);
				for(var i=0,l=roots.length;i<l;i++){ findCollection.push(ELQUERY(find,roots[i])); }
				return DATAUNIQUE.apply(undefined,findCollection);
			} else if( ISARRAY(find) ){
				var findCollection = [];
				for(var i=0,l=find.length;i<l;i++) { findCollection.push(FINDFUNCTION(find[i])); }
				return DATAUNIQUE.apply(undefined,findCollection);
			} else if( ISELNODE(find) ){
				return [find];
			}  else {
				return ELQUERY(find,W.document);
			}
			return [];
		},
		"DOCUMENTFIND":function(find,frame){
			if( ISDOCUMENT(frame) ){
				/* frame = frame; */
			} else {
				var findFrame = FINDFUNCTION(frame)[0];
				if( ISELNODE(findFrame) ){
					if (findFrame.tagName == "IFRAME"){
						var frame = findFrame.contentDocument || findFrame.contentWindow.document;
					} else {
						frame = W.document;
					}
				} else {
					frame = W.document;
				}
			}
			if(typeof find == "string"){
				return ELQUERY(find,frame);
			} else if(ISARRAY(find)){
				var findCollection = [];
				for(var i=0,l=find.length;i<l;i++) findCollection.push(DOCUMENTFIND(find[i],frame));
				return DATAUNIQUE.apply(undefined,findCollection);
			} else if(ISELNODE(find)){
				return [find];
			}  else {
				return [];
			}
		},
		"NODEMEMBER":function(node,offset){
			var target = node;
			if( (!ISELNODE(target)) || (!ISTEXTNODE(target)) ) return;
			if(typeof offset !== "number") return TOARRAY(node.parentElement.childNodes);
			var currentIndex = -1;
			DATAEACH(node.parentElement.children,function(node,i){ if(target == node) { currentIndex = i; return false; } });
			return target.parentNode.childNodes[currentIndex+offset];
		},
		"FINDMEMBER":function(sel,offset){
			var target = FINDZERO(sel);
			if(!ISELNODE(target)) return;
			if(typeof offset !== "number") return TOARRAY(node.parentElement.children);
			var currentIndex = -1;
			DATAEACH(target.parentNode.children,function(node,i){ if(target == node) { currentIndex = i; return false; } });
			return target.parentNode.children[currentIndex+offset];
		},
		"FIND" : CONTINUTILITY(function(find,root,eq){
			if(typeof root == "number"){
				eq   = root;
				root = undefined;
			}
			if(typeof eq == "number"){
				return FINDFUNCTION(find,root)[eq];
			} else {
				return FINDFUNCTION(find,root);
			}
		}),		
		// 배열이라면 엘리먼트의 하나 추출
		"FINDZERO" : CONTINUTILITY(function(find,root){
			return FINDFUNCTION(find,root)[0];
		}),
		"FINDIN" : CONTINUTILITY(function(root,find){
			return FINDFUNCTION( (ISNOTHING(find) ? "*" : find) ,root);
		},2),
		"FINDON": CONTINUTILITY(function(root,find){
			var finds = DATAMAP(FINDFUNCTION(root),function(node){
				return node.children;
			},DATAFLATTEN)
			switch(typeof find){
				case "number":
					return finds[find];
				case "string":
					return DATAFILTER(finds,function(node){
						return NODEIS(node,find);
					});
				default :
					return finds;
			}
		},2),
		"FINDPARENTS":function(el){ return NODEPARENTS(FINDFUNCTION(el)[0]); },
		"FINDPARENT" :CONTINUTILITY(function(el,require){
			var node = FINDFUNCTION(el)[0];
			if(!ISELNODE(node)) return ;
			if(typeof require == "string"){
				var parents = NODEPARENTS(node);
				for(var i in parents) if( NODEIS(parents[i],require) ) return parents[i];
				return undefined;
			} else {
				return node.parentElement;
			}
		}),
		"ELCALL":function(node,f){
			if(typeof f == "function"){
				var nodes = FIND(node);
				DATAEACH(nodes,function(n,i){
					f.call(n,n,i);
				});
				return nodes;
			}
			return [];
		},
		"ELINDEX":function(el){
			var node = FINDZERO(el);
			return DATAINDEX(FINDPARENT(node),node);
		},
		"ELTREE":function(find,root){
			return _Array(FIND(find)).map(function(node){
				var tree  = [];
				var cnode = node;
				do { if(cnode) tree.push( ELTRACE(cnode) ); cnode = cnode.parentElement; } while(cnode);
				return tree.reverse().join(" > ");
			}).join("\n\n");
		},
		"ONLYNODES": function(v){
			var nodes   = [];
			var targets = TOARRAY(v);
			for(var i=0,l=targets.length;i<l;i++){
				if( ISELNODE(targets[i]) || ISTEXTNODE(targets[i]) ){
					nodes.push(targets[i]);
				}
			}
			return nodes;
		},
		"ELAPPEND":function(parentIn,childs){
			var parent = FINDZERO(parentIn);
			if(!ISELNODE(parent)) return parentIn;
			var appendTarget  = ONLYNODES(childs);
			var parentTagName = parent.tagName.toLowerCase();
			for(var i=0,l=appendTarget.length;i<l;i++)
				if (ISELNODE(appendTarget[i])) {
					switch(parentTagName){
					case "table":
						var tagName = appendTarget[i].tagName.toLowerCase();
						switch(tagName){
							case "colgroup": case "tbody": case "thead": case "tfoot":
								parent.appendChild(appendTarget[i]);
								break;
							case "tr": case "td": case "th": default:
								window.tb = parent.tBodies;
								//tbody가 존재하지 않는 테이블이면 tbodies를 임의로 추가한다
								if(!parent.tBodies.length){ 
									if(!!parent.tFoot){
										parent.appendChild(EL("tbody")) ;
									} else {
										parent.insertBefore(EL("tbody"),parent.tFoot);
									}
								}
								var tbody = parent.tBodies[parent.tBodies.length - 1];									
								if(tagName == "tr"){
									tbody.appendChild(appendTarget[i]);
								} else {
									//td th else
									var tr = tbody.insertRow( tbody.children.length );
									switch(tagName){
										case "td": case "th":
											tr.appendChild(appendTarget[i])
											break;
										default:
											//else
											var td = EL("td");
											tr.appendChild(td);
											td.appendChild(appendTarget[i]);
											break;
									}
								}
								break;
						}
						break;
					case "tr":
						var tagName = appendTarget[i].tagName.toLowerCase();
						switch(tagName){
							case "td" : case "th" :
								parent.appendChild(appendTarget[i]);
								break;
							default   :
								var td = EL("td");
								parent.appendChild(td);
								td.appendChild(appendTarget[i]);
								break;
						}
						break;
					default:
						parent.appendChild(appendTarget[i]);
						break;
				} 
			} else if(ISTEXTNODE(appendTarget[i])){
				parent.appendChild(appendTarget[i]);
			} else {
				//append faild
				console.warn("ELAPPEND :: 추가하려는 요소는 Element요소여야 합니다.",appendTarget[i])
			}
			return parent;
		},
		"ELAPPENDTO":function(targets,parentEL){
			return ELAPPEND(FINDZERO(parentEL),targets);
		},
		//이전 엘리먼트를 찾습니다.
		"ELBEFORE":function(node,appendNodes){ 
			var target;
			target = FINDZERO(node);
			if(!ISELNODE(target)) return node;
			if(arguments.length < 2) return FINDMEMBER(target,-1);
			var appendTarget = FIND(appendNodes);
			if(appendTarget.length > 0){
				for(var i=0,l=appendTarget.length;i<l;i++) target.parentNode.insertBefore(appendTarget[i],target); 
			}
			return target; 
		},
		//이후 엘리먼트를 찾습니다.
		"ELAFTER" : function(target,appendNodes){ 
			target = FINDZERO(target); 
			if(!ISELNODE(target))    return target; 
			if(arguments.length < 2) return FINDMEMBER(target,1);
			var appendTarget = FIND(appendNodes);
			if(appendTarget.length > 0){
				var afterElement = FINDMEMBER(target,1);
				if( ISELNODE(afterElement) ){
					for(var i=0,l=appendTarget.length;i<l;i++) target.parentNode.insertBefore(appendTarget[i],afterElement); 
				} else {
					ELAPPEND(target,appendTarget);
				}
			}
			return target;
		},
		"ELREPLACE":function(target,replaceNode){
			var replaceTarget = FINDZERO(replaceNode);
			ELAFTER(target,replaceTarget);
			ELREMOVE(target);
			return replaceTarget;
		},
		//같은 위치상의 엘리먼트를 위로 올립니다.
		"ELUP"   : function(target){if(!ISELNODE(target))return target;var parent=target.parentNode;if(!ISELNODE(parent))return target;var prev=target.previousSibling;if(!ISELNODE(prev))return target;ELBEFORE(prev,target);},
		//같은 위치상의 엘리먼트를 아랠로 내립니다.
		"ELDOWN" : function(target){if(!ISELNODE(target))return target;var parent=target.parentNode;if(!ISELNODE(parent))return target;var next=target.nextSibling;if(!ISELNODE(next))return target;ELAFTER(next,target);},
		//스타일을 얻어냅니다.
		"ELSTYLE": function(target,styleName,value){
			var target = FINDZERO(target);
			var nodeStyles = document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(target) : target.style;
			if(ISELNODE(target)){
				var marge;
				if(typeof styleName == "undefined") return nodeStyles;
				if(typeof styleName == "object")    marge = styleName;
				if(typeof styleName == "string"){
					//get
					if(typeof value == "undefined") return nodeStyles[CAMEL(styleName)];
					//set
					marge = {};
					marge[CAMEL(styleName)] = value;
				}
				for(var key in marge) target.style[key] = value;
			}
			return target;
		},
		//내무의 내용을 지웁니다.
		"ELEMPTY"  : function(target){ return FIND(target,DATAMAP,function(node){ if("innerHTML" in node) node.innerHTML = ""; return node; }); },
		//대상 객체를 제거합니다.
		"ELREMOVE" : function(node,childs){ var target = FINDZERO(node); if(!ISELNODE(target)) return target; if(!ISELNODE(target.parentNode)) return target; target.parentNode.removeChild(target); return target; },
		//케럿의 위치를 찾습니다.
		"ELCARET":function(select,pos){
			//
			var node = FINDZERO(select);
			var editable = node.contentEditable === 'true';
			var r1,r2,ran;
			//get
			if (arguments.length < 2) {
				//HTML5
				if (window.getSelection) {
					//contenteditable
					if (editable) {
						node.focus();
						var r1 = window.getSelection().getRangeAt(0),
						r2     = r1.cloneRange();
						r2.selectNodeContents(node);
						r2.setEnd(r1.endContainer, r1.endOffset);
						return r2.toString().length;
					}
					//textarea
					return node.selectionStart;
				}
				//IE<9
				if (document.selection) {
					node.focus();
					//contenteditable
					if (editable) {
						var r1 = document.selection.createRange(),
						r2 = document.body.createTextRange();
						r2.moveToElementText(node);
						r2.setEndPoint('EndToEnd', r1);
						return r2.text.length;
					}
					//textarea
					var pos  = 0,
					ran    = node.createTextRange(),
					r2       = document.selection.createRange().duplicate(),
					bookmark = r2.getBookmark();

					ran.moveToBookmark(bookmark);
					while (ran.moveStart('character', -1) !== 0) pos++;
					return pos;
				}
				//not supported
				return 0;
			}
			//set
			if (pos == -1)
			pos = this[editable? 'text' : 'val']().length;
			//HTML5
			if (window.getSelection) {
				//contenteditable
				if (editable) {
					node.focus();
					window.getSelection().collapse(node.firstChild, pos);
				}
				//textarea
				else
				node.setSelectionRange(pos, pos);
			}
			//IE<9
			else if (document.body.createTextRange) {
				var ran = document.body.createTextRange();
				ran.moveToElementText(node);
				ran.moveStart('character', pos);
				ran.collapse(true);
				ran.select();
			}
			if (!editable)
			node.focus();
			return pos;
		},
		//이벤트를 발생시킵니다.
		"ELTRIGGER":function(node,eventName){
			if(ISWINDOW(node)){
				node = W;
			} else {
				node = FINDZERO(node);
				if(ISNOTHING(node)) throw new Error("ELTRIGGER는 element를 찾을수 없습니다. => 들어온값" + TOS(node));
			}
			if ("createEvent" in document) {
			    var e = W.document.createEvent("HTMLEvents");
			    e.initEvent(eventName, true, true);
			    node.dispatchEvent(e);
			} else {
				try{
					node.fireEvent("on"+eventName);
				} catch(e) {
					console.warn("존재하지 않는 이벤트 호출 error => ",e.message);
				}
				
			}
			return node;
		},
		//get text node element
		"ELTEXT"   :function(t){ return W.document.createTextNode(t); },
		"TAGSTACKS":function(){
			var stakes = "",stakee = "";
			for(var i=0,l=arguments.length;i<l;i++){
				if(typeof arguments[i] == "string"){
					stakes = stakes + ("<" + arguments[i] + ">");
					stakee = ("</" + arguments[i] + ">") + stakee;
				} else {
					console.warn("TAGSTAKE:: 허용하지 않습니다.")
				}
			}
			return [stakes,stakee]; 
		},
		"HTMLTOEL":function(html,vt){
			var baseTag = typeof baseTag == "string" ? baseTag : "div";
			var makeWrapper = document.createElement(baseTag);
			makeWrapper.innerHTML = html;
			return MVARRAY(makeWrapper.children);
		},
		"EL" :function(name,attrValue,parent){
			var element;
			name = (typeof name == "undefined") ? "" : name ;
			if(typeof name == "string"){
				name = name.trim();
				if(name.indexOf("<") !== 0) name = TAG(name,attrValue);
	
				switch(name.substr(0,3)){
					case "<tr" :
						var sWrap = TAGSTACKS("table","tbody");
						element = FINDZERO("tr",HTMLTOEL(sWrap[0] + name + sWrap[1]));
						break;
					case "<td" : case "<th" :
						if(name.substr(0,6) == "<thead"){
							var sWrap = TAGSTACKS("table");
							element = FINDZERO("thead",HTMLTOEL(sWrap[0] + name + sWrap[1]));
						} else {
							var sWrap = TAGSTACKS("table","tbody");
							element = FINDZERO(name.substr(1,2),HTMLTOEL(sWrap[0] + name + sWrap[1]));
						}
						break;
					case "<tb" : case "<tf" :
						if(name.substr(0,6) == "<tbody" || name.substr(0,6) == "<tfoot"){
							var sWrap = TAGSTACKS("table");
							element = FINDZERO(name.substr(1,5),HTMLTOEL(sWrap[0] + name + sWrap[1]));
						}
						break;
					case "<co" :
						if(name.substr(0,9) == "<colgroup" ){
							var sWrap = TAGSTACKS("table");
							element = FINDZERO("colgroup",HTMLTOEL(sWrap[0] + name + sWrap[1]));
						} else if (name.substr(0,4) == "<col" ) {
							var sWrap = TAGSTACKS("table","colgroup");
							element = FINDZERO("col",HTMLTOEL(sWrap[0] + name + sWrap[1]));
						}
						break;
					default:
						element = HTMLTOEL(name)[0];
						break;
				}
			} else {
				console.error("E::처리할수 없는 첫번째 파라메터가 들어왔습니다. string이여야 합니다.");
				return undefined;
			}
			// append
			if(ISELNODE(parent) == true){
				if(parent){ 
					if(parent==W.document) parent = W.document.getElementsByTagName("body")[0];
					parent.appendChild(element);
				}
			}
			return element;	
		},
		//이벤트 타겟을 찾아냅니다.
		"ELONTARGET":function(node){ if(ISWINDOW(node)){ node = W; } else { node = FINDZERO(node); if(!ISELNODE(node)) throw new Error("ELONTARGET::Element이 여야합니다." + TOS(node)); } return node; },
		"ELON":function(node, eventName, eventHandler){
			node = ELONTARGET(node);
			if(!node || !eventHandler){
				console.error("ELON::node나 이벤트 헨들러가 존재해야 합니다.");
			}
			var events = eventName.split(" ");
			var eventMeta = _Meta(eventHandler); 
			for(var i=0,l=events.length;i<l;i++){
				eventMeta.setProp(events[i],function(e){eventHandler.call(node,e);});
				if (node.addEventListener){
					 node.addEventListener(events[i], eventMeta.getProp(events[i]), false); 
				} else if (node.attachEvent){
				    node.attachEvent('on'+events[i], eventMeta.getProp(events[i]));
				}
			}
			return node;
		},
		"ELOFF":function(node, eventName, eventHandler){
			node = ELONTARGET(node);
			if(!node || !eventHandler){
				console.error("ELON::node나 이벤트 헨들러가 존재해야 합니다.");
			}
			var events = eventName.split(" ");
			var eventMeta = _Meta(eventHandler);
			for(var i=0,l=events.length;i<l;i++){
				if (node.removeEventListener){
					 node.removeEventListener(events[i], eventMeta.getProp(events[i]), false); 
				} else if (node.detachEvent){
				    node.detachEvent('on'+events[i], eventMeta.getProp(events[i]));
				}
			}
			return node;
		},
		//한번만 발생하는 이벤트입니다.
		"ELTIME":function(node, eventName, eventHandler, time){
			if(typeof eventHandler == "function"){
				console.error("ELTIME:: eventHandler는 만드시 존재해야 합니다");
			} else {
				var timeManager = (function(time){ this.time = time; })( isNaN(time) ? 1 : parseInt(time) );
				timeManager.events = eventName.split(" ");
				timeManager.handler = function(e){
					if(timeManager.time > 0){
						timeCounter.time = timeCounter.time - 1;
						CALL(handler,node,e);
					}
					if(timeManager.time < 1){
						for(var i=0,l=this.events.length;i<l;i++) ELOFF(node,events[i],timeCounter.handler)
					}
				};
				for(var i=0,l=this.events.length;i<l;i++) ELON(node,eventName,timeManager.handler);
			}
			return node;
		},
		"PRINT":function(a){ return EL("div",a,W.document); },
		"NODE":function(){
			var exception   = [];
			var stackString = "";
			for(var i=0,l=arguments.length;i<l;i++) {
				if(typeof arguments[i] == "string"){
					stackString += arguments[i]
				} else {
					exception.push(arguments[i]); 
					stackString += "<div class='nodeplus-object'></div>"
				}
			}
			var exceptionTagMode,exceptionTagWrapper;
			if(stackString.toLowerCase().indexOf("<tr") == 0) {
				exceptionTagMode = "table.tr";
				var node;
			 EL("table");
		
				stackString =  "<table><tbody class='nodeplus-exception-parent'>" + stackString + "</tbody></table>";
			}
			if(stackString.toLowerCase().indexOf("<td") == 0) {
				exceptionTagMode = "table.td";
				stackString = "<table><tbody><tr class='nodeplus-exception-parent'>" + stackString + "</tr></tbody></table>";
			}
			var node = EL(stackString);
	
			var targets = FIND(".nodeplus-object",node);
	
			for(var i=0,l=targets.length;i<l;i++) ELREMOVE(ELBEFORE(targets[i],exception[i]));
			switch(exceptionTagMode){
				case "table.tr": case "table.td":
					return node,FINDZERO(".nodeplus-exception-parent>*:eq(0)",node);
					break;
				defualt:
				return node;
					break;
			}
		},
		// 각 arguments에 수치를 넣으면 colgroup > col, col... 의 width값이 대입된다.
		"COLS":function(){ return _Array(arguments).inject(EL("colgroup"),function(colvalue,parent){ if(typeof colvalue == "string" || typeof colvalue == "number") ELAPPEND(parent,EL("col",{width:colvalue})); }); },
		"OBJECT":function(param,es,kv){
			if(typeof param=="object") return param;
			if(kv == true && ( typeof param == "string" || typeof es == "string")){ var r = {}; r[es] = param; return r; }
			if(typeof param=="string" || typeof param=="boolean") {
				try {
					if(JSON == aJSON) throw new Error("not json supported browser");
					var jp = JSON.parse(param);
					if(typeof jp !== "object") throw new Error("pass");
				} catch(e) {
					if(_String(param).isContent()=="plain"){var esv=(typeof es == "string" ? es : "value");
					var reo={};reo[esv]=param;return reo;}return _String(param).getContent();
				}
			}
			return{};
		},
		//오브젝트 혹은 element를 반환합니다.
		"DATACONTEXT":function(target){
			if ( typeof target == "string" ) target = FINDZERO(target);
			if ( typeof target == "object" ) {
				if( this.ISARRAY(target) ){
					var findElement = FINDZERO(target);
					if(findElement) return findElement;
				}
				return target;
			}
			return undefined;
		},
		//Disabled
		"ELDISABLED":function(node,status){
			var elf = _Array(FIND(node));
			if( elf.isNothing() ){
				console.error("ELDISABLED:: node를 찾을수 없습니다. => 들어온값" + TOS(node));
			} else {
				elf.each(function(el){
					if("disabled" in el){
						if(typeof status == "undefined") return el.disabled;
						if(status == true || status == "true"){
							el.disabled = true;
							return el;
						}
						if(status == false || status == "false"){
							el.disabled = false;
							return el;
						}
					}
				});
			}
		},
		//Readonly
		"ELREADONLY":function(node,status){
			var elf = FIND(node,_Array);
			if( elf.isNothing() ){
				console.error("ELREADONLY:: node를 찾을수 없습니다. => 들어온값" + TOS(node));
			} else {
				elf.each(function(el){
					if( "readOnly" in el ){
						if(typeof status == "undefined") return el.readOnly;
						if(status == true || status == "true"){
							el.readOnly = true;
							return el;
						}
						if(status == false || status == "false"){
							el.readOnly = false;
							return el;
						}
					}
				});
			}
		},
		"ELHASCLASS":function(node,name,hideConsole){
			var node = FINDZERO(node);
			if( ISELNODE(node) ) if(typeof node.getAttribute("class") == "string") return _String(node.getAttribute("class")).hasModel(name);
			if(hideConsole !== true) console.error("ELHASCLASS:: 알수없는 node값 입니다. => " + TOS(node) );
			return false;
		}
	});
	ElementFoundation.toGetter();
	
	var ElementGeneratorPrototype = {};
	var MakeElementGenerator      = function(name,tag,feature){
		var funcName = "_"+name;
		var initTag  = (typeof tag == "string" && typeof feature == "string") ? tag+"?"+feature : tag;
		ElementGeneratorPrototype[funcName] = function(topElement){
			//arguments
			var args = Array.prototype.slice.apply(arguments);
			//tagName
			if(typeof topElement == "undefined"){
				var rename = initTag;
				args.shift();
				args.unshift(rename);
			} else if(typeof topElement == "string"){
				var rename = tag + (typeof feature == "string"?"?"+feature:"") + topElement.replace(/^[^\?\.\#\[\:]+/,"");
				args.shift();
				args.unshift(rename);
			} else if( typeof topElement == "object" && !ISELNODE(topElement) ) {
				args.unshift(tag);
			} else {
				args.unshift(tag);
			}
			var i = 1;
			//makeElement
			var resultElement;
			if(typeof args[1] == "object" && !ISELNODE(args[1]) && !ISTEXTNODE(args[1]) && !ISARRAY(args[1])){
				i = 2;
				resultElement = EL(args[0], args[1]);
			} else {
				resultElement = EL(args[0]);
			}
			//result
			for(var l=args.length;i<l;i++){ ELAPPEND(resultElement,args[i]); } 
			return resultElement;
		};
	}
	"title base link meta style script noscript body section nav article aside h1 h2 h3 h4 h5 h6 header footer template address main p hr pre blockquote ol ul li dl dt dd figure figcaption div a em strong small s cite q dfn abbr data time datetime code var samp kbd sub sup i b u mark ruby rt rp bdi bdo span class lang dir br wbr ins del img iframe embed object param video audio source track canvas map area svg math table caption colgroup col tbody thead tfoot tr td th form fieldset legend label input button select datalist optgroup option textarea keygen output progress meter details summary menuitem menu".replace(/\w+/g,function(s){
		MakeElementGenerator(s,s);
	});
	"checkbox file hidden image number password radio reset submit text".replace(/\w+/g,function(s){
		MakeElementGenerator(s,"input",s);
	});
	makeSingleton("ElementGenerator",ElementGeneratorPrototype);
	ElementGenerator.toGetter();
	
	
	makeModule("Controls",{
		getSelects:function(){ return this.Source; },
		statusFunction:function(f,param,filter,requireElement){
			var fe = filter ? function(node){ return ELIS(node,filter)?f(node, param):undefined } : function(node){ return f(node, param); };
			var r  = _Array(this.getSelects()).map( fe ).filter();
			return (requireElement == true) ? r.toArray() : this;
		},
		disabled:function(status,filter){ return this.statusFunction(ELDISABLED,(status !== false ? true : false),filter); },
		readonly:function(status,filter){ return this.statusFunction(ELREADONLY,(status !== false ? true : false),filter); },
		empty   :function(filter)       { filter = filter?filter+",:not(button,select)":":not(button,select)"; return this.statusFunction(ELVALUE   ,"",filter); },
		map     :function(mapf,filter)  { return this.statusFunction(function(node){ var r = mapf(node); if(ISTEXT(r)){ ELVALUE(node,r); } },"",filter); },
		removePartClass:function(rmClass,filter,req){
			var r = this.statusFunction(function(node,param){
				var classes = ELATTR(node,"class");
				if(typeof classes == "string"){
					classes = _String(classes).getRemoveModel(eval("/^"+param+"/"));
					ELATTR(node,"class",classes);
					return node;
				}
				return undefined;
			},rmClass,filter,true);
			return (req == true)?r:this;
		},
		changePartClass:function(selClass,toClass,filter){
			_Array(this.removePartClass(selClass,filter,true)).each(function(node){
				var classes = ELATTR(node,"class");
				ELATTR(node,"class",_String(classes).getAddModel(selClass+toClass));
			});
			return this;
		}
	},function(controls,casein){
		this.Source = FIND(controls,casein);
	});
	// Frame
	extendModule("Controls","Form",{
		isVaild        :function(f){ if(typeof f == "function") return f.call(this); return ISELNODE(this.Source); },
		getSelects     :function(){ return FIND(this.SelectRule,this.Source); },
		getSelectTokens:function(){
			return _Array(this.SelectRule.split(",")).map(function(selString){
				try {
					return /\[([^\[\]+]+)\]/.exec(selString)[1];
				} catch(e){
					return ;
				}
			}).filter().toArray();
		},
		//체크아웃 대상 (key와 무관)
		getCheckoutElement:function(){
			return FIND(_Array(this.getSelectTokens()).map(function(s){ return "["+s+"]"; }).join(","), this.Source);
		},
		//체크아웃 대상 (key가 존재하는 것만)
		getCheckoutElementsWithToken:function(){
			var tokens = _Array(this.getSelectTokens());
			return _Array(this.getCheckoutElement()).inject({},function(node,inject){
				var getKey;
				tokens.each(function(tokenName){
					if( ELHASATTR(node,tokenName) == true ){
						var key = ELATTR(node,tokenName);
						if( !ISNOTHING(key) ){
							if(!(key in inject)) inject[key] = [];
							inject[key].push(node);
							return false;
						}
					}
				});
			});
		},
		checkoutFilter:function(o){ this.FrameCheckoutFilter = o; },
		checkinFilter:function(o){ this.FrameCheckinFilter = o; },
		checkout:function(){
			return _Object(this.getCheckoutElementsWithToken()).map(function(node,key){
				var value = ELVALUE(node);
				return value == null ? "" : value;
			}).get();
		},
		checkin:function(hashMap,v2){
			console.log("hashMap",hashMap);
			if(typeof hashMap == "string"){
				if(typeof v2 !== "string") v2 = TOSTRING(v2);
				var map      = {};
				map[hashMap] = v2;
				hashMap      = map;
			}
			if(typeof hashMap == "object"){
				var checkin_targets = this.getCheckoutElementsWithToken()
				for(var key in hashMap) if(key in checkin_targets) {
					ELVALUE(checkin_targets[key], hashMap[key]);
				} 
			} else {
				console.warn("Frame::checkin set data를 object형으로 넣어주세요");
			}
			return this;
		}
	},function(context,selectRule,filter){
		this.Source = FINDZERO(context);
		if( !ISELNODE(this.Source) ) { console.error( "Frame::Context를 처리할 수 없습니다. => ",this.Source," <= ", context); }
		//options
		//Polymorphism
		var r,f;
		if(typeof selectRule == "object" && typeof selectRule !== "object"){ r = undefined; f = selectRule; } else { r = selectRule; f = filter; }
		//SelectRule
		switch(typeof rule){
			case "string":
				this.SelectRule = r+",[name],button";
				break;
			default :
				this.SelectRule = "[name],button";
				break;
		}
		//CommandFilter
		this.CommandFilter = typeof filter == "object" ? filter : {} ;
	});
	makeModule("Inside",{
		addClass    : function(m){ ELATTR(this.Source,"class",_String(ELATTR(this.Source,"class")).getAddModel(m)); return this; },
		removeClass : function(m){ ELATTR(this.Source,"class",_String(ELATTR(this.Source,"class")).getRemoveModel(m)); return this; },
		hasClass    : function(m){ return _String(ELATTR(this.Source,"class")).hasModel(m); },
		print:function(beforePrint,afterPrint){
			var targetWindow   = window.open('','','left=0,top=0,width=1,height=1,toolbar=0,scrollbars=0,status =0');
			var targetDocument = targetWindow.document;
			var own           = this;
			var pointer        = EL("div#pointer");
			ELBEFORE(this.Source,pointer);
			var parentNode     = this.Source.parentNode;
			var headInfo       = _Array(W.document.head.childNodes).filter(function(node){ if(ISELNODE(node)) if(node.tagName !== "SCRIPT") return true; return false; });
			headInfo.insert(EL("base" ,{href:_Client.url().replace(/\/[^\/]*$/,"/")})).push(EL("style",{html:"@media print{ body{ background-color:#FFFFFF; background-image:none; color:#000000 } #ad{ display:none;} #leftbar{ display:none;} #contentarea{ width:100%;} }"}));
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
		__setInputConfig:function(){ ELATTR(this.Source,"autocomplete","off"); },
		__maskIgnoreKeyCode:[9,16,17,18,27,36,37,38,39,40,91,92],
		__maskApply:function(name){
			this.__setInputConfig();
			var ignoreMaskKeyCodes = _Array(this.__maskIgnoreKeyCode);
			var params             = _Array(arguments).subarr(1).toArray();
			var eventTarget        = this.Source;
			ELON(eventTarget,"keydown",function(e){
				if( !ignoreMaskKeyCodes.has(e.keyCode) ){
					setTimeout(function(){
						var n = _Number(ELVALUE(eventTarget));
						ELVALUE(eventTarget,n[name].apply(n,params));
					},0);
				}
			});
		},
		getValue:function(){ return ELVALUE(this.Source); },
		number  :function(){ return _Number(ELVALUE(this.Source)).number(); },
		getDateValue:function(format){
			var dateValue = ELVALUE(this.Source);
			return _Type(dateValue).is(/(\d+)\D+(\d+)\D+(\d+)/,_String(dateValue).printf(/(\d+)\D+(\d+)\D+(\d+)/,[1],"년 ",[2],"월 ",[3],"일"),dateValue);
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
			
		is:function(){
			var t = _Type( this.getValue() );
			return t.is.apply(t,arguments);
		},
		as:function(){
			var t = _Type( this.getValue() );
			return t.as.apply(t,arguments);
		}
	},function(el){
		this.Source = FINDZERO(el);
		if(!this.Source) console.warn("Inside의 초기값을 설정하지 못했습니다. command =>",el);
	});
	//contexts
	makeModule("Contexts",{
		width:function(widthUnit){
			widthUnit = (typeof widthUnit == "string")?widthUnit.split(" "):widthUnit;
			_this = this;
			$(this.currentGroups).each(function(){
				var $lists = $(this).children(_this.getSelectFilter());
				for(var i = 0;i < widthUnit.length; i++){
					if($lists[i] && widthUnit[i]){
						$($lists[i]).width(widthUnit[i]);
					} else {
						break;
					}
				}
			});
			return this;
		},
		align:function(widthUnit){
			widthUnit = (typeof widthUnit == "string")?widthUnit.split(" "):widthUnit;
			_this = this;
			$(this.currentGroups).each(function(){
				var $lists = $(this).children(_this.getSelectFilter());
				for(var i = 0;i < widthUnit.length; i++){
					if($lists[i] && widthUnit[i]){
						$($lists[i]).css("text-align",widthUnit[i]);
					} else {
						break;
					}
				}
			});
			return this;
		},
		layerInterface:function(child){
			this.contexts.each(function(e){ _Element(e).layerInterface(); });
			if(typeof child == "undefined" || child == true){
				this.targets.each(function(e){ _Element(e).layerInterface() });
			}
		},
		frameInterface:function(child){
			this.contexts.each(function(e){ _Element(e).frameInterface(); });
			if(typeof child == "undefined" || child == true){
				this.targets.each(function(e){ _Element(e).layerInterface() });
			}
		},
		rolling:function(rollingMethod){
			var rollings = [];
			for(var i = 0;i < arguments.length;i++)if(typeof arguments[i] == "function")rollings.push(arguments[i]);
			_this = this;
			if(rollings.length > 0)
			$(this.groups).each(function(){
				var $lists = $(this).children(_this.getSelectFilter());
				for(var i = 0;i < $lists.length; i++){
					if($lists[i]){
						rollings[_Line(rollings.length).getRolling(i)]($lists[i],i,$lists.length);
					} else {
						break;
					}
				}
			});
			return this;
		},
		whereIsContexts : function(index) { var s = this.contexts , _ = _Element , f = "flash" ; if(s[index]) { _(s[index])[f](); } else { s.each (function(e){ _(e)[f](); }); } return this; },
		whereIsSelects  : function(index) { var s = this.selects  , _ = _Element , f = "flash" ; if(s[index]) { _(s[index])[f](); } else { s.each (function(e){ _(e)[f](); }); } return this; },
		whereIsTargets  : function(index) { var s = this.targets  , _ = _Element , f = "flash" ; if(s[index]) { _(s[index])[f](); } else { s.each (function(e){ _(e)[f](); }); } return this; },
		setContexts : function(contextsOrder,selectsOrder,targetsOrder) {
			this.initCall[0] = contextsOrder;
			if(selectsOrder)this.setSelects(selectsOrder,targetsOrder);
			return this;
		},
		setSelects : function(selectsOrder,targetsOrder){
			if(typeof selectsOrder !== "string") console.warn("Context::getSelects::selects order는 string인것이 좋습니다.");
			this.initCall[1] = selectsOrder;
			if(targetsOrder)this.setTargets(targetsOrder);
			return this;
		},
		setTargets : function(targetsOrder){
			if(typeof selectsOrder !== "string") console.warn("Context::getTargets::targets order는 string인것이 좋습니다.");
			this.initCall[2] = targetsOrder;
			return this;
		},
		trace : function(way) {
			way = typeof way == "string" ? way : "console.log";
			switch(way) {
				case "a":
				case "alert":
					var messege = ["K [trace] <alert> !"];
					messege.push("contexts => " + TOS(this.contexts));
					messege.push("selects => "  + TOS(this.selects));
					messege.push("targets => "  + TOS(this.targets));
					messege.push("groups => "   + TOS(this.groups));
					messege.push("options => "  + TOS(this.options));
					alert(messege.join("\n::"));
					return true;
				break;
				case "c":
				case "l":
				case "console":
				case "log":
				case "console.log":
					console.info("#start# K [trace] <console.log>");
					console.info("contexts => ",this.getContexts());
					console.info("selects => " ,this.getSelects());
					console.info("targets => " ,this.getTargets());
					console.info("groups =>  " ,this.getGroups());
					console.info("options => {");
					for(var key in this.options)
					console.info(":"+key," => ",this.options[key]);
					console.info("}");
					console.info("#end# K [trace] <console.log>");
				break;
			}
			return false;
		},
		getContexts:function(){ 
			return FIND(this.initCall[0]); 
		},
		getSelects:function(){ 
			var selectQuery = ISNOTHING(this.initCall[1]) ? "*" : this.initCall[1];
			if(selectQuery == "self") return this.getContexts();
			return FINDON(this.getContexts(),selectQuery);
		},
		getGroups:function(){ 
			var selectQuery = ISNOTHING(this.initCall[2]) ? "self" : this.initCall[2];
			if(selectQuery == "self") return DATAMAP(this.getSelects(),function(selNode){ return [selNode]; });
			if(selectQuery.charAt(0) == ">"){
				return DATAMAP(this.getSelects(),function(node){
					return FINDON(node,selectQuery.substr(1));
				});
			} else {
				return DATAMAP(this.getSelects(),function(node){
					return FINDIN(node,selectQuery);
				});
			}
		},
		getTargets:function()  { return DATAFLATTEN(this.getGroups());  },
		getContext:function(eq){ return this.getContexts()[eq]; },
		getSelect :function(eq){ return this.getSelects()[eq]; },
		getTarget :function(eq){ return this.getTargets()[eq]; },
		getGroup  :function(eq){ return this.getGroups()[eq]; },
		onSelects :function(event,func,otherFunc){
			var own = this;
			if(typeof event=="string" && typeof func == "number"){
				var selNode = this.getSelect(func);
				if(ISELNODE(selNode)){
					ELTRIGGER(selNode,event);
				} else {
					console.warn("Contexts::onSelects::트리깅할 대상이 없습니다.");
				}
				return this;
			}
			if(typeof event=="string" && typeof func == "function"){
				ELON(this.getContexts(),event,function(e){
					var curSel = _Array( own.getSelects() );
					if(curSel.has(e.target)){
						//버블이 잘 왔을때
						var curfuncresult = func.call(e.target,e,curSel.indexOf(e.target),own);
						if(curfuncresult == false){ return false; }
						if(typeof otherFunc == "function") curSel.each(function(otherObj,index){ if(e.target !== otherObj) return otherFunc.call(otherObj,e,index,own); });
						return curfuncresult;
					} else {
						//버블링이 중간에 멈췄을때
						var eventCapture; 
						curSel.each(function(sel){
							if(FINDZERO(e.target,sel)){
								eventCapture = sel;
								return false;
							}
						});
						if(eventCapture){
							ELTRIGGER(eventCapture,e.type);
							return false;
						}
					}
				});
			} else {
				console.error("onSelect::초기화 할수 없습니다. 글자함수필요",event,func);
			}
			return this;
		},
		inlineFix:function(){
			_Array(this.getContexts()).each(function(context){
				$(context).contents().filter(function() {
					return (!this.innerText && this.nodeType === 3)?true:false;
	            }).remove();
			});
			return this;
		}
	},function(cSel,sSel,tSel){
		if(ISNOTHING(FIND(cSel))) console.warn("Contexts::init::error 첫번째 파라메터의 값을 현재 찾을 수 없습니다. 들어온값", cSel);
		this.initCall = [cSel,sSel,tSel];
		this.setContexts(cSel,sSel,tSel);
	});
	window.whereis = function(name,index) { var m = _Contexts(name,index).whereIsContexts(index); return m; };
	
	// Model
	extendModule("Object","Model",{
		validateInfo:function(key,value,abstract){
			var validateData;
			var validateResults = {};
			if(typeof key == "string"){
				validateData = OBJECT(value,key,true);
			} else if(typeof key == "object"){
				validateData = key;
			} else {
				console.error("validate값이 잘못되었습니다");
				return undefined;
			}
			for(var name in validateData){
				if( name in this.Source ){
					validateResults[name] = _Type(this.Source[name]).info( validateData[name],true );
				} else {
					if(abstract == true) validateResults[name] = {"type":false,"condition":false,"success":false};
				}
			}
			return validateResults;
		},
		validateResult:function(key,value,abstract){
			var result = this.validateInfo(key,value,abstract);
			for(var key in result) result[key] = result[key].success;
			return result;
		},
		validate:function(key,value,abstract){
			return _Ranking(true,false).worst( _Object(this.validateResult(key,value,abstract)).values() );
		},
		validateAll:function(validateValue){
			return this.validate( this.save().empty(validateValue).remove(_Array(arguments).subarr(1).stringFlatten()).data() );
		},
		getItem:function(name){
			if( typeof name == "string" && ISELNODE( this.DataContext ) ){
				return FIND("[name=" + name + "]" ,this.DataContext);
			} else {
				console.warn("Serilizer::getItem은 Context가 element일때만 가능합니다.", findEL);
			}
		},
		exports:function(context,forceData){
			var exportContext = DATACONTEXT(context);
			if(!exportContext) { exportContext = this.DataContext; }
			if(exportContext){
				if( ISELNODE(exportContext) == true ){
					_Form(exportContext,this.ModelSelectRule).checkin(this.Source);
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
					this.Source = _Form(this.DataContext,this.ModelSelectRule).checkout();
					return this;
				} else {
					this.Source = this.DataContext;
					return this;
				}
			}
			console.error("Model :: 시리얼라이저 다음 초기화 인자가 올바르지 않습니다. => ", target);
		},			
		getData:function(k){ 
			console.warn("deprecated::getData:: Model의 getData대신 data를 사용해주세요");
			if(typeof k == "string"){ this.Source[k]; } else { return this.Source; } 
		},
		replace:function(key,value){
			if(typeof key == "string"){
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
	
	makeModule("FeedNode",{
		//최상위 노드에게 메서드 호출
		feedFromTop:function(f,d){ d=(typeof d == "number")?d++:0; if(this.NodeParent) return this.NodeParent.feedToTop(f,d); return f.call(this,d); },
		//아래부터 현재까지 메서드 호출
		feedup:function(ff,depth,infinityTop){
			depth = (typeof depth == "undefined" ? 0 : depth ); 
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
			depth = (typeof depth == "undefined" ? 0 : depth ); 
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
				if( typeof status == "string" || typeof status == "number" ){
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
				if(typeof setStatus == "string" || typeof setStatus == "number"){
					if( _Type(setStatus).as("text:able") ) {
						if(typeof setStatus == "string") setStatus = setStatus.trim();
						if(forced || this.CurrentViewStatus !== setStatus){
							if(setStatus in this.ViewStatus){
								if(typeof this.ViewStatus[setStatus] == "function"){
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
				if(typeof setStatus == "string" || typeof setStatus == "number"){
					if(typeof setStatus == "string") setStatus = setStatus.trim();
					if( _Type(setStatus).as("text:able") ) if(setStatus in this.ViewStatus) if(typeof this.ViewStatus[setStatus] == "function") {
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
				name = (typeof name == "string" || typeof name == "number") ? name  : "defualtData" ;
				return (typeof this.DefaultDataModels[name] == "undefined") ? false : true ;
			},
			setDefaultDataWithName:function(data,name){
				if(typeof name == "string" || typeof name == "number"){
					this.DefaultDataModels[name] = data;
				} else {
					console.warn("FrameController::setDefaultDataWithName 두번째 파라메터값은 반드시 String이나 Number이여야 합니다. param => ",data,name);
				}
			},
			getDefaultDataList:function(){ return MV(this.DefaultDataModels); },
			getDefaultData:function(index){
				if( typeof index == "undefined") {
					//아무거나 나옴
					if("defualtData" in this.DefaultDataModels) return MV(this.DefaultDataModels[key]);
					for(var key in this.DefaultDataModels) return MV(this.DefaultDataModels[key]);
				} else {
					return MV(this.DefaultDataModels[index]);
				}
			},
			//
			setControllerData:function(data){
				this.FrameControllerHasData = data;
				return this.FrameControllerHasData;
			},
			getControllerData:function(key){
				if( typeof key == "undefined" ){
					return this.FrameControllerHasData;
				} else {
					if(typeof this.FrameControllerHasData == "object"){
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
				d = FJOB(this.FrameControllerUpdateDataFilter,d);
				if( this.hasControllerData () == false || overwrite == true){
					this.setControllerData(d);
				} else {
					if(typeof this.FrameControllerHasData == "object"){
						_Object(this.FrameControllerHasData).concat(d);
					} else {
						console.error("FrameController::다음 데이터에 updateControllerData를 실행 할 수 없습니다.",this.FrameControllerHasData);
					}
				}
				if(typeof overwrite == "function"){
					return overwrite(this.getControllerData());
				} else {
					return this.getControllerData();
				}
			},
			//데이터 모델을 뷰로 뿌려줍니다.
			exportsControllerData:function(){
				if( this.hasControllerData () == true ){
					var d = this.getControllerData();
					d = FJOB(this.FrameControllerExportsDataFilter,d);
					_Model(d).exports(this.ControllerElement);
				} else {
					console.warn("프레임 데이터가 존재하지 않아 뷰로 적용되지 못하였습니다.");
				}
			},
			getMemberController:function(s){
				var pn = this.getParentNode();
				if(pn && (typeof s == "string" || typeof s == "number")){
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
			var c = FINDZERO(context);
			if( ISELNODE(c) == false ) console.error("FrameController::context => 현재 Context안에 해당 영역을 찾지 못했습니다. \ncontext는 고정적인 element에 지정하는것이 좋습니다. params =>",context,property,viewStatus);
			this.ControllerElement = c;
			this.view              = c;
		
			//status data
			this.ViewStatus   = MV(OBJECT(viewStatus));
			this.CurrentViewStatus = undefined;
			
			//attribute & default data
			property = MV(OBJECT(property,"init"));
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
						this.DefaultDataModels[keySign[2]] = MV(property[key]);
					}
				}
			}
			//parent
			this.setTreeParent(parentViewController);
			
			//init
			if( ("init" in this) && (typeof this.init == "function") ){
				this.init.call(this,this,c,this.parentViewController);
				delete this["init"];
			}
		},function(s){
			return this.getChildViewController(s);
		}
	);
	//카운트를 샌후 함수실행
	makeModule("Fire",{
		complete:function(){
			this.FireCurrent = this.FireMax;
			return this.FireFunction.apply(this,arguments);
		},
		touch:function(){
			this.FireCurrent++
			if(this.FireCurrent >= this.FireMax) return this.complete.apply(this,arguments);
		},
		back:function(){
			this.FireCurrent--;
			return this;
		},
		each:function(f){
			var own = this;
			var touchLiteral = function(){ return own.touch(); };
			if(ISARRAY(this.Source) && typeof f == "function"){
				_Array(this.Source).each(function(data,index){ return APPLY(f,own,[data,index,touchLiteral]); });
			} else {
				console.warn("Fire::조건이 충족되지 못해 fire를 실행하지 못하였습니다. source=> ",this.Source,"each f=>",f);
			}
			return this;
		}
	},function(number,fireFunction){
		//array
		this.Source       = number;
		if(ISARRAY(number)) number = number.length;
		//number
		this.FireMax      = (ISARRAY(number) == true) ? number.length : isNaN(number) == true ? 0 : parseInt(number) ;
		this.FireFunction = fireFunction;
		this.FireCurrent  = 0;
	});
	//******************
	//EventInterface
	extendModule("UIDInterface","EventInterface",{
		setDefaultEvent:function(eventName,method){ this.EventInterfaceDefault[eventName] = typeof method == "function" ? [method] : []; return this; },
		addDefualEvent:function(eventName,method){ if(!this.EventInterfaceDefault[eventName]){ this.setDefaultEvent(eventName,method); } else if(typeof method == "function"){ this.EventInterfaceDefault[eventName].push(method); } return this; },
		setEvent:function(eventName,method){ this.EventInterfaceData[eventName] = typeof method == "function" ? [method] : []; return this; },
		addEvent:function(eventName,method) { if(!this.EventInterfaceData[eventName]) { this.setEvent(eventName,method); } else if (typeof method == "function"){ this.EventInterfaceData[eventName].push(method); } return this; },
		trigger:function(eventName,param,wantedCallback){ 
			if(typeof this.EventInterfaceDefault[eventName] !== "undefined"){	
				for(var i=0,l=this.EventInterfaceDefault[eventName].length;i<l;i++) this.EventInterfaceDefault[eventName][i].apply(this,_Array(param).toArray());
				return this;
			} else if(wantedCallback == undefined){
				if(this.EventInterfaceData[eventName]) for(var i=0,l=this.EventInterfaceData[eventName].length;i<l;i++) this.EventInterfaceData[eventName][i].apply(this,_Array(param));
				return this;
			} else {
				var result = [];
				if(this.EventInterfaceData[eventName]) for(var i=0,l=this.EventInterfaceData[eventName].length;i<l;i++) result.push(this.EventInterfaceData[eventName][i].apply(this,_Array(param)));
				if(result.length == 0){
					return undefined;
				} else {
					switch(wantedCallback){
						case "first":
							result[0];
							break;
						case "last":
							result[result.length - 1];
							break;
						case "array":
						default:
							return result;
							break;
					}
				}
			}
		}
	},function(){
		this._super();
		this.EventInterfaceData    = {};
		this.EventInterfaceDefault = {};
	});
	
	//DataGrid
	extendModule("UIDInterface","DataGrid",{
		//데이타가 존재하는지
		hasDatas:function(){ return this.Source.isEnough(); },
		//현위치에서 Datas의 깊이를 체크함
		depth:function(def){
			def = (typeof def == "undefined" ? 0 : def + 1);
			if(this.hasDatas()){
				return this.Source.getMap( function(dataGrid){ return dataGrid.depth(def)} ).sort().useLast();
			} else {
				return def;
			}
		},
		//데이터의 형태를 string형태로 뽑아넴
		trace:function(j,k){
			var ra = this.Reference == "array";
			var rs = ra ? "[" : "{";
			var re = ra ? "]" : "}";
			var prop = [];
			for(var key in this.Property) prop.push( (j?'\"':'') + key + (j?'\":\"':':') + this.Property[key] + (j?'\"':'') );
			if(this.hasDatas() || k !== true) prop.push( (ra ? '' : (j?'\"'+this.DatasName + '\":[' : this.DatasName + ':[') ) + this.Source.getMap( function(dataGrid){ return dataGrid.trace(j); } ).join(", ") + (ra ? "" : "]") );
			return rs + prop.join(", ") + re;
		},
		//메타데이터를 string으로 뽑아냄
		traceProperty:function(j){
			var ra = this.Reference == "array";
			var rs = ra ? "[" : "{";
			var re = ra ? "]" : "}";
			var prop = [];
			for(var key in this.Property) prop.push( (j?'\"':'') + key + (j?'\":\"':':') + this.Property[key] + (j?'\"':'') );
			return rs + prop.join(", ") + re;
		},
		getJSONString:function(){ return this.trace(true); },
		getJSONStringOfProperty:function(){ return this.trace(true,true); },
		getJSONObject:function(){ return JSON.parse(this.getJSONString()); },
		//각 하위 데이터마다  메서드 호출
		injectDatas:function(method){
			this.Source.inject(this,method);
			return this;
		},
		//아래부터 위로 메서드 호출
		feedup:function(feedupMethod,depth,infinityTop){
			depth = (typeof depth == "undefined" ? 0 : depth ); 
			if(depth == infinityTop) return undefined;
			var feedData = [];
			this.Source.each(function(dataGrid){
				var feed = dataGrid.feedup.call(dataGrid,feedupMethod,depth + 1,infinityTop);
				if(typeof feed !== undefined) feedData.push(feed);	
			});
			return feedupMethod.call(this,feedData,depth);
		},
		feeddown:function(feeddownMethod,cutIndex,depth,feedData){
			depth = (typeof depth == "undefined" ? 0 : depth ); 
			var feedData = [];
			if(depth == cutIndex) return undefined;
			this.Source.each(function(dataGrid){
				var feed = dataGrid.feeddown.call(dataGrid,feeddownMethod,cutIndex,depth + 1);
				if(typeof feed !== undefined) feedData.push(feed);
			});
			return feeddownMethod.call(this,feedData,depth);

		},
		//
		updateStatus:function(){},
		setDataStatus:function(keyword){
			switch(keyword.toLowerCase()){
				case "new": case "loaded": case "commit": case "update":
					this.DataStatus = keyword.toLowerCase();
					break;
				defualt : 
					console.warn("DataGrid::dataStatus에 올바르지 않은 값이 들어왔습니다");
					break;
			}
		},
		//DataGrid를 Depth값으로 얻어옴
		getDataGridByDepth:function(require,def,result,index,index2){
			index  = (typeof index  == "undefined" ? 0 : index);
			index2 = (typeof index2 == "undefined" ? 0 : index2);
			def    = (typeof def    == "undefined" ? 0        : def + 1);
			result = (typeof result == "undefined" ? _Array() : result );
			if(require == def)  {
				result.touchWithEval("_Array()",index2);
				result[index2].push(this);
				return result;
			}
			if(require-1 == def) index2 = result.length

			if(this.hasDatas()) this.Source.each( function(dataGrid,i){ return dataGrid.getDataGridByDepth(require,def,result,index,index2)} );

			return result;
		},
		//DataGrid를 indexs(call)형태로 얻어옴
		getDataGridByIndexs:function(){
			var params = _Array(arguments);
			if(params.isNothing()) return this;
			var target = this.Source[params.useFirst()];
			if(typeof target == "undefined"){
				return undefined;
			} else {
				return target.getDataGridByIndexs.apply(target,params.getSubarr(1).toArray()); 
			}
		},
		//어떠한 데이터그리드의 Indexes를 얻어옴
		getIndexesByDataGrid:function(dataGrid,indexes){
			if(typeof indexes == "undefined") indexes = [];
			//	console.log("matching",this.traceProperty(),"  ===   ",dataGrid.traceProperty(),"   ==>   ",dataGrid == this);
			if(dataGrid == this)        return indexes;
			if(this.Source.isNothing()) return undefined;
			//
			var beginResult;
			this.Source.each(function(_dg,i){
				var i2 = MV(indexes);
				i2.push(i);
				var dgResult = _dg.getIndexesByDataGrid(dataGrid,i2);
				if(typeof dgResult == "object") {
					beginResult=dgResult;
					return false;
				}
	
			});
			return beginResult;
		},
		//하위 데이터 그리드를 삭제함
		deleteWithDataGrid : function(dataGrid){
			var _dataGrid = this.Source.getEqual(dataGrid).useFirst();
			if(typeof _dataGrid == "undefined"){
				var result;
				this.Source.each(function(_dg){
					var beginResult = _dg.deleteWithDataGrid(dataGrid);
					if(ISTYPE(beginResult,DataGrid)){
						result = beginResult;
						return false;
					}
				});
				return result;
			} else {
				_dataGrid.deleteParent();
				this.Source.remove(_dataGrid);
				return _dataGrid;
			}
		},
		//상하 트리구조
		deleteParent : function(){ this.Parent = undefined; return this;},
		setParentData    : function(p,exceptionIgnore){ if(ISTYPE(p,DataGrid)) { this.Parent = p; } else if(exceptionIgnore !== true) { throw new Error("Data::부모 객체 설정이 잘못되었습니다." + TOS(p)); } return this },
		getParentData    : function(){ return this.Parent; },
		//액션
		moveUp:function()    { if(this.Parent)this.Parent.Source.left(this.Parent.Source.indexOf(this)); },
		moveDown:function()  { if(this.Parent)this.Parent.Source.right(this.Parent.Source.indexOf(this)); },
		selfDelete:function(){ if(this.Parent)this.Parent.Source.remove(this); },
		//현재 레벨의 인덱스를 반환함
		placeIndex:function(){ return this.Parent.Source.indexOf(this); },
		placeDepth:function(depth){
			depth = depth ? depth : 0;
			if(this.Parent){
				depth++; 
				return this.Parent.placeDepth(depth)
			}
			return depth;
		},
		getDataWithDepth:function(depth){
			depth = isNaN(depth) == true ? 0 : parseInt(depth);
			return _Array( this.feeddown(function(data,index) { if(index == depth) return data; }) ) ;
		},
		length:function(index){ return this.Source.length; },
		appendData : function(data,insertParam) { 
			var _dataGrid = ISTYPE(data,DataGrid) ? data.setParentData(this) : _DataGrid(data,this.DatasName,this);
			this.Source.insert( _dataGrid , parseInt(insertParam) );
			return _dataGrid;
		},
		getDatas   : function()     { return this.Source; },
		getData    : function(index){ return this.Source[index]; },
		setData:function(data){
			this.ReferenceData = data;
			var own = this;
			if(ISTYPE(data,DataGrid) == true) console.error("현재는 DataGrid::setData에 DataGrid Object를 넣으면 안됩니다.");
			if(ISARRAY(data)){
				this.Source = _Array(data).map(function(d){return _DataGrid(d,own.DatasName,own);});
				this.Reference = "array";
			} else if (typeof data == "object") {
				this.Reference = "object";
				this.prop(data);
				this.propFirst(true);
				if(typeof data[this.DatasName] == "undefined"){
					this.Source = _Array();
				} else {
					this.Source = _Array(data[this.DatasName]).map(function(d){return _DataGrid(d,own.DatasName,own);});
					delete this.Property[this.DatasName];
				}
			} else if( typeof data == "undefined" ){
				this.Reference = "unknown";
				this.Source = _Array();
			} else if( typeof data == "string") {
				var tranceData = OBJECT(data,"string");
				if(typeof tranceData == "object"){
					console.warn("DataGrid::setData::String유형의 데이터를 받앗습니다. Data의 표현이 올바르지 않을수 있습니다. =>",TOS(tranceData));
					this.setData(tranceData);
				} else {
					console.error("DataGrid::setData::지원하지 않는 유형의 데이터를 받앗습니다! =>",data);
				}
			} else  {
				if(ISTYPE(data,DataGrid) == true) console.error("DataGrid::setData::제대로 처리하지 못하였습니다.");
			}
		},
		prop : function(key,value){
			if(ISTEXT(key) && (arguments.length > 1)){
				this.Property[key] = value;
			} else if (ISTEXT(key)) {
				return this.Property[key];
			} else if(typeof key == "undefined"){
				return MV(this.Property);
			} else if(typeof key == "object"){
				for(var kk in key) this.prop(kk,key[kk]);
			}
			return this;
		},
		propFirst : function(key,value){
			if(key == true){
				this.propFirst(this.Property);
			} else if(ISTEXT(key) && (arguments.length > 1)){
				this.PropertyFirst[key] = value;
			} else if (ISTEXT(key)) {
				return this.PropertyFirst[key];
			} else if(typeof key == "undefined"){
				return MV(this.PropertyFirst);
			} else if(typeof key == "object"){
				for(var kk in key) this.propFirst(kk,key[kk]);
			}
			return this;
		},
		isPropertyChanged :function(){
			var uniqueKey = _Array().concat(_Object(this.Property).keys()).concat(_Object(this.PropertyFirst).keys()).unique();
			var result = false;
			var propC = this.Property;
			var propF = this.PropertyFirst;
			uniqueKey.each(function(key){
				if(!(key in propC) || !(key in propF) || propC[key] !== propF[key]) {
					result = true;
					return false;
				}
			});
			return result;
		}
	},function(data,childNameSpace,parent,dataStatus){
		this._super();
		
		//기본 계층 이름
		this.DatasName = (typeof childNameSpace == "undefined" ? "datas" : childNameSpace);
		//부모 DataGrid등록
		this.setParentData(parent,true);

		//prop
		this.Property       = {};
		this.PropertyFirst  = {};

		//기본 데이터 형
		this.Reference;
		this.setData(data);

		//status
		this.DataStatus = "new";
	});
	//render
	makeModule("DataBehavior",{
		//DataGrid dataSetGet
		data:function(k,v){
			if(typeof k == "string" && arguments.length > 1){
				return this.DataGrid.prop(k,v);
			} else {
				this.DataGrid.prop(k)
			}
		},
		getData:function(key){ return this.DataGrid.prop(key); },
		setData:function(key,value){ return this.DataGrid.prop(key,value); },
		//
		dataIndex:function(){ return this.DataGrid.placeIndex(); },
		makeBehaviorManager : function(controller,render){
			if(typeof this.DataBehaviors[controller.__uid__] == "undefined") this.DataBehaviors[controller.__uid__] = {};
			this.DataBehaviors[controller.__uid__].Controller = controller;
			this.DataBehaviors[controller.__uid__].Render     = render;
			this.DataBehaviors[controller.__uid__].Children   = [];
			this.DataBehaviors[controller.__uid__].Root       = undefined;
		},
		getBehaviorManager:function(controller){
			return this.DataBehaviors[controller.__uid__];
		},
		setBehaviorManagerBindTarget:function(propName,target){
			if(propName in this.Bind == false) 
			this.Bind[propName] = [];
			this.Bind[propName].push(target);
			return this;
		},
		setBehaviorManagerRoot:function(controller){
			if(controller){
				this.DataBehaviors[controller.__uid__].Root = root;
			} else {
				throw new Error("setBehaviorManagerRoot에 상이한 값이 들어왔습니다. controller는 다음의 값으로 들어왔습니다. => ",TOS(root));
			}
			return this;
		},
		getBehaviorManagerChildren:function(controller,root){
			var rsd = this.DataBehaviors[controller.__uid__];
			if(controller) if(rsd) if(rsd.Children) return rsd.Children;
			throw new Error("getBehaviorManagerChildren의 작동이 올바르지 않습니다. => ",TOS(root));
		},
		callRender:function(controller,children){
			var sMeta = this.DataBehaviors[controller.__uid__];
			sMeta.Children = children;
			var space = this.makeSpaceWithController(controller);
			var sRoot = sMeta.Render.call(space,sMeta.Children);
			if(ISELNODE(sRoot)) sMeta.Root = sRoot;
			return sRoot;
		},
		getRootByController:function(controller){
			for(var key in this.DataBehaviors){
				if(this.DataBehaviors[key].Controller == controller){
					return this.DataBehaviors[key].Root;
				}
			}
		},
		//prop binding
		applyBind:function(propName,value,sender){
			if(typeof this.DataGrid.prop(propName) == "undefined") { 
				
				
				console.log("DataBehavior::applyBind 존재하지 않는 메타값의 이벤트를 발생하엿습니다.(propName,value,sender)",propName,value,sender,"존재하는 키들",_Object(this.DataGrid.prop()).keys()); 
				return this; 
			}
			//applyData
			if(sender !== this) this.DataGrid.prop(propName,value);

			//applyElement
			var els = this.Bind[propName];
			for(var i=0,l=els.length;i<l;i++)  if(els[i] !== sender)  switch(els[i].tagName.toLowerCase()){
				case "input" : case "select" : ELVALUE(els[i],value); break;
				case "h1": case "h2": case "h3": case "h4": case "h5": case "h6": case "div": case "p": case "dt": case "dd": case "small": case "tr": case "td": case "th":
					els[i].innerHTML = value;
					break;
				default :
					console.log("DataBehavior::bindElement::지원하지 않는 element입니다.",propName)
					break;
			}
		},
		//makeSpace
		makeSpaceWithController:function(controller){
			var _dataBehavior = this;
			var space = new (function(){})();
			space.controller = function(name){ return controller };
			space.datas   = function(){ return _dataBehavior.DataGrid.Property };
			space.data    = function(name,valueChange){ return FJOB(valueChange,_dataBehavior.getData(name));};
			space.text    = function(){ return ELTEXT( this.data.apply(this,arguments) ); };
			space.setData = function(){ _dataBehavior.setData(name); return this; };
			space.bind    = function(dataName,bindEl,valueChange) {
				//설정하 value값
				var setValue = this.data(dataName,valueChange);
				if(typeof setValue == "undefined"){
					console.warn("Space::bind::존재하지 않는 키 값에 바인딩 하려고 하였습니다. =>", dataName);
					return EL("div",{"html":"DataBehavior::bind::error::" + dataName + " is undefined"});
				}
				//엘리먼트 기본설정값
				var element = typeof bindEl == "undefined" ? EL("input!"+dataName) : EL(bindEl) ;
				var appendElements;
				if(typeof valueChange == "function"){
					appendElements = _Array(arguments).subarr(3).toArray();
				} else {
					appendElements = _Array(arguments).subarr(2).toArray();
				}
				if(appendElements.length > 0) ELAPPEND(element,appendElements);
				// 이벤트 등록
				var own = this;
				if( ISELNODE(element) ){
					switch(element.tagName.toLowerCase()){
						//write
						case "input" :
							ELON (element,"keyup value_change",function(e) {
								setTimeout(function(){
									_dataBehavior.applyBind(dataName, ELVALUE(element), element); 	
								},0);
							});
							break;
						case "select":
							ELON (element,"change value_change",function(e){
								setTimeout(function(){
									_dataBehavior.applyBind(dataName, ELVALUE(element), element);
								},0);
							});
							break;
						default : /*readOnly*/ break;
					}
					ELVALUE(element,setValue);
				} else {
					console.warn("DataBehavior::bind::element를 바인딩할 수 없습니다. 지시자의 오류입니다. =>=>",bindEl,element);
				}
				// 바인드 설정
				_dataBehavior.setBehaviorManagerBindTarget(dataName,element);
				return element;
			};
			//보이지 않는 값
			space.hidden = function(dataName){ this.bind(dataName,"hidden!"+dataName); };
			space.action = function(eventName,elementSource,cv1,cv2){
				var element,option,handle;
				if(typeof cv1 == "function"){
					handle = cv1;
					option = cv2;
				} else if (typeof createValue3 == "function") {
					option = cv1;
					handle = cv1;
				} else { 
					option = cv2;
				}
				var owner   = controller;
				var element = EL(elementSource);
				ELON(element,"click", function(){ owner.triggerWithDataBehavior(_dataBehavior,eventName,element,option); } );
				if(typeof handle == "function") owner.addEventWithRS(eventName,this,handle);
				return element;
			};
			//
			var dataGrid = this.DataGrid;
			space.pointer = function(tag,option){
				if(typeof tag !== "string") tag = "hidden.bind";
				var el = EL(tag,option);
				el._dataGrid = dataGrid;
				el._data     = dataGrid.ReferenceData;
				return el;
			};
			//체크박스 //라디오 //히든
			space.checkbox = function(option){ return space.pointer("checkbox.bind",option); };
			space.radio    = function(option){ return space.pointer("radio.bind",option); };
			space.hidden   = function(option){ return space.pointer(undefined,option); };
			
			return space;
		},
		//bebavior
		remove:function(){
			for(var key in this.DataBehaviors){
				dataBehavior = this.DataBehaviors[key];
				ELREMOVE(dataBehavior.Root);
				delete dataBehavior["Controller"];
				delete dataBehavior["Render"];
				delete dataBehavior["Children"];
				delete dataBehavior["Root"];
				delete this.DataBehaviors[key];
			}
			_DataBehaviorKit.deleteDataBehavior(this.DataGrid);
			this.DataGrid.selfDelete();
		},
		insert:function(data,index){
			var curDataGrid = this.DataGrid;
			var newDataGrid = curDataGrid.appendData(data,index);
			for(var key in this.DataBehaviors){
				var _DB = this.DataBehaviors[key];
				_DB.Controller.refresh();
			}
			return this;
		},
		push:function(data){
			this.insert(data,this.DataGrid.length());
			return this;
		}
	},function(dataGrid){
		if(ISTYPE(dataGrid,DataGrid)){
			this.DataBehaviors = {};
			this.DataGrid      = dataGrid;
			this.Bind          = {};
		} else {
			throw new Error("DataBehavior::InitError:: Init파라메터는 DataGrid값으로 들어와야 합니다. =>",TOS(dataGrid));
		}
	});
	makeSingleton("_DataBehaviorKit",{
		deleteDataBehavior:function(){
			console.warn("deleteDataBehavior는 개발중입니다");
		},
		getDataBehavior:function(dataGrid){
			if(typeof this.dataContextKitStorage[dataGrid.__uid__] == "undefined") this.dataContextKitStorage[dataGrid.__uid__] = _DataBehavior(dataGrid);
			return this.dataContextKitStorage[dataGrid.__uid__];
		}
	},function(){
		this.dataContextKitStorage = {};
	});
	makeModule("DataRender",{
		renderExceptionElement:function(dataGrid,feedViews,depth){
			return ELSTYLE(ELAPPEND(EL("div",{html: TOS(dataGrid.prop()) }), feedViews),"padding-left", depth * 10 + "px");
		},
		renderByDataGrid:function(depth,dataGrid,feedViews,controller){
			if(typeof this.Source[depth] == "function") {
				var _dataBehavior = _DataBehaviorKit.getDataBehavior(dataGrid);
				_dataBehavior.makeBehaviorManager(controller,this.Source[depth]);
				var _rsRenderResult = _dataBehavior.callRender(controller,_Array(feedViews));
				//depth
				if(ISELNODE(_rsRenderResult)) {
					var className = ELATTR(_rsRenderResult,"class");
					className = (typeof className == "undefined") ? "RenderDepth-"+depth : className + (" RenderDepth-"+depth);
					return _rsRenderResult;
				}
				console.warn("경고::DataRender의 Render결과값이 잘못되었습니다. => ",_rsRenderResult,"  관련값 Controller,DataGrid => ",controller,dataGrid);
			} else if (typeof this.Source[depth] !== "undefined" && this.Source[depth] == null) {
				return feedViews;
			}
			return this.renderExceptionElement(dataGrid,feedViews,depth);
			//return element
		},
		complete:function(completeMethod){
			return this.CompleteMethod = completeMethod;
		}
	},function(renderDepth){
		var _dataBehavior = this;
		this.Source = _Array(arguments).map(function(a){
			if(typeof a == "string"){
				return function(args){
					return ELAPPEND(E(a),args)
				}
			}
			return a;
		})
		this.CompleteMethod;
	});
	extendModule("EventInterface","DataController",{
		//debug
		trace  : function(){ return this.Source.trace(); },
		getJSONString:function(){ return this.Source.getJSONString(); },
		//setup
		__setupDepth:function(defaultDepth){
			var soruceDepth      = this.Source.depth();
			this.DataDepthDefine = isNaN(defaultDepth) == true ? soruceDepth : parseInt(defaultDepth);
			this.DataDepth       = soruceDepth < this.DataDepthDefine ? soruceDepth : this.DataDepthDefine ;
		},
		__setupData:function(data,d){
			this.Source          = ISTYPE(data,DataGrid) ? data : _DataGrid(data);
			this.__setupDepth(d);
		},
		//init override target
		initData:function(d1,d2){
			return this.__setupData.apply(this,arguments);
		},
		//history
		setRenderHistory : function(renderArgs){
			var filter = this.RenderHistory.getFilter(function(history){
				return history[1] == renderArgs[1];
			});
			if(filter.isNothing() == true) this.RenderHistory.push(renderArgs);
			return this;
		},
		getRenderHistory : function(){
			return this.RenderHistory;
		},
		removeRenderHistory:function(context){
			var removedObject = [];
			this.RenderHistory.filter(function(history){
				if(history[1] == context){
					removedObject.push(context);
					return false;
				}
				return true;
			});
			return removedObject;
		},
		getContexts:function(){
			return _Array(this.RenderHistory).getMap(function(h){ return h[1]; }).toArray();
		},
		//rerender
		refresh:function(refreshData){
			var own = this;
			if(refreshData) this.initData(refreshData);
			var newData = this.Source;
			this.RenderHistory.each(function(renderData){
				var r = renderData;
				r[0].renderData = newData;
				own.__render__.apply(own,r);
			});
		},
		//status
		statusAll:function(keyword){
			this.Source.setStatusAll(keyword);
		},
		validate:function(depth,validate,validateFinal){
			depth = isNaN(depth) == true ? this.Source.depth() : parseInt(depth) ;
			var result = this.Source.getDataWithDepth(depth);
			validate = (typeof validate == "function") ? validate : (typeof this.DataValidate == "function") ? this.DataValidate : false ;
			if(validate == false) return true;
			validateFinal = (typeof validateFinal == "function") ? validateFinal : (typeof this.DataValidateFinal == "function") ? this.DataValidateFinal : function(validateResult){
				return ISNOTHING(validateResult);
			};
			//validate
			result.each(function(dataSource){
				CALL(validate,dataSource.prop());
			}).remove(undefined);
			//validateFinal
			return validateFinal(result);
		},
		setValidate:function(v1,v2){
			this.DataValidate      = v1;
			this.DataValidateFinal = v2;
			return this;
		},
		//render
		__render__:function(renderDataObject,renderContext,dataRender){
			//렌더데이터 추출
			var renderData    = renderDataObject.renderData;
			var renderFromTop = renderDataObject.renderFromTop;
			var renderLimit   = renderDataObject.renderTop;
			
			var renderIndex = renderDataObject.renderIndex;

			//컨텍스트 확인
			renderContext = FINDZERO(renderContext);
			if(ISELNODE(renderContext) == false){ throw new Error("DataController에서 render를 할수없습니다. 컨텍스트 값의 오류로 렌더할수 없습니다. => context => " + TOS(renderContext) ); }
			
			//렌더러확인
			if(typeof dataRender == "undefined") {
				dataRender = _DataRender();
			} else if (ISARRAY(dataRender) == true){
				dataRender = APPLY(_DataRender,undefined,dataRender);
			} else if (!ISTYPE(dataRender,DataRender)) {
				throw new Error("DataController::render // 첫번째 파라메터는 DataRender인스턴스 이여야 합니다. param0 => " + dataRender );
			} 
			//렌더기록 남기기
			this.setRenderHistory(Array.prototype.slice.apply(arguments));

			// 해당 깊이로 렌더링함
			var dataSelects = _Array(arguments).getSubarr(3);
			var dataDeep    = dataSelects.length;
			var targetDatas = renderData.getDataGridByIndexs.apply(renderData,dataSelects.toArray());
			
			//indexes 설정에러시
			if(typeof targetDatas == "undefined"){ throw new Error("DataControll::render // 해당깊이의 데이터를 찾지 못하였습니다. => [" + dataSelects.join(", ") + "]", "renderData",renderData); }

			//렌더링시작
			var own = this;
			var depthOfDefault;
			if(renderFromTop == true){
				depthOfDefault = (this.DataDepth - dataDeep) + (this.DataDepthDefine - this.DataDepth);
			} else {
				depthOfDefault = this.DataDepth - dataDeep;
			}
			//console.log("render context",ELTRACE(renderContext),this.Source.trace());
			var elementOfRenderResult = targetDatas.feedup(function(feedData,depth){
				var feeds = _Array(feedData).getFlatten().toArray();
				var renderIndex;
				if(typeof renderLimit == "number"){
					renderIndex = (own.DataDepth - depth) - (own.DataDepth - renderLimit);
				} else {
					renderIndex = depthOfDefault - depth;
				}
				//console.log("renderIndex",renderIndex," <= ",depth, feedData);
				return dataRender.renderByDataGrid( renderIndex , this, feeds , own);
			},0,renderLimit);
			//마지막 리절트
			if(elementOfRenderResult != renderContext) if(ISELNODE(elementOfRenderResult)) {
				renderContext.innerHTML = "";
				ELAPPEND(renderContext,elementOfRenderResult);
			}
			
			CALL(this.onRenderAfter,this.onRenderAfterIn,renderContext);
			return renderContext;
		},
		//render
		render        : function(renderContext,dataRender)      { this.__render__.apply(this,_Array(arguments).insert({"renderData":this.Source,"renderFromTop":false}).toArray()); return this;  },
		renderFromTop : function(renderContext,dataRender)      { this.__render__.apply(this,_Array(arguments).insert({"renderData":this.Source,"renderFromTop":true}).toArray()); return this; },
		topRender     : function(top, renderContext,dataRender) { this.__render__.apply(this,_Array(arguments).subarr(1).insert({"renderData":this.Source,"renderTop":parseInt(top)}).toArray()); },
		//nothing process
		//getNothingView:function(){
		//	var nothingView = this.RenderNothing.call(this)
		//	if(!ISELNODE(nothingView)) console.warn("getRenderNothing에러 콜백에서 반드시 엘리먼트를 반환하도록 하십시요. =>",nothingView);
		//	return nothingView;
		//},
		//setNothingView:function(f){
		//	if(typeof f == "function"){
		//		this.RenderNothing = f;
		//	} else {
		//		console.error("setRenderNothing은 반드시 함수를 넣어야 합니다.");
		//	}
		//	return this;
		//},
		clear:function(value){
			this.RenderHistory.each(function(history){
				if(typeof value == "string") {
					history[1].innerHTML = value;
				}
			});
		},
		//events
		addEventWithRS:function(eventName,renderSpace,method){
			this.addEvent(eventName,function(){
				if(renderSpace == sender || renderSpace.DataGrid == sender) {
					method.call(renderSpace);
				} else if (element == sender ){
					method.call(renderSpace);
				}
			});
		},
		triggerWithDataBehavior:function(dataBehavior,eventName,sender,parameter){ this.trigger(eventName,[dataBehavior,sender,parameter]); },
		//control
		upWithRS     : function(renderspace){ renderspace.DataGrid.moveUp(); ELUP(renderspace.Root); },
		downWithRS   : function(renderspace){ renderspace.DataGrid.moveDown(); ELDOWN(renderspace.Root); },
		deleteWithRS : function(renderspace){
			if(!ISTYPE(renderspace,DataBehavior)) throw new Error("DataController::deleteWithRS의 파라메터는 DataBehaviorType이 들어와야 합니다.");
			var deleteObject = this.Source.deleteWithDataGrid(renderspace.DataGrid);
			if(typeof deleteObject !== "undefined") ELREMOVE(renderspace.Root);
			return this;
		},
		methodGET:function(url){
			var form  = EL("form","method:get,action:"+url);
			var input = EL("input"); 
			input.value = this.Source.getJSONString();
			form.submit();
		},
		length:function(){ return this.Source.length(); }
	},function(data,defaultDepth,events,dataTranceForm){
		//init event,uid
		this._super();
		//defualt propertys
		this.initData(data,defaultDepth);
		this.DataEvents     = MV(OBJECT(events));
		this.RenderHistory  = _Array();
		//this.RenderNothing  = function(){ return EL("div.nothing"); };
		this.DataTrancefrom = (typeof dataTranceForm == "object") ? dataTranceForm : {} ;
		
		//defualt event
		//element, renderspace, objectattr
		this.setDefaultEvent("up",      function(e,r,o){ r.Controller.upWithRS(r);              });
		this.setDefaultEvent("down",    function(e,r,o){ r.Controller.downWithRS(r);            });
		this.setDefaultEvent("append",  function(e,r,o){ r.Controller.createWithRS(r,o);        });
		this.setDefaultEvent("prepend", function(e,r,o){ r.Controller.createWithRS(r,o,true,0); });

		//event2
		//dataBehavior,sender,parameter
		var Controller = this;
		this.setDefaultEvent("delete",  function(b,s,p)  { 
			if(confirm("정말로 삭제하시겠습니까?")) b.remove();
		});
	});
	extendModule("DataController","ArrayViewController",{
		initData:function(data,depth){
			var setData =  ISARRAY(data) ? data : typeof data == "object" ? [data] : [];
			return this.__setupData(setData,1);
		},
		getDataGrids:function(){ return this.Source.getDatas(); },
		getArrayData:function(){ return _Array(this.getDataGrids()).map(function(_dg){ return _dg.prop() }); },
		getCheckedData:function(){
			var own = this;
			return this.getDataGrids().getFilter(function(dataGrid){ 
				var _db  = _DataBehaviorKit.getDataBehavior(dataGrid);
				var root = _db.getRootByController(own);
				if(FIND("*:checked",root).length > 0) return true;
			});
		},
		getChanged:function(){ return this.getDataGrids().getFilter(function(dataGrid){ return dataGrid.isPropertyChanged(); }); },
		getChangedData:function(indexText){ 
			return this.getChanged().map(function(dataGrid){ 
				if( indexText == "string" ){
					var data = dataGrid.prop();
					data[indexText] = dataGrid.placeIndex();
					return data;
				} else {
					return dataGrid.prop();
				}
			});
		},
		insertRow:function(data,index){
			var _dataBehavior = _DataBehaviorKit.getDataBehavior(this.Source);
			var data = ("defaultContent" in this.DataTrancefrom) ? this.DataTrancefrom.defaultContent : data ;
			if(typeof data == "object"){
				_dataBehavior.insert(data,index);
			} else {
				this.error("DataController::insert::data의 정의가 올바르지 않습니다. => ",data);
			}
		},
		pushRow:function(data){
			var _dataBehavior = _DataBehaviorKit.getDataBehavior(this.Source);
			var data = "defaultContent" in this.DataTrancefrom ? this.DataTrancefrom.defaultContent : data ;
			if(typeof data == "object"){
				_dataBehavior.push(data);
			} else {
				this.error("DataController::push::data의 정의가 올바르지 않습니다. => ",data);
			}
		}
	},function(data){
		this._super(data,1);
		var own = this;
		_Array(arguments).subarr(1).grouping(2).each(function(group){
			if(group.length == 2){
				var context = FINDZERO(group[0]);
				if( !ISELNODE(context) ) return console.error("ArrayViewController::context를 찾을수 없습니다. 셀렉터 =>",group[0]);
				var render  = group[1];
				own.renderFromTop(context,render);
			} else {
				console.warn("ArrayViewController::data다음의 내용들은 2개씩 입력해야합니다.")
			}
		});
		return this;
	});
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
	
	makeModule("Request",{
		__debug:function(data,param,moduleOption){
			var debugObject = {
				method:this.option.method,
				url:this.url,
				param:param,
				data:data,
				dataTrace:undefined,
				dataTraceMax:400
			}
			var debugTrace = typeof moduleOption["debugTrace"] == "function" ? moduleOption["debugTrace"] : false;
			if(debugTrace){
				var getOption = debugTrace(debugObject);
				if(typeof getOption == "object"){
					debugObject = getOption;
				} else {
					console.error("Request::debugTrace시 결과값은 반드시 Object이여야 합니다");
				}
			}
			debugObject["dataTrace"] = (typeof debugObject.data == "undefined") ? "none" : debugObject.data;
			console.info("Request::Success:: [\n - method => "
						,debugObject.method
						,"\n - url    => "
						,debugObject.url
						,"\n - param  => "
						,TOS(debugObject.param)
						,"\n]\n:::result==> "
						,MAX(TOS(debugObject.data),debugObject.dataTraceMax)
						,"\n\n"
					);
			return debugObject;			
		},
		onFinal:function(data,scope,requestObject){
			CALL(this.option.final,scope,data);
		},
		onSuccess:function(data,param,moduleOption,requestObject){
			//디버그 옵션이 true일 경우 데이터 통신 결과를 알려준다.
			if(moduleOption["debug"] == true) this.__debug(data,param,moduleOption);

			//리퀘스트 컨트롤러의 석세스시 처리
			var requestHandler = CALL(moduleOption["requestSuccess"],moduleOption.scope,data);

			//리퀘스트 컨트롤러의 석세스 이후 에러처리
			if(typeof requestHandler == "string") {
				 if( requestHandler.indexOf("error") > -1 ){
					console.error("Request::통신을 완료하였지만 [requestSuccess]에서 dataError를 보고하고 있습니다. => ",requestHandler.substr(5));
					CALL(this.option,undefined,requestHandler);
					requestHandler = false;
				 }
			}
			var finalData;
			//석세스 처리가 정상적으로 진행될 경우 아닌경우
			if (requestHandler !== false) {
				//CustomRequestControl;
				if(typeof this.option.success == "function"){
					finalData = this.option.success.apply(moduleOption.scope,[data,param]);
				} else {
					console.warn("Request::통신을 완료하였지만 [success] 후처리가 없습니다. data => ",{"responseText":TOS(data)});
				}
			}
			this.onFinal(finalData,moduleOption.scope);
		},
		onError:function(data,param,moduleOption,requestObject){
			var xhr       = requestObject;
			var textError = requestObject.statusText;
			var result = CALL(moduleOption["requestError"],moduleOption.scope,xhr,textError,data );
			var finalData;
			if(result !== false) {
				if(typeof error == "function") var resultIn = this.option.error(xhr,textError,data);
				if(resultIn !== false) console.error("Request::load 호출이 실패되었습니다. JSON 파라메터와 에러코드를 출력합니다. ==> \n------\n" ,TOS(this.option) ,"\n------\n", textError, TOS(this.option.data));
				finalData = resultIn;
			}
			this.onFinal(finalData,moduleOption.scope);
		},
		onStateChangeWithRequest:function(requestObject){
			switch(requestObject.readyState){
				case 4:
					switch(requestObject.status){
						case 200: case 0:
							var response;
							switch(this.option.dataType){
								case "json": case "object":
									try {
										response = JSON.parse(requestObject.responseText);
									} catch(e){
										throw new Error(TOSTRING(this));
										console.error("json 포멧이 올바르지 않습니다. =>",requestObject.status,"::",requestObject.responseText);
										throw e;
									}
									break;
								case "dom": case "node":
									var wrapper = document.createElement("div");
									wrapper.innerHTML = requestObject.responseText;
									response = wrapper.childNodes;
									break;
								case "http": case "html": case "js": case "javascript": case "css": case "stylesheets": default :
									response = requestObject.responseText;
									break;
							}
							this.onSuccess(response, _Meta(requestObject).lastProp("requestParam") ,this.moduleOption, requestObject);
							break;
						default:
							if( this.moduleOption.debug == true ) switch(requestObject.status) {
								case 404 :
									console.info("Request debug :: 404 응답서버가 요청한 바를 찾을 수 없다함");
									break;
								case 500 :
									console.info("Request debug :: 500 응답서버 내부오류");
									break;
							}
							this.onError(response, _Meta(requestObject).lastProp("requestParam") ,this.moduleOption, requestObject);
							break;
					};
					break;
				case 1: case 2: case 3: break;
				default : if( this.moduleOption.debug == true ) console.info("Request debug",requestObject.readyState,requestObject.responseText); break;
			}
		},
		requestForm:function(requestOption){
			if( typeof requestOption == "function" ) requestOption = {success:requestOption};
			requestOption = OBJECT(requestOption,"method");
			var openForm = {};
			var recallLoop = false;
			// 메서드의 형식
			openForm.method     = typeof requestOption.method == "string" ? requestOption.method : "get"  ;
			// success시 data형태
			openForm.dataType = requestOption.dataType ? requestOption.dataType : "html" ;
			//if jsonp call blocked
			//if(openForm.dataType == "jsonp") openForm.jsonpCallback = requestOption.jsonp ? requestOption.jsonp  : "callback";
			//호출 data를 정재한다.
			openForm.data    = requestOption.data;
			//헨들링
			openForm.success = requestOption.success;
			openForm.error   = requestOption.error;
		
			this.option      = openForm;
			return this.option;
		},
		getRequestObject:function(){
			var own=this,
			requestObject = window.XMLHttpRequest ? new XMLHttpRequest() : window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : function () { console.error("XMLHTTPRequest를 지원하지 않는 브라우져입니다"); };
			requestObject.onreadystatechange = function(){ own.onStateChangeWithRequest.call(own,requestObject); };
			return requestObject;
		},
		send:function(success,error){
			//new handler
			if(typeof success == "function") this.option.success = success;
			if(typeof error   == "function") this.option.error   = error;
			if( !("success" in this.option) ) console.warn("Request Warning :: success메서드가 정의되지 않은 상태로 호출되었습니다.");
		
			//request Object만들기
			var newRequest = this.getRequestObject();
		
			//data 처리
			var requestData   = _Object((typeof this.moduleOption.constData == "object") ? _Object(this.moduleOption.constData).concat(this.option.data) : this.option.data);
			var requestString = _Object(requestData.getEncodeObject()).join("=","&");
			
			// request params (기록용)
			_Meta(newRequest).setProp("requestParam",requestData.get());
			try {
				if( this.option.method.toLowerCase() == "post" ){
					newRequest.open("POST", this.url, true );
					try {
						newRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
						newRequest.setRequestHeader('Content-type'    , 'application/x-www-form-urlencoded');
					} catch(e) {
						console.warn("XMLHttpRequest:: setRequestHeader를 지원하지 않는 브라우져입니다");
						throw e;
					}
					newRequest.send( requestString );
				} else {
					newRequest.open("GET", this.url + (ISNOTHING(requestString) == true ? "" : "?"+requestString), true );
					newRequest.send();
				}
			}catch(e){
				if(e.message.indexOf("denied") > 0){
					throw new Error("Cross Domain Error (if current browser is IE)");
				} else {
					throw e;
				}
			}
		}
	},function(url,requestOption,moduleOption){
		//리퀘스트 디폴트
		this.url = url;
		// request option setup
		this.option = this.requestForm(requestOption);
		// module option
		this.moduleOption = OBJECT(moduleOption,"debug");
	});
	extendModule("Request","Open",{},function(url,requestOption,moduleOption){ 
		this._super(url,requestOption,moduleOption);
		this.send();
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
			this.option          = OBJECT(aOption);
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
			data = MV(OBJECT(data));
			if("deleteKey" in this.ActiveRecordOption) if(_Type(data[this.ActiveRecordOption.deleteKey]).isNothing() == false) {
				var deleteValue = data[this.ActiveRecordOption.deleteKey];
				data = {};
				data[this.ActiveRecordOption.deleteKey] = deleteValue;
			}
			this.commandWithEntity("delete",_Object(data).trance(this.ActiveRecordOption["tranceDelete"],this.ActiveRecordOption["tranceOnly"]).getConcat(this.ActiveRecordOption["constDelete"]),success,error);
		}
	},function(type,path,option,moduleOption){
		this.ActiveRecordType         = type;
		this.ActiveRecordPath         = path;
		this.ActiveRecordOption       = MV(OBJECT(option));
		this.ActiveRecordModuleOption = MV(OBJECT(moduleOption));
	});
	
	// spinJS
	//
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
		this.LoaderEvent     = OBJECT(loadEvent);
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
		isVaild:function(){return this.OriginSource?true:false;},
		//getProps
		getFiltedHSV:function(){
			var s = MV(this.Source);
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
		if(!this.isVaild()){ console.error("Color::파라메터의 형식에 대응할 수 올바르지 없습니다. white로 대응합니다.=> ",p1); this.OriginSource=["HEX","FFFFFF"]; };
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
	//수다쟁이 모듈
	extendModule("Array","Magpie",{talk:function(joinText){joinText=typeof joinText=="string"?joinText:"";sneeze=[];this.each(function(t){sneeze.push(_Array(t).getRandom());});return sneeze.join(joinText);}},function(){var magpie=this;_Array(arguments).each(function(a){magpie.push(typeof a=="string"?a.split(","):a);});});
	
	
})(window));