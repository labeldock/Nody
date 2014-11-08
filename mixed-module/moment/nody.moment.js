(function(){
	
	makeModule("MixedMoment",{
		getCommand:function(name){
			var args = CLONEARRAY(arguments);
			args.shift();
			return this.Source[name].apply(this.Source,args);
		},
		setCommand:function(name){
			var args = CLONEARRAY(arguments);
			args.shift();
			this.Source[name].apply(this.Source,args);
			return this;
		},
		format:function(){ return this.Source.format.apply(this.Source,CLONEARRAY(arguments)); },
		clone:function(){return new MixedMoment(this.Source);},
		drawCalendarHeaderRow:function(filter){
			var momentlang = this.Source.clone();
			return MAKE("tr",TIMESMAP(7,function(i){ 
				var t = TURNINDEX(i,7);
				return (typeof filter == "function") ? filter(MAKE("td",{html:momentlang.day(t).format("dddd")})) : MAKE("td",{html:momentlang.day(t).format("dddd")});
			}));
		},
		drawCalendarBodyRows:function(){
			var firstMoment = this.Source.clone().date(1);
			var lastMoment  = firstMoment.clone().add(1,'months').date(0);
		
			var startDay = firstMoment.day();
			var beforeDate = firstMoment.clone().date(0).date() - startDay;
		
			var calendarBodies = ARRAYINARRAY(6);
			
			// before month
			for(var i=0,l=startDay;i<l;i++) calendarBodies[0].push(MAKE("td.before",{html:beforeDate+i}));
		
			//
			var count = lastMoment.date()+startDay;
		
			// current month
			for(var i=startDay,l=count;i<l;i++) calendarBodies[ Math.floor(i/7) ].push(MAKE("td",{html:i-startDay+1}));
		
			// after month
		
			for(var i=count,l=42,ai=1;i<l;i++){
				calendarBodies[ Math.floor(i/7) ].push(MAKE("td.after",{html:ai}));
				ai++;
			}
			
			return DATAMAP(calendarBodies,function(tds){
				return MAKE("tr",tds);
			});
		}
	},function(input, format, locale, strict){
		if( (arguments.length == 1) && (typeof input == "string") && (input.length == 2) ){
			this.Source = moment(undefined,undefined,input);
		} else if( ((typeof input == "string") && (typeof format == "string")) && (format.length == 2) ){
			this.Source = moment(input,undefined,format);
		} else {
			this.Source = moment.apply(undefined,CLONEARRAY(arguments));
		}
	});
	
	// load moment
	var root  = FUT.LOADINGSCRIPTROOT();
	FUT.INCLUDE(root + "moment-with-locales.js");
	FUT.INCLUDE(root + "moment-timezone-with-data.js");
})();