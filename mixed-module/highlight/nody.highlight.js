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
			hljs.highlightBlock(FINDZERO("code",node));
		});
	});
	
	//Load highlight script
	var root  = FUT.LOADINGSCRIPTROOT();
	FUT.INCLUDE(root + "highlight.pack.js");
	FUT.INCLUDE(root + "css/github.css");
})();

