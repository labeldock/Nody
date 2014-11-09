// Author      // hojung ahn (open9.net)
// Concept     // DHTML RAD TOOL
// tested in   // IE9 + (on 4.0) & webkit2 & air13
// lincense    // MIT lincense
// GIT         // https://github.com/labeldock/Nody
(+(function(W,NativeCore){
	
	// 이미 불러온 버전이 있는지 확인
	if(typeof W.nody !== "undefined"){ W.nodyLoadException = true; throw new Error("already loaded ATYPE core loadded => " + W.nody + " current => " + version); return ; } else { W.nody = version; }
	
	// 코어버전
	var nodyCoreVersion = "1.4.0";
	
	// 콘솔설정 : ie에러 고침 : adobe air
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
	
	// MARK("name") 두번호출하면 시간을 측정할수 있음
	var MARKO = {};W.MARK = function(name){ if(typeof name == "string" || typeof name == "number") { name = name+""; if(typeof MARKO[name] == "number") { console.info("MARK::"+name+" => "+ (+new Date() - MARKO[name])); delete MARKO[name]; } else { console.info("MARK START::"+name); MARKO[name] = +new Date(); } } };
	
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
	if(typeof W.JSON == "undefined"){W.JSON = aJSON;};
	
	//IE8 Success FIX
	if (typeof W.success == "function"){W.success = "success";};
	
	//IE8 function bind FIX
	if (!Function.prototype.bind) { Function.prototype.bind = function (oThis) { if (typeof this !== "function") { /* closest thing possible to the ECMAScript 5 internal IsCallable function */ throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable"); } var aArgs = Array.prototype.slice.call(arguments,1), fToBind = this, fNOP = function () {}, fBound = function () { return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments))); }; fNOP.prototype = this.prototype; fBound.prototype = new fNOP(); return fBound; }; }
	
	//NativeCore console trace
	W.NativeModule   = function(name){
		if (NativeCore.Modules[name]) {
			var result = name + "(" + /\(([^\)]*)\)/.exec( ((NativeCore.Modules[name].prototype["set"])+"") )[1] + ")"
			var i2 = 0;
			for(protoName in NativeCore.Modules[name].prototype ) switch(protoName){
				case "set": case "get": case "__NativeType__": case "__NativeHistroy__": case "__NativeHistroy__": case "constructor": case "__NativeClass__": case "_super": case "__GlobalConstructor__":
					break;
				default:
					if(typeof NativeCore.Modules[name].prototype[protoName] == "function") result += "\n    " + i2 + " : " + protoName + "(" + /\(([^\)]*)\)/.exec( ((NativeCore.Modules[name].prototype[protoName])+"") )[1] + ")" ;
					i2++;
					break;
			}
			return result;
		} else {
			return name + " module is not found."
		}
	};
	
	W.NativeTrace = function(){ 
		var logText = [];
		//Getter
		var getterText = "# Native Getter";
		for (var i=0,l=NativeCore.Getters.length;i<l;i++) getterText += "\n" + i + " : " + NativeCore.Getters[i];
		logText.push(getterText)
		//Sigletons
		var singletonText = "# Native Singleton";
		var i=0;
		for ( key in NativeCore.Singletons ) {
			singletonText += "\n" + i + " : " + key ;
			var i2=0;
			switch(key){
				case "SpecialFoundation": case "ELUT": case "NODY": case "FINDEL": case "ElementFoundation": case "ElementGenerator":
					var count = 0;
					for( protoName in NativeCore.Singletons[key].constructor.prototype) count++;
					singletonText += "\n    [" + count + "]...";
					break;
				default:
					for( protoName in NativeCore.Singletons[key].constructor.prototype) {
						singletonText += "\n    " + i2 + " : " + protoName;
						i2++;
					}
					break;
			}
			i++;
		}
		logText.push(singletonText);
		//Module
		var moduleText = "# Native Module";
		var i=0;
		for ( key in NativeCore.Modules ) {
			moduleText += "\n " + i + " : " + W.NativeModule(key);
			i++;
		}
		logText.push(moduleText);
		return logText.join("\n");
	};
	
	//NativeCore Start
	var NativeFactoryObject = function(type,name,sm,gm){
		if( !(name in NativeCore.Modules) ){
			var nativeProto,setter,getter;
			switch(type){
				case "object":
					nativeProto = {};
					setter      = typeof sm == "function" ? function(v){ sm.apply(this,Array.prototype.slice.call(arguments)); return this; } : function(v){ this.Source = v; return this; };
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
			var nativeConstructor = function(){ if(typeof this.set == "function"){ for(protoKey in NativeCore.Modules[name].prototype){ if(protoKey.indexOf("var!") == 0) this[protoKey.substr(4)] = NativeCore.Modules[name].prototype[protoKey]; }; this.set.apply(this,Array.prototype.slice.apply(arguments)); } };
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
					currentScopeDepth      = (this.__NativeHistroy__.length - 1) - superScope ;
					currentScopeModuleName = this.__NativeHistroy__[currentScopeDepth];
					currentScopePrototype  = NativeCore.Modules[currentScopeModuleName].prototype.constructor.prototype;
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
	structruePrototype = {
		"get":function(key){ if(key) return this.Source[key]; return this.Source; },
		"empty":function(){ for(var k in this.Source) delete this.Source[k]; return this.Source; },
		"replace":function(data){ this.empty(); for(var k in data) this.Source[k] = data[k]; return this.Source; },
		"keymap":function(keys,r){ var i=0,sets={}; for(var k in keys) sets[keys[k]] = r(keys[k],k,i++); return this.replace(sets); },
		"each":function(r){ var i=0; for(var k in this.Source) {var br = r(this.Source[k],k,i++);if(br == false) break;} return this.Source; },
		"map":function(f){ var r = []; this.each(function(v,k,i){ r.push(f(v,k,i)); }); return r; },
		"trace":function(m){ console.log((m?m+" ":"")+TOSTRING(this.Source)); }
	};
	W.makeStructure = function(n,m){
		if(typeof n !== "string" || typeof m !== "function") return console.warn("makeStructure::worng arguments!");
		NativeCore.Structure[n]=function(){ this.Source={};m.apply(this,Array.prototype.slice.call(arguments)); };
		NativeCore.Structure[n].prototype = {"constructor":m};
		for(var key in structruePrototype) NativeCore.Structure[n].prototype[key] = structruePrototype[key];
		window[n] = NativeCore.Structure[n];
	};
	//Data가 
	StructureInit = function(n,o){ return (o instanceof W[n]) ? o : new W[n](o); };
	//Kit:Core
	W.makeSingleton = function(n,m,i){
		var o=i?i:function(){};
		for(var cname in m) {
			if(typeof cname == "string" && cname.indexOf("Structure#")==0){
				var dataName = cname.substr(10);
				if( dataName.length > 0) W.makeStructure(dataName,m[cname]);
				delete m[cname];
			}
		}
		o.prototype=m;
		o.prototype.constructor=o;
		o.prototype.fusionGetter=function(){
			for(var k in o.prototype) switch(k){
				case "eachGetter":case "fusionGetter":case "constructor":break;
				default: W.makeGetter(n+k,o.prototype[k]); break;
			}
		}
		o.prototype.eachGetter=function(){
			for(var k in o.prototype) switch(k){
				case "eachGetter":case "fusionGetter":case "constructor":break;
				default: W.makeGetter(k,o.prototype[k]); break;
			}
		};
		W[n]=new o();
		NativeCore.Singletons[n]=W[n];
	};
	W.makeGetters   = function(o){ if(typeof o == "object") for(var k in o) W.makeGetter(k,o[k]); };
	
	// Foundation UTility
	var FUT_CACHE;
	W.makeSingleton("FUT",{
		//함수를 연속적으로 사용 가능하도록 함
		"CONTINUTILITY":function(func,over,owner){
			return function(){
				var args = Array.prototype.slice.apply(arguments);
				for(var i=TONUMBER(over,1),l=args.length;i<l;i++) if(typeof args[i] == "function"){
					return args[i].apply(owner,[func.apply(owner,args.slice(0,i))].concat(args.slice(i+1,l))); 
					break;
				}
				return func.apply(owner,args);
			}
		},
		//URL Info
		"PAGEURLINFO":function(url){
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
		"PAGEROOT":function(url){ var h = FUT.PAGEURLINFO(url); return h.protocol + h.divider + h.hostname + (h.port != ""?":"+h.port:h.port) + (slash==false?"":"/"); },
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
		"CACHEIN":function(sender,name){
			if( !(sender in FUT_CACHE) ) return false;
			if( !(name in FUT_CACHE[sender]) ) return false;
			return true;
		},
		"CACHESET"  :function(s,n,v){ if( !(s in FUT_CACHE) ) FUT_CACHE[s] = {}; FUT_CACHE[s][n] = v; },
		"CACHEGET"  :function(s,n)  { if( this.CACHEIN(s,n) ) return FUT_CACHE[s][n]; },
		"CACHECLEAR":function()     { FUT_CACHE = {"SELECTINFO":{"":{}},"AreaContent":{}}},
		"CACHETRACE":function()     { return JSON.stringify(FUT_CACHE); }
	});
	FUT.CACHECLEAR();
	
	// Nody Super base
	W.makeSingleton("NodyBase",{
		// 첫번째 값이 유효하지 않으면 값을 대채함
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
		//문자나 숫자이면 참
		"ISTEXT" :function(v){ return (typeof v == "string" || typeof v == "number") ? true : false; },
		//배열이 아니면 배열로 만들어줌
		"TOARRAY":function(t,s){ if(typeof t=="undefined" && arguments.length < 2) return []; if(typeof t == "string" && typeof s == "string"){ return t.split(s); } else if(ISARRAY(t) == true) { return t; } else { return [t]; } },
		//배열을 복사
		"CLONEARRAY":function(v) { var mvArray = []; if( ISARRAY(v) ) { if("toArray" in v){ Array.prototype.splice.apply(mvArray,v.toArray()); } else { for(var i=0,l=v.length;i<l;i++) mvArray.push(v[i]); } } else { if(v||v==0) mvArray.push(v); return this; } return mvArray; },
		//배열안에 배열을 길이만큼 추가
		"ARRAYINARRAY":function(l) { l=TONUMBER(l);var aa=[];for(var i=0;i<l;i++){ aa.push([]); }return aa; },
		//배열의 하나추출
		"ZERO"   :function(t){ return typeof t == "object" ? typeof t[0] == "undefined" ? undefined : t[0] : t; },
		//배열의 뒤
		"LAST"   :function(t){ return ISARRAY(t) ? t[t.length-1] : t; },
		// 0, "  ", {}, [] 등등 value가 없는 값을 검사합니다.
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
		//숫자로 변환합니다. 디폴트 값이나 0으로 반환합니다.
		"TONUMBER":function(v,d){
			switch(typeof v){ case "number":return v;case "string":var r=v*1;return isNaN(r)?0:r;break; }
			switch(typeof d){ case "number":return d;case "string":var r=d*1;return isNaN(r)?0:r;break; }
			return 0;
		},
		//1:길이와 같이 2: 함수호출
		"TIMES":function(l,f){ l=TONUMBER(l); for(var i=0;i<l;i++){ var r = f(i); if(r==false) break; } return l; },
		"TIMESMAP":function(l,f){ l=TONUMBER(l); var r = []; for(var i=0;i<l;i++) r.push(f(i)); return r; },
		// 각각의 값의 function실행
		"DATAEACH"    :FUT.CONTINUTILITY(function(v,f){ var ev=TOARRAY(v); for(var i=0,l=ev.length;i<l;i++) f(ev[i],i); return ev; },2),
		// 각각의 값의 function실행
		"DATAEACHBACK":FUT.CONTINUTILITY(function(v,f){ var ev=TOARRAY(v); for(var i=0,l=ev.length;i<l;i++) f(ev[i],i); return ev; },2),
		// 각각의 값을 배열로 다시 구해오기
		"DATAMAP"     :FUT.CONTINUTILITY(function(v,f){ var rv=[],ev=TOARRAY(v); for(var i=0,l=ev.length;i<l;i++) rv.push(f(ev[i],i)); return rv; },2),
		// 각각의 값을 배열로 다시 구해오되 undefined는 제거합니다
		"DATAGATHER"  :FUT.CONTINUTILITY(function(v,f){ var rv=[],ev=TOARRAY(v); for(var i=0,l=ev.length;i<l;i++) { var def = f(ev[i],i); if(typeof def !== "undefined") rv.push(); } return rv; },2),
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
		//i 값이 제귀합니다.
		"TURNINDEX":function(index,maxIndex){ if(index < 0) { var abs = Math.abs(index); index = maxIndex-(abs>maxIndex?abs%maxIndex:abs); }; return (maxIndex > index)?index:index%maxIndex; },
		//오브젝트의 key를 each열거함
		"ENUMERATION":FUT.CONTINUTILITY(function(v,f){if((typeof v == "object") && (typeof f == "function")){for(k in v) {f(v[k],k)}}; return v; },2),
		//무엇이든 길이를 리턴합니다.
		"TOLENGTH":function(v,d){
			switch(typeof v){ case "number":return (v+"").length;break;case "string":return v.length;case "object":if("length" in v)return v.length;}
			return (typeof d=="undefined")?0:d;
		},
		//무엇이든 문자열로 넘김
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
		"TOS"  : function(tosv,jsonfy){ return TOSTRING(tosv,4,jsonfy); },
		//어떠한 객체의 길이를 조절함
		"MAX"  : function(target,length,suffix){
			if(typeof target == "string"){
				length = isNaN(length) ? 100 : parseInt(length);
				suffix = typeof suffix == "string" ? suffix : "...";
				if( target.length > length ){
					return target.substr(0,length) + suffix;
				}
			} else if (ISARRAY(target)) {
				if (target.length > length) target.length = length;
			}
			return target;
		},
		// 복사
		"CLONE"  : function(t) { 
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
		//inspect type
		"ISTYPE":function(t,v) {
			//real
			try {
				if(t instanceof v) return true;
			} catch(e){
				//tName
				var vn = ((typeof v == "function") ? v["__NatvieContstructorName__"] : v);
				//inspect
				if( (typeof t=="object") && (typeof vn=="string") ) if("__NativeHistroy__" in t) {
					var his = t["__NativeHistroy__"];
				
					for(var i=0,l=his.length;i<l;i++){
						if(his[i] == vn) return true;
					}
				}
			}
			return false;
		},
		//owner를 쉽게 바꾸면서 함수실행을 위해 있음
		"APPLY" : function(f,owner,args) { 
			if(typeof f == "function"){ 
				var mvArgs = CLONEARRAY(args);
				if(mvArgs.length > 0){ 
					return f.apply(owner,mvArgs); 
				} else { 
					return f.call(owner); 
				}
				/* 콘솔에러로 만든 코드이나 디버깅이 어려워져 다시 블럭함 */
				/*try { if(mvArgs.length > 0){ return f.apply(owner,mvArgs); } else { return f.call(owner); } } catch(e) { for(key in console) if(console[key] == f) { return f.apply(console,mvArgs); } throw e; } */
			} 
		},
		"CALL" : function(f,owner) { 
			if(typeof f == "function"){ if(typeof APPLY == "undefined"){ alert("apply가 존재하지 않음"); } var args = Array.prototype.slice.apply(arguments); args.shift(); args.shift(); return APPLY(f,owner,args); } 
		}
	});
	NodyBase.eachGetter();
	
})(window,{
	Getters:[],
	Singletons:{},
	Modules:{},
	Structure:{}
}));