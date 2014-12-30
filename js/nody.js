// Author      // hojung ahn
// Concept     // DHTML RAD TOOL
// tested in   // IE9 + (on 4.0) & webkit2 & air13
// lincense    // MIT lincense
// GIT         // https://github.com/labeldock/Nody
//Nody CoreFoundation

(function(W,NGetters,NSingletons,NModules,NStructure){
	
	// 버전
	var version = new String("0.10.6");
	var build   = new String("873");
	
	// 이미 불러온 버전이 있는지 확인
	if(typeof W.nody !== "undefined"){ W.nodyLoadException = true; throw new Error("already loaded NODY core loadded => " + W.nody + " current => " + version); } else { W.nody = version; }
	
	// 코어버전
	var nodyCoreVersion = new String("1.7");
	var nodyCoreBuild   = new String("72");
	
	// 콘솔설정 : ie에러 고침 : adobe air
	if (typeof W.console !== "object"){W.console = {};} 'log info warn error count assert dir clear profile profileEnd"'.replace(/\S+/g,function(n){ 
		if(!(n in W.console)){W.console[n] = function(){
			if(typeof air === "object") if("trace" in air){
				var args = Array.prototype.slice.call(arguments),traces = [];
				for(var i=0,l=args.length;i<l;i++){
					switch(typeof args[i]){
						case "string" : case "number": traces.push(args[i]); break;
						case "boolean": traces.push(args[i]?"true":"false"); break;
						default: traces.push(TOSTRING(args[i])); break;
					}
				}
				air.trace( traces.join(", ") ); 
			}
		};} 
	});
	
	// MARK("name") 두번호출하면 시간을 측정할수 있음
	var MARKO = {};
	W.MARK = function(name){ if(typeof name === "string" || typeof name === "number") { name = name+""; if(typeof MARKO[name] === "number") { var time = (+new Date() - MARKO[name]);console.info("MARK::"+name+" => "+time) ; delete MARKO[name]; return time  } else { console.info("MARK START::"+name); MARKO[name] = +new Date(); } } };
	
	//IE8 TRIM FIX
	if(!String.prototype.trim) String.prototype.trim = function() { return this.replace(/(^\s*)|(\s*$)/gi, ""); };
	
	//IE7 JSON FIX
	var __aJSONCount__ = "JSON" in W ? 1 : 0; 
	W.aJSON = {
		 "parse"     : function (jtext) { 
			if(__aJSONCount__ < 1){ __aJSONCount__++; }
			 var result;
			 try { result = eval('(' + jtext + ')'); } catch(e) { result = TOOBJECT(jtext); }
			 return result;
		 },
		 "stringify" : function (obj)   {
			if(__aJSONCount__ < 1){ __aJSONCount__++; }
			return W.TOSTRING(obj,Number.POSITIVE_INFINITY,true);
 		}
	};
	if(typeof W.JSON === "undefined"){W.JSON = aJSON;}
	
	//IE8 Success FIX
	if (typeof W.success === "function"){W.success = "success";}
	
	//IE8 function bind FIX
	if (!Function.prototype.bind) { Function.prototype.bind = function (oThis) { if (typeof this !== "function") { /* closest thing possible to the ECMAScript 5 internal IsCallable function */ throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable"); } var aArgs = Array.prototype.slice.call(arguments,1), fToBind = this, fNOP = function () {}, fBound = function () { return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments))); }; fNOP.prototype = this.prototype; fBound.prototype = new fNOP(); return fBound; }; }	
	
	W.NODYENV = (function(){
		var info = {};
		
		var support;
		
		// Operating system
		info.os = /(win|mac|linux|iphone)/.exec(navigator.platform.toLowerCase());
		info.os = (info.os !== null) ? info.os[0].replace("sunos", "solaris") : "unknown";
		
		// Browser Name
		//http://stackoverflow.com/questions/5916900/detect-version-of-browser 191
		var sayswho = (function(){
		    var ua= navigator.userAgent, tem, 
		    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
		    if(/trident/i.test(M[1])){
		        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
		        return 'IE '+(tem[1] || '');
		    }
		    if(M[1]=== 'Chrome'){
		        tem= ua.match(/\bOPR\/(\d+)/)
		        if(tem!= null) return 'Opera '+tem[1];
		    }
		    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
		    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
		    return M.join(' ');
		})();
		
		info.browser        = sayswho;
		//info.browserName    = sayswho.exec(/^(\w+)/)[1];
		//info.browserVersion = sayswho.exec(/[\d\.]+/)[1];
		//generation
		//0 : <ie7 : truble, 1 : <ie8 : teasor , 2 : <ie9 : good, 3 : <ie10 : perfect
		info.browserGeneration
		
		//online
		info.online = navigator.onLine;
	
		//support ComputedStyle
		info.supportComputedStyle  = window.getComputedStyle ? true : false;
		
		//support Query
		info.supportQuerySelectAll = document.querySelectorAll ? true : false;
		
		var lab3Prefix = function(s){
			if( s.match(/^Webkit/) ) return "-webkit-";
			if( s.match(/^Moz/) )    return "-moz-";
			if( s.match(/^O/) )      return "-o-";
			if( s.match(/^ms/) )     return "-ms-";
			return "";
		};
		
		
		var supportPrefix = {};
		
		info.getCSSName = function(cssName){
			cssName.trim();
			for(var prefix in supportPrefix) {
				if( cssName.indexOf(prefix) === 0 ) {
					var sp = supportPrefix[prefix];
					if( sp.length ) return sp+cssName;
				}
			}
			return cssName;
		};
		
		var tester = document.createElement('div')
		//transform
		support = false;
		"transform WebkitTransform MozTransform OTransform msTransform".replace(/\S+/g,function(s){ if(s in tester.style){
			support = true;	
			supportPrefix["transform"] = lab3Prefix(s);
		}});
		info.supportTransform = support;
		
		//transition
		support = false;
		"transition WebkitTransition MozTransition OTransition msTransition".replace(/\S+/g,function(s){ if(s in tester.style){
			support = true;
			supportPrefix["transition"] = lab3Prefix(s);
		}});
		info.supportTransition = support;
		return info;
		
		//getUserMedia
		info.getUserMedia        = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
		info.supportGetUserMedia = !!info.getUserMedia;
	})();
	
	//NativeCore console trace
	W.NativeModule   = function(name){
		if (NModules[name]) {
			var result = name + "(" + /\(([^\)]*)\)/.exec( ((NModules[name].prototype["set"])+"") )[1] + ")";
			var i2 = 0;
			for(var protoName in NModules[name].prototype ) switch(protoName){
				case "set": case "get": case "__NativeType__": case "__NativeHistroy__": case "__NativeHistroy__": case "constructor": case "__NativeClass__": case "_super": case "__GlobalConstructor__":
					break;
				default:
					if(typeof NModules[name].prototype[protoName] === "function") result += "\n    " + i2 + " : " + protoName + "(" + /\(([^\)]*)\)/.exec( ((NModules[name].prototype[protoName])+"") )[1] + ")" ;
					i2++;
					break;
			}
			return result;
		} else {
			return name + " module is not found.";
		}
	};
	
	W.NativeTrace = function(){ 
		var i,key,logText = [];
		//Getter
		var getterText = "# Native Getter";
		for (i=0,l=NGetters.length;i<l;i++){
			getterText += "\n";
			getterText += i;
			getterText += " : ";
			getterText += NGetters[i];
		}
		
		logText.push(getterText);
		//Sigletons
		var singletonText = "# Native Singleton";
		i=0;
		for (key in NSingletons ) {
			singletonText += "\n";
			singletonText += i;
			singletonText += " : ";
			singletonText += key;
			
			var protoName,i2=0;
			switch(key){
				case "SpecialFoundation": case "ELUT": case "NODY": case "FINDEL": case "ElementFoundation": case "ElementGenerator":
					var count = 0;
					for(protoName in NSingletons[key].constructor.prototype) count++;
					singletonText += "\n    [";
					singletonText += count;
					singletonText += "]...";
					break;
				default:
					for(protoName in NSingletons[key].constructor.prototype) {
						singletonText += "\n";
						singletonText += i2;
						singletonText += " : ";
						singletonText += protoName;
						i2++;
					}
					break;
			}
			i++;
		}
		logText.push(singletonText);
		//Module
		var moduleText = "# Native Module";
		i=0;
		for (key in NModules ) {
			moduleText += "\n " ;
			moduleText += i;
			moduleText += " : ";
			moduleText += W.NativeModule(key);
			i++;
		}
		logText.push(moduleText);
		return logText.join("\n");
	};
	
	//NativeCore Start
	var NativeFactoryObject = function(type,name,sm,gm){
		if( !(name in NModules) ){
			var nativeProto,setter,getter;
			switch(type){
				case "object":
					nativeProto = {};
					setter      = typeof sm === "function" ? function(v){ sm.apply(this,Array.prototype.slice.call(arguments)); return this; } : function(v){ this.Source = v; return this; };
					getter      = gm?gm:function(){return this.Source;};
					break;
				case "array":
					nativeProto = [];
					setter      = typeof sm === "function" ? sm : function(v){ return this.setSource(v); };
					getter      = function(){ return this.toArray.apply(this,arguments); };
					break;
				
				default: throw new Error("NativeFactoryObject :: 옳지않은 타입이 이니셜라이징 되고 있습니다. => " + type);
			}
			var nativeConstructor = function(){ if(typeof this.set === "function"){ 
				for(var protoKey in NModules[name].prototype){ if(protoKey.indexOf("+") == 0) this[protoKey.substr(1)] = NModules[name].prototype[protoKey]; }; this.set.apply(this,Array.prototype.slice.apply(arguments)); } 
			};
			
			NModules[name]               = nativeConstructor;
			NModules[name].prototype     = nativeProto;
			NModules[name].prototype.set = setter;
			NModules[name].prototype.get = getter;
			//native concept
			NModules[name].prototype.__NativeType__        = type;
			NModules[name].prototype.__NativeHistroy__     = [name];
			NModules[name].prototype.__NativeClass__       = function(n){ return this.__NativeHistroy__[this.__NativeHistroy__.length - 1] == n };
			//
			NModules[name].prototype.constructor = nativeConstructor;
			NModules[name].prototype._super = function(){
				//scope start
				var currentScopeDepth,currentScopeModuleName,currentScopePrototype,currentMethodName,currentCallMethod=arguments.callee.caller,superScope = 0;
				for(scopeMax=this.__NativeHistroy__.length;superScope<scopeMax;superScope++){
					currentScopeDepth      = (this.__NativeHistroy__.length - 1) - superScope ;
					currentScopeModuleName = this.__NativeHistroy__[currentScopeDepth];
					currentScopePrototype  = NModules[currentScopeModuleName].prototype.constructor.prototype;
					currentMethodName;
					for(var key in currentScopePrototype){
						if(key !== "_super" && currentScopePrototype[key] == currentCallMethod){
							currentMethodName = key;
							break;
						}
					}
					if(typeof currentMethodName !== "undefined"){ break; }
				}
				if(typeof currentMethodName === "undefined"){
					console.error("NodyNativeCore::_super::해당 함수에 그러한 프로토타입이 존재하지 않습니다.",currentCallMethod);
					return undefined;
				}
				//next scope
				var i=0,result=undefined;
				for(var i=0,l=currentScopeDepth;i<l;i++){
					var nextScopeDepth       = this.__NativeHistroy__.length - superScope - 2;
					var nextScopeName        = this.constructor.prototype.__NativeHistroy__[nextScopeDepth];
					var nextScopeConstructor = NModules[nextScopeName];
					var nextScopePrototype   = nextScopeConstructor.prototype;
					var nextSuperMethod      = nextScopeConstructor.prototype[currentMethodName];
					superScope++;
					if(typeof nextSuperMethod === "function"){
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
		if( (typeof methods === "object") && (name in NModules)){
			var protoObject = NModules[name].prototype;
			if(typeof setflag === "function"){ methods.set = setflag; setflag = true; }
			if(typeof getflag === "function"){ methods.get = getflag; getflag = true; }
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
		if(name in NModules) {
			//shortcutConstructor\
			W["_"+name] = function(){
				var scArgs = Array.prototype.slice.call(arguments);
				scArgs.unshift(NModules[name]);
				return new (Function.prototype.bind.apply(NModules[name],scArgs)); 
			};
			NModules[name].prototype.__GlobalConstructor__ = window["_"+name];
			//newConstructor
			W[ (/^(Object|Array|String|Number)$/.test(name) ? "A"+name : name) ] = NModules[name];
		}
	};
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
		var parentConstructor = NModules[parentName];
		if(typeof parentConstructor === "undefined") throw new Error("확장할 behavior ("+parentName+")가 없습니다"+TOSTRING(NModules));
		
		//새 오브젝트 만들기
		if(NativeFactoryObject(parentConstructor.prototype.__NativeType__,name)){
			var extendConstructor = NModules[name];
			NativeFactoryExtend(name,parentConstructor.prototype,true,true);
			NativeFactoryExtend(name,methods,setter,getter);
			extendConstructor.prototype["__NativeHistroy__"].push(name);
			// 비헤이비어 만들기
			NativeFactoryDeploy(name);
		}
	};
	//Getter:Core
	W.makeGetter    = function(n,m){ var name=n.toUpperCase(); W[name]=m; NGetters.push(name); };
	structruePrototype = {
		"get":function(key){ if(key) return this.Source[key]; return this.Source; },
		"empty":function(){ for(var k in this.Source) delete this.Source[k]; return this.Source; },
		"setSource":function(data){ this.empty(); for(var k in data) this.Source[k] = data[k]; return this.Source; },
		"keymap":function(keys,r){ var i=0,sets={}; for(var k in keys) sets[keys[k]] = r(keys[k],k,i++); return this.setSource(sets); },
		"each":function(r){ var i=0; for(var k in this.Source) {var br = r(this.Source[k],k,i++);if(br == false) break;} return this.Source; },
		"map":function(f){ var r = []; this.each(function(v,k,i){ r.push(f(v,k,i)); }); return r; },
		"trace":function(m){ console.log((m?m+" ":"")+TOSTRING(this.Source)); }
	};
	W.makeStructure = function(n,m){
		if(typeof n !== "string" || typeof m !== "function") return console.warn("makeStructure::worng arguments!");
		NStructure[n]=function(){ this.Source={};m.apply(this,Array.prototype.slice.call(arguments)); };
		NStructure[n].prototype = {"constructor":m};
		for(var key in structruePrototype) NStructure[n].prototype[key] = structruePrototype[key];
		window[n] = NStructure[n];
	};
	//Data가 
	StructureInit = function(n,o){ return (o instanceof W[n]) ? o : new W[n](o); };
	//Kit:Core
	W.makeSingleton = function(n,m,i){
		var o=i?i:function(){};
		for(var cname in m) {
			if(typeof cname === "string" && cname.indexOf("Structure#")===0){
				var dataName = cname.substr(10);
				if( dataName.length > 0) W.makeStructure(dataName,m[cname]);
				delete m[cname];
			}
		}
		o.prototype=m;
		o.prototype.constructor=o;
		o.prototype.eachGetterWithPrefix=function(){
			for(var k in o.prototype){
				switch(k){
					case "eachGetter":case "eachGetterWithPrefix":case "constructor":break;
					default: W.makeGetter(n+k,o.prototype[k]); break;
				}
			}
		};
		o.prototype.eachGetter=function(){
			for(var k in o.prototype){
				switch(k){
					case "eachGetter":case "eachGetterWithPrefix":case "constructor":break;
					default: W.makeGetter(k,o.prototype[k]); break;
				}
			}
		};
		W[n]=new o();
		NSingletons[n]=W[n];
	};
	W.makeGetters   = function(o){ if(typeof o === "object") for(var k in o) W.makeGetter(k,o[k]); };
	
	// Foundation UTility
	var FUT_CACHE;
	W.makeSingleton("FUT",{
		//함수를 연속적으로 사용 가능하도록 함
		"CONTINUTILITY":function(func,over,owner){
			over = over||1;
			return function(){
				var args = Array.prototype.slice.apply(arguments);
				if(args.length >= over){	
					for(var i=over,l=args.length;i<l;i++) if(typeof args[i] === "function"){
						return args[i].apply(owner,[func.apply(owner,args.slice(0,i))].concat(args.slice(i+1,l))); 
						break;
					}
				}
				return func.apply(owner,args);
			};
		},
		//URL Info
		"PAGEURLINFO":function(url){
			if(typeof url === "object") return ( url["ConstructorMark"] === ("ClientURLInfo" + W.nody)) ? url : null;
			try {
				var info = /([\w]+)(\:[\/]+)([^/]*\@|)([\w\d\.\-\_\+]+)(\:[\d]+|)(\/|)([\w\d\.\/\-\_]+|)(\?[\d\w\=\&\%]+|)(\#[\d\w]*|)/.exec(url?url:window.document.URL.toString());
			} catch(e) {
				console.error("PAGEURLINFO faild get url info",e);
				return null;
			}
			return {
				"ConstructorMark" : "ClientURLInfo" + W.nody,
				"url"      : window.document.URL.toString(),
				"protocol" : info[1],
				"divider"  : info[2],
				"userinfo" : info[3],
				"hostname" : info[4],
				"port"     : info[5].substring(1),
				"path"     : info[6]+info[7],
				"query"    : info[8],
				"fragment" : info[9],
				"filename" : /(\/|)([\w\d\.\-\_]+|)$/.exec(info[6]+info[7])[2]
			};
		},
		"PAGEROOT":function(url){ var 
			h = FUT.PAGEURLINFO(url);
			var root = h.protocol + h.divider + h.hostname + (h.port !== ""?":"+h.port:h.port);
			return /\/$/.test(root) ? root : root + "/";
		},
		//current loading page info
		"LOADINGSCRIPTURL":function(){ 
			var scripts = document.getElementsByTagName('script');
			var lastScript = scripts[scripts.length-1];
			var scriptString;
			if(lastScript){
				scriptString = lastScript.src;
			} else {
				console.warn("GETSCRIPTURL faild");
			}
			//ie7 fix
			if(!/^[\w]+\:\//.test(scriptString)) scriptString = FUT.PAGEROOT() + scriptString;
			return scriptString;
		},
		"LOADINGSCRIPTROOT":function(){ return FUT.LOADINGSCRIPTURL().replace(/([^\/]+$)/,""); },
		"INCLUDE":function(aFilename){
			var fileref,filetype = /\.([^\.]+)$/.exec(aFilename)[1];
			if (filetype==="js"){ 
				//if aFilename is a external JavaScript file
				fileref=document.createElement('script');
				fileref.setAttribute("type","text/javascript");
				fileref.setAttribute("src", aFilename);
			}
			else if (filetype==="css") {
				//if aFilename is an external CSS file
				fileref=document.createElement("link");
				fileref.setAttribute("rel", "stylesheet");
				fileref.setAttribute("type", "text/css");
				fileref.setAttribute("href", aFilename);
			}
			document.getElementsByTagName("head")[0].appendChild(fileref);
		},
		"CACHEIN":function(sender,name){
			if( !(sender in FUT_CACHE) ) return false;
			if( !(name in FUT_CACHE[sender]) ) return false;
			return true;
		},
		"CACHESET"  :function(s,n,v){ if( !(s in FUT_CACHE) ) FUT_CACHE[s] = {}; FUT_CACHE[s][n] = v; },
		"CACHEGET"  :function(s,n)  { if( this.CACHEIN(s,n) ) return FUT_CACHE[s][n]; },
		"CACHECLEAR":function()     { FUT_CACHE = {"SELECTINFO":{"":{}},"AreaContent":{}}; },
		"CACHETRACE":function()     { return JSON.stringify(FUT_CACHE); }
	});
	FUT.CACHECLEAR();
	
	var TypeBaseMap = {
		"string"    : "ISSTRING",
		"number"    : "ISNUMBER",
		"numberText": "ISNUMBERTEXT",
		"text"      : "ISTEXT",
		"array"     : "ISARRAY",
		"object"    : "ISOBJECT",
		"email"     : "ISEMAIL",
		"ascii"     : "ISASCII",
		"true"      : "ISTRUE",
		"false"     : "ISFALSE",
		"nothing"   : "ISNOTHING",
		"meaning"   : "ISMEANING",
		"enough"    : "ISENOUGH"
	};
	
	makeSingleton("TypeBase",{
		// // 데이터 타입 검사
		"ISUNDEFINED": function (t) {return typeof t === "undefined" ? true : false ;},
		"ISDEFINED"  : function (t) {return typeof t !== "undefined" ? true : false ;},
		"ISNULL"     : function (t) {return t === null ? true : false;},
		"ISNIL"      : function (t) {return ((t === null) || (typeof t === "undefined")) ? true : false;},
		
		"ISFUNCTION" : function (t) {return typeof t === "function" ? true : false;},
		"ISBOOLEAN"  : function (t) {return typeof t === "boolean"  ? true : false;},
		"ISOBJECT"   : function (t) {return typeof t === "object"   ? true : false;},
		"ISSTRING"   : function (t) {return typeof t === "string"   ? true : false;},
		"ISNUMBER"   : function (t) {return typeof t === "number"   ? true : false;},
		"ISNUMBERTEXT" : function (t) {return (typeof t === "number") ? true : ((typeof t === "string") ? (parseFloat(t)+"") == (t+"") : false );},
		
		"ISJQUERY"   : function(o){ return (typeof o === "object" && o !== null ) ? ("jquery" in o) ? true : false : false; },
		"ISARRAY"    : function(a){ return (typeof a === "object" || typeof a === "function") ? ( a !== null && ((a instanceof Array || a instanceof NodeList || ISJQUERY(a) || ( !isNaN(a.length) && isNaN(a.nodeType))) ) ? true : false) : false; },
		"ISEMAIL"    : function(t){ return TypeBase.ISTEXT(t) ? /^[\w]+\@[\w]+\.[\.\w]+/.test(t) : false;},
		"ISASCII"    : function(t){ return TypeBase.ISTEXT(t) ? /^[\x00-\x7F]*$/.test(t)         : false;},
		"ISTRUE"     : function(t){ return !!t ? true : false;},
		"ISFALSE"    : function(t){ return  !t ? false : true;},
		
		//문자나 숫자이면 참
		"ISTEXT" :function(v){ return (typeof v === "string" || typeof v === "number") ? true : false; },
		
		// // 엘리먼트 유형 검사
		"ISWINDOW"  :function(a){ if(typeof a === "object") return "navigator" in a; return false; },
		"ISDOCUMENT":function(a){ return typeof a === "object" ? a.nodeType == 9 ? true : false : false; },
		"ISELNODE"  :function(a){ if(a == null) return false; if(typeof a === "object") if(a.nodeType == 1 || ISDOCUMENT(a) ) return true; return false;},
		"HASELNODE" :function(a){ if( ISARRAY(a) ){ for(var i=0,l=a.length;i<l;i++) if(ISELNODE(a[i])) return true; return false; } else { return ISELNODE(a); } },
		"ISTEXTNODE":function(a){ if(a == null) return false; if(typeof a === "object") if(a.nodeType == 3 || a.nodeType == 8) return true; return false;},
		// // 브라우저 유형 검사
		"ISUNDERBROWSER":function(o){
			var v = o?o:9;
	        if (navigator.appVersion.indexOf("MSIE") != -1) return parseInt(v) > parseInt(navigator.appVersion.split("MSIE")[1]);
	        return false;
		},
		// // 값 유형 검사
		// 0, "  ", {}, [] 등등 value가 없는 값을 검사합니다.
		"ISNOTHING":function(o){ 
	        if (typeof o === "undefined")return true;
			if (typeof o === "string")return o.trim().length < 1 ? true : false;
			if (typeof o === "object"){
				if(o instanceof RegExp) return false;
				if(ISELNODE(o)) return false;
				if(o == null ) return true;
				if(ISARRAY(o)) {
					o = o.length;
				} else {
		            var count = 0; for (var prop in o) { count = 1; break; } o = count;
				}
			}
	        if (typeof o === "number")return o < 1 ? true : false;
	        if (typeof o === "function")return false;
			if (typeof o === "boolean")return !this.Source;
			console.warn("ISNOTHING::이 타입에 대해 알아내지 못했습니다. nothing으로 간주합니다.",o);
	        return true;
		},
		"ISMEANING":function(o){ return !ISNOTHING(o); },
		"ISENOUGH" :function(o){ return !ISNOTHING(o); },
		// 무엇이든 길이 유형 검사
		"TOLENGTH":function(v,d){
			switch(typeof v){ 
				case "number":return (v+"").length;break;
				case "string":return v.length;
				case "object":if("length" in v)
				return v.length;
			}
			return (typeof d=="undefined")?0:d;
		},
		// 무엇이든 크기 유형 검사
		"TOSIZE":function(target,type){
			if((typeof type != "undefined") && (typeof type != "string")) console.error("TOSIZE::type은 반드시 string으로 보내주세요",type);
			switch(type){
				case "numberText" : return parseFloat(target); break;
				case "number"     : return parseFloat(target); break;
				case "textNumber" : case "text" : case "email" : case "ascii" : return (target + "").length; break;
				case "string" : case "array" : return target.length;
				case "object" : default : return TOLENGTH(target); break;
			}
		},
		"IS":function(target,test,trueBlock,falseBlock){
			var testResult;
			if(ISNOTHING(test)) return ISTRUE(target);
			
			switch(typeof test){
				case "string":
					var model = [];
					test.trim().replace(/\S+/g,function(s){ model.push(s); });
				
					for (var i=0,l=model.length;i<l;i++) {
						try {
							var param = /^(\!|)(\w*)([\>\<\=\:]{0,2})([\S]*)/.exec(model[i]);
						} catch(e) {
							console.warn("포멧이 올바르지 않은 키워드 입니다.",model[i]);
						}
					
						var typeMapName = TypeBaseMap[param[2]];
						if( TypeBaseMap[param[2]] ) {
							//type 확인
							testResult = TypeBase[typeMapName](target);
							if(param[1] == "!") testResult = !testResult;
							if(!testResult) break;
							//길이 확인
							if(param[3] != "" && ISNUMBERTEXT(param[4])){
								switch(param[3]){
									case ">": testResult = TOSIZE(target,param[2]) > parseInt(param[4]); break;
									case "<": testResult = TOSIZE(target,param[2]) < parseInt(param[4]); break;
									case "<=": case "=<": testResult = TOSIZE(target,param[2]) <= parseInt(param[4]); break;
									case ">=": case "=>": testResult = TOSIZE(target,param[2]) >= parseInt(param[4]); break;
									case "=" : case "==": testResult = TOSIZE(target,param[2]) == parseInt(param[4]); break;
								}
								if(!testResult) break;
							}
						} else {
							console.warn("인식할수 없는 타입의 키워드 입니다.",param[2]);
						}	
					}
					break;
				case "object":
					if((test instanceof RegExp) && ISTEXT(target)){
						testResult = test.test(target+"");
					} else {
						testResult = false;
					}
					break;
			}
			
			if(testResult === true)  return (typeof trueBlock === "function")  ? trueBlock(target)  : (typeof trueBlock  !== "undefined") ? trueBlock : true;
			if(testResult === false) return (typeof falseBlock === "function") ? falseBlock(target) : (typeof falseBlock !== "undefined") ? falseBlock : false;
			
			return false;
		},
		"AS":function(target,test,tb,fb){
			if(ISSTRING(target)) target = target.trim();
			return IS(target,test,tb,fb);
		}
	});
	TypeBase.eachGetter();
	
	//퍼포먼스를 위해 바깥쪽에 꺼내놓았음
	var CLONEARRAY = function(v) { 
		if( ISARRAY(v) ) { 
			if("toArray" in v){ 
				return Array.prototype.slice.apply(mvArray,v.toArray()); 
			} else {
				var mvArray = [];
				for(var i=0,l=v.length;i<l;i++) mvArray.push(v[i]); 
				return mvArray;
			} 
		}
		if(v||v==0) return [v];
		return [];
	}
	//이미 배열인경우에는 그대로 리턴해준다.
	var TOARRAY = function(t,s){
		if(typeof t === "object") if(ISARRAY(t)) {
			if( (t instanceof NodeList) ||  (t instanceof HTMLCollection) ) return CLONEARRAY(t);
			return t;
		} 
		if(typeof t === "undefined" && arguments.length < 2) return [];
		if(typeof t === "string" && typeof s === "string") return t.split(s);
		return [t];
	};
	
	// Nody Super base
	W.makeSingleton("NodyBase",{
		//owner를 쉽게 바꾸면서 함수실행을 위해 있음
		"APPLY" : function(f,owner,args) { 
			if( typeof f === "function" ) {
				args = CLONEARRAY(args);
				return (args.length > 0) ? f.apply(owner,args) : f.call(owner);
			}
		},
		//값을 플래튼하여 실행함
		"FLATTENCALL" : function(f,owner) {
			 APPLY(f,owner,DATAFLATTEN(Array.prototype.slice.call(arguments,2)));
		},
		"CALL" : function(f,owner) { 
			if(typeof f === "function"){ 
				if (arguments.length > 2) {
					return f.apply(owner,Array.prototype.slice.call(arguments,2));
				} else {
					return f.call(owner);
				}
			} 
		},
		"CALLBACK":function(f,owner){
			if(typeof f === "function"){ 
				if (arguments.length > 2) {
					return f.apply(owner,Array.prototype.slice.call(arguments,2));
				} else {
					return f.call(owner);
				}
			}
			return f;
		},
		//배열이 아니면 배열로 만들어줌
		"TOARRAY":TOARRAY,
		//배열이든 아니든 무조건 배열로 만듬
		"CLONEARRAY":CLONEARRAY,
		//배열안에 배열을 길이만큼 추가
		"ARRAYARRAY":function(l) { l=TONUMBER(l);var aa=[];for(var i=0;i<l;i++){ aa.push([]); }return aa; },
		//배열의 하나추출
		"ZERO"   :function(t){ return typeof t === "object" ? typeof t[0] === "undefined" ? undefined : t[0] : t; },
		//배열의 뒤
		"LAST"   :function(t){ return ISARRAY(t) ? t[t.length-1] : t; },
		//숫자로 변환합니다. 디폴트 값이나 0으로 반환합니다.
		"TONUMBER":function(v,d){
			switch(typeof v){ case "number":return v;case "string":var r=v.replace(/[^.\d\-]/g,"")*1;return isNaN(r)?0:r;break; }
			switch(typeof d){ case "number":return d;case "string":var r=d*1;return isNaN(r)?0:r;break; }
			return 0;
		},
		"PADLEFT":function(nr,n,str){
			 return new Array(n-new String(nr).length+1).join(str||'0')+nr;
		},
		//1:길이와 같이 2: 함수호출
		"TIMES":function(l,f){ l=TONUMBER(l); for(var i=0;i<l;i++){ var r = f(i); if(r==false) break; } return l; },
		"TIMESMAP":FUT.CONTINUTILITY(function(l,f){ l=TONUMBER(l); var r = []; for(var i=0;i<l;i++) r.push(f(i)); return r; },2),
		// 각각의 값의 function실행
		"DATAEACH"    :FUT.CONTINUTILITY(function(v,f){ var ev=TOARRAY(v); for(var i=0,l=ev.length;i<l;i++) f.call(ev[i],ev[i],i); return ev; },2),
		// 각각의 값의 function실행
		"DATAEACHBACK":FUT.CONTINUTILITY(function(v,f){ var ev=TOARRAY(v); for(var i=0,l=ev.length;i<l;i++) f(ev[i],i); return ev; },2),
		// 각각의 값을 배열로 다시 구해오기
		"DATAMAP"     :FUT.CONTINUTILITY(function(v,f){ var rv=[],ev=TOARRAY(v); for(var i=0,l=ev.length;i<l;i++) rv.push(f(ev[i],i)); return rv; },2),
		//
		"INJECT":function(v,f,d){ d=(typeof d=="object"?d:{});v=TOARRAY(v); for(var i=0,l=v.length;i<l;i++)f(d,v[i],i);return d;},
		// 배열안의 배열을 풀어냅니다.
		"DATAFLATTEN":function(){ var result = []; function arrayFlatten(args){ DATAEACH(args,function(arg){ if(ISARRAY(arg)) return DATAEACH(arg,arrayFlatten); result.push(arg); }); } arrayFlatten(arguments); return result; },
		// false를 호출하면 배열에서 제거합니다.
		"DATAFILTER":FUT.CONTINUTILITY(function(inData,filterMethod){
			var data = TOARRAY(inData);
			filterMethod = filterMethod || function(a){ return typeof a === "undefined" ? false : true; };
			if(typeof filterMethod === "function"){
				var result=[];
				DATAEACH(data,function(v,i){ if(filterMethod(v,i)==true) result.push(v); });
				return result;
			}
			return [];
		},2),
		//중복되는 값 제거
		"DATAUNIQUE" :function() {
			var value  = [];
			var result = [];
			for(var ai=0,li=arguments.length;ai<li;ai++){
				var mvArray = CLONEARRAY(arguments[ai]);
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
		"DATAINDEX":function(data,compare){ var v = TOARRAY(data); for(var i in v) if(compare == v[i]) return TONUMBER(i); },
		//i 값이 제귀합니다.
		"REVERSEINDEX":function(index,maxIndex){ return (maxIndex-1) - index },
		"TURNINDEX":function(index,maxIndex){ if(index < 0) { var abs = Math.abs(index); index = maxIndex-(abs>maxIndex?abs%maxIndex:abs); }; return (maxIndex > index)?index:index%maxIndex; },
		"SPRINGINDEX":function(index,maxIndex){ index = TONUMBER(index); maxIndex = TONUMBER(maxIndex); return (index == 0 || (Math.floor(index/maxIndex)%2 == 0))?index%maxIndex:maxIndex-(index%maxIndex); },
		//오브젝트의 key를 each열거함
		"PROPEACH":FUT.CONTINUTILITY(function(v,f){if((typeof v === "object") && (typeof f === "function")){for(k in v) {f(v[k],k)}}; return v; },2),
		//
		"PROPMAP":FUT.CONTINUTILITY(function(v,f){ var result = {}; if(typeof v === "object" && (typeof f === "function")){ for(var k in v) result[k] = f(v[k],k); return result; } return result;},2),
		//오브젝트의 key value값을 Array 맵으로 구한다.
		"PROPDATA" :FUT.CONTINUTILITY(function(v,f){ var result = []; if(typeof f !== "function") f = function(v){ return v; }; if(typeof v === "object"){ for(var k in v) result.push(f(v[k],k)); return result; } return result;},2),
		//
		"PROPLENGTH":function(data){ var l = 0; if(typeof data === "object" || typeof data === "function") for(var key in data) l++; return l; },
		//새로운 객체를 만들어 복사
		"CLONE"  : function(t,d) { 
			if(d) {
				if(ISARRAY(t)) {
					if(!ISARRAY(d)) { d = [] };
					for (var i=0,l=t.length;i<l;i++) d.push( ((typeof t[i] === "object" && t[i] !== null ) ? CLONE(t[i]) : t[i]) )
					return d;
				} else {
					if(d == true) { d = {} };
			        for (var p in t) (typeof t[p] === "object" && t[p] !== null && d[p]) ? CLONE(t[p],d[p]) : d[p] = t[p];
					return d;
				}
				
			}
			switch(typeof t){
				case "undefined": return t; break;
				case "number": return t+0; break;
				case "string": return t+"";break;
				case "object":
				if(t instanceof Date){var r=new Date();r.setTime(t.getTime());return r;}
				if(t instanceof Array){var r=[]; for(var i=0,length=t.length;i<length;i++)r[i]=t[i];return r;}
				if( ISELNODE(t) == true ) return t;
				if(t instanceof Object){var r={};for(var k in t)if(t.hasOwnProperty(k))r[k]=t[k];return r;}
				default : console.error("CLONE::copy failed : target => ",t); return t; break;
			}
		},
		//첫번째 소스에 두번째 부터 시작하는 소스를 반영
		"EXTEND":FUT.CONTINUTILITY(function(data){
			if(typeof data !== "object") return data;
			for(var i=1,l=arguments.length;i<l;i++) if( typeof arguments[i] == "object" ) for(var key in arguments[i]) data[key] = arguments[i][key];
			return data;
		},2),
		//완전히 새로운 포인터 오브젝트에 다른 소스를 반영
		"MARGE":FUT.CONTINUTILITY(function(data){
			if(typeof data !== "object") return data;
			return EXTEND.apply(undefined,[CLONE(data,true)].concat(Array.prototype.slice.call(arguments)));
		},2),
		//무엇이든 문자열로 넘김
		"TOSTRING":function(tosv,depth,jsonfy){
			switch(typeof tosv){
				case "string" : return jsonfy==true ? '"' + (tosv+"") + '"' :tosv+""; break;
				case "number" : return (tosv+""); break;
				case "object" : 
					if(typeof depth === "undefined") depth = 10;
					if(depth < 1) return "...";
					if(tosv==null){
						return jsonfy==true ? '"null"' : "null";
					} else if(ISELNODE(tosv)) {
						if(tosv == document) { return '"[document]"'; }
						//node3
						var tn = tosv.tagName.toLowerCase();
						var ti = ISNOTHING(tosv.id) ? "" : "#"+tosv.id;
						var tc = ISNOTHING(tosv.className) ? "" : "." + tosv.className.split(" ").join(".");
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
						var result = DATAMAP(tosv,function(o){ TOSTRING(o); }).join(", ");
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
		//무엇이든 문자열로 넘기지만 4댑스 이하로는 읽지 않음
		"TOS"  : function(tosv,jsonfy){ return TOSTRING(tosv,9,jsonfy); },
		//어떠한 객체의 길이를 조절함
		"MAX"  : function(target,length,suffix){
			if(typeof target === "string"){
				length = isNaN(length) ? 100 : parseInt(length);
				suffix = typeof suffix === "string" ? suffix : "...";
				if( target.length > length ){
					return target.substr(0,length) + suffix;
				}
			} else if (ISARRAY(target)) {
				if (target.length > length) target.length = length;
			}
			return target;
		},
		//inspect type
		"ISTYPE":function(t,v) {
			//real
			try {
				if(t instanceof v) return true;
			} catch(e){
				//tName
				var vn = ((typeof v === "function") ? v["__NatvieContstructorName__"] : v);
				//inspect
				if( (typeof t=="object") && (typeof vn=="string") ) if("__NativeHistroy__" in t) {
					var his = t["__NativeHistroy__"];
				
					for(var i=0,l=his.length;i<l;i++){
						if(his[i] == vn) return true;
					}
				}
			}
			return false;
		}
	});
	NodyBase.eachGetter();
	
})(window,[],{},{},{});

//Nody Foundation
(function(W){
	if(W.nodyLoadException==true){ throw new Error("Nody Process Foundation init cancled"); return;}
	W.makeSingleton("SpecialFoundation",{
		"RATIO100":function(){
			var total = 0;
			return DATAMAP(arguments,function(v){
				var num = TONUMBER(v);
				total  += num;
				return num;
			},DATAMAP,function(num){
				return Math.round(num / total * 100);
			});
		},
		//래핑된 텍스트를 제거
		"ISWRAP":function(c,w){ if(typeof c === "string"){ c = c.trim(); w = typeof w !== "undefined" ? TOARRAY(w) : ['""',"''","{}","[]"]; for(var i=0,l=w.length;i<l;i++){ var wf = w[i].substr(0,w[i].length-1); var we = w[i].substr(w[i].length-1); if(c.indexOf(wf)==0 && c.substr(c.length-1) == we) return true; } } return false; },
		"UNWRAP":function(c,w){ if(typeof c === "string"){ c = c.trim(); w = typeof w !== "undefined" ? TOARRAY(w) : ['""',"''","{}","[]","<>"]; for(var i=0,l=w.length;i<l;i++) if(ISWRAP(c,w[i])) return c.substring(w[i].substr(0,w[i].length-1).length,c.length-1); } return c; },
		"WRAP":function(c,w){ if(!ISWRAP(c,w)){ c = typeof c === "string" ? c.trim() : ""; w = typeof w === "string" ? w.length > 1 ? w : '""' : '""'; return w.substr(0,w.length-1) + c + w.substr(w.length-1); } return c; },
		//쿼테이션을 무조건 적용
		"DQURT":function(c){ if(typeof c === "string"){ if(ISWRAP(c,'""')) return c; return '"'+UNWRAP(c,"''")+'"'; } return c; },
		"SQURT":function(c){ if(typeof c === "string"){ if(ISWRAP(c,"''")) return c; return "'"+UNWRAP(c,'""')+"'"; } return c; },
		//첫번째 택스트 값에 대한 두번째 매칭되는 값의 index나열
		"INDEXES":function(c,s){
			if(typeof c === "string" || typeof c === "number"){
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
		// 아래 INDEXES 함수들은 어떠한 위치를 제외한 인덱싱을 위해 존재함
		"SPLITINDEXES":function(c,idx,safe){
			if(typeof c === "string" && ISARRAY(idx)){
				var indexes = CLONE(idx);
				indexes.push(c.length);
				var result  = [];
				var past    = 0;
				if(safe == true){
					for(var i=0,l=indexes.length;i<l;i++) {
						if(i){
							result.push(c.substring(past-1,indexes[i]));
							past = indexes[i]+1;
						}
					}
				} else {
					for(var i=0,l=indexes.length;i<l;i++){					
						//위에선 i가 0이 아닐때인데 이걸 고치면 작동이 이상해서 일단 납둠
						result.push(c.substring(past,indexes[i]));
						past = indexes[i]+1;
					}
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
					if(typeof fiv === "undefined" && typeof eiv === "undefined"){
						next = false;
					} else {
						if(typeof eiv === "undefined" || (eiv > fiv)){
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
						if(neg.length >= pos.length && (nFlag==true || typeof nFlag === "undefined")){
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
			} else if(ISARRAY(f) && typeof e === "undefined"){
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
		"OUTERSPLIT":function(c,s,w,safe){
			if(typeof c === "string"){
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
				return SPLITINDEXES(c,splitIndexes,safe);
			}
		},
		//Helper of PASCAL,CAMEL,SNAKE,KEBAB
		"CASEARRAY":function(s,c){ if(typeof c === "string") return s.split(c) ; if(typeof s !== "string")return console.error("CASEARRAY::첫번째 파라메터는 반드시 String이여야 합니다. // s =>",s); s = s.replace(/^\#/,""); /*kebab*/ var k = s.split("-"); if(k.length > 1) return k; /*snake*/ var _ = s.split("_"); if(_.length > 1) return _; /*Cap*/ return s.replace(/[A-Z][a-z]/g,function(s){return "%@"+s;}).replace(/^\%\@/,"").split("%@"); },
		//to PascalCase
		"PASCAL":function(s){ var words = CASEARRAY(s); for(var i=0,l=words.length;i<l;i++) words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase(); return words.join(""); },
		//to camelCase
		"CAMEL":function(s){ var words = CASEARRAY(s); for(var i=1,l=words.length;i<l;i++) words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase(); words[0] = words[0].toLowerCase(); return words.join(""); },
		//to snake_case
		"SNAKE":function(s){ var words = CASEARRAY(s); for(var i=0,l=words.length;i<l;i++) words[i] = words[i].toLowerCase(); return words.join("_"); },
		//to kebab-case
		"KEBAB":function(s){ var words = CASEARRAY(s); for(var i=0,l=words.length;i<l;i++) words[i] = words[i].toLowerCase(); return words.join("-"); },
		//길이만큼 리피트 됩니다.
		"DATATILE":function(v,l){
			var base;
			switch(typeof v){
				case "string":case "number": base = v; break;
				case "object":if(ISARRAY(v)){base = v;}else{ console.warn("DATATILE::Array만 가능합니다."); return v;} break;
			}
			if(typeof base === "undefined"){ return ; } else {
				var baseLength = TOLENGTH(v);
				var result,len = TONUMBER(l,baseLength);
				switch(typeof base){
					case "string": result=""; for(var i=0;i<len;i++)result+=v[TURNINDEX(i,baseLength)]; return result;
					case "number":
						var vm = [];
						(v+"").replace(/\d/g,function(s){vm.join(s*1);});
						result=0 ; for(var i=0;i<len;i++)result+=vm[TURNINDEX(i,baseLength)]; return result;
						break;
					case "object":
						result=[]; for(var i=0;i<len;i++)result.push(v[TURNINDEX(i,baseLength)]); return result;
						break;
				}
			}
		},
		"Structure#StringNumberInfo":function(nv){
			var i = /([\D]*)(([\d\,]+|)+(\.[\d]+|))([\D]*)/.exec(nv);
			var n = /([0]*)(.*)/.exec(i[2]);

			if( !!n[1].length && !n[2].length ){
				n[1] = n[1].substr(0,n[1].length-1);
				//n[2] = "0";
				i[2] = "0";
				i[3] = "0";
			}
			
			if(i[1].charAt(i[1].length-1) == "-" && !!i[2].length ){
				i[1] = i[1].substr(0,i[1].length-1);
				i[2] = "-"+i[2];
				i[3] = "-"+i[3];
			}
			
			if(n[1].length){
				i[2] = n[2];
				i[3] = n[2];
			}
			i[2] = i[2].replace(/\,/g,"");
			i[3] = i[3].replace(/\,/g,"");
			
			this.Source.prefix     = i[1];
			this.Source.prefixZero = n[1];
			this.Source.number     = i[2];
			this.Source.integer    = i[3];
			this.Source.float      = i[4];
			this.Source.suffix     = i[5];
	
			this.fixNumberInfo    = function(){
				if(!("floatValue" in this.Source)){
					//float
					this.Source.floatValue = (this.float !== "") ? "0"+this.Source.float : "0";
					//nothing
					if( this.Source.integer == "") this.Source.integer = "0";
					if( this.Source.float   == "") this.Source.float   = "0";
					if( this.Source.number  == "") this.Source.number  = "0";
				}
				return this;
			}
		},
		// 123, 2 => 23
		"TRUNCBACK":function(val,len){
			val = TONUMBER(val);
			len = TONUMBER(len);
			if(!len) return val;
			//제곱
			return ((val + Math.pow(10,len))+"").substr(1);
		},
		// 글자안의 숫자를 뽑아냅니다.
		"TEXTNUMBER":function(source){
			if(typeof source === "string"){
				var info = (new StringNumberInfo(source)).get();
				if(!!info.prefix || !!info.prefixZero || !!info.suffix) return source;
			}
			return TONUMBER(source);
		},
		// 1~4 => random any
		"ZONERANGE":function(source){
			var numberSplit = /^([^\~]*)\~(.*)$/.exec(source);
			if(numberSplit){
				var ns1 = (new StringNumberInfo(numberSplit[1])).get();
				var ns2 = (new StringNumberInfo(numberSplit[2])).get();
				//
				var nprefix = ns1.prefix;
				var nzeroLen = !!ns1.prefixZero ? ns1.prefixZero.length + ns1.integer.length : 0 ;
				//
				var numv1 = TONUMBER(ns1.number);
				var numv2 = TONUMBER(ns2.number);
				//
				
				var chov  = 0;
				if(numv1 > numv2){ chov = numv2+Math.floor(Math.random()*(numv1-numv2+1));
				} else { chov = numv1+Math.floor(Math.random()*(numv2-numv1+1)); }
				//
				if( nzeroLen > 0) chov = TRUNCBACK(chov,nzeroLen);
				return !!nprefix ? nprefix+chov : chov;
			} else {
				return TEXTNUMBER(source);
			}
		},
		// 1,2,3,4 => random any
		"ZONECHOICE":function(value,split){
			if( ISARRAY(value) ) return value[Math.floor(Math.random()*(value.length))];
			var cache = FUT.CACHEGET("ZONECHOICE",value+split);
			if(cache) return cache[Math.floor(Math.random()*(cache.length))];
			var cachedata = value.split(typeof split === "string"?split:",");
			FUT.CACHESET("ZONECHOICE",value+split,cachedata);
			return cachedata[Math.floor(Math.random()*(cachedata.length))];
		},
		"ZONEINFO":function(command){
			command = TOSTRING(command);
			var value,mutableType,type = (command.indexOf("\\!") == 0)?"fixed":(command.indexOf("\\?") == 0)?"mutable":"plain";
			if(type != "plain"){
				command = command.substr(2);
				if(/\d\~\d/.test(command)){
					mutableType = "range";
					value = (type == "fixed") ? ZONERANGE(command) : command;
				} else if( command.indexOf(",") > -1 ){
					mutableType = "choice";
					value = (type == "fixed") ? ZONECHOICE(command) : command;
				} else {
					console.error("setZoneParams:: 알수없는 명령어 입니다 ->",command);
					value = command;
				}
			} else {
				value = command;
			}
			return {value:value, type:type, mutableType:mutableType};
		},
		"ZONEVALUE":function(zone){
			switch(zone.type){
				case "fixed": case "plain":
					return zone.value;
					break;
				case "mutable":
					switch(zone.mutableType){
						case "range":
							return ZONERANGE(zone.value);
							break;
						case "choice":
							return ZONECHOICE(zone.value);
							break;
					}
					break;
			}
		}
	});
	SpecialFoundation.eachGetter();
	
	// 키를 찾는 함수입니다.
	var objectCommonInterface = {
		"getKeys":function(rule){
			var r = [];
			if(typeof rule === "string"){
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
		//
		has:function(v){ for(var i=0,l=this.length;i<l;i++) if(this[i] === v) return true; return false; },
		// 값을 추가한다.
		push : function(v,i){ switch(typeof i){ case "string": case "number": this[i] = v; break; default: Array.prototype.push.call(this,v); break; } return this; },
		// 존재하지 않는 값만 추가한다
		add :function(v,i){ if( !this.has(v) ) this.push(v,i); },
		//해당 값을 당 배열로 바꾼다
		setSource : function(v){
			if( ISARRAY(v) ) {
				if("toArray" in v){
					Array.prototype.splice.apply(this,[0,this.length].concat(v.toArray()));
				} else {
					this.splice(0,this.length);
					for(var i=0,l=v.length;i<l;i++) {
						Array.prototype.push.call(this,v[i]);
					}
				}
				return this;
			} else {
				this.length = 0;
				if(v||v==0) Array.prototype.push.call(this,v);
				return this;
			}
		},
		//
		isEmpty:function(){ return (this.length === 0) ? true : false },
		isMulti:function(){ return (this.length > 1) ? true : false },
		isSingle:function(){ return (this.length === 1) ? true : false },
		//선택된 값으로 배열이 재정렬 됩니다.
		selectValue:function(value){ var selects = []; DATAEACH(this,function(v){ if(v == value) selects.push(v); }); this.setSource(selects); },
		selectIndex:function(index){ return this.setSource(this[index]); },
		selectFirst:function(){ return this.setSource(this[0]); },
		selectLast :function(){ return this.setSource(this[this.length-1]); return this; },
		//배열의 길이를 조절합니다.
		max:function(length) { this.length = length > this.length ? this.length : length; return this; },
		min:function(length,undefTo){var count=parseInt(length);if(typeof count=="number")if(this.length<count)for(var i=this.length;i<count;i++)this.push(undefTo);return this;},
		//원하는 위치에 대상을 삽입합니다.
		insert: function(v,a){ this.min(a); var pull=[],a=a?a:0; for(var i=a,l=this.length;i<l;i++)pull.push(this[i]); return this.max(a).push(v).concat(pull); },
		// 순수 Array로 반환
		toArray  : function()  { return Array.prototype.slice.call(this); },
		//내부요소 모두 지우기
		clear   : function() { this.splice(0,this.length); return this; },
		clone:function(){ return new AArray(this);},
		//
		getFirst:function(){ return ZERO(this); },
		getLast :function(){ return LAST(this); },
		
		//뒤로부터 원하는 위치에 대상을 삽입합니다.
		behind: function(v,a){ return this.insert(v, this.length - (isNaN(a) ? 0 : parseInt(a)) ); },
		//원하는 위치에 대상을 덮어씁니다.
		overwrite : function(v,a){ this.min(a+1); this[a] = v; return this; },
		//양방향에 대상을 삽입합니다.
		getBoth:function(f,l){ return this.save().insert(f).push(l);   },
		both:function(f,l)   { return this.setSource(this.getBoth(f,l)); },
		// 현재의 배열을 보호하고 새로운 배열을 반환한다.
		save    : function(v){ return this.__GlobalConstructor__(this); },
		//요소안의 array 녹이기
		getFlatten : function(){
			var r = [];
			for(var i=0,l=this.length;i<l;i++) {
				if(typeof this[i] === "object") {
					for(var ai=0,ar=TOARRAY(this[i]),arl=ar.length;ai<arl;ai++) r.push(ar[ai]);
				} else {
					r.push(this[i]);
				}
			}
			return new AArray(r);
		},
		flatten    : function(){return this.setSource(this.getFlatten());},
		//다른 배열 요소를 덛붙인다.
		getConcat : function(){
			return new AArray(arguments).inject(this.save(),function(v,_a){
				new AArray(v).each(function(v2){
					_a.push(v2);
				});
			});
		},
		changeIndex:function(leftIndex,rightIndex){
			var left  = this[leftIndex];
			var right = this[rightIndex];
			this[leftIndex]  = right;
			this[rightIndex] = left;
		},
		hasIndex:function(index){ if (index < 0) return false; if (this.length - 1 < index) return false; return true; },
		concat    : function(){ return this.setSource(this.getConcat.apply(this,arguments)); },			
		// 리턴한 요소를 누적하여 차례로 전달함
		inject:function(firstValue,method) { for(var i = 0,l = this.length;i<l;i++) { var returnValue = method(this[i],firstValue,i); if(typeof returnValue !== "undefined") firstValue = returnValue; } return firstValue; },
		// 리턴되는 오브젝트로 새 배열은 만들어냅니다.
		mapUtil: { "&":function(owner,param){ return owner.getMap(function(a){ if(typeof a === "object") return a[param]; return undefined;}); }},
		getMap : function(process,start) { if(typeof process=="function"){var result=[];for(var i=(typeof start === "number" ? start : 0),l=this.length;i<l;i++)result.push(process(this[i],i,this.length));return new AArray(result);}else if(typeof getOrder=="string"){process=process.trim();for(var key in this.mapUtil)if(process.indexOf(key)==0){var tokenWith=process[key.length]==":"?true:false;var param=tokenWith?process.substr(key.length+1):process.substr(key.length);return new AArray(this.mapUtil[key](this,param));}}return new AArray(); },
		map : function(process) { return this.setSource(this.getMap(process)); },
		
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
			if(typeof filterMethod === "undefined") { filterMethod = function(a){ return typeof a === "undefined" ? false : true; }; } 
			if(typeof filterMethod === "function"){
				var result=[]; 
				this.each(function(v,i){ if(true==filterMethod(v,i)){ result.push(v); } });
				return new AArray(result);
			}
			return new AArray();
		},
		filter      : function(filterMethod) { return this.setSource(this.getFilter(filterMethod)); },
		// undefined요소를 제거한다.
		getCompact : function(){ return this.getFilter(function(a){ return a == undefined ? false : true; }); },
		compact    : function(){ return this.setSource(this.getCompact());},
		// 파라메터 함수가 모두 true이면 true입니다.
		passAll:function(passMethod) { for(var i=0,l=this.length;i<l;i++) if(passMethod(this[i],i) != true) return false; return true; },
		// 하나라도 참이면 true입니다
		passAny:function(passMethod) { for(var i=0,l=this.length;i<l;i++) if(passMethod(this[i],i) == true) return true; return false; },
		//substr처럼 array를 자른다.
		getSubArray:function(fi,li,infinity){
			fi = isNaN(fi) == true ? 0 : parseInt(fi);
			li = isNaN(li) == true ? 0 : parseInt(li);
			var nl,ns,result = new AArray();
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
		subarray:function() { return this.setSource(this.getSubArray.apply(this,arguments));},
		getSubarr:function(fi,li) { return this.getSubArray(fi,li ? li + fi : this.length); },
		subarr:function(fi,li){return this.setSource(this.getSubarr(fi,li));},
		//해당 인덱스 요소를 옮김 (자리바꿈)
		getLeft:function(index){ if(index < 1) return this.save(); if(index > this.length-1) return this.save(); var t1 = this[index]; var t2 = this[index-1]; return this.save().overwrite(t1,index-1).overwrite(t2,index); },
		left:function(index){ return this.setSource(this.getLeft(index)); },
		getRight:function(index){ if(index < 0) return this.save(); if(index > this.length-2) return this.save(); var t1 = this[index]; var t2 = this[index+1]; return this.save().overwrite(t1,index+1).overwrite(t2,index); },
		right:function(index){ return this.setSource(this.getRight(index)); },
		//해당되는 인덱스를 제거
		getDrop:function(index){ index=index?index:0;return this.getSubArray(index).getConcat(this.getSubarr(index+1)); },
		drop:function(index) { return this.setSource(this.getDrop(index)); },
		// 인수와 같은 요소를 제거한다.
		getRemove:function(target) { return this.getFilter(function(t){ if(t == target) return false; return true; }); },
		remove:function(target) { return this.setSource(this.getRemove(target)); },
		// 요소중의 중복된 값을 지운다.
		getUnique:function(){var result=new AArray();this.each(function(selfObject){if(result.passAll(function(target){return selfObject!=target;}))result.push(selfObject);});return result;},
		unique:function(){return this.setSource(this.getUnique());},
		// 인수가 요소안에 갖고있다면 true가 반환
		has : function(h) { return this.passAny(function(o) { return o == h; }); },
		// 다른 요소를 반환
		getOther:function(){
			var exception = Array.prototype.slice.call(arguments);
			return this.getFilter(function(o){ for(var i=0,l=exception.length;i<l;i++) if(exception[i] == o) { return false;} return true; });
		},
		other:function(){ return this.setSource(this.getOther.apply(this,Array.prototype.slice.apply(arguments))); },
		// 원하는 type만 남기고 리턴
		getType : function(wanted) { return this.getFilter(function(v){ return IS(v,wanted); }); },
		type    : function(watend) { return this.setSource(this.getType(watend)); },
		// 같은 요소를 반환
		getEqual:function(v){ return this.getFilter(function(fv){return fv == v ? true : false; }); },
		equal:function(v)   { return this.setSource(this.getEqual(v)); },
		// 컨스트럭터를 비교하기 위한
		getEqualClass:function(v){
			this.getFilter(function(ref){
				if(typeof ref === "object" || typeof ref === "function"){
					if(ref.constructor == v) return true;
				}
			});
		},
		equalClass:function(v){ return this.setSource(this.getEqualClass(v)); },
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
		getStringFlatten:function(){ return this.save().map(function(t){ if(typeof t === "string") return t.split(" "); if(ISARRAY(t)) return new AArray(t).flatten().type("string"); }).remove(undefined).flatten(); },
		stringFlatten:function(){ return this.setSource( this.getStringFlatten() ); },
		getDeepFlatten:function(){function arrayFlatten(_array){var result=new AArray();_array.each(function(value){if( ISARRAY(value) ){result.concat(arrayFlatten(new AArray(value)));}else{result.push(value);}});return result;}return arrayFlatten(this);},
		deepFlatten:function(){ return this.setSource(this.getDeepFlatten()); },
		//그룹 지어줌
		getGrouping:function(length,reverse){
			var result=[];
			if(reverse == true){
				this.save().reverse().turning(length,function(obj,i,g){if(!result[g])result[g]=[];result[g].push(obj);});
				return new AArray(result).map( function(groups){ return new AArray(groups).reverse().toArray(); } ).reverse();
			}
			this.turning(length,function(obj,i,g){if(!result[g])result[g]=[];result[g].push(obj);});
			return new AArray(result);
		},
		grouping:function(length,reverse){ return this.setSource(this.getGrouping(length,reverse)); },
		//랜덤으로 내용을 뽑아줌
		getRandom:function(length){
			if(typeof length === "undefined") return this[Math.floor(Math.random() * this.length)];
			if(length > this.length) length = this.length;
			var result = new AArray();
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
				if(typeof data === "object" || typeof data === "function"){
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
			var gcd = new ANumber(parseInt(this[0])).getGCD(parseInt(this[1]));
			if(joinText) return [this[0]/gcd,this[1]/gcd].join(joinText);
			return new AArray(this[0]/gcd,this[1]/gcd);
		},
		ratio:function(joinText){
			var ratioValue    = this.getRatio(joinText);
			return this.setSource((typeof ratioValue === "string")?[ratioValue]:ratioValue);
		}
	});
	
	//******************
	//AObject
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
		push:function(value,key){ if( typeof key === "string" || typeof key === "number" ){ this.Source[key] = value; } else { var i = 0; var ex = true; do { if(i in this.Source){ i++; } else { ex = false; this.Source[i] = value; } } while (ex); } return this; },
		setSource:function(obj,k){ 
			obj = TOOBJECT(obj,k); if(typeof obj === "object"){ for(var key in this.Source) delete this.Source[key]; for(var k in obj) this.Source[k] = obj[k]; } return this; 
		},
		select:function(obj){
			
		},
		// 길이를 조절합니다
		max :function(){
			
		},
		min :function(){
			
		},
		count:function(){ return PROPLENGTH(this.Source); },
		clone:function(){return CLONE(this.Source); },
		save:function() {return this.__GlobalConstructor__(CLONE(this.Source)); },
		//key value get setter
		prop:function(k,v){
			if(ISTEXT(k) && arguments.length > 1){
				this.Source[k] = v;
				return this;
			} else if (ISTEXT(k)) { 
				return this.Source[k];
			} else if(typeof k === "object"){
				for(var kk in key) this.prop(kk,key[kk]);
				return this;
			} else {
				return this.Source; 
			};
		},
		//모든 프로퍼티에 적용
		propAll:function(dv){for(var key in this.Source) this.Source[key] = dv;return this;},
		//키값판별
		propIs    :function(key,test,t,f) { return IS(this.Source[key],test,t,f); },
		propAs    :function(key,test,t,f) { return AS(this.Source[key],test,t,f); },
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
			if(typeof f === "function"){
				var result = CLONE(this.Source);
				var keys   = this.getKeys(ksel);
				for(var i=0,l=keys.length;i<l;i++) result[keys[i]] = f(this.Source[keys[i]],keys[i]);
				return result; 
			} else { 
				return CLONE(this.Source);
			} 
		},
		map:function() { return this.setSource( this.getMap.apply(this,arguments) ); },
		//inject 
		inject:function(o,f,ksel){ if(typeof f === "function") { this.getMap(function(v,k){ var or = f(v,o,k); if(typeof or !== "undefined") { o=or; } },ksel); return o; } },
		//key getter
		data:function(k,v){
			if(typeof v !== "function" && typeof v !== "undefined") { throw new Error("Object::data 메서드는 setter가 아닙니다."); };
			if (typeof k === "string"){
				if(typeof v === "function"){
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
		isSame:function(obj){ var originObject = this.Source; var judgement = true; new AObject(obj).each(function(v,k){ if( !(k in originObject) || originObject[k] !== v){ judgement = false; return false; } }); return judgement; },
		isEqual:function(obj){ var _obj = new AObject(obj); var oObj = this.Source; var iObj = _obj.get(); var oKeys = this.getKeys().sort(); var iKeys = _obj.getKeys().sort(); if(oKeys.length !== iKeys.length) return false; for(var i=0,l=oKeys.length;i<l;i++){ if(oKeys[i] !== iKeys[i]) return false; if(oObj[oKeys[i]] !== iObj[iKeys[i]]) return false; } return true; },
		//오브젝트를 배열로 반환함
		hashes:function(key,val){ key = typeof key !== "string" ? "key" : key; val = typeof val !== "string" ? "value" : val; var r=[]; for(var k in this.Source){ var o = {}; o[key] = k; o[val] = this.Source[k]; r.push(o); } return r; },
		//
		join:function(a,b){ a = typeof a === "string" ? a : ":"; b = typeof b === "string" ? b : ","; return this.inject([],function(v,i,k){ i.push(k+a+TOSTRING(v)); }).join(b); },
		//toParam
		getEncodeObject : function(useEncode){ return this.inject({},function(val,inj,key){ inj[ (useEncode == false ? key : _String(key).getEncode()) ] = (useEncode == false ? val : _String(val).getEncode()); }); },
		encodeObject    : function(){ return this.setSource(this.getEncodeObject.apply(this,arguments)); },
		//jsonString으로 반환
		stringify:function(){ return JSON.stringify(this.Source); },
		changeKey:function(original, change){ if(typeof original === "string" && typeof change === "string") { this.Source[change] = this.Source[original]; delete this.Source[original]; } return this.Source; },
		//String의 순차적으로 오브젝트 반환  "1 2 3 4" => {"1":"2","3":"4"}
		getKvo:function(arg,split){ split = typeof split === "string" ? split : " "; arg = arg.split(split); var source = CLONE(this.Source); var keyName = undefined; new AArray(arg).turning(2,function(value,i){ if(i == 0) { keyName = value; } else if(i == 1) { if(typeof keyName !== "undefined") { switch(value){ case "''": case '""': case "'": case '"': source[keyName] = ""; break; default : source[keyName] = value; break ; } } keyName = undefined; } }); return source; },
		kvo:function(arg){ return this.setSource(this.getKvo.call(this,arg)); },
		//오브젝트의 키를 지우고자 할때
		removeAll:function(){ for( var key in this.Source ) delete this.Source[key]; return this.Source; },
		getRemove:function(){ var source = this.Source; new AArray(arguments).stringFlatten().each(function(key){ delete source[key]; }); return this.Source; },
		remove:function(key){ delete this.Source[key]; return this; },
		removeNothing:function(){ for(var key in this.Source) if(ISNOTHING(this.Source[key])) delete this.Source[key]; return this; },
		//존재하지 않는 키벨류값을 적용함;
		getTouch:function(key,value){ var m = CLONE(this.Source);new AArray(key).stringFlatten().each(function(key){ if(!(key in m)) m[key] = value; }); return m; },
		touch:function(key,value){ return this.setSource( this.getTouch.apply(this,arguments) ); },
		//키의 배열을 받는다
		keys:function(){ var result = []; for (key in this.Source) result.push(key); return result; },
		//값의 배열을 받는다
		values:function(){ var result = []; for (key in this.Source) result.push(this.Source[key]); return result; },
		getValue:function(key){ return this.Source[key]; },
		//다른 오브젝트와 함칠때
		getConcat:function(){ var result = this.clone(); for(var i=0,l=arguments.length;i<l;i++){ new AObject(arguments[i]).each(function(v,k){ result[k] = v; }); }; return result; },
		concat:function(){ this.setSource(this.getConcat.apply(this,arguments)); return this; },
		//다른 오브젝트와 함칠때 이미 있는 값은 오버라이드 하지 않음
		getSafeConcat:function(){ var result = this.clone(); for(var i=0,l=arguments.length;i<l;i++){ new AObject(arguments[i]).each(function(v,k){ if( (k in result) == false) result[k] = v; }); } return result; },
		safeConcat:function(){ this.setSource(this.getSafeConcat.apply(this,arguments)); return this; }
	}, function(p,n,s){
		if(typeof s === "string"){
			this.Source = {};
			this[s].apply(this,new AArray(arguments).subarr(0,2).toArray());
		} else {
			this.Source = TOOBJECT(p,n);
		}
	});
	
	W._Split = function(text,s){
		if( ISARRAY(text) ) return new AArray(text);
		
		if(typeof text === "string"){
			var result;
			if((typeof s === "string") || typeof s === "number") {
				s = s+"";
				result = text.split(s);
			} else {
				result = [];
				text.replace(/\S+/gi,function(s){ result.push(s); });
			}
			return new AArray(result);
		}
		console.warn("_Split은 text나 array만 넣기를 추천합니다. => ", text);
		return new AArray(text);
	};
	
	extendModule("Array","Range",{},function(a,b,c){
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
	
	//******************
	//String
	makeModule("String",{
		getEncode:function(){ return encodeURI(this.Source); },
		getDecode:function(){ return decodeURI(this.Source); },
		encode:function(){this.Source = this.getEncode();return this;},
		decode:function(){this.Source = this.getDecode();return this;},
		getByteSize:function(){ return unescape(escape(this.Source).replace(/%u..../g,function(s){ return "uu"; })).length; },
		getLines:function(){ return _Split(this.Source,"\n").toArray(); },
		eachLine:function(f,j){ if(typeof f === "function") return new AArray(this.getLines()).map(function(s,i){ return f(s,i); }).compact().join( (j?j:"\n") ); },
		//한줄의 탭사이즈를 구함
		getTabSize:function(){
			var tabInfo = /^([\s\t]*)(.*)/.exec(this.Source);
			var tab   = tabInfo[1].replace(/[^\t]*/g,"").length;
			var space = tabInfo[1].replace(/[^\s]*/g,"").length - tab;
			return tab + Math.floor(space / 4);
		},
		//한줄의 탭을 정렬함
		getTabAbsolute:function(tabSize,tabString){
			tabSize = TONUMBER(tabSize);
			if(arguments.length < 2) tabString = "\t";
			if(tabSize < 0) tabSize = 0;
			var result = "";
			for(var i = 0; i < tabSize; i++) result += tabString;
			return result + /^([\s\t]*)(.*)/.exec(this.Source)[2];
		},
		//각각의 탭음 밀어냄
		getTabsOffset:function(offset,tabString){
			offset = parseInt(offset);
			if(typeof offset === "number") return _Split(this.Source,"\n").map(function(text){
				return _String(text).getTabAbsolute(_String(text).getTabSize() + offset,tabString);
			}).join("\n");
			return this.Source;
		},
		//라인중
		getTabsSize:function(){
			var minimum;
			this.eachLine(function(line){
				var tabSize = _String(line).getTabSize();
				if((minimum == undefined) || (tabSize < minimum)) minimum = tabSize;
			});
			return minimum;
		},
		getTabsAlign:function(){
			var beforeSize;
			var baseOffset = 0;
			return this.eachLine(function(line){
				//console.log("baseOffset",baseOffset);
				var tabSize = _String(line).getTabSize();
				//console.log(tabSize,beforeSize);
				if(beforeSize == undefined){
					beforeSize = 0;
					return line;
				} else if(tabSize > beforeSize){
					baseOffset++;
				} else if(tabSize < beforeSize){
					baseOffset--;
				} else {
					//nothing is right
				}
				beforeSize = tabSize;
				return _String(line).getTabAbsolute(baseOffset);
			});
		},
		tabsAlign:function(){ this.Source = this.getTabsAlign(); return this; },
		getTrimLine:function(){ return this.eachLine(function(line){ var trimText = line.trim(); return (trimText == "") ? undefined : line; }); },
		trimLine:function(){ this.Source = this.getTrimLine(); return this; },
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
		abilityFunction  : function(fs,is,js){ var origin = (js==true) ? OUTERSPLIT(this.Source,fs,["{}","[]",'""',"''"]) : this.Source.trim().split(fs); if(origin[origin.length-1].trim()=="") origin.length = origin.length-1;  return new AArray(origin).passAll(function(s,i){ return s.indexOf(is) > 0; }) ? origin.length : 0; },
		abilityObject    : function(){ return this.abilityFunction(",",":",true); },
		abilityParameter : function(){ return this.abilityFunction("&","="); },
		abilityCss       : function(){ return this.abilityFunction(";",":"); },
		isDataContent:function(absoluteWrap){
			var o = this.abilityObject();
			var c = this.abilityCss();
			var p = this.abilityParameter();
			if(ISWRAP(this.Source,"[]")) return "array";
			if(absoluteWrap == true) if(ISWRAP(this.Source,"''",'""') == true) return "plain";
			if( (absoluteWrap == true && ISWRAP(this.Source,"{}")) || (o > 0 && o >= c && o >= p) ){
				return "object";
			} 
			if(p > 0) {
				//태그일수도 있으니 확인
				if( /^<\w+/i.test(this.Source) && /\w+>$/i.test(this.Source) ) return "plain";
				return "parameter";
			}
			if(o > 0) return "css";
			return "plain";
		},
		isDataContentFunction:function(fs,is,js){
			return new AArray( (js==true) ? OUTERSPLIT(this.Source,fs,["{}","[]",'""',"''"]) : this.Source.trim().split(fs) ).inject({},function(s,inj){
				var v = s.substr(s.indexOf(is)+1);
				if(s.trim().length > 0) inj[ UNWRAP(s.substr(0,s.indexOf(is)),['""',"''"]) ] = UNWRAP((js == true) ? _String(v).getDataContent(true) : v,['""',"''"]);
				return inj;
			});
		},
		getDataContent:function(absoluteWrap){
			switch(this.isDataContent(absoluteWrap)){
				case "object"       : return this.isDataContentFunction(",",":",true); break;
				case "parameter"    : return this.isDataContentFunction("&","="); break;
				case "css"          : return this.isDataContentFunction(";",":"); break;
				case "array"        :
					var a = OUTERSPLIT(this.Source,",",["{}","[]",'""',"''"]);
					if(a == ""){
						return [];
					} else {
						return new AArray(a).inject([],function(s,inj){
							inj.push(UNWRAP( _String(s).getDataContent(true) , ["''",'""'] )); 
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
		getJSON:function(){ return JSON.stringify(this.getDataContent());},
		//reverse
		getReverse : function() { return this.Source.split("").reverse().join(""); },
		reverse    : function()   { this.Source = this.getReverse(); return this; },
		//printf
		getPrintf:function(f){
			if(typeof f === "object"){
				if(f instanceof RegExp){
					if( f.test(this.Source) ) {
						f = f.exec(this.Source);
					} else {
						console.warn("String::getPrintf::printf 할수 없습니다.",this.Source,f);
						return this.Source;
					}
				}
				var result  = "";
				for(var i=1,l=arguments.length;i<l;i++){
					switch(typeof arguments[i]){
						case "object":
							if(typeof arguments[i][0] === "string" || typeof arguments[i][0] === "number") if(arguments[i][0] in f) result = result + f[arguments[i][0]];
							break;
						case "number": case "string":
							result = result + arguments[i];
							break;
						default:break;
					}
				}
				return result;
			} else if(typeof f === "string" || typeof f === "number"){
				var i = -1;
				var p = Array.prototype.slice.call(arguments);
				return this.Source.replace(/%@/gi,function(){
					i++;
					if(typeof p[i] === "string" || typeof p[i] === "number"){
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
		getFix:function(p,s){ return (typeof p === "string"?p:"") + this.Source + (typeof s === "string"?s:""); }
	},function(param,jsonfy){
		if( typeof param === "undefined" || param == null ){
			this.Source = ""
		} else {
			this.Source = TOSTRING(param,10,jsonfy);
		}
		return this;
	});
	
	// Number
	extendModule("String","Number",{
		// number core
		// spot 1:prefix 2:integer 3:floatValue 4:suffix
		isNotANumber:function(){ if((new StringNumberInfo(this.Source)).get("number").length) return true; return false; },
		isANumber   :function(){ return !this.isNotANumber(); },
		getNumberInfo : function(spot){
			//getInfo
			var info = new StringNumberInfo(this.Source);
			info.fixNumberInfo();
			
			//result
			if(typeof spot === "number") switch(spot){
				case 0: return info.get("prefix"); break;
				case 2: return info.get("integer"); break;
				case 3: return info.get("floatValue"); break;
				case 4: return info.get("suffix"); break;
				case 5: return info.get("number"); break;
			}
			
			var info =  { 
				"prefix"     : info.get("prefix"), 
				"suffix"     : info.get("suffix"), 
				"integer"    : info.get("integer"), 
				"floatValue" : info.get("floatValue"), 
				"number"     : info.get("number")
			};
			if(typeof spot === "string") return info.get(spot);
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
		integer    : function() { var p = this.getInteger(); return typeof p === "string" ? p*1 : this;},
		floatValue : function() { var p = this.getFloat();   return typeof p === "string" ? p*1 : this;},
		number     : function() { var p = this.getNumber();  return typeof p === "string" ? p*1 : this;},
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
			var lv = new ANumber(withValue).number();
			var rv = this.number();
			var result = 0;
		
			//할인율 계산하고 적용
			if(rv > lv){
				result = 0;
			} else {
				result = ((lv - rv) / lv) * 100;
				result = isNaN(result) ? 0 : result;
			}
		
			if(typeof trunc === "number"){return new ANumber(result).getTrunc(trunc);}
			return result;
		},
		// expression
		expression:function(senceParameter,option){
			var senceNumber  = new ANumber(senceParameter);
			var optionNumber = new ANumber(option);
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
			if(typeof targetPoint === "string"){
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
		getPercentOf : function(maxValue,minValue) { 
			maxValue = TONUMBER(maxValue);
			minValue = TONUMBER(minValue);
			return ((this.number()-minValue)/(maxValue-minValue))*100;},
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
			if(typeof current === "undefined") return Math.ceil(this.integer() / groupLength);
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
	
	var util_unique_random_key = [];
	
	makeSingleton("_Util",{
		encodeString:function(v){ return TOSTRING(v,99,true); },
		decodeString:function(v){ 
			if(typeof v === "string") { 
				if( v.charAt(0)=="\"" && v.charAt(v.length-1)=="\"" ){
					return v.substr(1,v.length-2);
				} else {
					return eval("(" + v + ")");
				}
				console.error("decodeString::디코딩실패 ->",v,"<-");throw e;
			}
			return v; 
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
		base64UniqueRandom:function(length,codeAt,codeLength){
			var randomKey;
			var process = 0;
			do {
				var needContinue = false;
				randomKey        = this.base64Random(length,codeAt,codeLength);
				DATAEACH(util_unique_random_key,function(recentKey){
					if(recentKey == randomKey) needContinue = true;
					return false;
				});
				
				process++;
				
				if(process > 100) {
					console.log("base64UniqueRandom 1000회 이상 랜덤을 생성하였지만 unique 값을 구할수 없었습니다");
					needContinue = false;
					randomKey    = undefined;
				}
			} while(needContinue);
			
			if(randomKey) util_unique_random_key.push(randomKey);
			
			return randomKey;
		},
		random:function(length) { return parseInt(this.base64Random(length,52,10)); },
		numberRandom:function(length) { return this.base64Random(length,52,10); },
		base36Random:function(length) { return this.base64Random(length,26,36); },
		base36UniqueRandom:function(length) { return this.base64UniqueRandom(length || 6,26,36); },
		base26Random:function(length) { return this.base64Random(length,0,52); },
		base26UniqueRandom:function(length) { return this.base64UniqueRandom(length || 6,0,52); }
	});
	
	
	extendModule("String","ZString",{
		setZoneParams:function(params){
			if( IS(params,"array !nothing") ) this.ZoneParamsInfo = DATAMAP(params,function(command){ return ZONEINFO(command); });
		},
		getZContent:function(seed){
			// d:Dynamic, e: Evaluation
			seed = (typeof seed === "number")?seed:0;
			var dPoint=[],ePoint=[];
			var result = this.Source,zoneParamsInfo = this.ZoneParamsInfo;
			
			
			result = result.replace(/\\\([^\)]*\)/g,function(s){
				dPoint.push(s.substring(2,s.length-1));
				return "@{$"+(dPoint.length-1)+"}" ;
			});
			
			result = result.replace(/\\\{[^\}]*\}/g,function(s){
				ePoint.push(s.substring(2,s.length-1));
				return "@{#"+(ePoint.length-1)+"}" ;
			});
			
			dPoint = DATAMAP(dPoint,function(v){ return ZONEVALUE(ZONEINFO("\\!"+v)); });
			ePoint = DATAMAP(ePoint,function(v){ 
				return eval(v.replace(/\$\i+/g,function(s){
					return seed;
				}).replace(/\$\d+/g,function(s){
					var paramResult = zoneParamsInfo[parseInt(s.substr(1))];
					if(paramResult){
						paramResult = ZONEVALUE(paramResult);
						return ISNUMBERTEXT(paramResult) ? paramResult : '"'+paramResult+'"' ;
					}
				}));
			});
			
			result = result.replace(/\@\{\$\d+\}/g,function(s){
				return dPoint[parseInt(s.substring(3,s.length-1))];
			});
			
			result = result.replace(/\@\{\#\d+\}/g,function(s){
				return ePoint[parseInt(s.substring(3,s.length-1))];
			});
			
			return result;
		},
		toArray:function(length,startAt){
			length  = (typeof length === "number")  ? length : 1;
			var i = (typeof startAt === "number") ? startAt : 0;
			var result = [];
			for(var l=i+length;i<l;i++) result.push( this.getZContent(i) );
			return result;
		}
	},function(param){
		this.ZoneParams = Array.prototype.slice.call(arguments);
		this._super(this.ZoneParams.shift());
		this.setZoneParams(this.ZoneParams);
		//this.ZoneParamsInfo = [];
	},function(seed){
		return this.getZContent(seed);
	});
	
	makeGetter("ZSTRING",function(params){
		return _ZString.apply(ZString,Array.prototype.slice.call(arguments)).get();
	});
	
	makeGetter("ZNUMBER",function(params){
		if(arguments.length === 1){
			//console.log("single mode")
			var sn = "\\(";
				sn+= params;
				sn+= ")";
			return TONUMBER(_ZString.call(ZString,sn).get());
		} else {
			//console.log("dual mode");
			var args = Array.prototype.slice.call(arguments);
			var sn = "\\{";
				sn+= args[0];
				sn+= "}";
			args[0] = sn;
			return TONUMBER(_ZString.apply(ZString,args).get());
		}
	});
	
	
	//******************
	//ClientKit
	makeSingleton("_Client",{
		agent :function(t){ 
			return (typeof t === "string") ? ((navigator.userAgent||navigator.vendor||window.opera).toLowerCase().indexOf(t.toLowerCase()) > -1) : (navigator.userAgent||navigator.vendor||window.opera);
		},
		info:NODYENV,
		width :function(){ return (window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth); },
		height:function(){ return (window.innerHeight|| document.documentElement.clientHeight|| document.getElementsByTagName('body')[0].clientHeight); },
		bound :function(){ return {"width":this.width(),"height":this.height()}; },
		//document path
		url      : function()    { return window.document.URL.toString(); },
		urlInfo  : function(url) { return FUT.PAGEURLINFO(); },
		root      : function(url,slash) { return FUT.PAGEROOT(); },
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
		queryData : function(url) { var h = this.urlInfo(url); return TOOBJECT(h.query); },
		//script path
		scriptUrl  : (function(){ var scripturl = FUT.LOADINGSCRIPTURL(); return function(){ return scripturl; } })(),
		scriptInfo : function(url) { return this.urlInfo(url?url:this.scriptUrl()); },
		scriptName : function(url) { return this.scriptInfo(url).filename },
		scriptPath : function(url) { return this.scriptInfo(url).path     },
		scriptRoot : function(url) { return /(.*\/|\/|)[^\/]*$/.exec(this.scriptInfo(url).path)[1]; },
		//cookie
		setCookie:function (name, value, expire, path) { document.cookie = name + "=" + escape(value) + ((expire == undefined) ?"" : ("; expires=" + expire.toGMTString())) + ";path=" + (typeof path === "undefined"?"/":escape(path)) },
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
		removeCookie:function(name,path){ path = ";path=" + (typeof path === "undefined"? "/" : escape(path)); document.cookie=name+"="+path+";expires=Thu, 01 Jan 1970 00:00:01 GMT"; },
		setLocalData:function(k,v){
			if(this.agent("adobeair")){
				 var utf8v = new air.ByteArray();
				 utf8v.writeUTFBytes(_Util.encodeString(v));
				 air.EncryptedLocalStore.setItem(k,utf8v);
			} else {
				return this.setCookie(k,_Util.encodeString(v));
			}
		},
		isEventSupport:function(eventName,tagName){
			var testTag = (typeof tagName === "object") ? tagName : document.createElement( (typeof tagName === "string") ? tagName : "div" );
			var isSupport = ( eventName in testTag );
			if(!isSupport && ( "setAttribute" in testTag)) {
				testTag.setAttribute(eventName,'return;');
				return (typeof testTag[eventName] === "function");
			}
			return isSupport;
		},
		getLocalData:function(k){
			if(this.agent("adobeair")){
				var bi = air.EncryptedLocalStore.getItem(k);
				if(bi==null){
					return undefined;
				} else {
					return _Util.decodeString(bi.readUTFBytes(bi.bytesAvailable));
				}
			} else {
				return _Util.decodeString(this.getCookie(k));
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
		isLocalHTML:function(){
			return (location.href.indexOf("http:" == 0) || location.href.indexOf("https:" == 0)) ? true : false;
		},
		//include
		include:function(aFilename){ return FUT.INCLUDE(aFilename); },
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
		getNodePoint:function(node){
		    for (var lx=0, ly=0; node != null; lx += node.offsetLeft, ly += node.offsetTop, node = node.offsetParent); return {x: lx,y: ly};
		},
		getCursorPoint:function(e) {
		    e = e || window.event; 
			var cursor = { x: 0, y: 0 };
			
			if(e.touches && e.touches[0]) {
				cursor.x = e.touches[0].pageX;
				cursor.y = e.touches[0].pageY;
			} else if (e.pageX || e.pageY) {
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
			if(typeof idObject === "object" || typeof idObject === "function"){
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
		isValid :function() { return this.Source == false ? false : true; },
		//data
		data    :function(v){ if(this.isValid()){ return W.ManagedMetaObjectData[this.Source]; } },
		getOwner:function() { if(this.isValid()) return UID.getObject(this.Source); },
		//prop
		getProp :function(propName){ if(typeof propName === "string" || typeof propName === "number"){ return W.ManagedMetaObjectData[this.Source][propName]; } },
		getProps:function(propExpression) {
			var regexp = new RegExp(propExpression);
			var result = [];
			for (key in W.ManagedMetaObjectData[this.Source]) if (key.match(regexp)) result.push(W.ManagedMetaObjectData[this.Source][key]);
			return result;
		},
		setProp :function(propName,value){ if(typeof propName === "string" || typeof propName === "number"){ W.ManagedMetaObjectData[this.Source][propName] = value;} return this; },
		hasProp :function(propName){ if(typeof propName === "string" || typeof propName === "number") return (propName in W.ManagedMetaObjectData[this.Source]); return false; },
		removeProp:function(propName){ if( this.hasProp(propName) ) delete W.ManagedMetaObjectData[this.Source][propName]; return this; },
		keyChange:function(keys,toKeys){
			var meta    = this;
			var _keys   = new AArray(keys);
			var _toKeys = new AArray(toKeys);
			
			if (_keys.length == _toKeys.length) {
				var orientation = _keys.getMap(function(key){
					return meta.getProp(key);
				});
				_keys.each(function(key){
					meta.removeProp(key);
				});
				_toKeys.each(function(key,i){
					meta.setProp(key,orientation[i]);
				});
			} else {
				console.warn("Meta::keyChange는 이전값과 바꿀값의 길이가 같아야합니다.");
			}
		},
		keySort:function(){
			var thisSource = W.ManagedMetaObjectData[this.Source];
			var replaceObj = {};
			var keys       = [];
			for(var key in thisSource) keys.push(key);
			keys.sort();
			DATAEACH(keys,function(key){ replaceObj[key] = thisSource[key] });			
			W.ManagedMetaObjectData[this.Source] = replaceObj;
		},
		//Destroy
		destroy   :function() { if(this.isValid()){ W.ManagedMetaObjectData[this.Source] = undefined; UID.destroy(this.Source); return true;} return false; },
		lastProp:function(propName){ var r = this.getProp(propName); this.destroy(); return r; },
		lastData:function(){ var r = this.data(); this.destroy(); return r; },
		destroyTimeout:function(time){ var own = this; setTimeout(function(){ own.destroy(); },TONUMBER(time));}
	},function(v,d){
		if(typeof v === "object" || typeof v === "function"){
			this.Source = UID.get(v);
			if(!(this.Source in W.ManagedMetaObjectData)){
				if(typeof d === "object"){
					W.ManagedMetaObjectData[this.Source] = CLONE(d);
				} else if(typeof d === "undefined"){
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
			var pushString = MAX(TOSTRING(W.ManagedUIDObjectData[i]),40) + "  =>  ";
			var pushLength = 0;
			PROPEACH(W.ManagedMetaObjectData[i],function(data,key){
				pushString += "\n    ";
				pushString += key;
				pushString += " : ";
				pushString += MAX(TOSTRING(data),40);
				pushLength++;
			});
			pushString += "\n    [";
			pushString += pushLength;
			pushString += "] length";
			r.push(pushString);
		}
		return r.join("\n");
	}
})(window);
//Nody Node Foundation 
(function(W,ENV){
	
	var ELUT_REGEX = new RegExp("("+ [
		//tag
		"^[\\w\\-\TA\_]+",
		//attr
		"\\[[\\w\\-\\_]+\\]|\\[\\\'[\\w\\-\\_]+\\\'\\]|\\[\\\"[\\w\\-\\_]+\\\"\\]",
		//attr2
		"\\[[\\w\\-\\_]+\\=[^\\]]+\\]|\\[\\\'[\\w\\-\\_]+\\\'\\=\\\'[^\\]]+\\\'\\]|\\[\\\"[\\w\\-\\_]+\\\"\\=\\\"[^\\]]+\\\"\\]",
		//id
		"\\#[\\w\\-\\_]+",
		//class
		"\\.[\\w\\-\\_]+",
		//special?
		"\\?[\\w\\-\\_]+",
		//special!
		"\\![\\w\\-\\_]+",
		//html
		"::.*$"
	].join("|") +")","gi");
	
	makeSingleton("ELUT",{
		//테그의 속성을 text로 표현합니다.
		"SELECTINFO"   : function(tagProperty,attrValue){ 
			tagProperty = (typeof tagProperty !== "string") ? "" : tagProperty;
			
			//캐쉬를 이용해 잦은 표현에 대한 오버해드를 줄입니다.
			var result = FUT.CACHEGET("SELECTINFO",tagProperty);
			if( result ) {
				result = CLONEOBJECT( result );
			} else {
				var result  = {};
				var matches = [];
				var rest    = tagProperty;
			
				//find regular expression
				rest = rest.replace(ELUT_REGEX,function(ms){
					if(ms)matches.push(ms);
					return "";
				});
				
				var tagprop = matches.concat(OUTERSPLIT(rest,":","()",true));
				for(var i=0,l=tagprop.length;i<l;i++){
					var sinfo = /(.?)((.?).*)/.exec(tagprop[i]);
					// div ["div","d","iv","i"]
					switch(sinfo[1]){
						//id
						case "#" :
							//attr value 우선
							if(!result["id"]) result["id"] = sinfo[2];
							break;
						//class
						case "." :
							if(result["class"]) {
								result["class"] += " ";
								result["class"] += sinfo[2];
							} else {
								result["class"] = sinfo[2];
							}
							break;
						case ":" :
							//html
							if(sinfo[3] == ":"){
								result["::"] = sinfo[0].substr(2);
							} else {
								//metaAttribute
								if(!result[":"]) result[":"] = {};
								var attrInfo = /(:([\w\-\_]+))(\((.*)\)$|)/.exec(sinfo[0]);
								//"hello(world)" => [":hello(world)", ":hello", "hello", "(world)", "world"]
								switch(attrInfo[1]){
									case ":disabled": case ":readonly": case ":checked":
										result[":"][attrInfo[2]] = true;
										break;
									case ":nth-child":
										result[":"][attrInfo[2]] = (attrInfo[4] === undefined) ? null : attrInfo[4].match(/^(even|odd)$/) ? attrInfo[4] : TONUMBER(attrInfo[4]) 
										break;
									case ":contains": case ":has": case ":not":
										result[":"][attrInfo[2]] = attrInfo[4];
										break;
									case ":first-child": case ":last-child": case ":only-child": case ":even": case ":odd": case ":hover":
										result[":"][attrInfo[2]] = null;
										break;
									default :
										result[":"][attrInfo[2]] = attrInfo[4];
										break;
								}
							}
							break;
						//name
						case "!" : result["name"] = sinfo[2]; break;
						//type
						case "?" : result["type"] = sinfo[2]; break;
						//attr
						case "[" :
							var attr = /\[([\"\'\w\-\_]+)(=|~=|)(.*|)\]$/.exec(sinfo[0]);
							//"['tag-is'=my_any value  ]" => ["['tag-is'=my_any value  ]", "'tag-is'", "=", "my_any value  "]
							result[UNWRAP(attr[1],["''",'""'])] = (attr[3])? UNWRAP(attr[3],["''",'""']) : null;
						break;
						//tagname
						default : 
							switch(sinfo[0].toLowerCase()){
								case "checkbox": case "file": case "hidden": case "hidden": case "password": case "radio": case "submit": case "text": case "reset": case "image": case "number" :
									result["tagName"] = "input";
									result["type"]    = sinfo[0];
									break;
								default:
									result["tagName"] = sinfo[0].toLowerCase();
									break;
							}
							break;
					}
					
				}
				
				//cache save
				FUT.CACHESET("SELECTINFO",tagProperty,CLONEOBJECT(result));
			}
			
			// 두번째 파라메터 처리
			var attr = CLONE(TOOBJECT(attrValue,"html"));
			
			if("html" in attr){
				attr["::"] = attr["html"];
				delete attr["html"];
			} 
			
			for(var key in attr) result[key] = attr[key];
			
			return result;
		},
		//css스타일 태그를 html스타일 태그로 바꿉니다.
		"TAG" : function(tagProperty,attrValue){
			
			//TAG중첩을 지원하기 위한 것
			if((arguments.length > 1) && (typeof attrValue === "string" || typeof attrValue === "number")) {
				var newValue = "";
				for(var i=1,l=arguments.length;i<l;i++) if(typeof arguments[i] !== "undefined") newValue += arguments[i];
				attrValue = newValue;
			}
			
			//캐쉬를 이용해 잦은 표현에 대한 오버해드를 줄입니다.
			var tagInfo,cacheName,enableCache = (typeof attrValue === "string" || typeof attrValue === "undefined") ? true : false;
			
			if(enableCache){
				cacheName = tagProperty;
				//캐쉬가 존재하면 바로 리턴
				var result = FUT.CACHEGET("TAG",cacheName);
				if(result)if(attrValue){
					return result[0]+attrValue+result[1];
				} else {
					return result[0]+result[1];
				}
			}
			var tagInfo = SELECTINFO(tagProperty,attrValue);
			
			if(!("tagName" in tagInfo) || tagInfo.tagName == "*") tagInfo.tagName = "div";
			//make attribute text
			var attributedTexts = "";
			for(var name in tagInfo) switch(name){
				case "tagName":case "::":break;
				case ":": 
					for(inkey in tagInfo[name]){
						switch(inkey){
							case "disabled":case "checked":case "selected":
								attributedTexts += (" " + inkey);
								break;
						}
					}
					break;
				default:
					attributedTexts += ((typeof tagInfo[name] == undefined || tagInfo[name] == null) ? " " + name : " " + name + '="' + tagInfo[name] + '"');
					break;
			}
			attributedTexts = attributedTexts.trim();
	
			//common attribute process
			var name = "<" + tagInfo.tagName + (attributedTexts.length < 1 ? "" : (" " + attributedTexts));
			var tagValue = tagInfo["::"] || "";
			var cachePrefix,cacheSuffix
			
			if(tagInfo.tagName == "input"){
				cachePrefix = name + ' value="';
				cacheSuffix = '"/>';
			} else {
				cachePrefix = name + '>';
				cacheSuffix = '</' + tagInfo.tagName + '>';
			}
			
			if(cacheName) FUT.CACHESET("TAG",cacheName,[cachePrefix,cacheSuffix]);
			
			
			return (cachePrefix + tagValue + cacheSuffix);
		},
		"TAGSTACKS":function(){
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
		},
		"HTMLTOEL":function(html){
			var makeWrapper = document.createElement("div");
			makeWrapper.innerHTML = html;
			return CLONEARRAY(makeWrapper.children);
		},
		"PRINT":function(a){ return CREATE("div",a,W.document); }
	});
	ELUT.eachGetter();
	makeSingleton("NUT",{
		"ATTR":function(node,v1,v2){
			if(!ISELNODE(node)) { console.error("NUT.ATTR은 element만 가능합니다. => 들어온값" + TOS(node)); return null; }
			if(typeof v1 === "object") {
				for(var k in v1) node.setAttribute(k,k1[v]);
			} else if(typeof v1 === "string"){
				var readMode   = typeof v2 === "undefined";
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
		"PARENTS":function(node){
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
		"PARENT":function(node){ if(!ISELNODE(node)) return ; return node.parentElement; },
		//포커스 상태인지 검사합니다.
		"HASFOCUS":function(node){ return document.activeElement == node; },
		//하나의 CSS테스트
		"THE":function(node,selectText,extraData){
			var tagInfo = SELECTINFO(selectText);
			for(var key in tagInfo){
				switch(key){
					case "tagName":
						if(node.tagName.toLowerCase() !== tagInfo.tagName) return false;
						break;
					case "class":
						var nodeClass = ELATTR(node,key);
						var infoClass = tagInfo[key];
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
								case "not":
									if( NUT.THE(node,tagInfo[key][metaKey]) ) return false;
									break;
								case "focus":
									if(!NUT.HASFOCUS(node)) return false;
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
		"Structure#QueryDataInfo":function(querys){
			this.keymap(OUTERSPLIT(querys,",",["()"]),function(query){
				var querySplit = [];
				
				query.trim()
				.replace(/[\n]|[\s]{2,}/g," ")
				.replace(/\s*(\>|\+)\s*/g,function(s){ return s.replace(/\s/g,""); })
				.replace(/(\[[\w\=\_\-]+\]|\:\w+\([^\)]+\)|[\w\-\_\.\#\:]+)(\s|\>|)/g,function(s){ 
					querySplit.push(s);
				});
				
				return querySplit;
			});
		},
		//다수의 CSS테스트
		"IS":function(node,value,advenceResult){
			//
			if(!ISELNODE(node)) return false;
			if(value == "*" || value == "") return true;
			if(typeof value === "undefined") return true;
			
			var judgement, inspectData = StructureInit("QueryDataInfo",value);

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
		},
		//쿼리셀렉터와 약간 다른점은 부모도 쿼리 셀렉터에 포함된다는 점
		"QUERY":(function(){
			if( ISUNDERBROWSER(9) || !document.querySelectorAll ){
				console.warn("Nody의 노드셀렉터 관용모드 시작");
				return function(query,root){
					if(typeof query !== "string" || (query.trim().length == 0)) return [];
					var root      = ISDOCUMENT(root)?document.body.parentElement:ISELNODE(root)?root:document.body.parentElement;			
					var queryData = StructureInit("QueryDataInfo",query);
					var result = [];
					NUT.FEEDERDOWN(root,function(node){ if( NUT.IS(this,queryData) ) result.push(this); },"children");
					return result;
				}
			}
			return function(query,root){
				//upper browser
				if(typeof query !== "string" || (query.trim().length == 0)) return [];
				root = ((typeof root === "undefined")?document:ISELNODE(root)?root:document);
				if(root == document)   return root.querySelectorAll(query);
				if(NUT.IS(root,query)) return [root].concat(Array.prototype.slice.call(root.querySelectorAll(query)));
				return root.querySelectorAll(query);
			}
		})(),
		"FEEDERDOWN_WHILE":function(feeder,stopFilter,findChild){
			if( stopFilter.call(feeder,feeder) !== false ){
				var childs = TOARRAY(findChild.call(feeder,feeder));
				for(var i=0,l=childs.length;i<l;i++) NUT.FEEDERDOWN_WHILE(childs[i],stopFilter,findChild);
			}
		},
		"FEEDERDOWN":function(feeder,filter,feeddown){
			if(typeof filter !== "function") console.error("DATAFEEDDOWN 두번째 파라메터는 function이여야 합니다");
			var feeddownMethod;
			switch(typeof feeddown){case "function":feeddownMethod=feeddown;break;case "string":feeddownMethod=function(fd){return fd[feeddown];};break;default:return;break;}
			if(typeof feeder === "object") NUT.FEEDERDOWN_WHILE(feeder,filter,feeddownMethod,2);
		},
		"MEMBER":function(node,offset){
			var target = node;
			if( (!ISELNODE(target)) || (!ISTEXTNODE(target)) ) return;
			if(typeof offset !== "number") return TOARRAY(node.parentElement.childNodes);
			var currentIndex = -1;
			DATAEACH(node.parentElement.children,function(node,i){ if(target == node) { currentIndex = i; return false; } });
			return target.parentNode.childNodes[currentIndex+offset];
		}
	});
	
	
	makeSingleton("FINDEL",{
		"FINDFUNCTION":function(find,root){
			if (typeof root !== "undefined"){
				if( ISELNODE(root) && ISELNODE(find) ){
					var finded = NUT.QUERY(ELTRACE(find),root);
					for(var i=0,l=finded.length;i<l;i++) {
						if(finded[i] == find) return [find];
					}
				}
				var findCollection = [];
				var roots = FINDFUNCTION(root);
				for(var i=0,l=roots.length;i<l;i++){ findCollection.push(NUT.QUERY(find,roots[i])); }
				return DATAUNIQUE.apply(undefined,findCollection);
			} else if( ISARRAY(find) ){
				var findCollection = [];
				for(var i=0,l=find.length;i<l;i++) { findCollection.push(FINDFUNCTION(find[i])); }
				return DATAUNIQUE.apply(undefined,findCollection);
			} else if( ISELNODE(find) ){
				return [find];
			}  else {
				return NUT.QUERY(find,W.document);
			}
			return [];
		},
		"IFRAMEDOCUMENT":function(iframe){
			var iframe = ZFIND(iframe);
			if(iframe.tagName == "IFRAME") return iframe.contentDocument || iframe.contentWindow.document;
			if(ISDOCUMENT(iframe)) return iframe;
		},
		"FINDMEMBER":function(sel,offset){
			var target = ZFIND(sel);
			if(!ISELNODE(target)) return;
			if(typeof offset !== "number") return TOARRAY(node.parentElement.children);
			var currentIndex = -1;
			DATAEACH(target.parentNode.children,function(node,i){ if(target == node) { currentIndex = i; return false; } });
			return target.parentNode.children[currentIndex+offset];
		},
		"FIND" : FUT.CONTINUTILITY(function(find,root,eq){
			if(typeof root === "number"){
				eq   = root;
				root = undefined;
			}
			if(typeof eq === "number"){
				return FINDFUNCTION(find,root)[eq];
			} else {
				return FINDFUNCTION(find,root);
			}
		}),		
		// 배열이라면 엘리먼트의 하나 추출
		"ZFIND" : FUT.CONTINUTILITY(function(find,root){
			return FINDFUNCTION(find,root)[0];
		}),
		"FINDIN" : FUT.CONTINUTILITY(function(root,find){
			return FINDFUNCTION( (ISNOTHING(find) ? "*" : find) ,root);
		},2),
		"FINDON": FUT.CONTINUTILITY(function(root,find){
			var finds = DATAMAP(FINDFUNCTION(root),function(node){
				return node.children;
			},DATAFLATTEN)
			switch(typeof find){
				case "number":
					return finds[find];
				case "string":
					return DATAFILTER(finds,function(node){
						return NUT.IS(node,find);
					});
				default :
					return finds;
			}
		},2),
		"FINDPARENTS":FUT.CONTINUTILITY(function(el){ return NUT.PARENTS(FINDFUNCTION(el)[0]); }),
		"FINDPARENT" :FUT.CONTINUTILITY(function(el,require){
			var node = FINDFUNCTION(el)[0];
			if(!ISELNODE(node)) return ;
			if(typeof require === "string"){
				var parents = NUT.PARENTS(node);
				for(var i in parents) if( NUT.IS(parents[i],require) ) return parents[i];
				return undefined;
			} else {
				return node.parentElement;
			}
		},2)
	});
	FINDEL.eachGetter();
	
	makeSingleton("GUT",{
		"CREATE" :function(name,attrValue,parent){
			var element,skipRender,name=(typeof name !== "string") ? "div" : name.trim();
			var dataset,htmlvalue,cacheName=name,cacheEnable=false;
			
			//attr 최적화 작업
			//데이터셋과 HTML은 CREATE에서 스스로 처리
			switch(typeof attrValue){
				case "object":
					if("dataset" in attrValue){
						dataset   = attrValue["dataset"];
						attrValue = CLONE(attrValue);
						delete attrValue["dataset"];
					}
					if("html" in attrValue){
						htmlvalue = attrValue["html"];
						delete attrValue["html"];
					}
					if("value" in attrValue){
						htmlvalue = attrValue["value"];
						delete attrValue["value"];
					}
					if(ISNOTHING(attrValue)){ 
						cacheEnable = true; 
						attrValue = undefined;
					}
					break;
				case "number":
				case "boolean":
					attrValue = attrValue+"";
				case "string":
					htmlvalue   = attrValue;
					cacheEnable = true;
					attrValue   = undefined; 
					break;
				case "undefined":
					cacheEnable = true;
					break;
				default:
					console.warn("CREATE의 두번째 값은 글자나 오브젝트입니다. 들어온 값 ->",attrValue);
					cacheEnable = true;
					attrValue   = undefined;
					break;
			}
			
			//성능향상을 위한 캐시
			if(cacheEnable){
				var cacheNode = FUT.CACHEGET("CREATE",cacheName);
				if(cacheNode) {
					element    = CLONENODES(cacheNode)[0];
					skipRender = true;
				}
			}
			
			//랜더링 시작
			if(!skipRender){
				if(name.indexOf("<") !== 0) name = TAG(name,attrValue);

				switch(name.substr(0,3)){
					case "<tr" :
						var sWrap = TAGSTACKS("table","tbody");
						element = ZFIND("tr",HTMLTOEL(sWrap[0] + name + sWrap[1]));
						break;
					case "<td" : case "<th" :
						if(name.substr(0,6) == "<thead"){
							var sWrap = TAGSTACKS("table");
							element = ZFIND("thead",HTMLTOEL(sWrap[0] + name + sWrap[1]));
						} else {
							var sWrap = TAGSTACKS("table","tbody");
							element = ZFIND(name.substr(1,2),HTMLTOEL(sWrap[0] + name + sWrap[1]));
						}
						break;
					case "<tb" : case "<tf" :
						if(name.substr(0,6) == "<tbody" || name.substr(0,6) == "<tfoot"){
							var sWrap = TAGSTACKS("table");
							element = ZFIND(name.substr(1,5),HTMLTOEL(sWrap[0] + name + sWrap[1]));
						}
						break;
					case "<co" :
						if(name.substr(0,9) == "<colgroup" ){
							var sWrap = TAGSTACKS("table");
							element = ZFIND("colgroup",HTMLTOEL(sWrap[0] + name + sWrap[1]));
						} else if (name.substr(0,4) == "<col" ) {
							var sWrap = TAGSTACKS("table","colgroup");
							element = ZFIND("col",HTMLTOEL(sWrap[0] + name + sWrap[1]));
						}
						break;
					default:
						element = HTMLTOEL(name)[0];
						break;
				}
				//캐시 저장
				if(cacheEnable) FUT.CACHESET("CREATE",cacheName,CLONENODES(element)[0]);
			}
			
			//랜더링 후처리
			if(dataset) for(var key in dataset) {
				//ie11 lt fix
				if(!element.dataset) element.dataset = {};
				element.dataset[key] = dataset[key];
			}
			if(htmlvalue) if("value" in element) {
				element.setAttribute("value",htmlvalue)
			} else {
				element.innerHTML = htmlvalue;
			}
			
			//부모에게 어팬딩함
			parent = ZFIND(parent);
			if(parent){
				if(parent==W.document) parent = W.document.getElementsByTagName("body")[0];
				parent.appendChild(element);
			}
			return element;	
		},
		"CREATETO":function(node,parent){ return CREATE(node,undefined,parent); },
		//get text node element
		"MAKETEXT":FUT.CONTINUTILITY(function(t){ return W.document.createTextNode(t); },1),
		"MAKE":FUT.CONTINUTILITY(function(name,attr,third){
			if ( ISARRAY(attr) || ISELNODE(attr) || ISTEXTNODE(attr) ) {
				var createNode = CREATE(name);
				ELAPPEND(createNode,new AArray(arguments).subarr(1).flatten().toArray());
				return createNode;
			} else if(ISELNODE(third) || ISTEXTNODE(third)){
				var createNode = CREATE(name, attr);
				ELAPPEND(createNode,new AArray(arguments).subarr(2).flatten().toArray());
				return createNode;
			} else {
				return CREATE(name, attr);
			}	
		},1),
		// 각 arguments에 수치를 넣으면 colgroup > col, col... 의 width값이 대입된다.
		"MAKECOLS":function(){ return new AArray(arguments).inject(CREATE("colgroup"),function(colvalue,parent){ if(typeof colvalue === "string" || typeof colvalue === "number") ELAPPEND(parent,CREATE("col",{width:colvalue})); }); },
		"MAKETEMP":function(innerHTML,id){
			var temphtml = (typeof id === "string") ? ('<template id="' + id + '">') : '<template>' ;
				temphtml += innerHTML;
				temphtml += '</template>';
			return HTMLTOEL(temphtml)[0];
		},
		"TOOBJECT":function(param,es,kv){
			if(typeof param=="object") return param;
			if(kv == true && ( typeof param === "string" || typeof es === "string")){ var r = {}; r[es] = param; return r; }
			if(typeof param=="string" || typeof param=="boolean") {
				try {
					if(JSON == aJSON) throw new Error("not json supported browser");
					var jp = JSON.parse(param);
					if(typeof jp !== "object") throw new Error("pass");
				} catch(e) {
					if(_String(param).isDataContent()=="plain"){var esv=(typeof es === "string" ? es : "value");
					var reo={};reo[esv]=param;return reo;}
					return _String(param).getDataContent();
				}
			}
			return{};
		},
		//노드 배열을 복사함
		"CLONENODES":function(node){
			return DATAMAP(FIND(node),function(findNode){ return findNode.cloneNode(findNode,true); });
		},
		//하위의 노드를 모두 복사함
		"IMPORTNODE":function(node,parent){
			node = FIND(node);
			if( node.length === 0) return undefined;
			if( node.length !== 1 ) console.warn("IMPORTNODE:: 한개의 노드만 복사할수 있습니다.",node);
			node = ZERO(node);
			
			var result;
			if('content' in node){
				result = FIND(document.importNode(node.content,true).childNodes);
			} else {
				result = CLONENODES(node.children);
			}
			
			if(parent){
				parent = ZFIND(parent);
				if(parent) ELAPPEND(parent,result);
			}
			
			return result;
			
		},
		"CLONEOBJECT":function(inv){ if(typeof inv === "object"){ var result = {}; for(var k in inv) result[k] = inv[k]; return result; } return TOOBJECT(inv); },
		//오브젝트 혹은 element를 반환합니다.
		"DATACONTEXT":function(target){
			if ( typeof target === "string" ) target = ZFIND(target);
			if ( typeof target === "object" ) {
				if( this.ISARRAY(target) ){
					var findElement = ZFIND(target);
					if(findElement) return findElement;
				}
				return target;
			}
			return undefined;
		}
	})
	GUT.eachGetter();
	
	makeSingleton("EL",{
		//포커스 상태인지 검사합니다.
		"HASFOCUS":function(sel){ return document.activeElement == ZFIND(sel); },
		//케럿을 움직일수 있는 상태인지 검새합니다.
		"CARETPOSSIBLE":function(sel){ var node = ZFIND(sel); if( ELHASFOCUS(node) == true) if(node.contentEditable == true || window.getSelection || document.selection) return true; return false; },
		//어트리뷰트값을 읽거나 변경합니다.
		"ATTR":function(sel,v1,v2){ var node = ZFIND(sel); if(node)return NUT.ATTR(node,v1,v2);  },
		//css스타일로 el의 상태를 확인합니다.
		"IS":function(sel,value){ var node = ZFIND(sel); if(node)return NUT.IS(node,value); },
		//선택한 element중 대상만 남깁니다.
		"FILTER":function(sel,filter){
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
		"VALUE":function(aNode,value){
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
							var findEl = ZFIND(ELFILTER(nodes,"[type=radio][name="+nodeZeroName+"]::"+value));
							if(findEl) findEl.checked = true;
							return findEl;
						} else {
							var checkedEl  = ELFILTER(nodes,"[type=radio][name="+nodeZeroName+"]:checked");
							var selectedEl = ZFIND(checkedEl);
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
						var selNode = NUT.QUERY(":selected",node);
						if( ISELNODE(selNode) ) return selNode.value;
						return node.value;
					} else {
						if(typeof value === "undefined") return node.value;
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
					if(typeof value === "undefined") return node.value;
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
					if(typeof value === "undefined") return node.innerText;
					node.innerText = value;
				break;
			}
			return node;
		},
		"HASATTR":function(sel,name,hideConsole){
			var node = ZFIND(sel);
			if(node) { return ELATTR(sel,name) == null ? false : true; }
			if(hideConsole !== true) console.error("ELHASATTR:: 알수없는 node값 입니다. => " + TOS(node) );
			return false;
		},
		"UNIQUE":function(sel){
			var node = ZFIND(sel);
			if(node) { if(!ELHASATTR(node,"id")) node.setAttribute("id",_Util.base26UniqueRandom(8)) }
			return node;
		},
		"UNIQUEID":function(sel){
			var result = ELUNIQUE(sel);
			if(result) { return result.getAttribute("id") }
		},
		//get css style tag info
		"TRACE"   :function(target,sign,withValue){
			var t = ZFIND(target);
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
					if( ((typeof sign === "undefined") && (withValue == true)) || ((sign == true) && (typeof withValue === "undefined")) ){
						b = ELVALUE(t); if(!ISNOTHING(b)) r = r + ":" + b;
					}
					return r;
					break;
				}
			} else {
				console.warn("ELTRACE::target is not element or selector // target =>",target);
			}
		},
		"CALL":function(node,f){
			if(typeof f === "function"){
				var nodes = FIND(node);
				DATAEACH(nodes,function(n,i){
					f.call(n,n,i);
				});
				return nodes;
			}
			return [];
		},
		"INDEX":function(el){
			var node = ZFIND(el);
			var parent = FINDPARENT(node);
			if(parent) return DATAINDEX(parent.children,node);
		},
		"APPEND":function(parentIn,childs){
			var parent = ZFIND(parentIn);
			if(!ISELNODE(parent)) return parentIn;
			var appendTarget  = FIND(childs);
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
										parent.appendChild(CREATE("tbody")) ;
									} else {
										parent.insertBefore(CREATE("tbody"),parent.tFoot);
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
											var td = CREATE("td");
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
								var td = CREATE("td");
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
		"PREPEND":function(parentIn,childs){
			var parent = ZFIND(parentIn);
			var appendTarget = FIND(childs);
			if(ISMEANING(parent),ISMEANING(appendTarget)){
				ELAPPEND(parent,appendTarget);
				var newParent = FINDPARENT(appendTarget[0]);
				if(newParent) {
					DATAEACH(appendTarget,function(node,i){
						newParent.insertBefore(node,newParent.childNodes[i]);
					});
				}
			}
		},
		"APPENDTO":function(targets,parentEL){ return ELAPPEND(ZFIND(parentEL),targets); },
		"PUT":function(sel){
			var node = ZFIND(sel);
			if(!ISELNODE(node)) return console.warn("ELPUT:: node를 찾을수 없습니다. => 들어온값" + TOS(node));
			ELEMPTY(node);
			var newContents = [];
			var params = Array.prototype.slice.call(arguments);
			params.shift();
			DATAEACH( DATAFLATTEN(params) ,function(content){
				if(ISELNODE(content)){
					newContents.push(content)
				} else {
					content = TOSTRING(content);
					switch(node.tagName){
						case "UL":case "MENU":
							newContents.push(_LI("::"+content))
							break;
						case "DL":
							newContents.push(_DD("::"+content))
							break;
						default:
							newContents.push(_SPAN("::"+content))
							break;	
					}
				}
			});
			ELAPPEND(node,newContents);
			return node;
		},
		//이전 엘리먼트를 찾습니다.
		"BEFORE":function(node,appendNodes){ 
			var target;
			target = ZFIND(node);
			if(!ISELNODE(target)) return node;
			if(arguments.length < 2) return FINDMEMBER(target,-1);
			var appendTarget = FIND(appendNodes);
			if(appendTarget.length > 0){
				for(var i=0,l=appendTarget.length;i<l;i++) target.parentNode.insertBefore(appendTarget[i],target); 
			}
			return target; 
		},
		//이후 엘리먼트를 찾습니다.
		"AFTER" : function(target,appendNodes){ 
			target = ZFIND(target); 
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
		"CHANGE":function(left,right){
			left  = ZFIND(left);
			right = ZFIND(right);
			if(left && right ){
				var lp = left.parentNode;
				var rp = right.parentNode;
				if(lp && rp){
					var helper = MAKE("div");
					var li = DATAINDEX(lp.children,left);
					var ri = DATAINDEX(rp.children,right);
					
					rp.insertBefore(helper,right);
					lp.insertBefore(right,left);
					rp.insertBefore(left,helper);
					rp.removeChild(helper);
					
				} else {
					console.warn("has not parent",left,lp,right,rp);
				}
			} else {
				console.warn("not found",left,right);
			}
			return [left,right];
		},
		"BEFOREALL":function(node){ node = ZFIND(node); var index = ELINDEX(node); var result = []; if(typeof index === "number") for(var i=0,l=index;i<l;i++) result.push(node.parentNode.children[i]); return result; },
		"AFTERALL":function(node){ node = ZFIND(node); var index = ELINDEX(node); var result = []; if(typeof index === "number") for(var i=index+1,l=node.parentNode.children.length;i<l;i++) result.push(node.parentNode.children[i]); return result; },
		"REPLACE":function(target,replaceNode){
			var replaceTarget = ZFIND(replaceNode);
			ELAFTER(target,replaceTarget);
			ELREMOVE(target);
			return replaceTarget;
		},
		//같은 위치상의 엘리먼트를 위로 올립니다.
		"UP"   : function(target){if(!ISELNODE(target))return target;var parent=target.parentNode;if(!ISELNODE(parent))return target;var prev=target.previousSibling;if(!ISELNODE(prev))return target;ELBEFORE(prev,target);},
		//같은 위치상의 엘리먼트를 아랠로 내립니다.
		"DOWN" : function(target){if(!ISELNODE(target))return target;var parent=target.parentNode;if(!ISELNODE(parent))return target;var next=target.nextSibling;if(!ISELNODE(next))return target;ELAFTER(next,target);},
		//스타일을 얻어냅니다.
		"STYLE": function(target,styleName,value){
			var target = ZFIND(target);
			if(ISELNODE(target)){
				if(typeof styleName === "undefined") return ENV.supportComputedStyle ? window.getComputedStyle(target,null) : target.currentStyle;
				if(typeof styleName === "string"){
					//mordern-style-name
					styleName = ENV.getCSSName(styleName);
					//get
					if(typeof value === "undefined") return ENV.supportComputedStyle ? window.getComputedStyle(target,null).getPropertyValue(styleName) : target.currentStyle[CAMEL(styleName)];
					
					//set
					value     = ENV.getCSSName(value);
					var wasStyle = ELATTR(target,"style");
					wasStyle = wasStyle ? wasStyle.replace(new RegExp(styleName+"[^\;]+;"),"") : "";
					
					ELATTR(target,"style",styleName+":"+value+";"+wasStyle);
				}
			}
			return target;
		},
		//내무의 내용을 지웁니다.
		"EMPTY"  : function(target){ return FIND(target,DATAMAP,function(node){ if("innerHTML" in node) node.innerHTML = ""; return node; }); },
		//대상 객체를 제거합니다.
		"REMOVE" : function(node,childs){ var target = ZFIND(node); if(!ISELNODE(target)) return target; if(!ISELNODE(target.parentNode)) return target; target.parentNode.removeChild(target); return target; },
		//케럿의 위치를 찾습니다.
		"CARET":function(select,pos){
			//
			var node = ZFIND(select);
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
		"TRIGGER":function(node,eventName,eventParam){
			if(ISWINDOW(node)){
				node = W;
			} else {
				node = ZFIND(node);
				if(ISNOTHING(node)) throw new Error("ELTRIGGER는 element를 찾을수 없습니다. => 들어온값" + TOS(node));
			}
			if ("createEvent" in document) {
			    var e = W.document.createEvent("HTMLEvents");
			    e.initEvent(eventName, true, true);
				PROPEACH(eventParam,function(v,k){
					e[k] = v;
				});
			    node.dispatchEvent(e);
			} else {
				node.fireEvent("on"+eventName);
			}
			return node;
		},
		//이벤트 등록이 가능한 타겟을 찾아냅니다.
		"ONTARGET":function(node){ return (ISWINDOW(node),ISDOCUMENT(node)) ? node : FIND(node); },
		//중복이벤트 등록 가능
		"ON":function(node, eventName, eventHandler, useCapture){
			if((typeof eventName !== "string") || (typeof eventHandler !== "function")) return console.erro("ELON 노드 , 이벤트이름, 이벤트헨들러 순으로 파라메터를 입력하세요",node, eventName, eventHandler);
			var nodes  = ELONTARGET(node);
			var events = eventName.split(" ");
			DATAEACH(nodes,function(eventNode){
				DATAEACH(events,function(event){
					if (eventNode.addEventListener){
						eventNode.addEventListener(event, eventHandler, useCapture==true ? true : false); 
					} else if (node.attachEvent){
						eventNode.attachEvent('on'+event, eventHandler);
					}
				});
			});
			return nodes;
		},
		"OFF":function(node, eventName, eventHandler, useCapture){
			if((typeof eventName !== "string") || (typeof eventHandler !== "function")) return console.erro("ELON 노드 , 이벤트이름, 이벤트헨들러 순으로 파라메터를 입력하세요",node, eventName, eventHandler);
			var nodes  = ELONTARGET(node);
			var events = eventName.split(" ");
			DATAEACH(nodes,function(eventNode){
				DATAEACH(events,function(event){
					if (eventNode.removeEventListener){
						eventNode.removeEventListener(event, eventHandler, useCapture==true ? true : false); 
					} else if (node.detachEvent){
						eventNode.detachEvent('on'+event, eventHandler);
					}
				});
			});
			return nodes;
			
			
			node = ELONTARGET(node);
			if(!node || !(typeof eventHandler == "function")) console.error("ELON::node나 이벤트 헨들러가 존재해야 합니다.",node, eventName, eventHandler);
		
			var events = eventName.split(" ");
			//var eventMeta = _Meta(eventHandler);
			//var handler = function(e){eventHandler.call(node,e)};
			for(var i=0,l=events.length;i<l;i++){
				if (node.removeEventListener){
					node.removeEventListener(events[i], eventHandler, useCapture==true ? true : false); 
					//node.removeEventListener(events[i], eventMeta.getProp(events[i]), false); 
				} else if (node.detachEvent){
					node.detachEvent('on'+events[i], eventHandler);
				    //node.detachEvent('on'+events[i], eventMeta.getProp(events[i]));
				}
			}
			return node;
		},
		//한번만 발생하는 이벤트입니다.
		"ONETIME":function(node, eventName, eventHandler, time){
			if(typeof eventHandler === "function"){
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
		"DATA":function(node,key,value){
			var nodes = FIND(node);
			if(nodes.length == 0) return;
			if(arguments.length == 1) return CLONE(ZERO(nodes).dataset);
			if(arguments.length == 2) return ZERO(nodes).dataset[key];
			if(arguments.length == 3) { DATAEACH(nodes,function(node){ node.dataset[key] = value; }); return nodes; }
		},
		//Disabled
		"DISABLED":function(node,status){
			var elf = new AArray(FIND(node));
			if( elf.isNothing() ){
				console.error("ELDISABLED:: node를 찾을수 없습니다. => 들어온값" + TOS(node));
			} else {
				elf.each(function(el){
					if("disabled" in el){
						if(typeof status === "undefined") return el.disabled;
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
		"READONLY":function(node,status){
			var elf = FIND(node,new AArray);
			if( elf.isNothing() ){
				console.error("ELREADONLY:: node를 찾을수 없습니다. => 들어온값" + TOS(node));
			} else {
				elf.each(function(el){
					if( "readOnly" in el ){
						if(typeof status === "undefined") return el.readOnly;
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
		"CommonAString":new AString(),
		"ADDCLASS":function(node,addClass){	
			var findNodes = FIND(node);
			if(typeof addClass !== "string") return findNodes;
			for(var i=0,l=findNodes.length;i<l;i++) findNodes[i].setAttribute("class",EL.CommonAString.set(findNodes[i].getAttribute("class")).getAddModel(addClass));
			return findNodes;
		},
		"HASCLASS":function(node,hasClass){
			var findNodes = FIND(node);
			if(typeof hasClass !== "string") return false;
			for(var i=0,l=findNodes.length;i<l;i++) if( !EL.CommonAString.set(findNodes[i].getAttribute("class")).hasModel(hasClass) ) {
				return false;
			}
			return true;
		},
		"REMOVECLASS":function(node,removeClass){
			var findNodes = FIND(node);
			if(typeof removeClass !== "string") return findNodes;
			for(var i=0,l=findNodes.length;i<l;i++) {
				var didRemoveClassText = EL.CommonAString.set(findNodes[i].getAttribute("class")).getRemoveModel(removeClass).trim();
				if( !didRemoveClassText.length ) {
					findNodes[i].removeAttribute("class");
				} else {
					
					findNodes[i].setAttribute("class",didRemoveClassText);
				}
			} 
			return findNodes;
		}
	});
	EL.eachGetterWithPrefix();
	
	extendModule("Array","Nody",{
		find:function(selector){ return _Nody(selector,this); },
		hasFocus:function(){ return EL.HASFOCUS(this); },
		caretPossible:function(){ return EL.CARETPOSSIBLE(this); },
		attr:function(name){ 
			if(arguments.length > 1){
				FLATTENCALL(EL.ATTR,undefined,this,arguments);
				return this;
			} else {
				if(arguments.length == 0) return CALL(EL.ATTR,undefined,this);
				return CALL(EL.ATTR,undefined,this,name);
			}
		},
		
		hasAttr:function(){ return FLATTENCALL(EL.ATTR,EL,this,arguments); },
		addClass:function(name){ return CALL(EL.ADDCLASS,EL,this,name) },
		hasClass:function(name){ return CALL(EL.HASCLASS,EL,this,name) },
		removeClass:function(name){ return CALL(EL.REMOVECLASS,EL,this,name) },
		is     :function(){ return FLATTENCALL(EL.IS,EL,this,arguments); },
		filter :function(){ this.replace(FLATTENCALL(EL.FILTER,EL,this,arguments)); return this; },
		value  :function(name){ 
			if(arguments.length > 0){
				FLATTENCALL(EL.VALUE,EL,this,arguments);
				return this;
			} else {
				return CALL(EL.VALUE,EL,this,name);
			}
		},
		trace    :function(){ return FLATTENCALL(EL.TRACE,EL,this,arguments); },
		//index
		currentIndex:function(){ return FLATTENCALL(EL.INDEX,EL,this,arguments); },
		append   :function(){ FLATTENCALL(EL.APPEND,EL,this,arguments);    return this; },
		prepend  :function(){ FLATTENCALL(EL.PREPEND,EL,this,arguments);   return this; },
		appendTo :function(target){ CALL(EL.APPENDTO,EL,this,target); return this; },
		prependTo:function(target){ CALL(EL.PREPENDTO,EL,this,target);return this; },
		put      :function(){ FLATTENCALL(EL.PUT,EL,this,arguments); return this;},
		before   :function(){
			if(arguments.length > 0){
				FLATTENCALL(EL.BEFORE,EL,this,arguments);
				return this;
			} else {
				return CALL(EL.BEFORE,EL,this);
			}
		},
		after    :function(){
			if(arguments.length > 0){
				FLATTENCALL(EL.AFTER,EL,this,arguments);
				return this;
			} else {
				return CALL(EL.AFTER,EL,this);
			}
		},
		beforeAll:function(){ return CALL(EL.BEFOREALL,EL,this); },
		afterAll :function(){ return CALL(EL.AFTERALL,EL,this); },
		replace  :function(){ FLATTENCALL(EL.REPLACE,EL,this,arguments); return this;},
		up    :function(){ return CALL(EL.UP,EL,this); },
		down  :function(){ return CALL(EL.DOWN,EL,this); },
		style :function(name){ 
			if(arguments.length > 1){
				FLATTENCALL(EL.STYLE,EL,this,arguments);
				return this;
			} else {
				if(arguments.length == 0) return CALL(EL.STYLE,EL,this);
				return CALL(EL.STYLE,EL,this,name);
			}
		},
		empty  :function(){ CALL(EL.EMPTY,EL,this); return this; },
		remove :function(){ CALL(EL.REMOVE,EL,this); return this; },
		caret  :function(){ FLATTENCALL(EL.CARET,EL,this,arguments); },
		trigger:function(name){ CALL(EL.TRIGGER,EL,this,name); return this; },
		on     :function(){ FLATTENCALL(EL.ON,EL,this,arguments); return this; },
		off    :function(){ FLATTENCALL(EL.OFF,EL,this,arguments); return this; },
		onetime:function(){ FLATTENCALL(EL.ONETIME,EL,this,arguments); return this; },
		data   :function(name){
			if(arguments.length > 1){
				FLATTENCALL(EL.DATA,EL,this,arguments);
				return this;
			} else {
				if(arguments.length == 0) return CALL(EL.DATA,EL,this);
				return CALL(EL.DATA,EL,this,name);
			}
		},
		disabled:function(){ FLATTENCALL(EL.DISABLED,EL,this,arguments); return this; },
		readonly:function(){ FLATTENCALL(EL.READONLY,EL,this,arguments); return this; },
	},function(select,parent){
		this.setSource(FIND(select,parent));
	});
	
	extendModule("Nody","Make",{},function(node,attr,parent){
		this.setSource(GUT.CREATE(node,attr,parent));
	});
	
	extendModule("Nody","Template",{
		clone    : function(partialData){ return _Template(this.TemplateNode,partialData); },
		generate : function(partialData){ return _Template(this.TemplateNode,partialData).get(); },
		// 키를 지우면서
		partialAttr:function(attrKey,method){
			this.find("["+attrKey+"]").each(function(node){
				//attrValue, node
				method(node.getAttribute(attrKey),node,attrKey);
				node.removeAttribute(attrKey);
			});
			return this;
		},
		//
		partialData:function(data){
			if(!this.TemplatePartials)this.TemplatePartials = {value:{},src:{},dataset:{},href:{},placeholder:{}};
			if(typeof data !== "object") { return console.error("partialData의 파라메터는 object이여야 합니다"); }
			var _ = this;
			var _partials = this.TemplatePartials;
			// 파셜 노드 수집 (두번째의 경우 수집한 노드를 다시 수집)
			PROPEACH(this.TemplatePartials,function(inject,name){
				_.partialAttr("partial-"+name,function(attrValue,node){
					if (!inject[attrValue]) inject[attrValue] = [];
					inject[attrValue].push(node);
				});
			});
			
			// 파셜 데이터 입력
			PROPEACH(_partials,function(partialData,partialCase){
				PROPEACH(partialData,function(nodelist,attrValue){
					if(attrValue in data) DATAEACH(nodelist,function(node){
						switch(partialCase){
							case "value":ELVALUE(node,data[attrValue]);break;
							case "src"  :node.setAttribute("src",data[attrValue]);break;
							case "href" :node.setAttribute("href",data[attrValue]);break;
							case "placeholder": ELEMPTY(node);ELAPPEND(node,data[attrValue]);break;
							case "dataset": PROPEACH(data[attrValue],function(key,value){ node.dataset[key] = value; });break;
						}
					});
				});
			});
			return this;
		},
		reset : function(partialData){
			if (this.TemplateNode.length === 0) console.error("tamplate 소스를 찾을수 없습니다.",this.initNode);
			if (this.TemplateNode.length !== 1) console.warn("tamplate 소스는 반드시 1개만 선택되어야 합니다.",this.initNode);
			this.setSource(IMPORTNODE(ZERO(this.TemplateNode)));
			if(typeof partialData == "object") this.partialData(partialData);
		}
	},function(node,partialData,cancel){
		this.initNode      = node;
		this.TemplateNode  = (typeof node === "string")?/^<.+>$/.test(node)?[MAKETEMP(node)]:FIND(node):FIND(node);
		if (!this.TemplateNode) {
			console.error("template init falid!");
		} else {
			if(partialData === false || cancel === false) return;
			this.reset(partialData);
		}
	},function(){
		//get 함수입니다. Template모듈은 기본적으로 노드를 반환합니다.
		return ZFIND(this);
	});
})(window,NODYENV);

//Nody Component Foundation
(function(W,ENV){
	//여러 엘리먼트를 셀렉트하여 한번에 컨트롤
	makeModule("Controls",{
		getSelects:function(){ return this.Source; },
		statusFunction:function(f,param,filter,requireElement){
			var fe = filter ? function(node){ return ELIS(node,filter)?f(node, param):undefined } : function(node){ return f(node, param); };
			var r  = new AArray(this.getSelects()).map( fe ).filter();
			return (requireElement == true) ? r.toArray() : this;
		},
		disabled:function(status,filter){ return this.statusFunction(ELDISABLED,(status !== false ? true : false),filter); },
		readonly:function(status,filter){ return this.statusFunction(ELREADONLY,(status !== false ? true : false),filter); },
		empty   :function(filter)       { filter = filter?filter+",:not(button,select)":":not(button,select)"; return this.statusFunction(ELVALUE   ,"",filter); },
		map     :function(mapf,filter)  { return this.statusFunction(function(node){ var r = mapf(node); if(ISTEXT(r)){ ELVALUE(node,r); } },"",filter); },
		removePartClass:function(rmClass,filter,req){
			var r = this.statusFunction(function(node,param){
				var classes = ELATTR(node,"class");
				if(typeof classes === "string"){
					classes = _String(classes).getRemoveModel(eval("/^"+param+"/"));
					ELATTR(node,"class",classes);
					return node;
				}
				return undefined;
			},rmClass,filter,true);
			return (req == true)?r:this;
		},
		changePartClass:function(selClass,toClass,filter){
			new AArray(this.removePartClass(selClass,filter,true)).each(function(node){
				var classes = ELATTR(node,"class");
				ELATTR(node,"class",_String(classes).getAddModel(selClass+toClass));
			});
			return this;
		}
	},function(controls,casein){
		this.Source = FIND(controls,casein);
	});
	
	
	// 폼은 일정 폼 노드들을 컨트롤 하기위해 사용됩니다.
	extendModule("Controls","Form",{
		isValid        :function(f){ if(typeof f === "function") return f.call(this); return ISELNODE(this.Source); },
		getSelects     :function(){ return FIND(this.SelectRule,this.Source); },
		getSelectTokens:function(){
			return new AArray(this.SelectRule.split(",")).map(function(selString){
				var execResult = /\[([^\[\]+]+)\]/.exec(selString);
				if( execResult === null) return ;
				return execResult[1];
			}).filter().toArray();
		},
		//체크아웃 대상 (key와 무관)
		getCheckoutElement:function(){
			return FIND(new AArray(this.getSelectTokens()).map(function(s){ return "["+s+"]"; }).join(","), this.Source);
		},
		//체크아웃 대상 (key가 존재하는 것만)
		getCheckoutElementsWithToken:function(){
			var tokens = new AArray(this.getSelectTokens());
			return new AArray(this.getCheckoutElement()).inject({},function(node,inject){
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
			return new AObject(this.getCheckoutElementsWithToken()).map(function(node,key){
				var value = ELVALUE(node);
				return value == null ? "" : value;
			}).get();
		},
		checkin:function(hashMap,v2){
			if(typeof hashMap === "string"){
				if(typeof v2 !== "string") v2 = TOSTRING(v2);
				var map      = {};
				map[hashMap] = v2;
				hashMap      = map;
			}
			if(typeof hashMap === "object"){
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
		this.Source = ZFIND(context);
		if( !ISELNODE(this.Source) ) { console.error( "Frame::Context를 처리할 수 없습니다. => ",this.Source," <= ", context); }
		//options
		//Polymorphism
		var r,f;
		if(typeof selectRule === "object" && typeof selectRule !== "object"){ r = undefined; f = selectRule; } else { r = selectRule; f = filter; }
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
		this.CommandFilter = typeof filter === "object" ? filter : {} ;
	});
	
	//value 값이 있는 엘리먼트 컨트롤
	makeModule("Inside",{
		__setInputConfig:function(){ ELATTR(this.Source,"autocomplete","off"); },
		__maskIgnoreKeyCode:[9,16,17,18,27,36,37,38,39,40,91,92],
		__maskApply:function(name){
			this.__setInputConfig();
			var ignoreMaskKeyCodes = new AArray(this.__maskIgnoreKeyCode);
			var params             = new AArray(arguments).subarr(1).toArray();
			var eventTarget        = this.Source;
			ELON(eventTarget,"keydown",function(e){
				if( !ignoreMaskKeyCodes.has(e.keyCode) ){
					setTimeout(function(){
						var n = new ANumber(ELVALUE(eventTarget));
						ELVALUE(eventTarget,n[name].apply(n,params));
					},0);
				}
			});
		},
		getDateValue:function(format){
			var dateValue = ELVALUE(this.Source);
			return IS(dateValue,/(\d+)\D+(\d+)\D+(\d+)/,_String(dateValue).printf(/(\d+)\D+(\d+)\D+(\d+)/,[1],"년 ",[2],"월 ",[3],"일"),dateValue);
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
			var headInfo       = new AArray(W.document.head.childNodes).filter(function(node){ if(ISELNODE(node)) if(node.tagName !== "SCRIPT") return true; return false; });
			headInfo.insert(CREATE("base" ,{href:_Client.url().replace(/\/[^\/]*$/,"/")})).push(CREATE("style",{html:"@media print{ body{ background-color:#FFFFFF; background-image:none; color:#000000 } #ad{ display:none;} #leftbar{ display:none;} #contentarea{ width:100%;} }"}));
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
		number  :function(){ return new ANumber(ELVALUE(this.Source)).number(); }
	},function(el){
		this.Source = ZFIND(el);
		if(!this.Source) console.warn("Inside의 초기값을 설정하지 못했습니다. command =>",el);
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
	
	// 컨텍스트 컨트롤러
	makeModule("Contexts",{
		setContexts : function(contextsOrder,selectsOrder,targetsOrder) {
			this.initCall[0] = contextsOrder;
			if(selectsOrder)this.setSelects(selectsOrder,targetsOrder);
			return this;
		},
		setSelects : function(selectsOrder,targetsOrder){
			if(typeof selectsOrder !== "string") console.warn("Context::getSelects::selects order는 string인것이 좋습니다.",selectsOrder);
			this.initCall[1] = selectsOrder;
			if(targetsOrder)this.setTargets(targetsOrder);
			return this;
		},
		setTargets : function(targetsOrder){
			if(typeof targetsOrder !== "string") console.warn("Context::getTargets::targets order는 string인것이 좋습니다.",targetsOrder);
			this.initCall[2] = targetsOrder;
			return this;
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
		onSelects  :function(event,func,otherFunc){
			var _ = this;
			// 이벤트와 번호가 들어오면
			if(typeof event=="string" && typeof func === "number"){
				var selNode = this.getSelect(func);
				if(ISELNODE(selNode)){
					ELTRIGGER(selNode,event);
				} else {
					console.warn("Contexts::onSelects::트리깅할 대상이 없습니다.");
				}
				return this;
			}
			if(typeof event=="string" && typeof func === "function"){
				ELON(this.getContexts(),event,function(e){
					var curSel = new AArray( _.getSelects() );
					if(curSel.has(e.target)){
						//버블이 잘 왔을때
						var curfuncindex  = curSel.indexOf(e.target);
						var curfuncresult = func.call(e.target,e,curfuncindex,_);
						
						if(curfuncresult == false) return false;
						
						if(typeof otherFunc === "function") curSel.each(function(otherObj,index){ 
							if(e.target !== otherObj) return otherFunc.call(otherObj,e,index,_); 
						});
						
						return curfuncresult;
					} else {
						//버블링이 중간에 멈췄을때
						var eventCapture; 
						curSel.each(function(sel){
							if(ZFIND(e.target,sel)){
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
		trace : function(way) {
			way = typeof way === "string" ? way : "console.log";
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
		}
	},function(cSel,sSel,tSel){
		if(ISNOTHING(FIND(cSel))) console.warn("Contexts::init::error 첫번째 파라메터의 값을 현재 찾을 수 없습니다. 들어온값", cSel);
		this.initCall = [cSel,sSel,tSel];
		this.setContexts(cSel,sSel,tSel);
	});
	
	extendModule("Contexts","ActiveController",{
		whenWillActive:function(method){ this.ContextsEvents.willActive = method; return this; },
		whenDidActive:function(method){ this.ContextsEvents.didActive = method; return this;},
		whenDidInactive:function(method){ this.ContextsEvents.didInactive = method; return this; },
		whenActiveToggle:function(am,im){ this.whenDidActive(am); return this.whenDidInactive(im); },
		whenActiveStart:function(method){ this.ContextsEvents.activeStart = method; return this; },
		whenActiveEnd:function(method){this.ContextsEvents.activeEnd = method; return this;},
		shouldActive:function(index,wait){
			var _ = this;
			wait = TONUMBER(wait);
			wait = wait > 0 ? wait : 5;
			var t = setTimeout(function(){
				_.onSelects(_.ContextsEventName,TONUMBER(index));
			},wait);
			return this;
		},
		makeAccessProperty:function(method){
			if(typeof method !== "function") return {};
			return INJECT(this.getSelects(),function(inject,node,index){
				method(inject,node,index);
			});
		}
	},function(cSel,sSel,selectEvent,willActive,shouldActiveIndex,shouldActiveWait){
		this._super(cSel,sSel);
		this.ContextsEvents = {};
		this.ContextsEventName = (typeof selectEvent === "string") ? selectEvent : "click";
		this.preventDefault   = true;
		this.allowAutoActive  = true;
		this.allowMultiActive = false;
		this.allowInactive = false;
		//
		var _ = this;
		this.onSelects(this.ContextsEventName,function(e,i){
			var currentSelects = _.getSelects();
			if(_.preventDefault) e.preventDefault();
			if(_.allowInactive && ELHASCLASS(this,"active") ) {
				ELREMOVECLASS(this,"active");
				if( FIND(".active",currentSelects).length == 0 ) CALL(_.ContextsEvents.activeEnd,this,i);
				return false;
			}
			if( CALL(_.ContextsEvents.willActive,this,e,i) == false ) return;
			if(_.allowAutoActive) {
				var firstActive = FIND(".active",currentSelects).length ? false : true;
				ELADDCLASS(this,"active");
				if(firstActive) CALL(_.ContextsEvents.activeStart,this,i);
			} 
			CALL(_.ContextsEvents.didActive,this,i);
		},function(){
			if(_.allowAutoActive) ELREMOVECLASS(this,"active");
			CALL(_.ContextsEvents.didInactive,this);
		});
		//
		if(willActive) this.whenWillActive(willActive);
		if(typeof shouldActiveIndex !== "undefined") this.shouldActive(shouldActiveIndex,shouldActiveWait);
	});
	
	// Model은 순수 데이터 모델에 접근하기 위해 사용합니다.
	extendModule("Object","Model",{
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
	
	//카운트를 샌후 함수실행
	makeModule("Fire",{
		complete:function(){ this.FireCurrent = this.FireMax; return this.FireFunction.apply(this,arguments); },
		touch:function(){ this.FireCurrent++; if(this.FireCurrent >= this.FireMax) return this.complete.apply(this,arguments); },
		back:function(){ this.FireCurrent--; return this; },
		each:function(f){ 
			var own = this; 
			var touchLiteral = function(){ 
				return own.touch();
			}; 
			if(ISARRAY(this.Source) && typeof f === "function"){ 
				new AArray(this.Source).each(function(data,index){ return CALL(f,own,data,index,touchLiteral); }); 
			} else { 
				console.warn("Fire::조건이 충족되지 못해 fire를 실행하지 못하였습니다. source=> ",this.Source,"each f=>",f); 
			} return this; 
		}
	},function(number,fireFunction){
		//array
		this.Source       = number;
		//number
		this.FireMax      = (ISARRAY(number) == true) ? number.length : isNaN(number) == true ? 0 : parseInt(number) ;
		this.FireFunction = fireFunction;
		this.FireCurrent  = 0;
	});
	
	makeGetter("FIRE",function(list,counter,executor){
		return new Fire(list,executor).each(counter);
	});
	
	//XMLHTTP REQUEST
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
			var debugTrace = typeof moduleOption["debugTrace"] === "function" ? moduleOption["debugTrace"] : false;
			if(debugTrace){
				var getOption = debugTrace(debugObject);
				if(typeof getOption === "object"){
					debugObject = getOption;
				} else {
					console.error("Request::debugTrace시 결과값은 반드시 Object이여야 합니다");
				}
			}
			debugObject["dataTrace"] = (typeof debugObject.data === "undefined") ? "none" : debugObject.data;
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
			if(typeof requestHandler === "string") {
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
				if(typeof this.option.success === "function"){
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
				if(typeof error === "function") var resultIn = this.option.error(xhr,textError,data);
				if(resultIn !== false) console.error("Request::load : '"+ this.url +"' 호출이 실패되었습니다. JSON 파라메터와 에러코드를 출력합니다. ==> \n------\n" ,TOS(this.option) ,"\n------\n", textError, TOS(this.option.data));
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
									console.info("Request:: 404 페이지가 존재하지 않음");
									break;
								case 500 :
									console.info("Request:: 500 응답서버 내부오류");
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
			if( typeof requestOption === "function" ) requestOption = {success:requestOption};
			
			requestOption = TOOBJECT(requestOption,"method");
			
			var openForm = {};
			var recallLoop = false;
			// 메서드의 형식
			openForm.method     = typeof requestOption.method === "string" ? requestOption.method : "get"  ;
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
			if(typeof success === "function") this.option.success = success;
			if(typeof error   === "function") this.option.error   = error;
			if( !("success" in this.option) ) console.warn("Request Warning :: success메서드가 정의되지 않은 상태로 호출되었습니다.");
		
			//request Object만들기
			var newRequest = this.getRequestObject();
		
			//data 처리
			var requestData   = new AObject((typeof this.moduleOption.constData === "object") ? new AObject(this.moduleOption.constData).concat(this.option.data) : this.option.data);
			var requestString = new AObject(requestData.getEncodeObject()).join("=","&");
			
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
		if ((typeof requestOption === "string") && (typeof moduleOption === "function")) {
			// request option setup
			this.option = this.requestForm({
				dataType:requestOption,
				success:moduleOption
			});
			// module option
			this.moduleOption = {};
		} else {
			// request option setup
			this.option = this.requestForm(requestOption);
			// module option
			this.moduleOption = TOOBJECT(moduleOption,"debug");
		}
	});
	
	extendModule("Request","Open",{},function(url,requestOption,moduleOption){ 
		this._super(url,requestOption,moduleOption);
		this.send();
	});
	
	extendModule("Request","HTMLOpen",{
		send:function(){
			
			var requestFrame = CREATE("iframe",{src:this.url + (this.url.indexOf("?") > -1 ? "&token=" : "?token=") +_Util.base36Random(2),style:"display:none;"});
			
			var dummyRequstObject = {
				"readyState":4,
				"status":200,
				"responseText":""
			}
			
			_Meta(dummyRequstObject).setProp("requestParam",{});
			
			var _ = this;
			
			requestFrame.onload = function(){
				dummyRequstObject.responseText = Array.prototype.slice.call(IFRAMEDOCUMENT(requestFrame).body.children);
				_.onStateChangeWithRequest(dummyRequstObject);
			}
			requestFrame.onerror = function(){
				dummyRequstObject["readyState"] = 4;
				dummyRequstObject["status"] = 404;
				_.onStateChangeWithRequest(dummyRequstObject);
			}
			
			ELAPPEND(document.body,requestFrame);
		}
	},function(url,success,error){
		this._super(url,{
			"success":success,
			"error":error,
			"dataType":"html"
		});
		this.send();
	});
	
	makeModule("LoadContainerBase",{
		"+_ActiveController":undefined,
		getActiveController:function(){ return this._ActiveController; },
		_setEvent:function(eventType,eventName,method){
			var _ = this;
			DATAEACH(eventName,function(eventName){
				if(eventName == "!global"){
					if(typeof method === "function") _.LoadContainerBaseEvents[eventType] = method;
				} else {
					if((typeof eventName === "string") && (typeof method === "function")) 
					return  _.LoadContainerBaseEvents[eventType][eventName] = method;
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
		getActiveContainerName:function(){
			return this.ContainerActiveKeys.join(" ");
		},
		getActiveContainerURL:function(){
			return this.Source[this.ContainerActiveKeys.last()];
		},
		_triggingActiveEvents:function(container,activeName,containerEvent,userArgs){
			// 로드가 완료되었을때
			if( containerEvent.match("load")) {
				APPLY(this.LoadContainerBaseEvents.AnyLoadEvent,container,userArgs);
				APPLY(this.LoadContainerBaseEvents.ContainerLoadEvents[activeName],container,userArgs);
			}
			if( containerEvent.match("active")) {
				APPLY(this.LoadContainerBaseEvents.AnyActiveEvent,container,userArgs);
				APPLY(this.LoadContainerBaseEvents.ContainerOpenEvents[activeName],container,userArgs);
			}
		},
		_triggingInactiveEvents:function(container,inactiveName){
			APPLY(this.LoadContainerBaseEvents.AnyInactiveEvent,container);
			APPLY(this.LoadContainerBaseEvents.ContainerInactiveEvents[inactiveName],container);
		},
		loadHTML:function(loadKey,loadPath,success,error){
			var _ = this;
			
			//함수일때
			if(typeof loadPath === "function") loadPath = loadPath(APPLY(loadPath,this));
			
			//ELEMENT(s) or URL
			switch(typeof loadPath){
				case "string":
					_Open(loadPath + (loadPath.indexOf("?") > -1 ? "&token=" : "?token=") + _Util.base36Random(2),{
						"dataType":"dom",
						"success":function(doms){
							_.saveContainerContents(doms,loadKey);
							CALL(success,_,loadKey,doms);
						},
						"error":function(){
							console.error("LoadContainerBase::URL링크에서 데이트럴 찾지 못했습니다"+loadPath);
							CALL(error,_,loadKey);
						}
					});
					break;
				case "object":
					//엘리먼트 배열로 들어올경우
					var doms = FIND(loadPath);
					if( doms.length < 1 ){
						console.error("LoadContainerBase::불러올 엘리먼트가 존재하지 않습니다."+loadPath);
						CALL(error,_,loadKey);
					} else {
						_.saveContainerContents(doms,loadKey);
						CALL(success,_,loadKey,doms);
					}
					break;
				default :
					console.log("LoadContainerBase::올바르지 않은 loadPath =>",loadPath,loadKey);
					CALL(error,_,loadKey);
					return false;
					break;
			}
			return true;
		},
		saveContainerContents:function(doms,key){
			if(typeof key === "string") { this.ContainerContents[key] = TOARRAY(doms); }
		},
		loadContainerContents:function(key){
			return this.ContainerContents[key];
		},
		removeContainer:function(key){
			delete Containers[key];
			return this;
		},
		addContainer:function(container,key){
			var findContainer = ZFIND(container);
			if(!findContainer) return console.warn(key,"의 컨테이너를 찾을 수 없습니다.");
			this.ContainerPlaceholder[key] = findContainer;
			return this;
		}
	},function(baseParam,setupMethod){
		this.Source = {};
		this.ContainerPlaceholder = {};
		this.ContainerContents    = {};
		this.ContainerActiveKeys  = new AArray();
		
		// 로드될때 이벤트입니다.
		this.LoadContainerBaseEvents = {
			"AnyLoadEvent":undefined,
			"AnyActiveEvent":undefined,
			"AnyInactiveEvent":undefined,
			"ContainerLoadEvents":{},
			"ContainerOpenEvents":{},
			"ContainerInactiveEvents":{}
		};
		
		CALL(setupMethod,this);
		
		switch(typeof baseParam){
			case "object":
				EXTEND(this.Source,baseParam);
				break;
			case "function":
				var _                    = this;
				var initActiveController = function(){ _._ActiveController = APPLY(_ActiveController,undefined,arguments); return _._ActiveController; }
				var baseFunctionResult   = baseParam.call(this,initActiveController,this);
				if(typeof baseFunctionResult === "object") EXTEND(this.Source,baseFunctionResult);
				break;
		}
	});
	
	makeGetter("ELSCRIPTSTART",function(container){
		FIND("script",container,DATAEACH,function(scriptNode){
			var script = scriptNode.innerHTML;
			try {
				eval.call(script);
			} catch(e) {
				console.error("다음의 스크립트 구문 오류로 스크립트 실행이 정지되었습니다. => ",MAX(script,200));
				throw e;
			}
		});
	});
	
	extendModule("LoadContainerBase","ContainersController",{
		loadWithProperty:function(loadset,success){
			//lo
			if(typeof loadset !== "object") return console.error("loadAll이 중지되었습니다.");
			var _ = this;
			var successFire = new Fire(PROPLENGTH(loadset),function(){ CALL(success,_); });
			PROPEACH(loadset,function(loadPath,loadKey){
				var placeholder = _.ContainerPlaceholder[loadKey];
				if(!placeholder) {
					successFire.touch();
					return console.error("미리 정의되어있지 않은 플레이스 홀드키가 존재함 =>",loadKey);
				}
				_.loadHTML(loadKey,loadPath,function(key,doms){
					_.Source[loadKey] = _.Source[loadPath];
					ELAPPEND(placeholder,doms);
					ELSCRIPTSTART(placeholder);
					_._triggingActiveEvents(placeholder,key,"load");
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
			var loadArguments = Array.prototype.slice.call(this);
			loadArguments.shift();
			this._triggingActiveEvents(this.ContainerPlaceholder[name],name,"active",loadArguments);
			this.ContainerActiveKeys.push(name);
		},
		inactive:function(name){
			if( this.ContainerActiveKeys.has(name)) {
				this.ContainerActiveKeys.remove(name);
				this._triggingInactiveEvents(this.ContainerPlaceholder[name],name);
			}
		},
		inactiveAll:function(){
			var _ = this;
			this.ContainerActiveKeys.each(function(name){
				this._triggingInactiveEvents(this.ContainerPlaceholder[name],name);
			});
			this.ContainerActiveKeys.clear();
		}
	},function(containers,baseParam){
		//컨테이너 추가;	
		var _ = this;
		this._super(baseParam,function(){
			PROPEACH(containers,function(container,key){ 
				_.addContainer(container,key); 
			});
			this.multiActive = false;
		});
	});
	
	extendModule("LoadContainerBase","NavigationController",{
		_inactiveActivatedContents:function(removeInPlaceholder){
			var _ = this;
			this.ContainerActiveKeys.each(function(activatedKey){
				_.saveContainerContents(_.ContainerPlaceholder[activatedKey].children,activatedKey);
				_._triggingInactiveEvents(_.ContainerPlaceholder[activatedKey],activatedKey);
				if(removeInPlaceholder) _.ContainerPlaceholder[activatedKey].innerHTML = "";
			});
			this.ContainerActiveKeys.clear();
		},
		//무조건 새로 불러옴
		load:function(loadKey){
			if(loadKey in this.Source){
				var _             = this;
				var loadArguments = Array.prototype.slice.call(arguments,undefined,1);
				
				//이전 컨테이너를 Inactive한다고 통보
				this._inactiveActivatedContents(true);
				
				return this.loadHTML(loadKey,this.Source[loadKey],function(key,doms){
					ELAPPEND(_.ContainerPlaceholder[key],doms);
					ELSCRIPTSTART(_.ContainerPlaceholder[key]);
					_.ContainerActiveKeys.push(key);
					_._triggingActiveEvents(_.ContainerPlaceholder[key],key,"load active",loadArguments);
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
			
			ELAPPEND( this.ContainerPlaceholder[loadKey], loadedHTMLContents );
			this.ContainerActiveKeys.push(loadKey);
			this._triggingActiveEvents(this.ContainerPlaceholder[loadKey],loadKey,"active",openArguments);
			return true;
		},
		// 현재 열려있는 페이지를 강제적으로 링크파라메터로 불러옴
		link: function (linkText){
			loadHTML(linkText,undefined,function(key,doms){
				var placeholder = this.ContainerPlaceholder[this.ContainerActiveKeys.last()];
				placeholder.innerHTML = "";
				ELAPPEND(placeholder,doms);
			});
		}
	},function(container,baseParam){
		// context    => 컨텐츠를 채울 곳
		// navs       => object: key value로 해당이 호출되면 context에 내용이 체워짐
		//소스셋팅
		var _container = ZFIND(container),_ = this;
		if (_container){
			this._super(baseParam,function(){
				//defaultContainer를 보존합니다.
				var dcf = "defaultContainer";
				this.addContainer(_container,dcf);
				this.saveContainerContents(_container.children,dcf);
				this.ContainerActiveKeys.push(dcf);
			});
			//다른컨테이너도 플레이스 홀더 설정을 합니다.
			PROPEACH(this.Source,function(value,key){ _.addContainer(_container,key); });
		} else {
			console.error("NavigationController::해당 컨테이너를 찾을수 없습니다. Navigation Controller의 작동을 완전히 중지합니다.=> ",container);
		}
	});
	
	makeSingleton("DataContextNotificationCenter",{
		addObserver:function(controller){
			if(controller)this.notificationObservers.push(controller);
		},
		notification:function(methodName,params){
			DATAEACH(this.notificationObservers,function(observer){
				if (typeof observer[methodName] === "function"){
					observer[methodName].apply(observer,params);
				} else {
					console.warn("DataContextNotificationCenter",methodName," : 노티피케이션 api가 존재하지 않습니다. =>",observer);
				}
			});
		},
		managedDataNeedRerender:function(managedData){
			this.notification("nManagedDataNeedRerender",[managedData]);
		},
		managedDataChangePosition:function(leftID,rightID){
			this.notification("nManagedDataChangePosition",[leftID,rightID]);
		},
		removeManagedData:function(bindID){
			this.notification("nManagedDataRemove",[bindID]);
		},
		addChildData:function(bindID,newManagedData){
			this.notification("nManagedDataAppend",[bindID,newManagedData]);
		},
		managedDataBindEvent:function(bindID,key,value,sender){
			var wasEventLock = this.notificationBindEventLock;
			if(!this.notificationBindEventLock) {
				//바인드 이벤트가 끝날때까지 다른 바인드 이벤트를 거부합니다.
				this.notificationBindEventLock = true;
				this.notification("nManagedDataBindEvent",[bindID,key,value,sender]);
				this.notificationBindEventLock = wasEventLock;
			}
		},
		managedDataBindEventLock:function(flag){
			if(typeof flag === "boolean") this.notificationBindEventLock = flag
		}
	},function(){
		this.notificationObservers = new AArray();
		this.notificationBindEventLock = false;
	});
	
	makeModule("DataContext",{
		// 배열로된 패스를 반환한다.
		// path rule
		// root   = "","/"=> [/]
		// child  = "/3"  => [/,3]
		// childs = "/*"  => [/,*]
		_clearPath:function(path){
			if (ISARRAY(path)) {
				return path;
			} else if((typeof path) === "string"){
				path = path.trim();
				path = path.indexOf("/") == 0 ? path.substr(1) : path;
				path = this.ID + "/" + path;
			} else {
				throw new Error("DataContext::_clearPath::1:Invaild path => "+path);
			}
			
			var result    = new AArray();
			var splitPath = path.split("/");
			
			DATAEACH(splitPath,function(keyPath){
				var numberMatch = keyPath.match(/\d/g);
				if(numberMatch != null) {
					if(numberMatch.join("") == keyPath){
						result.push( parseInt(keyPath) );
						return;
					}
				}
				result.push( keyPath );
			});
			
			result.remove("");
			return result;
		},
		// 글자로된 패스를 반환한다.
		_clearStringPath:function(path){
			var result = this._clearPath(path);
			if (ISARRAY(result)) {
				//substr // -> /
				return result.join("/");
			}
		},
		_clearData:function(data){
			var data = CLONE(data);
			if( (typeof data) === "object" ) {
				if(ISARRAY(data)) {
					return {};
				} else {
					return new AObject(data).remove(this.SourceChildrenKey).get();
				}
			}
		},
		_childrenData:function(data){
			if( typeof data === "object" ) {
				if(ISARRAY(data)) {
					return CLONE(data);
				} else {
					var childKeyData = data[this.SourceChildrenKey];
					if(typeof childKeyData === "object"){
						if(ISARRAY(childKeyData)) {
							return CLONE(childKeyData);
						} else {
							return [CLONE(childKeyData)];
						}
					}
				}
			}
		},
		// path로 해당 위치의 데이터를 반환해줍니다.
		getFullDataWithPath:function(path){
			var path = this._clearPath(path);
			if (ISARRAY(path)) {
				var pathMake   = "";
				var selectData = [this.Source];
				var owner = this;
				
				DATAEACH(path,function(pathKey){
					
					if (typeof pathKey === "string") {
						switch(pathKey){
							case "/": case owner.ID:
								// 아무것도 하지 않음
								break;
							case "*":
								selectData = new AArray(selectData).getMap(function(data){
									if (ISARRAY(data)){
										return data;
									} else {
										return owner.Source[owner.SourceChildrenKey];
									}
								}).flatten().remove(undefined);
								break;
						}
					} else if(typeof pathKey === "number") {
						selectData = new AArray(selectData).getMap(function(data){
							if (ISARRAY(data)){
								return data[pathKey];
							} else {
								var sourceChildren = data[owner.SourceChildrenKey];
								if(ISARRAY(sourceChildren)){
									return sourceChildren[pathKey];
								}
							}
						}).remove(undefined);
					}
				});
				
				return selectData;
			}
		},
		
		//자식연쇄 메니지드 데이터를 준비합니다.
		feedDownManagedDataMake:function(data,parent){
			
			if( typeof data === "object" ){
				
				var makeManagedData = ISARRAY(data) ? new ManagedData(this,this._clearData(data),"array") : new ManagedData(this,this._clearData(data),"object");
				
				var childDatas = this._childrenData(data);
				var childrens  = [];
				var owner      = this;
				if(ISARRAY(childDatas)){
					DATAEACH(childDatas,function(childData){
						var child = owner.feedDownManagedDataMake(childData,makeManagedData);
						if(child) childrens.push(child);
					});
				}
				if(typeof parent === "object") parent.appendChild(makeManagedData);
				
				return makeManagedData;
			} else {
				console.warn("data초기 값은 반드시 object타입이여야 합니다.");
			}
			
		},
		
		//managedData를 string이나 오브젝트로 뽑아넴
		trace:function(mdata){
			var owner = this;
			if (!mdata) mdata = this.RootManagedData;
			var ra = mdata.SourceType == "array";
			var rs = ra ? "[" : "{";
			var re = ra ? "]" : "}";
			var prop = [];
			for(var key in mdata.Source) prop.push( '\"' + key + '\":\"' + mdata.Source[key] + '\"' );
			if(mdata.Childrens.length > 0) prop.push( 
				(ra ? '' : '\"'+this.SourceChildrenKey + '\":[' ) + 
				mdata.Childrens.getMap( function(managedData){ return owner.trace(managedData); } ).join(", ") + 
				(ra ? "" : "]")
			);
			return rs + prop.join(", ") + re;
		},
		getJSONString:function(){ return this.trace(); },
		getJSONObject:function(){ return JSON.parse(this.getJSONString()); },
		
		// path로 메니지드 데이터를 얻습니다.
		getManagedData:function(path,withChildren){
			
			if (path.indexOf("/") == 0) path = this.ID + path;
			var paths = path.split("/");
			var thisID = this.ID;
			var thisRoot = this.RootManagedData;
			
			var selectedManagedData;
			
			DATAEACH(paths,function(path){
				if(thisID == path) {
					selectedManagedData = thisRoot;
				} else {
					selectedManagedData = selectedManagedData.Childrens[parseInt(path)];
				}
			});
			
			return selectedManagedData;
		},
		getManagedDataWithOffset:function(path,offset){
			var value = /(.*)\/([\d]+)$/.exec(path);
			if(value === null)console.error("getNextManagedData 에러",path);return;
			var nextManagedData = this.getManagedData(value[1]+"/"+(parseInt(value[2])+offset));
			if(ISARRAY(nextManagedData)) nextManagedData = nextManagedData[0];
			return nextManagedData;
		},
		getRootManagedData:function(){
			return this.RootManagedData;
		}
	},function(source,childrenKey){
		this.ID                = _Util.base36UniqueRandom(5);
		this.Source            = TOOBJECT(source,"value");
		this.SourceChildrenKey = childrenKey || "array";
		// 데이터 안의 모든 Managed data를 생성하여 메타안에 집어넣음
		this.RootManagedData = this.feedDownManagedDataMake(this.Source,"root");
	});
	
	makeModule("ViewModel",{
		needRenderView:function(depth,managedData,feedViews,viewController){
			if (ISTYPE(this.Source[depth],"Template") == true) {
				return managedData.configWithTemplate(this.Source[depth]);
			} else if (typeof this.Source[depth] === "function") {
				var renderResult = this.Source[depth].call(managedData,managedData,feedViews);
				if(ISELNODE(renderResult)){
					return renderResult;
				} else {
					console.warn("경고::ViewModel의 렌더값이 올바르지 않습니다. =>",renderResult, this.Source[depth]);
				}
			} else {
				console.warn("경고::",depth,"depth의 ViewModel뷰모델의 렌더값이 입력되지 않았습니다.",this.Source[depth]);
			}
			return MAKE("div",{html:TOSTRING(managedData.Source)},feedViews);
		},
		whenSelectItem:function(m)  { if(typeof m === "function") this.shouldSelectItem = m; },
		whenDeselectItem:function(m){ if(typeof m === "function") this.shouldDeselectItem = m; },
		whenSelectToggle:function(se,de){ this.whenSelectItem(se); this.whenDeselectItem(de); },
		"+shouldSelectItem"  :function(node,depth){ ELSTYLE(node,"background","#dae8f2"); },
		"+shouldDeselectItem":function(node,depth){ ELSTYLE(node,"background","none") }
	},function(renderDepth){
		//tempate 타겟을 설정
		this.Source = new AArray(Array.prototype.slice.call(arguments)).getMap(function(a){ 
			if(typeof a === "string"){
				var findTemplate = ZFIND(a);
				return _Template(findTemplate,undefined,false);
			}
			return a; 
		});
	});
	
	makeModule("ManagedData",{
		//노드구조
		appendChild:function(childrens){
			var parent = this;
			DATAEACH(childrens,function(child){
				parent.Childrens.push(child);
				child.Parent = parent;
			});
		},
		removeFromParent:function(){
			if(this.Parent){
				this.Parent.Childrens.remove(this);
				this.Parent = undefined;
			}
		},
		removeChildren:function(childrens){
			var owner = this;
			DATAEACH(childrens,function(child){
				var index = owner.Childrens.indexOf(child);
				var select = owner.Childrens[index];
				if (select) {
					select.removeFromParent();
				}
			});
		},
		//현재부터 자식으로 
		feedDownManagedData:function(method,param){
			var newParam = method.call(this,param);
			this.Childrens.each(function(child){ child.feedDownManagedData(method,newParam); });
			return this;
		},
		feedUpManageData:function(method,depth){
			// 돌리는 depth
			var depth = depth ? depth : 0;
			//데이타 얻기
			var mangedDatas = this.Childrens;
			
			depth++;
			DATAEACH(mangedDatas,function(child){ child.feedUpManageData(method,depth); });
			method(this,depth-1);
			return this;
		},
		chainUpMangedData:function(method){
			if(typeof method === "function"){
				method.call(this);
				if( this.Parent ) this.Parent.chainUpMangedData(method);
			}
		},
		hasData:function(key){ return (key in this.Source); },
		data:function(key,value,sender){
			// Read
			if( arguments.length == 0) return CLONE(this.Source);
			if( arguments.length == 1) return this.Source[key];
			// Write
			this.Source[key] = value;
			DataContextNotificationCenter.managedDataBindEvent(this.BindID,key,value,sender);
			return this;
		},
		removeData:function(key,sender){
			if(key in this.Source){
				delete this.Source[key];
				DataContextNotificationCenter.managedDataBindEvent(this.BindID,key,"",sender);
			}
		},
		text:function(key){
			return MAKETEXT( this.data.apply(this,arguments) )
		},
		bind:function(dataKey,bindElement,optional){
			if(this.scope) {
				//엘리먼트 기본설정값
				var element = ISELNODE(bindElement) ? bindElement : typeof bindElement === "undefined" ? CREATE("input!"+bindElement) : CREATE(bindElement);
				//optional은 기존에 실제 존재하였는지 확인하여 입력
				this.scope.addBindNode(element,this,dataKey,!this.hasData(dataKey));
				return element;
			} else {
				console.warn("view컨트롤러 스코프 내에서만 bind를 사용할수 있습니다.");
			}
		},
		hidden:function(dataName){
			return this.bind(dataName,"hidden!"+dataName);
		},
		action:function(actionName,actionElement,arg){
			if(this.scope){
				var element = ISELNODE(actionElement) ? actionElement : CREATE(actionElement);
				this.scope.addActionNode(actionName,element,this,arg)
				return element;
			} else {
				console.warn("view컨트롤러 스코프 내에서만 action을 사용할수 있습니다.");
			}
		},
		placeholder:function(tagname){
			if(this.scope){
				var placeholderElement = ISELNODE(tagname) ? tagname : CREATE(tagname);
				this.scope.addPlaceholderNode(this.BindID,placeholderElement);
				return placeholderElement;
			}
		},
		configWithTemplate:function(_template){
			var _ = this;
			var templateNode = _template.clone().selectFirst();
			
			if(templateNode.isEmpty()) console.error("configWithTemplate :: 렌더링할 template를 찾을수 없습니다");
			
			templateNode.partialAttr("data",function(dataKey,node){
				ELVALUE(node,dataKey,_.data(dataKey));
			});
			templateNode.partialAttr("data-bind",function(dataKey,node){
				_.bind(dataKey,node)
			});
			templateNode.partialAttr("data-action",function(dataKey,node){
				var dataParam = node.getAttribute("data-param");
				_.action(dataKey,node,TOOBJECT(dataParam,"value"));
				if("data-param" in node.attributes) node.removeAttribute("data-param");;	
			});
			templateNode.partialAttr("data-placeholder",function(dataKey,node){
				_.placeholder(node);
			});
			
			return templateNode.zero();
		},
		revertData:function(){
			this.context.getDataWithPath(this.path);
		},
		getPath:function(){
			var path = new AArray();
			this.chainUpMangedData(function(){ path.push( this.Parent ? this.Parent.Childrens.indexOf(this) : this.context.ID); });
			return path.reverse().join("/");
		},
		getDepth:function(){
			var depth = 0;
			this.feedUpManageData(function(m,d){ if (depth < (d + 1)) depth = (d + 1); });
			return depth;
		},
		getLevel:function(){
			var level = 0;
			this.chainUpMangedData(function(){ this.Parent ? level++ : undefined; });
			return level;
		},
		getIndex:function(){
			return this.Parent.Childrens.indexOf(this);
		},
		getContextID:function(){
			return this.context.ID;
		},
		findById:function(id){
			if(this.BindID == id){
				return this;
			} else {
				var findID;
				this.Childrens.each(function(child){
					findID = child.findById(id);
					if(findID) return false;
				});
				return findID;
			}
		},
		//뷰컨트롤러와 함께 바인딩되는 메서드들입니다.
		//렌더시 다음 아래의 메서드들은 절대 호출하면 안됩니다.
		//지정한 인덱스로
		rerender:function(){
			DataContextNotificationCenter.managedDataNeedRerender(this);
		},
		managedDataIndexExchange:function(changeTarget){
			if(changeTarget){
				var bindId1= this.BindID;
				var bindId2= changeTarget.BindID;
				var index1 = this.getIndex();
				var index2 = changeTarget.getIndex();
				this.Parent.Childrens.changeIndex(index1,index2);
				DataContextNotificationCenter.managedDataChangePosition(bindId1,bindId2);
				return true;
			}
			return false;
		},
		//상위 인덱스로
		managedDataIncrease:function(){
			var nextManagedData = this.Parent.Childrens[this.Parent.Childrens.indexOf(this)+1];
			if (nextManagedData) return this.managedDataIndexExchange(nextManagedData);
			return false;
		},
		//하위 인덱스로
		managedDataDecrease:function(){
			var prevManagedData = this.Parent.Childrens[this.Parent.Childrens.indexOf(this)-1];
			if (prevManagedData) return this.managedDataIndexExchange(prevManagedData);
			return false;
		},
		//현재 데이터를 제거함
		removeManagedData:function(){
			this.removeFromParent();
			DataContextNotificationCenter.removeManagedData(this.BindID);
		},
		//하위 데이터를 추가함
		addChildData:function(data){
			if(typeof data === "function") data = data();
			if(typeof data === "object") {
				this.context.feedDownManagedDataMake(data,this);
				DataContextNotificationCenter.addChildData(this.BindID,this.Childrens.getLast());
			} else {
				console.warn("addChildData :: append data가 들어오지 않았습니다", data);
			}
		},
		addMemberData:function(data){
			if(this.Parent) this.Parent.addChildData(data);
		}
	},function(context,initData,dataType){
		this.BindID     = _Util.base64UniqueRandom(8);
		this.context    = context;
		this.Source     = initData;
		this.SourceType = dataType || "object";
		//노드구조
		this.Childrens  = new AArray();
		this.Parent     = undefined;        
		//현재 컨트롤중인 뷰컨트롤입니다.
		this.scope      = undefined;
	});
	
	makeModule("DataContextViewController",{
		"+events":{
			"up":function(arg,el,vc){
				if(typeof arg === "function") {
					if( arg(this,element) != false ) this.managedDataDecrease();
				} else {
					this.managedDataDecrease();
				}
			},
			"down":function(arg,el,vc){
				if(typeof arg === "function") {
					if( arg(this,element) != false ) this.managedDataIncrease();
				} else {
					this.managedDataIncrease();
				}
			},
			"delete":function(arg,el,vc){
				this.removeManagedData();
			},
			"append":function(arg,el,vc){
				this.addChildData(arg);
			}
		},
		addActionEvent:function(name,method){
			if(typeof name === "string", typeof method === "function"){
				this.events[name] = method;
			}
		},
		//노티피케이션
		nManagedDataChangePosition:function(leftID,rightID){
			var leftNode    = this.structureNodes[leftID];
			var rightNode   = this.structureNodes[rightID];
			if(leftNode && rightNode){
				var leftHelper  = CREATE("div");
				var rightHelper = CREATE("div");
				ELBEFORE(leftNode,leftHelper);
				ELBEFORE(rightNode,rightHelper);
				ELBEFORE(leftHelper,rightNode);
				ELBEFORE(rightHelper,leftNode);
				ELREMOVE(leftHelper);
				ELREMOVE(rightHelper);
				//
				CALL(this.dataDidChange,this);
			}
		},
		nManagedDataRemove:function(bindID){
			if(this.structureNodes[bindID]){
				var owner = this;
				//바인드값 삭제
				var removeBindNodeTarget = new AArray();
				DATAEACH(this.bindValueNodes,function(bindNode){
					var hasNode = ZFIND(bindNode[2],owner.structureNodes[bindID])
					if(hasNode) removeBindNodeTarget.push(bindNode);
				});
				removeBindNodeTarget.each(function(bindNode){
					owner.bindValueNodes.remove(bindNode);
				});
				//스트럭쳐 노드 삭제
				ELREMOVE(this.structureNodes[bindID])
				delete this.structureNodes[bindID];
				//
				CALL(this.dataDidChange,this);
			}
			//
			if(this.placeholderNodes[bindID]) delete this.placeholderNodes[bindID];
		},
		nManagedDataNeedRerender:function(rerenderManagedData){
			//부모의 placehoder를 찾음
			var parentManData   = rerenderManagedData.Parent;
			if(parentManData) {
				//부모의 placeholder가 존재해야 작동함
				var parentPlaceHolder = this.placeholderNodes[parentManData.BindID];
				var beforeElement     = this.structureNodes[rerenderManagedData.BindID];
				var beforePlaceHolder = this.placeholderNodes[rerenderManagedData.BindID];
				if(parentPlaceHolder && beforePlaceHolder) {
					//바꿔치기 하기
					this.needDisplay(rerenderManagedData,parentPlaceHolder,true);
					ELBEFORE(beforeElement,this.structureNodes[rerenderManagedData.BindID]);
					ELAPPEND(this.placeholderNodes[rerenderManagedData.BindID],beforePlaceHolder.children);
					ELREMOVE(beforeElement);
					CALL(this.dataDidChange,this);
				} else {
					console.error("부모의 placeholder가 존재해야 rerender가 작동할수 있습니다.");
				}
			} else {
				this.needDisplay(rerenderManagedData);
				CALL(this.dataDidChange,this);
			}
		},
		nManagedDataAppend:function(bindID,newManagedData){
			if(this.placeholderNodes[bindID]) {
				this.needDisplay(newManagedData,this.placeholderNodes[bindID]);
				CALL(this.dataDidChange,this);
			}
		},
		nManagedDataBindEvent:function(bindID,key,value,sender){
			var acceptDidChange = false;
			DATAEACH(this.bindValueNodes,function(nodeData){
				if( (nodeData[0] == bindID) && (nodeData[1] == key) ) {
					acceptDidChange = true;
					if(nodeData[2] != sender) ELVALUE(nodeData[2],value);
				}
			});
			if(acceptDidChange == true ) CALL(this.dataDidChange,this);
		},
		addPlaceholderNode:function(bindID,placeholderNode){
			if( typeof bindID === "string" && ISELNODE(placeholderNode) ){
				this.placeholderNodes[bindID] = placeholderNode;
			}
		},
		addBindNode:function(element,managedData,dataKey,optinal){
			if( ISELNODE(element) ){
				//값을 입력
				ELVALUE( element, managedData.data(dataKey) );
				
				//바인드 값을 입력함
				this.bindValueNodes.push( [managedData.BindID,dataKey,element] );
				
				//이벤트를 등록합니다.
				switch(element.tagName.toLowerCase()){
					//write
					case "input" :
						ELON (element,"keyup",function(e) {
							setTimeout(function(){
								var value = ELVALUE(element);
								if( (optinal == true) && value == "" ) return managedData.removeData(dataKey,element);
								managedData.data(dataKey,value,element);
							},0);
						});
						break;
					case "select":
						ELON (element,"change",function(e){
							setTimeout(function(){
								var value = ELVALUE(element);
								if( (optinal == true) && value == "" ) return managedData.removeData(dataKey,element);
								managedData.data(dataKey,value,element);
							},0);
						});
						break;
					default : /*readOnly*/ break;
				}
			} else {
				console.warn("DataBehavior::bind::element를 바인딩할 수 없습니다. 지시자의 오류입니다. =>=>",bindEl,element);
			}
		},
		addActionNode:function(actionName,element,managedData,arg){
			var viewController = this;
			ELON(element,"click", function(){
				if (typeof viewController.events[actionName] === "function") {
					viewController.events[actionName].call(
						managedData,
						arg,
						element,
						viewController
					);
				} else {
					console.warn(actionName,"에 해당하는 이벤트가 없습니다.")
				}
			});
		},
		setManagedData:function(managedData){
			if(ISTYPE(managedData,"DataContext")) managedData = managedData.getRootManagedData();
			if(ISTYPE(managedData,"ManagedData")) {
				this.managedData = managedData;
				CALL(this.dataDidChange,this);
				return true;
			} 
			console.warn("setManagedData::managedData 오브젝트가 필요합니다. 들어온 값->", managedData);
			return false;
		},
		needDisplay:function(managedData,rootElement,sigleRenderMode){
			//기본적으로 존재하지 않는값을 경고해줌
			if(!this.managedData) console.warn("DataContextViewController:: Must need set ManagedData before needdisplay");
			if(!this.viewModel) console.warn("DataContextViewController:: Must need set ViewModel before needdisplay");
			//파라메터 두개가 존재하지 않으면 초기화 진행을 한다
			if( (!managedData) && (!rootElement) ){
				this.view.innerHTML= "";
				this.bindValueNodes = new AArray();
				this.structureNodes = {};
				this.placeholderNodes = {};
				this.selectIndexes  = new AArray();
			}
			managedData     = managedData || this.managedData;
			rootElement     = rootElement || this.view;
			var viewController = this;
			var feedCollection = ARRAYARRAY(this.managedData.getDepth());
			var lastFeed       = null;
			var topLevel       = this.managedData.getLevel();
			var startDepth     = managedData.getLevel();
			
			if (sigleRenderMode == true) {
				// 메니지드 데이터에 현재 스코프를 등록함
				managedData.scope = viewController;
				//slngleRenderMode의 관리는 매우 중요함 else문의 블럭과 동일하게 동작하도록 주의할것
				var renderResult = viewController.viewModel.needRenderView(startDepth-topLevel,managedData,[],viewController);
				// 루트에 추가함
				rootElement.appendChild(renderResult);
				// 그린내역을 기록함
				if(ISELNODE(renderResult) || ISTEXTNODE(renderResult)) viewController.structureNodes[managedData.BindID] = renderResult;
				// 현재 스코프를 지움
				managedData.scope = undefined;
			} else {
				managedData.feedUpManageData(function(managedData,depth){
					// 마지막 피드가 존재하지 않으면 depth값을 초기화함
					if (lastFeed == null) lastFeed = depth;
				
					// 메니지드 데이터에 현재 스코프를 등록함
					managedData.scope = viewController;
				
					var renderResult;
				
					if (depth == startDepth) {
						// 최상위 렌더링
						renderResult = viewController.viewModel.needRenderView(depth-topLevel,managedData,feedCollection[depth+1],viewController);
						//루트에 추가
						rootElement.appendChild(renderResult);
						//컨테이너에 추가
						if( viewController.placeholderNodes[managedData.BindID] ) ELAPPEND(viewController.placeholderNodes[managedData.BindID],feedCollection[depth+1]);
						feedCollection[depth+1] = [];
					} else if (depth < lastFeed) {
						// 렌더 피드가 올라감
						var renderResult = viewController.viewModel.needRenderView(depth-topLevel,managedData,feedCollection[lastFeed],viewController);
						//컨테이너에 추가
						if( viewController.placeholderNodes[managedData.BindID] ){ 
							ELAPPEND(viewController.placeholderNodes[managedData.BindID],feedCollection[lastFeed])
						};
						//피드 초기화
						feedCollection[lastFeed] = [];
						feedCollection[depth].push(renderResult);
					} else {
						// 최하위 피드모음
						// 렌더 피드가 내려감
						var renderResult = viewController.viewModel.needRenderView(depth-topLevel,managedData,[],viewController);
						feedCollection[depth].push(renderResult);
					}
					// 마지막 피드 depth를 기록함
					lastFeed = depth;
				
					// 그린내역을 기록함
					if(ISELNODE(renderResult) || ISTEXTNODE(renderResult)) viewController.structureNodes[managedData.BindID] = renderResult;
				
					// 현재 스코프를 지움
					managedData.scope = undefined;
					
				},startDepth);
			}
			
			
		},
		needDisplayWithViewModel:function(newViewModel){
			this.viewModel = newViewModel;
			this.needDisplay();
		},
		needDisplayWithData:function(data){
			this.setManagedData(data) ? this.needDisplay() : console.warn("데이터를 초기화하는데 실패하였습니다. 데이터의 형식이 잘못되었습니다.",data);
		},
		needSelectable:function(allowMultiSelect){
			if(allowMultiSelect == true) this.allowMultiSelect = true;
			if(this.allowSelectable == false){
				this.allowSelectable = true;
				var owner = this;
				ELON(this.view,"click",function(e){
					var targetMangedData = owner.managedData.Childrens;
					var targetNodes      = targetMangedData.clone().map(function(managedData){ return owner.structureNodes[managedData.BindID]; });
					targetNodes.each(function(node,index){
						if(e.target == node){
							owner.triggingSelectItems(targetMangedData[index]);
							return false;
						} else if(ZFIND(e.target,node)) {
							owner.triggingSelectItems(targetMangedData[index]);
							return false;
						}
					});
				});
			}
		},
		deselectAll:function(eventBlocking){
			var owner = this;
			if(this.selectIndexes.length > 0){
				if(this.viewModel){
					this.selectIndexes.each(function(managedData){	
						CALL(owner.viewModel.shouldDeselectItem,owner.structureNodes[managedData.BindID],owner.structureNodes[managedData.BindID],1);
					});
				}
				this.selectIndexes.clear();
				if(eventBlocking != true) CALL(this.selectItemDidChange,this,this.selectIndexes);
			}
		},
		triggingSelectItems:function(managedData){
			if(this.allowMultiSelect == true){
				if(this.selectIndexes.has(managedData)){
					this.selectIndexes.remove(managedData);
					if(this.viewModel) CALL(this.viewModel.shouldDeselectItem,this.structureNodes[managedData.BindID],this.structureNodes[managedData.BindID],1);
					CALL(this.selectItemDidChange,this,this.selectIndexes);
				} else {
					this.selectIndexes.push(managedData);
					if(this.viewModel) CALL(this.viewModel.shouldSelectItem,this.structureNodes[managedData.BindID],this.structureNodes[managedData.BindID],1);
					CALL(this.selectItemDidChange,this,this.selectIndexes);
				}
			} else {
				if(this.selectIndexes.length == 1 && this.selectIndexes.has(managedData)){
					this.deselectAll();
				} else {
					this.deselectAll(true);
					this.selectIndexes.push(managedData)
					if(this.viewModel) CALL(this.viewModel.shouldSelectItem,this.structureNodes[managedData.BindID],this.structureNodes[managedData.BindID],1);
					CALL(this.selectItemDidChange,this,this.selectIndexes);
				}
			}
		},
		getSelectableManagedItem:function(){
			return CLONE(this.selectIndexes);
		},
		//이벤트
		whenItemDidChange:function(m){ if((typeof m === "function") || m == undefined) this.selectItemDidChange = m; },
		whenDataDidChange:function(m){ if((typeof m === "function") || m == undefined) this.dataDidChange = m; },
		"+selectItemDidChange":undefined,
		"+dataDidChange":undefined
	},function(view,managedData,viewModel){
		this.view          = ZFIND(view);
		if(managedData)this.setManagedData(managedData);
		this.viewModel     = viewModel || new ViewModel();
		//선택관련 인자
		this.allowSelectable  = false;
		this.allowMultiSelect = false;
		
		//바인딩 관련 인자
		this.bindValueNodes = [];
		this.structureNodes = {};
		this.placeholderNodes = {};
		this.selectIndexes  = new AArray();
		DataContextNotificationCenter.addObserver(this);
	});
	
	makeModule("Finger",{
		getPinchDistance:function(fx1,fy1,fx2,fy2){
			return Math.sqrt(
				Math.pow((fx1-fx2),2),
				Math.pow((fy1-fy2),2)
			)
		},
		setAllowVirtureFinger:function(flag){
			if(!this.AllowVirtureFinger && flag) {
				this.AllowVirtureFinger = true;
				var wasStart = false;
				var source = this.Source;
				ELON(source,"mousedown",function(e){
					wasStart = true;
					e.preventDefault();
					ELTRIGGER(source,"touchstart",{touches:[{pageX:e.pageX,pageY:e.pageY}]});
				})
				ELON(source,"mousemove",function(e){
					if(wasStart) {
						e.preventDefault();
						ELTRIGGER(source,"touchmove",{touches:[{pageX:e.pageX,pageY:e.pageY}]});
					}
				});
				ELON(source,"mouseup",function(e){
					wasStart = false;
					e.preventDefault();
					ELTRIGGER(source,"touchend",{touches:[{pageX:e.pageX,pageY:e.pageY}]});
				});
				ELON(source,"mouseout",function(e){
					if(e.target == e.currentTarget) {
						wasStart = false;
						e.preventDefault();
						ELTRIGGER(source,"touchend",{touches:[{pageX:e.pageX,pageY:e.pageY}]});
					}
				});
			}
		},
		applyTouchEvent:function(flag){
			if(typeof flag !== "boolean") return;
			if(typeof this._applyTouchEvent === "undefined") {
				var _ = this;
				this._currentTouchStartEvent = function(e){
					e.stopPropagation();

					if (_.GestureListener["touchMove"] && (e.touches.length === 1)) {
						_.StartTouchMoveX = e.touches[0].pageX;
						_.StartTouchMoveY = e.touches[0].pageY;
					}
					if (_.GestureListener["touchStart"] && (e.touches.length === 1)) {
						CALL(_.GestureListener["touchStart"],_.Source,e.touches[0].pageX,e.touches[0].pageY,e);
					}
					if (_.GestureListener["pinch"] && (e.touches.length === 2)) {
						_.StartPinchValue = _.getPinchDistance(
							 e.touches[0].pageX,
							 e.touches[0].pageY,
							 e.touches[1].pageX,
							 e.touches[1].pageY
						);
						CALL(_.GestureListener["pinchStart"],_.Source,e);
					}
				};
				this._currentTouchMoveEvent = function(e){
					
					//1 _
					if (_.GestureListener["touchMove"] && (e.touches.length === 1)) {
						var moveX = e.touches[0].pageX - _.StartTouchMoveX;
						var moveY = e.touches[0].pageY - _.StartTouchMoveY;
						_.StartTouchMoveX = e.touches[0].pageX;
						_.StartTouchMoveY = e.touches[0].pageY;
						
						//CALL(_.GestureListener["touchMove"],_.Source,moveX,moveY,e);
						if(CALL(_.GestureListener["touchMove"],_.Source,moveX,moveY,e) !== false){
							e.stopPropagation();
							e.preventDefault();
						} else {
							_._currentTouchStartEvent(e);
						}
					}
					//2 _
					if(_.GestureListener["pinch"] && _.StartPinchValue && (e.touches.length === 2)){
						var currentDistance = _.getPinchDistance(
							 e.touches[0].pageX,
							 e.touches[0].pageY,
							 e.touches[1].pageX,
							 e.touches[1].pageY
						);
						CALL(_.GestureListener["pinch"],_.Source,-((_.StartPinchValue / currentDistance) - 1))
						e.stopPropagation();
						e.preventDefault();
					}
					
				};
				this._currentTouchEndEvent = function(e){
					e.stopPropagation();
					_.StartTouchMoveX = undefined;
					_.StartTouchMoveY = undefined;
					_.StartPinchValue = undefined;
					CALL(_.GestureListener["touchEnd"],e);
				};
				
				this._applyTouchEvent = false;
			} 
			
			if(this._applyTouchEvent !== flag) {
				if(flag){
					ELON(this.Source,"touchstart",this._currentTouchStartEvent);
					ELON(this.Source,"touchmove",this._currentTouchMoveEvent);
					ELON(this.Source,"touchend",this._currentTouchEndEvent);
				} else {
					ELOFF(this.Source,"touchstart",this._currentTouchStartEvent);
					ELOFF(this.Source,"touchmove",this._currentTouchMoveEvent);
					ELOFF(this.Source,"touchend",this._currentTouchEndEvent);
				}
				this._applyTouchEvent = flag;
			}
		},
		whenPinchStart:function(method){ this.GestureListener["pinchStart"] = method; },
		whenPinch:function(method){ this.GestureListener["pinch"] = method; },
		whenTouchStart:function(method){ this.GestureListener["touchStart"] = method; },
		whenTouchBegin:function(method){ this.GestureListener["touchBegin"] = method; },
		whenTouchMove:function(method){ this.GestureListener["touchMove"] = method; },
		whenTouchEnd:function(method){ this.GestureListener["touchEnd"] = method; }
	},function(gestureView){
		this.Source = ZFIND(gestureView);
		this.GestureListener = {};
		this.StartPinchValue;
		this.StartTouchMoveX;
		this.StartTouchMoveY;
		var finger = this;
		
		if(this.Source) this.applyTouchEvent(true);
	});
	
	makeModule("ScrollBox",{
		needScrollingOffsetX:function(offset){
			if(!this.allowScrollX || offset == 0) return false;
			var needTo = this.Source.scrollLeft + (-offset);
			if (needTo < 0) { needTo = 0; }
			if (needTo > this.Source.scrollWidth) needTo = this.Source.scrollWidth;
			if (this.Source.scrollLeft != needTo) {
				this.Source.scrollLeft = needTo;
				return true;
			}  else {
				return false;
			}
		},
		needScrollingOffsetY:function(offset){
			if(!this.allowScrollY || offset == 0) return false;
			
			var needTo = this.Source.scrollTop + (-offset);

			if (needTo < 0) {
				this.needNegativeDrawItem();
				
				needTo = this.Source.scrollTop + (-offset);
				if(needTo < 0) needTo = 0;
			}
			if (needTo > this.Source.scrollHeight - this.Source.offsetHeight){
				this.needPositiveDrawItem();
				
				if(needTo > this.Source.scrollHeight){
					needTo = this.Source.scrollHeight;
				} 
			}
			if (this.Source.scrollTop !== needTo) {
				this.Source.scrollTop = needTo;
				return true;
			}
			return false;
		},
		// var _drawAxisYItem
		drawAxisYItem:function(rend){
			this._drawAxisYItem = rend;
		},
		// true == infinite
		setAllowMakeAxisYItem:function(positive,negative){
			if (typeof positive === "boolean") {
				this.axisYPositiveLength = positive ? 100 : 0;
			} else if(typeof positive === "number") {
				this.axisYPositiveLength = positive;
			}
			
			if (typeof negative === "boolean") {
				this.axisYNegativeLength = negative ? 100 : 0;
			} else if(typeof negative === "number") {
				this.axisYNegativeLength = negative;
			}
			this.needPositiveDrawItem();
		},
		needPositiveDrawItem:function(){
			if(typeof this._drawAxisYItem === "function"){
				for(var i=this.axisYPositiveItems.length,l=this.axisYPositiveLength;i<l;i++){
					var node = this._drawAxisYItem(i);
					
					if( ISELNODE(node) ) {
						this.axisYPositiveItems.push(node);
						ELAPPEND(this.ClipView,node);
						//정지할지 확인
						if(this.Source.offsetHeight < (this.ClipView.offsetHeight - this.Source.offsetTop)) break;
					} else {
						console.warn("needPositiveDrawItem::렌더링 에러 더이상 드로잉 할수 없습니다.");
					}
				}
			}
		},
		needNegativeDrawItem:function(){
			if(typeof this._drawAxisYItem === "function"){
				if(this.axisYNegativeItems.length < this.axisYNegativeLength){
					var i = ((this.axisYNegativeItems.length * -1) -1);
					var node = this._drawAxisYItem(i);
					if( ISELNODE(node) ) {
						this.axisYNegativeItems.push(node);
						ELPREPEND(this.ClipView,node);
						this.Source.scrollTop = this.Source.scrollTop + node.offsetHeight;
					} else {
						return console.warn("drawAxisYItem의 값이 잘못되었습니다 노드를 반환해주세요",node);
					}
				}
			}
		},
		restUp:function(){
			return this.Source.scrollTop;
		},
		restDown:function(){
			return this.Source.scrollHeight - this.Source.offsetHeight - this.Source.scrollTop;
		},
		restYSpace:function(){
			var u = this.Source.scrollTop , d = (this.Source.scrollHeight - this.Source.offsetHeight - this.Source.scrollTop);	
			return (u < d)?u:d;
		},
		setAllowVirtureFinger:function(flag){ this.Finger.setAllowVirtureFinger(true); },
		//scroll event
		whenScroll            :function(e){ this.ScrollEvent.Scroll = e; },
		applyScrollEvent:function(flag){
			if(typeof flag !== "boolean") return;
			
			if(typeof this._applyScrollEvent === "undefined") {
				var _ = this;
				if(!this._currentMouseWheelEvent) {
					this._currentMouseWheelEvent = function(e){
						if(e.wheelDeltaY) {
							if( (e.wheelDeltaY !== 0) && (_.needScrollingOffsetY(e.wheelDeltaY/3) == true) && (_.restYSpace() !== 0) ) {
								e.stopPropagation();
								e.preventDefault();
							}
							if( (e.wheelDeltaX !== 0) && (_.needScrollingOffsetX(e.wheelDeltaX/3) == true) ) {
								e.stopPropagation();
								e.preventDefault();
							}
						} else if(e.wheelDelta) {
							if( (e.wheelDelta !== 0) && (_.needScrollingOffsetY(e.wheelDelta/3) !== false) && (_.restYSpace() !== 0) ) {
								e.stopPropagation();
								e.preventDefault();
							}
						}
					};
				}
				
				if(!this._currentScrollEvent) {
					this._currentScrollEvent = function(e){
						e.stopPropagation();
						e.preventDefault();
						return CALL(_.ScrollEvent.Scroll,_,e);
					};
				}
				
				this._applyScrollEvent = false;
			}
		
			if(this._applyScrollEvent !== flag) {
				if(flag){
					ELON(this.Source,"mousewheel",this._currentMouseWheelEvent);
					ELON(this.Source,"scroll",this._currentScrollEvent);
					this.Finger.applyTouchEvent(true);
				} else {
					ELOFF(this.Source,"mousewheel",this._currentMouseWheelEvent);
					ELOFF(this.Source,"scroll",this._currentScrollEvent);
					this.Finger.applyTouchEvent(false);
				}
				this._applyScrollEvent = flag;
			}
		},
		getBoundsInfo:function(){
			return  {
				frame:{
					width:this.Source.offsetWidth,
					height:this.Source.offsetHeight,
				},
				clipview:{
					x:this.Source.scrollLeft,
					y:this.Source.scrollTop,
					width:this.ClipView.offsetWidth,
					height:this.ClipView.offsetHeight
				},
				contents:{
					width:this.Source.scrollWidth,
					height:this.Source.scrollHeight
				}
			}
		}
	},function(node,fixHeight){
		this.Source = ZFIND(node);
		if(this.Source){
			
			this.axisYPositiveLength = 0;
			this.axisYNegativeLength = 0;
			this.axisYPositiveItems = [];
			this.axisYNegativeItems = [];
			
			this.ClipView = MAKE("div.nody-scroll-box-clip-view");
			ELSTYLE(this.ClipView,"transition-property","all");
			ELSTYLE(this.ClipView,"transition-duration","0.3s");
			ELSTYLE(this.ClipView,"transition-timing-function","ease-out");
			ELSTYLE(this.ClipView,"transform","matrix(1.0,0,0,1.0,0,0)");
			ELSTYLE(this.ClipView,"position","relative");
			
			ELAPPEND(this.ClipView,this.Source.childNodes);
			ELAPPEND(this.Source,this.ClipView);
			
			//
			this.ScrollEvent = {};
			
			this.Finger = new Finger(this.Source);
			
			this.allowScrollX = true;
			this.allowScrollY = true;
			
			ELSTYLE(this.Source,"overflow","hidden");
			ELSTYLE(this.Source,"position","relative");
			
			var _ = this;
			//
			this.Finger.whenTouchMove(function(offsetX,offsetY,e){
				var result = false;
				if( (offsetY !== 0) && (_.needScrollingOffsetY(offsetY) == true) && (_.restYSpace() !== 0) ) result = true;
				if( (offsetX !== 0) && (_.needScrollingOffsetX(offsetX) == true) ) result = true;
				return result;
			});
			
			this.applyScrollEvent(true);
		} else {
			console.warn("ScrollBox제대로 불러오지 못했습니다.",node);
		}
	});
	
	extendModule("ScrollBox","ZoomBox",{
		needZoom:function(needTo){
			needTo = TONUMBER(needTo);
			if(needTo < this.zoomMin) needTo = this.zoomMin;
			if(needTo > this.zoomMax) needTo = this.zoomMax;
			
			if(needTo === this.ZoomValue) return false;
			
			//ELSTYLE(this.ClipView,"transform","scale("+needTo+")");
			var offsetWidth  = Math.floor(((this.ClipView.offsetWidth  * needTo) - this.ClipView.offsetWidth) / 2);
			var offsetHeight = Math.floor(((this.ClipView.offsetHeight * needTo) - this.ClipView.offsetHeight) / 2);
			
			ELSTYLE(this.ClipView,"transform","matrix("+needTo+",0,0,"+needTo+","+offsetWidth+","+offsetHeight+")");
			var _ = this;
			
			
			if( !this.wasClipTimeout ) clearTimeout(this.wasClipTimeout);
			this.wasClipTimeout = setTimeout(function(){ CALL(_.ScrollEvent.Scroll,_); },305);
			
			CALL(_.ScrollEvent.Scroll,_);
			this.ZoomValue = needTo;
			return true;
		},
		needZoomWithOffset:function(offset){ 
			return this.needZoom(this.ZoomValue + offset);
		},
		whenZoom:function(event){ this.ZoomEvent = event; },
		resizeFix:function(){
			this.nzClipWidth  = this.Source.scrollWidth;
			this.nzClipHeigth = this.Source.scrollHeight;
		},
		getBoundsInfo:function(){
			var bi = this._super();
			bi.clipview.zoom     = this.ZoomValue;
			bi.contents.nzWidth  = this.nzClipWidth;
			bi.contents.nsHeight = this.nzClipHeigth;
			return bi;
		},
		getPosition:function(){
			
		},
		setPosition:function(x,y,z){
			
		}
	},function(mainNode){
		//scrollbox이벤트의 휠 이벤트를 변경
		var _ = this;
		this._currentMouseWheelEvent = function(e){
			e.preventDefault();
			if(e.wheelDelta) _.needZoomWithOffset(e.wheelDelta/2000)
		}
		
		this._super(mainNode);
		
		
		this.ZoomValue = 1.0
		this.zoomMin   = 1.0;
		this.zoomMax   = 3.0;
		this.allowZoom = true;
		this.ZoomEvent;
		this.resizeFix();
		
		this.Finger.whenPinch(function(zoomOffset,e){
			if(_.allowZoom) _.needZoomWithOffset(zoomOffset);
		});
		
		this.setAllowVirtureFinger(true);
	});
	
	makeModule("BoxTracker",{
		whenTracking:function(m){ this._trackingEvnet = m; }
	},function(mainNode,box){
		this.Source            = ZFIND(mainNode);
		box = CALLBACK(box,this);
		
		this.SourcePlaceholder = MAKE(".nody-box-tracker-placeholder");
		this.SourceFocusLens   = MAKE(".nody-box-tracker-focus-lens");
		this.SourceWrapper     = MAKE(".nody-box-tracker-wrapper[style=position:relative;overflow:hidden;]",this.SourcePlaceholder,this.SourceFocusLens);
		
		
		this.SourceWidth       = this.Source.offsetWidth;
		this.SourceHeight      = this.Source.offsetHeight;
		
		ELAPPEND(this.Source,this.SourceWrapper);
		
		
		
		if("__NativeClass__" in box) {
			if( box.__NativeClass__("ZoomBox")  ) {
				
				var a1 = box.ClipView.outerHTML;
				var a2 = HTMLTOEL(a1);
				ELPUT(this.SourcePlaceholder,a2);
				
				var boxBounds   = box.getBoundsInfo();
				var wm          = this.SourceWidth  / boxBounds.contents.width;
				var hm          = this.SourceHeight / boxBounds.contents.height;
				var defaultZoom = (wm < hm) ? wm : hm;
		
				ELATTR(this.SourcePlaceholder,"style","zoom:"+defaultZoom+";");
		
				var _ = this;
				var __ = function(){
					var boxBounds   = box.getBoundsInfo();
					CALL(_._trackingEvnet,_,boxBounds);
					ELATTR(
						_.SourceFocusLens,
						"style",
						ZSTRING("position:absolute;left:\\{$0}px;top:\\{$1}px;width:\\{$2}px;height:\\{$3}px;border:2px solid red;",
							boxBounds.clipview.x * defaultZoom / boxBounds.clipview.zoom,
							boxBounds.clipview.y * defaultZoom / boxBounds.clipview.zoom,
							boxBounds.clipview.width  * defaultZoom / boxBounds.clipview.zoom,
							boxBounds.clipview.height * defaultZoom / boxBounds.clipview.zoom
						)
					);
				};
				box.whenScroll(__);__();
		
				//
				this.Finger = new Finger(this.SourceFocusLens);
				this.Finger.setAllowVirtureFinger(true);
				this.Finger.whenTouchMove(function(offsetX,offsetY){
					var zoom = box.getBoundsInfo().clipview.zoom * ((1-defaultZoom) + 1);
					box.needScrollingOffsetX(-offsetX * zoom );
					box.needScrollingOffsetY(-offsetY * zoom );
				});
				return;
			}
			if( box.__NativeClass__("ScrollBox")  ) {
				
				return;
			}
		}
		console.error("두번째 파라메터는 Box인스턴스이여야 합니다.")
	});
	
})(window,NODYENV);