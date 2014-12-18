(function(){
	
	makeGetter("CODE",function(){
		return _Array(arguments).map(function(func){
			if(ISELNODE(func)){
				return _String(func.innerHTML).trimLine().getTabsAlign();
			} else if(typeof func == "function"){
				var hideSwitch = false;
				return _String(UNWRAP((func+"").replace(/(^[^{]+)/g,""))).trimLine().tabsAlign().eachLine(function(line){
					if(line.indexOf("/*break*/") > -1) return "";
					if(line.indexOf("/*linehide*/") > -1) {
						hideSwitch = hideSwitch ? false : true;
						return undefined;
					} 
					return hideSwitch ? undefined : line;
				});
			}
		}).compact().join("\n\n");
	});
	
	makeGetter("CODEBLOCK",function(node){
		DATAEACH(node,function(){
			hljs.highlightBlock(ZFIND("code",node));
		});
	});
	
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
		clone:function(){ var c = new MixedMoment(this.Source); c.CalendarStartDay = this.CalendarStartDay; return c},
		//
		"var!calendarToggle":function(year,month,date){
			console.log("toogle",year,month,date);
		},
		setDrawStartDay:function(dayValue){
			if(typeof dayValue == "number") this.CalendarStartDay = dayValue;
			return this;
		},
		drawCalendarHeaderRow:function(filter){
			var momentlang = this.Source.clone();
			var startDay   = this.CalendarStartDay;
			return MAKE("tr",TIMESMAP(7,function(i){ 
				var t = TURNINDEX(i+startDay,7);
				return (typeof filter == "function") ? filter(MAKE("td",{html:momentlang.day(t).format("dddd")})) : MAKE("td",{html:momentlang.day(t).format("dddd")});
			}));
		},
		drawCalendarBodyRows:function(){
			var owner          = this;
			var firstMoment    = this.Source.clone().date(1);
			var year           = firstMoment.year();
			var month          = firstMoment.month()+1;
			var lastMoment     = firstMoment.clone().add(1,'months').date(0);
			var startDay       = TURNINDEX(firstMoment.day()-this.CalendarStartDay,7);
			var beforeDate     = firstMoment.clone().date(0).date() - startDay;
			var calendarBodies = ARRAYARRAY(6);
			
			;
			// before month
			
			for(var i=0,l=startDay;i<l;i++) calendarBodies[0].push(CREATE("td.before",beforeDate+i+1));
			
			//
			var count = lastMoment.date()+startDay;
			
			// current month
			for(var i=startDay,l=count;i<l;i++){
				var date    = i-startDay+1;
				var makedTd = CREATE("td",{html:date,dataset:{"year":year,"month":month,"date":date}});
				calendarBodies[ Math.floor(i/7) ].push(makedTd);
			} 
		
			// after month
			for(var i=count,l=42,ai=1;i<l;i++){
				calendarBodies[ Math.floor(i/7) ].push( CREATE("td.after",ai) );
				ai++;
			}
			
			return DATAMAP(calendarBodies,function(tds){
				return MAKE("tr",tds);
			});
		}
	},function(input, format, locale, strict){
		//current module
		this.CalendarStartDay=0;
		
		if( (arguments.length == 1) && (typeof input == "string") && (input.length == 2) ){
			this.Source = moment(undefined,undefined,input);
		} else if( ((typeof input == "string") && (typeof format == "string")) && (format.length == 2) ){
			this.Source = moment(input,undefined,format);
		} else {
			this.Source = moment.apply(undefined,CLONEARRAY(arguments));
		}
	});
	
	var root  = FUT.LOADINGSCRIPTROOT();
	FUT.INCLUDE(root + "moment-with-locales.js");
	FUT.INCLUDE(root + "jquery.noty.packaged.min.js");
	FUT.INCLUDE(root + "highlight.pack.js");
	FUT.INCLUDE(root + "highlight/github.css");
})();
