// Author                 // hojung ahn (open9.net)
// Concept                // DHTML RAD TOOL
// tested in              // IE9 + (on 4.0) & webkit2 & air13
// lincense               // MIT lincense
(+(function(W,NativeCore){
	var nodyCoreVersion = "1.0";
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
	dataConstructorPrototype = {
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
		for(var key in dataConstructorPrototype) NativeCore.Structure[n].prototype[key] = dataConstructorPrototype[key];
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
})(window,{
	Getters:[],
	Singletons:{},
	Modules:{},
	Structure:{}
}));