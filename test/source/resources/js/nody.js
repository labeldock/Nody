/* Nody js
 * GIT         // https://github.com/labeldock/Nody
 * Copyright HOJUNG-AHN. and other contributors
 * Released under the MIT license
 * 
 * Includes Sizzle.js
 * http://sizzlejs.com/
 */

(function(W,NGetters,NSingletons,NModules,NStructure,nody){
	
	// Nody version
	nody.version = "0.23", nody.build = "1087";
	
	// Core verison
	nody.coreVersion = "1.9.2", nody.coreBuild = "76";
	
	// Pollyfill : console object
	if (typeof W.console !== "object") W.console = {}; 'log info warn error count assert dir clear profile profileEnd'.replace(/\S+/g,function(n){ if(!(n in W.console)) W.console[n] = function(){ if(typeof air === "object") if("trace" in air){ var args = Array.prototype.slice.call(arguments),traces = []; for(var i=0,l=args.length;i<l;i++){ switch(typeof args[i]){ case "string" : case "number": traces.push(args[i]); break; case "boolean": traces.push(args[i]?"true":"false"); break; default: traces.push(TOSTRING(args[i])); break; } } air.trace( traces.join(", ") ); } } });	
	
	// Bechmark : two times call the MARK('name');
	var MARKO = {}; W.MARK = function(name){ if(typeof name === "string" || typeof name === "number") { name = name+""; if(typeof MARKO[name] === "number") { var time = (+new Date() - MARKO[name]);console.info("MARK::"+name+" => "+time) ; delete MARKO[name]; return time  } else { console.info("MARK START::"+name); MARKO[name] = +new Date(); } } };
	
	// Pollyfill : Trim 
	if(!String.prototype.trim) String.prototype.trim = function() { return this.replace(/(^\s*)|(\s*$)/gi, ""); };
	
	// Pollyfill : JSON
	if(typeof W.JSON === "undefined"){ W.JSON = { 'parse' : function(s) { var r; try { r = eval('(' + s + ')'); } catch(e) { r = TOOBJECT(s); } return r; }, 'stringify' : function(o) { return W.TOSTRING(obj,Number.POSITIVE_INFINITY,true); } };}
		
	// Pollyfill : function bind
	if (!Function.prototype.bind) { Function.prototype.bind = function (oThis) { if (typeof this !== "function") { /* closest thing possible to the ECMAScript 5 internal IsCallable function */ throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable"); } var aArgs = Array.prototype.slice.call(arguments,1), fToBind = this, fNOP = function () {}, fBound = function () { return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments))); }; fNOP.prototype = this.prototype; fBound.prototype = new fNOP(); return fBound; }; }
	
	// Mordenizer : IE8 Success fix
	if (typeof W.success === "function"){W.success = "success";}
	
	//NativeCore console trace
	var traceNativeModule = function(name){ if (NModules[name]) { var result = name + "(" + /\(([^\)]*)\)/.exec( ((NModules[name].prototype["set"])+"") )[1] + ")"; var i2 = 0; for(var protoName in NModules[name].prototype ) switch(protoName){ case "set": case "get": case "__NativeType__": case "__NativeHistroy__": case "__NativeHistroy__": case "constructor": case "__NativeClass__": case "_super": case "__GlobalConstructor__": break; default: if(typeof NModules[name].prototype[protoName] === "function") result += "\n " + i2 + " : " + protoName + "(" + /\(([^\)]*)\)/.exec( ((NModules[name].prototype[protoName])+"") )[1] + ")" ; i2++; break; } return result; } else { return name + " module is not found."; } };
	nody.api = traceNativeModule;
	nody.all = function(){ var i,key,logText = []; var getterText = "# Native Getter"; for (i=0,l=NGetters.length;i<l;i++) getterText += "\n" + i + " : " + NGetters[i]; logText.push(getterText); var singletonText = "# Native Singleton"; i=0; for (key in NSingletons ) { singletonText += "\n" + i + " : " + key; var protoName,i2=0; switch(key){ case "SpecialFoundation": case "ELUT": case "NODY": case "FINDEL": case "ElementFoundation": case "ElementGenerator": var count = 0; for(protoName in NSingletons[key].constructor.prototype) count++; singletonText += "\n [" + count + "]..."; break; default: for(protoName in NSingletons[key].constructor.prototype) singletonText += "\n" + (i2++) + " : " + protoName; break; } i++; } logText.push(singletonText); var moduleText = "# Native Module"; i=0; for (key in NModules ) { moduleText += "\n " + i + " : " + traceNativeModule(key); i++; } logText.push(moduleText); return logText.join("\n"); };
	
	
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
			W[name] = NModules[name];
		}
	};
	nody.module = function(name,proto,setter,getter){
		if(NativeFactoryObject("object",name)){
			NativeFactoryExtend(name,proto,setter,getter);
			NativeFactoryDeploy(name);
		}
	};
	nody.arrayModule = function(name,proto,setter,getter){
		if(NativeFactoryObject("array",name)){
			NativeFactoryExtend(name,proto,setter,getter);
			NativeFactoryDeploy(name);
		}
	};
	nody.extendModule = function(parentName,name,methods,setter,getter){
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
	
	nody.method = function(n,m,bind){ 
		var name=n.toUpperCase(); 
		W[name]=m; NGetters.push(name); 
		if(typeof bind === 'object') for(var key in bind) if(typeof bind[key] === 'function') {
			m[key] = function(){
				var binder = (new (function(){var _=this; this.getter = function(){ return m.apply(_,Array.prototype.slice.call(arguments));};})());
				return bind[key].apply(binder,Array.prototype.slice.call(arguments));
			}
		}
		return m;
	};
	
	structruePrototype = {
		"get":function(key){ if(key) return this.Source[key]; return this.Source; },
		"empty":function(){ for(var k in this.Source) delete this.Source[k]; return this.Source; },
		"setSource":function(data){ this.empty(); for(var k in data) this.Source[k] = data[k]; return this.Source; },
		"keymap":function(keys,r){ var i=0,sets={}; for(var k in keys) sets[keys[k]] = r(keys[k],k,i++); return this.setSource(sets); },
		"each":function(r){ var i=0; for(var k in this.Source) {var br = r(this.Source[k],k,i++);if(br == false) break;} return this.Source; },
		"map":function(f){ var r = []; this.each(function(v,k,i){ r.push(f(v,k,i)); }); return r; },
		"trace":function(m){ console.log((m?m+" ":"")+TOSTRING(this.Source)); }
	};
	nody.structure = function(n,m){
		if(typeof n !== "string" || typeof m !== "function") return console.warn("nody.structure::worng arguments!");
		NStructure[n]=function(){ this.Source={};m.apply(this,Array.prototype.slice.call(arguments)); };
		NStructure[n].prototype = {"constructor":m};
		for(var key in structruePrototype) NStructure[n].prototype[key] = structruePrototype[key];
		window[n] = NStructure[n];
	};
	nody.initStructure = function(n,o){ return (o instanceof W[n]) ? o : new W[n](o); };
	//Kit:Core
	nody.singleton = function(n,m,i){
		var o=i?i:function(){};
		for(var cname in m) {
			if(typeof cname === "string" && cname.indexOf("Structure#")===0){
				var dataName = cname.substr(10);
				if( dataName.length > 0) nody.structure(dataName,m[cname]);
				delete m[cname];
			}
		}
		o.prototype=m;
		o.prototype.constructor=o;
		o.prototype.eachGetterWithPrefix=function(){
			for(var k in o.prototype){
				switch(k){
					case "eachGetter":case "eachGetterWithPrefix":case "constructor":break;
					default: nody.method(n+k,o.prototype[k]); break;
				}
			}
		};
		o.prototype.eachGetter=function(){
			for(var k in o.prototype){
				switch(k){
					case "eachGetter":case "eachGetterWithPrefix":case "constructor":break;
					default: nody.method(k,o.prototype[k]); break;
				}
			}
		};
		W[n]=new o();
		NSingletons[n]=W[n];
	};
	nody.methods = function(o){ if(typeof o === "object") for(var k in o) nody.method(k,o[k]); };
	
	//
	nody.method("CONTINUEFUNCTION",function(func,over,owner){
		over = (over || 1);
		return function(){
			if(arguments.length >= over){					
				for(var i=over,l=arguments.length;i<l;i++) if(typeof arguments[i] === "function"){
					return arguments[i].apply(
						owner,[func.apply(owner,Array.prototype.slice.call(arguments,0,i))].concat(Array.prototype.slice.call(arguments,i+1,l))
					); 
				}
			}
			return func.apply(owner,Array.prototype.slice.call(arguments));
		};
	});
	nody.method("BINDFUNCTION",function(m1,m2,requireReturn){
		if(typeof m1 !== 'function') return m2;
		if(typeof m2 !== 'function') return m1;
		var m1f = m1._nodyBindFunction ? m1._nodyBindFunction : [m1];
		var m2f = m2._nodyBindFunction ? m2._nodyBindFunction : [m2];
		var bfs = m1f.concat(m2f);
		var bf = requireReturn === false ?
		function(){ 
			DATAEACH(bf._nodyBindFunction,function(f){ return f();}); 
		}:
		function(){
			return DATAMAP(bf._nodyBindFunction,function(f){ return f();}); 
		};
		bf._nodyBindFunction = bfs;
		m1f = m2f = bfs = null;
		return bf;
	});
	//trycatch high perfomance
	nody.method("TRYCATCH",function(t,c,s){try{return t.call(s);}catch(e){if(typeof c === 'function') return c.call(s,e);}});
	nody.url = {
		info : function(url){
			if(typeof url === "object") return ( url["ConstructorMark"] === ("ClientURLInfo" + W.nody)) ? url : null;
			var info;
			TRYCATCH(
				function(){
					info = /([\w]+)(\:[\/]+)([^/]*\@|)([\w\d\.\-\_\+]+)(\:[\d]+|)(\/|)([\w\d\.\/\-\_]+|)(\?[\d\w\=\&\%]+|)(\#[\d\w]*|)/.exec(url?url:window.document.URL.toString());
				},
				function(){
					info = null;
				}
			)
			if(info === null) {
				console.error("nody.url.info::faild get url info",e);
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
		root:function(url){ var 
			h = nody.url.info(url);
			var root = h.protocol + h.divider + h.hostname + (h.port !== ""?":"+h.port:h.port);
			return /\/$/.test(root) ? root : root + "/";
		},
		script:function(){ 
			var scripts = document.getElementsByTagName('script');
			var lastScript = scripts[scripts.length-1];
			var scriptString;
			if(lastScript){
				scriptString = lastScript.src;
			} else {
				console.warn("GETSCRIPTURL faild");
			}
			//ie7 fix
			if(!/^[\w]+\:\//.test(scriptString)) scriptString = nody.url.root() + scriptString;
			return scriptString;
		},
		scriptRoot:function(){ return nody.url.script().replace(/([^\/]+$)/,""); },
	};
	nody.include =function(aFilename){
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
	};
	
	var nody_cache;
	nody.cache = {
		has:function(sender,name){
			if( !(sender in nody_cache) ) return false;
			if( !(name in nody_cache[sender]) ) return false;
			return true;
		},
		set:function(s,n,v){ if( !(s in nody_cache) ) nody_cache[s] = {}; nody_cache[s][n] = v; },
		get:function(s,n)  { if( nody.cache.has(s,n) ) return nody_cache[s][n]; },
		clear:function()     { nody_cache = {"SELECTINFO":{"":{}},"AreaContent":{}}; },
		trace:function()     { return JSON.stringify(nody_cache); }
	}
	nody.cache.clear();
	
	var nody_typemap = { "string" : "ISSTRING", "number" : "ISNUMBER", "numberText": "ISNUMBERTEXT", "text" : "ISTEXT", "array" : "ISARRAY", "object" : "ISOBJECT", "email" : "ISEMAIL", "ascii" : "ISASCII", "true" : "ISTRUE", "false" : "ISFALSE", "nothing" : "ISNOTHING", "ok" : "ISOK", "nok" : "ISNOK" };
	
	nody.singleton("TypeBase",{
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
		"ISARRAY"    : function(a){ return (typeof a === "object") ? ( a !== null && ((a instanceof Array || a instanceof NodeList || ISJQUERY(a) || ( !isNaN(a.length) && isNaN(a.nodeType))) && !(a instanceof Window) ) ? true : false) : false; },
		"ISEMAIL"    : function(t){ return TypeBase.ISTEXT(t) ? /^[\w]+\@[\w]+\.[\.\w]+/.test(t) : false;},
		"ISASCII"    : function(t){ return TypeBase.ISTEXT(t) ? /^[\x00-\x7F]*$/.test(t)         : false;},
		"ISTRUE"     : function(t){ return !!t ? true : false;},
		"ISFALSE"    : function(t){ return  !t ? false : true;},
		
		//문자나 숫자이면 참
		"ISTEXT" :function(v){ return (typeof v === "string" || typeof v === "number") ? true : false; },
		
		// // 엘리먼트 유형 검사
		"ISWINDOW"  :function(a){ if(typeof a === "object") return "navigator" in a; return false; },
		"ISDOCUMENT":function(a){ return typeof a === "object" ? a.nodeType == 9 ? true : false : false; },
		"ISELNODE"  :function(a){ if(a == null) return false; if(typeof a === "object") if(a.nodeType == 1) return true; return false;},
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
		"ISOK":function(o){ return !ISNOTHING(o); },
		"ISNOK":function(o){ return ISNOTHING(o); },
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
			
			if(ISNOTHING(test)) return ISTRUE(target);
			
			var testResult;
			
			switch(typeof test){
				case "string":
					var model = [];
					test.trim().replace(/\S+/g,function(s){ model.push(s); });
				
					for (var i=0,l=model.length;i<l;i++) {
						if(/^(\!|)(\w*)([\>\<\=\:]{0,3})([\S]*)/.test(model[i])) {
							var param = /^(\!|)(\w*)([\>\<\=\:]{0,3})([\S]*)/.exec(model[i]);
						} else {
							console.warn("포멧이 올바르지 않은 키워드 입니다.",model[i]);
						}
					
						var typeMapName = nody_typemap[param[2]];
						if( nody_typemap[param[2]] ) {
							//type 확인
							testResult = TypeBase[typeMapName](target);
							if(param[1] == "!") testResult = !testResult;
							if(!testResult) break;
							//길이 확인
							if(param[3] != "" && param[4] != ""){
								if( ISNUMBERTEXT(param[4]) ) {
									switch(param[3]){
										case ">": testResult = TOSIZE(target,param[2]) > parseFloat(param[4]); break;
										case "<": testResult = TOSIZE(target,param[2]) < parseFloat(param[4]); break;
										case "<=": case "=<": case "<==": case "==<": testResult = TOSIZE(target,param[2]) <= parseFloat(param[4]); break;
										case ">=": case "=>": case ">==": case "==>": testResult = TOSIZE(target,param[2]) >= parseFloat(param[4]); break;
										case "==" : case "===": testResult = TOSIZE(target,param[2]) == parseFloat(param[4]); break;
										case "!=" : case "!==": testResult = TOSIZE(target,param[2]) != parseFloat(param[4]); break;
									}
								} else if(param[3] === ":" && /\d+\~\d+/.test(param[4])) {
									var rangeNumbers = /(\d+)\~(\d+)/.exec(param[4]);
									if(rangeNumbers[1] == rangeNumbers[2]){
										testResult = ( TOSIZE(target,param[2]) == parseFloat(param[4]) );
									} else {
										var lv=(rangeNumbers[1]*1),rv=(rangeNumbers[2]*1),cv=TOSIZE(target,param[2]);
										if( lv > rv ) {
											testResult = ( (cv <= lv) && (cv >= rv) );
										} else {
											testResult = ( (cv <= rv) && (cv >= lv) );
										}
									}
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
				return Array.prototype.slice.apply(v.toArray()); 
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
	nody.singleton("nodyBaseKit",{
		//owner를 쉽게 바꾸면서 함수실행을 위해 있음
		"APPLY" : function(f,owner,args) { if( typeof f === "function" ) { args = CLONEARRAY(args); return (args.length > 0) ? f.apply(owner,args) : f.call(owner); } },
		//값을 플래튼하여 실행함
		"FLATTENCALL" : function(f,owner) { APPLY(f,owner,DATAFLATTEN(Array.prototype.slice.call(arguments,2))); },
		"CALL"    :function(f,owner){ return (typeof f === "function") ? ((arguments.length > 2) ? f.apply(owner,Array.prototype.slice.call(arguments,2)) : f.call(owner)) : undefined; },
		"CALLBACK":function(f,owner){ return (typeof f === "function") ? ((arguments.length > 2) ? f.apply(owner,Array.prototype.slice.call(arguments,2)) : f.call(owner)) : f; },
		//배열이 아니면 배열로 만들어줌
		"TOARRAY":TOARRAY,
		//배열이든 아니든 무조건 배열로 만듬
		"CLONEARRAY":CLONEARRAY,
		//배열안에 배열을 길이만큼 추가
		"ARRAYARRAY":function(l) { l=TONUMBER(l);var aa=[];for(var i=0;i<l;i++){ aa.push([]); }return aa; },
		//숫자로 변환합니다. 디폴트 값이나 0으로 반환합니다.
		"TONUMBER":function(v,d){
			switch(typeof v){ case "number":return v;case "string":var r=v.replace(/[^.\d\-]/g,"")*1;return isNaN(r)?0:r;break; }
			switch(typeof d){ case "number":return d;case "string":var r=d*1;return isNaN(r)?0:r;break; }
			return 0;
		},
		//좌측으로 0을 붙임
		"PADLEFT":function(nr,n,str){ return new Array(n-new String(nr).length+1).join(str||'0')+nr; },
		// 참고! : human readable month
		"ZDATE":function(dv,format,pad){
			if(ISARRAY(dv)) dv = dv.join(' ');
			
			var dt = /(\d\d\d\d|)[^\d]?(\d\d|\d|).?(\d\d|\d|)[^\d]?(\d\d|\d|)[^\d]?(\d\d|\d|)[^\d]?(\d\d|\d|)/.exec(dv);
			dt[1] = dt[1] || (((new Date()).getYear() + 1900) +'');
			dt[2] = dt[2] || ((new Date()).getMonth()+1);
			dt[3] = dt[3] || ((new Date()).getDate());
			dt[4] = dt[4] || ("00");
			dt[5] = dt[5] || ("00");
			dt[6] = dt[6] || ("00");
			
			var r    = [ dt[1],dt[2],dt[3],dt[4],dt[5],dt[6],dt[0] ];
			r.year   = dt[1],r.month  = dt[2],r.date = dt[3],r.hour = dt[4],r.minute = dt[5],r.second = dt[6],r.init = dt[7];
			r.format = function(s){
				return s.replace('YYYY',r.year).replace(/(MM|M)/,r.month).replace(/(DD|D)/,r.date)
				.replace(/(hh|h)/,r.hour).replace(/(mm|m)/,r.minute).replace(/(ss|s)/,r.second)
				.replace(/(A)/,(TONUMBER(r.hour) > 12) ? 'PM' : 'AM');
			}
			if(typeof format === 'string') 
				return r.format(format);
				return r;
		},
		//1:길이와 같이 2: 함수호출
		"TIMES":CONTINUEFUNCTION(function(l,f,s){ l=TONUMBER(l); for(var i=(typeof s === 'number')?s:0;i<l;i++){ var r = f(i); if(r==false) break; } return l; },2),
		"TIMESMAP":CONTINUEFUNCTION(function(l,f,s){ 
			l=TONUMBER(l); var r = []; 
			if(typeof f === 'string') var fs = f, f = function(i){ return ZSTRING.SEED(i)(fs); };
			for(var i=(typeof s === 'number')?s:0;i<l;i++) r.push(f(i)); 
			return r; 
		},2),
		"DATACALL":CONTINUEFUNCTION(function(d,alt){ return (typeof d === 'undefined') ? CLONEARRAY(alt) : ((alt === true) ? CLONEARRAY(d) : TOARRAY(d)); },1),
		"DATAHAS" :function(d,v){ d=TOARRAY(d); for(var i=0,l=d.length;i<l;i++) if(d[i] === v) return true; return false; },
		//배열의 하나추출
		"DATAZERO"   :function(t){ return typeof t === "object" ? typeof t[0] === "undefined" ? undefined : t[0] : t; },
		//배열의 뒤
		"DATALAST"   :function(t){ return ISARRAY(t) ? t[t.length-1] : t; },
		// 각각의 값의 function실행
		"DATAEACH"    :CONTINUEFUNCTION(function(v,f){ var ev=TOARRAY(v); for(var i=0,l=ev.length;i<l;i++) if(f.call(ev[i],ev[i],i) === false) break; return ev; },2),
		// 각각의 값의 function실행
		"DATAEACHBACK":CONTINUEFUNCTION(function(v,f){ var ev=TOARRAY(v); for(var i=0,l=ev.length;i<l;i++) if(f.call(ev[i],ev[i],i) === false) break; return ev; },2),
		// 각각의 값을 배열로 다시 구해오기
		"DATAMAP"     :CONTINUEFUNCTION(function(v,f){ var rv=[],ev=TOARRAY(v); for(var i=0,l=ev.length;i<l;i++) rv.push(f.call(ev[i],ev[i],i)); return rv; },2),
		//
		"DATAHAS":function(v,o){ var ev=TOARRAY(v); for(var i=0,l=ev.length;i<l;i++){ if(ev[i] === o) return true } return false; },
		"INJECT":function(v,f,d){ d=(typeof d=="object"?d:{});v=TOARRAY(v); for(var i=0,l=v.length;i<l;i++)f(d,v[i],i);return d;},
		// 배열안의 배열을 풀어냅니다.
		"DATAFLATTEN":function(){ var result = []; function arrayFlatten(args){ DATAEACH(args,function(arg){ if(ISARRAY(arg)) return DATAEACH(arg,arrayFlatten); result.push(arg); }); } arrayFlatten(arguments); return result; },
		// false를 호출하면 배열에서 제거합니다.
		"DATAFILTER":CONTINUEFUNCTION(function(inData,filterMethod){
			var data = TOARRAY(inData);
			filterMethod = filterMethod || function(a){ return typeof a === "undefined" ? false : true; };
			if(typeof filterMethod === "function"){
				var result=[];
				DATAEACH(data,function(v,i){ if(filterMethod(v,i)==true) result.push(v); });
				return result;
			}
			return [];
		},2),
		"DATAANY":function(inData,filterMethod){
			var tr = false,fm=(typeof filterMethod === 'function') ? filterMethod : function(v){ return v === filterMethod; };
			filterMethod = filterMethod || function(a){ return typeof a === "undefined" ? false : true; };
			DATAFILTER(inData,function(v,i){
				var r = fm(v,i)
				if(r === true) { tr = true; return false; }
			});
			return tr;
		},
		"DATAALL":function(inData,filterMethod){
			var tr = true,fm=(typeof filterMethod === 'function') ? filterMethod : function(v){ return v === filterMethod; };
			filterMethod = filterMethod || function(a){ return typeof a === "undefined" ? false : true; };
			DATAFILTER(inData,function(v,i){
				var r = fm(v,i);
				if(r === false) return tr = false;
			});
			return tr;
		},
		//중복되는 값 제거
		"DATAUNIQUE" :function() {
			var value  = [],result = [];
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
		//길이만큼 무작위로 뽑아낸다
		"DATARANDOM":function(v,length){
			v = CLONEARRAY(v);
			if(typeof length === "undefined") return v[Math.floor(Math.random() * v.length)];
			if(length > v.length) length = v.length;
			var r = [];
			for(var i=0,l=length;i<l;i++){
				var vi = Math.floor(Math.random() * v.length);
				r.push(v[vi]);
				v.splice(vi,1);
			}
			return r;
		},
		//데이터를 섞는다
		"DATASHUFFLE":function(v){
			v = CLONEARRAY(v);
			//+ Jonas Raoni Soares Silva
			//@ http://jsfromhell.com/array/shuffle [rev. #1]
		    for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
		    return v;
		},
		"DATAINDEX":function(data,compare){ var v = TOARRAY(data); for(var i in v) if(compare == v[i]) return TONUMBER(i); },
		//확률적으로 나옵니다. 0~1 true 가 나올 확률
		"FLAGRANDOM":function(probabilityOfTrue){
			if(typeof probabilityOfTrue !== 'number') probabilityOfTrue = 0.5;
			return !!probabilityOfTrue && Math.random() <= probabilityOfTrue;
		},
		//i 값이 제귀합니다.
		"REVERSEINDEX":function(index,maxIndex){ return (maxIndex-1) - index },
		"TURNINDEX":function(index,maxIndex){ if(index < 0) { var abs = Math.abs(index); index = maxIndex-(abs>maxIndex?abs%maxIndex:abs); }; return (maxIndex > index)?index:index%maxIndex; },
		"SPRINGINDEX":function(index,maxIndex){ index = TONUMBER(index); maxIndex = TONUMBER(maxIndex); return (index == 0 || (Math.floor(index/maxIndex)%2 == 0))?index%maxIndex:maxIndex-(index%maxIndex); },
		//오브젝트의 key를 each열거함
		"PROPEACH":CONTINUEFUNCTION(function(v,f){if((typeof v === "object") && (typeof f === "function")){ for(k in v) if(f(v[k],k)===false) break; }; return v; },2),
		//
		"PROPMAP":CONTINUEFUNCTION(function(v,f){ var result = {}; if(typeof v === "object" && (typeof f === "function")){ for(var k in v) result[k] = f(v[k],k); return result; } return result;},2),
		//오브젝트의 key value값을 Array 맵으로 구한다.
		"PROPDATA" :CONTINUEFUNCTION(function(v,f){ var result = []; if(typeof f !== "function") f = function(v){ return v; }; if(typeof v === "object"){ for(var k in v) result.push(f(v[k],k)); return result; } return result;},2),
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
		"EXTEND":function(data){
			if(typeof data !== "object") return data;
			for(var i=1,l=arguments.length;i<l;i++) 
				if( typeof arguments[i] == "object" ) 
					for(var key in arguments[i]) data[key] = arguments[i][key];
			return data;
		},
		//완전히 새로운 포인터 오브젝트에 다른 소스를 반영
		"MARGE":function(data){
			if(typeof data !== "object") {
				if(data === undefined) data = {};
				else data = {data:data};
			} 
			return EXTEND.apply(undefined,[CLONE(data,true)].concat(Array.prototype.slice.call(arguments,1)));
		},
		//첫번째 소스에 두번째 부터 시작하는 소스를 반영
		"EXTENDFILL":function(data,fillData,forceFill){
			if(typeof data !== "object") {
				if(data === undefined) data = {};
				else data = {data:data};
			}
			
			if(forceFill !== true) forceFill = TOARRAY(forceFill);
			
			if (forceFill.length || forceFill === true) {
				for(var key in fillData)  {
					if( !(key in data) ) data[key] = fillData[key];
					else if(forceFill === true || DATAHAS(forceFill,key) ) data[key] = fillData[key];
				} 
			} else {
				for(var key in fillData)  if( !(key in data) ) data[key] = fillData[key];
			}
			return data;
		},
		//완전히 새로운 포인터 오브젝트에 다른 소스를 반영
		"MARGEFILL":function(data,fillData,forceFill){
			return EXTENDFILL(CLONE(data,true),fillData,forceFill);
		},
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
			if(typeof v === 'string'){
				//tName
				var vn = ((typeof v === "function") ? v["__NatvieContstructorName__"] : v);
				//inspect
				if( (typeof t=="object") && (typeof vn=="string") ) if("__NativeHistroy__" in t) {
					var his = t["__NativeHistroy__"];
				
					for(var i=0,l=his.length;i<l;i++){
						if(his[i] == vn) return true;
					}
				}
				return false;
			} else if(typeof v === 'function') {
				//javascript instance
				if(t instanceof v) return true; return false;
			}
		}
	});
	nodyBaseKit.eachGetter();
})(window,[],{},{},{},((function(){window.nody = {};return window.nody;})()));

(function(nody){
	nody.env = (function(){
		var info = {};
		if(navigator) {
			// Operating system
			info.os = /(win|mac|linux|iphone)/.exec(navigator.platform.toLowerCase());
			info.os = (info.os !== null) ? info.os[0].replace("sunos", "solaris") : "unknown";
		
			// Browser Name
			//http://stackoverflow.com/questions/5916900/detect-version-of-browser 191
			info.browser = (function(){
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
		
			//online
			info.online = navigator.onLine;
		} else {
			info.browser = info.os = 'unknown';
			info.online  = false; 
		}
		
		//support ComputedStyle
		info.supportComputedStyle  =  window ? ('getComputedStyle' in window) ? true : false : false;
		
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
		
		var tester = document.createElement('div');
		
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
		
		//getUserMedia
		info.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
		info.supportGetUserMedia = !!info.getUserMedia;
		
		//ie8 fix nodelist slice
		info.supportNodeListSlice = (function(){
			try {
				Array.prototype.slice.call(NodeList)
				return true;
			} catch(e) {
				return false;
			}
		})();
		
		//matches
		var querySelectorAllName = 
			('querySelectorAll'       in document) ? 'querySelectorAll' :
			('webkitQuerySelectorAll' in document) ? 'webkitQuerySelectorAll' :
			('msQuerySelectorAll'     in document) ? 'msQuerySelectorAll' :
			('mozQuerySelectorAll'    in document) ? 'mozQuerySelectorAll' :
			('oQuerySelectorAll'      in document) ? 'oQuerySelectorAll' : false;
		
		info.supportQuerySelectorAll  = !!querySelectorAllName;
		info.supportStandardQuerySelectorAll = (querySelectorAllName === 'querySelectorAll');
		if(info.supportQuerySelectorAll) {
			info.querySelectorAll = info.supportNodeListSlice ? 
			function(node,selector){
				return Array.prototype.slice.call(
					(node||document)[querySelectorAllName](
						selector.replace(/\[[\w\-\_]+\=[^\'\"][^\]]+\]/g, function(s){ 
							return s.replace(/\=.+\]$/,function(s){ 
								return '=\"' + s.substr(1,s.length-2) + '\"]'; 
							}) 
						})
					)
				);
			}:
			function(node,selector){
				var nodeList = (node||document)[querySelectorAllName](
					selector.replace(/\[[\w\-\_]+\=[^\'\"][^\]]+\]/g, function(s){ 
						return s.replace(/\=.+\]$/,function(s){ 
							return '=\"' + s.substr(1,s.length-2) + '\"]'; 
						}) 
					})
				);	
				var result = [];		
					
				for(var i=0,l=nodeList.length;i<l;i++){
					nodeList[i] && result.push(nodeList[i]);
				} 
				return result;
			};
		} else {
			info.querySelectorAll = null;
		}
		
		//matches
		var matchesSelectorName = 
			('matches' in tester)               ? 'matches' :
			('webkitMatchesSelector' in tester) ? 'webkitMatchesSelector' :
			('msMatchesSelector'     in tester) ? 'msMatchesSelector' :
			('mozMatchesSelector'    in tester) ? 'mozMatchesSelector' :
			('oMatchesSelector'      in tester) ? 'oMatchesSelector' : false;
			
		info.supportMatches  = !!matchesSelectorName;
		info.supportStandardMatches = (querySelectorAllName === 'matches');
		info.matchesSelector = info.supportMatches && function(node,selector){ 
			//selectText fix
			return node[matchesSelectorName](
				selector.replace(/\[[\w\-\_]+\=[^\'\"][^\]]+\]/g, function(s){ 
					return s.replace(/\=.+\]$/,function(s){ 
						return '=\"' + s.substr(1,s.length-2) + '\"]'; 
					}) 
				})
			); 
		};
		return info;
	})();
})(window.nody);

//Nody Foundation
(function(W){
	if(W.nodyLoadException==true){ throw new Error("Nody Process Foundation init cancled"); return;}
	nody.singleton("SpecialFoundation",{
		"ZRATIO":function(ratioTotal){
			var total = 0;
			ratioTotal = TONUMBER(ratioTotal) || 100;
			return DATAMAP(Array.prototype.slice.call(arguments,1),function(v){
				var num = TONUMBER(v);
				total  += num;
				return num;
			},DATAMAP,function(num){
				return Math.round(num / total * ratioTotal);
			});
		},
		"TOPX":function(v){ if( /(\%|px)$/.test(v) ) return v; return TONUMBER(v)+"px"; },
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
		//길이만큼 늘립니다.
		"DATACLIP":CONTINUEFUNCTION(function(v,l,ex){
			var d = CLONEARRAY(v);
			if(typeof l !== 'number' || d.length === l) return d;
			if (d.length > l) return Array.prototype.slice.call(d,0,l);
			TIMES(l - d.length,function(){ d.push(ex); });
			return d;
		},2),
		"DATAREPEAT":CONTINUEFUNCTION(function(v,l){
			var d = CLONEARRAY(v);
			if(typeof l !== 'number' || d.length === l) return d;
			if (d.length > l) return Array.prototype.slice.call(d,0,l);
			TIMES(l - d.length,function(){ d.push(v); });
			return d;
		},2),
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
			var cache = nody.cache.get("ZONECHOICE",value+split);
			if(cache) return cache[Math.floor(Math.random()*(cache.length))];
			var cachedata = value.split(typeof split === "string"?split:",");
			nody.cache.set("ZONECHOICE",value+split,cachedata);
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
	
	
	nody.method("ZSTRING",function(source){
		var seed = this.seed || 0;
		var aPoint=[],params = DATAMAP(Array.prototype.slice.call(arguments,1),function(t){ return ZONEINFO(t); });
		return source.replace(/(\\\([^\)]*\)|\\\{[^\}]*\})/g,function(s){
			if(s[s.length-1] == ')') {
				var dv = ZONEVALUE(ZONEINFO("\\!"+s.substring(2,s.length-1)));
				aPoint.push(dv);
				return dv;
			} else {
				var evs = s.substring(2, s.length - 1).replace(/\$i/g, function(s) {
                    return seed;
                }).replace(/\&\d+/g, function(s) {
                    var av = aPoint[parseInt(s.substr(1))];
                    return ISNUMBERTEXT(av) ? av * 1 : '\"' + av + '\"';
                }).replace(/\$\d+/g, function(s) {
                    var paramResult = params[parseInt(s.substr(1))];
                    if (paramResult) {
                        paramResult = ZONEVALUE(paramResult);
                        return ISNUMBERTEXT(paramResult) ? paramResult : '\"' + paramResult + '\"' ;
                    }
                });
				var v = eval(evs);
				aPoint.push(v);
				return v;
			}
		});
		
	},{
		SEED:function(seed){ 
			this.seed = TONUMBER(seed);
			return this.getter;
		}
	});
	
	nody.method("ZNUMBER",function(source){
		if(arguments.length === 1){
			return TONUMBER(ZSTRING.call(undefined,"\\("+source+")"));
		} else {
			var args = Array.prototype.slice.call(arguments);
			args[0]  = "\\{"+args[0]+"}";
			return TONUMBER(ZSTRING.apply(undefined,args));
		}
	},{
		SEED:function(seed){ this.seed = TONUMBER(seed);return this.getter; }
	});
	
	// 키를 찾는 함수입니다.
	var objectCommonInterface = {
		"keys":function(rule){
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
	// NFArray
	nody.arrayModule("NFArray",{
		// 요소 각각에 형식인수를 넘기며 한번씩 호출한다.
		each     : function(block) { for ( var i = 0, l = this.length ; i < l  ; i++) { if( block(this[i],i) == false ) break; } return this; },
		// each의 반대 동작
		eachBack : function(block) { for ( var i = this.length - 1    ; i > -1 ; i--) { if( block(this[i],i) == false ) break; } return this; },
		// key배열 습득
		keys  : objectCommonInterface.keys,
		//첫번째 요소 반환.
		zero  :function(){ return DATAZERO(this); },
		first :function(){ return DATAZERO(this); },
		//마지막 요소 반환.
		last :function(){ return DATALAST(this); },
		//
		has:function(v){ for(var i=0,l=this.length;i<l;i++) if(this[i] === v) return true; return false; },
		// 값을 추가한다.
		push : function(v,i){ switch(typeof i){ case "string": case "number": this[i] = v; break; default: Array.prototype.push.call(this,v); break; } return this; },
		// 존재하지 않는 값만 추가한다
		add :function(v,i){ if( !this.has(v) ) this.push(v,i); return this; },
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
		//값의 길이
		isNone:function(){ return (this.length === 0) ? true : false },
		isOne:function(){ return (this.length === 1) ? true : false },
		isMany:function(){ return (this.length > 1) ? true : false },
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
		clone:function(){ return new NFArray(this);},
		//정렬합니다.
		getSort:function(positive){
			return (typeof positive=="undefined"?true:false)?this.clone().sort():this.clone().sort().reverse();
		},
		//뒤로부터 원하는 위치에 대상을 삽입합니다.
		behind: function(v,a){ return this.insert(v, this.length - (isNaN(a) ? 0 : parseInt(a)) ); },
		//원하는 위치에 대상을 덮어씁니다.
		overwrite : function(v,a){ this.min(a+1); this[a] = v; return this; },
		//양방향에 대상을 삽입합니다.
		getBoth:function(insert,push){ return this.save().insert(insert).push(push);     },
		both:function(insert,push)   { return this.setSource(this.getBoth(insert,push)); },
		// 현재의 배열을 보호하고 새로운 배열을 반환한다.
		save : function(v){ return this.__GlobalConstructor__(this); },
		//요소안의 array 녹이기
		getFlatten : function(){ return new NFArray(DATAFLATTEN(this)); },
		flatten    : function(){return this.setSource(this.getFlatten());},
		//다른 배열 요소를 덛붙인다.
		getConcat : function(){ return new NFArray(arguments).inject(this.save(),function(v,_a){ new NFArray(v).each(function(v2){ _a.push(v2); }); }); },
		concat    : function(){ return this.setSource(this.getConcat.apply(this,arguments)); },			
		//어떠한 요소끼리 위치를 바꾼다
		changeIndex:function(leftIndex,rightIndex){
			var left  = this[leftIndex];
			var right = this[rightIndex];
			this[leftIndex]  = right;
			this[rightIndex] = left;
		},
		hasIndex:function(index){ if (index < 0) return false; if (this.length - 1 < index) return false; return true; },
		// 리턴한 요소를 누적하여 차례로 전달함
		inject:function(firstValue,method) { for(var i = 0,l = this.length;i<l;i++) { var returnValue = method(this[i],firstValue,i); if(typeof returnValue !== "undefined") firstValue = returnValue; } return firstValue; },
		// 리턴되는 오브젝트로 새 배열은 만들어냅니다.
		mapUtil: { "&":function(owner,param){ return owner.getMap(function(a){ if(typeof a === "object") return a[param]; return undefined;}); }},
		getMap : function(process,start) { if(typeof process=="function"){var result=[];for(var i=(typeof start === "number" ? start : 0),l=this.length;i<l;i++)result.push(process(this[i],i,this.length));return new NFArray(result);}else if(typeof getOrder=="string"){process=process.trim();for(var key in this.mapUtil)if(process.indexOf(key)==0){var tokenWith=process[key.length]==":"?true:false;var param=tokenWith?process.substr(key.length+1):process.substr(key.length);return new NFArray(this.mapUtil[key](this,param));}}return new NFArray(); },
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
				return new NFArray(result);
			}
			return new NFArray();
		},
		filter      : function(filterMethod) { return this.setSource(this.getFilter(filterMethod)); },
		// undefined요소를 제거한다.
		getCompact : function(){ return this.getFilter(function(a){ return a == undefined ? false : true; }); },
		compact    : function(){ return this.setSource(this.getCompact());},
		// time // 오버라이팅
		getTimesmap : function(time,method,start,end){
			var _ = this;
			var length = _.length;
			var result = this.clone();
			var timef  = (typeof method === 'function') ? method : function(){return method;}
			
			TIMESMAP(time,function(i){
				if( length <= i ) result.push( timef(_[i],i) ); else result[i] = timef(_[i],i);
			},start,end);
			
			return result;
		},
		timesmap:function(time,method,start,end){ return this.setSource(this.getTimesmap(time,method,start,end)); },
		// 파라메터 함수가 모두 true이면 true입니다.
		passAll:function(passMethod) { for(var i=0,l=this.length;i<l;i++) if(passMethod(this[i],i) != true) return false; return true; },
		// 하나라도 참이면 true입니다
		passAny:function(passMethod) { for(var i=0,l=this.length;i<l;i++) if(passMethod(this[i],i) == true) return true; return false; },
		//substr처럼 array를 자른다.
		getSubArray:function(fi,li,infinity){
			fi = isNaN(fi) == true ? 0 : parseInt(fi);
			li = isNaN(li) == true ? 0 : parseInt(li);
			var nl,ns,result = new NFArray();
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
		//해당되는 인덱스를 제거
		getDrop:function(index){ index=index?index:0;return this.getSubArray(index).getConcat(this.getSubarr(index+1)); },
		drop:function(index) { return this.setSource(this.getDrop(index)); },
		// 인수와 같은 요소를 제거한다.
		getRemove:function(target) { return this.getFilter(function(t){ if(t == target) return false; return true; }); },
		remove:function(target) { return this.setSource(this.getRemove(target)); },
		// 요소중의 중복된 값을 지운다.
		getUnique:function(){var result=new NFArray();this.each(function(selfObject){if(result.passAll(function(target){return selfObject!=target;}))result.push(selfObject);});return result;},
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
		//요소안의 string까지 split하여 flaatten을 실행
		getStringFlatten:function(){ return this.save().map(function(t){ if(typeof t === "string") return t.split(" "); if(ISARRAY(t)) return new NFArray(t).flatten().type("string"); }).remove(undefined).flatten(); },
		stringFlatten:function(){ return this.setSource( this.getStringFlatten() ); },
		getDeepFlatten:function(){function arrayFlatten(_array){var result=new NFArray();_array.each(function(value){if( ISARRAY(value) ){result.concat(arrayFlatten(new NFArray(value)));}else{result.push(value);}});return result;}return arrayFlatten(this);},
		deepFlatten:function(){ return this.setSource(this.getDeepFlatten()); },
		//그룹 지어줌
		getGrouping:function(length,reverse){
			var result=[];
			if(reverse == true){
				this.save().reverse().turning(length,function(obj,i,g){if(!result[g])result[g]=[];result[g].push(obj);});
				return new NFArray(result).map( function(groups){ return new NFArray(groups).reverse().toArray(); } ).reverse();
			}
			this.turning(length,function(obj,i,g){if(!result[g])result[g]=[];result[g].push(obj);});
			return new NFArray(result);
		},
		grouping:function(length,reverse){ return this.setSource(this.getGrouping(length,reverse)); },
		//랜덤으로 내용을 뽑아줌
		getRandom:function(length){ return new NFArray(DATARANDOM(this.toArray())); },
		getShuffle:function(){ return new NFArray(DATASHUFFLE(this.toArray())); },
		join:function(t,p,s){ return (ISTEXT(p)?p:"")+Array.prototype.join.call(this,t)+((ISTEXT(s))?s:""); },
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
		continueTo:function(f){ return f.apply(undefined,[this.toArray()].concat(Array.prototype.slice.call(arguments,1))); }
	});
	
	//******************
	//NFObject
	nody.module("NFObject",{
		//each
		each:function(f){ for(key in this.Source){ var r = f(this.Source[key],key); if(typeof r == false) {break;} } return this; },
		keys:objectCommonInterface.keys,
		eachBack:function(method){ var keys = this.keys(); for ( var i = keys.length - 1 ; i > -1 ; i--) { if( method(keys[i],i) == false ) break; } return this; },
		//첫번째 요소 반환.
		zero:function(){ for(var k in this.Source) return this.Source[k]; },
		//마지막 요소 반환.
		last:function(){ var keys = this.keys(); return this.Source[keys[keys.length-1]];},
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
				var keys   = this.keys(ksel);
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
			if(typeof v !== "function" && typeof v !== "undefined") { throw new Error("NFObject::data 메서드는 setter가 아닙니다."); };
			if (typeof k === "string"){
				if(typeof v === "function"){
					return v(this.Source[k]);
				} else {
					return this.Source[k];
				}
			} else if(k instanceof RegExp || ISARRAY(k)){
				var keys   = this.keys(rule),result = {};
				for(var key in keys) result[key] = keys[key];
				return result;
			} else {
				return this.Source; 
			};
		},
		//inspect key value
		isSame:function(obj){ var originObject = this.Source; var judgement = true; new NFObject(obj).each(function(v,k){ if( !(k in originObject) || originObject[k] !== v){ judgement = false; return false; } }); return judgement; },
		isEqual:function(obj){ var _obj = new NFObject(obj); var oObj = this.Source; var iObj = _obj.get(); var oKeys = this.keys().sort(); var iKeys = _obj.keys().sort(); if(oKeys.length !== iKeys.length) return false; for(var i=0,l=oKeys.length;i<l;i++){ if(oKeys[i] !== iKeys[i]) return false; if(oObj[oKeys[i]] !== iObj[iKeys[i]]) return false; } return true; },
		//오브젝트를 배열로 반환함
		hashes:function(key,val){ key = typeof key !== "string" ? "key" : key; val = typeof val !== "string" ? "value" : val; var r=[]; for(var k in this.Source){ var o = {}; o[key] = k; o[val] = this.Source[k]; r.push(o); } return r; },
		//
		join:function(a,b){ a = typeof a === "string" ? a : ":"; b = typeof b === "string" ? b : ","; return this.inject([],function(v,i,k){ i.push(k+a+TOSTRING(v)); }).join(b); },
		//toParam
		getEncodeObject : function(useEncode){ return this.inject({},function(val,inj,key){ inj[ (useEncode == false ? key : _NFString(key).getEncode()) ] = (useEncode == false ? val : _NFString(val).getEncode()); }); },
		encodeObject    : function(){ return this.setSource(this.getEncodeObject.apply(this,arguments)); },
		//jsonString으로 반환
		stringify:function(){ return JSON.stringify(this.Source); },
		changeKey:function(original, change){ if(typeof original === "string" && typeof change === "string") { this.Source[change] = this.Source[original]; delete this.Source[original]; } return this.Source; },
		//String의 순차적으로 오브젝트 반환  "1 2 3 4" => {"1":"2","3":"4"}
		getKvo:function(arg,split){ split = typeof split === "string" ? split : " "; arg = arg.split(split); var source = CLONE(this.Source); var keyName = undefined; new NFArray(arg).turning(2,function(value,i){ if(i == 0) { keyName = value; } else if(i == 1) { if(typeof keyName !== "undefined") { switch(value){ case "''": case '""': case "'": case '"': source[keyName] = ""; break; default : source[keyName] = value; break ; } } keyName = undefined; } }); return source; },
		kvo:function(arg){ return this.setSource(this.getKvo.call(this,arg)); },
		//오브젝트의 키를 지우고자 할때
		removeAll:function(){ for( var key in this.Source ) delete this.Source[key]; return this.Source; },
		getRemove:function(){ var source = this.Source; new NFArray(arguments).stringFlatten().each(function(key){ delete source[key]; }); return this.Source; },
		remove:function(key){ delete this.Source[key]; return this; },
		removeNothing:function(){ for(var key in this.Source) if(ISNOTHING(this.Source[key])) delete this.Source[key]; return this; },
		//존재하지 않는 키벨류값을 적용함;
		getTouch:function(key,value){ var m = CLONE(this.Source);new NFArray(key).stringFlatten().each(function(key){ if(!(key in m)) m[key] = value; }); return m; },
		touch:function(key,value){ return this.setSource( this.getTouch.apply(this,arguments) ); },
		//키의 배열을 받는다
		keys:function(){ var result = []; for (key in this.Source) result.push(key); return result; },
		//값의 배열을 받는다
		values:function(){ var result = []; for (key in this.Source) result.push(this.Source[key]); return result; },
		getValue:function(key){ return this.Source[key]; },
		//다른 오브젝트와 함칠때
		getConcat:function(){ var result = this.clone(); for(var i=0,l=arguments.length;i<l;i++){ new NFObject(arguments[i]).each(function(v,k){ result[k] = v; }); }; return result; },
		concat:function(){ this.setSource(this.getConcat.apply(this,arguments)); return this; },
		//다른 오브젝트와 함칠때 이미 있는 값은 오버라이드 하지 않음
		getSafeConcat:function(){ var result = this.clone(); for(var i=0,l=arguments.length;i<l;i++){ new NFObject(arguments[i]).each(function(v,k){ if( (k in result) == false) result[k] = v; }); } return result; },
		safeConcat:function(){ this.setSource(this.getSafeConcat.apply(this,arguments)); return this; }
	}, function(p,n,s){
		if(typeof s === "string"){
			this.Source = {};
			this[s].apply(this,new NFArray(arguments).subarr(0,2).toArray());
		} else {
			this.Source = TOOBJECT(p,n);
		}
	});
	
	W._Split = function(text,s){
		if( ISARRAY(text) ) return new NFArray(text);
		if(typeof text === "string"){
			var result;
			if((typeof s === "string") || typeof s === "number") {
				s = s+"";
				result = text.split(s);
			} else {
				result = [];
				text.replace(/\S+/gi,function(s){ result.push(s); });
			}
			return new NFArray(result);
		}
		console.warn("_Split은 text나 array만 넣기를 추천합니다. => ", text);
		return new NFArray(text);
	};
	
	
	//******************
	//String
	var htmlSafeMap = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': '&quot;', "'": '&#39;', "/": '&#x2F;' };
	nody.module("NFString",{
		getEncode:function(){ return encodeURI(this.Source); },
		getDecode:function(){ return decodeURI(this.Source); },
		encode:function(){this.Source = this.getEncode();return this;},
		decode:function(){this.Source = this.getDecode();return this;},
		getRaw:function(){
			(new String(this.Source))
		},
		getHTMLSafe:function(){
			return (new String(this.Source)).replace(/[&<>"'\/]/g, function (s) { return htmlSafeMap[s]; });
		},
		getByteSize:function(){ return unescape(escape(this.Source).replace(/%u..../g,function(s){ return "uu"; })).length; },
		getLines:function(){ return _Split(this.Source,"\n").toArray(); },
		eachLine:function(f,j){ if(typeof f === "function") return new NFArray(this.getLines()).map(function(s,i){ return f(s,i); }).compact().join( (j?j:"\n") ); },
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
				return _NFString(text).getTabAbsolute(_NFString(text).getTabSize() + offset,tabString);
			}).join("\n");
			return this.Source;
		},
		//라인중
		getTabsSize:function(){
			var minimum;
			this.eachLine(function(line){
				var tabSize = _NFString(line).getTabSize();
				if((minimum == undefined) || (tabSize < minimum)) minimum = tabSize;
			});
			return minimum;
		},
		getTabsAlign:function(){
			var beforeSize;
			var baseOffset = 0;
			return this.eachLine(function(line){
				//console.log("baseOffset",baseOffset);
				var tabSize = _NFString(line).getTabSize();
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
				return _NFString(line).getTabAbsolute(baseOffset);
			});
		},
		tabsAlign:function(){ this.Source = this.getTabsAlign(); return this; },
		getTrimLine:function(){ return this.eachLine(function(line){ var trimText = line.trim(); return (trimText == "") ? undefined : line; }); },
		trimLine:function(){ this.Source = this.getTrimLine(); return this; },
		trim:function(trimParam,autoTrim){
			original = this.Source;
			if(autoTrim) original = this.Source.trim();
			var trim_s = trimParam?trimParam:" ";
			trim_s = trim_s.replace(" ","\\s");
			return TRYCATCH(function(){
				this.Source = new RegExp("^(["+trim_s+"]*)(.*[^"+trim_s.split("|").join("^")+"])(["+trim_s+"]*)$").exec(original)[2];
			},function(){
				return this.Source;
			},this);
		},
		//content
		abilityFunction  : function(fs,is,js){ var origin = (js==true) ? OUTERSPLIT(this.Source,fs,["{}","[]",'""',"''"]) : this.Source.trim().split(fs); if(origin[origin.length-1].trim()=="") origin.length = origin.length-1;  return new NFArray(origin).passAll(function(s,i){ return s.indexOf(is) > 0; }) ? origin.length : 0; },
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
			return new NFArray( (js==true) ? OUTERSPLIT(this.Source,fs,["{}","[]",'""',"''"]) : this.Source.trim().split(fs) ).inject({},function(s,inj){
				var v = s.substr(s.indexOf(is)+1);
				if(s.trim().length > 0) inj[ UNWRAP(s.substr(0,s.indexOf(is)),['""',"''"]) ] = UNWRAP((js == true) ? _NFString(v).getDataContent(true) : v,['""',"''"]);
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
						return new NFArray(a).inject([],function(s,inj){
							inj.push(UNWRAP( _NFString(s).getDataContent(true) , ["''",'""'] )); 
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
						console.warn("NFString::getPrintf::printf 할수 없습니다.",this.Source,f);
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
			var result = [];
			if(target instanceof RegExp) {
				for (var i=0,l=models.length;i<l;i++) if(target.test(models[i]) == false) result.push(models[i]);
			} else {
				for (var i=0,l=models.length;i<l;i++) if(models[i] !== target) result.push(models[i]);
			}
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
	
	nody.extendModule("NFString","ZString",{
		getZContent:function(seed){
			return ZSTRING.SEED(seed).apply(undefined,[this.Source].concat(this.ZoneParams));
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
	},function(seed){
		return this.getZContent(seed);
	});
	
	// Number
	nody.extendModule("NFString","NFNumber",{
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
		getInteger     : function()  { return this.getNumberInfo(2); },
		getFloat       : function()  { return this.getNumberInfo(3); },
		getFloatNumber : function()  { return this.getNumberInfo(3).replace(/^0\./,''); },
		getNumber      : function()  { return this.getNumberInfo(5); },
		getPrefix      : function()  { return this.getNumberInfo(1); }, 
		getSuffix      : function()  { return this.getNumberInfo(4); },
		integer        : function() { return this.getInteger()*1;},
		floatNumber    : function() { return this.getFloatNumber()*1;},
		floatValue     : function() { return this.getFloat()*1;},
		number         : function() { return this.getNumber()* 1;},
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
			var lv = new NFNumber(withValue).number();
			var rv = this.number();
			var result = 0;
		
			//할인율 계산하고 적용
			if(rv > lv){
				result = 0;
			} else {
				result = ((lv - rv) / lv) * 100;
				result = isNaN(result) ? 0 : result;
			}
		
			if(typeof trunc === "number"){return new NFNumber(result).getTrunc(trunc);}
			return result;
		},
		// expression
		expression:function(senceParameter,option){
			var senceNumber  = new NFNumber(senceParameter);
			var optionNumber = new NFNumber(option);
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
			if(typeof mask !== "string") console.error("NFNumber::getFormat::첫번째 파라메터는 반드시 string이나 function으로 string이 꼭 되도록 해주세요.",typeof mask,mask);
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
		getDecimal:function(p,s){ return  _NFString(this.getNumberFormat("#,##0",true)).getFix(p,s);  },
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
	
	nody.singleton("NFUtil",{
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
		base64UniqueRandom:function(length,prefixKey,codeAt,codeLength){
			var randomKey;
			var process = 0;
			prefixKey = (typeof prefixKey === 'string') ? prefixKey : '';
			do {
				var needContinue = false;
				randomKey        = prefixKey + this.base64Random(length,codeAt,codeLength);
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
		base62Random:function(length) { return this.base64Random(length,0,62); },
		base62UniqueRandom:function(length,prefix) { return this.base64UniqueRandom(length || 6,prefix,0,62); },
		random:function(length) { return parseInt(this.base64Random(length,52,10)); },
		numberRandom:function(length) { return this.base64Random(length,52,10); },
		base36Random:function(length) { return this.base64Random(length,26,36); },
		base36UniqueRandom:function(length,prefix) { return this.base64UniqueRandom(length || 6,prefix,26,36); },
		base26Random:function(length) { return this.base64Random(length,0,52); },
		base26UniqueRandom:function(length,prefix) { return this.base64UniqueRandom(length || 6,prefix,0,52); }
	});
	
	//******************
	//ClientKit
	nody.singleton("NFClient",{
		agent :function(t){ 
			return (typeof t === "string") ? ((navigator.userAgent||navigator.vendor||window.opera).toLowerCase().indexOf(t.toLowerCase()) > -1) : (navigator.userAgent||navigator.vendor||window.opera);
		},
		info:nody.env,
		width :function(){ return (window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth); },
		height:function(){ return (window.innerHeight|| document.documentElement.clientHeight|| document.getElementsByTagName('body')[0].clientHeight); },
		bound :function(){ return {"width":this.width(),"height":this.height()}; },
		//document path
		url      : function()    { return window.document.URL.toString(); },
		urlInfo  : function(url) { return nody.url.info(); },
		root      : function(url,slash) { return nody.url.root(); },
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
		scriptUrl  : (function(){ var scripturl = nody.url.script(); return function(){ return scripturl; } })(),
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
				 utf8v.writeUTFBytes(NFUtil.encodeString(v));
				 air.EncryptedLocalStore.setItem(k,utf8v);
			} else {
				return this.setCookie(k,NFUtil.encodeString(v));
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
					return NFUtil.decodeString(bi.readUTFBytes(bi.bytesAvailable));
				}
			} else {
				return NFUtil.decodeString(this.getCookie(k));
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
		include:function(aFilename){ return nody.include(aFilename); },
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
	nody.singleton("NFUID",{
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
	nody.module("NFMeta",{
		//validate
		isValid :function() { return this.Source == false ? false : true; },
		//data
		data    :function(v){ if(this.isValid()){ return W.ManagedMetaObjectData[this.Source]; } },
		getOwner:function() { if(this.isValid()) return NFUID.getObject(this.Source); },
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
			var _keys   = new NFArray(keys);
			var _toKeys = new NFArray(toKeys);
			
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
				console.warn("NFMeta::keyChange는 이전값과 바꿀값의 길이가 같아야합니다.");
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
		destroy   :function() { if(this.isValid()){ W.ManagedMetaObjectData[this.Source] = undefined; NFUID.destroy(this.Source); return true;} return false; },
		lastProp:function(propName){ var r = this.getProp(propName); this.destroy(); return r; },
		lastData:function(){ var r = this.data(); this.destroy(); return r; },
		destroyTimeout:function(time){ var own = this; setTimeout(function(){ own.destroy(); },TONUMBER(time));}
	},function(v,d){
		if(typeof v === "object" || typeof v === "function"){
			this.Source = NFUID.get(v);
			if(!(this.Source in W.ManagedMetaObjectData)){
				if(typeof d === "object"){
					W.ManagedMetaObjectData[this.Source] = CLONE(d);
				} else if(typeof d === "undefined"){
					W.ManagedMetaObjectData[this.Source] = {};
				} else {
					console.warn("NFMeta::init::Meta의 셋팅할 property값은 Object만 가능합니다. => ",v,d)
					W.ManagedMetaObjectData[this.Source] = {};
				}
			}
		} else {
			console.error("NFMeta::init::Meta는 Object나 function만 가능합니다. => ",v,d)
			this.Source = false;
		}
	});
	_NFMeta.trace = function(){
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

/*!
 * Sizzle CSS Selector Engine
 * v2.2.0-pre | (c) jQuery Foundation, Inc. | jquery.org/license
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 */

//slzzle fix and forEach polyfill

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function(callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}

//
!function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=gb(),z=gb(),A=gb(),B=function(a,b){return a===b&&(l=!0),0},C=1<<31,D={}.hasOwnProperty,E=[],F=E.pop,G=E.push,H=E.push,I=E.slice,J=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},K="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",L="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",N="\\["+L+"*("+M+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+M+"))|)"+L+"*\\]",O=":("+M+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+N+")*)|.*)\\)|)",P=new RegExp(L+"+","g"),Q=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g"),R=new RegExp("^"+L+"*,"+L+"*"),S=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),T=new RegExp("="+L+"*([^\\]'\"]*?)"+L+"*\\]","g"),U=new RegExp(O),V=new RegExp("^"+M+"$"),W={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),TAG:new RegExp("^("+M+"|[*])"),ATTR:new RegExp("^"+N),PSEUDO:new RegExp("^"+O),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+K+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},X=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,Z=/^[^{]+\{\s*\[native \w/,$=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,_=/[+~]/,ab=/'|\\/g,bb=new RegExp("\\\\([\\da-f]{1,6}"+L+"?|("+L+")|.)","ig"),cb=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},db=function(){m()};try{H.apply(E=I.call(v.childNodes),v.childNodes),E[v.childNodes.length].nodeType}catch(eb){H={apply:E.length?function(a,b){G.apply(a,I.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function fb(a,b,d,e){var f,h,j,k,l,o,r,s,w,x;if((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,d=d||[],k=b.nodeType,"string"!=typeof a||!a||1!==k&&9!==k&&11!==k)return d;if(!e&&p){if(11!==k&&(f=$.exec(a)))if(j=f[1]){if(9===k){if(h=b.getElementById(j),!h||!h.parentNode)return d;if(h.id===j)return d.push(h),d}else if(b.ownerDocument&&(h=b.ownerDocument.getElementById(j))&&t(b,h)&&h.id===j)return d.push(h),d}else{if(f[2])return H.apply(d,b.getElementsByTagName(a)),d;if((j=f[3])&&c.getElementsByClassName)return H.apply(d,b.getElementsByClassName(j)),d}if(!(!c.qsa||A[a+" "]||q&&q.test(a))){if(s=r=u,w=b,x=1!==k&&a,1===k&&"object"!==b.nodeName.toLowerCase()){o=g(a),(r=b.getAttribute("id"))?s=r.replace(ab,"\\$&"):b.setAttribute("id",s),s="[id='"+s+"'] ",l=o.length;while(l--)o[l]=s+qb(o[l]);w=_.test(a)&&ob(b.parentNode)||b,x=o.join(",")}if(x)try{return H.apply(d,w.querySelectorAll(x)),d}catch(y){}finally{r||b.removeAttribute("id")}}}return i(a.replace(Q,"$1"),b,d,e)}function gb(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function hb(a){return a[u]=!0,a}function ib(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function jb(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function kb(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||C)-(~a.sourceIndex||C);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function lb(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function mb(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function nb(a){return hb(function(b){return b=+b,hb(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function ob(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=fb.support={},fb.expando=u,f=fb.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=fb.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=g.documentElement,e=g.defaultView,e&&e!==e.top&&(e.addEventListener?e.addEventListener("unload",db,!1):e.attachEvent&&e.attachEvent("onunload",db)),p=!f(g),c.attributes=ib(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ib(function(a){return a.appendChild(g.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Z.test(g.getElementsByClassName),c.getById=ib(function(a){return o.appendChild(a).id=u,!g.getElementsByName||!g.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(bb,cb);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(bb,cb);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=Z.test(g.querySelectorAll))&&(ib(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+L+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+L+"*(?:value|"+K+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ib(function(a){var b=g.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+L+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Z.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ib(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",O)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Z.test(o.compareDocumentPosition),t=b||Z.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===g||a.ownerDocument===v&&t(v,a)?-1:b===g||b.ownerDocument===v&&t(v,b)?1:k?J(k,a)-J(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,h=[a],i=[b];if(!e||!f)return a===g?-1:b===g?1:e?-1:f?1:k?J(k,a)-J(k,b):0;if(e===f)return kb(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)i.unshift(c);while(h[d]===i[d])d++;return d?kb(h[d],i[d]):h[d]===v?-1:i[d]===v?1:0},g):n},fb.matches=function(a,b){return fb(a,null,null,b)},fb.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(T,"='$1']"),!(!c.matchesSelector||!p||A[b+" "]||r&&r.test(b)||q&&q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return fb(b,n,null,[a]).length>0},fb.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},fb.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&D.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},fb.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},fb.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=fb.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=fb.selectors={cacheLength:50,createPseudo:hb,match:W,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(bb,cb),a[3]=(a[3]||a[4]||a[5]||"").replace(bb,cb),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||fb.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&fb.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return W.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&U.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(bb,cb).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+L+")"+a+"("+L+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=fb.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(P," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){k=q[u]||(q[u]={}),j=k[a]||[],n=j[0]===w&&j[1],m=j[0]===w&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[w,n,m];break}}else if(s&&(j=(b[u]||(b[u]={}))[a])&&j[0]===w)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(s&&((l[u]||(l[u]={}))[a]=[w,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||fb.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?hb(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=J(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:hb(function(a){var b=[],c=[],d=h(a.replace(Q,"$1"));return d[u]?hb(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:hb(function(a){return function(b){return fb(a,b).length>0}}),contains:hb(function(a){return a=a.replace(bb,cb),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:hb(function(a){return V.test(a||"")||fb.error("unsupported lang: "+a),a=a.replace(bb,cb).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Y.test(a.nodeName)},input:function(a){return X.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:nb(function(){return[0]}),last:nb(function(a,b){return[b-1]}),eq:nb(function(a,b,c){return[0>c?c+b:c]}),even:nb(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:nb(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:nb(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:nb(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=lb(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=mb(b);function pb(){}pb.prototype=d.filters=d.pseudos,d.setFilters=new pb,g=fb.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=R.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=S.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(Q," ")}),h=h.slice(c.length));for(g in d.filter)!(e=W[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?fb.error(a):z(a,i).slice(0)};function qb(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function rb(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[u]||(b[u]={}),(h=i[d])&&h[0]===w&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function sb(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function tb(a,b,c){for(var d=0,e=b.length;e>d;d++)fb(a,b[d],c);return c}function ub(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function vb(a,b,c,d,e,f){return d&&!d[u]&&(d=vb(d)),e&&!e[u]&&(e=vb(e,f)),hb(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||tb(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:ub(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=ub(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?J(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=ub(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):H.apply(g,r)})}function wb(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=rb(function(a){return a===b},h,!0),l=rb(function(a){return J(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[rb(sb(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return vb(i>1&&sb(m),i>1&&qb(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(Q,"$1"),c,e>i&&wb(a.slice(i,e)),f>e&&wb(a=a.slice(e)),f>e&&qb(a))}m.push(c)}return sb(m)}function xb(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,m,o,p=0,q="0",r=f&&[],s=[],t=j,u=f||e&&d.find.TAG("*",k),v=w+=null==t?1:Math.random()||.1,x=u.length;for(k&&(j=g!==n&&g);q!==x&&null!=(l=u[q]);q++){if(e&&l){m=0;while(o=a[m++])if(o(l,g,h)){i.push(l);break}k&&(w=v)}c&&((l=!o&&l)&&p--,f&&r.push(l))}if(p+=q,c&&q!==p){m=0;while(o=b[m++])o(r,s,g,h);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=F.call(i));s=ub(s)}H.apply(i,s),k&&!f&&s.length>0&&p+b.length>1&&fb.uniqueSort(i)}return k&&(w=v,j=t),r};return c?hb(f):f}h=fb.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=wb(b[c]),f[u]?d.push(f):e.push(f);f=A(a,xb(e,d)),f.selector=a}return f},i=fb.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(bb,cb),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=W.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(bb,cb),_.test(j[0].type)&&ob(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&qb(j),!a)return H.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,_.test(a)&&ob(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ib(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),ib(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||jb("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ib(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||jb("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ib(function(a){return null==a.getAttribute("disabled")})||jb(K,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),"function"==typeof define&&define.amd?define(function(){return fb}):"undefined"!=typeof module&&module.exports?module.exports=fb:a.Sizzle=fb}(window);

//Nody Node Foundation 
(function(W,ENV){
	
	var ELUT_REGEX = new RegExp("("+ [
		//pseudo
		"\\:[^\\:]+",
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
	
	safeParseMap = {
		option : [1,"<select multiple='multiple'>", "</select>" ],
		legend : [1,"<fieldset>", "</fieldset>" ],
		area   : [1,"<map>", "</map>" ],
		param  : [1,"<object>", "</object>" ],
		thead  : [1,"<table>", "</table>" ],
		tr     : [2,"<table><tbody>", "</tbody></table>" ],
		col    : [2,"<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td     : [3,"<table><tbody><tr>", "</tr></tbody></table>" ]
	};
	safeParseMap.optgroup = safeParseMap.option;
	safeParseMap.tbody    = safeParseMap.tfoot 
						  = safeParseMap.colgroup 
						  = safeParseMap.caption 
						  = safeParseMap.thead;
	safeParseMap.th       = safeParseMap.td;
	
	nody.singleton("ELUT",{
		"ELPARSE":function(html){
			//if has cache
			var cache = nody.cache.get("ELPARSE",html);
			if(cache) return CLONENODES(cache);
			
			//text node
			if( !/<|&#?\w+;/.test(html) ) return [];
			
			//html
			var tagName=/<([\w]+)/.exec(html), tagName=tagName?tagName[1].toLowerCase():"",
			    parseWrapper = document.createElement("div"), parseDepth = 0;
			
			if( tagName in safeParseMap) {
				parseWrapper.innerHTML = safeParseMap[tagName][1] + html + safeParseMap[tagName][2];
				parseDepth = safeParseMap[tagName][0];
			} else {
				parseWrapper.innerHTML = html;
			}
			
			while ( parseDepth-- ) parseWrapper = parseWrapper.lastChild;
			
			nody.cache.set("ELPARSE",html,CLONENODES(parseWrapper.children));
			return CLONEARRAY(parseWrapper.children);
		},
		
		//테그의 속성을 text로 표현합니다.
		"SELECTINFO"   : function(tagProperty,attrValue){ 
			tagProperty = (typeof tagProperty !== "string") ? "" : tagProperty;
			
			//캐쉬를 이용해 잦은 표현에 대한 오버해드를 줄입니다.
			var result = nody.cache.get("SELECTINFO",tagProperty);
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
				nody.cache.set("SELECTINFO",tagProperty,CLONEOBJECT(result));
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
		"TAG" : CONTINUEFUNCTION(function(tagProperty,attrValue){
			
			if(typeof tagProperty === "object"){
				var tagText = [];
				DATAEACH(tagProperty,function(tag){ if(ISELNODE(tag)) tagText.push(tag.outerHTML); });
				return tagText.join('');
			}
			
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
				var result = nody.cache.get("TAG",cacheName);
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
			
			if(cacheName) nody.cache.set("TAG",cacheName,[cachePrefix,cacheSuffix]);
			
			
			return (cachePrefix + tagValue + cacheSuffix);
		},1),
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
		"PRINT":function(a){ return CREATE("div",a,W.document); }
	});
	ELUT.eachGetter();
	nody.singleton("NUT",{
		"ATTR":function(node,v1,v2){
			if(!ISELNODE(node)) { console.error("NUT.ATTR은 element만 가능합니다. => 들어온값" + TOS(node)); return null; }
			if(arguments.length === 1) {
				return INJECT(node.attributes,function(inj,attr){
					inj[attr.name] = node.getAttribute(attr.name);
				});				
			} else if(typeof v1 === "object") {
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
			            	for(var i = 0; i < length; i++)
								if(attrs[i].nodeName === v1) {
									result = attrs[i].value;
									if(typeof result === "undefined") result = attrs[i].nodeValue;
								} 
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
		"THE":function(node,selectText){
			return nody.env.matchesSelector ? nody.env.matchesSelector(node,selectText) : Sizzle.matchesSelector(node,selectText);
		},
		//다수의 CSS테스트
		"IS":function(node,selectText){
			if(!ISELNODE(node)) return false;
			if((typeof selectText === "undefined") || selectText == "*" || selectText == "") return true;
			return nody.env.matchesSelector ? nody.env.matchesSelector(node,selectText) : Sizzle.matchesSelector(node,selectText);
		},
		//쿼리셀렉터와 약간 다른점은 부모도 쿼리 셀렉터에 포함된다는 점
		"QUERY":(function(){
			envQuerySelectorAll = nody.env.querySelectorAll;
			return nody.env.supportStandardQuerySelectorAll ? 
			function(query,root){
				//querySelectorSupport
				if(typeof query !== "string" || (query.trim().length == 0)) return [];
				root = ((typeof root === "undefined")?document:ISELNODE(root)?root:document);
				if(root == document) {
					return envQuerySelectorAll(root,query);
				} else {
					if(NUT.IS(root,query)) return [root].concat(Array.prototype.slice.call(envQuerySelectorAll(root,query)));
					return envQuerySelectorAll(root,query);
				}
			} : function(query,root){
				if(typeof query !== "string" || (query.trim().length == 0)) return [];
				root = ISELNODE(root) ? root : undefined;
				if(root == document) {
					return Sizzle(query,root);
				} else {
					if(NUT.IS(root,query)) return [root].concat(Sizzle(query,root));
					return Sizzle(query,root);
				}
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
	
	
	nody.singleton("FINDEL",{
		//배열이든 뭐든 노드로만 반환
		"FSINGLE":function(find){
			if( typeof find === 'string' ){
				// [string,null]
				return NUT.QUERY(find);
			} else if(ISELNODE(find)){
				// [node]
				return [find];
			}  else if(ISARRAY(find)) {
				// [array]
				var fc = [];
				for(var i=0,l=find.length;i<l;i++) { 
					if( typeof find[i] === 'string' ) {
						// [array][string]
						var fs = NUT.QUERY(find[i]);
						if(fs.length) fc = fc.concat( fs );
					} else if(ISELNODE(find[i])) {
						// [array][node]
						fc.push(find[i]);
					} else if(ISARRAY(find[i])){
						var fa = FSINGLE(find[i]);
						if(fa.length) fc = fc.concat( fa );
					}
				}
				return DATAUNIQUE(fc);
			}
			return [];
		},
		//하나의 루트노드만 허용
		"FDOUBLE":function(findse,rootNode){
			if(typeof findse === 'string') return NUT.QUERY(findse,rootNode);
			if( ISELNODE(findse) ) {
				var fs = NUT.QUERY(ELTRACE(findse),rootNode);
				for(var i=0,l=fs.length;i<l;i++) if(findse === fs[i]) return [findse];
			}
			if( ISARRAY(findse) ) {
				var result = [];
				for(var i=0,l=findse.length;i<l;i++) {
					var fd = FDOUBLE(findse[i],rootNode);
					if( fd.length ) result = result.concat(fd);
				}				
				return DATAUNIQUE(result);
			}
			return [];
		},
		//다수의 노드들을 받고 출력
		"FADVENCE":function(find,root){
			if(arguments.length === 1) return FSINGLE(find);
			var targetRoots = FSINGLE(root);
			if(targetRoots.length === 0) {
				if(typeof root !== 'undefined' || root === null) return [];
				return FSINGLE(find);
			} 
			var findes = TOARRAY(find);
			var result = [];
			for(var i=0,l=targetRoots.length;i<l;i++) {
				for(var fi=0,fl=findes.length;fi<fl;fi++) {
					var fdr = FDOUBLE(findes[fi],targetRoots[i]);
					if( fdr.length ) result = result.concat(fdr);
				}
			}
			return DATAUNIQUE(result);
		},
		"FIND" : CONTINUEFUNCTION(function(find,root,eq){
			return (typeof root === "number") ? FSINGLE(find)[root] :
				   (typeof eq === "number")   ? FADVENCE(find,root)[eq] :
				   FADVENCE(find,root);
		}),
		"FINDMEMBER":function(sel,offset){
			var target = FSINGLE(sel)[0];
			if(!ISELNODE(target)) return;
			if(typeof offset !== "number") return TOARRAY(target.parentElement.children);
			var currentIndex = -1;
			DATAEACH(target.parentNode.children,function(node,i){ if(target == node) { currentIndex = i; return false; } });
			return target.parentNode.children[currentIndex+offset];
		},
		// 하위루트의 모든 노드를 검색함 (Continutiltiy에서 중요함)
		"FINDIN" : CONTINUEFUNCTION(function(root,find,index){
			return (typeof index === 'number') ? FADVENCE(find || '*',DATAMAP(FADVENCE(root),function(node){ return node.children },DATAFLATTEN))[index] :
				   (typeof find  === 'number') ? FADVENCE('*',DATAMAP(FADVENCE(root),function(node){ return node.children },DATAFLATTEN))[find]   :
												 FADVENCE(find || '*',DATAMAP(FADVENCE(root),function(node){ return node.children },DATAFLATTEN)) ;
		},2),
		// 자식루트의 노드를 검색함
		"FINDON": CONTINUEFUNCTION(function(root,find){
			var finds = DATAMAP(FADVENCE(root),function(node){ return node.children; },DATAFLATTEN);
			switch(typeof find){
				case "number": return [finds[find]]; break;
				case "string": return DATAFILTER(finds,function(node){ return NUT.IS(node,find); }); break;
				default      : return finds; break;
			}
		},1),
		"FINDPARENTS":CONTINUEFUNCTION(function(el,require,index){ 
			if(typeof require === 'string') {
				return (typeof index === 'number') ?
				DATAFILTER(NUT.PARENTS(FADVENCE(el)[0]),function(el){ return ELIS(el,require); })[index]:
				DATAFILTER(NUT.PARENTS(FADVENCE(el)[0]),function(el){ return ELIS(el,require); });
			} else if(typeof require === 'number') {
				return NUT.PARENTS(FADVENCE(el)[0])[require];
			} else {
				return NUT.PARENTS(FADVENCE(el)[0]);
			}
		},1),
		"FINDBEFORE":CONTINUEFUNCTION(function(node,filter){ 
			node = FSINGLE(node)[0];
			var index = ELINDEX(node); 
			var result = []; 
			if(typeof index === "number") {
				switch(typeof filter) {
					case 'string':
						for(var i=0,l=index;i<l;i++){
							var fnode = node.parentNode.children[i];
							ELIS(fnode,filter) && result.push(fnode);
						} 
						break;
					case 'number':
						result.push(node.parentNode.children[index - (filter+1)]);
						break;
					default :
						for(var i=0,l=index;i<l;i++) result.push(node.parentNode.children[i]); 	
						break;
				}
			}
			return result; 
		},1),
		"FINDAFTER":CONTINUEFUNCTION(function(node,filter){ 
			node = FSINGLE(node)[0];
			var index = ELINDEX(node); 
			var result = []; 
			if(typeof index === "number") {
				switch(typeof filter) {
					case 'string':
						for(var i=index+1,l=node.parentNode.children.length;i<l;i++){
							var fnode = node.parentNode.children[i];
							ELIS(fnode,filter) && result.push(fnode);
						}
						break;
					case 'number':
						result.push(node.parentNode.children[index + (filter+1)]);
						break;
					default :
						for(var i=index+1,l=node.parentNode.children.length;i<l;i++) result.push(node.parentNode.children[i]); 
						break;
				}
			}
			return result; 
		},1),
		"FINDPARENT" :CONTINUEFUNCTION(function(el,require,index){
			if( (typeof require === 'number') || ((typeof require === 'string') && (typeof index === 'number')) ) return DATAZERO(FINDPARENTS(el,require,index));
			var node = FSINGLE(el)[0];
			if(node) {
				if(typeof require === "string"){
					var parents = NUT.PARENTS(node);
					for(var i in parents) if( NUT.IS(parents[i],require) ) return parents[i];
				} else {
					return node.parentElement;
				}
			}
			return undefined;
		},1),
		"FINDDOCUMENT":CONTINUEFUNCTION(function(iframeNode){
			var iframe = FSINGLE(iframeNode)[0];
			if(iframe) {
				if(iframe.tagName == "IFRAME") return iframe.contentDocument || iframe.contentWindow.document;
				if(ISDOCUMENT(iframe)) return iframe;
			} else {
				console.warn('iframe을 찾을 수 없습니다.',iframeNode);
			}
		},1),
		"FINDTREE":CONTINUEFUNCTION(function(node,stringify){
			var treeNode = FSINGLE(node)[0];
			if(!treeNode) return [];
			
			var tree = FINDPARENTS(treeNode,DATAMAP,function(){ return (stringify === true ? ELTRACE(this) : this ); });
			tree.reverse();
			tree.push( (stringify === true ? ELTRACE(treeNode) : treeNode ) );
			return tree;
		},1),
		"FINDOFFSET" :function(node,target,debug){
			var node = FSINGLE(node)[0];
			if(node) {
				var l=t=0,w=node.offsetWidth,h=node.offsetHeight;
				target = FSINGLE(target)[0] || document.body;
				do {
					l += node.offsetLeft;
					t += node.offsetTop;
					if(debug === true)console.log(l,t,node,target);
					if(!node.offsetParent) break;
					if(node === target) break;
					node = node.offsetParent;
				} while(true);
				var dualObject = [l,t,w,h];
				dualObject.x = l;
				dualObject.y = t;
				dualObject.width  = w;
				dualObject.height = h;
				return dualObject;
			}
		}
	});
	FINDEL.eachGetter();
	
	nody.singleton("GUT",{
		"CREATE" :function(name,attrValue,parent){
			var element,skipRender,name=(typeof name !== "string") ? "div" : name.trim();
			//nf foundation
			name = name.replace(/\[\[[\w\-\|\s]+\]\]/ig,function(s){ 
				s = s.substr(2,s.length-4);
				var pipe = s.indexOf('|');
				return (pipe > 0) ? '[nf-'+s.substr(pipe+1)+'='+s.substr(0,pipe)+']' : '[nf-value='+s+']';
			});
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
				var cacheNode = nody.cache.get("CREATE",cacheName);
				if(cacheNode) {
					element    = CLONENODES(cacheNode)[0];
					skipRender = true;
				}
			}
			
			//랜더링 시작
			if(!skipRender){
				element = ELPARSE( (name.indexOf("<") !== 0) ? TAG(name,attrValue) : name )[0];
				//캐시 저장
				if(cacheEnable) nody.cache.set("CREATE",cacheName,CLONENODES(element)[0]);
			}
			
			//랜더링 후처리
			if(dataset) for(var key in dataset) {
				//ie11 lt fix
				if(!element.dataset) element.dataset = {};
				element.dataset[key] = dataset[key];
			}
			if(htmlvalue) {
				if(("value" in element) && !element.tagName.match(/LI|BUTTON/) ) {
					element.setAttribute("value",htmlvalue)
				} else {
					element.innerHTML = htmlvalue;
				}
			}			
			
			//부모에게 어팬딩함
			parent = FSINGLE(parent)[0];
			if(parent){
				if(parent==W.document) parent = W.document.getElementsByTagName("body")[0];
				parent.appendChild(element);
			}
			return element;	
		},
		"CREATETO":function(node,parent){ return CREATE(node,undefined,parent); },
		//get text node element
		"MAKETEXT":CONTINUEFUNCTION(function(t){ return W.document.createTextNode(t); },1),
		"MAKE":CONTINUEFUNCTION(function(name,attr,third){
			if ( ISARRAY(attr) || ISELNODE(attr) || ISTEXTNODE(attr) ) {
				var createNode = CREATE(name);
				ELAPPEND(createNode,new NFArray(arguments).subarr(1).flatten().toArray());
				return createNode;
			} else if(ISELNODE(third) || ISTEXTNODE(third)){
				var createNode = CREATE(name, attr);
				ELAPPEND(createNode,new NFArray(arguments).subarr(2).flatten().toArray());
				return createNode;
			} else {
				return CREATE(name, attr);
			}	
		},1),
		"MAKES":CONTINUEFUNCTION(function(fulltag,root){
			var makeRoot   = FIND(root,0);
			var incomeRoot = !!makeRoot;
			if(!incomeRoot) makeRoot = MAKE('div');
			
			var divideIndex = fulltag.indexOf(">");
			
			if(divideIndex>0) {
				var currentTag  = fulltag.substr(0,divideIndex);
				var nextTag     = fulltag.substr(divideIndex+1).trim();
				var firstCursor = nextTag.indexOf("^");
				var nnextTag    = nextTag.indexOf(">");
				
				if( firstCursor > 1 ){
					if( nnextTag == -1 || firstCursor < nextTag.indexOf(">") ){
						var nextCursor,cursorDepth,nextTag = nextTag.replace(/\^.+/,function(s){
							nextCursor = s.replace(/[\^]+/,function(s){
								cursorDepth = s.length;
								return "";
							}).trim();
							return "";
						}).trim();
					}
				}
			} else {
				var currentTag  = fulltag
				var nextTag     = ''
			}
			
			var multiMake    = currentTag.split(/\+|\,/);
			var multiMakeEnd = currentTag.split(/\+|\,/).length-1;
			
			
			DATAEACH(multiMake,function(eachtag,eachtagIndex){
				///////////////
				var repeat = 1;
				//repeat
				eachtag = eachtag.replace(/\*[\d]+$/,function(s){
					repeat = parseInt(s.substr(1)); return "";
				});
				//generate
				var findroot = FSINGLE(root)[0];
				TIMES(repeat,function(i){
					var rtag     = eachtag.replace("$",i+1);
					var rtagNode = MAKE(rtag);
					
					makeRoot.appendChild(rtagNode);
					
					if(eachtagIndex == multiMakeEnd) {
						if(nextTag.length > 0) MAKES(nextTag,rtagNode);
						if(nextCursor){
							var findRoot = makeRoot;
							TIMES(cursorDepth-1,function(){
								if(findRoot && findRoot.parentElement) {
									findRoot = findRoot.parentElement;
								} else {
									return false;
								}
							});
							if(findRoot) MAKES(nextCursor,findRoot);
						}
					}
				});
			});
			return TOARRAY(makeRoot.children);
		},1),
		"TAGS":CONTINUEFUNCTION(function(fulltag){
			return MAKES(fulltag,TAG);
		},1),
		// 각 arguments에 수치를 넣으면 colgroup > col, col... 의 width값이 대입된다.
		"MAKECOLS":function(){ 
			return MAKE('colgroup', DATAMAP(arguments,function(arg){
					return CREATE('col', (/^\d/.test(arg)) ? {width:arg} : {'class':arg});
			}) );
		},
		"MAKETEMP":function(innerHTML,id){
			var temphtml = (typeof id === "string") ? ('<template id="' + id + '">') : '<template>' ;
				temphtml += innerHTML;
				temphtml += '</template>';
			return ELPARSE(temphtml)[0];
		},
		"MAKEIMG":function(src,width){
			if(typeof src === 'string') {
				var param = {src:src};
				if(width) param.style =  'width:'+ TOPX(width)+';'
				return MAKE('img',param);
			} else if (ISELNODE(src)){
				if(src.files && src.files[0]){
					if (!src.files[0].type.match(/image.*/)) return;
					var result = MAKE('img');
					var reader = new FileReader();
					reader.onload = function(e){
						result.src = e.target.result;
					};
					reader.readAsDataURL(src.files[0]); 
					return result;
				}
			}
		},
		"MAKECANVAS":function(width,height,render){
			var canvas = document.createElement("canvas");
			canvas.setAttribute("width",width?width:"auto");
			canvas.setAttribute("height",height?height:"auto");
			
			function srcToCanvasRender(src){
				var img = document.createElement('img');
				img.onload = function() {  canvas.getContext("2d").drawImage(this, 0, 0,width,height); }
				img.src = src;
			}
			
			if( ISELNODE(render) ) {
				if(render.tagName === "IMG") {
					render = render.src;
				} else if(render.files) {
					if(render.files[0]) {
						var file = render.files[0];
						if (!file.type.match(/image.*/)) return;
						var reader = new FileReader();
						reader.onload = function(e){
							srcToCanvasRender(e.target.result);
						};
						reader.readAsDataURL(file); 
						src = undefined;
					}
				} 
			}
			if( typeof render === "string") srcToCanvasRender(render);
			else CALL(render,canvas,canvas.getContext("2d"));
			return canvas;
		},
		"TOOBJECT":function(param,es,kv){
			if(typeof param=="object") return param;
			if(kv == true && ( typeof param === "string" || typeof es === "string")){ var r = {}; r[es] = param; return r; }
			if(typeof param=="string" || typeof param=="boolean") {
				var c = TRYCATCH(function(){
					if(JSON == aJSON) throw new Error("not json supported browser");
					var jp = JSON.parse(param);
					if(typeof jp !== "object") throw new Error("pass");
				},function(e){
					if( (new NFString(param)).isDataContent()=="plain" ){
						var esv = (typeof es === "string" ? es : "value");
						var reo={};reo[esv]=param;
						return reo;
					}
					return (new NFString(param)).getDataContent();
				});
			}
			return c || {};
		},
		//노드 배열을 복사함
		"CLONENODES":function(node){
			return DATAMAP(FSINGLE(node),function(findNode){ return findNode.cloneNode(findNode,true); });
		},
		//하위의 노드를 모두 복사함
		"IMPORTNODE":function(node,parent){
			node = FSINGLE(node);
			if( node.length === 0) return undefined;
			if( node.length !== 1 ) console.warn("IMPORTNODE:: 한개의 노드만 복사할수 있습니다.",node);
			node = DATAZERO(node);
			
			var result;
			if('content' in node){
				result = FIND(document.importNode(node.content,true).childNodes);
			} else {
				result = CLONENODES(node.children);
			}
			
			if(parent){
				parent = FSINGLE(parent)[0];
				if(parent) ELAPPEND(parent,result);
			}
			
			return result;
			
		},
		"CLONEOBJECT":function(inv){ if(typeof inv === "object"){ var result = {}; for(var k in inv) result[k] = inv[k]; return result; } return TOOBJECT(inv); },
		//오브젝트 혹은 element를 반환합니다.
		"DATACONTEXT":function(target){
			if ( typeof target === "string" ) target = FSINGLE(target)[0];
			if ( typeof target === "object" ) {
				if( this.ISARRAY(target) ){
					var findElement = FSINGLE(target)[0];
					if(findElement) return findElement;
				}
				return target;
			}
			return undefined;
		}
	})
	GUT.eachGetter();
	
	// addEventListener polyfill by https://gist.github.com/jonathantneal/3748027
	!window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
		WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
			var target = this;
 
			registry.unshift([target, type, listener, function (event) {
				event.currentTarget = target;
				event.preventDefault = function () { event.returnValue = false };
				event.stopPropagation = function () { event.cancelBubble = true };
				event.target = event.srcElement || target;
 
				listener.call(target, event);
			}]);
 
			this.attachEvent("on" + type, registry[0][3]);
		};
 
		WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
			for (var index = 0, register; register = registry[index]; ++index) {
				if (register[0] == this && register[1] == type && register[2] == listener) {
					return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
				}
			}
		};
 
		WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
			return this.fireEvent("on" + eventObject.type, eventObject);
		};
	})(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
	
	
	nody.singleton("EL",{
		//포커스 상태인지 검사합니다.
		"HASFOCUS":function(sel){ return document.activeElement == FSINGLE(sel)[0]; },
		//케럿을 움직일수 있는 상태인지 검새합니다.
		"CARETPOSSIBLE":function(sel){ var node = FSINGLE(sel)[0]; if( ELHASFOCUS(node) == true) if(node.contentEditable == true || window.getSelection || document.selection) return true; return false; },
		//어트리뷰트값을 읽거나 변경합니다.
		"ATTR":function(sel,v1,v2){ var node = FSINGLE(sel)[0]; if(node) return NUT.ATTR.apply(undefined,Array.prototype.slice.call(arguments)); },
		//css스타일로 el의 상태를 확인합니다.
		"IS":function(sel,value){ var node = FSINGLE(sel)[0]; if(node)return NUT.IS(node,value); },
		//선택한 element중 대상만 남깁니다.
		"FILTER":function(sel,filter){
			var targets = FSINGLE(sel);
			if(typeof filter !== "string") {
				console.warn("ELFILTER는 string filter만 대응합니다.");
				return targets;
			} else {
				var result  = [];
				for(var i=0,l=targets.length;i<l;i++) if(ELIS(targets[i],filter)) result.push(targets[i]);
				return result;
			}
		},
		"CONTENT":function(node,setValue){
			var node = FSINGLE(node)[0];
			if(node) {
				if(typeof setValue === 'undefined') return node.textContent || node.innerText;
				//set
				if('textContent' in node) node.textContent = setValue + '';
				else node.innerText = setValue + '';
			}
			return node;
		},
		//el의 중요값을 찾거나 변경합니다.
		"VALUE":function(aNode,value){
			var node,nodes = FSINGLE(aNode);
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
							var findEl = FIND(ELFILTER(nodes,"[type=radio][name="+nodeZeroName+"]::"+value,0));
							if(findEl) findEl.checked = true;
							return findEl;
						} else {
							return FIND(ELFILTER(nodes,"[type=radio][name="+nodeZeroName+"]:checked"),0) || "";
						}
					}
				}
			}
			node     = DATAZERO(nodes);
			nodeName = node.tagName.toLowerCase();
			switch(nodeName){
				case "img" :case "script": if(arguments.length < 2) return node.src; node.src = value; return node; break;
				case "link":if(arguments.length < 2) return node.rel; node.rel = value; return node; break;
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
						return node;
					} else {
						node.value = value;
						return node;
					}
					break;
				case "select":
					if(typeof value === "undefined") return node.value;
					var valEl = FIND("[value="+ value +"]",node);
					if(valEl.length > 0) {
						var selEl = DATAZERO(valEl);
						selEl.selected = true;
						return selEl;
					}
					return false;
					break;
				default :
					//elcontent에서 자동을 getset을 실행함
					return ELCONTENT(node,value);
				break;
			}
			return node;
		},
		"HASATTR":function(sel,name,hideConsole){
			var node = FSINGLE(sel)[0];
			if(node) { return ELATTR(sel,name) == null ? false : true; }
			if(hideConsole !== true) console.error("ELHASATTR:: 알수없는 node값 입니다. => " + TOS(node) );
			return false;
		},
		"UNIQUE":function(sel){
			var node = FSINGLE(sel)[0];
			if(node) { if(!ELHASATTR(node,"id")) node.setAttribute("id",NFUtil.base26UniqueRandom(8,'uq')) }
			return node;
		},
		"UNIQUEID":function(sel){
			var result = ELUNIQUE(sel);
			if(result) { return result.getAttribute("id") }
		},
		//get css style tag info
		"TRACE"   :function(target,detail){
			var t = FSINGLE(target)[0];
			if( t ){
				var tag = t.tagName.toLowerCase();
				var tid = tclass = tname = tattr = tvalue = '';
				PROPEACH(NUT.ATTR(t),function(value,sign){
					switch(sign){
						case "id"   : var id = t.getAttribute(sign); id.length && (tid='#'+id) ; break;
						case "class": tclass = '.' + t.getAttribute(sign).trim().replace(/\s\s/g,' ').split(' ').join('.'); break;
						case "name" : tname  = "[name="+t.getAttribute(sign)+"]"; break;
						case "value": break;
						default     :
							if(detail == true) {
								attrValue = t.getAttribute(sign);
								tattr += ( (attrValue == '' || attrValue == null) ? ("["+sign+"]") : ("["+sign+"="+attrValue+"]") );
							}
						break; 
					}
				});
				if(detail == true) {
					if(!/table|tbody|thead|tfoot|ul|ol/.test(tag)) {
						var tv = ELVALUE(t);
						if(typeof tv !== undefined || tv !== null ) if(typeof tv === 'string' && tv.length !== 0) tvalue = '::'+tv;
						if(typeof tvalue === 'string') tvalue = tvalue.trim();
					}
					
				}
				return tag+tid+tclass+tname+tattr+tvalue;
			} else {
				console.warn("ELTRACE::target is not element or selector // target =>",target);
			}
		},
		"CALL":function(node,f){
			if(typeof f === "function"){
				var nodes = FSINGLE(node);
				DATAEACH(nodes,function(n,i){
					f.call(n,n,i);
				});
				return nodes;
			}
			return [];
		},
		"INDEX":function(el){
			var node = FSINGLE(el)[0];
			var parent = FINDPARENT(node);
			if(parent) return DATAINDEX(parent.children,node);
		},
		"APPEND":function(parentIn,childs){
			var parent = FSINGLE(parentIn)[0];
			if(!ISELNODE(parent)) return parentIn;
			var appendTarget  = FSINGLE(childs);
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
			var parent = FSINGLE(parentIn)[0];
			var appendTarget = FSINGLE(childs);
			if(ISOK(parent),ISOK(appendTarget)){
				ELAPPEND(parent,appendTarget);
				var newParent = FINDPARENT(appendTarget[0]);
				if(newParent) {
					DATAEACH(appendTarget,function(node,i){
						newParent.insertBefore(node,newParent.childNodes[i]);
					});
				}
			}
		},
		"APPENDTO":function(targets,parentEL){ return ELAPPEND(FSINGLE(parentEL)[0],targets); },
		"PUT":function(sel){
			var node = FSINGLE(sel)[0];
			if(!ISELNODE(node)) return console.warn("ELPUT:: node를 찾을수 없습니다. => 들어온값" + TOS(node));
			ELEMPTY(node);
			var newContents = [];
			var params = Array.prototype.slice.call(arguments);
			params.shift();
			DATAEACH( DATAFLATTEN(params) ,function(content){
				if(ISELNODE(content)){
					newContents.push(content);
				} else {
					content = TOSTRING(content);
					switch(node.tagName){
						case "UL":case "MENU":
							newContents.push(MAKE("li",content));
							break;
						case "DL":
							newContents.push(MAKE("dd",content));
							break;
						default:
							newContents.push(MAKE("span",content));
							break;	
					}
				}
			});
			ELAPPEND(node,newContents);
			return node;
		},
		//이전 엘리먼트를 찾습니다.
		"BEFORE":CONTINUEFUNCTION(function(node,appendNodes){ 
			var target = FSINGLE(node)[0];
			if(!ISELNODE(target)) return node;
			if(arguments.length < 2) return FINDMEMBER(target,-1);
			var appendTarget = FSINGLE(appendNodes);
			if(appendTarget.length > 0){
				for(var i=0,l=appendTarget.length;i<l;i++) target.parentNode.insertBefore(appendTarget[i],target); 
			}
			return target; 
		},1),
		
		//이후 엘리먼트를 찾습니다.
		"AFTER" :CONTINUEFUNCTION(function(target,appendNodes){ 
			target = FSINGLE(target)[0];
			if(!ISELNODE(target))    return target; 
			if(arguments.length < 2) return FINDMEMBER(target,1);
			var appendTarget = FSINGLE(appendNodes);
			if(appendTarget.length > 0){
				var afterElement = FINDMEMBER(target,1);
				if( ISELNODE(afterElement) ){
					for(var i=0,l=appendTarget.length;i<l;i++) target.parentNode.insertBefore(appendTarget[i],afterElement); 
				} else {
					ELAPPEND(target,appendTarget);
				}
			}
			return target;
		},1),
		"CHANGE":CONTINUEFUNCTION(function(left,right){
			left  = FSINGLE(left)[0];
			right = FSINGLE(right)[0];
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
		},1),
		"REPLACE":function(target,replaceNode){
			var replaceTarget = FSINGLE(replaceNode)[0];
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
			var target = FSINGLE(target)[0];
			if(ISELNODE(target)){
				if(typeof styleName === "undefined") return ENV.supportComputedStyle ? window.getComputedStyle(target,null) : target.currentStyle;
				if(typeof styleName === "string"){
					//mordern-style-name
					var prefixedName = ENV.getCSSName(styleName);
					//get
					if(typeof value === "undefined") 
						return ENV.supportComputedStyle ? window.getComputedStyle(target,null).getPropertyValue(prefixedName) : target.currentStyle[CAMEL(prefixedName)];
					
					//set
					var wasStyle = ELATTR(target,"style") || "";
					if(value === null) {
						wasStyle     = wasStyle.replace(new RegExp("(-webkit-|-o-|-ms-|-moz-|)"+styleName+"(.?:.?|)[^\;]+\;","g"),function(s){console.log(s); return ''});
						ELATTR(target,"style",wasStyle);
					} else {
						var prefixedValue = ENV.getCSSName(value);
						//set //with iefix
						wasStyle     = wasStyle.replace(new RegExp("(-webkit-|-o-|-ms-|-moz-|)"+styleName+".?:.?[^\;]+\;","g"),"");
						ELATTR(target,"style",prefixedName+":"+prefixedValue+";"+wasStyle);
					}
				}
			}
			return target;
		},
		//내무의 내용을 지웁니다.
		"EMPTY"  : function(target){ return FIND(target,DATAMAP,function(node){ if("innerHTML" in node) node.innerHTML = ""; return node; }); },
		//대상 객체를 제거합니다.
		"REMOVE" : function(node,childs){ var target = FSINGLE(node)[0]; if(!ISELNODE(target)) return target; if(!ISELNODE(target.parentNode)) return target; target.parentNode.removeChild(target); return target; },
		//케럿의 위치를 찾습니다.
		"CARET":function(select,pos){
			//
			var node = FSINGLE(select)[0];
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
				node = FSINGLE(node)[0];
				if(ISNOTHING(node)) throw new Error("ELTRIGGER는 element를 찾을수 없습니다. => 들어온값" + TOS(node));
			}
			var e;
			if ("createEvent" in document) {
			    e = W.document.createEvent("HTMLEvents");
			    e.initEvent(eventName, true, true);
			} else {
				e = {};
			}
			if(eventParam) PROPEACH(eventParam,function(v,k){ e[k] = v; });
		    node.dispatchEvent(e);
			return node;
		},
		//이벤트 등록이 가능한 타겟을 찾아냅니다.
		"ONTARGET":function(node){ return (ISWINDOW(node) || ISDOCUMENT(node)) ? node : FSINGLE(node); },
		//중복이벤트 등록 가능
		"ON":function(node, eventName, eventHandler, useCapture){
			if((typeof eventName !== "string") || (typeof eventHandler !== "function")) return console.erro("ELON 노드 , 이벤트이름, 이벤트헨들러 순으로 파라메터를 입력하세요",node, eventName, eventHandler);
			var nodes  = ELONTARGET(node);
			var events = eventName.split(" ");
			
			DATAEACH(nodes,function(eventNode){
				DATAEACH(events,function(event){
					eventNode.addEventListener(event, eventHandler, useCapture==true ? true : false); 
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
					eventNode.removeEventListener(event, eventHandler, useCapture==true ? true : false); 
				});
			});
			return nodes;
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
			var nodes = FSINGLE(node);
			if(nodes.length == 0) return;
			if(arguments.length == 1) return CLONE(DATAZERO(nodes).dataset);
			if(arguments.length == 2) return DATAZERO(nodes).dataset[key];
			if(arguments.length == 3) { DATAEACH(nodes,function(node){ node.dataset[key] = value; }); return nodes; }
		},
		//Disabled
		"DISABLED":function(node,status){
			var elf = new NFArray(FSINGLE(node));
			if( elf.isNone() ){
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
			var elf = new NFArray(FSINGLE(node));
			if( elf.isNone() ){
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
		"CommonNFString":new NFString(),
		"ADDCLASS":function(node,addClass){	
			var findNodes = FSINGLE(node);
			if(typeof addClass !== "string") return findNodes;
			for(var i=0,l=findNodes.length;i<l;i++) findNodes[i].setAttribute("class",EL.CommonNFString.set(findNodes[i].getAttribute("class")).getAddModel(addClass));
			return findNodes;
		},
		"HASCLASS":function(node,hasClass){
			var findNodes = FSINGLE(node);
			if(typeof hasClass !== "string") return false;
			for(var i=0,l=findNodes.length;i<l;i++) if( !EL.CommonNFString.set(findNodes[i].getAttribute("class")).hasModel(hasClass) ) {
				return false;
			}
			return true;
		},
		"REMOVECLASS":function(node,removeClass){
			var findNodes = FSINGLE(node);
			if(typeof removeClass !== "string") return findNodes;
			for(var i=0,l=findNodes.length;i<l;i++) {
				var didRemoveClassText = EL.CommonNFString.set(findNodes[i].getAttribute("class")).getRemoveModel(removeClass).trim();
				if( !didRemoveClassText.length ) {
					findNodes[i].removeAttribute("class");
				} else {
					findNodes[i].setAttribute("class",didRemoveClassText);
				}
			} 
			return findNodes;
		},
		"SWITCHCLASS":function(el,switchClass){
			if(typeof switchClass==='string'){
				var nodes = FSINGLE(el);
				DATAEACH(nodes,function(node){
					ELHASCLASS(node,switchClass) ? ELREMOVECLASS(node,switchClass) : ELADDCLASS(node,switchClass);
				});
				return nodes;
			}
		},
		"COORDS":function(nodes,coordinate,insertAbsolute,offsetX,offsetY,scale){
			var findNode = FSINGLE(nodes,0);
			if(findNode && (typeof coordinate == "string")) {
				scale = (typeof scale === 'number') ? scale : 1;
				
				var coordinateData = [];
				coordinate.replace(/(-|)\d+/g,function(s){ coordinateData.push(s); });
				DATAEACH(coordinateData,function(v,i){
					var styleName;
					switch(i){
						case 0:styleName='left';break;
						case 1:styleName='top';break;
						case 2:styleName='width';break;
						case 3:styleName='height';break;
						default:return false;break;
					}
					var styleValue = (TONUMBER(v)*scale);
					switch(i){
						case 0:styleValue += TONUMBER(offsetX);break;
						case 1:styleValue += TONUMBER(offsetY);break;
					}
					ELSTYLE(findNode,styleName,styleValue+"px");
				});
				switch(insertAbsolute) {
					case true :
					case 'absolute':
						ELSTYLE(findNode,'position','absolute');
						break;
					case 'relative':
						ELSTYLE(findNode,'position','relative');
						break;
				}
			}
			return nodes;
		}
	});
	EL.eachGetterWithPrefix();
	
	nody.extendModule("NFArray","NFQuery",{
		find:function(selector,i){ return new NFQuery(selector,this,i); },
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
		putTo    :function(target){ CALL(EL.PUT,EL,target,this);; return this;},
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
	},function(select,parent,i){
		this.setSource(FIND(select,parent,i));
	});
	
	nody.extendModule("NFQuery","NFMake",{},function(node,attr,parent){
		this.setSource(GUT.CREATE(node,attr,parent));
	});
	
	nody.extendModule("NFQuery","NFTemplate",{
		clone    : function(nodeData,dataFilter){ 
			return new NFTemplate(this.TemplateNode,nodeData,(dataFilter || this._persistantDataFilter),true); 
		},
		cloneMap:function(nodeDatas,dataFilter){
			nodeDatas  = TOARRAY(nodeDatas);
			var result = [];
			for(var i=0,l=nodeDatas.length;i<l;i++) result.push( this.clone(nodeDatas[i],dataFilter) );
			return result;
		},
		render:function(nodeData,dataFilter){
			return this.clone(nodeData,dataFilter).get();
		},
		renderMap:function(nodeDatas,dataFilter){
			return DATAMAP(this.cloneMap( TOARRAY(nodeDatas) ,dataFilter ),function(template){
				return template.get();
			});
		},
		renderTo:function(appendTo,nodeDatas,dataFilter){
			var at = FSINGLE(appendTo)[0];
			var rr = this.renderMap( (typeof nodeDatas !== 'object') ? [{}] : nodeDatas, dataFilter );
			if(at) ELAPPEND(at,rr);
			return rr;
		},
		renderAfterQuery:function(){
			return new NFQuery(this.render.apply(this,Array.prototype.slice.call(arguments)));
		},
		
		// 키를 지우면서
		partialAttr:function(attrKey,callback){
			this.find("["+attrKey+"]").each(function(node){
				//attrValue, node
				callback(node.getAttribute(attrKey),node,attrKey);
				node.removeAttribute(attrKey);
			});
			return this;
		},
		partialNodeProps:function(propKeys,callback,presets){
			var keys  = propKeys;
			var pKeys = (presets && presets.pKeys) ? presets.pKeys : (new NFArray(keys)).getMap(function(key){ return 'nf-'+key; });
			var sKeys = (presets && presets.sKeys) ? presets.sKeys : (new NFArray(pKeys)).getMap(function(pkey){ return '['+ pkey +']'; });
			var pNodes = this.find(sKeys.join(','));
			for(var i=0,l=pNodes.length;i<l;i++){
				for(var si=0,sl=sKeys.length;si<sl;si++){
					if(NUT.THE(pNodes[i],sKeys[si])) {
						callback(pNodes[i].getAttribute(pKeys[si]),pNodes[i],keys[si]);
						pNodes[i].removeAttribute(pKeys[si]);
					}
				}
			}
		},
		//성능의 가속을 위해 존재하는 값들입니다. 이것을 건드리면 엄청난 문제를 초례할 가능성이 있습니다.
		__nodeDataDefaultKeys:['value','class','dataset','href','append','prepend','put','display','custom'],
		__nodeDataAttrKeys:["nf-value", "nf-class", "nf-dataset", "nf-href", "nf-append", "nf-prepend", "nf-put", "nf-display", "nf-custom"],
		__nodeDataSelectKeys:["[nf-value]", "[nf-class]", "[nf-dataset]", "[nf-href]", "[nf-append]", "[nf-prepend]", "[nf-put]", "[nf-display]", "[nf-custom]"],	
		//
		setNodeData:function(refData,dataFilter){
			if(!this.TemplatePartials) this.TemplatePartials = {};
			
			if(typeof refData !== "object") { return console.error("nodeData의 파라메터는 object이여야 합니다",refData); }
			var _ = this,data = CLONEOBJECT(refData),dataPointer = this.TemplatePartials;
			dataFilter = dataFilter || this._persistantDataFilter;
			
			// 파셜 노드 수집 // 재사용 가능하도록 고려해야함
			this.partialNodeProps(this.__nodeDataDefaultKeys,
				function(name,node,nodeAlias){
					if(!(nodeAlias in dataPointer)) dataPointer[nodeAlias] = {};
					name.replace(/\S+/g,function(s){
						if(!dataPointer[nodeAlias][s]) dataPointer[nodeAlias][s] = [];
						dataPointer[nodeAlias][s].push(node);
					});
				},{pKeys:this.__nodeDataAttrKeys,sKeys:this.__nodeDataSelectKeys}
			);
			
			if(typeof dataFilter === 'object') {
				PROPEACH(dataFilter,function(value,key){
					if(typeof value === 'function') {
						if( dataPointer.custom && (key in dataPointer.custom) ) {
							data[key] = value;
						} else {
							data[key] = value.call(data,data[key],key,data);
						}
					} else {
						data[key] = value;
					}
				});
			}
			
			// 파셜 데이터 입력
			//퍼포먼스 중심 코딩
			for(var partialCase in dataPointer) {
				for(var attrValue in dataPointer[partialCase]) {
					if(attrValue in data && data[attrValue] !== null) {
						var nodelist = dataPointer[partialCase][attrValue];
						for(var i=0,l=nodelist.length;i<l;i++) {
							var node = nodelist[i];
							switch(partialCase){
								case "value":ELVALUE(node,data[attrValue]);break;
								case "href" :node.setAttribute("href",data[attrValue]);break;
								case "class":ELADDCLASS(node,data[attrValue]);break;
								case "put"    : ELEMPTY(node);
								case "append" : ELAPPEND(node,data[attrValue]);break;
								case "prepend": ELPREPEND(node,data[attrValue]);break;
								case "display": if(!data[attrValue]){ELSTYLE(node,'display','none');}  break;
								case "dataset": PROPEACH(data[attrValue],function(key,value){ node.dataset[value] = key; });break;
								case "custom" : if(typeof data[attrValue] === 'function') data[attrValue].call(node,node,attrValue); break;
							}
						}
					}
				}
			}
			return this;
		},
		setDataFilter:function(dataFilter){ if(typeof dataFilter === 'object') this._persistantDataFilter = dataFilter; return this; },
		removeDataFilter:function(){ delete this['_persistantDataFilter']; return this; },
		//name base form data
		getFormData:function(){ return INJECT(this,function(inj,node){ EXTEND(inj,(new NFForm(node)).getFormData()) }); },
		setFormData:function(data){ if(typeof data === 'object') this.each(function(node){ (new NFForm(node)).setFormData(data); }); return this; },
		reset : function(nodeData,dataFilter){
			if (this.TemplateNode.length === 0) console.error("tamplate 소스를 찾을수 없습니다.",this.initNode);
			if (this.TemplateNode.length > 1) console.warn("tamplate 소스는 반드시 1개만 선택되어야 합니다.",this.initNode);
			this.setSource(IMPORTNODE(this.TemplateNode));
			if(typeof nodeData == "object") this.setNodeData(nodeData,dataFilter);
			return this;
		}
	},function(node,nodeData,dataFilter,beRender){
		this.initNode      = node;
		this.TemplateNode  = (typeof node === "string")?/^<.+>$/.test(node)?[MAKETEMP(node)]:FSINGLE(node):FSINGLE(node);
		if (!this.TemplateNode) {
			console.error("template init falid!");
		} else {
			if(dataFilter) this.setDataFilter(dataFilter);
			if(nodeData === true || dataFilter === true || beRender === true) this.reset(nodeData,dataFilter);
		}
	},function(multiNodes){
		//get 함수입니다. Template모듈은 배열이나 노드를 반환합니다.
		var fs = FSINGLE(this);
		return (fs.length === 1) ? fs[0] : fs;
	});
	nody.method('ZTEMP',function(temp,data,filter){ return (new NFTemplate(temp)).renderMap(data,filter); });
	nody.method('$Q',function(s,p,i)  { return new NFQuery(s,p,i);});
	nody.method('$M',function(n,a,p)  { return new NFMake(n,a,p); });
	nody.method('$T',function(n,d,f,c){ return new NFTemplate(n,d,f,c); });
	nody.method('$C',function(w,h)    { return new NFContext2D(w,h); });
	
})(window,nody.env);

//Nody Component Foundation
(function(W,ENV){
	//여러 엘리먼트를 셀렉트하여 한번에 컨트롤
	nody.module("NFControls",{
		getSelects:function(){ return this.Source; },
		find:function(f){ if(f) return FIND(f,this.Source); return []; },
		statusFunction:function(f,param,filter,requireElement){
			var fe = filter ? function(node){ return ELIS(node,filter)?f(node, param):undefined } : function(node){ return f(node, param); };
			var r  = new NFArray(this.getSelects()).map( fe ).filter();
			return (requireElement == true) ? r.toArray() : this;
		},
		disabled:function(status,filter){ return this.statusFunction(ELDISABLED,(status !== false ? true : false),filter); },
		readonly:function(status,filter){ return this.statusFunction(ELREADONLY,(status !== false ? true : false),filter); },
		empty   :function(filter)       { filter = filter?filter+",:not(button):not(select)":":not(button):not(select)"; return this.statusFunction(ELVALUE   ,"",filter); },
		map     :function(mapf,filter)  { return this.statusFunction(function(node){ var r = mapf(node); if(ISTEXT(r)){ ELVALUE(node,r); } },"",filter); },
		controls:function(eachf,filter) { return this.statusFunction(function(node){ var r = eachf.call(node,node); },"",filter); },
		removePartClass:function(rmClass,filter,req){
			var r = this.statusFunction(function(node,param){
				var classes = ELATTR(node,"class");
				if(typeof classes === "string"){
					classes = _NFString(classes).getRemoveModel(eval("/^"+param+"/"));
					ELATTR(node,"class",classes);
					return node;
				}
				return undefined;
			},rmClass,filter,true);
			return (req == true)?r:this;
		},
		changePartClass:function(selClass,toClass,filter){
			new NFArray(this.removePartClass(selClass,filter,true)).each(function(node){
				var classes = ELATTR(node,"class");
				ELATTR(node,"class",_NFString(classes).getAddModel(selClass+toClass));
			});
			return this;
		}
	},function(controls,casein){
		this.Source = FIND(controls,casein);
	});
	
	
	// 폼은 일정 폼 노드들을 컨트롤 하기위해 사용됩니다.
	nody.extendModule("NFControls","NFForm",{
		isValid        :function(f){ if(typeof f === "function") return f.call(this); return ISELNODE(this.Source); },
		getSelects     :function(){ return FIND(this.SelectRule,this.Source); },
		getSelectTokens:function(){
			return new NFArray(this.SelectRule.split(",")).map(function(selString){
				var execResult = /\[([a-zA-Z0-9\-]+)(.*)\]/.exec(selString);
				if( execResult === null) return ;
				return execResult[1];
			}).filter().toArray();
			
		},
		//체크아웃 대상 (key와 무관)
		getCheckoutElement:function(){
			return FIND(new NFArray(this.getSelectTokens()).map(function(s){ return "["+s+"]"; }).join(","), this.Source);
		},
		//체크아웃 대상 (key가 존재하는 것만)
		getCheckoutElementsWithToken:function(){
			var tokens = new NFArray(this.getSelectTokens());
			return new NFArray(this.getCheckoutElement()).inject({},function(node,inject){
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
			return new NFObject(this.getCheckoutElementsWithToken()).map(function(node,key){
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
		},
		//checkin, checkout이 의미가 모호한것 같아 새로 API추가
		clearFormData:function(){
			return this.empty();
		},
		setFormData:function(hashMap,v2){
			return this.checkin(hashMap,v2);
		},
		getFormData:function(key){
			if(typeof key === 'string') return this.checkout()[key];
			return this.checkout();
		}
	},function(context,selectRule){
		this.Source = FSINGLE(context)[0];
		this.form   = this.Source;
		if( !ISELNODE(this.Source) ) { console.error( "Frame::Context를 처리할 수 없습니다. => ",this.Source," <= ", context); }
		
		//SelectRule
		switch(typeof selectRule){
			case "string": this.SelectRule = selectRule+",[name]"; break;
			default : this.SelectRule = "[name]"; break;
		}
	});
	
	nody.module("NFActiveStatus",{
		whenAnyWillActive  :function(m)  { this.StatusEvents.AnyWillActive = m; },
		whenAnyDidActive   :function(m)  { this.StatusEvents.AnyDidActive = m; },
		whenAnyWillInactive:function(m)  { this.StatusEvents.AnyWillInactive = m; },
		whenAnyDidInactive :function(m)  { this.StatusEvents.AnyDidInactive = m; },
		whenAllActive      :function(m)  { this.StatusEvents.AllInactive = m; },
		whenAllInactive    :function(m)  { this.StatusEvents.AllInactive = m; },
		whenWillActive     :function(n,m){ this.StatusEvents.StatusWillActive[n] = m; },
		whenDidActive      :function(n,m){ this.StatusEvents.StatusDidActive[n] = m; },
		whenWillInactive   :function(n,m){ this.StatusEvents.StatusWillInactive[n] = m; },
		whenDidInactive    :function(n,m){ this.StatusEvents.StatusDidInactive[n] = m; },
		setInactiveStatus  :function(status,param,owner){
			if( this.ActiveKeys.has(status) ){
				if(this.ActiveKeys.length === 1 && !this.AllowInactive) return;
				if( APPLY(this.StatusEvents.AnyWillInactive          ,owner,param) !== false &&
					CALL(this.StatusEvents.StatusWillInactive[status],owner,param) !== false )
				{
					this.ActiveKeys.remove(status);
					CALL(this.StatusEvents.AnyDidInactive           ,owner,param);
					CALL(this.StatusEvents.StatusDidInactive[status],owner,param);
					if( this.ActiveKeys.length === 0 ) CALL(this.StatusEvents.AnyActive);
				}
			}
		},
		setActiveStatus:function(status,param,owner){
			var _ = this;
			param = TOARRAY(param);
			if( !this.ActiveKeys.has(status) ){
				if( this.AllowMultiStatus || (this.ActiveKeys.length === 0) ) {
					if( APPLY(this.StatusEvents.AnyWillActive           ,owner,param) !== false &&  
						APPLY(this.StatusEvents.StatusWillActive[status],owner,param) !== false ) 
					{
						this.ActiveKeys.push(status);
						APPLY(this.StatusEvents.AnyDidActive           ,owner,param);
						APPLY(this.StatusEvents.StatusDidActive[status],owner,param);
						if( this.ActiveKeys.length === PROPLENGTH(this.Source) ) 
							APPLY(this.AllActive,owner,param);
					}
				} else  {
					if( APPLY(this.StatusEvents.AnyWillActive           ,owner,param) !== false &&  
						APPLY(this.StatusEvents.StatusWillActive[status],owner,param) !== false ) 
					{
						this.ActiveKeys.each(function(key){ _.setInactiveStatus(key,param,owner); })
						this.ActiveKeys.push(status);
						APPLY(this.StatusEvents.AnyDidActive           ,owner,param);
						APPLY(this.StatusEvents.StatusDidActive[status],owner,param);
						if( this.ActiveKeys.length === PROPLENGTH(this.Source) ) 
							APPLY(this.AllActive,owner,param);
					}
				}
			}
		},
		getActiveStatus:function(){
			return this.ActiveKeys.join(" ");
		}
	},function(allowMulti,allowInactive){
		lastll = this;
		this.AllowMultiStatus = !!allowMulti;
		this.AllowInactive    = !!allowInactive;
		this.StatusEvents     = {
			"AnyWillActive":undefined,
			"AnyDidActive":undefined,
			"AnyWillInactive":undefined,
			"AnyDidInactive":undefined,
			"AllActive":undefined,
			"AllInactive":undefined,
			"StatusWillActive":{},
			"StatusDidActive":{},
			"StatusWillInactive":{},
			"StatusDidInactive":{}
		}
		this.ActiveKeys = new NFArray();
	});
	
	nody.extendModule("NFActiveStatus","NFFormController",{
		isStatus:function(k){
			return this.ActiveKeys.has(k);
		},
		statusReset:function(status){
			if(typeof name === 'string'){
				this.ActiveKeys.remove(name);
				this.setActiveStatus(status,Array.prototype.slice.call(arguments,1),this);
			}
		},
		statusTo:function(status){
			if(typeof name === 'string') 
				this.setActiveStatus(status,Array.prototype.slice.call(arguments,1),this);
		},
		addStatus:function(key,val){
			if(!key)return;
			if(typeof key === 'object') for(var k in key) this.addStatus(k,key[k]);	
			else this.whenDidActive(key,val);
		},
		setFormData:function(data,v2){
			return this.FormControl.checkin(data,v2);
		},
		getFormData:function(){
			return this.FormControl.checkout();
		},
		find:function(){
			return this.FormControl.find.apply(this.FormControl,Array.prototype.slice.call(arguments));
		}
	},function(context,statusProp,helper){
		this.view = FSINGLE(context)[0];
		if(this.view){
			this.FormControl = _NFForm(this.view);
			this._super(false,true);
			if(statusProp) this.addStatus(statusProp);
			
			if(typeof helper === 'function') helper = {init:helper};
			var _ = this;
			PROPEACH(helper,function(fn,key){
				if(!(key in _.constructor.prototype)) {
					if(key === 'init') {
						if(typeof fn === 'function') {
							fn.apply(_,Array.prototype.slice.call(arguments));
						}
					} else {
						if(typeof fn === 'function') {
							_[key] = function(){fn.apply(_,Array.prototype.slice.call(arguments));};
						} else {
							_[key] = fn;
						}
					}
					
				}
			});
		} else {
			console.warn('FormController에 view를 정상적으로 로드할수 없었습니다.',context,this.view);
		}
	});
	
	// 컨텍스트 컨트롤러
	nody.module("NFContexts",{
		getContexts:function(){ 
			return FSINGLE(this.initCall[0]); 
		},
		getSelects:function(ignorePool){
			
			if(ignorePool !== true && this._selectPoolCount > 0) { 
				return CLONEARRAY(this._selectPoolList);
			}
			switch(typeof this.initCall[1]) {
				case 'function':
					return this.initCall[1]();
					break;
				default:
					var selectQuery = ISNOTHING(this.initCall[1]) ? ">*" : this.initCall[1];
					if(selectQuery == "self") return this.getContexts();
					if(selectQuery.charAt(0) == ">"){
						return FINDON(this.getContexts(),selectQuery.substr(1));
					} else {
						return FINDIN(this.getContexts(),selectQuery);
					}
					break;
			}
		},
		"+_selectPoolCount":0,
		selectPoolStart:function(){
			if(this._selectPoolCount === 0) this._selectPoolList = this.getSelects(true);
			this._selectPoolCount = this._selectPoolCount + 1;
			//console.log('pool ++',this._selectPoolCount);
		},
		selectPoolEnd:function(){
			this._selectPoolCount = this._selectPoolCount - 1;
			if(this._selectPoolCount === 0) this._selectPoolList = null;
			//console.log('pool --',this._selectPoolCount);
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
					return FINDIN(node,selectQuery,"*");
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
				this.selectPoolStart();
				//캐쉬를 사용함 단 트리깅에서만
				var selNode = this.getSelect(func);
				
				if(ISELNODE(selNode)) {
					ELTRIGGER(selNode,event, (arguments.length > 2)  ? {'arguments':Array.prototype.slice.call(arguments,2)} : undefined ); 
				} else {
					console.warn("Contexts::onSelects::트리깅할 대상이 없습니다.");
				} 
				this.selectPoolEnd();
				return this;
			}
			if(typeof event=="string" && typeof func === "function"){
				ELON(this.getContexts(),event,function(e){
					
					var curSel = new NFArray( _.getSelects() );
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
							if(FIND(e.target,sel,0)){
								eventCapture = sel;
								return false;
							}
						});
						if(eventCapture){
							//이벤트를 다시 발생시킴
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
					console.info("initCall =>", this.initCall);
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
		needFilterController:function(fm,fwc){
			return new NFFilterController(this.initCall[0],this.initCall[1],fm,fwc);
		},
		injectSelects:function(method){
			if(typeof method !== "function") return {};
			return INJECT(this.getSelects(),function(inject,node,index){
				method(inject,node,index);
			});
		}
	},function(cSel,sSel,tSel){
		if(ISNOTHING(FSINGLE(cSel))) console.warn("Contexts::init::error 첫번째 파라메터의 값을 현재 찾을 수 없습니다. 들어온값", cSel,sSel,tSel);
		this.initCall = [cSel,sSel,tSel];
	});
	
	nody.extendModule('NFContexts','NFFilterController',{
		needFiltering:function(filterData){
			var selectNodes = this.getSelects();
			var fm = this.filterMethod;
			var filteringDataIndexes = [];
			if(this.filterClass) {
				var fc = this.filterClass;
				DATAEACH(this.getSelects(),function(sNode,i){
					if( fm.call(sNode,sNode,i,filterData) === true ){
						ELREMOVECLASS(sNode,fc)
					} else {
						ELADDCLASS(sNode,fc);
						filteringDataIndexes.push(i);
					}
				});
			} else {
				DATAEACH(this.getSelects(),function(sNode,i){
					if( fm.call(sNode,sNode,i,filterData) === true ){
						ELSTYLE(sNode,'display',null)
					} else {
						ELSTYLE(sNode,'display','none')
						filteringDataIndexes.push(i)
					}
				});
			}
			return filteringDataIndexes;
		}
	},function(cSel,sSel,filterMethod,filterWithClass){
		this._super(cSel,sSel);
		if(typeof filterMethod !== 'function') console.error('NFFilter::세번째 파라메터는 반드시 함수를 넣어주세요',filterMethod);
		this.filterMethod = filterMethod;
		
		if(typeof filterWithClass === 'string') this.filterClass = filterWithClass;
		if(filterWithClass === true) this.filterClass = 'hidden';
	});
	
	nody.extendModule("NFContexts","NFActiveController",{
		whenWillActive:function(method){ this.ContextsEvents.willActive = method; return this; },
		whenDidActive:function(method){ this.ContextsEvents.didActive = method; return this;},
		whenDidInactive:function(method){ this.ContextsEvents.didInactive = method; return this; },
		whenWillChange:function(method){ this.ContextsEvents.willChange = method; return this;},
		whenDidChange:function(method){ this.ContextsEvents.didChange = method; return this;},
		whenActiveToggle:function(am,im){ this.whenDidActive(am); return this.whenDidInactive(im); },
		whenActiveStart:function(method){ this.ContextsEvents.activeStart = method; return this; },
		whenActiveEnd:function(method){this.ContextsEvents.activeEnd = method; return this;},
		shouldTriggering:function(index,wait){
			var _ = this;
			if(typeof index !== 'number') console.warn('index는 반드시 number이여야 합니다.');
			
			if((wait === 0) || (wait === false)) {
				_.onSelects(_.ContextsEventName,index,wait);
			} else {
				var t = setTimeout(function(){
					_.onSelects(_.ContextsEventName,index,wait);
					clearTimeout(t);
				},(typeof wait === 'number') ? wait : TONUMBER(wait));
			}
			return this;
		},
		
		getActiveIndexes:function(lastIndex){
			this.selectPoolStart();
			
			var indexes = [];
			DATAEACH( this.getSelects() ,function(node,i){ 
				if(ELHASCLASS(node,'active')) indexes.push(i); 
			 });
			 
			this.selectPoolEnd();
			
			if(typeof lastIndex === 'number')
				return indexes[lastIndex];
			if(lastIndex === true)
				return indexes[indexes.length - 1];
				return indexes;
		},
		setActiveIndexes:function(indexes,withEvent){;
			this.selectPoolStart();
			
			var indexesObject = new NFArray(indexes);
			
			if(withEvent === false) {
				DATAEACH( this.getSelects() , function(node,i){
					if( indexesObject.has(i) ) {
						if( !ELHASCLASS(node,'active') ) ELADDCLASS(node,'active');
					} else {
						if( ELHASCLASS(node,'active') ) ELREMOVECLASS(node,'active');
					} 
				});
			} else {
				var _ = this;
				DATAEACH( this.getSelects() , function(node,i){
					if( indexesObject.has(i) ) {
						if( !ELHASCLASS(node,'active') ) _.shouldTriggering(i,withEvent);
					} else {
						if( ELHASCLASS(node,'active') ) _.shouldTriggering(i,withEvent);
					} 
				});
			}
			this.selectPoolEnd();
			return this;
		},
		shouldActive:function(index,withEvent,unique){
			if(typeof index === 'number') {
				this.selectPoolStart();
				
				var activeIndexes = this.getActiveIndexes();
				if( !DATAHAS(activeIndexes,index) ) {
					if(unique === true) {
						this.setActiveIndexes([index],withEvent);
					} else {
						activeIndexes.push(index);
						this.setActiveIndexes(activeIndexes,withEvent);
					}
				}
				this.selectPoolEnd();
			}
			return this;
		},
		shouldInactive:function(index,withEvent){
			if(typeof index === 'number') {
				this.selectPoolStart();
				var activeIndexes = new NFArray(this.getActiveIndexes()) ;
				if( DATAHAS(activeIndexes,index) ) {
					activeIndexes.remove(index);
					this.setActiveIndexes(activeIndexes,withEvent);
				}
				this.selectPoolEnd();
			}
			return this;
		},
		getActiveSelects:function(){
			this.selectPoolStart();
			var r = DATAFILTER(this.getSelects(),function(node){ return ELHASCLASS(node,'active'); });
			this.selectPoolEnd();
			return r;
		},
		getInactiveSelects:function(){
			this.selectPoolStart();
			var r = DATAFILTER(this.getSelects(),function(node){ return !ELHASCLASS(node,'active'); });
			this.selectPoolEnd();
			return r;
		},
		activeAll:function(withEvent){
			this.selectPoolStart();
			this.setActiveIndexes(DATAMAP(this.getSelects(),function(n,i){ return i; }),withEvent);
			this.selectPoolEnd();
			return this;
		},
		inactiveAll:function(withEvent){
			this.selectPoolStart();
			this.setActiveIndexes([],withEvent);
			this.selectPoolEnd();
			return this;
		},
		hasActive:function(){
			var result = false;
			this.selectPoolStart();
			var selects = this.getSelects();
			for(var i=0,l=selects.length;i<l;i++) if(ELIS(selects[i],'.active')){ result = true; break; }
			this.selectPoolEnd();
			return result;
		},
		isActiveAll:function(){
			var result;
			this.selectPoolStart();
			result = (this.getActiveSelects().length == this.getSelects().length);
			this.selectPoolEnd();
			return result;
		},
		resetActiveTargetWithContexts:function(con,sel,pool){	
			var selects = this.getActiveIndexes();
			CALL(pool);
			this.initCall[0] = con || this.initCall[0];
			this.initCall[1] = sel || this.initCall[1];
			if(selects.length) this.setActiveIndexes(selects,false);
		},
		resetActiveTarget:function(sel){
			this.resetActiveTargetWithContexts(undefined,sel);
		},
		resetActiveTargetWithPool:function(sel,pool){
			this.resetActiveTargetWithContexts(undefined,sel,pool);
		}
	},function(cSel,sSel,selectEvent,willActive,shouldActiveIndex,allowMultiActive,allowInactive){
		this._super(cSel,sSel);
		this.ContextsEvents = {};
		this.ContextsEventName = (typeof selectEvent === "string") ? selectEvent : "click";
		this.preventDefault   = true;
		this.allowAutoActive  = true;
		this.allowMultiActive = (typeof allowMultiActive === "boolean") ? allowMultiActive : false;
		this.allowInactive    = (typeof allowInactive === "boolean")    ? allowInactive    : this.allowMultiActive;
		//
		var _ = this;
		this.onSelects(this.ContextsEventName,function(e,i){
			var yesEvent = e.arguments ? !(e.arguments[0] === false) : true;
			
			var currentSelects = _.getSelects();
			
			if(_.preventDefault) e.preventDefault();
			
			//액티브가 실행될시
			if(yesEvent) if( CALL(_.ContextsEvents.willActive,this,e,i) === false ) return false;
			
			//자동으로 액티브 실행
			if(_.allowAutoActive) {
				//이미 액티브 된 상태의 아이템의 경우 
				if(ELHASCLASS(this,"active")) {
					if(_.allowInactive) {
						//인액티브가 가능한 경우
						if(yesEvent) CALL(_.ContextsEvents.willChange,this,i);
						ELREMOVECLASS(this,"active");
						if(yesEvent) CALL(_.ContextsEvents.didChange,this,i);
						if(yesEvent) if( FIND(".active",currentSelects).length == 0 ) CALL(_.ContextsEvents.activeEnd,this,i);
						return false;
					} else {
						//인액티브가 불가능한 경우
						return false;
					}
				}
				//새로운 액티브를 만들기 위한 순서
				//액티브 Item들을 찾아냄
				var activeItems = FIND(".active",currentSelects);
				
				if(_.allowMultiActive) {
					//다중 Active를 허용하는 경우
					if(yesEvent) CALL(_.ContextsEvents.willChange,this,i);
					ELADDCLASS(this,"active");
					if(yesEvent) if(activeItems.length === 0) CALL(_.ContextsEvents.activeStart,this,i);
					if(yesEvent) CALL(_.ContextsEvents.didActive,this,i);
					if(yesEvent) CALL(_.ContextsEvents.didChange,this,i);
					//deactive를 실행하지 않음
					return false;
				} else {
					//다중 Active를 허용하지 않는 경우
					//인액티브 대상을 찾아 인액티브 시킵니다.
					(new NFArray(currentSelects)).remove(this).each(function(node){
						if(_.allowAutoActive) {
							ELREMOVECLASS(node,"active");
							if(yesEvent) CALL(_.ContextsEvents.didInactive,node);
						}
					});
					
					//액티브를 시작합니다.
					if(yesEvent) CALL(_.ContextsEvents.willChange,this,i);
					ELADDCLASS(this,"active");
					if(yesEvent) if(activeItems.length === 0) CALL(_.ContextsEvents.activeStart,this,i);
					if(yesEvent) CALL(_.ContextsEvents.didActive,this,i);
					if(yesEvent) CALL(_.ContextsEvents.didChange,this,i);
					return false;
				}
			} 
		});
		
		//whenWillActiveSet
		if(willActive) this.whenWillActive(willActive);
		//shouldActiveSet
		if(typeof shouldActiveIndex === "function") shouldActiveIndex = shouldActiveIndex.call(this);
		if(typeof shouldActiveIndex === "number") this.shouldActive(shouldActiveIndex,1);
	});
	
	
	nody.module('NFActiveControllerManager',{
		getActiveIndexes:function(sourceIndex){
			var selectSource = this.Source[sourceIndex || (this.Source.length - 1) ];
			if(selectSource) return selectSource.getActiveIndexes();return [];
		},
		setActiveIndexes:function(indexes,withEvent,sender){
			_NFArray(this.Source).remove(sender).each(function(ac, i){ 
				ac.setActiveIndexes( indexes, (i === 0) ? (withEvent && true) : false ); });
			return this;
		},
		shouldInactive:function(index,withEvent,sender){
			_NFArray(this.Source).remove(sender).each(function(ac, i){
				//첫번째만 무조건 이벤트 발생
				ac.shouldInactive( index, (i === 0) ? (withEvent && true) : false ); 
			});
			return this;
		},
		shouldActive:function(index,withEvent,unique){
			DATAEACH(this.Source,function(ac,i){
				//첫번째만 무조건 이벤트 발생
				ac.shouldActive( index, (i === 0) ? (withEvent && true) : false, unique); 
			});
			return this;
		},
		activeAll:function(withEvent, sourceIndex){
			var lastSource = this.Source[ sourceIndex || (this.Source.length - 1) ];
			if(lastSource) this.setActiveIndexes(DATAMAP(lastSource.getSelects(),function(n,i){
				return i;
			}),withEvent && true);	
			return this;
		},
		inactiveAll:function(withEvent){
			this.setActiveIndexes([],withEvent && true);
		},
		
		getActiveSelects:function(sourceIndex){
			var selectSource = this.Source[sourceIndex || (this.Source.length - 1)];
			return selectSource.getActiveSelects();
		},
		hasActive:function(sourceIndex){
			var selectSource = this.Source[sourceIndex || (this.Source.length - 1)];
			return selectSource.hasActive();
		},
		syncActiveController:function(sender,syncPrevIndexes){
			this.Source.push(sender);
			var rootManager = this;
			sender.whenWillActive(
				function(i){ 
					var who=this; 
					return CALL(rootManager.ContextsEvents.willActive,who,i); 
				}
			);
			sender.whenDidActive(
				function(i){ 
					var who=this;
					rootManager.setActiveIndexes(sender.getActiveIndexes(),false,sender);
					return CALL(rootManager.ContextsEvents.didActive,who,i);
				}
			);
			sender.whenDidInactive(
				function(i){
					rootManager.setActiveIndexes(sender.getActiveIndexes(),false,sender);
					var who=this; 
					return CALL(rootManager.ContextsEvents.didInactive,who,i);
				}
			);
			sender.whenWillChange(
				function(){ 
					var who=this; 
					return CALL(rootManager.ContextsEvents.willChange,who);
				}
			);
			sender.whenDidChange(
				function(i){ 
					var who=this; 
					rootManager.setActiveIndexes(sender.getActiveIndexes(),false,sender);
					return CALL(rootManager.ContextsEvents.didChange,who,i);
				}
			);
			sender.whenActiveStart(
				function(i){ 
					var who=this;
					return CALL(rootManager.ContextsEvents.activeStart,who,i);
				}
			);
			sender.whenActiveEnd(
				function(i){ 
					var who=this;
					return CALL(rootManager.ContextsEvents.activeEnd,who,i);
				}
			);
			
			if(syncPrevIndexes === true) {
				var lastSource = this.Source[this.Source.length - 1];
				if(lastSource) sender.setActiveIndexes(lastSource.getActiveIndexes(),false);
			}
			return sender;
		},
		makeActiveController:function(){
			return this.syncActiveController(_NFActiveController.apply(NFActiveController,Array.prototype.slice.call(arguments)));
		},
		whenWillActive:function(method){ this.ContextsEvents.willActive = method; return this; },
		whenDidActive:function(method){ this.ContextsEvents.didActive = method; return this;},
		whenDidInactive:function(method){ this.ContextsEvents.didInactive = method; return this; },
		whenWillChange:function(method){ this.ContextsEvents.willChange = method; return this;},
		whenDidChange:function(method){ this.ContextsEvents.didChange = method; return this;},
		whenActiveToggle:function(am,im){ this.whenDidActive(am); return this.whenDidInactive(im); },
		whenActiveStart:function(method){ this.ContextsEvents.activeStart = method; return this; },
		whenActiveEnd:function(method){this.ContextsEvents.activeEnd = method; return this;}
	},function(controller){ 
		this.ContextsEvents = {};
		this.Source = []; 
	});
	
	//카운트를 샌후 함수실행
	nody.module("NFFire",{
		complete:function(){ this.FireCurrent = this.FireMax; return this.FireFunction.apply(this,arguments); },
		touch:function(){ this.FireCurrent++; if(this.FireCurrent >= this.FireMax) return this.complete.apply(this,arguments); },
		back:function(){ this.FireCurrent--; return this; },
		each:function(f){ 
			var own = this; 
			var touchLiteral = function(){ 
				return own.touch();
			}; 
			if(ISARRAY(this.Source) && typeof f === "function"){ 
				new NFArray(this.Source).each(function(data,index){ return CALL(f,own,data,index,touchLiteral); }); 
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
	
	nody.method("FIRE",function(list,counter,executor){
		return new NFFire(list,executor).each(counter);
	});
	
	//XMLHTTP REQUEST
	nody.module("NFRequest",{
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
									TRYCATCH(function(){
										response = JSON.parse(requestObject.responseText);
									},function(e){
										console.error("json 포멧이 올바르지 않습니다. =>",requestObject.status,"::",requestObject.responseText);
										throw e;
									});
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
							this.onSuccess(response, _NFMeta(requestObject).lastProp("requestParam") ,this.moduleOption, requestObject);
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
							this.onError(response, _NFMeta(requestObject).lastProp("requestParam") ,this.moduleOption, requestObject);
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
			var requestData   = new NFObject((typeof this.moduleOption.constData === "object") ? new NFObject(this.moduleOption.constData).concat(this.option.data) : this.option.data);
			var requestString = new NFObject(requestData.getEncodeObject()).join("=","&");
			
			// request params (기록용)
			_NFMeta(newRequest).setProp("requestParam",requestData.get());
			TRYCATCH(function(){
				if( this.option.method.toLowerCase() == "post" ){
					newRequest.open("POST", this.url, true );
					TRYCATCH(function(){
						newRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
						newRequest.setRequestHeader('Content-type'    , 'application/x-www-form-urlencoded');
					},function(){
						console.warn("XMLHttpRequest:: setRequestHeader를 지원하지 않는 브라우져입니다");
						throw e;
					},this);
					newRequest.send( requestString );
				} else {
					newRequest.open("GET", this.url + (ISNOTHING(requestString) == true ? "" : "?"+requestString), true );
					newRequest.send();
				}
			},function(){
				if(e.message.indexOf("denied") > 0){
					throw new Error("Cross Domain Error (if current browser is IE)");
				} else {
					throw e;
				}
			},this);
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
	
	nody.extendModule("NFRequest","NFOpen",{},function(url,requestOption,moduleOption){ 
		this._super(url,requestOption,moduleOption);
		this.send();
	});
	
	nody.extendModule("NFRequest","NFHTMLOpen",{
		send:function(){
			
			var requestFrame = CREATE("iframe",{src:this.url + (this.url.indexOf("?") > -1 ? "&token=" : "?token=") +NFUtil.base36Random(2),style:"display:none;"});
			
			var dummyRequstObject = {
				"readyState":4,
				"status":200,
				"responseText":""
			}
			
			_NFMeta(dummyRequstObject).setProp("requestParam",{});
			
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
	
	
	nody.module("NFContentLoaderBase",{
		"+_ActiveController":undefined,
		getActiveController:function(){ return this._ActiveController; },
		_setEvent:function(eventType,eventName,method){
			var _ = this;
			DATAEACH(eventName,function(eventName){
				if(eventName == "!global"){
					if(typeof method === "function") _.NFContentLoaderBaseEvents[eventType] = method;
				} else {
					if((typeof eventName === "string") && (typeof method === "function")) 
					return  _.NFContentLoaderBaseEvents[eventType][eventName] = method;
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
				APPLY(this.NFContentLoaderBaseEvents.AnyLoadEvent,container,userArgs);
				APPLY(this.NFContentLoaderBaseEvents.ContainerLoadEvents[activeName],container,userArgs);
			}
			if( containerEvent.match("active")) {
				APPLY(this.NFContentLoaderBaseEvents.AnyActiveEvent,container,userArgs);
				APPLY(this.NFContentLoaderBaseEvents.ContainerOpenEvents[activeName],container,userArgs);
			}
		},
		_triggeringInactiveEvents:function(container,inactiveName){
			APPLY(this.NFContentLoaderBaseEvents.AnyInactiveEvent,container);
			APPLY(this.NFContentLoaderBaseEvents.ContainerInactiveEvents[inactiveName],container);
		},
		loadHTML:function(loadKey,loadPath,success,error){
			var _ = this;
			
			//함수일때
			if(typeof loadPath === "function") loadPath = loadPath(APPLY(loadPath,this));
			
			//ELEMENT(s) or URL
			switch(typeof loadPath){
				case "string":
					new NFOpen(loadPath + (loadPath.indexOf("?") > -1 ? "&token=" : "?token=") + NFUtil.base36Random(2),{
						"dataType":"dom",
						"success":function(doms){
							_.saveContainerContents(doms,loadKey);
							CALL(success,_,loadKey,doms);
						},
						"error":function(){
							console.error("NFContentLoaderBase::URL링크에서 데이트럴 찾지 못했습니다"+loadPath);
							CALL(error,_,loadKey);
						}
					});
					break;
				case "object":	
					//엘리먼트 배열로 들어올경우
					var doms = FSINGLE(loadPath);
					
					//loadPath가 빈 배열이라면 정상적인 처리로 간주합니다.
					if( doms.length < 1 && !ISARRAY(loadPath) ){
						console.error("NFContentLoaderBase::불러올 엘리먼트가 존재하지 않습니다."+loadPath);
						CALL(error,_,loadKey);
					} else {
						_.saveContainerContents(doms,loadKey);
						CALL(success,_,loadKey,doms);
					}
					break;
				default :
					console.log("NFContentLoaderBase::올바르지 않은 loadPath =>",loadPath,loadKey);
					CALL(error,_,loadKey);
					return false;
					break;
			}
			return true;
		},
		//컨테이너 컨텐츠
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
		//
		addContainer:function(container,key){
			var findContainer = FSINGLE(container)[0];
			if(!findContainer) return console.warn(key,"의 컨테이너를 찾을 수 없습니다.");
			this.ContainerPlaceholder[key] = findContainer;
			return this;
		},
		needActiveController:function(){
			this._ActiveController = APPLY(_NFActiveController,undefined,arguments);
			return this._ActiveController;
		},
		currentActiveController:function(){
			return this._ActiveController;
		}
	},function(baseParam,setupMethod){
		this.Source = {};
		this.ContainerPlaceholder = {};
		this.ContainerContents    = {};
		this.ContainerActiveKeys  = new NFArray();
		
		// 로드될때 이벤트입니다.
		this.NFContentLoaderBaseEvents = {
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
				var _ = this;
				var baseFunctionResult = baseParam.call(this,this);
				if(typeof baseFunctionResult === "object") EXTEND(this.Source,baseFunctionResult);
				break;
		}
	});
	
	var nody_loader_script_start = function(container){
		FIND("script",container,DATAEACH,function(scriptNode){
			var script = scriptNode.innerHTML;
			TRYCATCH(function(){
				eval.call(script);
			},function(e){
				console.error("다음의 스크립트 구문 오류로 스크립트 실행이 정지되었습니다. => ",MAX(script,200));
				throw e;
			});
		});
	};
	
	nody.extendModule("NFContentLoaderBase","NFMultiContentLoader",{
		loadWithProperty:function(loadset,success){
			//lo
			if(typeof loadset !== "object") return console.error("loadAll이 중지되었습니다.");
			var _ = this;
			var successFire = new NFFire(PROPLENGTH(loadset),function(){ CALL(success,_); });
			PROPEACH(loadset,function(loadPath,loadKey){
				var placeholder = _.ContainerPlaceholder[loadKey];
				if(!placeholder) {
					successFire.touch();
					return console.error("미리 정의되어있지 않은 플레이스 홀드키가 존재함 =>",loadKey);
				}
				_.loadHTML(loadKey,loadPath,function(key,doms){
					_.Source[loadKey] = _.Source[loadPath];
					ELAPPEND(placeholder,doms);
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
			PROPEACH(containers,function(container,key){ 
				_.addContainer(container,key); 
			});
			this.multiActive = false;
		});
	});
	
	nody.extendModule("NFContentLoaderBase","NFContentLoader",{
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
					ELAPPEND(_.ContainerPlaceholder[key],doms);
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
			
			ELAPPEND( this.ContainerPlaceholder[loadKey], loadedHTMLContents );
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
				ELAPPEND(placeholder,doms);
			});
		}
	},function(container,baseParam){
		var _container = FSINGLE(container)[0],_ = this;
		if (_container){
			this._super(baseParam,function(){
				//defaultContainer를 보존합니다.
				var dcf = "initialContainer";
				this.addContainer(_container,dcf);
				this.saveContainerContents(_container.children,dcf);
				this.ContainerActiveKeys.push(dcf);
			});
			//다른컨테이너도 플레이스 홀더 설정을 합니다.
			PROPEACH(this.Source,function(value,key){ _.addContainer(_container,key); });
		} else {
			console.error("NFContentLoader::해당 컨테이너를 찾을수 없습니다. Navigation Controller의 작동을 완전히 중지합니다.=> ",container);
		}
	});
	
	nody.extendModule("NFContentLoaderBase","NFTabContents",{
		_inactiveActivatedContents:function(removeInPlaceholder){
			var _ = this;
			this.ContainerActiveKeys.each(function(activatedKey){
				_._triggeringInactiveEvents(_.ContainerPlaceholder[activatedKey],activatedKey);
				ELSTYLE( _.ContainerPlaceholder[activatedKey],'display','none');
			});
			this.ContainerActiveKeys.clear();
		},
		callAsLoad:function(loadKey,loadArguments,after){
			if(loadKey in this.Source){
				var _ = this;
				return this.loadHTML(loadKey,this.Source[loadKey],function(key,doms){
					ELAPPEND(_.ContainerPlaceholder[key],doms);
					nody_loader_script_start(_.ContainerPlaceholder[key]);
					_._triggeringActiveEvents(_.ContainerPlaceholder[key],key,"load",loadArguments);
					CALL(after,this);
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
			ELSTYLE( this.ContainerPlaceholder[loadKey], 'display', 'block' );
			
			this._triggeringActiveEvents(this.ContainerPlaceholder[loadKey],loadKey,"active",openArguments.slice(1));
			return true;
		},
		addContainer:function(contents,name,noAppend){
			var newContainer = MAKE('div',{style:'height:100%;display:none;','data-container-name':name},contents);
			this._super(newContainer,name);
			if(noAppend !== false) ELAPPEND(this.view,newContainer);
			if(name !== "initial-contents") this.callAsLoad(name);
		},
		needFormController:function(target){
			if(!target || typeof target === 'object') {
				if(!this._globalFormController) this._globalFormController = new NFFormController(this.view);
				this._globalFormController.addStatus(target);
				return this._globalFormController;
			}
			if(!(typeof target === 'string' || typeof target === 'number')) return console.error('문자열 타겟이 아니면 폼컨트롤러를 반환할수 없습니다.');
			if(!this.ContainerPlaceholder[target]) return console.error('존재하지 않은 컨트롤러 키의 폼컨트롤러를 호출하였습니다',target);
			if(!this._viewsFormController) this._viewsFormController = [];
			if(!this._viewsFormController[target]) this._viewsFormController[target] = new NFFormController(this.ContainerPlaceholder[target]);
			return this._viewsFormController[target];
		}
	},function(container,baseParam){
		this.view = FSINGLE(container)[0], _ = this;
		
		if (this.view){
			//베이스 파라메터가 존재하지 않으면 현재 컨테이너의 컨텐츠를 기본 파라메터로 봄
			var noConfigMode = false;
			
			var _ = this;
			var initialContents = this.view.children;
			this._super(function(){
				if(typeof baseParam === 'function') {
					var result = baseParam.call(_,_);
					return (!result) ? INJECT(initialContents,function(inj,node,i){ inj[i] = node; }) : result;
				}
				return baseParam;
			},function(){
				this.addContainer(initialContents,"initial-contents");
			});
			
			//다른컨테이너도 플레이스 홀더 설정을 합니다.
			PROPEACH(this.Source,function(value,key){ 
				_.addContainer( noConfigMode ? value : undefined,key); 
			});
		} else {
			console.error("NFTabContents::해당 컨테이너를 찾을수 없습니다. Navigation Controller의 작동을 완전히 중지합니다.=> ",container);
		}
	});
	
	nody.singleton("NFDataContextNotificationCenter",{
		addObserver:function(controller){
			if(controller)this.notificationObservers.push(controller);
		},
		notification:function(methodName,params){
			DATAEACH(this.notificationObservers,function(observer){
				if (typeof observer[methodName] === "function"){
					observer[methodName].apply(observer,params);
				} else {
					console.warn("NFDataContextNotificationCenter",methodName," : 노티피케이션 api가 존재하지 않습니다. =>",observer);
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
		this.notificationObservers = new NFArray();
		this.notificationBindEventLock = false;
	});
	
	nody.module("NFDataContext",{
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
			
			var result    = new NFArray();
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
					return new NFObject(data).remove(this.SourceChildrenKey).get();
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
								selectData = new NFArray(selectData).getMap(function(data){
									if (ISARRAY(data)){
										return data;
									} else {
										return owner.Source[owner.SourceChildrenKey];
									}
								}).flatten().remove(undefined);
								break;
						}
					} else if(typeof pathKey === "number") {
						selectData = new NFArray(selectData).getMap(function(data){
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
				
				var makeManagedData = ISARRAY(data) ? new NFManagedData(this,this._clearData(data),"array") : new NFManagedData(this,this._clearData(data),"object");
				
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
			if(mdata.Child.length > 0) prop.push( 
				(ra ? '' : '\"'+this.SourceChildrenKey + '\":[' ) + 
				mdata.Child.getMap( function(managedData){ return owner.trace(managedData); } ).join(", ") + 
				(ra ? "" : "]")
			);
			return rs + prop.join(", ") + re;
		},
		getJSONString:function(){ return this.trace(); },
		getJSONObject:function(){ return JSON.parse(this.getJSONString()); },
		
		// path로 메니지드 데이터를 얻습니다.
		getManagedData:function(path,withChildren){
			if(typeof path == '/') return this.RootManagedData;
			if (path.indexOf("/") == 0) path = this.ID + path;
			var paths    = path.split("/");
			var thisID   = this.ID;
			var thisRoot = this.RootManagedData;
			
			var selectedManagedData;
			
			DATAEACH(paths,function(path){
				if(thisID == path) {
					selectedManagedData = thisRoot;
				} else {
					selectedManagedData = selectedManagedData.Child[parseInt(path)];
				}
			});
			return selectedManagedData;
		},
		querySelectData:function(path){
			var resultData = [this.RootManagedData];
			if(path == '/' || path == '') return resultData;
			var pathes = [];
			
			path.replace(/\*\*.+/g,'**').replace(/\/[^\/]+/g,function(s){ pathes.push(s.substr(1)); });
			
			DATAEACH(pathes,function(path,i){
				var searchTarget = resultData;
				var searchResult = [];
				if(path == '') return false;
				if(path == '*'){
					DATAEACH(searchTarget,function(managedData){
						searchResult = searchResult.concat(managedData.Child.toArray());
					});
				} else if(path == '**') {
					DATAEACH(searchTarget,function(managedData){
						managedData.feedDownManagedData(function(){
							searchResult.push(this);
						});
					});
				} else if(/\[[^\]]+\]/.test(path)){
					//속성만 명시된경우
					var wantedProps = {};
					
					//FROM ELUT_REGEX
					path.replace(new RegExp("\\[[\\w\\-\\_]+\\]|\\[\\\'[\\w\\-\\_]+\\\'\\]|\\[\\\"[\\w\\-\\_]+\\\"\\]","gi"),function(s){
						wantedProps[s.substr(1,s.length-2)] = null;
						return '';
					}).replace(new RegExp("\\[[\\w\\-\\_]+\\=[^\\]]+\\]|\\[\\\'[\\w\\-\\_]+\\\'\\=\\\'[^\\]]+\\\'\\]|\\[\\\"[\\w\\-\\_]+\\\"\\=\\\"[^\\]]+\\\"\\]","gi"),function(s){
						var attr = /\[([\"\'\w\-\_]+)(=|~=|)(.*|)\]$/.exec(s);
						if(attr) {
							wantedProps[UNWRAP(attr[1],["''",'""'])] = (attr[3]) ? UNWRAP(attr[3],["''",'""']) : null;
						} else {
							console.warn('//!devel target parse err',attr,path);
						}
					});
					
					if(/\[[^\]]+\]\*\*$/.test(path)) {
						DATAEACH(searchTarget,function(managedData){
							managedData.feedDownManagedData(function(){
								var md   = this;
								var pass = true;
								PROPEACH(wantedProps,function(v,k){
									return pass = (v === null || v === '') ? md.hasValue(k) : (md.value(k) == v);
								});
								if(pass === true) searchResult.push(md);
							});
						});
					} else {
						DATAEACH(searchTarget,function(managedData){
							var passData = [];
							DATAEACH(managedData.Child,function(managedData){
								var pass = true;
								PROPEACH(wantedProps,function(v,k){
									return pass = (v === null || v === '') ? managedData.hasValue(k) : (managedData.value(k) == v);
								});
								if(pass === true) searchResult.push(managedData);
							});
						});
					}
				} else if(ISNUMBERTEXT(path)){
					DATAEACH(searchTarget,function(managedData){
						var ch = managedData.Child[parseInt(path)];
						if(ch){ searchResult.push(ch); }
					});
				} else {
					DATAEACH(searchTarget,function(managedData){
						DATAEACH(searchTarget,function(managedData){
							if( managedData.BindID == path ) searchResult.push(managedData);
						});
					});
				}
				resultData = searchResult;
			});
			return resultData;
		},
		getManagedDataWithID:function(findid){
			return this.RootManagedData.getManagedDataWithID(findid);
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
		this.ID                = NFUtil.base36UniqueRandom(5,'co');
		this.Source            = TOOBJECT(source,"value");
		this.SourceChildrenKey = childrenKey || "data";
		// 데이터 안의 모든 Managed data를 생성하여 메타안에 집어넣음
		this.RootManagedData = this.feedDownManagedDataMake(this.Source,"root");
	});
	
	nody.module("NFViewModel",{
		needRenderView:function(depth,managedData,feedViews,viewController){
			var renderResult = (ISTYPE(this.Source[depth],"NFTemplate") == true) ? managedData.template(this.Source[depth]) : this.Source[depth].call(managedData,managedData,feedViews);
			
			if( renderResult !== false) if(typeof renderResult === 'object' && 'nodeName' in renderResult ) {
				return renderResult;
			} else {
				if(ISARRAY(renderResult)) {
					if( renderResult.length == 1 ) return renderResult[0];
					var singleData = DATAZERO(renderResult);
					console.log('경고::NFViewModel의 최종 렌더 노드는 하나만 반환되어야 합니다',renderResult);
					return singleData;
				} 
				console.error("오류::NFViewModel의 렌더값이 올바르지 않습니다. 대체 렌더링이 실시됩니다.=>",renderResult, this.Source[depth]);
			}
			return MAKE("div",{html:TOSTRING(managedData.value()),style:'padding-left:10px;'},managedData.placeholder("div"));
		},
		clone:function(){
			var init = this.Source.clone();
			for(var i=0,l=arguments.length;i<l;i++) if( arguments[i] ) init[i] = arguments[i];
			return _NFViewModel.apply(undefined,init.toArray());
		}
	},function(renderDepth){
		//tempate 타겟을 설정
		this.Source = new NFArray(Array.prototype.slice.call(arguments)).getMap(function(a){ 
			if(typeof a === "string"){
				return new NFTemplate(a);
			}
			return a; 
		});
	});
	
	nody.module("NFManagedData",{
		//노드구조
		appendChild:function(childrens){
			var parent = this;
			DATAEACH(childrens,function(child){
				parent.Child.push(child);
				child.Parent = parent;
			});
		},
		removeFromParent:function(){
			if(this.Parent){
				this.Parent.Child.remove(this);
				this.Parent = undefined;
			}
		},
		removeChildren:function(childrens){
			var owner = this;
			DATAEACH(childrens,function(child){
				var index = owner.Child.indexOf(child);
				var select = owner.Child[index];
				if (select) {
					select.removeFromParent();
				}
			});
		},
		breakableFeedDownManagedData:function(method,param){
			var newParam = method.call(this,param);
			
			if(newParam !== false) {
				DATAEACH(this.Child,function(child){ 
					return child.breakableFeedDownManagedData(method,newParam); 
				});
			}
			
			return newParam;
		},
		//현재부터 자식으로 
		feedDownManagedData:function(method,param){
			var newParam = method.call(this,param);
			DATAEACH(this.Child,function(child){ child.feedDownManagedData(method,newParam); });
			return this;
		},
		feedUpManageData:function(method,depth){
			// 돌리는 depth
			var depth = depth ? depth : 0;
			//데이타 얻기
			var mangedDatas = this.Child;
			
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
		replaceValue:function(data,rerender){
			if( ISTYPE(data,'NFManagedData') ) data = data.value();
			if( typeof data === 'object' ) this.Source = CLONE(data);
			if( rerender === true ) this.rerender();
		},
		hasValue:function(key){ return (key in this.Source); },
		value:function(key,value,sender){
			// Read
			if( arguments.length == 0) return CLONE(this.Source);
			if( arguments.length == 1) {
				if(typeof key === 'object'){
					for(var k in key){ this.value(k,key[k],sender); }
					return this;
				}
				return this.Source[key];
			}
			// Write
			this.Source[key] = value;
			NFDataContextNotificationCenter.managedDataBindEvent(this.BindID,key,value,sender);
			return this;
		},
		removeValue:function(key,sender){
			if(key in this.Source){
				delete this.Source[key];
				NFDataContextNotificationCenter.managedDataBindEvent(this.BindID,key,"",sender);
			}
		},
		text:function(key){
			return MAKETEXT( this.value.apply(this,arguments) )
		},
		bind:function(dataKey,bindElement,optional){
			if(this.scope) {
				//엘리먼트 기본설정값
				var element = ISELNODE(bindElement) ? bindElement : typeof bindElement === "undefined" ? CREATE("input!"+bindElement) : CREATE(bindElement);
				//optional은 기존에 실제 존재하였는지 확인하여 입력
				this.scope.addBindNode(element,this,dataKey,!this.hasValue(dataKey));
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
		template:function(_template,dataFilter){
			var templateNode,_ = this;
			// dataFilter 에서 function렌더링시 메니지드데이터를 가르키게 한다.
			if(typeof dataFilter === 'object') dataFilter = PROPMAP(dataFilter,function(v){
				if(typeof v === 'function') return function(){ return v.apply(_,Array.prototype.slice.call(arguments)); };
				return v;
			});
			
			if(typeof _template === 'object')        { templateNode = _template.clone(this.value(),dataFilter);
			} else if(typeof _template === 'string') { templateNode = new NFTemplate(_template,this.value(),dataFilter,true);
			} else                                   { console.error('template 값이 잘못되어 랜더링을 할수 없었습니다.',_template); return false; }
			
			if(templateNode.isNone()) { console.error("template :: 렌더링할 template를 찾을수 없습니다",templateNode); return false; }
			
			templateNode.partialNodeProps(['bind','action','placeholder'],
				function(name,node,nodeAlias){
					switch(nodeAlias){
						case 'bind': _.bind(name,node); break;
						case 'action':
							if(("nf-param" in node.attributes)) {
								_.action(name,node,TOOBJECT(node.getAttribute("nf-param")));
								node.removeAttribute("nf-param");
							} else {
								_.action(name,node);
							}
							break;
						case 'placeholder': _.placeholder(node); break;
					}
				}
			);
			
			return templateNode;
		},
		revertData:function(){
			this.context.getDataWithPath(this.path);
		},
		getPath:function(){
			var path = new NFArray();
			this.chainUpMangedData(function(){ path.push( this.Parent ? this.Parent.Child.indexOf(this) : this.context.ID); });
			return path.reverse().join("/");
		},
		querySelectData:function(path){
			if(path == '' || path == '/') return [this];
			return this.context.querySelectData( this.getPath() + '/' + path );
		},
		getManagedDataWithID:function(findid){
			if(typeof findid == 'string') {
				var result;
				this.breakableFeedDownManagedData(function(){
					if( this.BindID == findid ) {
						result = this;
						return false;
					}
				});
				return result;
			}
		},
		getParentManagedData : function(){ return this.Parent; },
		getChildManagedData  : function(){ return this.Child; },
		hasParentManagedData : function(){ return !!this.Parent; },
		hasChildManagedData  : function(){ return !!this.Child.length; },
		getDepth:function(){ var depth = 0; this.feedUpManageData(function(m,d){ if (depth < (d + 1)) depth = (d + 1); }); return depth; },
		getLevel:function(){ var level = 0; this.chainUpMangedData(function(){ this.Parent ? level++ : undefined; }); return level; },
		getIndex:function(){ return this.Parent.Child.indexOf(this); },
		getBindID:function(){ return this.BindID; },
		getContextID:function(){ return this.context.ID; },
		findById:function(id){
			if(this.BindID == id){
				return this;
			} else {
				var findID;
				this.Child.each(function(child){
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
			NFDataContextNotificationCenter.managedDataNeedRerender(this);
		},
		managedDataIndexExchange:function(changeTarget){
			if(changeTarget){
				var bindId1= this.BindID;
				var bindId2= changeTarget.BindID;
				var index1 = this.getIndex();
				var index2 = changeTarget.getIndex();
				this.Parent.Child.changeIndex(index1,index2);
				NFDataContextNotificationCenter.managedDataChangePosition(bindId1,bindId2);
				return true;
			}
			return false;
		},
		//상위 인덱스로
		managedDataIncrease:function(){
			var nextManagedData = this.Parent.Child[this.Parent.Child.indexOf(this)+1];
			if (nextManagedData) return this.managedDataIndexExchange(nextManagedData);
			return false;
		},
		//하위 인덱스로
		managedDataDecrease:function(){
			var prevManagedData = this.Parent.Child[this.Parent.Child.indexOf(this)-1];
			if (prevManagedData) return this.managedDataIndexExchange(prevManagedData);
			return false;
		},
		//현재 데이터를 제거함
		removeManagedData:function(onlyThis){
			if(onlyThis === true) {
				this.removeFromParent();
				NFDataContextNotificationCenter.removeManagedData(this.BindID);
			} else {
				this.feedUpManageData(function(md){ 
					md.removeManagedData(true);
				});
			}
		},
		//하위 데이터를 추가함
		addChildData:function(data){
			if(typeof data === "function") data = data();
			if(typeof data === "object") {
				this.context.feedDownManagedDataMake(data||{},this);
				var makedData = this.Child.last();
				NFDataContextNotificationCenter.addChildData(this.BindID,makedData);
				return makedData;
			} else {
				console.warn("addChildData :: append data가 들어오지 않았습니다", data);
			}
		},
		addMemberData:function(data){
			if(this.Parent) return this.Parent.addChildData(data);
		}
	},function(context,initData,dataType){
		this.BindID     = NFUtil.base62UniqueRandom(8,'ma');
		this.context    = context;
		this.Source     = initData;
		this.SourceType = dataType || "object";
		//노드구조
		this.Child  = new NFArray();
		this.Parent     = undefined;        
		//현재 컨트롤중인 뷰컨트롤입니다.
		this.scope      = undefined;
	});
	
	nody.module("NFPresentor",{
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
				var removeBindNodeTarget = new NFArray();
				
				DATAEACH(this.bindValueNodes,function(bindNode){
					var hasNode = FIND(bindNode[2],owner.structureNodes[bindID],0);
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
			var parentManData = rerenderManagedData.getParentManagedData();
			if(parentManData) {
				//부모의 placeholder가 존재해야 작동함
				var parentPlaceHolder = this.placeholderNodes[parentManData.getBindID()];
				var beforeElement     = this.structureNodes[rerenderManagedData.getBindID()];
				var beforePlaceHolder = this.placeholderNodes[rerenderManagedData.getBindID()];
				//console.log('parentPlaceHolder,beforeElement,beforePlaceHolder',parentPlaceHolder,beforeElement,beforePlaceHolder)
				
				if(!beforeElement) console.error('rerender 대상의 데이터를 찾을 수 없습니다.') ;
				if(parentPlaceHolder) {
					//바꿔치기 하기
					this.needDisplay(rerenderManagedData,parentPlaceHolder,true);
					ELBEFORE(beforeElement,this.structureNodes[rerenderManagedData.BindID]);
					//placeHolder를 가지고 있었을 경우에만 호출됨
					if(beforePlaceHolder) ELAPPEND(this.placeholderNodes[rerenderManagedData.BindID],beforePlaceHolder.children);
					ELREMOVE(beforeElement)
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
				ELVALUE( element, managedData.value(dataKey) );
				
				//바인드 값을 입력함
				this.bindValueNodes.push( [managedData.BindID,dataKey,element] );
				
				//이벤트를 등록합니다.
				switch(element.tagName.toLowerCase()){
					//write
					case "input" :
						ELON (element,"keyup",function(e) {
							setTimeout(function(){
								var value = ELVALUE(element);
								if( (optinal == true) && value == "" ) return managedData.removeValue(dataKey,element);
								managedData.value(dataKey,value,element);
							},0);
						});
						break;
					case "select":
						ELON (element,"change",function(e){
							setTimeout(function(){
								var value = ELVALUE(element);
								if( (optinal == true) && value == "" ) return managedData.removeValue(dataKey,element);
								managedData.value(dataKey,value,element);
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
			if(ISTYPE(managedData,"NFDataContext")) managedData = managedData.getRootManagedData();
			if(ISTYPE(managedData,"NFManagedData")) {
				this.managedData = managedData;
				CALL(this.dataDidChange,this);
				return true;
			}
			if(typeof managedData === 'object') {
				this.managedData = new NFDataContext(managedData).getRootManagedData();
				return true;
			}
			console.warn("setManagedData::managedData 오브젝트가 필요합니다. 들어온 값->", managedData);
			return false;
		},
		needDisplay:function(managedData,rootElement,sigleRenderMode){
			//기본적으로 존재하지 않는값을 경고해줌
			if(!this.managedData) console.warn("DataContextViewController:: Must need set NFManagedData before needdisplay");
			if(!this.viewModel) console.warn("DataContextViewController:: Must need set NFViewModel before needdisplay");
			//파라메터 두개가 존재하지 않으면 초기화 진행을 한다
			if( (!managedData) && (!rootElement) ){
				this.view.innerHTML= '';
				this.bindValueNodes = new NFArray();
				this.structureNodes = {};
				this.placeholderNodes = {};
				this.selectIndexes  = new NFArray();
			}
			managedData     = managedData || this.managedData;
			rootElement     = rootElement || this.view;
			var viewController = this;
			var feedCollection = ARRAYARRAY(this.managedData.getDepth());
			var lastFeed       = null;
			var topLevel       = this.managedData.getLevel();
			var startDepth     = managedData.getLevel();
			
			//후가공
			var renderPostpress = function(node,managedData,depth){
				node.setAttribute('data-managed-id',managedData.BindID);
				node.setAttribute('data-managed-depth',depth);
			};
			
			if (sigleRenderMode == true) {
				// 메니지드 데이터에 현재 스코프를 등록함
				managedData.scope = viewController;
				//slngleRenderMode의 관리는 매우 중요함 else문의 블럭과 동일하게 동작하도록 주의할것
				var renderResult = viewController.viewModel.needRenderView(startDepth-topLevel,managedData,[],viewController);
				renderPostpress(renderResult,managedData,startDepth - topLevel);
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
						renderPostpress(renderResult,managedData,depth);
						//루트에 추가
						rootElement.appendChild(renderResult);
						//컨테이너에 추가
						if( viewController.placeholderNodes[managedData.BindID] ) ELAPPEND(viewController.placeholderNodes[managedData.BindID],feedCollection[depth+1]);
						feedCollection[depth+1] = [];
					} else if (depth < lastFeed) {
						// 렌더 피드가 올라감
						var renderResult = viewController.viewModel.needRenderView(depth-topLevel,managedData,feedCollection[lastFeed],viewController);
						renderPostpress(renderResult,managedData,depth);
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
						renderPostpress(renderResult,managedData,depth);
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
		getManagedDataWithNode:function(node,strict){
			if(strict === true) {
				for(var key in this.structureNodes) if(this.structureNodes[key] === node) return this.managedData.getManagedDataWithID(key);
			} else {
				if( ELIS(node,'[data-managed-id]') ) return this.getManagedDataWithNode(node,true);
				var parentNode = FINDPARENT(node,'[data-managed-id]');
				if(parentNode) return this.getManagedDataWithNode(parentNode,true);
			}
		},
		findWithManagedData:function(md){
			return this.structureNodes[md.getBindID()];
		},
		findWithBindID:function(bindID){
			return this.structureNodes[bindID];
		},
		needActiveController:function(selectPath,allowSelect,allowMultiSelect,allowInactive,firstSelect){
			if(selectPath.indexOf('/')  >= 0) {
				var _  = this, __ = this.managedData;
				selectPath = (typeof selectPath == 'string') ? selectPath : '/*';
				return new NFActiveController(this.view,function(){
					return DATAMAP(__.querySelectData(selectPath),function(managedData){ return _.structureNodes[managedData.BindID]; },DATAFILTER);
				},'click',function(e){
					return CALL(allowSelect,this,e,_.getManagedDataWithNode(this));
				},firstSelect,allowMultiSelect,allowInactive);
			} else {
				var _ = this;
				return new NFActiveController(this.view,selectPath,'click',function(e){
					return CALL(allowSelect,this,e,_.getManagedDataWithNode(this),_);
				},firstSelect,allowMultiSelect,allowInactive);
			}
		},
		//이벤트
		whenDataDidChange:function(m){ if((typeof m === "function") || m == undefined) this.dataDidChange = m; },
		
		"+dataDidChange":undefined
	},function(view,managedData,viewModel,needDisplay){
		this.view = FSINGLE(view)[0];
		if(!this.view) console.error('초기화 실패 View를 찾을수 없음 => ', view);
		if(managedData)this.setManagedData(managedData);
		this.viewModel     = viewModel ? ISARRAY(viewModel) ? _NFViewModel.apply(undefined,TOARRAY(viewModel)) : viewModel : new NFViewModel();
		
		//바인딩 관련 인자
		this.bindValueNodes = [];
		this.structureNodes = {};
		this.placeholderNodes = {};
		
		NFDataContextNotificationCenter.addObserver(this);
		
		//needDisplay
		if(typeof needDisplay === "function") needDisplay = CALL(needDisplay,this);
		if(needDisplay === true) this.needDisplay();
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
	
	nody.module("NFTimeFire",{
		cancel:function(withEvent){
			if(withEvent !== false) CALL(this._whenCancle,this);
			clearTimeout(this._timeout);
			this._timeout = null;
		},
		trigger:function(withEvent){
			if(withEvent !== false) {
				if( CALL(this.whenTriggering,this) === false ) {
					return;
				}
			} 
			if( this._timeout ) clearTimeout(this._timeout);
			var _ = this;
			this._timeout = setTimeout(function(){
				if( CALL(_._whenWillFire,_) !== false ) {
					CALL(_._whenFire,_);
					CALL(_._whenDidFire,_);
				}
				_.cancel(false);
			},this.initFireTime);
		},		
		whenTriggering:function(m){
			this._whenTriggering = m;
		},
		whenCancle:function(m){
			this._whenCancel = m;
		},
		whenWillFire:function(m){
			this._whenWillFire = m;
		},
		whenFire:function(m){
			if(typeof m !== 'function') console.error('NFTimeFire:: Fire시 메서드가 들어오지 않았습니다.');
			this._whenFire = m;
		},
		whenDidFire:function(m){
			this._whenDidFire = m;
		}
	},function(fireTime,finish,triggerNow,rate){
		this.initFireTime = typeof fireTime === 'number' ? fireTime : 300;
		this.rate         = typeof rate     === 'number' ? rate     : 50;
		this.whenFire(finish);
		this._timeout   = null;
		if(triggerNow === true) this.trigger();
	});
	
	nody.method('ATOB',function(a,b,p){
		a = TONUMBER(a);
		b = TONUMBER(b);	
		p = TONUMBER(p);
		return (((b-a)/100)*p)+a;
	});
	
	nody.module("NFResize",{
		width:function(){
			return this.Source.offsetWidth;
		},
		height:function(){
			return this.Source.offsetHeight;
		},
		trigger:function(data){
			this.Handler(data);
		},
		destroy:function(){ ELOFF(window,'resize',this.Handler); }
	},function(target,triggeringMethod,firstTriggering,delay){
		this.Source = FSINGLE(target)[0];
		this.TriggeringMethod = triggeringMethod;
		this.Delay          = TONUMBER(delay);
		
		if(this.Source && this.TriggeringMethod) {
			//if(setWidth) ELSTYLE(this.Source,'width',TOPX(setWidth));
			//if(setHeight) ELSTYLE(this.Source,'height',TOPX(setHeight));
			
			if(firstTriggering !== true) {
				this.lastWidth  = this.Source.offsetWidth;
				this.lastHeight = this.Source.offsetHeight;
			}
			
			var _ = this;
			this.Handler = function(e){
				
				
				if( _.Delay ) {
					var t = setTimeout(function(){
						
						//오프셋이 올바르지 않은 엘리먼트가 도큐먼트에 종속되지 않은 상태라면
						if( _.Source.offsetWidth == 0 || _.Source.offsetHeight == 0) 
							if( FINDPARENTS(_.Source,DATALAST).tagName !== 'HTML' ) return;
						
						if( (_.lastWidth !== _.Source.offsetWidth) || (_.lastHeight !== _.Source.offsetHeight) ){
							_.lastWidth  = _.Source.offsetWidth;
							_.lastHeight = _.Source.offsetHeight;
							_.TriggeringMethod.call(_.Source,e,_);
						}
						clearTimeout(t);
					},_.Delay);
				} else {
					if( _.Source.offsetWidth == 0 && _.Source.offsetHeight == 0) return;
					if( (_.lastWidth !== _.Source.offsetWidth) || (_.lastHeight !== _.Source.offsetHeight) ){
						_.lastWidth  = _.Source.offsetWidth;
						_.lastHeight = _.Source.offsetHeight;
						_.TriggeringMethod.call(_.Source,e,_);
					}
					
				}
			};
			if(firstTriggering === true) {
				this.Handler({});
			}
			
			ELON(window,'resize',this.Handler);
		}
	});
	
	nody.module("NFTouch",{
		getPinchDistance:function(fx1,fy1,fx2,fy2){
			return Math.sqrt(
				Math.pow((fx1-fx2),2),
				Math.pow((fy1-fy2),2)
			)
		},
		setAllowVirtureTouch:function(flag,scaleWheel){
			if(!this.AllowVirtureTouch && flag) {
				this.AllowVirtureTouch = true;
				var wasStart = false;
				var startSource = this.Source;
				var endSource   = this.AllowOuterEvent ? document.body : this.Source;
				ELON(startSource,"mousedown",function(e){
					wasStart = true;
					e.preventDefault();
					ELTRIGGER(startSource,"touchstart",{touches:[{pageX:e.pageX,pageY:e.pageY}]});
				})
				ELON(endSource,"mousemove",function(e){
					if(wasStart) {
						e.preventDefault();
						ELTRIGGER(endSource,"touchmove",{touches:[{pageX:e.pageX,pageY:e.pageY}]});
					}
				});
				ELON(endSource,"mouseup",function(e){
					wasStart = false;
					e.preventDefault();
					ELTRIGGER(endSource,"touchend",{touches:[{pageX:e.pageX,pageY:e.pageY}]});
				});
				if(this.AllowOuterEvent == false) {
					ELON(startSource,"mouseout",function(e){
						if(e.target == e.currentTarget) {
							wasStart = false;
							e.preventDefault();
							ELTRIGGER(startSource,"touchend",{touches:[{pageX:e.pageX,pageY:e.pageY}]});
						}
					});
				}
				this.AllowVirtureTouchScale = !!scaleWheel;
				if(this.AllowVirtureTouchScale) {
					var _ = this;
					ELON(startSource,'mousewheel',function(e){
						e.preventDefault();
						CALL(_.GestureListener["pinch"],this,e.wheelDelta/1500);
					});
				}
			}
		},
		applyTouchEvent:function(flag){
			if(typeof flag !== "boolean") return;
			if(typeof this._applyTouchEvent === "undefined") {
				var _ = this;
				//touch start
				this._currentTouchStartEvent = function(e){
					
					if (_.GestureListener["pinch"] && (e.touches.length === 2)) {
						e.stopPropagation();
						e.preventDefault();
						_.StartPinchValue = _.getPinchDistance(
							 e.touches[0].pageX,
							 e.touches[0].pageY,
							 e.touches[1].pageX,
							 e.touches[1].pageY
						);
						CALL(_.GestureListener["pinchStart"],_.Source,e);
						return;
					}
					if (_.GestureListener["touchMove"] && (e.touches.length === 1)) {
						e.stopPropagation();
						_.StartTouchMoveX = _.TouchMoveX = e.touches[0].pageX;
						_.StartTouchMoveY = _.TouchMoveY = e.touches[0].pageY;
					}
					if (_.GestureListener["touchStart"] && (e.touches.length === 1)) {
						e.stopPropagation();
						CALL(_.GestureListener["touchStart"],_.Source,e.touches[0].pageX,e.touches[0].pageY,e);
					}
					
				};
				//touch move
				this._currentTouchMoveEvent = function(e){
					//2 _
					if(_.GestureListener["pinch"] && _.StartPinchValue && (e.touches.length === 2)){
						if(!_.AllowPinch) return;
						e.stopPropagation();
						e.preventDefault();
						var currentDistance = _.getPinchDistance(
							 e.touches[0].pageX,
							 e.touches[0].pageY,
							 e.touches[1].pageX,
							 e.touches[1].pageY
						);
						CALL(_.GestureListener["pinch"],_.Source,-((_.StartPinchValue / currentDistance) - 1))
					}
					//핀치시에는 이벤트를 초기화함
					if(_.StartPinchValue) {
						_.StartTouchMoveX = _.TouchMoveX = undefined;
						_.StartTouchMoveY = _.TouchMoveY = undefined;
						return;
					}
					
					//1 _
					if (_.GestureListener["touchMove"] && (e.touches.length === 1)) {
						//시작한 터치무브가 존재하지 않을경우에는 작동되지 않음 (바깥쪽 이벤트가 Touch끼리 서로 섞이지 않게 하기 위함)
						if(_.StartTouchMoveX === undefined) return;
						
						var moveX = e.touches[0].pageX - _.TouchMoveX;
						var moveY = e.touches[0].pageY - _.TouchMoveY;
						_.TouchMoveX = e.touches[0].pageX;
						_.TouchMoveY = e.touches[0].pageY;
						
						//CALL(_.GestureListener["touchMove"],_.Source,moveX,moveY,e);
						if(CALL(_.GestureListener["touchMove"],_.Source,moveX,moveY,e) !== false){
							e.stopPropagation();
							e.preventDefault();
						} else {
							_._currentTouchStartEvent(e);
						}
					}
				};
				//touch end
				this._currentTouchEndEvent = function(e){
					e.stopPropagation();
					_.StartTouchMoveX = _.TouchMoveX = undefined;
					_.StartTouchMoveY = _.TouchMoveY = undefined;
					_.StartPinchValue = undefined;
					CALL(_.GestureListener["touchEnd"],e);
				};
				
				this._applyTouchEvent = false;
			} 
			
			if(this._applyTouchEvent !== flag) {
				var moveReciveTarget = this.AllowOuterEvent ? document.body : this.Source;
				if(flag){
					ELON(this.Source,"touchstart",this._currentTouchStartEvent);
					ELON(moveReciveTarget,"touchmove",this._currentTouchMoveEvent);
					ELON(moveReciveTarget,"touchend",this._currentTouchEndEvent);
				} else {
					ELOFF(this.Source,"touchstart",this._currentTouchStartEvent);
					ELOFF(moveReciveTarget,"touchmove",this._currentTouchMoveEvent);
					ELOFF(moveReciveTarget,"touchend",this._currentTouchEndEvent);
				}
				this._applyTouchEvent = flag;
			}
		},
		getGestureX:function(){ return this.TouchMoveX - this.StartTouchMoveX; },
		getGestureY:function(){ return this.TouchMoveY - this.StartTouchMoveY; },
		whenPinchStart:function(method){ this.GestureListener["pinchStart"] = method; },
		whenPinch:function(method){ this.GestureListener["pinch"] = method; },
		whenTouchStart:function(method){ this.GestureListener["touchStart"] = method; },
		whenTouchBegin:function(method){ this.GestureListener["touchBegin"] = method; },
		whenTouchMove:function(method){ this.GestureListener["touchMove"] = method; },
		whenTouchEnd:function(method){ this.GestureListener["touchEnd"] = method; },
		destroy:function(){ this.applyTouchEvent(false); }
	},function(gestureView,allowOuterMove,allowVitureTouch){
		this.Source = FSINGLE(gestureView)[0];
		this.GestureListener = {};
		this.StartPinchValue;
		this.StartTouchMoveX;
		this.StartTouchMoveY;
		this.TouchMoveX;
		this.TouchMoveY;
		this.AllowOuterEvent = !!(allowOuterMove === true);
		this.AllowPinch = true;
		var finger = this;
		
		if(this.Source) this.applyTouchEvent(true);
		if(allowVitureTouch === true) this.setAllowVirtureTouch(true);
	});
	
	nody.module("NFScrollBox",{
		needScrollingOffsetX:function(offset){
			if(!this.allowScrollX || offset == 0 || (typeof offset !== 'number') ) return false;
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
			if(!this.allowScrollY || offset == 0 || (typeof offset !== 'number') ) return false;
			
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
		needScrollingToX:function(needTo){
			return this.needScrollingOffsetX( this.Source.scrollLeft - needTo );
		},
		needScrollingToY:function(needTo){
			return this.needScrollingOffsetY( this.Source.scrollTop - needTo );
		},
		needScrollingTo:function(needX,needY){
			return (this.needScrollingToX(needX),this.needScrollingToY(needY));
		},
		needScrollingPercentY:function(per){
			if(typeof per === 'number'){
				if(per < 0) { per = 0; }
				if(per > 100) { per = 100; }
				var scrollTarget = ((this.Source.scrollHeight - this.Source.offsetHeight) / 100) * per;
				this.Source.scrollTop = scrollTarget;
			}
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
		focusTo:function(s){
			var select = FIND(s,this.Source,0);
			if(select) {
				var offset = FINDOFFSET(select,this.ClipView);
				if(offset) {
					this.needScrollingToX(offset.x + (offset.width / 2) - (this.Source.offsetWidth / 2) );
					this.needScrollingToY(offset.y + (offset.height / 2) - (this.Source.offsetHeight / 2) );
					return select;
				}
			}
			return false;
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
		setAllowVirtureTouch:function(flag){ this.Touch.setAllowVirtureTouch(true); },
		//scroll event
		whenScroll            :function(m){ 
			this.ScrollEvent.Scroll = (!m) ? undefined : BINDFUNCTION(this.ScrollEvent.Scroll,m);
		},
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
					this.Touch.applyTouchEvent(true);
				} else {
					ELOFF(this.Source,"mousewheel",this._currentMouseWheelEvent);
					ELOFF(this.Source,"scroll",this._currentScrollEvent);
					this.Touch.applyTouchEvent(false);
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
					width:this.ClipView.offsetWidth ,
					//test
					height:this.ClipView.offsetHeight || this.Source.offsetHeight
				},
				contents:{
					width:this.Source.scrollWidth,
					height:this.Source.scrollHeight
				}
			}
		}
	},function(node,direction,virtureTouch){
		this.Source = FSINGLE(node)[0];
		this.isMoving = false;
		if(this.Source){
			
			this.axisYPositiveLength = 0;
			this.axisYNegativeLength = 0;
			this.axisYPositiveItems = [];
			this.axisYNegativeItems = [];
			
			this.ClipView = MAKE("div.nody-scroll-box-clip-view[style=min-height:100%]");
			ELSTYLE(this.ClipView,"transform","matrix(1,0,0,1,0,0)");
			ELSTYLE(this.ClipView,"position","relative");
			
			ELAPPEND(this.ClipView,this.Source.childNodes);
			ELAPPEND(this.Source,this.ClipView);
			
			//
			this.ScrollEvent = {};
			
			this.Touch = new NFTouch(this.Source);
			
			switch(direction) {
				case 'horizontal':
					this.allowScrollX = true;
					this.allowScrollY = false;
					break;
				case 'vertical':
					this.allowScrollX = false;
					this.allowScrollY = true;
					break;
				default :
					if(direction !== undefined) console.warn('NFScrollBox :: direction 파라메터 영역에 알수없는 커멘드가 들어왔습니다.',direction)
					this.allowScrollX = true;
					this.allowScrollY = true;
					break;
			}
			
			ELSTYLE(this.Source,"overflow","hidden");
			ELSTYLE(this.Source,"position","relative");
			
			var _ = this;
			//
			this.Touch.whenTouchMove(function(offsetX,offsetY,e){
				var result = false;
				if( (offsetY !== 0) && (_.needScrollingOffsetY(offsetY) == true) && (_.restYSpace() !== 0) ) result = true;
				if( (offsetX !== 0) && (_.needScrollingOffsetX(offsetX) == true) ) result = true;
				if(result) _.isMoving = true;
				return result;
			});
			this.Touch.whenTouchEnd(function(){
				var t = setTimeout(function(){
					_.isMoving = false;
					clearTimeout(t);
				},10);
			});
			this.applyScrollEvent(true);
			
			if(virtureTouch === true) this.setAllowVirtureTouch(true);
		} else {
			console.warn("ScrollBox제대로 불러오지 못했습니다.",node);
		}
	});
	
	nody.extendModule("NFScrollBox","NFZoomBox",{
		needZoom:function(needTo){
			needTo = TONUMBER(needTo);
			if(needTo < this.zoomMin) needTo = this.zoomMin;
			if(needTo > this.zoomMax) needTo = this.zoomMax;
			
			if(needTo === this.ZoomValue) return false;
			
			var offsetWidth  = Math.floor(((this.ClipView.offsetWidth  * needTo) - this.ClipView.offsetWidth) / 2);
			var offsetHeight = Math.floor(((this.ClipView.offsetHeight * needTo) - this.ClipView.offsetHeight) / 2);
			
			var zoomOffset = this.ZoomValue - needTo;
			if( zoomOffset !== 0) {
				this.needScrollingOffsetX( (this.Source.offsetWidth  * zoomOffset) / 2 );
				this.needScrollingOffsetY( (this.Source.offsetHeight * zoomOffset) / 2 );
			}
			
			ELSTYLE(this.ClipView,"transform","matrix("+needTo+",0,0,"+needTo+","+offsetWidth+","+offsetHeight+")");
			
			var _ = this;
			
			if( !this.wasClipTimeout ) clearTimeout(this.wasClipTimeout);
			this.wasClipTimeout = setTimeout(function(){ CALL(_.ZoomEvent,_); },305);
			
			CALL(this.ZoomEvent,this);
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
		setAllowZoom:function(flag){
			this.Touch.allowPinch = !!flag;
			this._allowZoom        = !!flag;
			return this;
		}
	},function(mainNode,initZoom){
		//scrollbox이벤트의 휠 이벤트를 변경
		var _ = this;
		this._currentMouseWheelEvent = function(e){
			e.preventDefault();
			if(_._allowZoom) if(e.wheelDelta) _.needZoomWithOffset(e.wheelDelta/1500)
		}
		
		this._super(mainNode);
		this.ZoomValue = 1.0
		this.zoomMin   = 1.0;
		this.zoomMax   = 3.0;
		this.ZoomEvent;
		this.resizeFix();
		this._allowZoom = true;
		this.Touch.whenPinch(function(zoomOffset,e){ 
			if(_._allowZoom) _.needZoomWithOffset(zoomOffset/30); 
		});
		this.setAllowVirtureTouch(true);
		
		if(typeof initZoom == "number") this.needZoom(initZoom);
	});
	
	nody.module("NFScrollTrack",{		
		resizeFix:function(){
			if(this._autoScrollTrackHeight && this._autoScrollBoxSync){
				var scrollBox = this._autoScrollBoxSync;
				var lengthPer = ((100 / scrollBox.Source.scrollHeight) * scrollBox.Source.offsetHeight)/100;
				ELSTYLE(this.ScrollHanlde,'height',TOPX(this.ScrollTrack.offsetHeight * lengthPer));
				
			}
			this.scrollLength = this.ScrollTrack.offsetHeight - this.ScrollHanlde.offsetHeight;
			if( (typeof this.scrollPoint) !== 'number') this.scrollPoint = 0;
		},
		needScrollOffset:function(y){
			var needTo = this.scrollPoint + y;
	
			if(needTo < 0) {
				this.scrollPoint = 0;
			} else if(needTo > this.scrollLength) {
				this.scrollPoint = this.scrollLength;
			} else {
				this.scrollPoint = needTo;
			}
			ELSTYLE(this.ScrollHanlde,'top',TOPX(this.scrollPoint));
			CALL(this._whenScroll);
		},
		needScrollPercent:function(per){
			ELSTYLE(this.ScrollHanlde,'top',TOPX((this.scrollLength / 100) * per));
		},
		whenScroll:function(m){
			var _ = this;
			if(typeof m === 'function') this._whenScroll = function(){ m.call(_,(100 / _.scrollLength ) * _.scrollPoint)};
		},
		syncWithScrollBox:function(scrollBox){
			if(typeof scrollBox === 'object' && 'needScrollingPercentY' in scrollBox) {
				var _ = this;
				this.whenScroll(function(per){
					scrollBox.needScrollingPercentY(per);
				});
				scrollBox.whenScroll(function(a,b,c){
					_.needScrollPercent( (100 / (scrollBox.Source.scrollHeight - scrollBox.Source.offsetHeight)) * scrollBox.Source.scrollTop );
				});
				this._autoScrollBoxSync = scrollBox;
				this.resizeFix();
			}
		}
	},function(scrollContainer,direction,autoResizeFix,autoScrollTrackHeight){
		this.Source      = FSINGLE(scrollContainer)[0];
		
		if(!this.Source) {
			return console.warn('스크롤바 초기화 실패하였습니다.');
		}

		this.ScrollHanlde = MAKE('div.nody-scroll-handle',{style:'position:relative;'});
		this.ScrollTrack  = MAKE('div.nody-scroll-track',{style:'position:absolute;'},this.ScrollHanlde);

		ELPUT(this.Source,this.ScrollTrack);

		this.Touch = new NFTouch(this.ScrollHanlde,true);
		this.Touch.setAllowVirtureTouch(true);
		var _ = this;
		this.Touch.whenTouchMove(function(x,y){
			if( _.ScrollTrack.offsetHeight - _.ScrollHanlde.offsetHeight > 0) _.needScrollOffset(y);
		});
		
		if(autoResizeFix !== false) {
			ELON(window,'resize',function(){
				_.resizeFix();
			});
		}
		this._autoScrollTrackHeight = autoScrollTrackHeight;
		
		this.resizeFix();
	});
	
	
})(window,nody.env);