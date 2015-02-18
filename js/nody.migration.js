makeGetter('THE',function(node,selectText,extraData){			
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