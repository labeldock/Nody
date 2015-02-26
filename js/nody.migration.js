makeGetter('ELTHE',function(node,selectText,extraData){			
	if(NODYENV.matchesSelector) return NODYENV.matchesSelector(node,selectText);
	
	var tagInfo = SELECTINFO(selectText);
	for(var key in tagInfo){
		switch(key){
			case "tagName": if(node.tagName.toLowerCase() !== tagInfo.tagName) return false; break;
			case "class":
				var infoClass = tagInfo[key];
				var nodeClass = ELATTR(node,key);
				
				if( (infoClass === null) ) {
					if(nodeClass === null) { return false; }
					continue;
				}
				
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
						case "not"  : if( NUT.THE(node,tagInfo[key][metaKey]) ) return false; break;
						case "focus": if(!NUT.HASFOCUS(node)) return false; break;
						case "eq"   : case "nth-child":
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
});

// IS Helper
//"Structure#QueryDataInfo":function(querys){
//	this.keymap(OUTERSPLIT(querys,",",["()"]),function(query){
//		var querySplit = [];
//		
//		query.trim()
//		.replace(/[\n]|[\s]{2,}/g," ")
//		.replace(/\s*(\>|\+)\s*/g,function(s){ return s.replace(/\s/g,""); })
//		.replace(/(\[[\w\=\_\-]+\]|\:\w+\([^\)]+\)|[\w\-\_\.\#\:]+\([^\)]+\)|[\w\-\_\.\#\:]+)(\s|\>|)/g,function(s){ 
//			querySplit.push(s);
//		});
//		
//		return querySplit;
//	});
//},

makeGetter("ELIS",function(node,selectText,advenceResult){
	//
	if(!ISELNODE(node)) return false;
	if((typeof selectText === "undefined") || selectText == "*" || selectText == "") return true;
	
	var judgement, inspectData = StructureInit("QueryDataInfo",selectText);
	
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
});