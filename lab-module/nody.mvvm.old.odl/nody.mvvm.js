//DataGrid
extendModule("UIDInterface","DataGrid",{
	//데이타가 존재하는지
	hasDatas:function(){ return this.Source.isEnough(); },
	//현위치에서 Datas의 깊이를 체크함
	depth:function(def){
		def = (typeof def == "undefined" ? 0 : def + 1);
		if(this.hasDatas()){
			return this.Source.getMap( function(dataGrid){ return dataGrid.depth(def)} ).sort().useLast();
		} else {
			return def;
		}
	},
	//데이터의 형태를 string형태로 뽑아넴
	trace:function(j,k){
		var ra = this.Reference == "array";
		var rs = ra ? "[" : "{";
		var re = ra ? "]" : "}";
		var prop = [];
		for(var key in this.Property) prop.push( (j?'\"':'') + key + (j?'\":\"':':') + this.Property[key] + (j?'\"':'') );
		if(this.hasDatas() || k !== true) prop.push( (ra ? '' : (j?'\"'+this.DatasName + '\":[' : this.DatasName + ':[') ) + this.Source.getMap( function(dataGrid){ return dataGrid.trace(j); } ).join(", ") + (ra ? "" : "]") );
		return rs + prop.join(", ") + re;
	},
	//메타데이터를 string으로 뽑아냄
	traceProperty:function(j){
		var ra = this.Reference == "array";
		var rs = ra ? "[" : "{";
		var re = ra ? "]" : "}";
		var prop = [];
		for(var key in this.Property) prop.push( (j?'\"':'') + key + (j?'\":\"':':') + this.Property[key] + (j?'\"':'') );
		return rs + prop.join(", ") + re;
	},
	getJSONString:function(){ return this.trace(true); },
	getJSONStringOfProperty:function(){ return this.trace(true,true); },
	getJSONObject:function(){ return JSON.parse(this.getJSONString()); },
	//각 하위 데이터마다  메서드 호출
	injectDatas:function(method){
		this.Source.inject(this,method);
		return this;
	},
	//아래부터 위로 메서드 호출
	feedup:function(feedupMethod,depth,infinityTop){
		depth = (typeof depth == "undefined" ? 0 : depth ); 
		if(depth == infinityTop) return undefined;
		var feedData = [];
		this.Source.each(function(dataGrid){
			var feed = dataGrid.feedup.call(dataGrid,feedupMethod,depth + 1,infinityTop);
			if(typeof feed !== undefined) feedData.push(feed);	
		});
		return feedupMethod.call(this,feedData,depth);
	},
	feeddown:function(feeddownMethod,cutIndex,depth,feedData){
		depth = (typeof depth == "undefined" ? 0 : depth ); 
		var feedData = [];
		if(depth == cutIndex) return undefined;
		this.Source.each(function(dataGrid){
			var feed = dataGrid.feeddown.call(dataGrid,feeddownMethod,cutIndex,depth + 1);
			if(typeof feed !== undefined) feedData.push(feed);
		});
		return feeddownMethod.call(this,feedData,depth);

	},
	//
	updateStatus:function(){},
	setDataStatus:function(keyword){
		switch(keyword.toLowerCase()){
			case "new": case "loaded": case "commit": case "update":
				this.DataStatus = keyword.toLowerCase();
				break;
			defualt : 
				console.warn("DataGrid::dataStatus에 올바르지 않은 값이 들어왔습니다");
				break;
		}
	},
	//DataGrid를 Depth값으로 얻어옴
	getDataGridByDepth:function(require,def,result,index,index2){
		index  = (typeof index  == "undefined" ? 0 : index);
		index2 = (typeof index2 == "undefined" ? 0 : index2);
		def    = (typeof def    == "undefined" ? 0        : def + 1);
		result = (typeof result == "undefined" ? _Array() : result );
		if(require == def)  {
			result.touchWithEval("_Array()",index2);
			result[index2].push(this);
			return result;
		}
		if(require-1 == def) index2 = result.length

		if(this.hasDatas()) this.Source.each( function(dataGrid,i){ return dataGrid.getDataGridByDepth(require,def,result,index,index2)} );

		return result;
	},
	//DataGrid를 indexs(call)형태로 얻어옴
	getDataGridByIndexs:function(){
		var params = _Array(arguments);
		if(params.isNothing()) return this;
		var target = this.Source[params.useFirst()];
		if(typeof target == "undefined"){
			return undefined;
		} else {
			return target.getDataGridByIndexs.apply(target,params.getSubarr(1).toArray()); 
		}
	},
	//어떠한 데이터그리드의 Indexes를 얻어옴
	getIndexesByDataGrid:function(dataGrid,indexes){
		if(typeof indexes == "undefined") indexes = [];
		//	console.log("matching",this.traceProperty(),"  ===   ",dataGrid.traceProperty(),"   ==>   ",dataGrid == this);
		if(dataGrid == this)        return indexes;
		if(this.Source.isNothing()) return undefined;
		//
		var beginResult;
		this.Source.each(function(_dg,i){
			var i2 = CLONE(indexes);
			i2.push(i);
			var dgResult = _dg.getIndexesByDataGrid(dataGrid,i2);
			if(typeof dgResult == "object") {
				beginResult=dgResult;
				return false;
			}

		});
		return beginResult;
	},
	//하위 데이터 그리드를 삭제함
	deleteWithDataGrid : function(dataGrid){
		var _dataGrid = this.Source.getEqual(dataGrid).useFirst();
		if(typeof _dataGrid == "undefined"){
			var result;
			this.Source.each(function(_dg){
				var beginResult = _dg.deleteWithDataGrid(dataGrid);
				if(ISTYPE(beginResult,DataGrid)){
					result = beginResult;
					return false;
				}
			});
			return result;
		} else {
			_dataGrid.deleteParent();
			this.Source.remove(_dataGrid);
			return _dataGrid;
		}
	},
	//상하 트리구조
	deleteParent : function(){ this.Parent = undefined; return this;},
	setParentData    : function(p,exceptionIgnore){ if(ISTYPE(p,DataGrid)) { this.Parent = p; } else if(exceptionIgnore !== true) { throw new Error("Data::부모 객체 설정이 잘못되었습니다." + TOS(p)); } return this },
	getParentData    : function(){ return this.Parent; },
	//액션
	moveUp:function()    { if(this.Parent)this.Parent.Source.left(this.Parent.Source.indexOf(this)); },
	moveDown:function()  { if(this.Parent)this.Parent.Source.right(this.Parent.Source.indexOf(this)); },
	selfDelete:function(){ if(this.Parent)this.Parent.Source.remove(this); },
	//현재 레벨의 인덱스를 반환함
	placeIndex:function(){ return this.Parent.Source.indexOf(this); },
	placeDepth:function(depth){
		depth = depth ? depth : 0;
		if(this.Parent){
			depth++; 
			return this.Parent.placeDepth(depth)
		}
		return depth;
	},
	getDataWithDepth:function(depth){
		depth = isNaN(depth) == true ? 0 : parseInt(depth);
		return _Array( this.feeddown(function(data,index) { if(index == depth) return data; }) ) ;
	},
	length:function(index){ return this.Source.length; },
	appendData : function(data,insertParam) { 
		var _dataGrid = ISTYPE(data,DataGrid) ? data.setParentData(this) : _DataGrid(data,this.DatasName,this);
		this.Source.insert( _dataGrid , parseInt(insertParam) );
		return _dataGrid;
	},
	getDatas   : function()     { return this.Source; },
	getData    : function(index){ return this.Source[index]; },
	setData:function(data){
		this.ReferenceData = data;
		var own = this;
		if(ISTYPE(data,DataGrid) == true) console.error("현재는 DataGrid::setData에 DataGrid Object를 넣으면 안됩니다.");
		if(ISARRAY(data)){
			this.Source = _Array(data).map(function(d){return _DataGrid(d,own.DatasName,own);});
			this.Reference = "array";
		} else if (typeof data == "object") {
			this.Reference = "object";
			this.prop(data);
			this.propFirst(true);
			if(typeof data[this.DatasName] == "undefined"){
				this.Source = _Array();
			} else {
				this.Source = _Array(data[this.DatasName]).map(function(d){return _DataGrid(d,own.DatasName,own);});
				delete this.Property[this.DatasName];
			}
		} else if( typeof data == "undefined" ){
			this.Reference = "unknown";
			this.Source = _Array();
		} else if( typeof data == "string") {
			var tranceData = TOOBJECT(data,"string");
			if(typeof tranceData == "object"){
				console.warn("DataGrid::setData::String유형의 데이터를 받앗습니다. Data의 표현이 올바르지 않을수 있습니다. =>",TOS(tranceData));
				this.setData(tranceData);
			} else {
				console.error("DataGrid::setData::지원하지 않는 유형의 데이터를 받앗습니다! =>",data);
			}
		} else  {
			if(ISTYPE(data,DataGrid) == true) console.error("DataGrid::setData::제대로 처리하지 못하였습니다.");
		}
	},
	prop : function(key,value){
		if(ISTEXT(key) && (arguments.length > 1)){
			this.Property[key] = value;
		} else if (ISTEXT(key)) {
			return this.Property[key];
		} else if(typeof key == "undefined"){
			return CLONE(this.Property);
		} else if(typeof key == "object"){
			for(var kk in key) this.prop(kk,key[kk]);
		}
		return this;
	},
	propFirst : function(key,value){
		if(key == true){
			this.propFirst(this.Property);
		} else if(ISTEXT(key) && (arguments.length > 1)){
			this.PropertyFirst[key] = value;
		} else if (ISTEXT(key)) {
			return this.PropertyFirst[key];
		} else if(typeof key == "undefined"){
			return CLONE(this.PropertyFirst);
		} else if(typeof key == "object"){
			for(var kk in key) this.propFirst(kk,key[kk]);
		}
		return this;
	},
	isPropertyChanged :function(){
		var uniqueKey = _Array().concat(_Object(this.Property).keys()).concat(_Object(this.PropertyFirst).keys()).unique();
		var result = false;
		var propC = this.Property;
		var propF = this.PropertyFirst;
		uniqueKey.each(function(key){
			if(!(key in propC) || !(key in propF) || propC[key] !== propF[key]) {
				result = true;
				return false;
			}
		});
		return result;
	}
},function(data,childNameSpace,parent,dataStatus){
	this._super();
	
	//기본 계층 이름
	this.DatasName = (typeof childNameSpace == "undefined" ? "datas" : childNameSpace);
	//부모 DataGrid등록
	this.setParentData(parent,true);

	//prop
	this.Property       = {};
	this.PropertyFirst  = {};

	//기본 데이터 형
	this.Reference;
	this.setData(data);

	//status
	this.DataStatus = "new";
});
//render
makeModule("DataBehavior",{
	//DataGrid dataSetGet
	data:function(k,v){
		if(typeof k == "string" && arguments.length > 1){
			return this.DataGrid.prop(k,v);
		} else {
			this.DataGrid.prop(k)
		}
	},
	getData:function(key){ return this.DataGrid.prop(key); },
	setData:function(key,value){ return this.DataGrid.prop(key,value); },
	//
	dataIndex:function(){ return this.DataGrid.placeIndex(); },
	makeBehaviorManager : function(controller,render){
		if(typeof this.DataBehaviors[controller.__uid__] == "undefined") this.DataBehaviors[controller.__uid__] = {};
		this.DataBehaviors[controller.__uid__].Controller = controller;
		this.DataBehaviors[controller.__uid__].Render     = render;
		this.DataBehaviors[controller.__uid__].Children   = [];
		this.DataBehaviors[controller.__uid__].Root       = undefined;
	},
	getBehaviorManager:function(controller){
		return this.DataBehaviors[controller.__uid__];
	},
	setBehaviorManagerBindTarget:function(propName,target){
		if(propName in this.Bind == false) 
		this.Bind[propName] = [];
		this.Bind[propName].push(target);
		return this;
	},
	setBehaviorManagerRoot:function(controller){
		if(controller){
			this.DataBehaviors[controller.__uid__].Root = root;
		} else {
			throw new Error("setBehaviorManagerRoot에 상이한 값이 들어왔습니다. controller는 다음의 값으로 들어왔습니다. => ",TOS(root));
		}
		return this;
	},
	getBehaviorManagerChildren:function(controller,root){
		var rsd = this.DataBehaviors[controller.__uid__];
		if(controller) if(rsd) if(rsd.Children) return rsd.Children;
		throw new Error("getBehaviorManagerChildren의 작동이 올바르지 않습니다. => ",TOS(root));
	},
	callRender:function(controller,children){
		var sMeta = this.DataBehaviors[controller.__uid__];
		sMeta.Children = children;
		var space = this.makeSpaceWithController(controller);
		var sRoot = sMeta.Render.call(space,sMeta.Children);
		if(ISELNODE(sRoot)) sMeta.Root = sRoot;
		return sRoot;
	},
	getRootByController:function(controller){
		for(var key in this.DataBehaviors){
			if(this.DataBehaviors[key].Controller == controller){
				return this.DataBehaviors[key].Root;
			}
		}
	},
	//prop binding
	applyBind:function(propName,value,sender){
		if(typeof this.DataGrid.prop(propName) == "undefined") { 
			
			
			console.log("DataBehavior::applyBind 존재하지 않는 메타값의 이벤트를 발생하엿습니다.(propName,value,sender)",propName,value,sender,"존재하는 키들",_Object(this.DataGrid.prop()).keys()); 
			return this; 
		}
		//applyData
		if(sender !== this) this.DataGrid.prop(propName,value);

		//applyElement
		var els = this.Bind[propName];
		for(var i=0,l=els.length;i<l;i++)  if(els[i] !== sender)  switch(els[i].tagName.toLowerCase()){
			case "input" : case "select" : ELVALUE(els[i],value); break;
			case "h1": case "h2": case "h3": case "h4": case "h5": case "h6": case "div": case "p": case "dt": case "dd": case "small": case "tr": case "td": case "th":
				els[i].innerHTML = value;
				break;
			default :
				console.log("DataBehavior::bindElement::지원하지 않는 element입니다.",propName)
				break;
		}
	},
	//makeSpace
	makeSpaceWithController:function(controller){
		var _dataBehavior = this;
		var space = new (function(){})();
		space.controller = function(name){ return controller };
		space.datas   = function(){ return _dataBehavior.DataGrid.Property };
		space.data    = function(name,valueChange){ return FJOB(valueChange,_dataBehavior.getData(name));};
		space.text    = function(){ return ELTEXT( this.data.apply(this,arguments) ); };
		space.setData = function(){ _dataBehavior.setData(name); return this; };
		space.bind    = function(dataName,bindEl,valueChange) {
			//설정하 value값
			var setValue = this.data(dataName,valueChange);
			if(typeof setValue == "undefined"){
				console.warn("Space::bind::존재하지 않는 키 값에 바인딩 하려고 하였습니다. =>", dataName);
				return EL("div",{"html":"DataBehavior::bind::error::" + dataName + " is undefined"});
			}
			//엘리먼트 기본설정값
			var element = typeof bindEl == "undefined" ? EL("input!"+dataName) : EL(bindEl) ;
			var appendElements;
			if(typeof valueChange == "function"){
				appendElements = _Array(arguments).subarr(3).toArray();
			} else {
				appendElements = _Array(arguments).subarr(2).toArray();
			}
			if(appendElements.length > 0) ELAPPEND(element,appendElements);
			// 이벤트 등록
			var own = this;
			if( ISELNODE(element) ){
				switch(element.tagName.toLowerCase()){
					//write
					case "input" :
						ELON (element,"keyup value_change",function(e) {
							setTimeout(function(){
								_dataBehavior.applyBind(dataName, ELVALUE(element), element); 	
							},0);
						});
						break;
					case "select":
						ELON (element,"change value_change",function(e){
							setTimeout(function(){
								_dataBehavior.applyBind(dataName, ELVALUE(element), element);
							},0);
						});
						break;
					default : /*readOnly*/ break;
				}
				ELVALUE(element,setValue);
			} else {
				console.warn("DataBehavior::bind::element를 바인딩할 수 없습니다. 지시자의 오류입니다. =>=>",bindEl,element);
			}
			// 바인드 설정
			_dataBehavior.setBehaviorManagerBindTarget(dataName,element);
			return element;
		};
		//보이지 않는 값
		space.hidden = function(dataName){ this.bind(dataName,"hidden!"+dataName); };
		space.action = function(eventName,elementSource,cv1,cv2){
			var element,option,handle;
			if(typeof cv1 == "function"){
				handle = cv1;
				option = cv2;
			} else if (typeof createValue3 == "function") {
				option = cv1;
				handle = cv1;
			} else { 
				option = cv2;
			}
			var owner   = controller;
			var element = EL(elementSource);
			ELON(element,"click", function(){ owner.triggerWithDataBehavior(_dataBehavior,eventName,element,option); } );
			if(typeof handle == "function") owner.addEventWithRS(eventName,this,handle);
			return element;
		};
		//
		var dataGrid = this.DataGrid;
		space.pointer = function(tag,option){
			if(typeof tag !== "string") tag = "hidden.bind";
			var el = EL(tag,option);
			el._dataGrid = dataGrid;
			el._data     = dataGrid.ReferenceData;
			return el;
		};
		//체크박스 //라디오 //히든
		space.checkbox = function(option){ return space.pointer("checkbox.bind",option); };
		space.radio    = function(option){ return space.pointer("radio.bind",option); };
		space.hidden   = function(option){ return space.pointer(undefined,option); };
		
		return space;
	},
	//bebavior
	remove:function(){
		for(var key in this.DataBehaviors){
			dataBehavior = this.DataBehaviors[key];
			ELREMOVE(dataBehavior.Root);
			delete dataBehavior["Controller"];
			delete dataBehavior["Render"];
			delete dataBehavior["Children"];
			delete dataBehavior["Root"];
			delete this.DataBehaviors[key];
		}
		_DataBehaviorKit.deleteDataBehavior(this.DataGrid);
		this.DataGrid.selfDelete();
	},
	insert:function(data,index){
		var curDataGrid = this.DataGrid;
		var newDataGrid = curDataGrid.appendData(data,index);
		for(var key in this.DataBehaviors){
			var _DB = this.DataBehaviors[key];
			_DB.Controller.refresh();
		}
		return this;
	},
	push:function(data){
		this.insert(data,this.DataGrid.length());
		return this;
	}
},function(dataGrid){
	if(ISTYPE(dataGrid,DataGrid)){
		this.DataBehaviors = {};
		this.DataGrid      = dataGrid;
		this.Bind          = {};
	} else {
		throw new Error("DataBehavior::InitError:: Init파라메터는 DataGrid값으로 들어와야 합니다. =>",TOS(dataGrid));
	}
});
makeSingleton("_DataBehaviorKit",{
	deleteDataBehavior:function(){
		console.warn("deleteDataBehavior는 개발중입니다");
	},
	getDataBehavior:function(dataGrid){
		if(typeof this.dataContextKitStorage[dataGrid.__uid__] == "undefined") this.dataContextKitStorage[dataGrid.__uid__] = _DataBehavior(dataGrid);
		return this.dataContextKitStorage[dataGrid.__uid__];
	}
},function(){
	this.dataContextKitStorage = {};
});
makeModule("DataRender",{
	renderExceptionElement:function(dataGrid,feedViews,depth){
		return ELSTYLE(ELAPPEND(EL("div",{html: TOS(dataGrid.prop()) }), feedViews),"padding-left", depth * 10 + "px");
	},
	renderByDataGrid:function(depth,dataGrid,feedViews,controller){
		if(typeof this.Source[depth] == "function") {
			var _dataBehavior = _DataBehaviorKit.getDataBehavior(dataGrid);
			_dataBehavior.makeBehaviorManager(controller,this.Source[depth]);
			var _rsRenderResult = _dataBehavior.callRender(controller,_Array(feedViews));
			//depth
			if(ISELNODE(_rsRenderResult)) {
				var className = ELATTR(_rsRenderResult,"class");
				className = (typeof className == "undefined") ? "RenderDepth-"+depth : className + (" RenderDepth-"+depth);
				return _rsRenderResult;
			}
			console.warn("경고::DataRender의 Render결과값이 잘못되었습니다. => ",_rsRenderResult,"  관련값 Controller,DataGrid => ",controller,dataGrid);
		} else if (typeof this.Source[depth] !== "undefined" && this.Source[depth] == null) {
			return feedViews;
		}
		return this.renderExceptionElement(dataGrid,feedViews,depth);
		//return element
	},
	complete:function(completeMethod){
		return this.CompleteMethod = completeMethod;
	}
},function(renderDepth){
	var _dataBehavior = this;
	this.Source = _Array(arguments).map(function(a){
		if(typeof a == "string"){
			return function(args){
				return ELAPPEND(E(a),args)
			}
		}
		return a;
	})
	this.CompleteMethod;
});
extendModule("EventInterface","DataController",{
	//debug
	trace  : function(){ return this.Source.trace(); },
	getJSONString:function(){ return this.Source.getJSONString(); },
	//setup
	__setupDepth:function(defaultDepth){
		var soruceDepth      = this.Source.depth();
		this.DataDepthDefine = isNaN(defaultDepth) == true ? soruceDepth : parseInt(defaultDepth);
		this.DataDepth       = soruceDepth < this.DataDepthDefine ? soruceDepth : this.DataDepthDefine ;
	},
	__setupData:function(data,d){
		this.Source          = ISTYPE(data,DataGrid) ? data : _DataGrid(data);
		this.__setupDepth(d);
	},
	//init override target
	initData:function(d1,d2){
		return this.__setupData.apply(this,arguments);
	},
	//history
	setRenderHistory : function(renderArgs){
		var filter = this.RenderHistory.getFilter(function(history){
			return history[1] == renderArgs[1];
		});
		if(filter.isNothing() == true) this.RenderHistory.push(renderArgs);
		return this;
	},
	getRenderHistory : function(){
		return this.RenderHistory;
	},
	removeRenderHistory:function(context){
		var removedObject = [];
		this.RenderHistory.filter(function(history){
			if(history[1] == context){
				removedObject.push(context);
				return false;
			}
			return true;
		});
		return removedObject;
	},
	getContexts:function(){
		return _Array(this.RenderHistory).getMap(function(h){ return h[1]; }).toArray();
	},
	//rerender
	refresh:function(refreshData){
		var own = this;
		if(refreshData) this.initData(refreshData);
		var newData = this.Source;
		this.RenderHistory.each(function(renderData){
			var r = renderData;
			r[0].renderData = newData;
			own.__render__.apply(own,r);
		});
	},
	//status
	statusAll:function(keyword){
		this.Source.setStatusAll(keyword);
	},
	validate:function(depth,validate,validateFinal){
		depth = isNaN(depth) == true ? this.Source.depth() : parseInt(depth) ;
		var result = this.Source.getDataWithDepth(depth);
		validate = (typeof validate == "function") ? validate : (typeof this.DataValidate == "function") ? this.DataValidate : false ;
		if(validate == false) return true;
		validateFinal = (typeof validateFinal == "function") ? validateFinal : (typeof this.DataValidateFinal == "function") ? this.DataValidateFinal : function(validateResult){
			return ISNOTHING(validateResult);
		};
		//validate
		result.each(function(dataSource){
			CALL(validate,dataSource.prop());
		}).remove(undefined);
		//validateFinal
		return validateFinal(result);
	},
	setValidate:function(v1,v2){
		this.DataValidate      = v1;
		this.DataValidateFinal = v2;
		return this;
	},
	//render
	__render__:function(renderDataObject,renderContext,dataRender){
		//렌더데이터 추출
		var renderData    = renderDataObject.renderData;
		var renderFromTop = renderDataObject.renderFromTop;
		var renderLimit   = renderDataObject.renderTop;
		
		var renderIndex = renderDataObject.renderIndex;

		//컨텍스트 확인
		renderContext = FINDZERO(renderContext);
		if(ISELNODE(renderContext) == false){ throw new Error("DataController에서 render를 할수없습니다. 컨텍스트 값의 오류로 렌더할수 없습니다. => context => " + TOS(renderContext) ); }
		
		//렌더러확인
		if(typeof dataRender == "undefined") {
			dataRender = _DataRender();
		} else if (ISARRAY(dataRender) == true){
			dataRender = APPLY(_DataRender,undefined,dataRender);
		} else if (!ISTYPE(dataRender,DataRender)) {
			throw new Error("DataController::render // 첫번째 파라메터는 DataRender인스턴스 이여야 합니다. param0 => " + dataRender );
		} 
		//렌더기록 남기기
		this.setRenderHistory(Array.prototype.slice.apply(arguments));

		// 해당 깊이로 렌더링함
		var dataSelects = _Array(arguments).getSubarr(3);
		var dataDeep    = dataSelects.length;
		var targetDatas = renderData.getDataGridByIndexs.apply(renderData,dataSelects.toArray());
		
		//indexes 설정에러시
		if(typeof targetDatas == "undefined"){ throw new Error("DataControll::render // 해당깊이의 데이터를 찾지 못하였습니다. => [" + dataSelects.join(", ") + "]", "renderData",renderData); }

		//렌더링시작
		var own = this;
		var depthOfDefault;
		if(renderFromTop == true){
			depthOfDefault = (this.DataDepth - dataDeep) + (this.DataDepthDefine - this.DataDepth);
		} else {
			depthOfDefault = this.DataDepth - dataDeep;
		}
		//console.log("render context",ELTRACE(renderContext),this.Source.trace());
		var elementOfRenderResult = targetDatas.feedup(function(feedData,depth){
			var feeds = _Array(feedData).getFlatten().toArray();
			var renderIndex;
			if(typeof renderLimit == "number"){
				renderIndex = (own.DataDepth - depth) - (own.DataDepth - renderLimit);
			} else {
				renderIndex = depthOfDefault - depth;
			}
			//console.log("renderIndex",renderIndex," <= ",depth, feedData);
			return dataRender.renderByDataGrid( renderIndex , this, feeds , own);
		},0,renderLimit);
		//마지막 리절트
		if(elementOfRenderResult != renderContext) if(ISELNODE(elementOfRenderResult)) {
			renderContext.innerHTML = "";
			ELAPPEND(renderContext,elementOfRenderResult);
		}
		
		CALL(this.onRenderAfter,this.onRenderAfterIn,renderContext);
		return renderContext;
	},
	//render
	render        : function(renderContext,dataRender)      { this.__render__.apply(this,_Array(arguments).insert({"renderData":this.Source,"renderFromTop":false}).toArray()); return this;  },
	renderFromTop : function(renderContext,dataRender)      { this.__render__.apply(this,_Array(arguments).insert({"renderData":this.Source,"renderFromTop":true}).toArray()); return this; },
	topRender     : function(top, renderContext,dataRender) { this.__render__.apply(this,_Array(arguments).subarr(1).insert({"renderData":this.Source,"renderTop":parseInt(top)}).toArray()); },
	//nothing process
	//getNothingView:function(){
	//	var nothingView = this.RenderNothing.call(this)
	//	if(!ISELNODE(nothingView)) console.warn("getRenderNothing에러 콜백에서 반드시 엘리먼트를 반환하도록 하십시요. =>",nothingView);
	//	return nothingView;
	//},
	//setNothingView:function(f){
	//	if(typeof f == "function"){
	//		this.RenderNothing = f;
	//	} else {
	//		console.error("setRenderNothing은 반드시 함수를 넣어야 합니다.");
	//	}
	//	return this;
	//},
	clear:function(value){
		this.RenderHistory.each(function(history){
			if(typeof value == "string") {
				history[1].innerHTML = value;
			}
		});
	},
	//events
	addEventWithRS:function(eventName,renderSpace,method){
		this.addEvent(eventName,function(){
			if(renderSpace == sender || renderSpace.DataGrid == sender) {
				method.call(renderSpace);
			} else if (element == sender ){
				method.call(renderSpace);
			}
		});
	},
	triggerWithDataBehavior:function(dataBehavior,eventName,sender,parameter){ this.trigger(eventName,[dataBehavior,sender,parameter]); },
	//control
	upWithRS     : function(renderspace){ renderspace.DataGrid.moveUp(); ELUP(renderspace.Root); },
	downWithRS   : function(renderspace){ renderspace.DataGrid.moveDown(); ELDOWN(renderspace.Root); },
	deleteWithRS : function(renderspace){
		if(!ISTYPE(renderspace,DataBehavior)) throw new Error("DataController::deleteWithRS의 파라메터는 DataBehaviorType이 들어와야 합니다.");
		var deleteObject = this.Source.deleteWithDataGrid(renderspace.DataGrid);
		if(typeof deleteObject !== "undefined") ELREMOVE(renderspace.Root);
		return this;
	},
	methodGET:function(url){
		var form  = EL("form","method:get,action:"+url);
		var input = EL("input"); 
		input.value = this.Source.getJSONString();
		form.submit();
	},
	length:function(){ return this.Source.length(); }
},function(data,defaultDepth,events,dataTranceForm){
	//init event,uid
	this._super();
	//defualt propertys
	this.initData(data,defaultDepth);
	this.DataEvents     = CLONE(TOOBJECT(events));
	this.RenderHistory  = _Array();
	//this.RenderNothing  = function(){ return EL("div.nothing"); };
	this.DataTrancefrom = (typeof dataTranceForm == "object") ? dataTranceForm : {} ;
	
	//defualt event
	//element, renderspace, objectattr
	this.setDefaultEvent("up",      function(e,r,o){ r.Controller.upWithRS(r);              });
	this.setDefaultEvent("down",    function(e,r,o){ r.Controller.downWithRS(r);            });
	this.setDefaultEvent("append",  function(e,r,o){ r.Controller.createWithRS(r,o);        });
	this.setDefaultEvent("prepend", function(e,r,o){ r.Controller.createWithRS(r,o,true,0); });

	//event2
	//dataBehavior,sender,parameter
	var Controller = this;
	this.setDefaultEvent("delete",  function(b,s,p)  { 
		if(confirm("정말로 삭제하시겠습니까?")) b.remove();
	});
});
extendModule("DataController","ArrayViewController",{
	initData:function(data,depth){
		var setData =  ISARRAY(data) ? data : typeof data == "object" ? [data] : [];
		return this.__setupData(setData,1);
	},
	getDataGrids:function(){ return this.Source.getDatas(); },
	getArrayData:function(){ return _Array(this.getDataGrids()).map(function(_dg){ return _dg.prop() }); },
	getCheckedData:function(){
		var own = this;
		return this.getDataGrids().getFilter(function(dataGrid){ 
			var _db  = _DataBehaviorKit.getDataBehavior(dataGrid);
			var root = _db.getRootByController(own);
			if(FIND("*:checked",root).length > 0) return true;
		});
	},
	getChanged:function(){ return this.getDataGrids().getFilter(function(dataGrid){ return dataGrid.isPropertyChanged(); }); },
	getChangedData:function(indexText){ 
		return this.getChanged().map(function(dataGrid){ 
			if( indexText == "string" ){
				var data = dataGrid.prop();
				data[indexText] = dataGrid.placeIndex();
				return data;
			} else {
				return dataGrid.prop();
			}
		});
	},
	insertRow:function(data,index){
		var _dataBehavior = _DataBehaviorKit.getDataBehavior(this.Source);
		var data = ("defaultContent" in this.DataTrancefrom) ? this.DataTrancefrom.defaultContent : data ;
		if(typeof data == "object"){
			_dataBehavior.insert(data,index);
		} else {
			this.error("DataController::insert::data의 정의가 올바르지 않습니다. => ",data);
		}
	},
	pushRow:function(data){
		var _dataBehavior = _DataBehaviorKit.getDataBehavior(this.Source);
		var data = "defaultContent" in this.DataTrancefrom ? this.DataTrancefrom.defaultContent : data ;
		if(typeof data == "object"){
			_dataBehavior.push(data);
		} else {
			this.error("DataController::push::data의 정의가 올바르지 않습니다. => ",data);
		}
	}
},function(data){
	this._super(data,1);
	var own = this;
	_Array(arguments).subarr(1).grouping(2).each(function(group){
		if(group.length == 2){
			var context = FINDZERO(group[0]);
			if( !ISELNODE(context) ) return console.error("ArrayViewController::context를 찾을수 없습니다. 셀렉터 =>",group[0]);
			var render  = group[1];
			own.renderFromTop(context,render);
		} else {
			console.warn("ArrayViewController::data다음의 내용들은 2개씩 입력해야합니다.")
		}
	});
	return this;
});
