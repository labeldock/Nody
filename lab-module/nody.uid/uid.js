//******************
//EventInterface
makeModule("EventInterface",{
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
	this.EventInterfaceData    = {};
	this.EventInterfaceDefault = {};
});
