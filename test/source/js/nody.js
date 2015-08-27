/* 
 * Nody js (https://github.com/labeldock/Nody)
 * Copyright HOJUNG-AHN. and other contributors
 * Released under the MIT license
 */
(function(){
	var N=(function(){return N.API.apply(window,Array.prototype.slice.call(arguments))});
	(function(W,NGetters,NSingletons,NModules,NStructure,nody){
	
		// Nody version
		N.VERSION = "0.30.0", N.BUILD = "1267";
	
		// Core verison
		N.CORE_VERSION = "2.0.5", N.CORE_BUILD = "91";
  
		// Pollyfill IE Console error fix
		if (typeof W.console !== "object") W.console = {}; 'log info warn error count assert dir clear profile profileEnd'.replace(/\S+/g,function(n){ if(!(n in W.console)) W.console[n] = function(){ if(typeof air === "object") if("trace" in air){ var args = Array.prototype.slice.call(arguments),traces = []; for(var i=0,l=args.length;i<l;i++){ switch(typeof args[i]){ case "string" : case "number": traces.push(args[i]); break; case "boolean": traces.push(args[i]?"true":"false"); break; default: traces.push(N.toString(args[i])); break; } } air.trace( traces.join(", ") ); } } });	
		
		// Bechmark : two times call the MARK('name');
		var MARKO = {}; W.MARK = function(name){ if(typeof name === "string" || typeof name === "number") { name = name+""; if(typeof MARKO[name] === "number") { var time = (+new Date() - MARKO[name]);console.info("MARK::"+name+" => "+time) ; delete MARKO[name]; return time  } else { console.info("MARK START::"+name); MARKO[name] = +new Date(); } } };
		
		// Pollyfill : Trim 
		if(!String.prototype.trim) String.prototype.trim = function() { return this.replace(/(^\s*)|(\s*$)/gi, ""); };
	 
		// Pollyfill : JSON
		if(typeof W.JSON === "undefined"){ W.JSON = { 'parse' : function(s) { var r; try { r = eval('(' + s + ')'); } catch(e) { r = N.toObject(s); } return r; }, 'stringify' : function(o) { return W.N.toString(obj,Number.POSITIVE_INFINITY,true); } };}
		
		// Pollyfill : bind
		if (!Function.prototype.bind) { Function.prototype.bind = function (oThis) { if (typeof this !== "function") { throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable"); } var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function () {}, fBound = function () { return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments))); }; fNOP.prototype = this.prototype; fBound.prototype = new fNOP(); return fBound; }; }
		
		// IE8 Success fix
		if (typeof W.success === "function"){W.success = "success";}
		
		var IS_MODULE = function(obj,moduleName){
			if(arguments.length == 1){
				if(typeof obj === "object" && ("__NativeHistroy__" in obj)){
					return true;
				}
			} else {
				if(typeof obj === "object" && obj !== null && (typeof moduleName === "string") && ("__NativeHistroy__" in obj)){
					for(var i=obj["__NativeHistroy__"].length-1;i>-1;i--){
						if(obj["__NativeHistroy__"][i] === moduleName) return true;
					}
				}
			}
			return false;
		};
		
		//NativeCore console trace
		N.API = function(name) {
			if(arguments.length === 0){
				return "Nody "+N.VERSION+" ("+N.BUILD+")";
			}
			if(typeof name === "string"){
			    if (NModules[name]) {
			        var result = name + "(" + /\(([^\)]*)\)/.exec(((NModules[name].prototype["set"]) + ""))[1] + ")";
			        var i2 = 0;
			        for (var protoName in NModules[name].prototype)
			            switch (protoName) {
						case "set": case "get": case "__NativeType__": case "__NativeHistroy__": case "__NativeHistroy__": case "constructor": case "__NativeClass__": case "_super": case "__NativeInitializer__": break; default:
			                    if (typeof NModules[name].prototype[protoName] === "function") result += "\n " + i2 + " : " + protoName + "(" + /\(([^\)]*)\)/.exec(((NModules[name].prototype[protoName]) + ""))[1] + ")";
			                    i2++;
			                    break;
			            }
			        return result;
			    }
			}
			return name + "is not found";
		};
		
		N.ALL     = function(){ var i,key,logText = []; var getterText = "# Native Getter"; for (i=0,l=NGetters.length;i<l;i++) getterText += "\n" + i + " : " + NGetters[i]; logText.push(getterText); var singletonText = "# Native Singleton"; i=0; for (key in NSingletons ) { singletonText += "\n" + i + " : " + key; var protoName,i2=0; switch(key){ case "ADVKIT": case "ELUT": case "NODY": case "FINDKIT": case "NODEKIT": case "ELKIT": var count = 0; for(protoName in NSingletons[key].constructor.prototype) count++; singletonText += "\n [" + count + "]..."; break; default: for(protoName in NSingletons[key].constructor.prototype) singletonText += "\n" + (i2++) + " : " + protoName; break; } i++; } logText.push(singletonText); var moduleText = "# Native Module"; i=0; for (key in NModules ) { moduleText += "\n MODULE(" + i + ") ::" + N.API(key); i++; } logText.push(moduleText); return logText.join("\n"); };
		N.DEBUGER = false;
	
		//NativeCore Start
		var NativeFactoryObject = function(type,name,sm,gm){
			if( !(name in NModules) ){
				var nativeProto,setter,getter,nodyModule;
				//console.log(name,type);
				switch(type){
					case "object":
						nativeProto = {};
						setter      = typeof sm === "function" ? 
									  function(){ sm.apply(this,Array.prototype.slice.call(arguments)); return this; } : 
									  function(v){ this.Source = v; return this; };
						getter      = gm?gm:function(){return this.Source;};
						var nodyObject = function(){ 
							if(typeof this.set === "function"){ 
								for(var protoKey in NModules[name].prototype) {
									//init inital variable
									if(/^\+[^+]+/.test(protoKey)) {
										this[protoKey.substr(1)] = NModules[name].prototype[protoKey];
									}
								}
								//set apppy
								this.set.apply(this,Array.prototype.slice.apply(arguments)); 
							} 
						};
						nodyModule = nodyObject;
						break;
					case "array":
						nativeProto = [];
						setter      = typeof sm === "function" ? 
									  sm : 
									  function(v){ return this.setSource(v); };
						getter      = function(){ return this.toArray.apply(this,arguments); };
						var nodyArray = function(){ 
							if(typeof this.set === "function"){ 
								for(var protoKey in NModules[name].prototype) {
									//init inital variable
									if(/^\+[^+]+/.test(protoKey)) {
										this[protoKey.substr(1)] = NModules[name].prototype[protoKey];
									}
								}
								//set apppy
								this.set.apply(this,Array.prototype.slice.apply(arguments)); 
							} 
						};
						nodyModule = nodyArray;
						break;
					default: throw new Error("NativeFactoryObject :: 옳지않은 타입이 이니셜라이징 되고 있습니다. => " + type);
				}
			
				NModules[name]               = nodyModule;
				NModules[name]["new"]        = (function(module){
					return function(){ return new (Function.prototype.bind.apply(module,[module].concat(Array.prototype.slice.call(arguments)))); };
				}(NModules[name]));
				NModules[name].prototype     = nativeProto;
				//native concept
				NModules[name].prototype.__NativeType__        = type;
				NModules[name].prototype.__NativeHistroy__     = [name];
				NModules[name].prototype.constructor = nodyModule;
				NModules[name].prototype.__NativeModule__       = function(n){ 
					return (arguments.length === 0) ? 
					this.__NativeHistroy__[this.__NativeHistroy__.length - 1] :
					this.__NativeHistroy__[this.__NativeHistroy__.length - 1] == n 
				};
				//
				NModules[name].prototype.set = setter;
				NModules[name].prototype.get = getter;
				NModules[name].prototype._super = function(a){
					//scope start
					var currentScopeDepth,
						currentScopeModuleName,
						currentScopePrototype,
						currentMethodName,
						currentCallMethod=arguments.callee.caller,
						superScope = 0;
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
					default   :
						if(/^\+\+[^\+]+/.test(key)){
							(function(module,moduleMethodName,moduleMethod){
								if(moduleMethodName) {
									if(typeof moduleMethod === "function") {
										module[moduleMethodName] = function(){
											return moduleMethod.apply(module,Array.prototype.slice.call(arguments));
										};
									} else {
										module[moduleMethodName] = moduleMethod;
									}
								}
							}(NModules[name],key.substr(2),methods[key]));
						}
						protoObject[key] = methods[key];
						break;
				} }
				return true;
			} else {
				//no exsist prototype object
				return false;
			}
		};
		var NativeFactoryDeploy = function(name){
			if(name in NModules) {
				(function(module){
					nody[name] = module;
					module.prototype.__NativeInitializer__ = module.new;
				}(NModules[name]));
			}
		};
		N.MODULE = function(name,proto,setter,getter){
			if(NativeFactoryObject("object",name)){
				if(typeof proto === "function") getter = setter, setter = proto, proto = {};
				NativeFactoryExtend(name,proto,setter,getter)
				NativeFactoryDeploy(name);
			}
		};
		N.MODULE_PROPERTY = function(name,propName,propValue){
			NModules[name][propName] = propValue;
			return NModules[name];
		};
		N.ARRAY_MODULE = function(name,proto,setter,getter){
			if(NativeFactoryObject("array",name)){
				NativeFactoryExtend(name,proto,setter,getter);
				NativeFactoryDeploy(name);
			}
		};
		N.EXTEND_MODULE = function(parentName,name,methods,setter,getter){
			if(typeof methods == "function") getter = setter, setter = methods, methods = {};
			var parentConstructor = NModules[parentName];
			if(typeof parentConstructor === "undefined") throw new Error("확장할 behavior ("+parentName+")가 없습니다"+N.toString(NModules));
		
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
		N.METHOD = function(n,m,bind){ 
			N[n]=m;
			NGetters.push(n); 
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
			"trace":function(m){ console.log((m?m+" ":"")+N.toString(this.Source)); }
		};
		N.STRUCTURE = function(n,m){
			if(typeof n !== "string" || typeof m !== "function") return console.warn("N.STRUCTURE::worng arguments!");
			NStructure[n]=function(){ this.Source={};m.apply(this,Array.prototype.slice.call(arguments)); };
			NStructure[n].prototype = {"constructor":m};
			for(var key in structruePrototype) NStructure[n].prototype[key] = structruePrototype[key];
			window[n] = NStructure[n];
		};
		N.INIT_STRUCTURE = function(n,o){ return (o instanceof W[n]) ? o : new W[n](o); };
		//Kit:Core
		N.SINGLETON = function(n,m,i){
			var o=i?i:function(){};
			for(var cname in m) {
				if(typeof cname === "string" && cname.indexOf("Structure#")===0){
					var dataName = cname.substr(10);
					if( dataName.length > 0) N.STRUCTURE(dataName,m[cname]);
					delete m[cname];
				}
			}
			o.prototype=m;
			o.prototype.constructor=o;
			o.prototype.EACH_TO_METHOD_WITH_PREFIX=function(){
				for(var k in o.prototype){
					switch(k){
						case "EACH_TO_METHOD":case "EACH_TO_METHOD_WITH_PREFIX":case "constructor":break;
						default: N.METHOD(n+k,o.prototype[k]); break;
					}
				}
			};
			o.prototype.EACH_TO_METHOD=function(){
				for(var k in o.prototype){
					switch(k){
						case "EACH_TO_METHOD":case "EACH_TO_METHOD_WITH_PREFIX":case "constructor":break;
						default: N.METHOD(k,o.prototype[k]); break;
					}
				}
			};
			N[n]=new o();
			NSingletons[n]=N[n];
		};
		//contiue function
		// var a = N.CONTINUE_FUNCTION(function(a){ return a; });
		// var b = function(a,b){ return a+b; };
		// a(1,b,2); => 3
		N.CONTINUE_FUNCTION = function(func,over,owner){
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
		};
		//marge function
		N.BIND_FUNCTION = function(m1,m2,requireReturn){
			if(typeof m1 !== 'function') return m2;
			if(typeof m2 !== 'function') return m1;
			var m1f = m1._nodyBindFunction ? m1._nodyBindFunction : [m1];
			var m2f = m2._nodyBindFunction ? m2._nodyBindFunction : [m2];
			var bfs = m1f.concat(m2f);
			var bf = requireReturn === false ?
			function(){ 
				N.dataEach(bf._nodyBindFunction,function(f){ return f();}); 
			}:
			function(){
				return N.dataMap(bf._nodyBindFunction,function(f){ return f();}); 
			};
			bf._nodyBindFunction = bfs;
			m1f = m2f = bfs = null;
			return bf;
		};
		//trycatch high perfomance
		N.TRY_CATCH = function(t,c,s){try{return t.call(s);}catch(e){if(typeof c === 'function') return c.call(s,e);}};
		N.url = {
			info : function(url){
				if(typeof url === "object") return ( url["ConstructorMark"] === ("ClientURLInfo" + W.nody)) ? url : null;
				var info;
				N.TRY_CATCH(
					function(){
						info = /([\w]+)(\:[\/]+)([^/]*\@|)([\w\d\.\-\_\+]+)(\:[\d]+|)(\/|)([\w\d\.\/\-\_]+|)(\?[\d\w\=\&\%]+|)(\#[\d\w]*|)/.exec(url?url:window.document.URL.toString());
					},
					function(){
						info = null;
					}
				)
				if(info === null) {
					console.error("N.url.info::faild get url info",e);
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
				h = N.url.info(url);
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
				if(!/^[\w]+\:\//.test(scriptString)) scriptString = N.url.root() + scriptString;
				return scriptString;
			},
			scriptRoot:function(){ return N.url.script().replace(/([^\/]+$)/,""); },
		};
		N.include =function(aFilename){
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
		N.cache = {
			has:function(sender,name){
				if( !(sender in nody_cache) ) return false;
				if( !(name in nody_cache[sender]) ) return false;
				return true;
			},
			set:function(s,n,v){ if( !(s in nody_cache) ) nody_cache[s] = {}; nody_cache[s][n] = v; },
			get:function(s,n)  { if( N.cache.has(s,n) ) return nody_cache[s][n]; },
			clear:function()     { nody_cache = {"N.selectorInfo":{"":{}},"AreaContent":{}}; },
			trace:function()     { return JSON.stringify(nody_cache); }
		}
		N.cache.clear();
	
		var nody_typemap = { "string" : "isString", "number" : "isNumber", "likenumber": "likeNumber", "likestring" : "likeString", "array" : "isArray", "object" : "isObject", "email" : "isEmail", "ascii" : "isAscii", "true" : "isTrue", "false" : "isFalse", "nothing" : "isNothing", "ok" : "isOk" };
	
		N.SINGLETON("TYPE",{
			// // 데이터 타입 검사
			"isUndefined": function (t) {return typeof t === "undefined" ? true : false ;},
			"isDefined"  : function (t) {return typeof t !== "undefined" ? true : false ;},
			"isNull"     : function (t) {return t === null ? true : false;},
			"isNil"      : function (t) {return ((t === null) || (typeof t === "undefined")) ? true : false;},
			"isFunction" : function (t) {return typeof t === "function" ? true : false;},
			"isBoolean"  : function (t) {return typeof t === "boolean"  ? true : false;},
			"isObject"   : function (t) {return typeof t === "object"   ? true : false;},
			"isString"   : function (t) {return typeof t === "string"   ? true : false;},
			"isNumber"   : function (t) {return typeof t === "number"   ? true : false;},
			"likeNumber" : function (t) {return (typeof t === "number") ? true : ((typeof t === "string") ? (parseFloat(t)+"") == (t+"") : false );},
		
			"isJquery"   : function(o){ return (typeof o === "object" && o !== null ) ? ("jquery" in o) ? true : false : false; },
			"isArray"    : function(a){ return (typeof a === "object" && a !== null ) ? (((a instanceof Array || a instanceof NodeList || N.isJquery(a) || ( !isNaN(a.length) && isNaN(a.nodeType))) && !(a instanceof Window) ) ? true : false) : false; },
			"isArguments": function(a){ return (typeof a === "object" && a !== null) ? ("callee" in a) ? true : false : false; },
			"isEmail"    : function(t){ return N.likeString(t) ? /^[\w]+\@[\w]+\.[\.\w]+/.test(t) : false;},
			"isAscii"    : function(t){ return N.likeString(t) ? /^[\x00-\x7F]*$/.test(t)         : false;},
			"isTrue"     : function(t){ return !!t ? true : false;},
			"isFalse"    : function(t){ return  !t ? false : true;},
		
			//문자나 숫자이면 참
			"likeString" :function(v){ return (typeof v === "string" || typeof v === "number") ? true : false; },
		
			// // 엘리먼트 유형 검사
			"isWindow"  :function(a){ if(typeof a === "object") return "navigator" in a; return false; },
			"isDocument":function(a){ return typeof a === "object" ? a.nodeType == 9 ? true : false : false; },
			"isNode"  :function(a){ if(a == null) return false; if(typeof a === "object") if(a.nodeType == 1) return true; return false;},
			"hasNode" :function(a){ if( N.isArray(a) ){ for(var i=0,l=a.length;i<l;i++) if(N.isNode(a[i])) return true; return false; } else { return N.isNode(a); } },
			"isTextNode":function(a){ if(a == null) return false; if(typeof a === "object") if(a.nodeType == 3 || a.nodeType == 8) return true; return false;},
			// // 값 유형 검사
			// 0, "  ", {}, [] 등등 value가 없는 값을 검사합니다.
			"isNothing":function(o){ 
		        if (typeof o === "undefined")return true;
				if (typeof o === "string")return o.trim().length < 1 ? true : false;
				if (typeof o === "object"){
					if(o instanceof RegExp) return false;
					if(N.isNode(o)) return false;
					if(o == null ) return true;
					if(N.isArray(o)) {
						o = o.length;
					} else {
			            var count = 0; for (var prop in o) { count = 1; break; } o = count;
					}
				}
		        if (typeof o === "number")return o < 1 ? true : false;
		        if (typeof o === "function")return false;
				if (typeof o === "boolean")return !this.Source;
				console.warn("N.isNothing::이 타입에 대해 알아내지 못했습니다. nothing으로 간주합니다.",o);
		        return true;
			},
			"isOk":function(o){ return !N.isNothing(o); },
			// 무엇이든 길이 유형 검사
			"toLength":function(v,d){
				switch(typeof v){ 
					case "number":return (v+"").length;break;
					case "string":return v.length;
					case "object":if("length" in v)
					return v.length;
				}
				return (typeof d=="undefined")?0:d;
			},
			// 무엇이든 크기 유형 검사 (is에서 사용되기 위한 문법)
			"toSize":function(target,type){
				if((typeof type != "undefined") && (typeof type != "string")) console.error("N.toSize::type은 반드시 string으로 보내주세요",type);
				switch(type){
					case "likenumber": return parseFloat(target); break;
					case "number"  : return parseFloat(target); break;
					case "likestring": case "text" : case "email" : case "ascii" : return (target + "").length; break;
					case "string"  : case "array" : return target.length;
					case "object"  : default : return N.toLength(target); break;
				}
			},
			"is":function(target,test,trueBlock,falseBlock){
			
				if(N.isNothing(test)) return N.isTrue(target);
			
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
								testResult = N.TYPE[typeMapName](target);
								if(param[1] == "!") testResult = !testResult;
								if(!testResult) break;
								//길이 확인
								if(param[3] != "" && param[4] != ""){
									if( N.likeNumber(param[4]) ) {
										switch(param[3]){
											case ">": testResult = N.toSize(target,param[2]) > parseFloat(param[4]); break;
											case "<": testResult = N.toSize(target,param[2]) < parseFloat(param[4]); break;
											case "<=": case "=<": case "<==": case "==<": testResult = N.toSize(target,param[2]) <= parseFloat(param[4]); break;
											case ">=": case "=>": case ">==": case "==>": testResult = N.toSize(target,param[2]) >= parseFloat(param[4]); break;
											case "==" : case "===": testResult = N.toSize(target,param[2]) == parseFloat(param[4]); break;
											case "!=" : case "!==": testResult = N.toSize(target,param[2]) != parseFloat(param[4]); break;
										}
									} else if(param[3] === ":" && /\d+\~\d+/.test(param[4])) {
										var rangeNumbers = /(\d+)\~(\d+)/.exec(param[4]);
										if(rangeNumbers[1] == rangeNumbers[2]){
											testResult = ( N.toSize(target,param[2]) == parseFloat(param[4]) );
										} else {
											var lv=(rangeNumbers[1]*1),rv=(rangeNumbers[2]*1),cv=N.toSize(target,param[2]);
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
								console.warn("Nody::IS::인식할수 없는 타입의 키워드 입니다. => ",param[2]+"("+typeof param[2]+")");
							}	
						}
						break;
					case "object":
						if((test instanceof RegExp) && N.likeString(target)){
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
			"like":function(target,test,tb,fb){
				if(N.isString(target)) target = target.trim();
				return N.is(target,test,tb,fb);
			}
		});
		N.TYPE.EACH_TO_METHOD();
	
		//퍼포먼스를 위해 바깥쪽에 꺼내놓았음
		var CLONE_ARRAY_PROC = function(v) { 
			if( N.isArray(v) ) { 
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
		var TO_ARRAY_PROC = function(t,s){
			if(typeof t === "object") if(N.isArray(t)) {
				if( (t instanceof NodeList) ||  (t instanceof HTMLCollection) ) return N.cloneArray(t);
				return t;
			} 
			if(typeof t === "undefined" && arguments.length < 2) return [];
			if(typeof t === "string" && typeof s === "string") return t.split(s);
			return [t];
		};
		var DATA_ANY_PROC = function(inData,filterMethod){
			var tr = false,fm=(typeof filterMethod === 'function') ? filterMethod : function(v){ return v === filterMethod; };
			filterMethod = filterMethod || function(a){ return typeof a === "undefined" ? false : true; };
			N.dataFilter(inData,function(v,i){
				var r = fm(v,i)
				if(r === true) { tr = true; return false; }
			});
			return tr;
		};
		var DATA_ALL_PROC = function(inData,filterMethod){
			var tr = true,fm=(typeof filterMethod === 'function') ? filterMethod : function(v){ return v === filterMethod; };
			filterMethod = filterMethod || function(a){ return typeof a === "undefined" ? false : true; };
			N.dataFilter(inData,function(v,i){
				var r = fm(v,i);
				if(r === false) return tr = false;
			});
			return tr;
		};
		
		// Nody Super base
		N.SINGLETON("DATAKIT",{
			"dataCall":N.CONTINUE_FUNCTION(function(d,alt){ return (typeof d === 'undefined') ? N.cloneArray(alt) : ((alt === true) ? N.cloneArray(d) : N.toArray(d)); },1),
			"dataHas" :function(d,v){ d=N.toArray(d); for(var i=0,l=d.length;i<l;i++) if(d[i] === v) return true; return false; },
			"dataMatching" :function(da,ca){ 
				da = N.toArray(da),ca = N.toArray(ca);
				for(var di=0,dl=da.length;di<dl;di++)
					for(var ci=0,cl=ca.length;ci<cl;ci++)
						if(da[di] == ca[ci]) 
							return da[di];
				return false;
			},
			//배열의 하나추출
			"dataFirst":N.CONTINUE_FUNCTION(function(t){return typeof t === "object" ? typeof t[0] === "undefined" ? undefined : t[0] : t;},1),
			//배열의 뒤
			"dataLast":N.CONTINUE_FUNCTION(function(t){ return N.isArray(t) ? t[t.length-1] : t; },1),
			// 각각의 값의 function실행
			"dataEach":N.CONTINUE_FUNCTION(function(v,f){ 
				var ev=N.toArray(v); 
				for(var i=0,l=ev.length;i<l;i++) 
					if(f.call(ev[i],ev[i],i) === false) return false;
				return ev; 
			},2),
			// 각각의 값의 function실행
			"dataReverseEach":N.CONTINUE_FUNCTION(function(v,f){ 
				var ev=N.toArray(v); 
				for(var i=ev.length-1;i>-1;i--) 
					if(f.call(ev[i],ev[i],i) === false) return false; 
				return ev; 
			},2),
			// 각각의 값을 배열로 다시 구해오기
			"dataMap":N.CONTINUE_FUNCTION(function(v,f){ 
				var rv=[],ev=N.toArray(v); 
				for(var i=0,l=ev.length;i<l;i++) rv.push(f.call(ev[i],ev[i],i)); return rv; 
			},2),
			"arrayMap":N.CONTINUE_FUNCTION(function(v,f){ 
				if( N.isArray(v) ) for(var i=0,l=v.length;i<l;i++) v[i] = f.call(v[i],v[i],i);
				return v; 
			},2),
			"defineMap":N.CONTINUE_FUNCTION(function(v,f,infinity){ 
				var v=v,rv=(typeof v === "undefined") ? [] : [v],ev=N.toArray(v),infinity = (typeof infinity === "number") ? infinity : 100000;
				for(var i=0;i<infinity;i++){
					v = f.call(v,v,i);
					if(typeof v === "undefined") break;
					else rv.push(v);
				} 
				return rv;
			},2),
			"ownerMap":function(owner,args){
				return N.dataMap(args,function(arg){
					return (typeof arg === "function") ? function(){ return arg.apply(owner,Array.prototype.slice.call(arguments)); } : arg;
				});
			},
			"dataReverseMap":N.CONTINUE_FUNCTION(function(v,f){
				var rv=[],ev=N.toArray(v); 
				for(var i=ev.length-1;i>-1;i--) rv.push(f.call(ev[i],ev[i],i)); return rv; 
			 },2),
			"arrayRemoveIndex":function(array,indexes){
				if(N.isArray(array)){
					var removeCount = 0;
					N.dataEach(N.dataUnique(indexes).sort(),function(index){
						if(typeof index === "number") array.splice(index+(removeCount++),1);
					});
				}
			},
			"arrayRemove":function(array,target){
				if(N.isArray(array)){
					var selectIndex = -1;
					var removeIndexes = [];
					for(var i=0,l=array.length;i<l;i++) if(array[i] === target) removeIndexes.push(i);
					if(removeIndexes.length) N.arrayRemoveIndex(array,removeIndexes);
				}
			},
			"inject":function(v,f,d){ d=(typeof d=="object"?d:{});v=N.toArray(v); for(var i=0,l=v.length;i<l;i++)f(d,v[i],i);return d;},
			// false를 호출하면 배열에서 제거합니다.
			"dataFilter":N.CONTINUE_FUNCTION(function(inData,filterMethod){
				var data = N.toArray(inData);
				filterMethod = filterMethod || function(a){ return typeof a === "undefined" ? false : true; };
				if(typeof filterMethod === "function"){
					var result=[];
					N.dataEach(data,function(v,i){ if(filterMethod(v,i)==true) result.push(v); });
					return result;
				}
				return [];
			},2),
			"arrayInsert":function(data,v,a){
				if(N.isArray(data))
					Array.prototype.splice.call(data,typeof a === "number"?a:0,0,v);
				return data;
			},
			"dataInsert":function(data,v,a){
				return N.arrayInsert(Array.prototype.slice.call(N.toArray(data)),v,a);
			},
			"arrayShift":function(data,len,rep){
				Array.prototype.splice.apply(data,[0,typeof len==="number"?len:1].concat(Array.prototype.slice.call(arguments,2)));
				return data;
			},
			"dataShift":function(data,len,rep){
				return N.arrayShift(Array.prototype.slice.call(N.toArray(data)),len,rep);
			},
			"arrayUnshift":function(data,index,rep){
				//todo:behind와 통합
				index = typeof index !== "number" ? data.length - 1 : index;
				Array.prototype.splice.apply(data,[index,data.length-index].concat(Array.prototype.slice.call(arguments,2)));
				return data;
			},
			"dataUnshift":function(data,index,rep){
				return N.arrayReplace(Array.prototype.slice.call(N.toArray(data)),index,rep);
			},
			"dataAny":DATA_ANY_PROC,
			"dataAll":DATA_ANY_PROC,
			"arrayAny":function(arr,filter){
				if(!N.isArray(arr)) 
					return undefined;
				return DATA_ANY_PROC(arr,filter);
			},
			"dataAny":function(){
				if(!N.isArray(arr,filter)) 
					return undefined;
				return DATA_ANY_PROC(arr,filter)
			},
			//중복되는 값 제거
			"dataUnique" :function(){
				var value  = [],result = [];
				for(var ai=0,li=arguments.length;ai<li;ai++){
					var mvArray = N.cloneArray(arguments[ai]);
					for(var i=0,l=mvArray.length;i<l;i++){
						var unique = true;
						for(var i2=0,l2=result.length;i2<l2;i2++){
							if(mvArray[i] == result[i2]){
								unique = false;
								break;
							}
						}
						if(unique==true) result.push(mvArray[i]);
					}
				}
				return result;
			},
			"dataEqual":function(data1,data2){
				var firstType  = typeof data1;
				if(firstType === typeof data2) {
					if(firstType === "object") {
						var firstArray = N.isArray(data1);
						if(firstArray === N.isArray(data2)){
							if(firstArray){
								//둘다 array일 경우
								if(data1.length === data2.length) {
									var equal = true;
									for(var i=0,l=data1.length;i<l;i++){
										if(data1[i] !== data2[i]){
											equal = false;
											break;
										}
									}
									return equal;
								} else {
									return false;
								}
							} else {
								var allkeys = N.dataFlatten(N.propKey(data1),N.propKey(data2),N.dataUnique);
								var equal = true;
								for(var i=0,l=allkeys.length;i<l;i++){
									if(data1[allkeys[i]] !== data2[allkeys[i]]){
										equal = false;
										break;
									}
								}
								return equal;
							}
						} else {
							return false;
						}
					} else {
						return (data1 === data2);
					}
				}
				return false;
			},
			"dataEqualUnique":function(){
				var value=[],result=[];
				for(var ai=0,li=arguments.length;ai<li;ai++){
					var mvArray = N.cloneArray(arguments[ai]);
					for(var i=0,l=mvArray.length;i<l;i++){
						var unique = true;
						for(var i2=0,l2=result.length;i2<l2;i2++){
							//console.log("mvArray[i],result[i2]",mvArray[i],result[i2],N.dataEqual(mvArray[i],result[i2]));
							if(N.dataEqual(mvArray[i],result[i2])){
								unique = false;
								break;
							}
						}
						if(unique==true) result.push(mvArray[i]);
					}
				}
				return result;
			},
			//길이만큼 무작위로 뽑아낸다
			"dataRandom":function(v,length){
				v = N.cloneArray(v);
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
			"dataShuffle":function(v){
				v = N.cloneArray(v);
				//+ Jonas Raoni Soares Silva
				//@ http://jsfromhell.com/array/shuffle [rev. #1]
			    for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
			    return v;
			},
			"dataIndex":function(data,compare){ var v = N.toArray(data); for(var i in v) if(compare == v[i]) return N.toNumber(i); },
			"arrayIndex":function(array,compare){ if(N.isArray(array))for(var i=0,l=array.length;i<l;i++)if(array[i] === compare)return i; return -1;},
			// 배열안의 배열을 풀어냅니다.
			"dataFlatten":N.CONTINUE_FUNCTION(function(){ return N.argumentsFlatten(arguments); },1),
			//값을 플래튼하여 실행함
			"argumentsFlatten":function(){ var result = []; function arrayFlatten(args){ N.dataEach(args,function(arg){ if(N.isArray(arg)) return N.dataEach(arg,arrayFlatten); result.push(arg); }); } arrayFlatten(arguments); return result; },
			//owner를 쉽게 바꾸면서 함수실행을 위해 있음
			"APPLY" : function(f,owner,args) { if( typeof f === "function" ) { args = N.cloneArray(args); return (args.length > 0) ? f.apply(owner,args) : f.call(owner); } },
			"FLATTENCALL" : function(f,owner) { return N.APPLY(f,owner,N.argumentsFlatten(Array.prototype.slice.call(arguments,2))); },
			"CALL"    :function(f,owner){ return (typeof f === "function") ? ((arguments.length > 2) ? f.apply(owner,Array.prototype.slice.call(arguments,2)) : f.call(owner)) : undefined; },
			"CALLBACK":function(f,owner){ return (typeof f === "function") ? ((arguments.length > 2) ? f.apply(owner,Array.prototype.slice.call(arguments,2)) : f.call(owner)) : f; },
			//배열이 아니면 배열로 만들어줌
			"toArray":TO_ARRAY_PROC,
			//배열이든 아니든 무조건 배열로 만듬
			"cloneArray":CLONE_ARRAY_PROC,
			//배열안에 배열을 길이만큼 추가
			"arrays":function(l) { l=N.toNumber(l);var aa=[];for(var i=0;i<l;i++){ aa.push([]); }return aa; },
			//숫자로 변환합니다. 디폴트 값이나 0으로 반환합니다.
			"toNumber":function(v,d){
				switch(typeof v){ case "number":return v;case "string":var r=v.replace(/[^.\d\-]/g,"")*1;return isNaN(r)?0:r;break; }
				switch(typeof d){ case "number":return d;case "string":var r=d*1;return isNaN(r)?0:r;break; }
				return 0;
			},
			"toObject":function(param,es,kv){
				if(typeof param==="object"){
					return param ? param : {}; //null filter
				} 
				if(kv == true && ( typeof param === "string" || typeof es === "string")){ var r = {}; r[es] = param; return r; }
				if(typeof param==="string" || typeof param==="boolean") {
					var c = N.TRY_CATCH(function(){
						if(JSON == aJSON) throw new Error("not json supported browser");
						var jp = JSON.parse(param);
						if(typeof jp !== "object") throw new Error("pass");
					},function(e){
						if( (new N.StringSource(param)).isDataContent()=="plain" ){
							var esv = (typeof es === "string" ? es : "value");
							var reo={};reo[esv]=param;
							return reo;
						}
						return (new N.StringSource(param)).getContentObject();
					});
				}
				return c || {};
			},
			//1:길이와 같이 2: 함수호출
			"times":N.CONTINUE_FUNCTION(function(l,f,s){ l=N.toNumber(l); for(var i=(typeof s === 'number')?s:0;i<l;i++){ var r = f(i); if(r==false) break; } return l; },2),
			"timesMap":N.CONTINUE_FUNCTION(function(l,f,s){ 
				l=N.toNumber(l); var r = []; 
				if(typeof f === 'string') var fs = f, f = function(i){ return N.exp.seed(i)(fs); };
				for(var i=(typeof s === 'number')?s:0;i<l;i++) r.push(f(i)); 
				return r; 
			},2),
			//확률적으로 나옵니다. 0~1 true 가 나올 확률
			"flagRandom":function(probabilityOfTrue){
				if(typeof probabilityOfTrue !== 'number') probabilityOfTrue = 0.5;
				return !!probabilityOfTrue && Math.random() <= probabilityOfTrue;
			},
			//i 값이 제귀합니다.
			"indexForReverse":function(index,maxIndex){ return (maxIndex-1) - index },
			"indexForTurn":function(index,maxIndex){ if(index < 0) { var abs = Math.abs(index); index = maxIndex-(abs>maxIndex?abs%maxIndex:abs); }; return (maxIndex > index)?index:index%maxIndex; },
			"indexForSpring":function(index,maxIndex){ index = N.toNumber(index); maxIndex = N.toNumber(maxIndex); return (index == 0 || (Math.floor(index/maxIndex)%2 == 0))?index%maxIndex:maxIndex-(index%maxIndex); },
			"isProp":function(source){
				return (typeof source === "object") || (typeof source === "function");
			},
			//오브젝트의 key를 each열거함
			"propEach":N.CONTINUE_FUNCTION(function(v,f){
				if(N.isProp(v)){for(k in v) if(f(v[k],k)===false) break;}; 
				return v;
			},2),
			//
			"propChange":N.CONTINUE_FUNCTION(function(source,original,change){
				if(N.isProp(source) && typeof original === "string" && typeof change === "string") { 
					source[change] = source[original]; delete source[original]; 
				}
				return source;
			}),
			"propSet":N.CONTINUE_FUNCTION(function(source,key){
				if(N.isProp(source) && (typeof key === "string" || typeof key === "number")) {
					for(var i=2,l=arguments.length;i<l;i++){
						if(arguments[i] !== undefined || arguments[i] !== NaN){
							source[key] = arguments[i];
							break;
						}
					}
				}
				return source;
			}),
			"propShift":N.CONTINUE_FUNCTION(function(source,key){
				var result;
				if(N.isProp(source) && (typeof key === "string" || typeof key === "number") && (key in source)) {
					result = source[key];
					delete source[key];
				}
				return result;
			}),
			"propMap":N.CONTINUE_FUNCTION(function(v,f){ 
				var result = {}; 
				if(N.isProp(v)) for(var k in v) result[k] = f(v[k],k); return result; 
				return result;
			},2),
			//오브젝트의 key value값을 Array 맵으로 구한다.
			"propData" :N.CONTINUE_FUNCTION(function(v,f){ var result = []; if(typeof f !== "function") f = function(v){ return v; }; if(typeof v === "object"){ for(var k in v) result.push(f(v[k],k)); return result; } return result;},2),
			"propKey"  :N.CONTINUE_FUNCTION(function(obj,rule,expandKeys){
				var r = [];
				if(typeof rule === "string"){
					if((rule in obj) || expandKeys === true) r.push(rule);
				} else if(N.isArray(rule)) {
					if(expandKeys === true){
						for(var i=0,l=rule.length;i<l;i++) (typeof rule[i] === "string") && r.push(rule[i]);
					} else {
						for(var i=0,l=rule.length;i<l;i++) (rule[i] in obj) && r.push(rule[i]);
					}
				} else if(rule instanceof RegExp) {
					var r = [];
					N.propEach(obj,function(v,k){ if(rule.test(k)){ r.push(k) }});
				} else {
					var r = [];
					N.propEach(obj,function(v,k){ r.push(k); });
				}
				return r;
			},1),
			"divideNumber":function(value,padRigth){
				var numberInfo = [0,0];
	            var parseString = "";
	            (value+"").replace(/\d|\./g,function(s){ parseString += s; });
	            if(/\d/.test(parseString)){
	                var dotIndex = parseString.indexOf(".");
	                switch(dotIndex) {
	                    case -1:
	                        numberInfo[0] = parseString*1;
	                        break;
	                    case 0:
	                        parseString = "0" + parseString;
	                    default:
	                        var intValue = /[\d]+\./.exec(parseString)[0];
	                        numberInfo[0] = intValue.substr(0,intValue.length - 1) * 1;
            
	                        numberInfo[1] = /\.[\d]+/.exec(parseString);
	                        numberInfo[1] = numberInfo[1] === null ? 0 : numberInfo[1][0].substr(1);
            
	                        break;
	                }
	            }
	            return numberInfo;
			},
			"decimalValue":function(text){
	            var numberValue = N.divideNumber(text)[0]+"";
	            if(numberValue.length < 4) return numberValue;
	            var total = "",count = 0;
	            (numberValue.split('').reverse().join('')).replace(/./g,function(s){ total = ((count%3) === 2 ) ? ("," + s + total) : (s + total), count++; });
	            return total.replace(/^\,/,"");
	        },
			"parseFloat":function(value,padRight){
				var numberInfo = N.divideNumber(value);
	            var floatValue = 
	                (typeof padRight == "number") ?
	                (("." + numberInfo[1]).substr(0,padRight+1)) :
	                ("." + numberInfo[1]);
	            return (numberInfo[0] + floatValue)*1;
			},
			"padLeft":function(value,padLength,useFloat){
				if(typeof padLength !== "number") return value;
				var padLeft="", numberInfo = N.divideNumber(value);
				var requirePad = padLength-(numberInfo[0]+"").length;
				for(var i=0,l=requirePad>0?requirePad:0;i<l;i++){ padLeft += "0"; }
				return padLeft + (useFloat === false || !numberInfo[1] ? numberInfo[0] : numberInfo[0] + "." + numberInfo[1] )
			},
			"padRight":function(value,padRight){
	            if(typeof padRight == "number") {
	                var dInfo = N.divideNumber(value);
	                var iVal  = dInfo[0];
        
	                if(Math.floor(padRight) === 0) return dInfo[0] + "";
        
	                var fStr = (dInfo[1]+"").substr(0,padRight);
        
	                for(var i=0,l=padRight - fStr.length;i<l;fStr += "0",i++);
	                return iVal+"."+fStr;                
	            } else {
	                return N.parseFloat(value)+"";
	            }
	        },
	        "parseInt":function(value){
	            return N.divideNumber(value)[0];
	        },
	        "parseHigh":function(value){
				var high = Number.NEGATIVE_INFINITY;
				var numberList = N.argumentsFlatten(arguments);
				for(var i=0,l=numberList.length;i<l;i++){
					var parseNumber = N.parseFloat(numberList[i]);
					if(high < parseNumber) high = parseNumber;
				}
				return high === Number.NEGATIVE_INFINITY ? 0 : high;
	        },
	        "parseLow":function(value){
				var low = Number.POSITIVE_INFINITY;
				var numberList = N.argumentsFlatten(arguments);
				for(var i=0,l=numberList.length;i<l;i++){
					var parseNumber = N.parseFloat(numberList[i]);
					if(low > parseNumber) low = parseNumber;
				}
				return low === Number.POSITIVE_INFINITY ? 0 : low;
	        },
			//
			"propLength":function(data){ var l = 0; if(typeof data === "object" || typeof data === "function") for(var key in data) l++; return l; },
			//새로운 객체를 만들어 복사
			"clone"  : function(target,d) { 
				if(d) {
					if(N.isArray(target)) {
						if(!N.isArray(d)) { d = [] };
						for (var i=0,l=target.length;i<l;i++) d.push( ((typeof target[i] === "object" && target[i] !== null ) ? N.clone(target[i]) : target[i]) )
						return d;
					} else {
						if(d == true) { d = {} };
				        for (var p in target) (typeof target[p] === "object" && target[p] !== null && d[p]) ? N.clone(target[p],d[p]) : d[p] = target[p];
						return d;
					}
				
				}
				switch(typeof target){
					case "undefined": case "function": case "boolean": case "number": case "string": return target; break;
					case "object":
						if(target === null) return target;
						if(target instanceof Date){
							var r=new Date();r.setTime(target.getTime());return r;
						}
						if(N.isArray(target)){
							var r=[]; for(var i=0,length=target.length;i<length;i++)r.push(target[i]); return r;
						} 
						if(N.isNode(target) == true){
							return target;
						}
						var r={};
						for(var k in target){
							if(target.hasOwnProperty(k))r[k]=target[k];
						}
						return r;
					break;
					default : console.error("N.clone::copy failed : target => ",target); return target; break;
				}
			},
			"diffKeys":function(a,b){
				if(typeof a === "object" && typeof b === "object"){
					return N.dataFilter(N.dataFlatten(N.propKey(a),N.propKey(b),N.dataUnique),function(key){
						if(a[key] !== b[key]){ return true; }
					});
				}
				return null;
			},
			//첫번째 소스에 두번째 부터 시작하는 소스를 반영
			"extend":function(data){
				if(typeof data !== "object") return data;
				for(var i=1,l=arguments.length;i<l;i++) 
					if( typeof arguments[i] == "object" ) 
						for(var key in arguments[i]) data[key] = arguments[i][key];
				return data;
			},
			//완전히 새로운 포인터 오브젝트에 다른 소스를 반영
			"marge":function(data){
				if(typeof data !== "object") {
					if(data === undefined) data = {};
					else data = {data:data};
				} 
				return N.extend.apply(undefined,[N.clone(data,true)].concat(Array.prototype.slice.call(arguments,1)));
			},
			//fill은 존재하지 않는 키값에 대해서만 적용함 첫번째 소스에 두번째 부터 시작하는 소스를 반영
			"extendFill":function(data,fillData,forceFill){
				if(typeof data !== "object") {
					if(data === undefined) data = {};
					else data = {data:data};
				}
				if(forceFill !== true) forceFill = N.toArray(forceFill);
				if (forceFill.length || forceFill === true) {
					for(var key in fillData)  {
						if( !(key in data) ) data[key] = fillData[key];
						else if(forceFill === true || N.dataHas(forceFill,key) ) data[key] = fillData[key];
					} 
				} else {
					for(var key in fillData)  if( !(key in data) ) data[key] = fillData[key];
				}
				return data;
			},
			//완전히 새로운 포인터 오브젝트에 다른 소스를 반영
			"margeFill":function(data,fillData,forceFill){
				return N.extendFill(N.clone(data,true),fillData,forceFill);
			},
			//무엇이든 문자열로 넘김
			"toString":function(tosv,depth,jsonfy){
				switch(typeof tosv){
					case "string" : return jsonfy==true ? '"' + (tosv+"") + '"' :tosv+""; break;
					case "number" : return (tosv+""); break;
					case "object" : 
						if(typeof depth === "undefined") depth = 10;
						if(depth < 1) return "...";
						if(tosv==null){
							return jsonfy==true ? '"null"' : "null";
						} else if(N.isNode(tosv)) {
							if(tosv == document) { return '"[document]"'; }
							//node3
							var tn = tosv.tagName.toLowerCase();
							var ti = N.isNothing(tosv.id) ? "" : "#"+tosv.id;
							var tc = N.isNothing(tosv.className) ? "" : "." + tosv.className.split(" ").join(".");
							return jsonfy==true ? '"'+tn+ti+tc+'"' : tn+ti+tc; 
						} else if(N.isTextNode(tosv)) {
							return '#text '+tosv.textContent;
						} else if(N.isArray(tosv)){
							//array
							var result = [];
							for(var i=0,l=tosv.length;i<l;i++) result.push(N.toString(tosv[i],depth-1,jsonfy));
							return "["+(jsonfy==true?result.join(","):result.join(", "))+"]";
						} else if(tosv.jquery){
							//jquery
							var result = N.dataMap(tosv,function(o){ N.toString(o); }).join(", ");
							return jsonfy==true ? '"$['+result+']"' : "$["+result+"]";
						} else {
							//object
							var kv = [];
							for(var key in tosv) kv.push( (jsonfy==true ?  ('"' + key + '"') : key) + ":" + N.toString(tosv[key],depth-1,jsonfy)); 
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
			"tos"  : function(tosv,jsonfy){ return N.toString(tosv,9,jsonfy); },
			//어떠한 객체의 길이를 조절함
			"max"  : function(target,length,suffix){
				if(typeof target === "string"){
					length = isNaN(length) ? 100 : parseInt(length);
					suffix = typeof suffix === "string" ? suffix : "...";
					if( target.length > length ){
						return target.substr(0,length) + suffix;
					}
				} else if (N.isArray(target)) {
					if (target.length > length) target.length = length;
				}
				return target;
			},
			"byteSize":function(t){
				return unescape(escape(t).replace(/%u..../g,function(s){ return "  "; })).length;
			},
			"isModule":IS_MODULE,
			// 참고! : human readable month
			"dateExp":function(dv,format,pad){
				if(N.isArray(dv)) dv = dv.join(' ');
			
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
					.replace(/(A)/,(N.toNumber(r.hour) > 12) ? 'PM' : 'AM');
				}
				if(typeof format === 'string') 
					return r.format(format);
					return r;
			},
			"timestampExp":function(exp){
				if( arguments.length === 0){
					return (+new Date());
				}
				if( typeof exp === "string") {
					exp = N.dateExp(exp);
				}
				if( typeof exp === "number") {
					return exp;
				}
				if( N.isArray(exp) && (exp.length == 7) ){
					exp = new Date(exp[0], exp[1], exp[2], exp[3], exp[4], exp[5]);
				}
				if( exp instanceof Date){
					return (+exp);
				}
				return 0;
			},
			"timescaleExp":function(exp){
				var scale = 0;
				if(typeof exp === "number") {
					return exp;
				}
				if(typeof exp === "string") {
					// 
					exp = exp.replace(/\d+(Y|year)/,function(t){
						t.replace(/\d+/,function(d){ scale += d*31536000000; });
						return "";
					})
					exp = exp.replace(/\d+(M|month)/,function(t){
						t.replace(/\d+/,function(d){ scale += d*2678400000; });
						return "";
					})
					exp = exp.replace(/\d+(D|day)/,function(t){
						t.replace(/\d+/,function(d){ scale += d*86400000; });
						return "";
					})
					exp = exp.replace(/\d+(h|hour)/,function(t){
						t.replace(/\d+/,function(d){ scale += d*3600000; });
						return "";
					})
					exp = exp.replace(/\d+(ms|millisecond)/,function(t){
						t.replace(/\d+/,function(d){ scale += d*1; });
						return "";
					})
					exp = exp.replace(/\d+(m|minute)/,function(t){
						t.replace(/\d+/,function(d){ scale += d*60000; });
						return "";
					})
					exp = exp.replace(/\d+(s|second)/,function(t){
						t.replace(/\d+/,function(d){ scale += d*1000; });
						return "";
					})
				}
				return scale;
			}
		});
		N.DATAKIT.EACH_TO_METHOD();
		
	})(window,[],{},{},{},N);
	
	
	// AMD : Requirejs
	(function(W){
		window.nd = window.nody = N;
		if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) { define(function(){ return N; }); }
	}(window));


	//ENV Config
	(function(N){
		
		N.ENV = (function(){
			var info = {};
			
			info.online = navigator ? navigator.onLine : false;
			
			//support LocalStorage
			info.supportLocalStorage = window ? ('localStorage' in window) ? true : false : false;
			info.localStorage = window.localStorage;
			
			//support SessionStorage
			info.supportSessionStorage = window ? ('sessionStorage' in window) ? true : false : false;
			info.sessionStorage = window.sessionStorage;
			
			//storage hack
			info.supportStorage = info.supportLocalStorage || info.supportSessionStorage;
			info.storage = info.localStorage || info.sessionStorage;
			
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
				if(typeof cssName !== "string"){
					return cssName+"";
				}
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
			info.supportNodeListSlice = (function(){try{Array.prototype.slice.call(NodeList);return true;}catch(e){return false;}}());
		
			//matches
			info.querySelectorAllName =
				('querySelectorAll'       in document) ? 'querySelectorAll' :
				('webkitQuerySelectorAll' in document) ? 'webkitQuerySelectorAll' :
				('msQuerySelectorAll'     in document) ? 'msQuerySelectorAll' :
				('mozQuerySelectorAll'    in document) ? 'mozQuerySelectorAll' :
				('oQuerySelectorAll'      in document) ? 'oQuerySelectorAll' : false;
			info.supportQuerySelectorAll = !!info.querySelectorAllName;
			info.supportStandardQuerySelectorAll = (info.querySelectorAllName === 'querySelectorAll');
			
			//matches
			info.matchesSelectorName = 
				('matches' in tester)               ? 'matches' :
				('webkitMatchesSelector' in tester) ? 'webkitMatchesSelector' :
				('msMatchesSelector'     in tester) ? 'msMatchesSelector' :
				('mozMatchesSelector'    in tester) ? 'mozMatchesSelector' :
				('oMatchesSelector'      in tester) ? 'oMatchesSelector' : false;
			
			info.supportMatches = !!info.matchesSelectorName;
			info.supportStandardMatches = (info.matchesSelectorName === 'matches');
			
			return info;
		}());
		
		var QUERY_SELECTOR_NAME = N.ENV.querySelectorAllName;
		N.QUERY_SELECTOR_ENGINE = N.ENV.supportQuerySelectorAll && N.ENV.supportNodeListSlice ? 
		function(node,selector){
			try {
				return Array.prototype.slice.call(
					(node||document)[QUERY_SELECTOR_NAME](
						selector.replace(/\[[\w\-\_]+\=[^\'\"][^\]]+\]/g, function(s){ 
							return s.replace(/\=.+\]$/,function(s){ 
								return '=\"' + s.substr(1,s.length-2) + '\"]'; 
							}) 
						})
					)
				);
			} catch(e) {
				console.error("Nody::QUERY_SELECTOR_ENGINE error",node,selector);
				if(N.DEBUGER === true)debugger;
			}
			
		}:
		function(node,selector){
			try {
				var nodeList = (node||document)[QUERY_SELECTOR_NAME](
					selector.replace(/\[[\w\-\_]+\=[^\'\"][^\]]+\]/g, function(s){ 
						return s.replace(/\=.+\]$/,function(s){ 
							return '=\"' + s.substr(1,s.length-2) + '\"]'; 
						}) 
					})
				);
			} catch(e) {
				console.error("Nody::QUERY_SELECTOR_ENGINE error",node,selector);
				if(N.DEBUGER === true)debugger;
			}
			var result = [];
			for(var i=0,l=nodeList.length;i<l;i++){
				nodeList[i] && result.push(nodeList[i]);
			} 
			return result;
		};
		//if natvie query selector in browser then alternative engine include
		if(!N.QUERY_SELECTOR_ENGINE){
			if(typeof Sizzle === "function"){
				console.info("nody is sizzle selector engine detected");
				N.QUERY_SELECTOR_ENGINE = function(node,selector){
					return Sizzle(selector,node);
				}
				N.QUERY_SELECTOR_ENGINE_ID = "sizzle";
			} else if(typeof jQuery === "function") {
				console.info("nody is jquery selector engine detected");
				N.QUERY_SELECTOR_ENGINE = function(node,selector){
					return jQuery(selector,node).toArray();
				}
				N.QUERY_SELECTOR_ENGINE_ID = "jquery";
			}
		} else {
			N.QUERY_SELECTOR_ENGINE_ID = "browser";
		}
		if(!N.QUERY_SELECTOR_ENGINE){
			N.QUERY_SELECTOR_ENGINE_ID = null;
			throw new Error("Nody::ENV::IMPORTANT!! - querySelectorEngine is not detected");
		}
		var MATCHES_SELECTOR_NAME = N.ENV.matchesSelectorName;
		N.MATCHES_SELECTOR_ENGINE = N.ENV.supportMatches && function(node,selector){ 
			//selectText fix
			return node[MATCHES_SELECTOR_NAME](
				selector.replace(/\[[\w\-\_]+\=[^\'\"][^\]]+\]/g, function(s){ 
					return s.replace(/\=.+\]$/,function(s){ 
						return '=\"' + s.substr(1,s.length-2) + '\"]'; 
					}) 
				})
			); 
		}; 
		//if natvie matches selector in browser then alternative engine include
		if(!N.MATCHES_SELECTOR_ENGINE){
			if(typeof Sizzle === "function"){
				N.MATCHES_SELECTOR_ENGINE = function(node,selector){
					return Sizzle.matchesSelector(node,selector);
				}
				N.MATCHES_SELECTOR_ENGINE_ID = "sizzle";
			} else if(typeof jQuery === "function") {
				N.MATCHES_SELECTOR_ENGINE = function(node,selector){
					return jQuery(node).is(selector);
				}
				N.MATCHES_SELECTOR_ENGINE_ID = "jquery";
			}
		} else {
			N.MATCHES_SELECTOR_ENGINE_ID = "browser";
		}
		if(!N.MATCHES_SELECTOR_ENGINE){
			N.MATCHES_SELECTOR_ENGINE_ID = null;
			throw new Error("Nody::ENV::IMPORTANT!! - matchesSelectorEngine is not detected");
		}
	})(N);

	//Nody Foundation
	(function(W,N){
		if(W.nodyLoadException==true){ throw new Error("Nody Process Foundation init cancled"); return;}
		
		//expireTime default 16h
		var STORE_DEFAULT_EXPIRE_TIME = 57600000;
		var STORE_DEFAULT_PERSISTENT_TIME = 2000000000;
		N.SINGLETON("STORE",{
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
					
					if(!expireTime) expireTime  = STORE_DEFAULT_EXPIRE_TIME;
					var now    = new Date();
					var expire = new Date();
					expire.setTime(now.getTime()+expireTime);
				    setCookie(name, cookieValue, expire); 
					return true;
				}
				return false;
			},
			removeCookie:function(name,path){ path = ";path=" + (typeof path === "undefined"? "/" : escape(path)); document.cookie=name+"="+path+";expires=Thu, 01 Jan 1970 00:00:01 GMT"; },
			setLocalData:(function(){
				if(N.ENV.supportLocalStorage)
					return function(k,v){
						N.ENV.localStorage.setItem(k,N.toDataString(v));
						return true;
					}
				return function(k,v){ return this.setCookie(k,N.toDataString(v)); };
			}()),
			localData:(function(){
				if(N.ENV.supportLocalStorage)
					return function(k){
						if(!arguments.length) return N.ENV.localStorage;
						var bi = N.ENV.localStorage.getItem(k);
						return (bi==null) ? undefined : N.fromDataString(bi);
					}
				return function(k){ N.fromDataString(this.getCookie(k)); };
			}()),
			usingLocalData:(function(){
				if(N.ENV.supportLocalStorage)
					return function(k){
						return (N.ENV.localStorage.getItem(k) ? true : false);
					}
				return function(k){ this.usingCookie(k) };
			}()),
			touchLocalData:(function(){
				if(N.ENV.supportLocalStorage)
					return function(k,v){
						if( !this.usingLocalData(k) ) this.setLocalData(k,v);
					};
				return function(k,v){ this.touchCookie(k,N.toDataString(v)) };
			}()),
			removeLocalData:(function(){
				if(N.ENV.supportLocalStorage)
					return function(k){
						N.ENV.localStorage.removeItem(k);
					};
				return function(k){this.removeCookie(k)}
			}()),
			setSessionData:(function(){
				if(N.ENV.supportSessionStorage)
					return function(k,v){
						N.ENV.sessionStorage.setItem(k,N.toDataString(v));
						return true;
					}
				return function(k,v){ return this.setCookie(k,N.toDataString(v)); };
			}()),
			sessionData:(function(){
				if(N.ENV.supportSessionStorage)
					return function(k){
						if(!arguments.length) return N.ENV.sessionStorage;
						var bi = N.ENV.sessionStorage.getItem(k);
						return (bi==null) ? undefined : N.fromDataString(bi);
					}
				return function(k){ N.fromDataString(this.getCookie(k)); };
			}()),
			usingSessionData:(function(){
				if(N.ENV.supportSessionStorage)
					return function(k){
						return (N.ENV.sessionStorage.getItem(k) ? true : false);
					}
				return function(k){ this.usingCookie(k) };
			}()),
			touchSessionData:(function(){
				if(N.ENV.supportSessionStorage)
					return function(k,v){
						if( !this.usingSessionData(k) ) this.setSessionData(k,v);
					};
				return function(k,v){ this.touchCookie(k,N.toDataString(v)) };
			}()),
			removeSessionData:(function(){
				if(N.ENV.supportSessionStorage)
					return function(k){
						N.ENV.sessionStorage.removeItem(k);
					};
				return function(k){this.removeCookie(k)}
			}()),			
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
			        var str = new N.HashSource();
			        var len = new N.HashSource();
			        var str = Components.classes["@mozilla.org/supports-string;[[[[1]]]]"].createInstance(Components.interfaces.nsISupportsString);
			        var copytext=meintext;
			        str.data=copytext;
			        trans.setTransferData("text/unicode",str,copytext.length*[[[[2]]]]);
			        var clipid=Components.interfaces.nsIClipboard;
			        if (!clip) return false;
			        clip.setData(trans,null,clipid.kGlobalClipboard);      
			    }
			},
			"toDataString":function(v){ 
				if(typeof v === "boolean") return v ? "true" : "false";
				return N.toString(v,99,true); 
			},
			"fromDataString":function(v){ 
				if(typeof v === "string") { 
					if( v.charAt(0)=="\"" && v.charAt(v.length-1)=="\"" ){
						return v.substr(1,v.length-2);
					} else {
						return /^(\s+|)$/.test(v) ? "" : eval("(" + v + ")");
					}
					console.error("decodeString::디코딩실패 ->",v,"<-"); throw e;
				}
				return v; 
			}
		});
		N.STORE.EACH_TO_METHOD();
		
		//FLASH INTERFACE
		var FLASH_STORE_KEY     = "NODY_FLASH_PERSISTANCE_STORE";
		var FLASH_STORE_BEFORE  = N.sessionData(FLASH_STORE_KEY) || {};
		var FLASH_STORE_CURRENT = {};
		window && window.addEventListener("beforeunload",function(e){ 
			N.removeSessionData(FLASH_STORE_KEY);
			if(N.propLength(FLASH_STORE_CURRENT) > 0){
				N.setSessionData(FLASH_STORE_KEY,FLASH_STORE_CURRENT)
			}
		});
		
		N.SINGLETON("FLASH",{
			flash:function(k){
				return arguments.length ? N.fromDataString(FLASH_STORE_BEFORE[k]) : FLASH_STORE_BEFORE;
			},
			nextFlash:function(k,v){
				if(arguments.length > 1){
					FLASH_STORE_CURRENT[k] = N.toDataString(v);
					return true;
				}
				return arguments.length ? FLASH_STORE_CURRENT[k] : FLASH_STORE_CURRENT;
			}
		})
		N.FLASH.EACH_TO_METHOD();
		
		N.SINGLETON("ADVKIT",{
			"scalef":function(scale,value,total){
				return (typeof value === "number"?value:100) / (typeof total === "number"?total:100) * scale;
			},
			"scale":function(scale,value,total){
				return Math.round(N.ADVKIT.scalef(scale,value,total));
			},
			// nd.ratio(500,10,50,100) => [31, 156, 313]
			"ratiof":function(ratioTotal){
				var args = N.argumentsFlatten(arguments),total = 0,ratioTotal=N.toNumber(args.shift()) || 100;
				return N.dataMap(args,function(v){
					var num = N.toNumber(v);
					total += num;
					return num;
				},N.arrayMap,function(num){
					return num / total * ratioTotal;
				});
			},
			"ratio":function(ratioTotal){
				var fixResult = N.toNumber(ratioTotal);
				var roundResult = N.arrayMap(N.ADVKIT.ratiof.apply(this,Array.prototype.slice.call(arguments)),function(n){
					var round = Math.round(n);
					fixResult -= round;
					return round;
				});
				if(fixResult !== 0){
					roundResult[roundResult.length-1] += fixResult;
				} 
				return roundResult;
			},
			"arcPointf":function(radius,deg){
				radius=N.parseFloat(radius),deg=N.parseFloat(deg);
				var radian = (360-deg) * Math.PI / 180;
				return [radius - radius * Math.sin(radian),radius - radius * Math.cos(radian)];
			},
			"arcPoint":function(radius,deg){
				return N.arrayMap(N.arcPointf(radius,deg),function(n){ return Math.round(n); });
			},
			"toPx":function(v){ if( /(\%|px)$/.test(v) ) return v; return N.toNumber(v)+"px"; },
			//래핑된 텍스트를 제거
			"isWrap":function(c,w){ if(typeof c === "string"){ c = c.trim(); w = typeof w !== "undefined" ? N.toArray(w) : ['""',"''","{}","[]"]; for(var i=0,l=w.length;i<l;i++){ var wf = w[i].substr(0,w[i].length-1); var we = w[i].substr(w[i].length-1); if(c.indexOf(wf)==0 && c.substr(c.length-1) == we) return true; } } return false; },
			"unwrap":function(c,w){ if(typeof c === "string"){ c = c.trim(); w = typeof w !== "undefined" ? N.toArray(w) : ['""',"''","{}","[]","<>"]; for(var i=0,l=w.length;i<l;i++) if(N.isWrap(c,w[i])) return c.substring(w[i].substr(0,w[i].length-1).length,c.length-1); } return c; },
			"wrap":function(c,w){ if(!N.isWrap(c,w)){ c = typeof c === "string" ? c.trim() : ""; w = typeof w === "string" ? w.length > 1 ? w : '""' : '""'; return w.substr(0,w.length-1) + c + w.substr(w.length-1); } return c; },
			//쿼테이션을 무조건 적용
			"DQURT":function(c){ if(typeof c === "string"){ if(N.isWrap(c,'""')) return c; return '"'+N.unwrap(c,"''")+'"'; } return c; },
			"SQURT":function(c){ if(typeof c === "string"){ if(N.isWrap(c,"''")) return c; return "'"+N.unwrap(c,'""')+"'"; } return c; },
			//첫번째 택스트 값에 대한 두번째 매칭되는 값의 index나열
			"indexes":function(c,s){
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
			// 아래 N.indexes 함수들은 어떠한 위치를 제외한 인덱싱을 위해 존재함
			"safeSplitIndexes":function(c,idx,safe){
				if(typeof c === "string" && N.isArray(idx)){
					var indexes = N.clone(idx);
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
			"simpleRange":function(result){
				if(result){
					var sFlag    = [];
					sFlag.length = result.length; 
					for(var si=0,sl=result.length;si<sl;si++) for(var sfi=0,sfl=result.length;sfi<sfl;sfi++) if(si !== sfi) if(result[si][0] < result[sfi][0]) if(result[si][1] > result[sfi][1]) sFlag[sfi] = false;
					var sResult = [];
					for(var sri=0,srl=sFlag.length;sri<srl;sri++) if(sFlag[sri] !== false) sResult.push(result[sri]);
					return sResult;
				}
			},
			"indexesRange":function(f,e){
				if(N.isArray(f) && N.isArray(e)){
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
				} else if(N.isArray(f) && typeof e === "undefined"){
					var result = [];
					var stack  = [];
					for(var i=0,l=f.length;i<l;i++){
						stack.push(f[i]);
						if(stack.length > 1) result.push(stack);
					}
					return result;
				} else {
					console.warn("N.indexesRange::두번째까지 파라메터는 array여야 합니다.",f,e);
				}
			},
			"safeSplit":function(c,s,w,safe){
				if(typeof c === "string"){
					if(typeof s !== "string" || s.length == 0) s=",";
					if(s.length > 1){
						console.wran("N.safeSplit:: 두번째 파라메터는 1글자만 지원합니다. => ",s);
						s = s.substr(0,1);
					}
					w = typeof w !== "undefined" ? N.toArray(w) : ["{}","[]"];
					c = N.unwrap(c,w);
					var outSplit = [];
					for(var i=0,l=w.length;i<l;i++){
						var fv   = w[i].substr(0,w[i].length-1);
						var ev   = w[i].substr(w[i].length-1);
						var fidx = N.indexes(c,fv);
						if(fv == ev){
							outSplit = outSplit.concat(N.indexesRange(fidx));
						} else {
							var eidx = N.indexes(c,ev);
							outSplit = outSplit.concat(N.indexesRange(fidx,eidx));
						}
					}
					outSplit = N.simpleRange(outSplit);
					var splitPoints  = N.indexes(c,s);
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
					return N.safeSplitIndexes(c,splitIndexes,safe);
				}
			},
			//Helper of pascalCase,camelCase,snakeCase,kebabCase
			"CASE_SPLIT":function(s,c){ if(typeof c === "string") return s.split(c) ; if(typeof s !== "string")return console.error("CASE_SPLIT::첫번째 파라메터는 반드시 String이여야 합니다. // s =>",s); s = s.replace(/^\#/,""); /*kebab*/ var k = s.split("-"); if(k.length > 1) return k; /*snake*/ var _ = s.split("_"); if(_.length > 1) return _; /*Cap*/ return s.replace(/[A-Z][a-z]/g,function(s){return "%@"+s;}).replace(/^\%\@/,"").split("%@"); },
			//to PascalCase
			"pascalCase":function(s){ var words = N.CASE_SPLIT(s); for(var i=0,l=words.length;i<l;i++) words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase(); return words.join(""); },
			//to camelCase
			"camelCase":function(s){ var words = N.CASE_SPLIT(s); for(var i=1,l=words.length;i<l;i++) words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase(); words[0] = words[0].toLowerCase(); return words.join(""); },
			//to snake_case
			"snakeCase":function(s){ var words = N.CASE_SPLIT(s); for(var i=0,l=words.length;i<l;i++) words[i] = words[i].toLowerCase(); return words.join("_"); },
			//to kebab-case
			"kebabCase":function(s){ var words = N.CASE_SPLIT(s); for(var i=0,l=words.length;i<l;i++) words[i] = words[i].toLowerCase(); return words.join("-"); },
			//길이만큼 늘립니다.
			"dataClip":N.CONTINUE_FUNCTION(function(v,l,ex){
				var d = N.cloneArray(v);
				if(typeof l !== 'number' || d.length === l) return d;
				if (d.length > l) return Array.prototype.slice.call(d,0,l);
				N.times(l - d.length,function(){ d.push(ex); });
				return d;
			},2),
			"dataRepeat":N.CONTINUE_FUNCTION(function(v,l){
				var d = N.cloneArray(v);
				if(typeof l !== 'number' || d.length === l) return d;
				if (d.length > l) return Array.prototype.slice.call(d,0,l);
				N.times(l - d.length,function(){ d.push(v); });
				return d;
			},2),
			//길이만큼 리피트 됩니다.
			"dataTile":function(v,l){
				var base;
				switch(typeof v){
					case "string":case "number": base = v; break;
					case "object":if(N.isArray(v)){base = v;}else{ console.warn("N.dataTile::Array만 가능합니다."); return v;} break;
				}
				if(typeof base === "undefined"){ return ; } else {
					var baseLength = N.toLength(v);
					var result,len = N.toNumber(l,baseLength);
					switch(typeof base){
						case "string": result=""; for(var i=0;i<len;i++)result+=v[N.indexForTurn(i,baseLength)]; return result;
						case "number":
							var vm = [];
							(v+"").replace(/\d/g,function(s){vm.join(s*1);});
							result=0 ; for(var i=0;i<len;i++)result+=vm[N.indexForTurn(i,baseLength)]; return result;
							break;
						case "object":
							result=[]; for(var i=0;i<len;i++)result.push(v[N.indexForTurn(i,baseLength)]); return result;
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
		
			// 글자안의 숫자를 뽑아냅니다.
			"textNumber":function(source){
				if(typeof source === "string"){
					var info = (new StringNumberInfo(source)).get();
					if(!!info.prefix || !!info.prefixZero || !!info.suffix) return source;
				}
				return N.toNumber(source);
			},
			// 1~4 => random any
			"zoneRange":function(source){
				var numberSplit = /^([^\~]*)\~(.*)$/.exec(source);
				if(numberSplit){
					var ns1 = (new StringNumberInfo(numberSplit[1])).get();
					var ns2 = (new StringNumberInfo(numberSplit[2])).get();
					//
					var nprefix = ns1.prefix;
					var nzeroLen = !!ns1.prefixZero ? ns1.prefixZero.length + ns1.integer.length : 0 ;
					//
					var numv1 = N.toNumber(ns1.number);
					var numv2 = N.toNumber(ns2.number);
					//
				
					var chov  = 0;
					if(numv1 > numv2){ chov = numv2+Math.floor(Math.random()*(numv1-numv2+1));
					} else { chov = numv1+Math.floor(Math.random()*(numv2-numv1+1)); }
					//
					if( nzeroLen > 0){
						renVal = N.toNumber(chov);
						renLen = N.toNumber(nzeroLen);
						chov   = renLen ? ((renVal + Math.pow(10,renLen))+"").substr(1) : renVal
					} 
					return !!nprefix ? nprefix+chov : chov;
				} else {
					return N.textNumber(source);
				}
			},
			// 1,2,3,4 => random any
			"zoneChoice":function(value,split){
				if( N.isArray(value) ) return value[Math.floor(Math.random()*(value.length))];
				var cache = N.cache.get("N.zoneChoice",value+split);
				if(cache) return cache[Math.floor(Math.random()*(cache.length))];
				var cachedata = value.split(typeof split === "string"?split:"|");
				N.cache.set("N.zoneChoice",value+split,cachedata);
				return cachedata[Math.floor(Math.random()*(cachedata.length))];
			},
			"zoneInfo":function(command){
				command = N.toString(command);
				var value,mutableType,type = (command.indexOf("\\!") == 0)?"fixed":(command.indexOf("\\?") == 0)?"mutable":"plain";
				if(type != "plain"){
					command = command.substr(2);
					if(/\d+\~\d+/.test(command)){
						mutableType = "range";
						value = (type == "fixed") ? N.zoneRange(command) : command;
					} else if( command.indexOf("|") > -1 ){
						mutableType = "choice";
						value = (type == "fixed") ? N.zoneChoice(command) : command;
					} else {
						console.error("setZoneParams:: 알수없는 명령어 입니다 ->",command);
						value = command;
					}
				} else {
					value = command;
				}
				return {value:value, type:type, mutableType:mutableType};
			},
			"zoneValue":function(zone){
				switch(zone.type){
					case "fixed": case "plain":
						return zone.value;
						break;
					case "mutable":
						switch(zone.mutableType){
							case "range":
								return N.zoneRange(zone.value);
								break;
							case "choice":
								return N.zoneChoice(zone.value);
								break;
						}
						break;
				}
			}
		});
		N.ADVKIT.EACH_TO_METHOD();
	
	
	
		N.METHOD("exp",function(source){
			var seed = this.seed || 0;
			var aPoint=[],params = N.dataMap(Array.prototype.slice.call(arguments,1),function(t){ return N.zoneInfo(t); });
			return source.replace(/(\\\([^\)]*\)|\\\{[^\}]*\})/g,function(s){
				if(s[s.length-1] == ')') {
					var dv = N.zoneValue(N.zoneInfo("\\!"+s.substring(2,s.length-1)));
					aPoint.push(dv);
					return dv;
				} else {
					var evs = s.substring(2, s.length - 1).replace(/\$i/g, function(s) {
	                    return seed;
	                }).replace(/\&\d+/g, function(s) {
	                    var av = aPoint[parseInt(s.substr(1))];
	                    return N.likeNumber(av) ? av * 1 : '\"' + av + '\"';
	                }).replace(/\$\d+/g, function(s) {
	                    var paramResult = params[parseInt(s.substr(1))];
	                    if (paramResult) {
	                        paramResult = N.zoneValue(paramResult);
	                        return N.likeNumber(paramResult) ? paramResult : '\"' + paramResult + '\"' ;
	                    }
	                });
					var v = eval(evs);
					aPoint.push(v);
					return v;
				}
			});
		
		},{
			seed:function(seed){ 
				this.seed = N.toNumber(seed);
				return this.getter;
			}
		});
	
		N.METHOD("expn",function(source){
			if(arguments.length === 1){
				return N.toNumber(N.exp.call(undefined,"\\("+source+")"));
			} else {
				var args = Array.prototype.slice.call(arguments);
				args[0]  = "\\{"+args[0]+"}";
				return N.toNumber(N.exp.apply(undefined,args));
			}
		},{
			seed:function(seed){ this.seed = N.toNumber(seed);return this.getter; }
		});
	
		//******************
		// NodyArray
		N.ARRAY_MODULE("Array",{
			each     : function(block) { for ( var i=0,l=this.length;i<l;i++) { if( block(this[i],i) == false ) break; } return this; },
			reverseEach : function(block) { for ( var i=this.length-1;i>-1;i--) { if( block(this[i],i) == false ) break; } return this; },
			keys  : function(rule){ return N.propKey(this,rule); },
			zero  :function(){ return N.dataFirst(this); },
			first :function(){ return N.dataFirst(this); },
			last :function(){ return N.dataLast(this); },
			has:function(v){ for(var i=0,l=this.length;i<l;i++) if(this[i] === v) return true; return false; },
			push : function(v,i){ switch(typeof i){ case "string": case "number": this[i] = v; break; default: Array.prototype.push.call(this,v); break; } return this; },
			add :function(v,i){ if( !this.has(v) ) this.push(v,i); return this; },
			marge:function(array){
				var _self = this;
				N.dataEach(array,function(v){ _self.add(v); });
				return this;
			},
			setSource : function(v){
				if( N.isArray(v) ) {
					if("toArray" in v){
						Array.prototype.splice.apply(this,[0,this.length].concat(v.toArray()));
					} else {
						Array.prototype.splice.apply(this,[0,this.length].concat(Array.prototype.slice.call(v)));
					}
					return this;
				} else {
					if(v||v==0){
						Array.prototype.splice.call(this,0,this.length,v);
					} else {
						Array.prototype.splice.call(this,0,this.length);
					}
					return this;
				}
			},
			//값의 길이
			isNone:function(){ return (this.length === 0) ? true : false },
			isOne:function(){ return (this.length === 1) ? true : false },
			isMany:function(){ return (this.length > 1) ? true : false },
			//선택된 값으로 배열이 재정렬 됩니다.
			selectValue:function(value){ var selects = []; N.dataEach(this,function(v){ if(v == value) selects.push(v); }); this.setSource(selects); },
			selectIndex:function(index){ return this.setSource(this[index]); },
			selectFirst:function(){ return this.setSource(this[0]); },
			selectLast :function(){ return this.setSource(this[this.length-1]); return this; },
			//배열의 길이를 조절합니다.
			max:function(length) { this.length = length > this.length ? this.length : length; return this; },
			min:function(length,undefTo){var count=parseInt(length);if(typeof count=="number")if(this.length<count)for(var i=this.length;i<count;i++)this.push(undefTo);return this;},
			//원하는 위치에 대상을 삽입합니다.
			insert: function(v,a){ 
				N.arrayInsert(this,v,a);
				return this;
			},
			// 순수 Array로 반환
			toArray  : function() { return Array.prototype.slice.call(this); },
			//내부요소 모두 지우기
			clear   : function() { this.splice(0,this.length); return this; },
			clone:function(){ return new N.Array(this);},
			//filter function(a,b){ return a>b; } => [a,b];
			sort:function(filter){
				if(typeof filter !== "function") {
					return Array.prototype.sort.call(new N.Array(this));
				}
				if(this.length == 0){
					return this.toArray();
				}
				var result = new N.Array([this[0]]);
				for(var i=1,l=this.length;i<l;i++) for(var ri=0,rl=result.length;ri<rl;ri++){
					if(filter(this[i],result[ri]) === true){
						result.insert(this[i],ri);
						break;
					}
					if((ri + 1) === result.length){
						result.push(this[i]);
					}
				}
				return result;
			},
			setSort:function(filter){
				if(typeof filter !== "function") {
					return Array.prototype.sort.call(this);
				} else {
					return this.setSource(this.sortFilter(filter));
				}
			},
			callback:function(f){
				if(typeof f === "function"){ return f.call(this,this); }
			},
			//뒤로부터 원하는 위치에 대상을 삽입합니다.
			behind: function(v,a){ return this.insert(v, this.length - (isNaN(a) ? 0 : parseInt(a)) ); },
			//원하는 위치에 대상을 덮어씁니다.
			overwrite : function(v,a){ this.min(a+1); this[a] = v; return this; },
			// 현재의 배열을 보호하고 새로운 배열을 반환한다.
			save : function(v){ return this.__NativeInitializer__(this); },
			//array안의 array 풀어내기
			flatten : function(){ return new N.Array(N.argumentsFlatten(this)); },
			setFlatten    : function(){return this.setSource(this.flatten());},
			//다른 배열 요소를 덛붙인다.
			concat : function(){ return new N.Array(arguments).inject(this.save(),function(v,_a){ new N.Array(v).each(function(v2){ _a.push(v2); }); }); },
			setConcat    : function(){ return this.setSource(this.concat.apply(this,arguments)); },
			//
			append:function(a){
				if(a === undefined || a === null) return this;
				if( !N.isArray(a) ) return this.push(a);
				for(var i=0,l=a.length;i<l;i++) this.push(a[i]);
				return this;
			},
			prepend:function(a){
				if(a === undefined || a === null) return this;
				if( !N.isArray(a) ) return this.insert(a,0);
				for(var i=0,l=a.length;i<l;i++) this.insert(a[i],i);
				return this;
			},
			//어떠한 요소끼리 위치를 바꾼다
			changeIndex:function(leftIndex,rightIndex){
				var left  = this[leftIndex];
				var right = this[rightIndex];
				this[leftIndex]  = right;
				this[rightIndex] = left;
			},
			// 리턴한 요소를 누적하여 차례로 전달함
			inject:function(firstValue,method) { for(var i = 0,l = this.length;i<l;i++) { var returnValue = method(this[i],firstValue,i); if(typeof returnValue !== "undefined") firstValue = returnValue; } return firstValue; },
			// 상속대상도 map의 결과는 이 모듈이여야 합니다.
			map:function(process)    { return new N.Array(N.dataMap(this,process)); },
			setMap:function(process) { return N.arrayMap(this,process); },
			// index가 maxIndex한계값이 넘으면 index가 재귀되어 반환된다.
			turning:function(maxIndex,method){
				var NI = parseInt(maxIndex);
			   	var t  = function(cIndex) { if(cIndex < 0) { var abs = Math.abs(cIndex); cIndex = NI-(abs>NI?abs%NI:abs); }; return (NI > cIndex)?cIndex:cIndex%NI; };
				var ti = function(cIndex) { return { "turning" : t(cIndex), "group"   : Math.floor(cIndex/NI) } };
				for(var i = 0; i < this.length ; i++) { var tio = ti(i); method(this[i],tio.turning,tio.group,i); }
				return this;
			},
			// true를 반환하면 새 배열에 담아 리턴합니다.
			filter   : function(filterMethod) { 
				if(typeof filterMethod === "undefined") { filterMethod = function(a){ return typeof a === "undefined" ? false : true; }; } 
				if(typeof filterMethod === "function"){
					var result=[]; 
					this.each(function(v,i){ if(true==filterMethod(v,i)){ result.push(v); } });
					return new N.Array(result);
				}
				return new N.Array();
			},
			setFilter      : function(filterMethod) { return this.setSource(this.filter(filterMethod)); },
			// undefined요소를 제거한다.
			compact : function(){ return this.filter(function(a){ return a == undefined ? false : true; }); },
			setCompact    : function(){ return this.setSource(this.compact());},
			// time // 오버라이팅
			timesmap : function(time,method,start,end){
				var _ = this;
				var length = _.length;
				var result = this.clone();
				var timef  = (typeof method === 'function') ? method : function(){return method;}
			
				N.timesMap(time,function(i){
					if( length <= i ) result.push( timef(_[i],i) ); else result[i] = timef(_[i],i);
				},start,end);
			
				return result;
			},
			setTimesmap:function(time,method,start,end){ return this.setSource(this.timesmap(time,method,start,end)); },
			// 파라메터 함수가 모두 true이면 true입니다.
			isAll:function(passMethod) { for(var i=0,l=this.length;i<l;i++) if(passMethod(this[i],i) != true) return false; return true; },
			// 하나라도 참이면 true입니다
			isAny:function(passMethod) { for(var i=0,l=this.length;i<l;i++) if(passMethod(this[i],i) == true) return true; return false; },
			//substr처럼 array를 자른다.
			subarray:function(fi,li,infinity){
				fi = isNaN(fi) == true ? 0 : parseInt(fi);
				li = isNaN(li) == true ? 0 : parseInt(li);
				var nl,ns,result = new N.Array();
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
			setSubarray:function() { return this.setSource(this.subarray.apply(this,arguments));},
			subarr:function(fi,li) { return this.subarray(fi,li ? li + fi : this.length); },
			setSubarr:function(fi,li){return this.setSource(this.subarr(fi,li));},
			//해당되는 인덱스를 제거
			drop:function(index){ index=index?index:0;return this.subarray(index).concat(this.subarr(index+1)); },
			setDrop:function(index) { return this.setSource(this.drop(index)); },
			// 인수와 같은 요소를 제거한다.
			getRemove:function(target) { return this.filter(function(t){ if(t == target) return false; return true; }); },
			remove:function(target) { return this.setSource(this.getRemove(target)); },
			// 요소중의 중복된 값을 지운다.
			unique:function(){var result=new N.Array();this.each(function(selfObject){if(result.isAll(function(target){return selfObject!=target;}))result.push(selfObject);});return result;},
			setUnique:function(){return this.setSource(this.unique());},
			// 인수가 요소안에 갖고있다면 true가 반환
			has : function(h) { return this.isAny(function(o) { return o == h; }); },
			// index위치에 있는 요소를 얻어온다.
			eq:function(index,length){if(isNaN(length))length=1;return this.subarr(index,length);},
			// 요소중 처음으로 일치하는 index를 반환한다.
			indexOf:function(target){var result=-1;this.each(function(t,i){if(t==target){result=i;return false;}});return result;},
			lastIndexOf:function(target){var result=-1;this.reverseEach(function(t,i){if(t==target){result=i;return false;}});return result;},
			//todo
			nthIndexOf:function(nth,target){
				
			},
			// 첫번째부터 참인 오브젝트만 반환합니다. //마지막부터 참인
			firstMatch:function(matchMethod){var result;this.each(function(value,index){if(matchMethod(value,index)==true){result=value;return false;}});return result;},
			lastMatch:function(matchMethod){var result;this.reverseEach(function(value,index){if(matchMethod(value,index)==true){result=value;return false;}});return result;},
			//todo
			nthMatch:function(nth,value,index){
				
			},
			//요소안의 string까지 split하여 flaatten을 실행
			stringFlatten:function(){ return this.save().setMap(function(t){ if(typeof t === "string") return t.split(" "); if(N.isArray(t)) return new N.Array(t).setFlatten().setFilter(function(v){ return N.is(v,"string")}); }).remove(undefined).setFlatten(); },
			setStringFlatten:function(){ return this.setSource( this.stringFlatten() ); },
			sliceGroup:function(){
				var progressIndex = 0;
				var array  = Array.prototype.slice.call(this);
				var result = new N.Array();
				N.dataEach(N.dataFilter(N.argumentsFlatten(arguments),function(n){return typeof n === "number" && n > 0;}),function(i){
					if(!array.length){
						return false;
					}
					result.push(array.splice(0,i));
				});
				array.length && result.push(array);
				return result;
			},
			setSliceGroup:function(){
				this.setSource(this.sliceGroup.apply(this,Array.prototype.slice.call(arguments)));
			},
			//그룹 지어줌
			groups:function(length,reverse){
				var result=[];
				if(reverse == true){
					this.save().reverse().turning(length,function(obj,i,g){if(!result[g])result[g]=[];result[g].push(obj);});
					return new N.Array(result).setMap( function(groups){ return new N.Array(groups).reverse().toArray(); } ).reverse();
				}
				this.turning(length,function(obj,i,g){if(!result[g])result[g]=[];result[g].push(obj);});
				return new N.Array(result);
			},
			setGroups:function(length,reverse){ return this.setSource(this.groups(length,reverse)); },
			//랜덤으로 내용을 뽑아줌
			random:function(length){ return new N.Array(N.dataRandom(this.toArray())); },
			shuffle:function(){ return new N.Array(N.dataShuffle(this.toArray())); },
			setShuffle:function(){ return this.setSource(this.shuffle()); },
			join:function(t,p,s){ return (N.likeString(p)?p:"")+Array.prototype.join.call(this,t)+((N.likeString(s))?s:""); },
			//Object로 반환
			keyPair:function(key,value){
				if (!N.likeString(key)) key = "key";
				if (!N.likeString(value)) value = "value";
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
			}
		});
		
		N.MODULE_PROPERTY("Array","split",function(text,s){
			if( N.isArray(text) ) return new N.Array(text);
			if(typeof text === "string"){
				var result;
				if((typeof s === "string") || typeof s === "number") {
					s = s+"";
					result = text.split(s);
				} else {
					result = [];
					text.replace(/\S+/gi,function(s){ result.push(s); });
				}
				return new N.Array(result);
			}
			console.warn("Array.split only text or array", text);
			return new N.Array(text);
		});
		
		//******************
		N.MODULE("HashSource",{
			setSource:function(obj,k){ 
				obj = N.toObject(obj,k);
				if(typeof obj === "object"){ 
					for(var key in this.Source) delete this.Source[key]; 
					for(var k in obj) this.Source[k] = obj[k]; 
				} 
				return this; 
			},
			keys:function(rule,keys){ return N.propKey(this.Source,rule,keys); },
			values:function(){ 
				var result = [];
				if(arguments.length){
					for(var i=0,l=arguments.length;i<l;i++){
						if(typeof arguments[i] === "function") {
							return arguments[i].apply(undefined,result);
						} else {
							result.push(this.Source[arguments[i]]);
						}
					}
				} else {
					for (key in this.Source) result.push(this.Source[key]);
				}
				return result;
			},
			each:function(f){ for(key in this.Source){ var r = f(this.Source[key],key); if(typeof r == false) {break;} } return this; },
			reverseEach:function(method){ var keys = this.keys(); for ( var i = keys.length - 1 ; i > -1 ; i--) { if( method(keys[i],i) == false ) break; } return this; },
			callback:function(f){
				if(typeof f === "function") this.call(this,this.Source);
			},
			count:function(){return N.propLength(this.Source); },
			clone:function(){return N.clone(this.Source); },
			save:function() {return this.__NativeInitializer__(N.clone(this.Source)); },
			//key value get setter
			pushKeyValue:function(){
				for(var i=0,l=Math.ceil(arguments.length/2);i<l;i++){
					this.Source[arguments[i*2]] = arguments[i*2+1];
				}
				return this;
			},
			//존재하지 않는 키
			safePushKeyValue:function(){
				for(var i=0,l=Math.ceil(arguments.length/2);i<l;i++){
					var key = this.Source[arguments[i*2]];
					if(key in this.Source) this.Source[key] = arguments[i*2+1];
				}
				return this;
			},
			hasProp:function(key){
				if(arguments.length === 0){
					for(var sk in this.Source) return true; return false;
				}
				return key in this.Source;
			},
			prop:function(k,filter){
				if(arguments.length === 0){
					return this.Source;
				} else {
					if(typeof k === "string"){
						return (typeof filter === "function") ? filter.call(this,this.Source[k],(k in this.Source)) : this.Source[k];
					} else {
						var _self = this;
						if(typeof filter === "function") {
							return N.dataMap(k,function(key){ return filter.call(_self,_self.Source[key],(key in _self.Source)); });
						} else {
							return N.dataMap(k,function(key){ return _self.Source[key]; });
						}
					}
				}
			},
			setProp:function(k,v){
				if(arguments.length < 2){
					console.warn('arguments length must be gt 2');
				} else if(typeof k === "string") {
					this.Source[k] = v;
				} else if(typeof k === "object") {
					for(var kk in key) this.setProp(kk,key[kk]);
				} 
				return this;
			},
			//키값판별
			propIs    :function(key,test,t,f) { return N.is(this.Source[key],test,t,f); },
			propLike  :function(key,test,t,f) { return N.like(this.Source[key],test,t,f); },
			//오브젝트에 키를 가지고 있는지 확인
			has:function(key,value){ 
				return (arguments.length === 2) ? (key in this.Source) ? (this.Source[key] === value) : false : (key in this.Source);
			},
			//그러한 value가 존재하는지 확인
			hasValue:function(value){
				var result = false;
				this.each(function(v,k){ if(value == v){ result = true; return false; } });
				return result;
				return key in this.Source; 
			},
			//배열기반 키벨류 관리
			hasDataProp:function(keyName){
				return N.isModule(this.Source[keyName],"Array");
			},
			touchDataProp:function(keyName,autoReplace){
				if(typeof keyName === "string"){
					//arrayModule
					return this.hasDataProp(keyName) ? this.Source[keyName] :
					       (autoReplace === false) ? new N.Array(this.Source[keyName]) : 
							this.Source[keyName] = new N.Array(this.Source[keyName]);
				} else {
					console.warn('Manage::touchDataProp parameter is must be string',keyName);
				}
				return new N.Array();
			},
			defineDataProp:function(){
				var args = N.argumentsFlatten(arguments);
				for(var i=0,l=args.length;i<l;i++) this.touchDataProp(args[i]);
				return this;
			},
			dataProp:function(k,filter){
				var data = this.touchDataProp(k,false);
				if(typeof filter === "function")
					return data.map(filter);
				return data;
			},
			pushDataProp:function(k,v,unique){
				var data = this.touchDataProp(k);
				if(arguments.length < 2) return console.warn("pushDataProp is must be length gt 1");
				data[unique?"add":"push"](v);
				return this
			},
			extend:function(o){ N.extend(this.Source,o); return this; },
			marge:function(o){ return N.marge(this.Source,o); },
			extendFill:function(o){ N.extendFill(this.Source,o); return this; },
			margeFill:function(o){ return N.margeFill(this.Source,o); },
			//.arrangementObjectsDataProp({a:2,b:3,c:4},{b:4,d:4},{a:1,d:5})
			//"{"a":[2,null,1],"b":[3,4,null],"c":[4,null,null],"d":[null,4,5]}"
			arrangementObjectsDataProp:function(data){
				var arrangementKeys = new N.Array(this.keys());
				var args  = Array.prototype.slice.call(arguments);
				var _self = this;
				for(var i=0,l=arguments.length;i<l;i++){
					if(typeof args[i] === "object"){
						arrangementKeys.marge(N.propKey(args[i]));
					}
				}
				for(var i=0,l=args.length;i<l;i++){
					arrangementKeys.each(function(key){
						_self.pushDataProp(key,args[i][key]);
					});
					
				}
				return this;
			},
			setDataPropFix:function(){
				for(var key in this.Source) if(N.isModule(this.Source[key],"Array")) this.Source[key] = this.Source[key].toArray();
				return this;
			},
			getDataPropFix:function(){
				var cloneSource = {};
				for(var key in this.Source) {
					if(N.isModule(this.Source[key],"Array")){
						cloneSource[key] = this.Source[key].toArray();
					}  else {
						cloneSource[key] = this.Source[key];
					}
				}
				return cloneSource;
			},
			//map
			map:function(f,ksel){ 
				if(typeof f === "function"){
					var result = N.clone(this.Source),keys = this.keys(ksel,true);
					for(var i=0,l=keys.length;i<l;i++) result[keys[i]] = f(this.Source[keys[i]],keys[i]);
					return result; 
				}
			},
			setMap:function(f,ksel){ 
				if(typeof f === "function"){
					var keys = this.keys(ksel,true);
					for(var i=0,l=keys.length;i<l;i++) this.Source[keys[i]] = f.call(this,this.Source[keys[i]],keys[i]);
					return this;
				}
			},
			inject:function(o,f,ksel){ if(typeof f === "function") { this.map(function(v,k){ var or = f(v,o,k); if(typeof or !== "undefined") { o=or; } },ksel); return o; } },
			join:function(a,b){ a = typeof a === "string" ? a : ":"; b = typeof b === "string" ? b : ","; return this.inject([],function(v,i,k){ i.push(k+a+N.toString(v)); }).join(b); },			
			toParameter : function(useEncode){ return this.inject({},function(val,inj,key){ inj[ (useEncode == false ? key : (new N.StringSource(key)).encode()) ] = (useEncode == false ? val : (new N.StringSource(val)).encode()); }); },
			stringify:function(){ return JSON.stringify(this.getDataPropFix()); },
			toString:function(){ return JSON.stringify(this.getDataPropFix()); },
			change:function(original, change){
				//change key name
				N.propChange(this.Source,original,change); 
				return this.Source;
			},
			//오브젝트의 키를 지우고자 할때
			removeAll:function(){ for( var key in this.Source ) delete this.Source[key]; return this.Source; },
			getRemove:function(){ var source = this.Source; new N.Array(arguments).setStringFlatten().each(function(key){ delete source[key]; }); return this.Source; },
			remove:function(key){ delete this.Source[key]; return this; },
			//다른 오브젝트와 함칠때
			concat:function(){ 
				var result = this.clone(); 
				for(var i=0,l=arguments.length;i<l;i++){ 
					new N.HashSource(arguments[i]).each(function(v,k){ result[k] = v; });
				}; 
				return result; 
			},
			setConcat:function(){ 
				this.setSource(this.concat.apply(this,arguments)); 
				return this; 
			},
			//다른 오브젝트와 함칠때 이미 있는 값은 오버라이드 하지 않음
			safeConcat:function(){ 
				var result = this.clone(); 
				for(var i=0,l=arguments.length;i<l;i++){ 
					new N.HashSource(arguments[i]).each(function(v,k){ 
						if( (k in result) == false) result[k] = v; 
					});
				} 
				return result; 
			},
			setSafeConcat:function(){ 
				this.setSource(this.getSafeConcat.apply(this,arguments)); return this; 
			}
		}, function(p,n,s){
			if(typeof s === "string"){
				this.Source = {};
				this[s].apply(this,new N.Array(arguments).setSubarr(0,2).toArray());
			} else {
				this.Source = N.toObject(p,n);
			}
		}, function(k){
			this.setDataPropFix();
			return (arguments.length == 0) ? this.Source : this.Source[k];
		});
	
		//******************
		//String
		var htmlSafeMap = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': '&quot;', "'": '&#39;', "/": '&#x2F;' };
		N.MODULE("StringSource",{
			encode:function(){ return encodeURI(this.Source); },
			decode:function(){ return decodeURI(this.Source); },
			setEncode:function(){this.Source = this.encode();return this;},
			setDecode:function(){this.Source = this.decode();return this;},
			raw:function(){return this.Source},
			HTMLSafe:function(){
				return (new String(this.Source)).replace(/[&<>"'\/]/g, function (s) { return htmlSafeMap[s]; });
			},
			byteSize:function(){ return N.byteSize(this.Source); },
			lines:function(){ return Array.split(this.Source,"\n").toArray(); },
			lineEach:function(f,j){ if(typeof f === "function") return new N.Array(this.lines()).setMap(function(s,i){ return f(s,i); }).setCompact().join( (j?j:"\n") ); },
			//한줄의 탭사이즈를 구함
			tabSize:function(){
				var tabInfo = /^([\s\t]*)(.*)/.exec(this.Source);
				var tab   = tabInfo[1].replace(/[^\t]*/g,"").length;
				var space = tabInfo[1].replace(/[^\s]*/g,"").length - tab;
				return tab + Math.floor(space / 4);
			},
			//한줄의 탭을 정렬함
			tabAbsolute:function(tabSize,tabString){
				tabSize = N.toNumber(tabSize);
				if(arguments.length < 2) tabString = "\t";
				if(tabSize < 0) tabSize = 0;
				var result = "";
				for(var i = 0; i < tabSize; i++) result += tabString;
				return result + /^([\s\t]*)(.*)/.exec(this.Source)[2];
			},
			//각각의 탭음 밀어냄
			tabsOffset:function(offset,tabString){
				offset = parseInt(offset);
				if(typeof offset === "number") return N.Array.split(this.Source,"\n").setMap(function(text){
					return (new N.StringSource(text)).tabAbsolute((new N.StringSource(text)).tabSize() + offset,tabString);
				}).join("\n");
				return this.Source;
			},
			//라인중
			tabsSize:function(){
				var minimum;
				this.lineEach(function(line){
					var tabSize = (new N.StringSource(line)).tabSize();
					if((minimum == undefined) || (tabSize < minimum)) minimum = tabSize;
				});
				return minimum;
			},
			tabsAlign:function(){
				var beforeSize;
				var baseOffset = 0;
				return this.lineEach(function(line){
					//console.log("baseOffset",baseOffset);
					var tabSize = (new N.StringSource(line)).tabSize();
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
					return (new N.StringSource(line)).tabAbsolute(baseOffset);
				});
			},
			setTabsAlign:function(){ this.Source = this.tabsAlign(); return this; },
			trimLine:function(){ return this.lineEach(function(line){ var trimText = line.trim(); return (trimText == "") ? undefined : line; }); },
			setTrimLine:function(){ this.Source = this.trimLine(); return this; },
			trim:function(){
				return this.Source.trim();
			},
			setTrim:function(){
				this.Source = this.trim();
				return this;
			},
			//content
			abilityFunction  : function(fs,is,js){ var origin = (js==true) ? N.safeSplit(this.Source,fs,["{}","[]",'""',"''"]) : this.Source.trim().split(fs); if(origin[origin.length-1].trim()=="") origin.length = origin.length-1;  return new N.Array(origin).isAll(function(s,i){ return s.indexOf(is) > 0; }) ? origin.length : 0; },
			abilityObject    : function(){ return this.abilityFunction(",",":",true); },
			abilityParameter : function(){ return this.abilityFunction("&","="); },
			abilityCss       : function(){ return this.abilityFunction(";",":"); },
			isDataContent:function(absoluteWrap){
				var o = this.abilityObject();
				var c = this.abilityCss();
				var p = this.abilityParameter();
				if(N.isWrap(this.Source,"[]")) return "array";
				if(absoluteWrap == true) if(N.isWrap(this.Source,"''",'""') == true) return "plain";
				if( (absoluteWrap == true && N.isWrap(this.Source,"{}")) || (o > 0 && o >= c && o >= p) ){
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
				return new N.Array( (js==true) ? N.safeSplit(this.Source,fs,["{}","[]",'""',"''"]) : this.Source.trim().split(fs) ).inject({},function(s,inj){
					var v = s.substr(s.indexOf(is)+1);
					if(s.trim().length > 0) inj[ N.unwrap(s.substr(0,s.indexOf(is)),['""',"''"]) ] = N.unwrap((js == true) ? (new N.StringSource(v)).getContentObject(true) : v,['""',"''"]);
					return inj;
				});
			},
			getContentObject:function(absoluteWrap){
				switch(this.isDataContent(absoluteWrap)){
					case "object"       : return this.isDataContentFunction(",",":",true); break;
					case "parameter"    : return this.isDataContentFunction("&","="); break;
					case "css"          : return this.isDataContentFunction(";",":"); break;
					case "array"        :
						var a = N.safeSplit(this.Source,",",["{}","[]",'""',"''"]);
						if(a == ""){
							return [];
						} else {
							return new N.Array(a).inject([],function(s,inj){
								inj.push(N.unwrap( (new N.StringSource(s)).getContentObject(true) , ["''",'""'] )); 
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
			JSON:function(){ return JSON.stringify(this.getContentObject());},
			//reverse
			reverse : function() { return this.Source.split("").reverse().join(""); },
			setReverse    : function()   { this.Source = this.reverse(); return this; },
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
			removeModel:function(target,space){
				//model split
				space = space ? space : " ";
				var models = this.Source.split(space);
				var result = [];
				if(typeof target === "string") target = new RegExp(
					"("+ target.replace(new RegExp(space+"+","g"),"|")  + ")","g");
				if(target instanceof RegExp) 
					for (var i=0,l=models.length;i<l;i++) 
						if(target.test(models[i]) == false) 
							result.push(models[i]);
				return result.join(space);
			},
			setRemoveModel:function(target,space){
				this.Source = this.removeModel(target,space);
				return this;
			},
			hasModel:function(target,space){
				space = space ? space : " ";
				var models = this.Source.split(space);
				for (var i=0,l=models.length;i<l;i++) if(models[i] == target)  return true;
				return false;
			},
			addModel:function(target,space) { space = space ? space : " ";if(this.hasModel(target,space)) return this.Source; return this.Source + space + target; },
			setAddModel:function(target,space){
				this.Source = this.addModel(target,space);
				return this;
			},
			//prefix suffix
			fixString:function(p,s){ return (typeof p === "string"?p:"") + this.Source + (typeof s === "string"?s:""); }
		},function(param,jsonfy){
			if( typeof param === "undefined" || param == null ){
				this.Source = ""
			} else {
				this.Source = N.toString(param,10,jsonfy);
			}
			return this;
		});
	
		var UNIQUE_RANDOM_KEYS = [];
	
		N.SINGLETON("RANDKIT",{
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
					N.dataEach(UNIQUE_RANDOM_KEYS,function(recentKey){
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
			
				if(randomKey) UNIQUE_RANDOM_KEYS.push(randomKey);
			
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
		N.SINGLETON("CLIENTKIT",{
			width :function(){ return (window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth); },
			height:function(){ return (window.innerHeight|| document.documentElement.clientHeight|| document.getElementsByTagName('body')[0].clientHeight); },
			bound :function(){ return {"width":this.width(),"height":this.height()}; },
			//document path
			url      : function()    { return window.document.URL.toString(); },
			urlInfo  : function(url) { return N.url.info(); },
			root      : function(url,slash) { return N.url.root(); },
			protocol  : function(url) { var h = this.urlInfo(url); return h.protocol; },
			uri       : function(url) { var h = this.urlInfo(url); return h.path;     },
			filename  : function(url) { var h = this.urlInfo(url); return h.filename; },
			filepath  : function(url,slash) { 
				var h = this.urlInfo(url);
				var root = h.protocol + h.divider + h.hostname + (h.port != ""?":"+h.port:h.port);
				return root + h.path.replace(/\/[^\/]+$/,"") + (slash==false?"":"/");
			},
			getAbsolutePath:function(url,fp){
				if(N.isNothing(url)){
					return this.url();
				} else if(N.likeString(url)){
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
			queryData : function(url) { var h = this.urlInfo(url); return N.toObject(h.query); },
			//script path
			scriptUrl  : (function(){ var scripturl = N.url.script(); return function(){ return scripturl; } })(),
			scriptInfo : function(url) { return this.urlInfo(url?url:this.scriptUrl()); },
			scriptName : function(url) { return this.scriptInfo(url).filename },
			scriptPath : function(url) { return this.scriptInfo(url).path     },
			scriptRoot : function(url) { return /(.*\/|\/|)[^\/]*$/.exec(this.scriptInfo(url).path)[1]; },
			isEventSupport:function(eventName,tagName){
				var testTag = (typeof tagName === "object") ? tagName : document.createElement( (typeof tagName === "string") ? tagName : "div" );
				var isSupport = ( eventName in testTag );
				if(!isSupport && ( "setAttribute" in testTag)) {
					testTag.setAttribute(eventName,'return;');
					return (typeof testTag[eventName] === "function");
				}
				return isSupport;
			},
			isLocalHTML:function(){
				return (location.href.indexOf("http:" == 0) || location.href.indexOf("https:" == 0)) ? true : false;
			},
			//include
			include:function(aFilename){ return N.include(aFilename); },
			cursorPoint:function(e) {
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
			
	})(window,N);
	
	//Nody Node Foundation 
	(function(W,N,ENV){
	
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
	
		N.SINGLETON("ELUT",{
			"parseHTML":function(html){
				//if has cache
				var cache = N.cache.get("N.parseHTML",html);
				if(cache) return N.cloneNodes(cache);
			
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
			
				N.cache.set("N.parseHTML",html,N.cloneNodes(parseWrapper.children));
				return N.cloneArray(parseWrapper.children);
			},
			//테그의 속성을 text로 표현합니다.
			"selectorInfo"   : function(tagProperty,attrValue){ 
				tagProperty = (typeof tagProperty !== "string") ? "" : tagProperty;
			
				//캐쉬를 이용해 잦은 표현에 대한 오버해드를 줄입니다.
				var result = N.cache.get("N.selectorInfo",tagProperty);
				if( result ) {
					result = N.cloneObject( result );
				} else {
					var result  = {};
					var matches = [];
					var rest    = tagProperty;
			
					//find regular expression
					rest = rest.replace(ELUT_REGEX,function(ms){
						if(ms)matches.push(ms);
						return "";
					});
				
					var tagprop = matches.concat(N.safeSplit(rest,":","()",true));
					for(var i=0,l=tagprop.length;i<l;i++){
						var sinfo = /(.?)((.?).*)/.exec(tagprop[i]);
						
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
									
									switch(attrInfo[1]){
										case ":disabled": case ":readonly": case ":checked":
											result[":"][attrInfo[2]] = true;
											break;
										case ":nth-child":
											result[":"][attrInfo[2]] = (attrInfo[4] === undefined) ? null : attrInfo[4].match(/^(even|odd)$/) ? attrInfo[4] : N.toNumber(attrInfo[4]) 
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
								result[N.unwrap(attr[1],["''",'""'])] = (attr[3])? N.unwrap(attr[3],["''",'""']) : null;
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
					N.cache.set("N.selectorInfo",tagProperty,N.cloneObject(result));
				}
			
				// 두번째 파라메터 처리
				var attr = N.clone(N.toObject(attrValue,"html"));
			
				if("html" in attr){
					attr["::"] = attr["html"];
					delete attr["html"];
				} 
			
				for(var key in attr) result[key] = attr[key];
			
				return result;
			},
			"pushCSSExpression":function(node,expression){
				if(N.isNode(node)){
					var attrs = (typeof expression === "string") ? N.selectorInfo(expression) :
								(typeof expression === "object") ? expression :
								undefined;
					if(typeof attrs === "object"){
						for(var key in attrs)switch(key){
							case ":" :case "::":case "tagName": /*skip*/ break;
							default:
								if(attrs[key] === null || attrs[key] === undefined){
									node.setAttribute(key,"");
								} else {
									node.setAttribute(key,attrs[key]);
								}
								break;
						}
					}
				}
				return node;
			},
			//css스타일 태그를 html스타일 태그로 바꿉니다.
			"parseTag" : N.CONTINUE_FUNCTION(function(tagProperty,attrValue){
				if(typeof tagProperty === "object"){
					var tagText = [];
					N.dataEach(tagProperty,function(tag){ if(N.isNode(tag)) tagText.push(tag.outerHTML); });
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
					var result = N.cache.get("N.parseTag",cacheName);
					if(result)if(attrValue){
						return result[0]+attrValue+result[1];
					} else {
						return result[0]+result[1];
					}
				}
				var tagInfo = N.selectorInfo(tagProperty,attrValue);
			
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
				if(cacheName) N.cache.set("N.parseTag",cacheName,[cachePrefix,cacheSuffix]);
			
			
				return (cachePrefix + tagValue + cacheSuffix);
			},1)
		});
		N.ELUT.EACH_TO_METHOD();
		N.SINGLETON("NODEKIT",{
			"attr":function(node,v1,v2){
				if(!N.isNode(node)) { console.error("N.NODEKIT.attr은 element만 가능합니다. => 들어온값" + N.tos(node)); return null; }
				if(arguments.length === 1) {
					return N.inject(node.attributes,function(inj,attr){
						inj[attr.name] = node.getAttribute(attr.name);
					});				
				} else if(typeof v1 === "object") {
					for(var k in v1) node.setAttribute(k,v1[k]);
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
				            if(!N.isNothing(attrs)){
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
			"root":function(node){
				if(!N.isNode(node)) return;
				var findWhile = function(node){ node.parentElement ? findWhile(node.parentElement) : node ; };
				return findWhile(node);
			},
			"parents":function(node){
				if(!N.isNode(node)) return;
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
			//하나의 CSS테스트
			"the":function(node,selectText){
				return N.MATCHES_SELECTOR_ENGINE(node,selectText);
			},
			//다수의 CSS테스트
			"is":function(node,selectText){
				if(!N.isNode(node)) return false;
				if((typeof selectText === "undefined") || selectText == "*" || selectText == "") return true;
				return N.MATCHES_SELECTOR_ENGINE(node,selectText);
			},
			//쿼리셀렉터와 약간 다른점은 부모도 쿼리 셀렉터에 포함된다는 점
			"query":function(query,root){
				//querySelectorSupport
				if(typeof query !== "string" || (query.trim().length == 0)) return [];
				root = ((typeof root === "undefined")?document:N.isNode(root)?root:document);
				if(root == document) {
					return N.QUERY_SELECTOR_ENGINE(root,query);
				} else {
					if(N.MATCHES_SELECTOR_ENGINE(root,query))
					return [root].concat(Array.prototype.slice.call(N.QUERY_SELECTOR_ENGINE(root,query)));
					return N.QUERY_SELECTOR_ENGINE(root,query);
				}
			},
			"feedDownWhile":function(feeder,stopFilter,findChild){
				if( stopFilter.call(feeder,feeder) !== false ){
					var childs = N.toArray(findChild.call(feeder,feeder));
					for(var i=0,l=childs.length;i<l;i++) N.NODEKIT.feedDownWhile(childs[i],stopFilter,findChild);
				}
			},
			"style":function(node,styleName,value){
				if(typeof styleName === "undefined"){
					return N.ENV.supportComputedStyle ? window.getComputedStyle(node,null) : node.currentStyle;
				}
				if(typeof styleName === "string"){
					//mordern-style-name
					var prefixedName = N.ENV.getCSSName(styleName);
					if(arguments.length < 3){
						return N.ENV.supportComputedStyle ? window.getComputedStyle(node,null).getPropertyValue(prefixedName) : node.currentStyle[camelCase(prefixedName)];
					}
					//set
					var wasStyle = N.node.attr(node,"style") || "";
					if(value === null) {
						wasStyle     = wasStyle.replace(new RegExp("(-webkit-|-o-|-ms-|-moz-|)"+styleName+"(.?:.?|)[^\;]+\;","g"),function(s){return ''});
						N.node.attr(node,"style",wasStyle);
					} else {
						var prefixedValue = N.ENV.getCSSName(value);
						//set //with iefix
						wasStyle     = wasStyle.replace(new RegExp("(-webkit-|-o-|-ms-|-moz-|)"+styleName+".?:.?[^\;]+\;","g"),"");
						N.node.attr(node,"style",prefixedName+":"+prefixedValue+";"+wasStyle);
					}
				} else if(typeof styleName === "object") {
					N.propEach(styleName,function(val,name){
						if(typeof name === "string"){ N.NODEKIT.style(node,name,val); }
					});
				}
			},
			//도큐먼트상의 엘리먼트 포지션을 반환합니다.
	        position:function(element){
	            if(!element) return null;
	            var xPosition = 0, yPosition = 0;
	            while(element){
	                xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
	                yPosition += (element.offsetTop  - element.scrollTop  + element.clientTop );
	                element = element.offsetParent;
	            }
	            return {x:xPosition,y:yPosition};
	        },
	        //어떤 이벤트에 대한 마우스의 위치를 추적합니다.
	        mousePosition:function(e,root){
	            root = !root ? document.documentElement : root;
	            var pos = this.position(root);
	            pos.x = e.clientX - pos.x, pos.y = e.clientY - pos.y;
	            return pos;
	        }
		});
	
	
		N.SINGLETON("FINDKIT",{
			//루트노드 없이 검색
			"findLite":function(find){
				if( typeof find === 'string' ){
					// [string,null]
					return N.NODEKIT.query(find);
				} else if(N.isNode(find)){
					// [node]
					return [find];
				}  else if(N.isArray(find)) {
					// [array]
					var fc = [];
					for(var i=0,l=find.length;i<l;i++) { 
						if( typeof find[i] === 'string' ) {
							// [array][string]
							var fs = N.NODEKIT.query(find[i]);
							if(fs.length) fc = fc.concat( fs );
						} else if(N.isNode(find[i])) {
							// [array][node]
							fc.push(find[i]);
						} else if(N.isArray(find[i])){
							var fa = N.findLite(find[i]);
							if(fa.length) fc = fc.concat( fa );
						}
					}
					return N.dataUnique(fc);
				}
				return [];
			},
			//여러개의 셀럭터와 하나의 루트노드만 허용
			"findByOnePlace":function(findse,rootNode){
				if(typeof findse === 'string') return N.NODEKIT.query(findse,rootNode);
				if( N.isNode(findse) ) {
					var fs = N.NODEKIT.query(N.node.trace(findse),rootNode);
					for(var i=0,l=fs.length;i<l;i++) if(findse === fs[i]) return [findse];
				}
				if( N.isArray(findse) ) {
					var result = [];
					for(var i=0,l=findse.length;i<l;i++) {
						var fd = N.findByOnePlace(findse[i],rootNode);
						if( fd.length ) result = result.concat(fd);
					}				
					return N.dataUnique(result);
				}
				return [];
			},
			//다수의 로트와 샐렉터를 받고 출력
			"findBySeveralPlaces":function(find,root){
				if(arguments.length === 1 || typeof root === 'undefined' || root === null || root === W.document ) return N.findLite(find);
				// find root
				var targetRoots = N.findLite(root);
				if(targetRoots.length === 0) {
					return N.findLite(find);
				}
				//
				var findes = N.toArray(find);
				var result = [];
				for(var i=0,l=targetRoots.length;i<l;i++) {
					for(var fi=0,fl=findes.length;fi<fl;fi++) {
						var fdr = N.findByOnePlace(findes[fi],targetRoots[i]);
						if( fdr.length ) result = result.concat(fdr);
					}
				}
				return N.dataUnique(result);
			},
			//최적화 분기하여 샐랙터를 실행시킴
			"find" : N.CONTINUE_FUNCTION(function(find,root,eq){
				return (typeof root === "number") ? N.findLite(find)[root] :
					   (typeof eq === "number")   ? N.findBySeveralPlaces(find,root)[eq] :
					   N.findBySeveralPlaces(find,root);
			}),
			"findMember":N.CONTINUE_FUNCTION(function(sel,offset){
				var target = N.findLite(sel)[0];
				if(!N.isNode(target)) return;
				if(typeof offset !== "number") return N.toArray(target.parentElement.children);
				var currentIndex = -1;
				N.dataEach(target.parentNode.children,function(node,i){ if(target == node) { currentIndex = i; return false; } });
				return target.parentNode.children[currentIndex+offset];
			},1),
			// 하위루트의 모든 노드를 검색함 (Continutiltiy에서 중요함)
			"findIn" : N.CONTINUE_FUNCTION(function(root,find,index){
				return (typeof index === 'number') ? N.findBySeveralPlaces(find || '*',N.dataMap(N.findBySeveralPlaces(root),function(node){ return node.children },N.argumentsFlatten))[index] :
					   (typeof find  === 'number') ? N.findBySeveralPlaces('*',N.dataMap(N.findBySeveralPlaces(root),function(node){ return node.children },N.argumentsFlatten))[find]   :
													 N.findBySeveralPlaces(find || '*',N.dataMap(N.findBySeveralPlaces(root),function(node){ return node.children },N.argumentsFlatten)) ;
			},2),
			// 자식루트의 노드를 검색함
			"findOn": N.CONTINUE_FUNCTION(function(root,find){
				var finds = N.dataMap(N.findBySeveralPlaces(root),function(node){ return node.children; },N.argumentsFlatten);
				switch(typeof find){
					case "number": return [finds[find]]; break;
					case "string": return N.dataFilter(finds,function(node){ return N.NODEKIT.is(node,find); }); break;
					default      : return finds; break;
				}
			},1),
			"findParents":N.CONTINUE_FUNCTION(function(el,require,index){ 
				if(typeof require === 'string') {
					return (typeof index === 'number') ?
					N.dataFilter(N.NODEKIT.parents(N.findBySeveralPlaces(el)[0]),function(el){ return N.node.is(el,require); })[index]:
					N.dataFilter(N.NODEKIT.parents(N.findBySeveralPlaces(el)[0]),function(el){ return N.node.is(el,require); });
				} else if(typeof require === 'number') {
					return N.NODEKIT.parents(N.findBySeveralPlaces(el)[0])[require];
				} else {
					return N.NODEKIT.parents(N.findBySeveralPlaces(el)[0]);
				}
			},1),
			"findRoot":N.CONTINUE_FUNCTION(function(el){ 
				return N.NODEKIT.root(N.findLite(el)[0]);
			},1),
			"findBefore":N.CONTINUE_FUNCTION(function(node,filter){ 
				node = N.findLite(node)[0];
				var index = N.node.index(node); 
				var result = []; 
				if(typeof index === "number") {
					switch(typeof filter) {
						case 'string':
							for(var i=0,l=index;i<l;i++){
								var fnode = node.parentNode.children[i];
								N.node.is(fnode,filter) && result.push(fnode);
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
			"findAfter":N.CONTINUE_FUNCTION(function(node,filter){ 
				node = N.findLite(node)[0];
				var index = N.node.index(node); 
				var result = []; 
				if(typeof index === "number") {
					switch(typeof filter) {
						case 'string':
							for(var i=index+1,l=node.parentNode.children.length;i<l;i++){
								var fnode = node.parentNode.children[i];
								N.node.is(fnode,filter) && result.push(fnode);
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
			"findParent" :N.CONTINUE_FUNCTION(function(el,require,index){
				if( (typeof require === 'number') || ((typeof require === 'string') && (typeof index === 'number')) ) return N.dataFirst(N.findParents(el,require,index));
				var node = N.findLite(el)[0];
				if(node) {
					if(typeof require === "string"){
						var parents = N.NODEKIT.parents(node);
						for(var i in parents) if( N.NODEKIT.is(parents[i],require) ) return parents[i];
					} else {
						return node.parentElement;
					}
				}
				return undefined;
			},1),
			"findDocument":N.CONTINUE_FUNCTION(function(iframeNode){
				var iframe = N.findLite(iframeNode)[0];
				if(iframe) {
					if(iframe.tagName == "IFRAME") return iframe.contentDocument || iframe.contentWindow.document;
					if(N.isDocument(iframe)) return iframe;
				} else {
					console.warn('iframe을 찾을 수 없습니다.',iframeNode);
				}
			},1),
			//
			"findTree":N.CONTINUE_FUNCTION(function(node,stringify){
				var treeNode = N.findLite(node)[0];
				if(!treeNode) return [];
				var tree = N.findParents(treeNode,N.dataMap,function(){ return (stringify === true ? N.node.trace(this) : this ); });
				tree.reverse();
				tree.push( (stringify === true ? N.node.trace(treeNode) : treeNode ) );
				return tree;
			},1),
			"inside":N.CONTINUE_FUNCTION(function(node,target){
				var inside = N.findLite(node);
				if(!inside.length) return false; 
				return N.find(target,node).length ? true : false;
			},1),
			"outside":N.CONTINUE_FUNCTION(function(node,target){
				var insideNode = N.findLite(target);
				return insideNode.length ? (N.find(node,insideNode).length ? false : true) : true;
			},1),
			"findOffset" :function(node,target,debug){
				var node = N.findLite(node)[0];
				if(node) {
					var l=t=0,w=node.offsetWidth,h=node.offsetHeight;
					target = N.findLite(target)[0] || document.body;
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
		N.FINDKIT.EACH_TO_METHOD();
	
		N.SINGLETON("MAKEKIT",{
			"create" :function(name,attrValue,parent){
				var element,skipRender,name=(typeof name !== "string") ? "div" : name.trim();
				//nf foundation
				name = name.replace(/\[\[[\w\-\=\s]+\]\]/ig,function(s){ 
					s = s.substr(2,s.length-4);
					var pipeIndex = s.indexOf('=');
					//[[key=]]
					if((s.length - 1) === pipeIndex) return '[nd-' + s.substring(0,s.length - 1) + ']';
					//[[key]], [[key=value]]
					return (pipeIndex > 0) ? '[nd-'+s.substr(0,pipeIndex)+'='+s.substr(pipeIndex+1)+']' : '[nd-val='+s+']';
				});
				var dataset,htmlvalue,cacheName=name,cacheEnable=false;
			
				//attr 최적화 작업
				//데이터셋과 HTML은 N.create에서 스스로 처리
				switch(typeof attrValue){
					case "object":
						if("dataset" in attrValue){
							dataset   = attrValue["dataset"];
							attrValue = N.clone(attrValue);
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
						if(N.isNothing(attrValue)){ 
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
						console.warn("N.create의 두번째 값은 글자나 오브젝트입니다. 들어온 값 ->",attrValue);
						cacheEnable = true;
						attrValue   = undefined;
						break;
				}
			
				//성능향상을 위한 캐시
				if(cacheEnable){
					var cacheNode = N.cache.get("N.create",cacheName);
					if(cacheNode) {
						element    = N.cloneNodes(cacheNode)[0];
						skipRender = true;
					}
				}
			
				//랜더링 시작
				if(!skipRender){
					element = N.parseHTML( (name.indexOf("<") !== 0) ? N.parseTag(name,attrValue) : name )[0];
					//캐시 저장
					if(cacheEnable) N.cache.set("N.create",cacheName,N.cloneNodes(element)[0]);
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
				parent = N.findLite(parent)[0];
				if(parent){
					if(parent==W.document) parent = W.document.getElementsByTagName("body")[0];
					parent.appendChild(element);
				}
				return element;	
			},
			//get text node element
			"makeText":N.CONTINUE_FUNCTION(function(t){ return W.document.createTextNode(t); },1),
			"make":N.CONTINUE_FUNCTION(function(name,attr,third){
				if ( N.isArray(attr) || N.isNode(attr) || N.isTextNode(attr) ) {
					var createNode = N.create(name);
					N.node.append(createNode,new N.Array(arguments).setSubarr(1).setFlatten().toArray());
					return createNode;
				} else if(N.isNode(third) || N.isTextNode(third)){
					var createNode = N.create(name, attr);
					N.node.append(createNode,new N.Array(arguments).setSubarr(2).setFlatten().toArray());
					return createNode;
				} else {
					return N.create(name, attr);
				}	
			},1),
			"makes":N.CONTINUE_FUNCTION(function(fulltag,root){
				if(typeof fulltag !== "string" || !fulltag) return [];
				
				var makeRoot    = N.make('div');
				var hasTemplate = (fulltag.toLowerCase().indexOf("template") > -1)?true:false;
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
				
				var multiMake    = N.safeSplit(currentTag,"+","{}");
				var multiMakeEnd = multiMake.length-1;
				
				N.dataEach(multiMake,function(eachtag,eachTagIndex){
					///////////////
					var repeat = 1;
					//get repeat value
					eachtag = eachtag.replace(/\*[\d]+$/,function(s){
						repeat = parseInt(s.substr(1)); return "";
					});
					
					//get $value
					eachtag = (eachtag+" ").replace(/\$[^i]/,function(s){ return "\\{$i+1}"; });
					
					//var nodyExp = eachtag
					var hasExp = (eachtag.indexOf("\\{") > -1) ? true : false;
					
					//generate
					N.times(repeat,function(i){
						var rtag     = hasExp ? N.exp.seed(i)(eachtag) : eachtag;
						var rtagNode = N.make(rtag);
					
						makeRoot.appendChild(rtagNode);
					
						if(eachTagIndex == multiMakeEnd) {
							if(nextTag.length > 0) N.makes(nextTag,rtagNode);
							if(nextCursor){
								var findRoot = makeRoot;
								N.times(cursorDepth-1,function(){
									if(findRoot && findRoot.parentElement) {
										findRoot = findRoot.parentElement;
									} else {
										return false;
									}
								});
								if(findRoot) N.makes(nextCursor,findRoot);
							}
						}
					});
				});
				
				var makes = N.toArray(makeRoot.children);
				
				if(hasTemplate){
					N.dataEach(N.find("template",makeRoot),function(template){
						if(!("content" in template)) template.content = document.createDocumentFragment();
						N.dataEach(N.toArray(template.childNodes),function(childNode){
							template.content.appendChild(childNode);
						});
					});
				}
				
				if(root){
					var targetRoot = N.findLite(root)[0];
					if(targetRoot) for(var i=0,l=makes.length;i<l;i++) targetRoot.appendChild(makes[i]);
				}
				
				return makes;
			},1),
			"makeWrap":N.CONTINUE_FUNCTION(function(wrapper,target,targetParent){
				var wrapNode     = N.make(wrapper);
				var targetNodes  = N.find(target,targetParent);
				if(targetNodes[0] && targetNodes[0].parentElement) {
					N.node.before(targetNodes[0],wrapNode);
				}
				N.node.append(wrapNode,targetNodes);
				return wrapNode;
			},1),
			// 각 arguments에 수치를 넣으면 colgroup > col, col... 의 width값이 대입된다.
			"makeCol":function(){ 
				return N.make('colgroup', N.dataMap(arguments,function(arg){
						return N.create('col', (/^\d/.test(arg)) ? {width:arg} : {'class':arg});
				}) );
			},
			"makeTemplate":function(innerHTML,id){
				var temphtml = (typeof id === "string") ? ('<template id="' + id + '">') : '<template>' ;
					temphtml += innerHTML;
					temphtml += '</template>';
				return N.parseHTML(temphtml)[0];
			},
			"makeImg":function(src,width){
				if(typeof src === 'string') {
					var param = {src:src};
					if(width) param.style =  'width:'+ N.toPx(width)+';'
					return N.make('img',param);
				} else if (N.isNode(src)){
					if(src.files && src.files[0]){
						if (!src.files[0].type.match(/image.*/)) return;
						var result = N.make('img');
						var reader = new FileReader();
						reader.onload = function(e){
							result.src = e.target.result;
						};
						reader.readAsDataURL(src.files[0]); 
						return result;
					}
				}
			},
			"makeCanvas":function(width,height,render){
				var canvas = document.createElement("canvas");
				canvas.setAttribute("width",width?width:"auto");
				canvas.setAttribute("height",height?height:"auto");
			
				function srcToCanvasRender(src){
					var img = document.createElement('img');
					img.onload = function() {  canvas.getContext("2d").drawImage(this, 0, 0,width,height); }
					img.src = src;
				}
			
				if( N.isNode(render) ) {
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
				else N.CALL(render,canvas,canvas.getContext("2d"));
				return canvas;
			},
			//노드 배열을 복사함
			"cloneNodes":function(node){
				return N.dataMap(N.findLite(node),function(findNode){ return findNode.cloneNode(findNode,true); });
			},
			"importNodes":function(node){
				if(typeof node === "string") {
					node = node.trim();
					if(/^<.+>$/.test(node)){
						node = N.parseHTML(node);
					} else if(/^\#[\w\-]+$/.test(node)) {
						node = N.findLite(node);
					} else {
						node = N.makes(node);
					}
				}
				var result=[], targetNodes=N.findLite(node);
				if( targetNodes.length === 0){
					console.warn("importNodes::복사할 노드를 찾을 수 없습니다.",node);
					return result;
				}
				N.dataEach(targetNodes,function(target){
					if('content' in target) {
						N.dataEach( document.importNode(target.content,true).childNodes, function(oneNode){
							result.push(oneNode); 
						});
					} else {
						result.push(target.cloneNode(true));
					}
				});
				return N.findLite(result);
			},
			"makeSampleNode":function(node,rootExp){
				var result, importSample = N.importNodes(node);
				if(importSample.length === 1){
					result = importSample[0];
				} else if(importSample.length > 1) {
					var newRoot = N.make(rootExp);
					for(var i=0,l=importSample.length;i<l;i++) newRoot.appendChild(importSample[i]);
					result = newRoot;
				}
				return result ? (typeof rootExp === "string") ? 
							    N.pushCSSExpression(result,rootExp) : 
							    result : 
				console.warn("makeSampleNode::no result from",node) ;
			},
			"cloneObject":function(inv){ 
				if(typeof inv === "object"){ var result = {}; for(var k in inv) result[k] = inv[k]; return result; } return N.toObject(inv); 
			}
		})
		N.MAKEKIT.EACH_TO_METHOD();
	
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
		
		var APPEND_OR_INSERTBEFORE = function(parent,appendNode,index){
			if(typeof index === "number" && parent.children[index]){
				parent.insertBefore(appendNode,parent.children[index]);
			} else {
				parent.appendChild(appendNode);
			}
		};
		var ELKIT = {
			//포커스 상태인지 검사합니다.
			"hasFocus":function(sel){ return document.activeElement == N.findLite(sel)[0]; },
			//케럿을 움직일수 있는 상태인지 검새합니다.
			"caretPossible":function(sel){ var node = N.findLite(sel)[0]; if( N.node.hasFocus(node) == true) if(node.contentEditable == true || window.getSelection || document.selection) return true; return false; },
			"caretPosition":function(e){ var t,n,a,o,r,c=0,l=0;return"number"==typeof e.selectionStart&&"number"==typeof e.selectionEnd?(c=e.selectionStart,l=e.selectionEnd):(n=document.selection.createRange(),n&&n.parentElement()==e&&(o=e.value.length,t=e.value.replace(/\r\n/g,"\n"),a=e.createTextRange(),a.moveToBookmark(n.getBookmark()),r=e.createTextRange(),r.collapse(!1),a.compareEndPoints("StartToEnd",r)>-1?c=l=o:(c=-a.moveStart("character",-o),c+=t.slice(0,c).split("\n").length-1,a.compareEndPoints("EndToEnd",r)>-1?l=o:(l=-a.moveEnd("character",-o),l+=t.slice(0,l).split("\n").length-1)))),{start:c,end:l}},
			//어트리뷰트값을 읽거나 변경합니다.
			"attr":function(sel,v1,v2){ var node = N.findLite(sel)[0]; if(node) return N.NODEKIT.attr.apply(undefined,[node].concat(Array.prototype.slice.call(arguments,1))); },
			//css스타일로 el의 상태를 확인합니다.
			"is":function(sel,value){ var node = N.findLite(sel)[0]; if(node)return N.NODEKIT.is(node,value); },
			//선택한 element중 대상만 남깁니다.
			"filter":function(sel,filter){
				var targets = N.findLite(sel);
				if(typeof filter !== "string") {
					console.warn("N.node.filter는 string filter만 대응합니다.");
					return targets;
				} else {
					var result  = [];
					for(var i=0,l=targets.length;i<l;i++) if(N.node.is(targets[i],filter)) result.push(targets[i]);
					return result;
				}
			},
			"content":function(contentNode,setValue){
				//get
				if(arguments.length < 2){
					var node = N.findLite(contentNode)[0];
					return node ? (node.textContent || node.innerText) : undefined;
				}
				//set
				return N.dataEach(N.findLite(contentNode),function(node){
					if('textContent' in node){
						node.textContent = setValue + '';
					} else {
						node.innerText   = setValue + '';
					}
				});
			},
			"text":function(node,setValue){
				return ELKIT.content.apply(ELKIT,Array.prototype.slice.call(arguments));
			},
			//element value or text change
			"value":function(aNode,value,htmlContent){
				var node,nodes = N.findLite(aNode);
				
				if(nodes.length == 0){
					return;
				} else if(nodes.length > 1){
					var nodeZero     = nodes[0];
					var nodeZeroName = N.node.attr(nodeZero,"name");
					// radio group
					if(N.node.attr(nodeZero,"type") == "radio"){
						//read write
						if(!N.isNothing(nodeZeroName)){
							if(N.likeString(value)){
								var findEl = N.find(N.node.filter(nodes,"[type=radio][name="+nodeZeroName+"]::"+value,0));
								if(findEl) findEl.checked = true;
								return findEl;
							} else {
								return N.find(N.node.filter(nodes,"[type=radio][name="+nodeZeroName+"]:checked"),0) || "";
							}
						}
					}
				}
				node     = N.dataFirst(nodes);
				nodeName = node.tagName.toLowerCase();
				
				switch(nodeName){
					case "img" :if(arguments.length < 2) return node.src; node.src = value; return node; break;
					case "link":if(arguments.length < 2) return node.rel; node.rel = value; return node; break;
					case "script":
						var type = node.getAttribute("type");
						//json data
						if(typeof type === "string") if(type.indexOf("json") > -1) {
							if(arguments.length < 2) 
								return N.toObject(N.node.content(node)); 
							return N.node.content(node,N.toString(value));
						}
						if(arguments.length < 2) return node.src; node.src = value; return node;
						break;
					case "input": case "option": case "textarea":
						//get
						if(nodeName == "option"){
							var selNode = N.NODEKIT.query(":selected",node);
							if( N.isNode(selNode) ) return selNode.value;
							return node.value;
						} else {
							if(typeof value === "undefined") return node.value;
						}
						//set
						var setVal = value+"";
						
						// todo
						//if( ELKIT.caretPossible(node) ) {
						//	var gap = node.value.length - value.length;
						//	var cur = ELKIT.caretPosition(node).start;
						//	node.value = value;
						//	ELCARET(node,cur-gap)
						//	return node;
						//} else {
							// alt
							node.value = value;
							return node;
						//}
						break;
					case "select":
						if(typeof value === "undefined") return node.value;
						var valEl = N.find("[value="+ value +"]",node);
						if(valEl.length > 0) {
							var selEl = N.dataFirst(valEl);
							selEl.selected = true;
							return selEl;
						}
						return false;
						break;
					default :
						if(arguments.length < 2){
							return htmlContent === true ? N.node.content(node) : node.innerHTML;
						} else {
							if(htmlContent === true){
								node.innerHTML = value;
							} else {
								N.node.content(node,value);
							}
						}						
					break;
				}
				return node;
			},
			"unique":function(sel,root){
				return N.find(sel,root,N.dataEach,function(node){
					if(!N.node.hasAttr(node,"id")) node.setAttribute("id",N.RANDKIT.base26UniqueRandom(8,'uq'));
				});
			},
			"uniqueID":function(sel,root){
				var node = N.find(sel,root,0);
				if(node){
					N.node.unique(node);
					return node.getAttribute("id");
				} 
			},
			//get css style tag info
			"trace"   :function(target,detail){
				var t = N.findLite(target)[0];
				if( t ){
					var tag = t.tagName.toLowerCase();
					var tid = tclass = tname = tattr = tvalue = '';
					N.propEach(N.NODEKIT.attr(t),function(value,sign){
						switch(sign){
							case "id"   : 
								var id = t.getAttribute(sign); 
								id.length && (tid='#'+id) ; 
								break;
							case "class": 
								tclass = t.getAttribute(sign).trim().replace(/\s\s/g,' ').split(' ').join('.'); 
								if(tclass) tclass = "." + tclass;
								break;
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
							var tv = N.node.value(t);
							if(typeof tv !== undefined || tv !== null ) if(typeof tv === 'string' && tv.length !== 0) tvalue = '::'+tv;
							if(typeof tvalue === 'string') tvalue = tvalue.trim();
						}
					
					}
					return tag+tid+tclass+tname+tattr+tvalue;
				} else {
					console.warn("N.node.trace::target is not element or selector // target =>",target);
				}
			},
			"index":function(el){
				var node = N.findLite(el)[0];
				var parent = N.findParent(node);
				if(parent) return N.dataIndex(parent.children,node);
			},
			"append":function(parentIn,childs,needIndex){
				var parent = N.findLite(parentIn)[0];
				if(!N.isNode(parent)) return parentIn;
				var appendTarget  = N.findLite(childs);
				var parentTagName = parent.tagName.toLowerCase();
				var insertVariant = (typeof needIndex === "number") ? true : false;
				var targetIndex   = typeof needIndex === "number" ? needIndex < 0 ? 0 : needIndex : needIndex;
				
				for(var i=0,l=appendTarget.length;i<l;i++)
					if (N.isNode(appendTarget[i])) {
						switch(parentTagName){
						case "table":
							var tagName = appendTarget[i].tagName.toLowerCase();
							switch(tagName){
								case "colgroup": case "tbody": case "thead": case "tfoot":
									APPEND_OR_INSERTBEFORE(parent,appendTarget[i],insertVariant?targetIndex++:undefined);
									break;
								case "tr": case "td": case "th": default:
									window.tb = parent.tBodies;
									//tbody가 존재하지 않는 테이블이면 tbodies를 임의로 추가한다
									if(!parent.tBodies.length){ 
										if(!!parent.tFoot){
											parent.appendChild(N.create("tbody")) ;
										} else {
											parent.insertBefore(N.create("tbody"),parent.tFoot);
										}
									}
									var tbody = parent.tBodies[parent.tBodies.length - 1];									
									if(tagName == "tr"){
										APPEND_OR_INSERTBEFORE(tbody,appendTarget[i],insertVariant?targetIndex++:undefined);
									} else {
										//td th else
										var tr = tbody.insertRow( tbody.children.length );
										switch(tagName){
											case "td": case "th":
												APPEND_OR_INSERTBEFORE(tr,appendTarget[i],insertVariant?targetIndex++:undefined);
												break;
											default:
												//else
												var td = N.create("td");
												tr.appendChild(td);
												APPEND_OR_INSERTBEFORE(td,appendTarget[i],insertVariant?targetIndex++:undefined);
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
									APPEND_OR_INSERTBEFORE(parent,appendTarget[i],insertVariant?targetIndex++:undefined);
									break;
								default   :
									var td = N.create("td");
									parent.appendChild(td);
									APPEND_OR_INSERTBEFORE(td,appendTarget[i],insertVariant?targetIndex++:undefined);
									break;
							}
							break;
						default:
							APPEND_OR_INSERTBEFORE(parent,appendTarget[i],insertVariant?targetIndex++:undefined);
							break;
					} 
				} else if(N.isTextNode(appendTarget[i])){
					APPEND_OR_INSERTBEFORE(parent,appendTarget[i],insertVariant?targetIndex++:undefined);
				} else {
					//append faild
					console.warn("N.node.append :: 추가하려는 요소는 Element요소여야 합니다.",appendTarget[i])
				}
				return parent;
			},
			"prepend":function(parentIn,childs){
				var parent = N.findLite(parentIn)[0];
				var appendTarget = N.findLite(childs);
				if(N.isOk(parent),N.isOk(appendTarget)){
					N.node.append(parent,appendTarget);
					var newParent = N.findParent(appendTarget[0]);
					if(newParent) {
						N.dataEach(appendTarget,function(node,i){
							newParent.insertBefore(node,newParent.childNodes[i]);
						});
					}
				}
			},
			"appendTo":function(targets,parentEL){ 
				var appendTargets=N.findLite(targets);
				N.node.append(N.findLite(parentEL)[0],appendTargets);
				return appendTargets;
			},
			"prependTo":function(targets,parentEL){ 
				var appendTargets=N.findLite(targets);
				return N.node.prepend(N.findLite(parentEL)[0],appendTargets); 
				return appendTargets;
			},
			"require":function(parent,target,needIndex){
				var parent = N.findLite(parent)[0];
				if(!parent) return target;
				var findTargets = N.findOn(parent,target);
				if(findTargets.length > 1) console.warn('require::require target must be single, please more specific select');
				if(findTargets.length > 0) return findTargets[0];
				var makes = N.makes(target);
				N.node.append(parent,makes,needIndex);
				return (makes.length > 1) ? makes : makes[0];
			},
			"css":function(sel,exp){
				if(!sel || typeof exp !== "string") return N.find(sel);
				return N.find(sel,N.dataEach,function(node){
					N.pushCSSExpression(node,exp);
				});
			},
			"insertAfter":N.CONTINUE_FUNCTION(function(node,appendNodes){ 
				var target = N.findLite(node)[0];
				if(!target) return;
				if(!target.parentElement) return;
				var appendTargets = N.findLite(appendNodes);
				if(!appendTargets.length) return;
				var targetIndex = ELKIT.index(target);
				ELKIT.append(target.parentElement,appendTargets,targetIndex+1);
			},2),
			"insertBefore":N.CONTINUE_FUNCTION(function(node,appendNodes){ 
				var target = N.findLite(node)[0];
				if(!target) return;
				if(!target.parentElement) return;
				var appendTargets = N.findLite(appendNodes);
				if(!appendTargets.length) return;
				var targetIndex = ELKIT.index(target);
				ELKIT.append(target.parentElement,appendTargets,targetIndex-1);
			},2),
			//이후 엘리먼트를 찾습니다.
			"after" :N.CONTINUE_FUNCTION(function(target,appendNodes){ 
				target = N.findLite(target)[0];
				if(!N.isNode(target))    return target; 
				if(arguments.length < 2) return N.findMember(target,1);
				ELKIT.insertAfter(target,appendNodes);
				return target;
			},1),
			//이전 엘리먼트를 찾습니다.
			"before":N.CONTINUE_FUNCTION(function(node,appendNodes){ 
				var target = N.findLite(node)[0];
				if(!N.isNode(target)) return node;
				if(arguments.length < 2) return N.findMember(target,-1);
				ELKIT.insertBefore(target,appendNodes);
				return target; 
			},1),
			//대상과 대상의 엘리먼트를 바꿔치기함
			"change":N.CONTINUE_FUNCTION(function(left,right){
				left  = N.findLite(left)[0];
				right = N.findLite(right)[0];
				if(left && right ){
					var lp = left.parentNode;
					var rp = right.parentNode;
					if(lp || rp){
						if(lp){
							var lplace = N.make("div");
							ELKIT.insertBefore(left,lplace);
						}
						if(rp){
							var rplace = N.make("div");
							ELKIT.insertBefore(right,rplace);
						}
						if(lplace){
							ELKIT.insertBefore(lplace,right);
							ELKIT.remove(lplace);
						}
						if(rplace){
							ELKIT.insertBefore(rplace,left);
							ELKIT.remove(rplace);
						}
					} else {
						console.warn("node::can't change node",left,lp,right,rp);
					}
				} else {
					console.warn("not found",left,right);
				}
				return [left,right];
			},1),
			"replace":function(target,replaceNode){
				var replaceTarget = N.findLite(replaceNode)[0];
				N.node.after(target,replaceTarget);
				N.node.remove(target);
				return replaceTarget;
			},
			//같은 위치상의 엘리먼트를 위로 올립니다.
			"up"   : function(target){if(!N.isNode(target))return target;var parent=target.parentNode;if(!N.isNode(parent))return target;var prev=target.previousSibling;if(!N.isNode(prev))return target;N.node.before(prev,target);},
			//같은 위치상의 엘리먼트를 아랠로 내립니다.
			"down" : function(target){if(!N.isNode(target))return target;var parent=target.parentNode;if(!N.isNode(parent))return target;var next=target.nextSibling;if(!N.isNode(next))return target;N.node.after(next,target);},
			//스타일을 얻어냅니다.
			"style": function(targets,styleName,value){
				//get
				if(arguments.length < 3){
					var node = N.findLite(targets)[0];
					if(node){
						return N.NODEKIT.style(node,styleName);
					}
				} else {
					return N.dataEach(N.findLite(targets),function(node){ N.NODEKIT.style(node,styleName,value); });
				}
			},
			//내무의 내용을 지웁니다.
			"empty"  : function(target){ return N.find(target,N.dataMap,function(node){ if("innerHTML" in node) node.innerHTML = ""; return node; }); },
			//대상 객체를 제거합니다.
			"remove" : function(node,childs){ var target = N.findLite(node)[0]; if(!N.isNode(target)) return target; if(!N.isNode(target.parentNode)) return target; target.parentNode.removeChild(target); return target; },
			//케럿의 위치를 찾습니다.
			"CARET":function(select,pos){
				//
				var node = N.findLite(select)[0];
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
						ran      = node.createTextRange(),
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
			"trigger":function(node,eventName,eventParam){
				if(N.isWindow(node)){
					node = W;
				} else {
					node = N.findLite(node)[0];
					if(N.isNothing(node)) throw new Error("N.node.trigger는 element를 찾을수 없습니다. => 들어온값" + N.tos(node));
				}
				var e;
				if ("createEvent" in document) {
				    e = W.document.createEvent("HTMLEvents");
				    e.initEvent(eventName, true, true);
				} else {
					e = {};
				}
				if(eventParam) N.propEach(eventParam,function(v,k){ e[k] = v; });
			    node.dispatchEvent(e);
				return node;
			},
			//이벤트 등록이 가능한 타겟을 찾아냅니다.
			"onTarget":function(node){ return (N.isWindow(node) || N.isDocument(node)) ? node : N.findLite(node); },
			//add event like jquery 
			"on":function(node, eventName, eventHandler, useCapture){
				var nodes  = N.node.onTarget(node);
				var events = eventName.split(" ");
				
				if(typeof arguments[1] === "string" && typeof arguments[2] === "function"){
					//direct event
					N.dataEach(nodes,function(eventNode){
						N.dataEach(events,function(event){
							eventNode.addEventListener(event, eventHandler, useCapture==true ? true : false); 
						});
					});
				} else if(typeof arguments[1] === "string" && typeof arguments[2] === "string" && typeof arguments[3] === "function"){
					var delegateTarget = arguments[2],
						eventHandler   = arguments[3],
						useCapture     = arguments[4];
					//delegate event
					N.dataEach(nodes,function(eventNode){
						N.dataEach(events,function(event){
							eventNode.addEventListener(event, function(e){
								var delegateNodes = N.find(delegateTarget,eventNode);
								N.dataEach(delegateNodes,function(delegateNode){
									if(N.inside(delegateNode,e.target)){
										e['delegateTarget'] = delegateNode;
										eventHandler.call(delegateNode,e);
										return false;
									}
								});
							}, useCapture==true ? true : false); 
						});
					});
				} else {
					//error
					if((typeof eventName !== "string") || (typeof eventHandler !== "function")){
						console.error("N.node.on 노드 , 이벤트이름, 이벤트헨들러 순으로 파라메터를 입력하세요");
						console.error("N.node.on ::",arguments);
					} 
				}
				return nodes;
			},
			//bind touch event
			"punch":function(node, eventName){
				var onTargets = N.node.onTarget(node);
				N.node.on.apply(N.node,[onTargets].concat(Array.prototype.slice.call(arguments,1)));
				if(!('ontouchend' in document)) return onTargets;
				
				if(N.isDocument(onTargets) || onTargets.length){
					N.dataEach(eventName.split(" "),function(mousename){
						var bindnames = mousename === "mousedown" ? ["touchstart"] :
									    mousename === "mouseup"   ? ["touchend","touchcancle"]   :
									    mousename === "mousemove" ? ["touchmove"]  :
									    mousename === "mouseout"  ? ["touchleave"] : null;
						if(bindnames) {
							N.dataEach(onTargets,function(target){
								N.dataEach(bindnames,function(bindEventName){
									target.addEventListener(bindEventName,function(event){
					                    //1개의 터치만 지원
					                    //if(event.touches.length !== || (!event.touches.length && bindnames !== "touchend")){return;}
					                    var newEvent      = document.createEvent("MouseEvents");
					                    var changedTouche = event.changedTouches[0];
                    
					                    newEvent.initMouseEvent(
					                        mousename,
					                        true,
					                        true,
					                        null,
					                        null,
					                        changedTouche.screenX,
					                        changedTouche.screenY,
					                        changedTouche.clientX,
					                        changedTouche.clientY
					                    );
										newEvent.touches = event.touches;
					                    target.dispatchEvent(newEvent);
					                });
								});
							});
						}
					});
				}
			},
			"off":function(node, eventName, eventHandler, useCapture){
				if((typeof eventName !== "string") || (typeof eventHandler !== "function")) return console.error("N.node.on 노드 , 이벤트이름, 이벤트헨들러 순으로 파라메터를 입력하세요",node, eventName, eventHandler);
				var nodes  = N.node.onTarget(node);
				var events = eventName.split(" ");
				N.dataEach(nodes,function(eventNode){
					N.dataEach(events,function(event){
						eventNode.removeEventListener(event, eventHandler, useCapture==true ? true : false); 
					});
				});
				return nodes;
			},
			//한번만 발생하는 이벤트입니다.
			"onetime":function(node, eventName, eventHandler, time){
				if(typeof eventHandler === "function"){
					console.error("ELTIME:: eventHandler는 만드시 존재해야 합니다");
				} else {
					var timeManager = (function(time){ this.time = time; })( isNaN(time) ? 1 : parseInt(time) );
					timeManager.events = eventName.split(" ");
					timeManager.handler = function(e){
						if(timeManager.time > 0){
							timeCounter.time = timeCounter.time - 1;
							N.CALL(handler,node,e);
						}
						if(timeManager.time < 1){
							for(var i=0,l=this.events.length;i<l;i++) N.node.off(node,events[i],timeCounter.handler)
						}
					};
					for(var i=0,l=this.events.length;i<l;i++) N.node.on(node,eventName,timeManager.handler);
				}
				return node;
			},
			"data":function(node,key,value){
				var nodes = N.findLite(node);
				if(nodes.length == 0) return undefined;
				if(arguments.length == 1) return N.clone(N.dataFirst(nodes).dataset);
				if(arguments.length == 2) return N.dataFirst(nodes).dataset[nd.camelCase(key)];
				if(arguments.length == 3) { 
					key = nd.camelCase(key);
					N.dataEach(nodes,function(node){ node.dataset[key] = value; }); return nodes; 
				}
			},
			//Disabled
			"disabled":function(node,status){
				var elf = new N.Array(N.findLite(node));
				if( elf.isNone() ){
					console.error("N.node.disabled:: node를 찾을수 없습니다. => 들어온값" + N.tos(node));
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
			"readOnly":function(node,status){
				var elf = new N.Array(N.findLite(node));
				if( elf.isNone() ){
					console.error("N.node.readOnly:: node를 찾을수 없습니다. => 들어온값" + N.tos(node));
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
			"CommonString":new N.StringSource(),
			"addAttr":function(node,attrName,attrValue){
				var findNodes = N.findLite(node);
				if(typeof attrValue !== "attrName" && typeof attrValue !== "string") return findNodes;
				for(var i=0,l=findNodes.length;i<l;i++) findNodes[i].setAttribute(attrName,ELKIT.CommonString.set(findNodes[i].getAttribute(attrName)).addModel(attrValue));
				return findNodes;
			},
			"hasAttr":function(node,attrName,attrValue){
				var findNodes = N.findLite(node);
				if(arguments.length === 2) {
					for(var i=0,l=findNodes.length;i<l;i++) if( findNodes[i].getAttribute(attrName) ) return true;
					return false;
				}
				if(typeof attrValue !== "string") return false;
				for(var i=0,l=findNodes.length;i<l;i++) if( !ELKIT.CommonString.set(findNodes[i].getAttribute(attrName)).hasModel(attrValue) ) {
					return false;
				}
				return true;
			},
			"removeAttr":function(node,attrName,attrValue){
				var findNodes = N.findLite(node);
				if(typeof attrName !== "string" && typeof removeClass !== "string") return findNodes;
				for(var i=0,l=findNodes.length;i<l;i++) {
					var didRemoveClassText = ELKIT.CommonString.set(
						findNodes[i].getAttribute(attrName)
					).setRemoveModel(attrValue).trim();
					if( !didRemoveClassText.length ) {
						findNodes[i].removeAttribute(attrName);
					} else {
						findNodes[i].setAttribute(attrName,didRemoveClassText);
					}
				} 
				return findNodes;
			},
			"addClass":function(node,addClass){	
				return ELKIT.addAttr(node,"class",addClass);
			},
			"hasClass":function(node,hasClass){
				return ELKIT.hasAttr(node,"class",hasClass);
			},
			"removeClass":function(node,removeClass){
				return ELKIT.removeAttr(node,"class",removeClass);
			},
			"html":function(node,html){
				var findNode = N.findLite(node)[0];
				if(!findNode) return undefined;
				if(typeof html === "string" || typeof html === "number"){
					return findNode.innerHTML = html;
				} else {
					return findNode.innerHTML;
				}
			},
			"appendHTML":function(node,html,needIndex){
				var findNode = N.findLite(node)[0];
				return findNode && N.node.append(findNode,N.parseHTML(html),needIndex);
			},
			"prependHTML":function(node,html){
				var findNode = N.findLite(node)[0];
				return findNode && N.node.prepend(findNode,N.parseHTML(html));
			},
			"put":function(sel){
				var node = N.findLite(sel)[0];
				if(!N.isNode(node)) return console.warn("N.node.put:: node를 찾을수 없습니다. => 들어온값",arguments);
				N.node.empty(node);
				var newContents = [];
				var params = Array.prototype.slice.call(arguments);
				params.shift();
				N.dataEach( N.argumentsFlatten(params) ,function(content){
					if(N.isNode(content)){
						newContents.push(content);
					} else if(/^<.+>$/.test(content)){
						newContents.push(N.parseHTML(content));
					} else {
						content = N.toString(content);
						switch(node.tagName){
							case "UL":case "MENU":
								newContents.push(N.make("li",content));
								break;
							case "DL":
								newContents.push(N.make("dd",content));
								break;
							default:
								newContents.push(N.make("span",content));
								break;	
						}
					}
				});
				N.node.append(node,newContents);
				return node;
			},
			"toggleClass":function(el,toggleName,flag){
				var nodes = N.findLite(el);
				if(typeof toggleName !== 'string') return nodes;
				
				if(flag===undefined) {
					return N.dataEach(nodes,function(node){
						N.node.hasClass(node,toggleName) ? N.node.removeClass(node,toggleName) : N.node.addClass(node,toggleName);
					});
				}
				if(N.isArray(flag)) flag = flag.join(" ");
				
				if(typeof flag === "string") {
					N.node.removeClass(el,flag);
					N.node.addClass(el,toggleName);
				}
				
				return flag ? N.node.addClass(el,toggleName) : N.node.removeClass(el,toggleName);
			},
			"coords":function(nodes,coordinate,insertAbsolute,offsetX,offsetY,scale){
				var findNode = N.findLite(nodes,0);
				if(findNode && (typeof coordinate == "string")) {
					scale = (typeof scale === 'number') ? scale : 1;
				
					var coordinateData = [];
					coordinate.replace(/(-|)\d+/g,function(s){ coordinateData.push(s); });
					N.dataEach(coordinateData,function(v,i){
						var styleName;
						switch(i){
							case 0:styleName='left';break;
							case 1:styleName='top';break;
							case 2:styleName='width';break;
							case 3:styleName='height';break;
							default:return false;break;
						}
						var styleValue = (N.toNumber(v)*scale);
						switch(i){
							case 0:styleValue += N.toNumber(offsetX);break;
							case 1:styleValue += N.toNumber(offsetY);break;
						}
						N.node.style(findNode,styleName,styleValue+"px");
					});
					switch(insertAbsolute) {
						case true :
						case 'absolute':
							N.node.style(findNode,'position','absolute');
							break;
						case 'relative':
							N.node.style(findNode,'position','relative');
							break;
					}
				}
				return nodes;
			}
		};
	
		N.EXTEND_MODULE("Array","NodeHandler",{
			find:function(query){ 
				return new N.NodeHandler(N.find.apply(undefined,[query,this].concat(Array.prototype.slice.call(arguments,1)))); 
			},
			parent:function(query){ 
				return new N.NodeHandler(N.findParent.apply(undefined,[this].concat(Array.prototype.slice.call(arguments)))); 
			},
			parents:function(query){ 
				return new N.NodeHandler(N.findParents.apply(undefined,[this].concat(Array.prototype.slice.call(arguments)))); 
			},
			children:function(query){ 
				return new N.NodeHandler(N.findOn(this,query)); 
			},
			hasFocus:function(){ return ELKIT.hasFocus(this); },
			caretPossible:function(){ return ELKIT.caretPossible(this); },
			attr:function(name){ 
				if(arguments.length > 1){
					N.FLATTENCALL(ELKIT.attr,undefined,this,arguments);
					return this;
				} else {
					if(arguments.length == 0) return N.CALL(ELKIT.attr,undefined,this);
					return N.CALL(ELKIT.attr,undefined,this,name);
				}
			},
			addAttr:function(){
				N.FLATTENCALL(ELKIT.addAttr,ELKIT,this,arguments);
				return this;
			},
			removeAttr:function(){
				N.FLATTENCALL(ELKIT.removeAttr,ELKIT,this,arguments);
			},
			hasAttr:function(){ 
				N.FLATTENCALL(ELKIT.hasAttr,ELKIT,this,arguments);
			},
			addClass:function(className){ N.CALL(ELKIT.addClass,ELKIT,this,className);return this; },
			hasClass:function(className){ N.CALL(ELKIT.hasClass,ELKIT,this,className);return this; },
			removeClass:function(className){ N.CALL(ELKIT.removeClass,ELKIT,this,className);return this; },
			toggleClass:function(className,toggle){ N.CALL(ELKIT.toggleClass,ELKIT,this,className,toggle); return this; },
			is     :function(exp){
				return ELKIT.is(this,exp); 
			},
			filter :function(f){ 
				if(typeof f === "function"){
					this.setSource(this._super(f));
				} else {
					this.setSource(N.FLATTENCALL(ELKIT.filter,ELKIT,this,arguments));
				}
				return this;
			},
			content:function(){
				return N.FLATTENCALL(ELKIT.content,ELKIT,this,arguments);
			},
			text:function(){
				return N.FLATTENCALL(ELKIT.text,ELKIT,this,arguments);
			},
			expval:function(exp){
				if(arguments.length > 0)
					N.CALL(ELKIT.value,ELKIT,this,N.exp.apply(undefined,Array.prototype.slice.call(arguments)));
			},
			value  :function(nodeValue){ 
				if(arguments.length > 0){
					N.CALL(ELKIT.value,ELKIT,this,nodeValue);
					return this;
				} else {
					return N.FLATTENCALL(ELKIT.value,ELKIT,this,arguments);
				}
			},
			prop:function(key,value){
				if(arguments.length > 0){
					this.each(function(){ this[key] = value; }); return this;
				} else {
					if(this[0]) return this[0][key];
				}
			},
			trace    :function(){ return N.FLATTENCALL(ELKIT.trace,ELKIT,this,arguments); },
			//index
			index:function(){ 
				return ELKIT.index(this);
			},
			append   :function(targets){ ELKIT.append(this,targets);return this; },
			prepend  :function(targets){ ELKIT.prepend(this,targets);return this; },
			appendTo :function(target){ N.CALL(ELKIT.appendTo,ELKIT,this,target); return this; },
			prependTo:function(target){ N.CALL(ELKIT.prependTo,ELKIT,this,target);return this; },
			put      :function(){ N.FLATTENCALL(ELKIT.put,ELKIT,this,arguments); return this; },
			putTo    :function(target){ N.CALL(ELKIT.put,ELKIT,target,this);; return this;},
			before   :function(){
				if(arguments.length > 0){
					N.FLATTENCALL(ELKIT.before,ELKIT,this,arguments);
					return this;
				} else {
					return N.CALL(ELKIT.before,ELKIT,this);
				}
			},
			after    :function(){
				if(arguments.length > 0){
					N.FLATTENCALL(ELKIT.after,ELKIT,this,arguments);
					return this;
				} else {
					return N.CALL(ELKIT.after,ELKIT,this);
				}
			},
			change:function(){
				var r = N.FLATTENCALL(ELKIT.change,ELKIT,this,arguments);
				this.setSource(r[1]);				
				return this;
			},
			beforeAll:function(){ return N.CALL(ELKIT.beforeAll,ELKIT,this); },
			afterAll :function(){ return N.CALL(ELKIT.afterAll,ELKIT,this); },
			replace  :function(){ N.FLATTENCALL(ELKIT.replace,ELKIT,this,arguments); return this;},
			up:function(){ return N.CALL(ELKIT.up,ELKIT,this); },
			down:function(){ return N.CALL(ELKIT.donw,ELKIT,this); },
			style:function(){ 
				return ELKIT.style.apply(ELKIT,[this].concat(Array.prototype.slice.call(arguments)));
			},
			require:function(){
				return new N.NodeHandler(ELKIT.require.apply(ELKIT,[this].concat(Array.prototype.slice.call(arguments))));
			},
			empty  :function(){ N.CALL(ELKIT.empty,ELKIT,this); return this; },
			remove :function(){ N.CALL(ELKIT.remove,ELKIT,this); return this; },
			caret  :function(){ N.FLATTENCALL(ELKIT.caret,ELKIT,this,arguments); },
			trigger:function(name){ N.CALL(ELKIT.trigger,ELKIT,this,name); return this; },
			on     :function(e,h,c,x){ 
				ELKIT.on.call(ELKIT,this,e,h,c,x); return this; },
			off    :function(e,h,c,x){ 
				ELKIT.off.call(ELKIT,this,e,h,c,x); return this; 
			},
			onetime:function(){ N.FLATTENCALL(ELKIT.onetime,ELKIT,this,arguments); return this; },
			data   :function(name){
				if(arguments.length > 1){
					N.FLATTENCALL(ELKIT.data,ELKIT,this,arguments);
					return this;
				} else {
					if(arguments.length == 0) return N.CALL(ELKIT.data,ELKIT,this);
					return N.CALL(ELKIT.data,ELKIT,this,name);
				}
			},
			html:function(html){
				var result = N.FLATTENCALL(ELKIT.html,ELKIT,this,arguments);
				return arguments.length ? this : result ;
			},
			appendHTML:function(html){
				N.FLATTENCALL(ELKIT.appendHTML,ELKIT,this,arguments);
				return this;
			},
			prependHTML:function(){
				N.FLATTENCALL(ELKIT.prependHTML,ELKIT,this,arguments);
				return this;
			},
			focus:function(){
				this.each(function(node){
					if(typeof node.focus === "function"){ return node.focus(); }
				});
				return this;
			},
			unique:function(){
				N.FLATTENCALL(ELKIT.unique,ELKIT,this,arguments);
				return this;
			},
			uniqueID:function(){
				return N.FLATTENCALL(ELKIT.uniqueID,ELKIT,this,arguments);
			},
			disabled:function(){ N.FLATTENCALL(ELKIT.disabled,ELKIT,this,arguments); return this; },
			readonly:function(){ N.FLATTENCALL(ELKIT.readOnly,ELKIT,this,arguments); return this; },
		},function(select,parent,i){
			this.setSource(N.find(select,parent,i));
		});
		
		N.METHOD("node",nd.NodeHandler.new);
		
		for(var key in ELKIT) N.node[key]=ELKIT[key];
		
		N.METHOD("makenode",function(makeParam,makeParam2){
			return new N.NodeHandler(N.make.apply(undefined,Array.prototype.slice.call(arguments)));
		});
		N.METHOD("makesAnd",function(makeParam,makeParam2){
			return new N.NodeHandler(N.makes.apply(undefined,Array.prototype.slice.call(arguments)));
		});
		
		//partial module
		//성능의 가속을 위해 존재하는 값들입니다.
		var PARTIAL_DATA_KEYS = ['dataset','val','href','put','display','for'];
		var PARTIAL_ATTR_KEYS = ["nd-dataset","nd-val","nd-href","nd-put","nd-display","nd-for"];
		var PARTIAL_SEL_KEYS  = ["[nd-dataset]","[nd-val]","[nd-href]","[nd-put]","[nd-display]","[nd-for]"];
		N.EXTEND_MODULE("NodeHandler","Partial",{
			findPartial:function(partialCase,partialKey){
				if(arguments.length === 0) return N.clone(this.__partialPointer);
				if(!(partialCase in this.__partialPointer)) 
					return console.error("NodeHandler::partial case가 존재하지 않습니다.",partialCase,this.__partialPointer);
				if(arguments.length === 1) return N.clone(this.__partialPointer[partialCase]);
				return new N.NodeHandler(this.__partialPointer[partialCase][partialKey]);
			},
			"for":function(key,proc){
				var ff = this.findPartial("for",key);
				return (typeof proc === "function") ? ff.each(proc) : ff;
			},
			val:function(key,value){
				if(arguments.length === 2){
					if(value !== undefined || value !== null){
						this.findPartial("val",key).each(function(node){
							return N.node.value(node,value);
						});
					}
					return this;
				} else {
					return this.findPartial("val",key).value();
				}
			},
			put:function(key,value){
				var puts = nd.findLite(value);
				if(!puts.length) return this;
				this.findPartial("put",key).each(function(node){
					return N.node.put(node,puts);
				})
				return this;
			},
			// 실제 노드의 키를 지우면서 실행함
			partialSetup:function(propKeys,callback,presets){
				var keys  = propKeys;
				var pKeys = (presets && presets.pKeys) ? presets.pKeys : (new N.Array(keys)).map(function(key){ return 'nd-'+key; });
				var sKeys = (presets && presets.sKeys) ? presets.sKeys : (new N.Array(pKeys)).map(function(pkey){ return '['+ pkey +']'; });
				var pNodes = this.find(sKeys.join(','));
				for(var i=0,l=pNodes.length;i<l;i++){
					for(var si=0,sl=sKeys.length;si<sl;si++){
						if(N.NODEKIT.the(pNodes[i],sKeys[si])) {
							callback(pNodes[i].getAttribute(pKeys[si]),pNodes[i],keys[si]);
							pNodes[i].removeAttribute(pKeys[si]);
						}
					}
				}
			},
			setPartialProperties:function(data,dataFilter){
				if(!data)data={};
				var pointer = this.__partialPointer;
				this.partialSetup(PARTIAL_DATA_KEYS,function(name,node,nodeAlias){
						if(!(nodeAlias in pointer)) pointer[nodeAlias] = {};
						name.replace(/\S+/g,function(s){
							if(!pointer[nodeAlias][s]) pointer[nodeAlias][s] = [];
							pointer[nodeAlias][s].push(node);
						});
					},{pKeys:PARTIAL_ATTR_KEYS,sKeys:PARTIAL_SEL_KEYS}
				);
			
				if(typeof dataFilter === 'object') {
					N.propEach(dataFilter,function(value,key){
						if(typeof value === 'function') {
							if( pointer.custom && (key in pointer.custom) ) {
								data[key] = value;
							} else {
								data[key] = value.call(data,data[key],key,data);
							}
						} else {
							data[key] = value;
						}
					});
				}
				
				//퍼포먼스 중심 코딩
				for(var partialCase in pointer) {
					for(var attrValue in pointer[partialCase]) {
						if(attrValue in data && data[attrValue] !== null) {
							var nodelist = pointer[partialCase][attrValue];
							for(var i=0,l=nodelist.length;i<l;i++) {
								var node = nodelist[i];
								switch(partialCase){
									case "val":N.node.value(node,data[attrValue]);break;
									case "html":node.innerHTML = data[attrValue];break;
									case "href" :node.setAttribute("href",data[attrValue]);break;
									case "class":N.node.addClass(node,data[attrValue]);break;
									case "put"    : N.node.put(node,data[attrValue]); break;
									case "display": if(!data[attrValue]){N.node.style(node,'display','none');}  break;
									case "dataset": N.propEach(data[attrValue],function(key,value){ node.dataset[value] = key; });break;
									case "for" : 
										if(typeof data[attrValue] === 'function') data[attrValue].call(node,node,attrValue);
										break;
								}
							}
						}
					}
				}
				return this;
			},
			//name base form data
			getFormData:function(){ 
				return N.inject(this,function(inj,node){
					N.extend(inj,(new N.Form(node)).getFormData()); 
				}); 
			},
			setFormData:function(data){ 
				if(typeof data === 'object'){
					this.each(function(node){ (new N.Form(node)).setFormData(data); });
					return this; 
				} 
			},
			release:function(){
				var finalData = this.toArray();
				this.splice(0,this.length);
				this.__partialPointer = null;
				return finalData;
			}
		},function(node,nodeProp,dataFilter){ 
			if(typeof node === "string") node = (/^<.+>$/.test(node)) ? N.parseHTML(node) : N.makes(node);
			this.setSource(N.findLite(node));
			this.__partialPointer = {};
			this.setPartialProperties(nodeProp,dataFilter);
		});
		
		N.EXTEND_MODULE("NodeHandler","Template",{
			clone :function(){ return new N.Template(this,this.defaultFilter); },
			output:function(nodeData,filter){
				return new N.Partial(N.cloneNodes(this),nodeData,N.marge(this.defaultFilter,filter));
			},
			render:function(nodeData,filter){
				return this.output(nodeData,N.marge(this.defaultFilter,filter)).release()[0];
			},
			renders:function(nodeDatas,filter){
				var _self = this;
				var dataFilter = N.marge(this.defaultFilter,filter);
				return N.dataMap(nodeDatas,function(data){
					return _self.output(data,dataFilter).release()[0];
				});
			}
		},function(node,defaultFilter){
			this.defaultFilter = defaultFilter;
			this.setSource(N.makeSampleNode(node));
		});
	})(window,N,N.ENV);

	//Nody Component Foundation
	(function(W,N,ENV){
		//여러 엘리먼트를 셀렉트하여 한번에 컨트롤
		N.MODULE("Controls",{
			selects:function(){ return this.Source; },
			find:function(f){ if(f) return N.find(f,this.Source); return []; },
			statusFunction:function(f,param,filter,requireElement){
				var fe = filter ? function(node){ return N.node.is(node,filter)?f(node, param):undefined } : function(node){ return f(node, param); };
				var r  = new N.Array(this.selects()).setMap( fe ).setFilter();
				return (requireElement == true) ? r.toArray() : this;
			},
			disabled:function(status,filter){ return this.statusFunction(N.node.disabled,(status !== false ? true : false),filter); },
			readonly:function(status,filter){ return this.statusFunction(N.node.readOnly,(status !== false ? true : false),filter); },
			empty   :function(filter)       { filter = filter?filter+",:not(button):not(select)":":not(button):not(select)"; return this.statusFunction(N.node.value   ,"",filter); },
			map     :function(mapf,filter)  { return this.statusFunction(function(node){ var r = mapf(node); if(N.likeString(r)){ N.node.value(node,r); } },"",filter); },
			selectEach:function(eachf,filter) { return this.statusFunction(function(node){ var r = eachf.call(node,node); },"",filter); },
			removePartClass:function(rmClass,filter,req){
				var r = this.statusFunction(function(node,param){
					var classes = N.node.attr(node,"class");
					if(typeof classes === "string"){
						classes = (new N.StringSource(classes)).setRemoveModel(eval("/^"+param+"/"));
						N.node.attr(node,"class",classes);
						return node;
					}
					return undefined;
				},rmClass,filter,true);
				return (req == true)?r:this;
			},
			changePartClass:function(selClass,toClass,filter){
				new N.Array(this.removePartClass(selClass,filter,true)).each(function(node){
					var classes = N.node.attr(node,"class");
					N.node.attr(node,"class",(new N.StringSource(classes)).addModel(selClass+toClass));
				});
				return this;
			}
		},function(controls,casein){
			this.Source = N.find(controls,casein);
		});
	
	
		// 폼은 일정 폼 노드들을 컨트롤 하기위해 사용됩니다.
		N.EXTEND_MODULE("Controls","Form",{
			isValid        :function(f){ if(typeof f === "function") return f.call(this); return N.isNode(this.Source); },
			selects     :function(){ return N.find(this.SelectRule,this.Source); },
			getSelectTokens:function(){
				return new N.Array(this.SelectRule.split(",")).setMap(function(selString){
					var execResult = /\[([a-zA-Z0-9\-]+)(.*)\]/.exec(selString);
					if( execResult === null) return ;
					return execResult[1];
				}).setFilter().toArray();
			
			},
			//체크아웃 대상 (key와 무관)
			getCheckoutElement:function(){
				return N.find(new N.Array(this.getSelectTokens()).setMap(function(s){ return "["+s+"]"; }).join(","), this.Source);
			},
			//체크아웃 대상 (key가 존재하는 것만)
			getCheckoutElementsWithToken:function(){
				var tokens = new N.Array(this.getSelectTokens());
				return new N.Array(this.getCheckoutElement()).inject({},function(node,inject){
					var getKey;
					tokens.each(function(tokenName){
						if( N.node.hasAttr(node,tokenName) == true ){
							var key = N.node.attr(node,tokenName);
							if( !N.isNothing(key) ){
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
				return new N.HashSource(this.getCheckoutElementsWithToken()).setMap(function(node,key){
					var value = N.node.value(node);
					return value == null ? "" : value;
				}).get();
			},
			checkin:function(hashMap,v2){
				if(typeof hashMap === "string"){
					if(typeof v2 !== "string") v2 = N.toString(v2);
					var map      = {};
					map[hashMap] = v2;
					hashMap      = map;
				}
				if(typeof hashMap === "object"){
					var checkin_targets = this.getCheckoutElementsWithToken()
					for(var key in hashMap) if(key in checkin_targets) {
						N.node.value(checkin_targets[key], hashMap[key]);
					} 
				} else {
					console.warn("Frame::checkin set data를 object형으로 넣어주세요");
				}
				return this;
			},
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
			this.Source = N.findLite(context)[0];
			this.form   = this.Source;
			if( !N.isNode(this.Source) ) { console.error( "Frame::Context를 처리할 수 없습니다. => ",this.Source," <= ", context); }
		
			//SelectRule
			switch(typeof selectRule){
				case "string": this.SelectRule = selectRule+",[name]"; break;
				default : this.SelectRule = "[name]"; break;
			}
		});
	
		N.MODULE("ActiveStatus",{
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
			whenActive         :function(n,m){ this.StatusEvents.StatusActive[n] = m; },
			whenInactive       :function(n,m){ this.StatusEvents.StatusInactive[n] = m; },
			toggleInactiveStatus   :function(status,param,owner,react){
				owner = owner ? owner : this;
				param = N.toArray(param);
				
				if( this.ActiveKeys.has(status) ){
					//헨들은 없고 키는 제거해야할때
					if( !this.StatusEvents.StatusInactive[status] ){
						this.ActiveKeys.remove(status);
						return true;
					}
					//모든 인액트를 허용하지 않을때
					if(this.ActiveKeys.length === 1 && !this.AllowInactive){
						return false;
					}
					//핸들 스타트
					if( N.APPLY(this.StatusEvents.AnyWillInactive          ,owner,param) !== false &&
						N.CALL(this.StatusEvents.StatusWillInactive[status],owner,param) !== false )
					{
						if( N.APPLY(this.StatusEvents.StatusInactive[status],owner,param) == false ) return;
						this.ActiveKeys.remove(status);
						N.CALL(this.StatusEvents.AnyDidInactive           ,owner,param);
						N.CALL(this.StatusEvents.StatusDidInactive[status],owner,param);
						if( this.ActiveKeys.length === 0 ) N.CALL(this.StatusEvents.AnyActive);
					}
				}
			},
			toggleActiveStatus:function(status,param,owner,react){
				owner = owner ? owner : this;
				param = N.toArray(param);
				// 존재하지 않는 스테이터스 이거나 리액트
				if( !this.StatusEvents.StatusActive[status] ){
					return console.warn(this,'에 존재하지 않는 키값을 호출하였습니다.',status,this.StatusEvents.StatusActive);
				} 
				if( !this.ActiveKeys.has(status) || (react == true) ){
					// 멀티가 가능하거나 아무것도 없을땐
					if( this.AllowMultiStatus || 
						(this.ActiveKeys.length === 0) || 
						(react == true && this.ActiveKeys.length === 1 && this.ActiveKeys[0] === status)) 
					{
						if( N.APPLY(this.StatusEvents.AnyWillActive           ,owner,param) !== false &&  
							N.APPLY(this.StatusEvents.StatusWillActive[status],owner,param) !== false ) 
						{
							if( N.APPLY(this.StatusEvents.StatusActive[status],owner,param) == false ) return;
							this.ActiveKeys.add(status);
							N.APPLY(this.StatusEvents.AnyDidActive           ,owner,param);
							N.APPLY(this.StatusEvents.StatusDidActive[status],owner,param);
							if( this.ActiveKeys.length === N.propLength(this.Source) ) N.APPLY(this.AllActive,owner,param);
						}
					} else  {
						if( N.APPLY(this.StatusEvents.AnyWillActive           ,owner,param) !== false &&  
							N.APPLY(this.StatusEvents.StatusWillActive[status],owner,param) !== false ) 
						{
							if( N.APPLY(this.StatusEvents.StatusActive[status],owner,param) == false ) return;
							var _self=this;
							this.ActiveKeys.each(function(key){ _self.toggleInactiveStatus(key,param,owner); })
							this.ActiveKeys.add(status);
							N.APPLY(this.StatusEvents.AnyDidActive           ,owner,param);
							N.APPLY(this.StatusEvents.StatusDidActive[status],owner,param);
							if( this.ActiveKeys.length === N.propLength(this.Source) ) N.APPLY(this.AllActive,owner,param);
						}
					}
				}
			},
			getActive:function(){
				return this.ActiveKeys.join(" ");
			},
			isActive:function(k){
				return this.ActiveKeys.has(k);
			},
			activeTo:function(status){
				return this.toggleActiveStatus(status,Array.prototype.slice.call(arguments,1),this,false);
			},
			inactTo:function(status){
				return this.toggleInactiveStatus(status,Array.prototype.slice.call(arguments,1),this,false);
			},
			reactTo:function(status){
				return this.toggleActiveStatus(status,Array.prototype.slice.call(arguments,1),this,true);
			},
			toggleTo:function(status){
				this.isActive(status) ? 
				this.inactTo.apply(this,[status].concat(Array.prototype.slice.call(arguments,1))):
				this.reactTo.apply(this,[status].concat(Array.prototype.slice.call(arguments,1)));
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
				"StatusActive":{},
				"StatusInactive":{},
				"StatusWillActive":{},
				"StatusDidActive":{},
				"StatusWillInactive":{},
				"StatusDidInactive":{}
			}
			this.ActiveKeys = new N.Array();
		});
		
		N.MODULE("EventListener",{
			triggerWithOwner:function(owner,triggerName){
				var args = Array.prototype.slice.call(arguments,2);
				var arounds = this.ManageModuleAroundEvents.prop(triggerName);
				if(arounds){
					var beforeHandlers = arounds.prop("before");
					if(beforeHandlers && beforeHandlers.isAny(function(beforeCallback){
						return beforeCallback.apply(owner,args) == false;
					})) {
						return false;
					}
				}
				var results = this.ManageModuleEvents.dataProp(triggerName).map(function(handler){	
					return handler.apply(owner,args);
				});
				if(arounds){
					var afterHandlers = arounds.prop("after");
					afterHandlers && afterHandlers.each(function(afterCallback){
						return afterCallback.apply(owner,args);
					});
				}
				return results;
			},
			trigger:function(triggerName){
				this.triggerWithOwner.apply(this,[this.ManageModule,triggerName].concat(Array.prototype.slice.call(arguments,1)));
			},
			listenBefore:function(triggerName,proc){
				if(!this.ManageModuleAroundEvents.has(triggerName)){
					this.ManageModuleAroundEvents.setProp(triggerName,new N.HashSource());
				}
				this.ManageModuleAroundEvents.prop(triggerName).pushDataProp("before",proc);
			},
			listenAfter:function(triggerName,proc){
				if(!this.ManageModuleAroundEvents.has(triggerName)){
					this.ManageModuleAroundEvents.setProp(triggerName,new N.HashSource());
				}
				this.ManageModuleAroundEvents.prop(triggerName).pushDataProp("after",proc);
			},
			listen:function(triggerName,proc){
				if(typeof proc !== "function") return false;
				this.ManageModuleEvents.pushDataProp(triggerName,proc,true);
			},
			hasListen:function(triggerName){
				if(arguments.length === 0) this.ManageModuleEvents.hasProp();
				return this.ManageModuleEvents.hasProp(triggerName);
			},
			hasListener:function(triggerName){
				var result = false;
				this.ManageModuleEvents.each(function(v){
					if(v.length){
						result = true;
						return false;
					}
				});
				return result;
			},
			addTriggerRegister:function(triggerName,owner){
				var _self = this;
				if(typeof triggerName === "string"){
					var upperCaseName = triggerName[0].toUpperCase() + triggerName.substr(1);
					this.ManageModule["trigger"+upperCaseName] = function(){
						_self.triggerWithOwner.apply(_self,[owner?owner:_self.ManageModule,triggerName].concat(Array.prototype.slice.call(arguments)));
					}
				} else {
					N.dataEach(triggerName,function(name){
						if(typeof name === "string"){
							_self.addTriggerRegister(name,owner);
						}
					});
				}
			},
			addEventRegister:function(eventName,withAroundCallback){
				var _self = this;
				if(typeof eventName === "string"){
					var upperCaseName = eventName[0].toUpperCase() + eventName.substr(1);
					var onCaseName = "on"+upperCaseName;
					
					this.ManageModuleEvents.touchDataProp(eventName);
					
					if(withAroundCallback === true){
						var willUpperCase = "will"+upperCaseName;
						var didUpperCase  = "did"+upperCaseName; 
						this.ManageModule[willUpperCase] = function(proc){
							if(typeof proc !== "function") return console.error("missing method from",willUpperCase);
							_self.listenBefore(eventName,proc);
						};
						this.ManageModule[didUpperCase] = function(proc){
							if(typeof proc !== "function") return console.error("missing method from",didUpperCase);
							_self.listenAfter(eventName,proc);
						};
					}
					this.ManageModule[onCaseName] = function(proc){
						if(typeof proc !== "function") return console.error("missing method from",onCaseName);
						_self.listen(eventName,proc);
					};
				} else {
					N.dataEach(eventName,function(name){
						if(typeof name === "string"){
							_self.addEventRegister(name,withAroundCallback);
						}
					});
				}
			}
		},function(module){
			if(!N.isModule(module)) console.error("EventListener:: manage object is must be nody module");
			this.ManageModule = module;
			//{eventName:[handers...]}
			this.ManageModuleEvents = new N.HashSource();
			//{eventName:{aroundName:[handlers..]}}
			this.ManageModuleAroundEvents = new N.HashSource();
			var _self = this;
		});
		
		// 컨텍스트 컨트롤러
		N.MODULE("Contexts",{
			"+_selectPoolCount":0,
			selectPoolStart:function(proc){
				if(this._selectPoolCount === 0) this._selectPoolList = this.selects(false);
				this._selectPoolCount = this._selectPoolCount + 1;
			},
			selectPoolEnd:function(){
				this._selectPoolCount = this._selectPoolCount - 1;
				if(this._selectPoolCount === 0) this._selectPoolList = null;
				//console.log('pool --',this._selectPoolCount);
			},
			contexts:function(callback){ 
				var contexts = N.findLite(this._initParams[0]);
				if(typeof callback === "function"){
					return callback.apply(undefined,[contexts].concat(Array.prototype.slice.call(arguments,1)));
				}
				return contexts;
			},
			selects:function(usePool){
				if(usePool == false && this._selectPoolCount > 0) { 
					return N.cloneArray(this._selectPoolList);
				}
				
				var selects;
				switch(typeof this._initParams[1]) {
					case 'function':
						selects = this._initParams[1]();
						break;
					default:
						var selectQuery = N.isNothing(this._initParams[1]) ? ">*" : this._initParams[1];
						if(selectQuery == "self") return this.contexts();
						if(selectQuery.charAt(0) == ">"){
							selects = N.findOn(this.contexts(),selectQuery.substr(1));
						} else {
							selects = N.findIn(this.contexts(),selectQuery);
						}
						break;
				}
				if(selects && typeof usePool === "function") {
					return usePool.apply(undefined,[selects].concat(Array.prototype.slice.call(arguments,1)));
				}
				return selects;
			},
			getContext:function(eq){ return this.contexts()[eq]; },
			getSelect :function(eq){ return this.selects()[eq]; },
			on:function(event,func){
				var _ = this;
				// 이벤트와 번호가 들어오면
				if(typeof event=="string" && typeof func === "number"){
					this.selectPoolStart();
					//캐쉬를 사용함 단 트리깅에서만
					var selNode = this.getSelect(func);
				
					if(N.isNode(selNode)) {
						N.node.trigger(selNode,event, (arguments.length > 2)  ? {'arguments':Array.prototype.slice.call(arguments,2)} : undefined ); 
					} else {
						console.warn("Contexts::on::트리깅할 대상이 없습니다.");
					} 
					this.selectPoolEnd();
					return this;
				}
				if(typeof event=="string" && typeof func === "function"){
					N.node.on(this.contexts(),event,function(e){
					
						var curSel = new N.Array( _.selects() );
						if(curSel.has(e.target)){
							//버블이 잘 왔을때
							var curfuncindex  = curSel.indexOf(e.target);
							var curfuncresult = func.call(e.target,e,curfuncindex,_);
						
							if(curfuncresult == false) return false;
							
							return curfuncresult;
						} else {
							//버블링이 중간에 멈췄을때
							var eventCapture; 
							curSel.each(function(sel){
								if(N.find(e.target,sel,0)){
									eventCapture = sel;
									return false;
								}
							});
							if(eventCapture){
								//이벤트를 다시 발생시킴
								N.node.trigger(eventCapture,e.type);
								return false;
							}
						}
					});
				} else {
					console.error("onSelect::초기화 할수 없습니다. 글자함수필요",event,func);
				}
				return this;
			}
		},function(contextSelector,selectsSelector){
			this._initParams = [contextSelector,selectsSelector];
		});
	
		N.EXTEND_MODULE('Contexts','FilterContexts',{
			needFiltering:function(filterData){
				var selectNodes = this.selects();
				var fm          = this.filterMethod;
				var filteringDataIndexes = [];
				if(this.hiddenClass) {
					var fc = this.hiddenClass;
					N.dataEach(this.selects(),function(sNode,i){
						if( fm.call(sNode,sNode,i,filterData) === true ){
							N.node.removeClass(sNode,fc)
						} else {
							N.node.addClass(sNode,fc);
							filteringDataIndexes.push(i);
						}
					});
				} else {
					N.dataEach(this.selects(),function(sNode,i){
						if( fm.call(sNode,sNode,i,filterData) === true ){
							N.node.style(sNode,'display',null)
						} else {
							N.node.style(sNode,'display','none')
							filteringDataIndexes.push(i)
						}
					});
				}
				return filteringDataIndexes;
			}
		},function(c,s,filterMethod,hiddenClass){
			this._super(c,s);
			if(typeof filterMethod !== 'function') console.error('Filter::세번째 파라메터는 반드시 함수를 넣어주세요',filterMethod);
			this.filterMethod = filterMethod;
		
			if(typeof hiddenClass === 'string') this.hiddenClass = hiddenClass;
			if(hiddenClass === true) this.hiddenClass = 'hidden';
		});
		
		
		N.EXTEND_MODULE("Contexts","ActiveContexts",{
			inactiveItems:function(){
				return nd.node.filter(this.selects(),"*:not(."+this.activeClass+")");
			},
			activeItems:function(){
				return items = nd.node.filter(this.selects(),"."+this.activeClass);
			},
			activeWithSelectItem:function(selectItem){
				//이미 active이면 시작하지 않음
				if(N.node.is(selectItem,"."+this.activeClass) === true) return;
				
				this.selectPoolStart();
				var selects     = this.selects();
				var activeItems = this.activeItems();
				
				//acceptance가 부정할때는 시작하지 않음
				if(N.CALL(this.acceptance,undefined,selectItem,true) === false) return;
				
				if(activeItems.length === 0){
					N.node.addClass(selectItem,this.activeClass);
					this.EventListener.triggerWithOwner(selectItem,"active",this);
					this.EventListener.triggerWithOwner(selectItem,"change",this,true);
					this.EventListener.triggerWithOwner(selectItem,"activeStart",this);
				} else {
					//중복된 active를 허용하면
					if(!this.allowMultiActive){
						for(var i=0,l=activeItems.length;i<l;i++)
							this.inactiveWithSelectItem(activeItems[i],"activeWithSelectItem");
					}
					N.node.addClass(selectItem,this.activeClass);
					this.EventListener.triggerWithOwner(selectItem,"active",this);
					this.EventListener.triggerWithOwner(selectItem,"change",this,true);
				}
				this.selectPoolEnd();
			},
			inactiveWithSelectItem:function(selectItem,sender){
				//이미 inactive이면 시작하지 않음
				if(N.node.is(selectItem,"."+this.activeClass) === false) return;
				
				if(sender === "activeWithSelectItem"){
					N.node.removeClass(selectItem,this.activeClass);
					this.EventListener.triggerWithOwner(selectItem,"inactive",this);
					return;
				}
				
				this.selectPoolStart();
				var selects     = this.selects();
				var activeItems = this.activeItems();
				this.selectPoolEnd();
				
				//selectItem이 active일때 // inactive 조건을 확인합니다.
				if(activeItems.length === 1){
					//이 아이탬만 액티브일때 //옵션의 모든 인액티브가 허용치 않으면 취소합니다.
					if(!this.allowInactiveAll){
						return;
					}
				}
				
				//acceptance가 부정할때는 취소함
				if(N.CALL(this.acceptance,undefined,selectItem,false) === false) return;
				
				N.node.removeClass(selectItem,this.activeClass);
				this.EventListener.triggerWithOwner(selectItem,"inactive",this);
				this.EventListener.triggerWithOwner(selectItem,"change",this,false);
				if(activeItems.length - 1) 
				this.EventListener.triggerWithOwner(selectItem,"activeEnd",this);
				
			},
			activeAll:function(){
				this.selectPoolStart();
				if(this.allowMultiActive === false){
					var item = this.selects()[0];
					if(item) this.activeWithSelectItem(item);
				} else {
					var module = this;
					N.dataEach(this.inactiveItems(),function(item){ module.activeWithSelectItem(item); });
				}
				this.selectPoolEnd();
			},
			inactiveAll:function(){
				this.selectPoolStart();
				var module = this;
				N.dataReverseEach(this.activeItems(),function(item){ module.inactiveWithSelectItem(item); });
				this.selectPoolEnd();
			},
			active:function(indexes){
				this.selectPoolStart();
				var module  = this, selects = this.selects();
				N.dataEach(indexes,function(index){
					if (typeof index === "number"){
						var item = selects[index];
						if(item) module.activeWithSelectItem(item);
					}
				});
				this.selectPoolEnd();
			},
			inactive:function(index){
				this.selectPoolStart();
				var module  = this, selects = this.selects();
				N.dataEach(indexes,function(index){
					if (typeof index === "number"){
						var item = selects[index];
						if(item) module.inactiveWithSelectItem(item);
					}
				});
				this.selectPoolEnd();
			},
			toggleWithSelectItem:function(selectItem){
				return N.node.is(selectItem,"."+this.activeClass) ? this.inactiveWithSelectItem(selectItem) : this.activeWithSelectItem(selectItem);
			}
		},function(c,s,callback){
			this._super(c,s);
			//event listener
			this.EventListener = new N.EventListener(this);
			this.EventListener.addEventRegister(["activeStart","activeEnd"]);
			this.EventListener.addEventRegister(["active","inactive","change"],true);
			
			//options
			//lock => api호출이 아닌이상 토글되지 않도록 합니다.
			this.activeClass = "active";
			this.acceptance  = undefined;
			this.allowInactiveAll = false;
			this.allowMultiActive = false;
			this.lock = false;
			
			//active executor
			var module = this;
			this.on("click",function(){ 
				module.lock === false && module.toggleWithSelectItem(this); 
			});
			//
			N.CALL(callback,this,this);
			if(this.allowInactiveAll === false && !this.activeItems().length) this.active(0);
		});

		N.EXTEND_MODULE("ActiveStatus","ViewAndStatus",{
			addViewStatus:function(statusName,active,inactive){
				if(typeof statusName === 'string'){
					if(typeof active === 'function'){
						this.whenActive(statusName,active);
					}
					if(typeof inactive === 'function'){
						this.whenInactive(statusName,inactive);
					}
				}
			},
			viewStatusTo:function(status){
				if(typeof name === 'string') this.toggleActiveStatus(status,Array.prototype.slice.call(arguments,1),this);
			},
			node:function(innerKey){
				if(arguments.length === 0) return new N.NodeHandler(this.view);
				if(innerKey in this) innerKey = this[innerKey];
				return new N.NodeHandler(N.find.apply(undefined,N.ownerMap(this,[innerKey,this.view].concat(Array.prototype.slice.call(arguments,1)))));
			},
			find:function(query){
				return N.find.apply(undefined,N.ownerMap(this,[query,this.view].concat(Array.prototype.slice.call(arguments,1))));
			}
		},function(targetView,allowMulti,allowInactive){			
			this.view = N.findLite(targetView)[0];
			if(!this.view) return console.error("ViewAndStatus::다음셀렉터를 찾을수 없습니다. 이와 관련된 컨트롤러는 모두 정상적으로 작동되지 않을것입니다. => ",targetView);
			this._super(allowMulti,allowInactive);
			return true;
		});
		
		
		N.EXTEND_MODULE("ViewAndStatus","FormController",{
			setFormData:function(data,v2){
				return this.Form.checkin(data,v2);
			},
			getFormData:function(){
				return this.Form.checkout();
			},
			controlEach:function(h,f){
				this.Form.selectEach(h,f);
			},
			getFormControl:function(){
				return this.Form.find.apply(this.FormControl,Array.prototype.slice.call(arguments));
			}
		},function(targetForm,viewStatus,methodHelper){
			if( this._super(targetForm,false,true) === true ) {
				this.Form = new N.Form(this.view);
				
				var _self = this;
				
				if(viewStatus && (typeof viewStatus === "object")) {
					N.propEach(viewStatus,function(handle,key){
						_self.addViewStatus(key,handle);
					});
				};
				
				if(typeof methodHelper === 'function') methodHelper = {init:methodHelper};
				
				N.propEach(methodHelper,function(fn,key){
					if(!(key in _self.constructor.prototype)) {
						if(key === 'init') {
							if(typeof fn === 'function') fn.apply(_self,Array.prototype.slice.call(arguments));
						} else {
							_self[key] = (typeof fn === 'function') ? function(){fn.apply(_self,Array.prototype.slice.call(arguments));} : fn;
						}
					}
				});
			}
		});
		
		N.EXTEND_MODULE("ViewAndStatus","RoleController",{
			"++findDataRole":function(findwhere,initedRoles){
				var roleName  = this.prototype.__NativeHistroy__[this.prototype.__NativeHistroy__.length-1];
				var findQuery = "[data-role~="+N.kebabCase(roleName)+"]";
				var roles     = findwhere ? N.find(findQuery,N.findLite(findwhere)) : N.findLite(findQuery);
				if(initedRoles === false){
					return N.dataFilter(roles,function(node){
						if(!node.roleController) return true;
						return node.roleController[roleName] ? false : true;
					});
				} else {
					return N.dataFilter(roles,function(node){	
						if(!node.roleController) return false;
						return node.roleController[roleName] ? true : false;
					});
				}
			},
			"++newDataRole":function(findwhere,props,data,rolename){
				var _self      = this;
				var findedRole = this.findDataRole(findwhere,false)[0];
				return findedRole && (new _self(findedRole,props,data));
			},
			"++newDataRoles":function(findwhere,props,data,rolename){
				var _self       = this;
				var findedRoles = this.findDataRole(findwhere,false);
				var initedRoles = [];
				for(var i=0,l=findedRoles.length;i<l;i++) initedRoles.push(new _self(findedRoles[i],props,data));
				return initedRoles;
			},
			hasProp:function(key){
				return this.HashSource.has(key);
			},
			prop:function(key,filter){
				if(arguments.length === 0){
					return this.HashSource.get();
				} else {
					return this.HashSource.prop(key,filter);
				}
			},
			setProp:function(key,value){
				this.HashSource.setProp(key,value);
				return this;
			},
			data:function(){
				return this.ManageData;
			},
			pushData:function(v){
				this.ManageData.push(v);
				return this;
			},
			findRole:function(find,proc){
				var finded = N.find(find);
				var selectedRoles = new N.Array(N.dataFilter(N.argumentsFlatten(find),function(obj){ return N.isModule(obj,"RoleController"); }));
				if(finded.length === 0) selectedRoles;
				
				N.dataEach(finded,function(roleNode){
					if(typeof roleNode.roleController === "object") selectedRoles.push(roleNode.roleController);
				});
				
				if(typeof proc === "function"){
					var _self = this;
					N.dataEach(selectedRoles,function(roleController){ proc.call(_self,roleController); });
				}
				return selectedRoles;
			},
			findRoleById:function(id){
				var finded = N.find("#"+id.replace("#",""),0);
				if(finded.length === 0) return console.warn("findRoleById는 ",id,"을 찾을수 없습니다");
				return finded.roleController;
			},
			findRoleByProp:function(prop,proc){
				var props = this.HashSource.prop(prop);
				var roles = N.isModule(props,"RoleController") ? [props] : this.findRole(props);
				if(typeof proc === "function"){
					N.dataEach(roles,proc);	
				}
				return roles;
			},
			getBinder:function(proc){
				if(this.Binder){
					if(typeof proc === "function")proc.call(this,this.Binder);
					return this.Binder;
				}
			},
			release:function(){
				nd.node.removeAttr(this.view,"data-role",N.kebabCase(this.__NativeModule__()));
				for(var key in this) this[key] = null;
			}
		},function(targetRole,props,data,initViewProc){
			if( this._super(targetRole,true,true) === true ) {
				if(N.isModule(props,"Binder")){
					this.HashSource = props.beforeProperty;
					this.HashSource.pushDataProp(this.__NativeModule__(),this);
					this.Binder = props;
				} else if(N.isModule(props,"HashSource")) {
					this.HashSource = props;
					this.HashSource.pushDataProp(this.__NativeModule__(),this);
				} else {
					this.HashSource = new N.HashSource(props);
					this.HashSource.pushDataProp(this.__NativeModule__(),this);
				}
				this.ManageData    = new N.Array(data);
				this.EventListener = new N.EventListener(this);
				
				var role       = this;
				var moduleName = this.__NativeModule__();
				
				N.find('script[type*=json]', this.view ,N.dataEach ,function(scriptTag){
					var jsonData = N.node.value(scriptTag);
					if(nd.is(jsonData,"object")) N.is(jsonData,"array") ? role.ManageData.append(jsonData) : role.HashSource.extend(jsonData);
					N.node.remove(scriptTag);
				});
				
				//already init test
				if(!this.view.roleController) this.view.roleController = {};
				if(this.view.roleController[moduleName]){
					console.warn(this.view,"already init => "+moduleName);
				} else {
					this.view.roleController[moduleName] = this;
				}
				
				
				if(typeof initViewProc === "function" && this.view){
					N.node.addAttr(this.view,"data-role",N.kebabCase(moduleName));
					initViewProc.call(this,this);
				}
			}
		});
	
		N.MODULE("Request",{
			send:function(param,callback,method){
				if(typeof this.defaultURL !== "string"){
					return console.error("Requst::send => not exesist request url");
				}
				this.relativeSend("",param,callback);
			},
			relativeSend:function(url,param,callback,method){
				var _self=this,sender=new (function(){
					//url
					this.url       = this.defaultURL + url;
					//method
					this.method    = method && _self.option.prop("method") && "GET";
					if (typeof this.method === "string"){
						this.method = this.method.toUpperCase();
					} else {
						console.warn("Requst::send => method is must be string", this.method);
						this.method = "GET";
					}
					//parameter
					var parameterSource = (new N.HashSource(_self.option.prop("parameter"))).extend(param);
					this.parameter       = parameterSource.get();
					this.parameterString = parameterSource.toParameter().join("=","&");
					//callback
					this.callback  = (typeof callback === "function") ? callback : _self.option.prop("callback");
					_self.option.each(function(value,key){
						switch(key){ 
							case "url":case "parameter":case "parameterString":case "method":case "callback":break;
							default:this[key] = value;
						}
					});
				})();
				sender.prototype = {
					"onreadystatechange":function(){ this.callback.apply(this,Array.prototype.slice.call(arguments)); }
				};
				
				if( !("callback" in sender) ) return console.error("Request :: callback is undefined. this must exsist");
				
				//request Object만들기
				var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : 
									window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : 
									(function () { console.error("XMLHTTPRequest를 지원하지 않는 브라우져입니다"); }());					
				if (!xhr) return;
				
				xhr.onreadystatechange = function(){ 
					switch(xhr.readyStatus){
						case 1: 
							if(sender.option.debug) console.info("Request::("+sender.url+")server connection established");
							break;
						case 2: 
							if(sender.option.debug) console.info("Request::("+sender.url+")request recived");
							break;
						case 3: 
							if(sender.option.debug) console.info("Request::("+sender.url+")processing request");
							break;
						case 4:
							if(xhr.status < 400){
								if(sender.option.debug === "true"){
					 				var debugObject = {
					 					method:sender.method,
					 					url:sender.url,
					 					param:sender.parameter
					 				};
					 				console.info("Request::Success:: [\n - method => "
					 							,debugObject.method
					 							,"\n - url    => "
					 							,debugObject.url
					 							,"\n - param  => "
					 							,N.tos(debugObject.param)
					 							,"\n]\n:::result==> "
					 							,N.max(N.tos(debugObject.data),debugObject.dataTraceMax)
					 							,"\n\n"
					 						);
					 				return debugObject;
								}
							} else {
								console.error("Request::load : '"+ this.url +"' 호출이 실패되었습니다. JSON 파라메터와 에러코드를 출력합니다. ==> \n------\n" ,N.tos(this.option) ,"\n------\n", textError, N.tos(this.option.data))
								if(xhr.status<500){
									//4xx error
									console.warn("Request::send::error => ["+xhr.status+"] page not found",sender.url);
								}else if(xhr.status<600){
									//5xx error
									console.warn("Request::send::error => ["+xhr.status+"] internal server error",sender.url);
								} else {
									//etc error
									console.warn("Request::send::error => ["+xhr.status+"] error",sender.url);
								}
							}
							sender.onreadystatechange(xhr.responseText,xhr.status,sender,xhr);
						break;
					}
				};
				
				N.TRY_CATCH(function(){
					switch(sender.method){
						case "GET":
							xhr.open(
								"GET", 
								sender.url + (senderparameterString.length ? sender.parameterString : "?"+sender.parameterString), 
								true 
							);
							xhr.send();
							break;
						case "POST":
						default:
							if(!this.sender.method.length){
								return console.error("Requst::send => method name is worng", sender.method);
							}
							xhr.open("POST", this.url, true );
							N.TRY_CATCH(
								function(){
									xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
									xhr.setRequestHeader('Content-type'    , 'application/x-www-form-urlencoded');
								},function(){
									console.warn("XMLHttpRequest:: setRequestHeader를 지원하지 않는 브라우져입니다");
									throw e;
								}
							);
							xhr.send( requestString );
							break;
					}
				},function(e){
					if(e.message.indexOf("denied") > 0){
						throw new Error("Cross Domain Error (if current browser is IE)");
					} else {
						throw e;
					}
				},this);
			}
		},function(url,option){
			//option
			//parameter => default parameter
			//callback  => default callbck
			//method    => default callbck
			this.defaultURL = url;
			this.option     = new N.HashSource(option);
		});
		
		N.METHOD("open",function(url,option){
			if(typeof option === "function") option = {success:option};
			//success option
			var option = N.HashSource({
				"callback":function(responseText,status,sender,xhr){
					if(status < 400){
						var successResult;
						switch(sender.contentType){
							case "json": case "object":
								N.TRY_CATCH(function(){
									successResult = JSON.parse(responseText);
								},function(e){
									console.error("open::wrong json format. =>",responseText,xhr);
									throw e;
								});
								break;
							case "dom": case "node":
								successResult = N.parseHTML(responseText);
								break;
							case "http": case "html": case "js": case "javascript": case "css": case "stylesheets": default :
								successResult = responseText
								break;
						}
						if(typeof sender.success !== "function") return console.error("open:: must 'success' exsist as function =>",option);
						sender.success(successResult,sender,xhr);
						(typeof sender.final === "function") && sender.final(finalResult,sender,xhr);
					} else {
						var finalResult;
						if(sender.error) {
							finalResult = requestObject.statusText;
							sender.error(requestObject.statusText,sender,xhr);
						}
						(typeof sender.final === "function") && sender.final(finalResult,sender,xhr);
					}
				}
			}).marge(option)
			return (new N.Request(url,option)).send();
		});
		
		N.MODULE("ContentLoader",{
			hasLoadContent:function(loadKey){
				return this.ManageLoadNode.has(loadKey);
			},
			loadContent:function(loadPath,loadKey){
				var _self   = this;
				var success = false;
				if(typeof loadKey !== "string") loadKey = this._loadkey;
				if(typeof loadPath === "function"){
					loadPath = loadPath(N.APPLY(loadPath,this));
				}
				switch(typeof loadPath){
					case "string":
						//cache safe loadURL
						var loadURL = loadPath + (loadPath.indexOf("?") > -1 ? "&token=" : "?token=") + N.RANDKIT.base36Random(2);
						new N.Open(loadURL,{
							"dataType":"dom",
							"success":function(doms){
								_self.ManageLoadNode.setProp(loadKey,doms);
								_self.EventListener.trigger("load",loadKey,doms);
								success = true;
							},
							"error":function(){
								console.error("ContentLoader:: Can't load of the path => "+loadPath);
								N.CALL(error,_,loadKey);
							}
						});
						break;
					case "object":
						//must be element object
						var doms = N.findLite(loadPath);
						if( doms.length === 0 ) { 
							console.error("ContentLoader:: not found of the loadObject => "+loadPath);
						} else {
							_self.ManageLoadNode.setProp(loadKey,doms);
							_self.EventListener.trigger("load",loadKey,doms);
							success = true;
						}
					break;
				}
				return success;
			},
			putContent:function(putNode,loadKey){
				if(typeof loadKey !== "string") loadKey = this._loadkey;
				if(this.ManageLoadNode.has(loadKey)){
					return N.node.put(putNode,loadKey,this.ManageLoadNode.prop(loadKey));
				} else {
					console.error('must be loadContent after putContent =>',loadKey);
				}
				
			},
			templateContent:function(loadKey){
				if(typeof loadKey !== "string") loadKey = this._loadkey;
				if(this.ManageLoadNode.has(loadKey)){
					return new N.Template(this.ManageLoadNode.prop(loadKey));
				} else {
					console.error('must be loadContent after templateContent =>',loadKey);
				}
			},
		},function(){
			//key node
			this.ManageLoadNode = new N.HashSource();
			this.EventListener    = new N.EventListener(this);
			this.EventListener.addEventRegister("load");
			this._loadkey = "defaultLoadContent";
		});
		
		
		N.EXTEND_MODULE("ContentLoader","ActiveContentLoader",{
			active:function(activeName){
				if(typeof activeName === "string" && this._activeStatus === activeName){
					return true;
				}
				if(!this.ManageLoadPath.has(activeName)){
					console.error('ActiveContentLoader::activeName in not defined');
					return false;
				}
				var readyActive = true;
				if(!this.ManageLoadNode.has(activeName)){
					readyActive = this.loadContent(activeName,this.ManageLoadPath.prop(activeName));
				}
				if(readyActive){
					//before active view save
					
					if(this._activeStatus){
						var inactiveNodes  = N.findLite(this.view.childNodes);
						var inactiveResult = this.EventListener.trigger("inactive",this._activeStatus,inactiveNodes);
						if(N.dataHas(inactiveResult,false)){
							return false;
						}
						
						
					}
					var activeNodes  = this.ManageLoadNode.prop(activeName);
					var activeResult = this.EventListener.trigger("active",this._activeStatus,activeNodes);
					if(N.dataHas(inactiveResult,false)){
						return false;
					}
				}
				return false;
				
			
			}
		},function(view,loadInfo){
			this._super();
			this.view = N.find(view,0);
			if(this.view) { 
				this.EventListener.addEventRegister(["active","inactive"],true);
				this.EventListener.didInactive(function(keyName,inactiveNodes){
					this.ManageLoadNode.setProp(this._activeStatus,inactiveNodes);
					N.node.empty(this.view);
					this._activeStatus = undefined;
				});
				this.EventListener.didActive(function(keyName,activeNodes){
					this.ManageLoadNode.setProp(keyName,activeNodes);
					N.node.put(this.view,activeNodes);
					this._activeStatus = keyName;
				});
				
				this.ManageLoadPath = new N.HashSource(N.marge(loadInfo,{"loaderInitial":N.toArray(this.view.childNodes)}));
				this._activeStatus   = "loaderInitial";
			} else {
				return console.error("ActiveContentLoader:: not found view of selector =>",view); 
			}
		});
		
		N.MODULE("DataContext",{
			// 배열로된 패스를 반환한다.
			// path rule
			// root   = "","/"=> [/]
			// child  = "/3"  => [/,3]
			// childs = "/*"  => [/,*]
			_clearPath:function(path){
				if (N.isArray(path)) {
					return path;
				} else if((typeof path) === "string"){
					path = path.trim();
					path = path.indexOf("/") == 0 ? path.substr(1) : path;
					path = this.ContextID + "/" + path;
				} else {
					throw new Error("DataContext::_clearPath::1:Invaild path => "+path);
				}

				var result    = new N.Array();
				var splitPath = path.split("/");

				N.dataEach(splitPath,function(keyPath){
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
				if (N.isArray(result)) {
					//substr // -> /
					return result.join("/");
				}
			},
			_getDataProps:function(data){
				var data = N.clone(data);
				if( (typeof data) === "object" ) {
					if(N.isArray(data)) {
						return {};
					} else {
						return new N.HashSource(data).remove(this.DefaultDataKey).get();
					}
				}
			},
			_getChildData:function(data){
				if( typeof data === "object" ) {
					if(N.isArray(data)) {
						return N.clone(data);
					} else {
						var childKeyData = data[this.DefaultDataKey];
						if(typeof childKeyData === "object"){
							if(N.isArray(childKeyData)) {
								return N.clone(childKeyData);
							} else {
								return [N.clone(childKeyData)];
							}
						}
					}
				}
				return [];
			},
			// path로 해당 위치의 데이터를 반환해줍니다.
			getFullDataWithPath:function(path){
				var path = this._clearPath(path);
				if (N.isArray(path)) {
					var pathMake   = "";
					var selectData = [this.Source.get()];
					var _self      = this;

					N.dataEach(path,function(pathKey){
	
						if (typeof pathKey === "string") {
							switch(pathKey){
								case "/": case _self.ContextID:
									// 아무것도 하지 않음
									break;
								case "*":
									selectData = new N.Array(selectData).map(function(data){
										if (N.isArray(data)){
											return data;
										} else {
											return _self.Source.prop(_self.DefaultDataKey);
										}
									}).setFlatten().remove(undefined);
									break;
							}
						} else if(typeof pathKey === "number") {
							selectData = new N.Array(selectData).map(function(data){
								if (N.isArray(data)){
									return data[pathKey];
								} else {
									var sourceChildren = data[_self.DefaultDataKey];
									if(N.isArray(sourceChildren)){
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
			feedDownDataBinderMake:function(data,parent){
				
				if( typeof data === "object" ){
					var makeDataBinder = N.isArray(data) ? new N.DataBinder(this,this._getDataProps(data),"array") : new N.DataBinder(this,this._getDataProps(data),"object");
					var childDatas = this._getChildData(data);
					var childrens  = [];
					var _self      = this;
					if(N.isArray(childDatas)){
						N.dataEach(childDatas,function(childData){
							var child = _self.feedDownDataBinderMake(childData,makeDataBinder);
							if(child) childrens.push(child);
						});
					}
					if(typeof parent === "object") parent.appendChild(makeDataBinder);

					return makeDataBinder;
				} else {
					console.error("data초기 값은 반드시 object타입이여야 합니다. =>",typeof data,data);
				}
			},
			update:function(data,parent,marge){
				
				if( typeof data === "object" ){
					var managedData = parent || this.RootDataBinder;
					
					//feedDownUpdate
					var dataProp  = this._getDataProps(data);
					var diffProps = N.diffKeys(managedData.prop(), dataProp);
					for(var i=0,l=diffProps.length;i<l;i++){
						if( diffProps[i] in dataProp ){
							managedData.setProp(diffProps[i],dataProp[diffProps[i]]);
						} else if((marge !== true) && !(diffProps[i] in dataProp)) {
							managedData.removeProp(diffProps[i]);
						}
					}
					
					//하위데이터
					var childData       = this._getChildData(data);
					var childDataLength = childData.length;
					var managedChildrens= managedData.Child.toArray();
					var managedLength   = managedChildrens.length;
					var removeTargets   = [];
					for(var i=0,l=((childDataLength > managedLength) ? childDataLength : managedLength);i<l;i++){
						if(childData[i]&&managedChildrens[i]){
							this.update(childData[i],managedChildrens[i],marge);
						} else if(!childData[i]&&managedChildrens[i]){
							removeTargets.push(managedChildrens[i]);
						} else if(childData[i]&&!managedChildrens[i]){
							managedData.addChildData(childData[i]);
						}
					}
					//데이터 지우기
					N.dataEach(removeTargets,function(removeTarget){
						removeTarget.removeDataBinder();
					});
					return managedData;
				} else {
					console.warn("data초기 값은 반드시 object타입이여야 합니다.",typeof data,data);
				}
			},
			margeUpdate:function(data){
				this.update(data,undefined,true);
			},
			//managedData를 string이나 오브젝트로 뽑아넴
			trace:function(managedData){
				var _self = this;
				if (!managedData) managedData = this.RootDataBinder;
				var ra = managedData.SourceType == "array";
				var rs = ra ? "[" : "{";
				var re = ra ? "]" : "}";
				var prop = [];
				managedData.Source.each(function(v,k){ prop.push( '\"' + k + '\":\"' + v + '\"' ) });

				if(managedData.Child.length > 0) prop.push( 
					(ra ? '' : '\"'+this.DefaultDataKey + '\":[' ) + 
					managedData.Child.map( function(managedData){ return _self.trace(managedData); } ).join(", ") + 
					(ra ? "" : "]")
				);
				return rs + prop.join(", ") + re;
			},
			JSONString:function(){ return this.trace(); },
			JSONObject:function(){ return JSON.parse(this.JSONString()); },
			getDataBinder:function(path,withChildren){
				if(typeof path == '/') return this.RootDataBinder;
				if (path.indexOf("/") == 0) path = this.ContextID + path;
				var paths    = path.split("/");
				var thisID   = this.ContextID;
				var thisRoot = this.RootDataBinder;

				var selectedDataBinder;

				N.dataEach(paths,function(path){
					if(thisID == path) {
						selectedDataBinder = thisRoot;
					} else {
						selectedDataBinder = selectedDataBinder.Child[parseInt(path)];
					}
				});
				return selectedDataBinder;
			},
			querySelectData:function(path){
				var resultData = [this.RootDataBinder];
				if(path == '/' || path == '') return resultData;
				var pathes = [];

				path.replace(/\*\*.+/g,'**').replace(/\/[^\/]+/g,function(s){ pathes.push(s.substr(1)); });

				N.dataEach(pathes,function(path,i){
					var searchTarget = resultData;
					var searchResult = [];
					if(path == '') return false;
					if(path == '*'){
						N.dataEach(searchTarget,function(managedData){
							searchResult = searchResult.concat(managedData.Child.toArray());
						});
					} else if(path == '**') {
						N.dataEach(searchTarget,function(managedData){
							managedData.feedDownDataBinder(function(){
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
								wantedProps[N.unwrap(attr[1],["''",'""'])] = (attr[3]) ? N.unwrap(attr[3],["''",'""']) : null;
							} else {
								console.warn('//!devel target parse err',attr,path);
							}
						});
	
						if(/\[[^\]]+\]\*\*$/.test(path)) {
							N.dataEach(searchTarget,function(managedData){
								managedData.feedDownDataBinder(function(){
									var md   = this;
									var pass = true;
									N.propEach(wantedProps,function(v,k){
										return pass = (v === null || v === '') ? md.hasProp(k) : (md.prop(k) == v);
									});
									if(pass === true) searchResult.push(md);
								});
							});
						} else {
							N.dataEach(searchTarget,function(managedData){
								var passData = [];
								N.dataEach(managedData.Child,function(managedData){
									var pass = true;
									N.propEach(wantedProps,function(v,k){
										return pass = (v === null || v === '') ? managedData.hasProp(k) : (managedData.prop(k) == v);
									});
									if(pass === true) searchResult.push(managedData);
								});
							});
						}
					} else if(N.likeNumber(path)){
						N.dataEach(searchTarget,function(managedData){
							var ch = managedData.Child[parseInt(path)];
							if(ch){ searchResult.push(ch); }
						});
					} else {
						N.dataEach(searchTarget,function(managedData){
							N.dataEach(searchTarget,function(managedData){
								if( managedData.DataID == path ) searchResult.push(managedData);
							});
						});
					}
					resultData = searchResult;
				});
				return resultData;
			},
			getDataBinderWithID:function(findid){
				return this.RootDataBinder.getDataBinderWithID(findid);
			},
			getDataBinderWithOffset:function(path,offset){
				var value = /(.*)\/([\d]+)$/.exec(path);
				if(value === null)console.error("getNextDataBinder 에러",path);return;
				var nextDataBinder = this.getDataBinder(value[1]+"/"+(parseInt(value[2])+offset));
				if(N.isArray(nextDataBinder)) nextDataBinder = nextDataBinder[0];
				return nextDataBinder;
			},
			getRootDataBinder:function(){
				return this.RootDataBinder;
			}
		},function(source,defaultKey){
			this.ContextID             = N.RANDKIT.base36UniqueRandom(5,'co');
			this.Source         = new N.HashSource(source);
			this.DefaultDataKey = defaultKey || "data";
			this.Binder         = new N.Binder();
			// 데이터 안의 모든 Managed data를 생성하여 메타안에 집어넣음
			this.RootDataBinder = this.feedDownDataBinderMake(this.Source.get(),"root");
		});

		N.MODULE("ViewModel",{
			needRenderView:function(depth,managedData,feedViews,viewController){
				if(this.Renders[depth]){
					var renderResult = N.isModule(this.Renders[depth],"Template") ? managedData.template(this.Renders[depth]) : this.Renders[depth].call(managedData,managedData,feedViews) ;
					if( renderResult !== false) if(typeof renderResult === 'object' && 'nodeName' in renderResult ) {
						return renderResult;
					} else {
						if(N.isArray(renderResult)) {
							if( renderResult.length == 1 ) return renderResult[0];
							var singleData = N.dataFirst(renderResult);
							console.log('경고::ViewModel의 최종 렌더 노드는 하나만 반환되어야 합니다',renderResult);
							return singleData;
						} 
						console.error("오류::ViewModel의 렌더값이 올바르지 않습니다. 대체 렌더링이 실시됩니다.=>",renderResult, this.Renders[depth]);
					}
				}
				return N.make("div",{html:N.toString(managedData.prop()),style:'padding-left:10px;'},managedData.placeholder("div"));
			},
			clone:function(){
				var init = this.Renders.clone();
				for(var i=0,l=arguments.length;i<l;i++) if( arguments[i] ) init[i] = arguments[i];
				return N.ViewModel.new.apply(undefined,init.toArray());
			}
		},function(renderDepth){
			//tempate 타겟을 설정
			this.Renders = new N.Array(Array.prototype.slice.call(arguments)).map(function(a){ 
				if(typeof a === "string"){
					return new N.Template(a);
				}
				return a; 
			});
		});

		N.MODULE("DataBinder",{
			//노드구조
			appendChild:function(childrens){
				var parent = this;
				N.dataEach(childrens,function(child){
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
				var _self = this;
				N.dataEach(childrens,function(child){
					var index = _self.Child.indexOf(child);
					var select = _self.Child[index];
					if (select) {
						select.removeFromParent();
					}
				});
			},
			breakableFeedDownDataBinder:function(method,param){
				var newParam = method.call(this,param);

				if(newParam !== false) {
					N.dataEach(this.Child,function(child){ 
						return child.breakableFeedDownDataBinder(method,newParam); 
					});
				}

				return newParam;
			},
			//현재부터 자식으로 
			feedDownDataBinder:function(method,param){
				var newParam = method.call(this,param);
				N.dataEach(this.Child,function(child){ child.feedDownDataBinder(method,newParam); });
				return this;
			},
			feedUpManageData:function(method,depth){
				// 돌리는 depth
				var depth = depth ? depth : 0;
				//데이타 얻기
				var mangedDatas = this.Child;

				depth++;
				N.dataEach(mangedDatas,function(child){ child.feedUpManageData(method,depth); });
				method(this,depth-1);
				return this;
			},
			chainUpMangedData:function(method){
				if(typeof method === "function"){
					method.call(this);
					if( this.Parent ) this.Parent.chainUpMangedData(method);
				}
			},
			replaceProp:function(data,rerender){
				if( N.isModule(data,'DataBinder') ) data = data.prop();
				if( typeof data === 'object' ) this.Source.setSource(data);
				if( rerender === true ) this.rerender();
			},
			hasProp:function(key){
				return this.Source.has(key)
			},
			prop:function(key,filter){
				if(arguments.length === 0){
					return this.Source.get();
				} else {
					return this.Source.prop(key,filter);
				}
			},
			setProp:function(key,value,useBind){
				if(typeof key === "string"){
					this.Source.setProp(key,value,false);
					this.DataContext.Binder.send(this,this.DataID+"."+key,value);
				} else if(key === "object"){
					for(var propKey in key) { this.setProp(propKey,key[propKey],false); }
				}
				if(useBind !== false) this.DataContext.Binder.post(this,"GLOBAL.DataBinderWasSetValue",this);
				return this;
			},
			removeProp:function(key){
				if(this.Source.has(key)){
					this.Source.remove(key);
					this.DataContext.Binder.send(this,this.DataID+"."+key,"");
				}
			},
			text:function(key){
				return N.makeText( this.value.apply(this,arguments) )
			},
			bind:function(dataKey,bindElement,optional){
				if(this.PresentorScope) {
					var element = N.isNode(bindElement) ? bindElement : typeof bindElement === "undefined" ? N.create("input!"+bindElement) : N.create(bindElement);
					this.PresentorScope.addBindNode(element,this,dataKey);
					return element;
				} else {
					console.warn("view컨트롤러 스코프 내에서만 bind를 사용할수 있습니다.");
				}
			},
			hidden:function(dataName){
				return this.bind(dataName,"hidden!"+dataName);
			},
			action:function(actionName,actionElement,arg){
				if(this.PresentorScope){
					var element = N.isNode(actionElement) ? actionElement : N.create(actionElement);
					this.PresentorScope.addActionNode(actionName,element,this,arg)
					return element;
				} else {
					console.warn("view컨트롤러 스코프 내에서만 action을 사용할수 있습니다.");
				}
			},
			placeholder:function(tagname){
				if(this.PresentorScope){
					var placeholderElement = N.isNode(tagname) ? tagname : N.create(tagname);
					this.PresentorScope.addPlaceholderNode(this.DataID,placeholderElement);
					return placeholderElement;
				}
			},
			template:function(_template,dataFilter){
				var _self = this;
				
				// dataFilter 에서 function필터링시 메니지드 데이터 스코프에 포함하도록 한다.
				if(typeof dataFilter === 'object'){
	   				 dataFilter = N.propMap(dataFilter,function(v){
	   					if(typeof v === 'function') return function(){ return v.apply(_self,Array.prototype.slice.call(arguments));};
	   					return v;
	   				});
				}
				
				var partialOutput;
				if(typeof _template === 'object') { 
					partialOutput = _template.output(this.prop(),dataFilter);
				} else if(typeof _template === 'string') {
					partialOutput = (new N.Template(_template,true)).output(this.prop(),dataFilter);
				} else { 
					console.error('template 값이 잘못되어 랜더링을 할수 없었습니다.',_template); return false; 
				}
				
				if(partialOutput.isNone()) { 
					console.error("template :: 렌더링할 template를 찾을수 없습니다",partialOutput); return false; 
				}

				partialOutput.partialSetup(['bind','action','placeholder'],
					function(name,node,nodeAlias){
						switch(nodeAlias){
							case 'bind': _self.bind(name,node); break;
							case 'action':
								if(("nd-param" in node.attributes)) {
									_self.action(name,node,N.toObject(node.getAttribute("nd-param")));
									node.removeAttribute("nd-param");
								} else {
									_self.action(name,node);
								}
								break;
							case 'placeholder': _self.placeholder(node); break;
						}
					}
				);
				return partialOutput;
			},
			response:function(responseKey,proc){
				if(typeof responseKey !== "string" && typeof proc !== "function") console.warn("response args must be string & function => ",responseKey,proc);
				if(!this.__response__) this.__response__ = {};
				this.DataContext.Binder.listen(this.__response__,this.DataID+"."+responseKey,function(value,beforeValue,key){ proc(value,key); });
			},
			revertData:function(){
				this.DataContext.getDataWithPath(this.path);
			},
			getPath:function(){
				var path = new N.Array();
				this.chainUpMangedData(function(){ path.push( this.Parent ? this.Parent.Child.indexOf(this) : this.DataContext.ContextID); });
				return path.reverse().join("/");
			},
			querySelectData:function(path){
				if(path == '' || path == '/') return [this];
				return this.DataContext.querySelectData( this.getPath() + '/' + path );
			},
			getDataBinderWithID:function(findid){
				if(typeof findid == 'string') {
					var result;
					this.breakableFeedDownDataBinder(function(){
						if( this.DataID == findid ) {
							result = this;
							return false;
						}
					});
					return result;
				}
			},
			getParentDataBinder : function(){ return this.Parent; },
			getChildDataBinder  : function(){ return this.Child; },
			hasParentDataBinder : function(){ return !!this.Parent; },
			hasChildDataBinder  : function(){ return !!this.Child.length; },
			getDepth:function(){ var depth = 0; this.feedUpManageData(function(m,d){ if (depth < (d + 1)) depth = (d + 1); }); return depth; },
			getLevel:function(){ var level = 0; this.chainUpMangedData(function(){ this.Parent ? level++ : undefined; }); return level; },
			getIndex:function(){ return this.Parent.Child.indexOf(this); },
			getDataID:function(){ return this.DataID; },
			getContextID:function(){ return this.DataContext.ContextID; },
			findById:function(id){
				if(this.DataID == id){
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
			//뷰컨트롤러와 함께 바인딩되는 메서드들입니다. 렌더시 다음 아래의 메서드들은 절대 호출하면 안됩니다.
			rerender:function(){
				this.DataContext.Binder.post(this,"GLOBAL.DataBinderNeedRerender",this);
			},
			managedDataIndexExchange:function(changeTarget){
				if(changeTarget){
					this.Parent.Child.changeIndex(this.getIndex(),changeTarget.getIndex());
					this.DataContext.Binder.post(this,"GLOBAL.DataBinderIndexExchange",[this,changeTarget]);
					return true;
				}
				return false;
			},
			//상위 인덱스로
			managedDataIncrease:function(){
				var nextDataBinder = this.Parent.Child[this.Parent.Child.indexOf(this)+1];
				if (nextDataBinder) return this.managedDataIndexExchange(nextDataBinder);
				return false;
			},
			//하위 인덱스로
			managedDataDecrease:function(){
				var prevDataBinder = this.Parent.Child[this.Parent.Child.indexOf(this)-1];
				if (prevDataBinder) return this.managedDataIndexExchange(prevDataBinder);
				return false;
			},
			//현재 데이터를 제거함
			removeDataBinder:function(onlyThis){
				if(onlyThis === true) {
					this.removeFromParent();
					this.DataContext.Binder.post(this,"GLOBAL.DataBinderRemoved",this);
					this.release();
				} else {
					this.feedUpManageData(function(md){ 
						md.removeDataBinder(true);
					});
				}
			},
			release:function(){
				this.DataContext.Binder.removeListener(this);
				if(this.__response__) {
					this.DataContext.Binder.removeListener(this.__response__);
				}
				return this.view;
			},
			//하위 데이터를 추가함
			addChildData:function(data){
				if(typeof data === "function") data = data();
				if(typeof data === "object") {
					this.DataContext.feedDownDataBinderMake(data||{},this);
					var makedData = this.Child.last();
					this.DataContext.Binder.post(this,"GLOBAL.DataBinderAddedChild",{"dataID":this.DataID,"newDataBinder":makedData});
					return makedData;
				} else {
					console.warn("addChildData :: append data가 들어오지 않았습니다", data);
				}
			},
			addMemberData:function(data){
				if(this.Parent) return this.Parent.addChildData(data);
			}
		},function(DataContext,initData,dataType){
			this.DataContext = DataContext;
			this.DataID      = N.RANDKIT.base62UniqueRandom(8,'ma');
			this.Source      = new N.HashSource(initData);
			this.SourceType  = dataType || "object";
			//노드구조
			this.Child       = new N.Array();
			this.Parent      = undefined;        
			//현재 컨트롤중인 뷰컨트롤입니다.
			this.PresentorScope = undefined;
			//binder setting
			var binder = this.DataContext.Binder;
			var binderPrefix = this.DataID+".";
			binder.prefixListen(this,binderPrefix,function(value,beforeValue,key){
				this.setProp(key,value);
			});
			//bindfix
			this.Source.each(function(v,k){
				binder.beforeProperty.setProp(binderPrefix+k,v);
			});
		});

		N.MODULE("Presentor",{
			addActionEvent:function(name,method){
				if(!this._dataActions){
					this._dataActions = new N.HashSource();;
					this.ManageDataActions = new N.EventListener(this._dataActions);
				}
				this.ManageDataActions.listen(name,method);
			},
			addPlaceholderNode:function(dataID,placeholderNode){
				if( typeof dataID === "string" && N.isNode(placeholderNode) ){
					this.placeholderNodes[dataID] = placeholderNode;
				}
			},
			addBindNode:function(element,managedData,dataKey){
				this.managedData.DataContext.Binder.bindNode(element,managedData.DataID+"."+dataKey);
			},
			addActionNode:function(actionName,element,managedData,arg){
				var viewController = this;
				var _self = this;
				N.node.on(element,"click", function(){
					if(_self.ManageDataActions.hasListener(actionName)){
						_self.ManageDataActions.triggerWithOwner(managedData,actionName,arg,element,_self);
					} else {
						console.warn("MVVM::no had action",actionName);
					}
				});
			},
			setDataBinder:function(managedData){
				var findDataBinder;
				if(N.isModule(managedData,"DataContext")){
					findDataBinder = managedData.getRootDataBinder();
				} else if(N.isModule(managedData,"DataBinder")) {
					findDataBinder = managedData;
				} else if(typeof managedData === 'object') {
					findDataBinder = new N.DataContext(managedData).getRootDataBinder();
				}
				if(!findDataBinder){
					console.warn("setDataBinder::managedData 오브젝트가 필요합니다. 들어온 값->", managedData);
					return false;
				}
		
				if(this.managedData){
					if(this.managedData.DataContext === findDataBinder.DataContext){
						return true;
					}
					if(this.managedData.DataContext !== findDataBinder.DataContext){
						this.managedData.DataContext.Binder.removeListener(this);
					}
				}
				
				this.managedData = findDataBinder;
				var currentBinder = findDataBinder.DataContext.Binder;
		
				currentBinder.listen(this,"GLOBAL.DataBinderNeedRerender",function(rerenderDataBinder){
					//부모의 placehoder를 찾음
					var parentDataBinder = rerenderDataBinder.getParentDataBinder();
					if(parentDataBinder) {
						//부모의 placeholder가 존재해야 작동함
						var parentPlaceHolder = this.placeholderNodes[parentDataBinder.getDataID()];
						var beforeElement     = this.structureNodes[rerenderDataBinder.getDataID()];
						var beforePlaceHolder = this.placeholderNodes[rerenderDataBinder.getDataID()];
						
						if(!beforeElement) console.error('rerender 대상의 데이터를 찾을 수 없습니다.') ;
						if(parentPlaceHolder) {
							//바꿔치기 하기
							this.needDisplay(rerenderDataBinder,parentPlaceHolder,true);
							N.node.before(beforeElement,this.structureNodes[rerenderDataBinder.DataID]);
							//placeHolder를 가지고 있었을 경우에만 호출됨
							if(beforePlaceHolder) N.node.append(this.placeholderNodes[rerenderDataBinder.DataID],beforePlaceHolder.children);
							//remove binder
							rerenderDataBinder.DataContext.Binder.removeListenerWithNode(beforeElement);
							N.node.remove(beforeElement);
						} else {
							return console.error("부모의 placeholder가 존재해야 rerender가 작동할수 있습니다.");
						}
					} else {
						this.needDisplay(rerenderDataBinder);
					}
					this.ManagePresentorEvent.trigger("dataChange","rerender",rerenderDataBinder,this.structureNodes[rerenderDataBinder.DataID]);
					this.ManagePresentorEvent.trigger("displayChange",this,this.view);
				});
		
				currentBinder.listen(this,"GLOBAL.DataBinderIndexExchange",function(changesDataBinder){
					
					var node1 = this.structureNodes[changesDataBinder[0].DataID];
					var node2 = this.structureNodes[changesDataBinder[1].DataID];
			
					if(node1 && node2){
						var nodeHelper1 = N.create("div");
						var nodeHelper2 = N.create("div");
						N.node.before(node1,nodeHelper1);
						N.node.before(node2,nodeHelper2);
						N.node.before(nodeHelper1,node2);
						N.node.before(nodeHelper2,node1);
						N.node.remove(nodeHelper1);
						N.node.remove(nodeHelper2);
	
						this.ManagePresentorEvent.trigger("dataChange","position",changesDataBinder[0],node1);
						this.ManagePresentorEvent.trigger("dataChange","position",changesDataBinder[1],node2);
					}
				});
		
				currentBinder.listen(this,"GLOBAL.DataBinderRemoved",function(managedData){
					var dataID = managedData.DataID;
					if(this.structureNodes[dataID]){
						var _self = this;
						//바인드값 삭제
						managedData.DataContext.Binder.removeListenerWithNode(this.structureNodes[dataID]);
						
						//스트럭쳐 노드 삭제				
						N.node.remove(this.structureNodes[dataID])
						delete this.structureNodes[dataID];
						//	
						this.ManagePresentorEvent.trigger("dataChange","remove",managedData);
						this.ManagePresentorEvent.trigger("displayChange",this,this.view);
					}
					//
					if(this.placeholderNodes[dataID]) delete this.placeholderNodes[dataID];
				});
				currentBinder.listen(this,"GLOBAL.DataBinderAddedChild",function(params){
					try {
						if(this.placeholderNodes[params.dataID]) {
						
							this.needDisplay(params.newDataBinder,this.placeholderNodes[params.dataID]);
							this.ManagePresentorEvent.trigger("dataChange","append",params.newDataBinder,this.structureNodes[params.newDataBinder.DataID]);
							this.ManagePresentorEvent.trigger("displayChange",this,this.view);
						}
					} catch(e) {
						console.log(e);
						console.log(this.placeholderNodes);
						debugger;
					}
					
				});				
				currentBinder.listen(this,"GLOBAL.DataBinderWasSetValue",function(managedData){
					this.ManagePresentorEvent.trigger("propChange","bind",managedData,this.structureNodes[managedData.DataID])
					this.ManagePresentorEvent.trigger("displayChange",this,this.view);
				});
		
				//end
				return true;		
			},
			needDisplay:function(managedData,rootElement,sigleRenderMode){
				//기본적으로 존재하지 않는값을 경고해줌
				if(!this.managedData) console.warn("DataContextViewController:: Must need set DataBinder before needDisplay");
				if(!this.viewModel) console.warn("DataContextViewController:: Must need set ViewModel before needDisplay");
				//파라메터 두개가 존재하지 않으면 초기화 진행을 한다
				if( (!managedData) && (!rootElement) ){
					this.view.innerHTML= '';
					this.bindValueNodes = new N.Array();
					this.structureNodes = {};
					this.placeholderNodes = {};
					this.selectIndexes  = new N.Array();
				}
				managedData     = managedData || this.managedData;
				rootElement     = rootElement || this.view;
				var viewController = this;
				var feedCollection = N.arrays(this.managedData.getDepth());
				var lastFeed       = null;
				var topLevel       = this.managedData.getLevel();
				var startDepth     = managedData.getLevel();

				//후가공
				var renderPostpress = function(node,managedData,depth){
					node.setAttribute('data-managed-id',managedData.DataID);
					node.setAttribute('data-managed-depth',depth);
				};

				if (sigleRenderMode == true) {
					// 메니지드 데이터에 현재 스코프를 등록함
					managedData.PresentorScope = viewController;
					//slngleRenderMode의 관리는 매우 중요함 else문의 블럭과 동일하게 동작하도록 주의할것
					var renderResult = viewController.viewModel.needRenderView(startDepth-topLevel,managedData,[],viewController);
					renderPostpress(renderResult,managedData,startDepth - topLevel);
					// 루트에 추가함
					rootElement.appendChild(renderResult);
					// 그린내역을 기록함
					if(N.isNode(renderResult) || N.isTextNode(renderResult)) viewController.structureNodes[managedData.DataID] = renderResult;
					// 현재 스코프를 지움
					managedData.PresentorScope = undefined;
				} else {
					managedData.feedUpManageData(function(managedData,depth){
						// 마지막 피드가 존재하지 않으면 depth값을 초기화함
						if (lastFeed == null) lastFeed = depth;

						// 메니지드 데이터에 현재 스코프를 등록함
						managedData.PresentorScope = viewController;

						var renderResult;

						if (depth == startDepth) {
							// 최상위 렌더링
							renderResult = viewController.viewModel.needRenderView(depth-topLevel,managedData,feedCollection[depth+1],viewController);
							renderPostpress(renderResult,managedData,depth);
							//루트에 추가
							rootElement.appendChild(renderResult);
							//컨테이너에 추가
							if( viewController.placeholderNodes[managedData.DataID] ) N.node.append(viewController.placeholderNodes[managedData.DataID],feedCollection[depth+1]);
							feedCollection[depth+1] = [];
						} else if (depth < lastFeed) {
							// 렌더 피드가 올라감
							var renderResult = viewController.viewModel.needRenderView(depth-topLevel,managedData,feedCollection[lastFeed],viewController);
							renderPostpress(renderResult,managedData,depth);
							//컨테이너에 추가
							if( viewController.placeholderNodes[managedData.DataID] ){ 
								N.node.append(viewController.placeholderNodes[managedData.DataID],feedCollection[lastFeed])
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
						if(N.isNode(renderResult) || N.isTextNode(renderResult)) viewController.structureNodes[managedData.DataID] = renderResult;

						// 현재 스코프를 지움
						managedData.PresentorScope = undefined;
	
					},startDepth);
				}
				this.ManagePresentorEvent.trigger("displayChange",this,this.view);
				return this;
			},
			needDisplayWithViewModel:function(newViewModel){
				this.viewModel = newViewModel;
				this.needDisplay();
			},
			needDisplayWithData:function(data){
				this.setDataBinder(data) ? this.needDisplay() : console.warn("데이터를 초기화하는데 실패하였습니다. 데이터의 형식이 잘못되었습니다.",data);
			},
			findByDataBinder:function(managedData){
				return this.structureNodes[managedData.getDataID()];
			},
			findByManagedId:function(managedDataID){
				return this.structureNodes[managedDataID];
			},
			findByIndex:function(){
				var selectQuery = N.dataFilter(N.argumentsFlatten(arguments),function(v){ return (typeof v === "number" || v === "*")?true:false; },N.dataMap,function(v,i){
					return v === "*" ? "[data-managed-depth=\""+i+"\"]" : "[data-managed-depth=\""+i+"\"]:nth-child("+(v+1)+")";
				}).join(" ");
				return new nd.NodeHandler(selectQuery,this.view);
			},
			getDataBinderByNode:function(node,strict){
				if(strict === true) {
					for(var key in this.structureNodes) if(this.structureNodes[key] === node) return this.managedData.getDataBinderWithID(key);
				} else {
					if( N.node.is(node,'[data-managed-id]') ) return this.getDataBinderByNode(node,true);
					var parentNode = N.findParent(node,'[data-managed-id]');
					if(parentNode) return this.getDataBinderByNode(parentNode,true);
				}
			},
			getRootDataBinder:function(){
				return this.managedData;
			},
			getDataBinderByIndex:function(){
				var _dataContext = this.getRootDataBinder();
				return N.dataMap(this.findByIndex.apply(this,Array.prototype.slice.call(arguments)),function(node){
					return _dataContext.getDataBinderWithID(nd.node.data(node,"managed-id"));
				});
			}
		},function(view,managedData,viewModel,needDisplay){
			this.view = N.findLite(view)[0];
			if(!this.view) console.error('초기화 실패 View를 찾을수 없음 => ', view);
			
			this.structureNodes = {};
			this.placeholderNodes = {};
			
			//events
			this.ManagePresentorEvent = new N.EventListener(this);
			this.ManagePresentorEvent.addEventRegister(["propChange","dataChange","displayChange"]);
			this.ManagePresentorEvent.addTriggerRegister(["displayChange"]);
			this.addActionEvent("up",function(arg,el,vc){
				console.log("tup")
				if(typeof arg === "function") {
					if( arg(this,element) != false ) this.managedDataDecrease();
				} else {
					this.managedDataDecrease();
				}
			});
			this.addActionEvent("down",function(arg,el,vc){
				console.log("tdow")
				if(typeof arg === "function") {
					if( arg(this,element) != false ) this.managedDataIncrease();
				} else {
					this.managedDataIncrease();
				}
			});
			this.addActionEvent("append",function(arg,el,vc){ console.log("ap"); this.addChildData(arg); });
			this.addActionEvent("delete",function(arg,el,vc){ console.log("de"); this.removeDataBinder(); });
			
			this.viewModel = viewModel ? N.isArray(viewModel) ? N.ViewModel.new.apply(undefined,N.toArray(viewModel)) : viewModel : new N.ViewModel();
			
			if(managedData)this.setDataBinder(managedData);

			//needDisplay
			if(typeof needDisplay === "function") needDisplay = N.CALL(needDisplay,this);
			if(needDisplay === true) this.needDisplay();
		});
		N.METHOD("workerOfLinearVector",function(x,y,epsilon){
			epsilon = (typeof epsilon === "number") ? epsilon : 1;
			var pointX = N.parseInt(x);
			var pointY = N.parseInt(y);
			if(pointX === pointY){ return function(){ return pointX; }; }
			return function(t){
				return pointX + (((pointY - pointX) / epsilon) * t);
			};
		});
		N.METHOD("workerOfCubicBezier",function(x1, y1, x2, y2, epsilon){
			epsilon = (typeof epsilon === "number") ? epsilon : 1;
			var curveX = function(t){
					var v = 1 - t;
					return 3 * v * v * t * x1 + 3 * v * t * t * x2 + t * t * t;
				};

				var curveY = function(t){
					var v = 1 - t;
					return 3 * v * v * t * y1 + 3 * v * t * t * y2 + t * t * t;
				};

				var derivativeCurveX = function(t){
					var v = 1 - t;
					return 3 * (2 * (t - 1) * t + v * v) * x1 + 3 * (- t * t * t + 2 * v * t) * x2;
				};

				return function(t){

					var x = t, t0, t1, t2, x2, d2, i;

					for (t2 = x, i = 0; i < 8; i++){
						x2 = curveX(t2) - x;
						if (Math.abs(x2) < epsilon) return curveY(t2);
						d2 = derivativeCurveX(t2);
						if (Math.abs(d2) < 1e-6) break;
						t2 = t2 - x2 / d2;
					}

					t0 = 0, t1 = 1, t2 = x;

					if (t2 < t0) return curveY(t0);
					if (t2 > t1) return curveY(t1);

					while (t0 < t1){
						x2 = curveX(t2);
						if (Math.abs(x2 - x) < epsilon) return curveY(t2);
						if (x > x2) t0 = t2;
						else t1 = t2;
						t2 = (t1 - t0) * .5 + t0;
					}

					// Failure
					return curveY(t2);

				};
		});
	
		N.MODULE("Binder",{
			shouldSendValueToListenersInfo:function(listeners,setValue,dataName){
				var beforeValue = this.beforeProperty.prop(dataName);
				//set send
				this.protectProperty.add(dataName);
				(new N.Array(listeners)).each(function(listenInfo){
					listenInfo.proc.call(listenInfo.listener,setValue,beforeValue,listenInfo.mutableKey);
				});
				this.beforeProperty.setProp(dataName,setValue);
				this.protectProperty.remove(dataName);
			},
			getListenInfo:function(listener,propertyName){
				if(!listener) return this.Source.get();
				var propertyName = (typeof propertyName === "string")?propertyName:this.defaultKey;
				return this.Source.filter(function(listenInfo){
					return (listenInfo.listener === listener && listenInfo.propertyName === propertyName);
				});
			},
			send:function(sender,dataName,setValue,forceLevel,allowDuplicateSend){
				if(this.protectProperty.has(dataName)){
					this.trace && console.info(sender,"was make duplicate send (",dataName,") is still processing => ", setValue);
					return false;
				}
				//duplicate value sending protect
				var beforeValue = this.beforeProperty.prop(dataName);
				if(allowDuplicateSend !== true && setValue === beforeValue){
					this.trace && console.info(sender,"send is same from before value.");
					return false;
				}
				var sendTargets = this.Source.map(function(listenInfo){
					if(sender !== listenInfo.listener) {
						if(listenInfo.prefixListen === true){
							var prefixLength = listenInfo.propertyName.length;
							if(dataName.substr(0,prefixLength) === listenInfo.propertyName){
								listenInfo.mutableKey = dataName.substr(prefixLength);
								return listenInfo;
							}
						} else if(dataName === listenInfo.propertyName) {
							listenInfo.mutableKey = dataName;
							return listenInfo;
						}
					}
				}).remove(undefined);
				
				//allow inspect
				var allowProc    = true
				var forceLevel   = (typeof forceLevel === "number") ? forceLevel : 0;
				var _self        = this;
				sendTargets.each(function(listenInfo){
					if(listenInfo.allowProc){
						if( listenInfo.allowProc(setValue,beforeValue) === false ){
							if(listenInfo.protectLevel >= forceLevel) {
								//transaction
								_self.shouldSendValueToListenersInfo(_self.getListenInfo(sender,dataName),beforeValue,dataName);
								return allowProc = false;
							}
						}
					}
				});
				
				//set data
				if(allowProc === true) this.shouldSendValueToListenersInfo(sendTargets,setValue,dataName);
			},
			post:function(sender,dataName,setValue,forceLevel){
				this.send(sender,dataName,setValue,forceLevel,true);
			},
			listen:function(listener,propertyName,proc,allowProc,protectLevel,prefixListen){
				//value inspect
				if(typeof listener !== "object" || typeof propertyName !== "string" || typeof proc !== "function"){
					return console.error("BindAdapter::listen arguments must be (listener,propertyName,proc)(object,string,fucntion)=>",arguments);
				}
				//duplicate listen & property inspect
				if(this.Source.isAny(function(listenInfo){
					return (listenInfo.listener === listener && listenInfo.propertyName === propertyName);
				})){
					return console.error("BindAdapter:: already set listener & property");
				}
				var listenInfo = {
					listener:listener,
					propertyName:propertyName,
					proc:proc,
					allowProc:allowProc,
					protectLevel:(typeof protectLevel === "number") ? protectLevel : 0,
					prefixListen:!!prefixListen,
					mutableKey:propertyName
				};
				this.Source.push(listenInfo);
				
				//beforeProperty set
				if(this.beforeProperty.has(propertyName)){
					this.shouldSendValueToListenersInfo(listenInfo,this.beforeProperty.prop(propertyName),propertyName);
				}
			},
			prefixListen:function(listener,propertyName,proc,allowProc,protectLevel){
				//value inspect
				if(typeof listener !== "object" || typeof propertyName !== "string" || typeof proc !== "function"){
					return console.error("BindAdapter::listen arguments must be (listener,propertyName,proc)(object,string,fucntion)=>",arguments);
				}
				this.listen(listener,propertyName,proc,allowProc,protectLevel,true);
			},
			selfSend:function(setValues,dataName,forceLevel){
				return this.send(this,propertyName,proc,allowProc,protectLevel);
			},
			selfListen:function(propertyName,proc,allowProc,protectLevel){
				return this.listen(this,propertyName,proc,allowProc,protectLevel);
			},
			prop:function(){
				return this.beforeProperty.prop.apply(this.beforeProperty,Array.prototype.slice.call(arguments));
			},
			setProp:function(){
				return this.beforeProperty.setProp.apply(this.beforeProperty,Array.prototype.slice.call(arguments));
			},
			inspect:function(allowProc,propertyName,protectLevel){
				var propertyName = (typeof propertyName === "string")?propertyName:this.defaultKey;
				if(typeof allowProc !== "function"){
					return console.error("BindAdapter::inspect arguments must be (inspectProc,propertyName)(string,fucntion)");
				}
				this.listen(this,propertyName,function(){},allowProc,protectLevel);
			},
			bindNode:function(node,propertyName,propFilter){
				var listener = N.find(node,0);
				if(listener) {
					var propertyName = (typeof propertyName === "string")?propertyName:this.defaultKey;
					//send node
					switch(listener.tagName.toLowerCase()){
						case "input" : case "select":
							var binder = this;
							N.node.on(listener,"keyup",function(e) {
								binder.send(listener,propertyName,N.node.value(listener));
							});
						default: /*readOnly*/ break;
					};
					//listen node
					this.listen(listener,propertyName,function(value){
						if(typeof propFilter === "function"){ 
							value = propFilter(value);
							if(typeof value === "object" && listener.tagName !== "input"){
								var nodes = N.find(value);
								if(nodes.length) return N.node.put(listener,nodes);
							}
						}
						N.node.value(listener,value);
					});
				}
			},
			getListener:function(){
				return this.Source.map(function(listenInfo){ return listenInfo.listener }).setUnique();
			},
			getListenerByKey:function(key){
				return this.Source.filter(function(listenInfo){ 
					return listenInfo.propertyName === key;
				}).setUnique();
			},
			getProperties:function(){
				return this.Source.map(function(listenInfo){ return listenInfo.propertyName }).setUnique();
			},
			removeListener:function(listener){
				this.Source.setFilter(function(listenInfo){
					return (listenInfo.listener === listener) ? false : true;
				});
			},
			removeListenerWithNode:function(nodeListener){
				var _self = this;
				_self.Source.setFilter(function(listenInfo){
					var filterTarget = true;
					N.find(nodeListener,N.dataEach,function(rootNode){
						N.find("*",rootNode,N.dataEach,function(node){
							if(listenInfo.listener === node){
								filterTarget = false;
								return false;
							}
						});
					});
					return filterTarget;
				});
			},
			removeListen:function(listener,propertyName){
				this.Source.setFilter(function(listenInfo){
					return (listenInfo.listener === listener && listenInfo.propertyName === propertyName) ? false : true;
				});
			},
			removeProperty:function(propertyName){
				this.Source.setFilter(function(listenInfo){
					return (listenInfo.propertyName === propertyName) ? false : true;
				});
			}
		},function(defaultData,defaultKey,trace){ 
			//console trace
			this.trace           = trace;
			this.Source          = new N.Array();
			this.defaultKey      = (typeof defaultKey === "string") ? defaultKey : "default"
			//dobule set protect
			this.protectProperty = new N.Array();
			if(!N.isNil(defaultData) && typeof defaultData !== "object"){
				var redefine = {};
				redefine[this.defaultKey] = defaultData;
				defaultData = redefine;
			}
			this.beforeProperty  = new N.HashSource(defaultData);
			// { listener:Object , listen:"name" ,proc: }
		});
	
		N.MODULE("Counter",{
			timeoutHandler:function(){
				if(this._timeout)clearTimeout(this._timeout);
				var now = (+(new Date()));
				if( this._moveEnd > now ) {
					this._countProcesser ?
						N.CALL(this._whenCounting,this,this._countProcesser(1-(this._moveEnd-now)/this.duration)) :
						N.CALL(this._whenCounting,this,1-(this._moveEnd-now)/this.duration);
					var _ = this;
					this._timeout = setTimeout(function(){ _.timeoutHandler.call(_) },this.rate);
				} else {
					this.moveStart = null;
					this.moveEnd   = null;
					N.CALL(this._whenCounting,this,1);
					N.CALL(this._whenCountFinish,this,1);
				}
			},
			whenCountStart :function(m){ this._whenCountStart = m; },
			whenCount      :function(m){ this._whenCounting = m; },
			whenCountFinish:function(m){ this._whenCountFinish = m; },
			setCountProcessor:function(m){
				if(typeof m === "function") this._countProcesser = m;
			},
			setRate:function(rate){
				this.rate = typeof rate === 'number' ? rate : 20;
			},
			start:function(ms,counting,finish){
				this.duration = typeof ms   === 'number' ? ms : 300;
				if(counting)this.whenCount(counting);
				if(finish)this.whenCountFinish(finish);
			
				var _ = this;
				this._moveStart = (+(new Date()));
				this._moveEnd   = this._moveStart + this.duration;
				this.timeoutHandler();
			}
		},function(ms,counting,finish,rate,now){
			this.setRate(rate);
			if(finish === true || ms === true || rate === true || now === true) { this.start(ms,counting,finish) }
		});
		
		N.MODULE("Timeline",{
			updateFix:function(){
				var se = this.Status.values("timeStart","timeEnd");
				if(se[0] > this._tick){
					this._tick = se[0];
				}
				if(se[1] < this._tick){
					this._tick = se[1];
				}
			},
			append:function(){
				var _self = this;
				N.dataFlatten(arguments,N.dataEach,function(pushProperties,i){
					if( N.isModule(pushProperties,"TimeProperties") ){
						_self.Source.add(pushProperties);
					
						var ts = pushProperties.timeStart();
						var te = pushProperties.timeEnd();
					
						if(_self.Source.length === 1) {
							_self.Status.pushKeyValue("timeStart",ts,"timeEnd",te);
						} else if(_self.Source.length > 1) {
							var se = _self.Status.values("timeStart","timeEnd");
							if(se[0] > ts){
								_self.Status.pushKeyValue("timeStart",ts);
							}
							if(se[1] < te){
								_self.Status.pushKeyValue("timeEnd",te);
							}
						}
						_self.updateFix();
					}
				});
			},
			stop:function(){
				this._rate = 0;
				this._spot = null;
				if(this._wheel) this._wheel = clearInterval(this._wheel);
				return this;
			},
			move:function(timestamp,safeRate){
				//정방향일때와 아닐때
				var finished;
				if(this._rightDirection){
					var timeEnd = this.Status.get("timeEnd");
					if( timestamp > timeEnd ){
						this._tick = timeEnd;
						finished = true;
					}
				} else {
					var timeStart = this.Status.get("timeStart")
					if( timestamp < timeStart ){
						this._tick = timeStart;
						finished = true;
					}
				}
				if(finished === true){
					this.stop();
					this.EventListener.trigger("timeMove");
					this.EventListener.trigger("timeFinish");
				} else {
					this._tick = timestamp;
					this.EventListener.trigger("timeMove");
					N.CALL(this._onTimeMove,this._tick);
				}
			},
			offset:function(offset){
				this.move(this._tick + offset);
			},
			offsetExp:function(exp){
				this.move(this._tick + N.timescaleExp(exp));
			},
			//속도 1은 1초 양음수 가능
			rate:function(rate,toggle){
				if((toggle===true || toggle==="toggle") && this._rate!==0){
					return this.stop();
				}
				if(typeof rate !== "number") return console.error("Timeline::rate is must be number");
				if(this._wheel) clearInterval(this._wheel);
				if(rate !== 0) {
					var _timeline  = this;
					this._rate = rate;
					this._spot = (+new Date());
					this._rightDirection = (rate > 0);
					
					var wheelProc = function(){
						if(_timeline._rate === 0) return _timeline.stop();
						var newSpot   = (+new Date())
						var realScale = newSpot - _timeline._spot;
						var wheelSpot = _timeline._tick + (realScale * _timeline._rate);
						_timeline.move(wheelSpot,true);
						_timeline._spot = newSpot;
					}
					this._wheel = setInterval(wheelProc,this._interval);
					wheelProc();
				}
			},
			rateByTimescale:function(exp,toggle){
				return this.rate(N.timescaleExp(exp) / 1000,toggle);
			},
			timestamp:function(){
				return this._tick;
			},
			timescale:function(){
				return this.Status.values("timeEnd","timeStart",function(e,s){ return e-s; });
			},
			getTimeStart:function(){
				return this.Status.get("timeStart");
			},
			getTimeEnd:function(){
				return this.Status.get("timeEnd");
			},
			runTimescale:function(){
				if(this._rightDirection)
					return (this._tick - this.Status.get("timeStart"));
				return (this.Status.get("timeEnd") - this._tick);
			},
			restTimescale:function(){
				if(this._rightDirection)
					return (this.Status.get("timeEnd") - this._tick);
				return (this._tick - this.Status.get("timeStart"));
			},
			getCurrentData:function(){
				var currentTime = this._tick;
				return this.Source.map(function(timeProperties){
					return timeProperties.getPropWithTime(currentTime);
				});
			},
			getCurrentVectorData:function(){
				var currentTime = this._tick;
				return this.Source.map(function(timeProperties){
					return timeProperties.getVectorPropWithTime(currentTime);
				});
			},
			getTimeProperties:function(index){
				return (arguments.length) ? this.Source[index] : this.Source.clone();
			},
			getCurrentAttribute:function(index){
				if(arguments.length){
					return this.Source[index] && this.Source[index].Attribute;
				}
				return this.Source.map(function(timeProperties){
					return timeProperties.Attribute;
				});
			},
			progress:function(){
				return 100 - (100 / this.timescale()) * this.restTimescale();
			},
			restProgress:function(){
				return (100 / this.timescale()) * this.restTimescale();
			},
			setFPS:function(fps){
				this._fps      = (typeof fps === "number") ? fps : 30;
				this._interval = N.parseInt(1000 / this._fps);
			},
			clear:function(){
				this.Source = new N.Array();
				this.Status = new N.HashSource({
					timeStart:0,
					timeEnd  :0
				});
				this._tick  = 0;
				this._rate  = 0;
				this._wheel = null;
				this._rightDirection = true;
			}
		},function(fps){
			this.clear();
			if(typeof fps === "number") this.setFPS(fps);
			
			this.EventListener = new N.EventListener(this);
			this.EventListener.addEventRegister(["timeMove","timeFinish"]);
		});
		
		N.MODULE("TimeProperties",{
			insertTimeProperty:function(time,data){
				if(typeof time !== "number" || typeof data !== "object"){
					return console.error("addTimeProperty:: must be argument type (number, object)");
				} 
				var insertAt = 0, sourceLength = this.Source.length;
				this.Source.reverseEach(function(sourceProps,index){
					if(time > sourceProps.time){
						insertAt = index+1;
						return false;
					} 
				});
				this.Source.insert({
					time:time,
					props:data
				},insertAt);
				return this;
			},
			push:function(){
				var _self = this;
				N.dataFlatten(arguments,N.dataEach,function(pushData){
					if(typeof pushData !== "object"){
						var alchemy = {};
						alchemy[_self.defaultKey] = pushData;
						pushData = alchemy;
					}
					var pushTime = _self.defaultStartTime + (_self.defaultInertval * _self.Source.length);
					_self.insertTimeProperty(pushTime,pushData);
				});
				return this;
			},
			getAroundPropWithTime:function(time){
				if(typeof time !== "number") console.error("getAroundPropWithTime:: arg must be number");
				if(!this.Source.length) return {};
				if(this.Source.length === 1 || this.Source.first().time > time) { return [this.Source[0].props,undefined,0]; }
				if(this.Source.last().time < time) { return [this.Source.last().props,undefined,0]; }
				
				//if length 2
				var selectSource,selectSourceIndex;
				
				this.Source.each(function(source,index){
					if(source.time > time){
						selectSourceIndex = index - 1;
						return false;
					}
				});
				
				selectSource = this.Source[selectSourceIndex];
				
				//select last prop
				if(!selectSource){
					selectSource      = this.Source.last();
					selectSourceIndex = this.Source.length - 1;
					var beforeSource = this.Source[selectSourceIndex-1];
					return [beforeSource.props,selectSource.props,(1/(selectSource.time - beforeSource.time)) * (time - beforeSource.time)];
				}
				//other
				var afterSource = this.Source[selectSourceIndex+1];
				return [selectSource.props,afterSource.props,(1/(afterSource.time - selectSource.time)) * (time - selectSource.time)];
				
			},
			getPropWithTime:function(time){
				var aroundData = this.getAroundPropWithTime(time);
				
				if(typeof aroundData[1] === "undefined"){
					return aroundData[0];
				} else {
					return (aroundData[2] < 0.5)?aroundData[0]:aroundData[1];
				}
			},
			getVectorPropWithTime:function(time){
				var aroundData = this.getAroundPropWithTime(time);
				if(typeof aroundData[1] === "undefined"){
					return this._gto,aroundData[0];
				} else {
					var dataProps = new N.HashSource();
					dataProps.arrangementObjectsDataProp(aroundData[0],aroundData[1]);
					return dataProps.setMap(function(arrange){
						var a0n = typeof arrange[0] === "number";
						var a1n = typeof arrange[1] === "number";
						if(a0n && a1n){
							return arrange[0] + ( (arrange[1] - arrange[0]) * aroundData[2] );
						} else if(a0n) {
							return arrange[0];
						} else if(a1n) {
							return arrange[1];
						} else {
							return arrange[0] && arrange[1];
						}
					}).get();
				}
			},
			
			timeStart:function(){
				var timeProps = this.Source.first();
				return timeProps ? timeProps.time : null;
			},
			timeEnd:function(){
				var timeProps = this.Source.last();
				return timeProps ? timeProps.time : null;
			},
			timeLength:function(){
				return this.Source.isNone() ? null :
						this.Source.isOne() ? 0 :
						this.timeStart() - this.timeEnd();
			}
		},function(attr,interval,startTime,defaultKey){
			this.Source    = new N.Array();
			this.Attribute = (new N.HashSource(attr)).get();
			this.defaultKey = (typeof defaultKey === "string") ? defaultKey : "value"
			this.defaultStartTime = startTime ? N.timestampExp(startTime): N.timestampExp();
			this.defaultInertval  = interval  ? N.timescaleExp(interval) : N.timescaleExp("2s");
		});
	
		N.EXTEND_MODULE("Counter","BezierCounter",{
			setCubicBezier:function(x1,x2,y1,y2){
				this.setCountProcessor(N.workerOfCubicBezier(
					(typeof x1 === "number") ? x1 : 0,
					(typeof x2 === "number") ? x2 : 0,
					(typeof y1 === "number") ? y1 : 0,
					(typeof y2 === "number") ? y2 : 0
				));
			}
		},function(x1,x2,y1,y2,ms,counting,finish,rate,now){
			this.setCubicBezier(x1,x2,y1,y2)
			this._super(ms,counting,finish,rate,now);
		});
	
		N.MODULE("TimeFire",{
			cancel:function(withEvent){
				if(withEvent !== false) N.CALL(this._whenCancle,this);
				clearTimeout(this._timeout);
				this._timeout = null;
			},
			trigger:function(withEvent){
				if(withEvent !== false) {
					if( N.CALL(this.whenTriggering,this) === false ) {
						return;
					}
				} 
				if( this._timeout ) clearTimeout(this._timeout);
				var _ = this;
				this._timeout = setTimeout(function(){
					if( N.CALL(_._whenWillFire,_) !== false ) {
						N.CALL(_._whenFire,_);
						N.CALL(_._whenDidFire,_);
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
				if(typeof m !== 'function') console.error('TimeFire:: Fire시 메서드가 들어오지 않았습니다.');
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
	
		N.MODULE("ResizeNode",{
			width:function(){
				return this.Source.offsetWidth;
			},
			height:function(){
				return this.Source.offsetHeight;
			},
			trigger:function(data){
				this.Handler(data);
			},
			destroy:function(){ N.node.off(window,'resize',this.Handler); }
		},function(target,triggeringMethod,firstTriggering,delay){
			this.Source = N.findLite(target)[0];
			this.TriggeringMethod = triggeringMethod;
			this.Delay          = N.toNumber(delay);
		
			if(this.Source && this.TriggeringMethod) {
			
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
								if( N.findParents(_.Source,N.dataLast).tagName !== 'HTML' ) return;
						
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
			
				N.node.on(window,'resize',this.Handler);
			}
		});
		
		
		N.MODULE("Gesture",function(gestureView,allowOuterMove,allowVitureTouch){
			this.view = N.findLite(gestureView)[0];
			
			if(!this.view) return console.error("Gesture::no find gestrue view");
			
			this.GestureListener = {};
			this._firstPinchValue;
			this._firstPageX;
			this._firstPageY;
			this._lastPageX;
			this._lastPageY;
			this.stopPropagation = true;
			this.preventDefault  = true;
			//touch event
			this.EventListener = new N.EventListener(this);
			this.EventListener.addEventRegister(["gesture","drag","throw","pinch"]);
			var EventListener = this.EventListener;
			var _self = this;
			var getPinchDistance = function(fx1,fy1,fx2,fy2){
				return Math.sqrt(
					Math.pow((fx1-fx2),2),
					Math.pow((fy1-fy2),2)
				);
			};
			this._gestureStartHandler = function(e){
				if(EventListener.hasListener()){
					var pageX = _self._firstPageX = _self._lastPageX = e.touches ? e.touches[0].pageX : e.pageX;
					var pageY = _self._firstPageY = _self._lastPageY = e.touches ? e.touches[0].pageY : e.pageY;
					
					_self._lastGesture = {
						e:e,
						pageX:pageX,
						pageY:pageY,
						relativeX:0,
						relativeY:0,
						moveX:0,
						moveY:0
					};
					
					if (EventListener.hasListener("pinch") && e.touches && e.touches.length === 2) {
						e.preventDefault();
						_self._firstPinchValue = getPinchDistance(
							 pageX,
							 pageY,
							 e.touches[1].pageX,
							 e.touches[1].pageY
						);
						_self._lastGesture.pinch = 1;
						EventListener.trigger("pinch",_self._lastGesture,"start");
					}
					EventListener.trigger("gesture",_self._lastGesture,"start");
					
					if(_self.stopPropagation===true)e.stopPropagation();
					if(_self.preventDefault===true) e.preventDefault();
				}
			}
		
			this._gestureMoveHandler = function(e){
				//TouchMoveX를 체크하는 이유는 시작한 터치무브가 존재하지 않을경우에는 작동되지 않음 (바깥쪽 이벤트가 Touch끼리 서로 섞이지 않게 하기 위함)
				if(EventListener.hasListener() && _self._firstPageX !== undefined){
					var pageX = e.touches ? e.touches[0].pageX : e.pageX;
					var pageY = e.touches ? e.touches[0].pageY : e.pageY;
					
					_self._lastGesture = {
						e:e,
						pageX:pageX,
						pageY:pageY,
						relativeX:pageX - _self._firstPageX,
						relativeY:pageY - _self._firstPageY,
						moveX:pageX - _self._lastPageX,
						moveY:pageY - _self._lastPageY
					}
					
					_self._lastPageX = pageX;
					_self._lastPageY = pageY;
					
					if (EventListener.hasListener("pinch") && (typeof _self._firstPinchValue === "number") && e.touches && e.touches.length === 2) {
						e.preventDefault();
						var pinchDistance = getPinchDistance(
							 e.touches[0].pageX,
							 e.touches[0].pageY,
							 e.touches[1].pageX,
							 e.touches[1].pageY
						);
						_self._lastGesture.pinch = -((_self._firstPinchValue / pinchDistance) - 1);
						EventListener.trigger("pinch",_self._lastGesture,"move");
						
					}
					EventListener.trigger("gesture",_self._lastGesture,"move");
					
					if(_self.stopPropagation===true)e.stopPropagation();
					if(_self.preventDefault===true) e.preventDefault();
				}
			};
		
			this._gestureEndHandler = function(e){
				if(EventListener.hasListener() && _self._firstPageX !== undefined){
					
					if (EventListener.hasListener("pinch") && (typeof _self._firstPinchValue === "number") && e.touches && e.touches.length === 2) {
						this.EventListener.trigger("pinch",_self._lastGesture,"end");
					}
					EventListener.trigger("gesture",_self._lastGesture,"end");
					
					_self._firstPageX = _self._lastPageX = undefined;
					_self._firstPageY = _self._lastPageY = undefined;
					_self._firstPinchValue = undefined;
					_self._lastGesture = undefined;
					
					if(_self.stopPropagation===true)e.stopPropagation();
					if(_self.preventDefault===true) e.preventDefault();
				}
			};
			
			N.node.punch(this.view,"mousedown",this._gestureStartHandler);
			N.node.punch(document.body,"mousemove",this._gestureMoveHandler);
			N.node.punch(document.body,"mouseup",this._gestureEndHandler);
			
		});
		
	})(window,N,N.ENV);
})();