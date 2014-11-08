// important!
// It is not the official version (If you want use this code, please use in commercial 'TweenMax' license.)
// 이것은 배포 버전이 아닙니다. 상업적 이용은 TweenMax 라이센스를 취득후 사용해주세요.

// Move Version 1.4
// Require TweenMax and ScrollToPlugin For TweenMax.

(+(function(){
	//action // movement
	makeModule("Action",{
		addMovement : function(){
			var _value = this.Source;
			var _movements = _Array(arguments).filter(function(target){
				if(_Type(target).isInstance("Movement")){
					_value.push(target);
				} else {
					return false;
				}
			});
			return this;
		},
		addMovements : function(params) {
			this.addMovement.apply(this,params);
			return this;
		},
		play : function(playoption) {
			var own = this;
			this.Source.each(function(_movement,i){
				_movement.clearEvent("final");
				//progressive
				if(own.ActionMovementOption.progressive) _movement.delay(own.ActionMovementOption.progressive * i);
				//play
				_movement.play();
			}).getLast().addEvent("final",function(){
				own.toggleEvent("complete");
			});
			return this;
		},
		stop : function() {
			this.Source.each(function(_movemenet){ _movemenet.stop(); });
		},
		reverse:function(){
			this.play("reverse");
		},
		toggleEvent: function(eventType) { var own = this; var _events = _Array(this.currentEvent[eventType]); if (_events.length) _events.each(function(eventMethod) { eventMethod.call(own.Value,own); }); return this; },
		clearEvent  : function(eventName) { 
			if(eventName) if(this.currentEvent[eventName]) {
				this.currentEvent[eventName];
				return this;
			} else {
				return this;
			}
			for(var key in this.currentEvent) this.currentEvent[key] = [];
			return this; 
		},
		addEvent   : function(eventName,eventMethod) { if (typeof eventMethod == "function") if (this.currentEvent[eventName]) this.currentEvent[eventName].push(eventMethod); return this; },
		complete    : function(method) { this.addEvent("complete",method); }
	},function(attributed){
		this.ActionIndex          = 0;
		this.ActionMovementOption = CLONE(TOOBJECT(attributed));
		this.Source = _Array();
		//event
		var own = this;
		this.currentEvent = { "complete":[],"master":[] };
	});
	makeModule("TimelineInterface",{
		toggleEvent : function(eventName) { 
			var own = this,_events = _Array(this.MoveEvent[eventName]); if (_events.length) _events.each(function(eventMethod) { eventMethod.call(own.Source,own); }); return this; 
		},
		clearEvent  : function(eventName) { 
			if(eventName) if(this.MoveEvent[eventName]) {
				this.MoveEvent[eventName];
				return this;
			} else {
				return this;
			}
			for(var key in this.MoveEvent) this.MoveEvent[key] = [];
			return this; 
		},
		addEvent    : function(eventName,eventMethod) { if (typeof eventMethod == "function") if (this.MoveEvent[eventName]) this.MoveEvent[eventName].push(eventMethod); return this; },
		complete    : function(method) { this.addEvent("complete",method); }
	},function(){
		this.MoveEvent = {
			"begin"    : [],
			"complete" : [],
			"final"   : [] 
		}
		
		//timeline
		var own = this;
		this.MovementTimeLine = new TimelineMax({
			"onStart":function(){ own.toggleEvent("begin");},
			"onComplete":function(){
				own.toggleEvent("complete");
				own.toggleEvent("final");
			}
		});
		this.MovementTimeLine.pause();
	});
	extendModule("TimelineInterface","Move",{
		play : function() { this.MovementTimeLine.play(); return this; },
		kill : function() { this.MovementTimeLine.kill(); return this; },
		playAndKill : function() { 
			this.addEvent("final",function(){ own.kill(); });
			var own = this.play();
			return this; 
		},
		stop    : function() { this.MovementTimeLine.stop();   return this; },
		resume  : function() { this.MovementTimeLine.resume(); return this; },
		delay   : function(t) { this.MovementTimeLine.delay(t/1000); }
	},
	function(element,movevalue,beginEvent,completeEvent){
		//super init
		this._super();
		this.MovementOption = {};
		
		//target
		this.Source = FINDZERO(element);
		if(!ISELNODE(this.Source)) {
			if(ISWINDOW(element) || ISDOCUMENT(element)){ this.Source = element; } else {
				console.log("error params => ",TOSTRING(arguments));
				throw new Error("Movement를 초기화 하는 인자에 문제가 있습니다" + TOS(element) + " => " + TOS(this.Source));
			}
		}
		
		//event
		if(beginEvent)    this.addEvent("begin",   beginEvent);
		if(completeEvent) this.addEvent("complete",completeEvent);

		//move_que
		this.que   = movevalue ? [TOOBJECT(movevalue)] : [];
		
		//console.log("que info",movevalue,"->",TOSTRING(this.que));
		
		for(var i=0; i < this.que.length; i++) {
			var target = this.que[i],duration;
			target.ease = Strong.easeOut;
			
			//duration fix
			if("duration" in target){
				duration = target["duration"];
				delete target["duration"];
			} else {
				duration = 1000;
			}
			//scroll fix
			if(typeof target.scrollTop == "string" || typeof target.scrollTop == "number"){
				target.scrollTo = {y:parseFloat(target.scrollTop)};
				delete target.scrollTop;
			}
			
			//console.log("move duration info",this.Source,duration);
			this.MovementTimeLine.to( this.Source, duration / 1000, target );
		}
		if(this.__NativeClass__("Move")) this.playAndKill();
	});
	extendModule("Move","Movement",{
		relative: function() { _Element(this.Source).layerInterface();return this; },
		to      : function(t){ this.MovementTimeLine.seek(t/1000); return this; },
		speed   : function(s){ this.MovementTimeLine.timeScale(s); return this; }
	},function(element,movevalue,beginEvent,completeEvent){
		this._super(element,movevalue,beginEvent,completeEvent);
	});
	
	makeGetter("ELFLASH",function(){
		if(typeof loc == "function"){
			callback = loc;
			loc      = undefined;
		}
		var nodes = FIND(s,loc);
		var fs = 30;
		var fe = 1300;
		for(var i=0,l=nodes.length;i<l;i++){
			var node = nodes[i],prev;
			if("onflash" in node){
				prev = node.onflash;
			} else {
				var prop = ELSTYLE(node,"background-color");
				prev = prop;
				node.onflash = prop;
			}
			_Move(node,{"background-color":"rgba(255,255,140,0.5)","duration":fs},undefined,function(){
				if(ISNOTHING(prev)){
					_Move(node,{"background-color":"rgba(255,255,170,0)","duration":fe},undefined,function(){
						ELSTYLE(node,"background-color",prev);
						delete node["onflash"];
						CALLBACK(callback);
					});
				} else {
					_Move(node,{"background":prev,"duration":fe},undefined,function(){
						ELSTYLE(node,"background-color",prev);
						delete node["onflash"];
						CALLBACK(callback);
					});
				}
			});
		}
	});
	
	//Load tweenmax script
	var root  = FUT.LOADINGSCRIPTROOT();
	FUT.INCLUDE(root + "TweenMax.js");
	FUT.INCLUDE(root + "ScrollToPlugin.min.js");
	
})());