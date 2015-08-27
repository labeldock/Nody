if(nody){
	
	nd.MODULE("DrawingObject",{
		getCurrentProperty:function(){		
			var property = nd.clone(this.defaultProps);
			switch(this.type){
				case "circle":
					var radius = nd.parseHigh(this.defaultProps.width,this.defaultProps.height)/2;
					if(!radius && property.radius) radius = property.radius;
					property.radius = radius;
					break;
				case "arc":
					var radius = nd.parseHigh(this.defaultProps.width,this.defaultProps.height)/2;
					if(!radius && property.radius) radius = property.radius;
					property.radius = radius;
					//property.angle = -90;
					//property.startAngle = 0;
					//
					//
					//if(!end) end = 30;
					//property.endAngle =  nd.scalef(2,end,360)*Math.PI;
					//property.stroke   = "#000";
					//property.strokeWidth   = 25;
					//nd.propSet(property,"start",this.defaultProps.start,this.defaultProps.startAngle);
					//nd.propSet(property,"end",this.defaultProps.end,this.defaultProps.endAngle);
				
					break;
			}
			if(!("fill" in property)) property.fill = nd.exp("#\\(0~9)\\(0~9)\\(0~9)\\(0~9)\\(0~9)\\(0~9)");
			return property;
		},
		update:function(){
			switch(this.type){
				case "circle":
					this.fabricObject.set(this.getCurrentProperty());
					break;
				case "pie":
					var arcProperty = this.getCurrentProperty();
					var radius = arcProperty.radius;
					var arc1   = nd.arcPoint(arcProperty.radius,nd.propShift(arcProperty,"start")||0);
					var arc2   = nd.arcPoint(arcProperty.radius,nd.propShift(arcProperty,"end")||30);
					delete arcProperty["radius"];
					delete arcProperty["width"];
					delete arcProperty["height"];
					this.fabricObject.path.splice(0,this.fabricObject.path.length);
					this.fabricObject.path.push(["M", radius, radius]);
					this.fabricObject.path.push(["L", arc1[0], arc1[1]]);
					this.fabricObject.path.push(["A", radius, radius, 0, 0, 1, arc2[0], arc2[1]]);
					this.fabricObject.path.push(["z"]);
					this.fabricObject.set(arcProperty);
					break
			}
		}
	},function(type,defaultProps,coords){
		this.defaultProps = nd.toObject(defaultProps);
		this.coords       = coords;
		this.type = type;
		switch(type){
			case "circle":
				this.fabricObject = new fabric.Circle();
				this.update();
				break;
			case "pie":
				this.fabricObject = new fabric.Path(nd.exp("M 0 0 L 0 0 A 0 0 0 0 1 0 1 z"));
				this.update();
			case "pieText":
				//this.fabricObject = new fabric.Path(nd.exp("M 0 0 L 0 0 A 0 0 0 0 1 0 1 z"));
				//this.update();
			default:
				this.type = "error";
				break;
		}
	});
	nd.EXTEND_MODULE("RoleController","FabricRoleController",{
		minSize:function(w,h){
			var canvas = nd.node(this.canvas);
			w=nd.parseInt(w), h=nd.parseInt(h);
			w && nd.node.style(canvas,"min-width",w+"px")
			h && nd.node.style(canvas,"min-width",h+"px")
		},
		maxSize:function(w,h){
			var canvas = nd.node(this.canvas);
			w=nd.parseInt(w), h=nd.parseInt(h);
			w && nd.node.style(canvas,"max-width",w+"px")
			h && nd.node.style(canvas,"max-width",h+"px")
		},
		size:function(w,h){
			var canvas = this.canvas;
			w=nd.parseInt(w), h=nd.parseInt(h);
			//w && nd.node.style(canvas,"width",w+"px") && nd.node.attr(canvas,"width",w);
			//h && nd.node.style(canvas,"height",h+"px") && nd.node.attr(canvas,"height",h);
			w && this.fabricCanvas.setWidth(w);
			h && this.fabricCanvas.setHeight(h);
		}, 
		width:function(){
			return this.canvas.offsetWidth;
		},
		height:function(){
			return this.canvas.offsetHeight;
		},
		bounds:function(){
			return {x:0,y:0,width:this.width(),height:this.height()};
		},
		add:function(drawingObject,newProperty,newCoords){
			if( typeof drawingObject === "string" ){
				drawingObject = new nd.DrawingObject(drawingObject,newProperty,newCoords);
			}
			if( nd.isModule(drawingObject,"DrawingObject") ){
				this.drawingObjects.push(drawingObject);
				this.fabricCanvas.add(drawingObject.fabricObject);
			}
			return drawingObject;
		},
		update:function(){
			var canvasBounds = this.bounds();
			if(canvasBounds.width < 1 || canvasBounds.height < 1){ 
				this.fabricCanvas.renderAll();
			}
		}
	},function(mainNode,props,fabricProc){
		this._super(mainNode,props,undefined,function(role){
	        requirejs(["fabric"],function(fabric){
				//make canvas
				role.canvas = nd.make("canvas");
				role.node().append(role.canvas);
				//fabric canvas
				role.fabricCanvas   = new fabric.StaticCanvas(nd.node.uniqueID(role.canvas));
				role.drawingObjects = [];
				//resize
				var lastWidth  = 0;
				var lastHeight = 0;
				var resizeCanvas = function(){
					var resizeChange = false;
					if(lastWidth !== role.view.offsetWidth) {
						role.fabricCanvas.setWidth(role.view.offsetWidth);
						resizeChange = true;
					}
					if(lastHeight !== role.view.offsetHeight) {
						role.fabricCanvas.setHeight(role.view.offsetWidth);
						resizeChange = true;
					}
					(resizeChange && role.update())
				};
				nd.node.on(window,"resize",resizeCanvas);
				resizeCanvas();
				//check canvas size
				if(role.width() < 1|| role.height() < 1){
					console.warn("canvas bound is must be 1px upper",role.canvas);
				}
				if(typeof fabricProc === "function"){
					fabricProc.call(role,role);
					role.update();
				}
	        });
		});
	});
	
	N.METHOD("iframeRequest",function(url,success,contentType){
		console.warn("this is devel")
		this._super(url,requestOption,moduleOption);
		var requestFrame = N.create(
			"iframe",
			{src:this.url + (this.url.indexOf("?") > -1 ? "&token=" : "?token=") +N.Util.base36Random(2),style:"display:none;"}
		);
		var dummyRequstObject = {
			"readyState":4,
			"status":200,
			"responseText":""
		}
		var _ = this;
		requestFrame.onload = function(){
			dummyRequstObject.responseText = Array.prototype.slice.call(N.findDocument(requestFrame).body.children);
		}
		N.node.append(document.body,requestFrame);
	});
	
	// Number
	N.EXTEND_MODULE("String","Number",{
		// number core
		// spot 1:prefix 2:integer 3:floatValue 4:suffix
		isNotANumber:function(){ if((new StringNumberInfo(this.Source)).get("number").length) return true; return false; },
		isANumber   :function(){ return !this.isNotANumber(); },
		numberInfo : function(spot){
			//getInfo
			var info = new StringNumberInfo(this.Source);
			info.fixNumberInfo();
		
			//result
			if(typeof spot === "number") switch(spot){
				case 0: return info.get("prefix"); break;
				case 2: return info.get("integer"); break;
				case 3: return info.get("floatValue"); break;
				case 4: return info.get("suffix"); break;
				case 5: return info.get("number"); break;
			}
		
			var info =  { 
				"prefix"     : info.get("prefix"), 
				"suffix"     : info.get("suffix"), 
				"integer"    : info.get("integer"), 
				"floatValue" : info.get("floatValue"), 
				"number"     : info.get("number")
			};
			if(typeof spot === "string") return info.get(spot);
			return info;
		},
		setNumberInfo : function(value,position){
			var i = this.numberInfo();
			switch(position){
				case 1: case "prefix"     : i["prefix"]     = value; break;
				case 4: case "suffix"     : i["suffix"]     = value; break;
				case 2: case "integer"    : i["integer"]    = value; break;
				case 3: case "floatValue" : i["floatValue"] = value; break;
				case 5: case "number"     : i["integer"]    = value; i["floatValue"] = 0; break;
				default: break;
			}
			this.Source = i.prefix + (parseInt(i.integer) + parseFloat(i.floatValue)) + i.suffix;
		},
		// getter // setter
		getInteger     : function()  { return this.numberInfo(2); },
		getFloat       : function()  { return this.numberInfo(3); },
		getFloatNumber : function()  { return this.numberInfo(3).replace(/^0\./,''); },
		getNumber      : function()  { return this.numberInfo(5); },
		getPrefix      : function()  { return this.numberInfo(1); }, 
		getSuffix      : function()  { return this.numberInfo(4); },
		integer        : function() { return this.getInteger()*1;},
		floatNumber    : function() { return this.getFloatNumber()*1;},
		floatValue     : function() { return this.getFloat()*1;},
		number         : function() { return this.getNumber()* 1;},
		// already not support minus
		getTrunc : function(s) { var n = this.number(); return isNaN(s) ? (Math[n > 0 ? "floor" : "ceil"](n)) : (Math[n > 0 ? "floor" : "ceil"](n * Math.pow(0.1,parseInt(s))) * Math.pow(10,parseInt(s))); },
		trunc    : function(s){ this.setNumberInfo( this.getTrunc(s) , 5 ); return this; },
		//size
		less:function(n){
			if( n == isNaN(n) ) return false;
			if( this.isNotANumber() ) return false;
			return this.number() < parseFloat(n);
		},
		great:function(){
			if( n == isNaN(n) ) return false;
			if( this.isNotANumber() ) return false;
			return this.number() > parseFloat(n);
		},
		// math
		percentIn:function(withValue,trunc){
			//소비자가격을 입력하였다면 판매가격도 동기화된다
			var lv = new Number(withValue).number();
			var rv = this.number();
			var result = 0;
	
			//할인율 계산하고 적용
			if(rv > lv){
				result = 0;
			} else {
				result = ((lv - rv) / lv) * 100;
				result = isNaN(result) ? 0 : result;
			}
	
			if(typeof trunc === "number"){return new Number(result).getTrunc(trunc);}
			return result;
		},
		// expression
		expression:function(senceParameter,option){
			var senceNumber  = new Number(senceParameter);
			var optionNumber = new Number(option);
			var result       = NaN;
			switch ( senceNumber.prefix() ) {
				case "+"  : result = this.number() + senceNumber.number(); break;
				case "-"  : result = this.number() - senceNumber.number(); break;
				case "x"  : case "*" : result = this.number() * senceNumber.number(); break;
				case "/"  : result = this.number() / senceNumber.number(); break;
				case "%"  : result = this.number() % senceNumber.number(); break;
				case "++" : result = this.number() + 1; break;
				case "--" : result = this.number() - 1; break;
				case "."  : result = this.number(); break;
				case ".x" : case "?." : result = this.integer(); break;
				case "x." : case ".?" : result = this.floatValue(); break;
				case "?//": result = this.getSuffix(); break;
				case "//?": result = this.getPrefix(); break;
			}
			if(typeof targetPoint === "string"){
				var execResult = /(\+\=|)([0-9]+)(\.[0-9]|)/.exec(targetPoint);
				if(execResult[1] == "+="){
					if(execResult[3] == ""){
						targetPoint = parseInt(execResult[2]) + this.currentValue[0];
					} else {
						targetPoint = parseFloat(execResult[2] + execResult[3]) + this.currentValue[0];
					}
				}
			}
			return result;
		},
		// mask core
		defaultTranslation:{
            '0': {pattern: /\d/},
            '9': {pattern: /\d/, optional: true},
            '#': {pattern: /\d/, recursive: true},
            'A': {pattern: /[a-zA-Z0-9]/},
            'D': {pattern: /[a-zA-Z]/}
		},
		defaultOption:{},
		__Format:function(value,mask,reverse){
			//mask value
			switch(typeof mask){
				case "function" : mask = mask(value); break;
				case "string"   : break;
			}
			if(typeof mask !== "string") console.error("Number::getFormat::첫번째 파라메터는 반드시 string이나 function으로 string이 꼭 되도록 해주세요.",typeof mask,mask);
			//defaultOptions
			skipMaskChars = false;
			//idea by http://igorescobar.github.io/jQuery-Mask-Plugin/
            var buf = [];
            var m = 0; 
			var maskLen = mask.length;
            var v = 0;
			var valLen = value.length;
            var offset = 1;
			var addMethod = "push";
            var resetPos = -1;
            var lastMaskChar,check;
			//
            if (reverse) {
                addMethod = "unshift";
                offset = -1;
                lastMaskChar = 0;
                m = maskLen - 1;
                v = valLen - 1;
                check = function () {
                    return m > -1 && v > -1;
                };
            } else {
                lastMaskChar = maskLen - 1;
                check = function () {
                    return m < maskLen && v < valLen;
                };
            }

            while (check()) {
                var maskDigit   = mask.charAt(m);
                var valDigit    = value.charAt(v);

                var translation = this.defaultTranslation[maskDigit];
                if (translation) {
                    if (valDigit.match(translation.pattern)) {
                        buf[addMethod](valDigit);
                         if (translation.recursive) {
                            if (resetPos === -1) {
                                resetPos = m;
                            } else if (m === lastMaskChar) {
                                m = resetPos - offset;
                            }
                            if (lastMaskChar === resetPos) {
                                m -= offset;
                            }
                        }
                        m += offset;
                    } else if (translation.optional) {
                        m += offset;
                        v -= offset;
                    }
                    v += offset;
                } else {
                    if (!skipMaskChars) {
                        buf[addMethod](maskDigit);
                    }
    
                    if (valDigit === maskDigit) {
                        v += offset;
                    }

                    m += offset;
                }
            }
            var lastMaskCharDigit = mask.charAt(lastMaskChar);
            if (maskLen === valLen + 1 && !this.defaultTranslation[lastMaskCharDigit]) { buf.push(lastMaskCharDigit); }
            return buf.join("");
		},
		numberFormat : function(mask,reverse){
			if(this.getNumber().indexOf("-") == 0){
				return "-" + this.__Format(this.getNumber().substr(1),mask,reverse);
			} else {
				return this.__Format(this.getNumber(),mask,reverse);
			}
		},
		setNumberFormat    : function(){ this.Source = this.getFormat.apply(this,arguments); return this; },
		numberText       : function(v) { return this.Source.replace(/\D/gi,""); },
		numberTextFormat : function(mask,reverse){ return this.__Format(this.numberText(),mask,reverse); },
		setNumberTextFormat    : function(){ this.Source = this.getFormat.apply(this,arguments); return this; },
		decimal:function(p,s){ return  (new N.String(this.numberFormat("#,##0",true))).fixString(p,s);  },
		// calc line
		percentOf : function(maxValue,minValue) { 
			maxValue = N.toNumber(maxValue);
			minValue = N.toNumber(minValue);
			return ((this.number()-minValue)/(maxValue-minValue))*100;},
		pointOf   : function(lengthValue)  { return lengthValue?lengthValue:0/this.integer()*100;  },
		lengthOf  : function(percentValue) { return this.integer()*percentValue?percentValue:0/100 },
		getGCD:function(value){
			function gcd(p, q){
			    if(q==0)return p;
			    var r = p % q;
			    return gcd(q, r);
			}
			return gcd(this.integer(),value);
		}
	});
	
	N.MODULE("ScrollBox",{
		needScrollingOffsetX:function(offset){
			if(!this.allowScrollX || offset == 0 || (typeof offset !== 'number') ) return false;
			var needTo = this.Source.scrollLeft + (-offset);
			if (needTo < 0) { needTo = 0; }
			if (needTo > this.Source.scrollWidth) needTo = this.Source.scrollWidth;
			if (this.Source.scrollLeft != needTo) {
				this.Source.scrollLeft = needTo;
				return true;
			}  else {
				return false;
			}
		},
		needScrollingOffsetY:function(offset){
			if(!this.allowScrollY || offset == 0 || (typeof offset !== 'number') ) return false;
	
			var needTo = this.Source.scrollTop + (-offset);

			if (needTo < 0) {
				this.needNegativeDrawItem();
		
				needTo = this.Source.scrollTop + (-offset);
				if(needTo < 0) needTo = 0;
			}
			if (needTo > this.Source.scrollHeight - this.Source.offsetHeight){
				this.needPositiveDrawItem();
		
				if(needTo > this.Source.scrollHeight){
					needTo = this.Source.scrollHeight;
				} 
			}
			if (this.Source.scrollTop !== needTo) {
				this.Source.scrollTop = needTo;
				return true;
			}
			return false;
		},
		needScrollingToX:function(needTo){
			return this.needScrollingOffsetX( this.Source.scrollLeft - needTo );
		},
		needScrollingToY:function(needTo){
			return this.needScrollingOffsetY( this.Source.scrollTop - needTo );
		},
		needScrollingTo:function(needX,needY){
			return (this.needScrollingToX(needX),this.needScrollingToY(needY));
		},
		needScrollingPercentY:function(per){
			if(typeof per === 'number'){
				if(per < 0) { per = 0; }
				if(per > 100) { per = 100; }
				var scrollTarget = ((this.Source.scrollHeight - this.Source.offsetHeight) / 100) * per;
				this.Source.scrollTop = scrollTarget;
			}
		},
		// var _drawAxisYItem
		drawAxisYItem:function(rend){
			this._drawAxisYItem = rend;
		},
		// true == infinite
		setAllowMakeAxisYItem:function(positive,negative){
			if (typeof positive === "boolean") {
				this.axisYPositiveLength = positive ? 100 : 0;
			} else if(typeof positive === "number") {
				this.axisYPositiveLength = positive;
			}
	
			if (typeof negative === "boolean") {
				this.axisYNegativeLength = negative ? 100 : 0;
			} else if(typeof negative === "number") {
				this.axisYNegativeLength = negative;
			}
			this.needPositiveDrawItem();
		},
		focusTo:function(s){
			var select = N.find(s,this.Source,0);
			if(select) {
				var offset = N.findOffset(select,this.ClipView);
				if(offset) {
					this.needScrollingToX(offset.x + (offset.width / 2) - (this.Source.offsetWidth / 2) );
					this.needScrollingToY(offset.y + (offset.height / 2) - (this.Source.offsetHeight / 2) );
					return select;
				}
			}
			return false;
		},
		needPositiveDrawItem:function(){
			if(typeof this._drawAxisYItem === "function"){
				for(var i=this.axisYPositiveItems.length,l=this.axisYPositiveLength;i<l;i++){
					var node = this._drawAxisYItem(i);
			
					if( N.isNode(node) ) {
						this.axisYPositiveItems.push(node);
						N.$append(this.ClipView,node);
						//정지할지 확인
						if(this.Source.offsetHeight < (this.ClipView.offsetHeight - this.Source.offsetTop)) break;
					} else {
						console.warn("needPositiveDrawItem::렌더링 에러 더이상 드로잉 할수 없습니다.");
					}
				}
			}
		},
		needNegativeDrawItem:function(){
			if(typeof this._drawAxisYItem === "function"){
				if(this.axisYNegativeItems.length < this.axisYNegativeLength){
					var i = ((this.axisYNegativeItems.length * -1) -1);
					var node = this._drawAxisYItem(i);
					if( N.isNode(node) ) {
						this.axisYNegativeItems.push(node);
						N.$prepend(this.ClipView,node);
						this.Source.scrollTop = this.Source.scrollTop + node.offsetHeight;
					} else {
						return console.warn("drawAxisYItem의 값이 잘못되었습니다 노드를 반환해주세요",node);
					}
				}
			}
		},
		restUp:function(){
			return this.Source.scrollTop;
		},
		restDown:function(){
			return this.Source.scrollHeight - this.Source.offsetHeight - this.Source.scrollTop;
		},
		restYSpace:function(){
			var u = this.Source.scrollTop , d = (this.Source.scrollHeight - this.Source.offsetHeight - this.Source.scrollTop);	
			return (u < d)?u:d;
		},
		setAllowVirtureTouch:function(flag){ this.Touch.setAllowVirtureTouch(true); },
		//scroll event
		whenScroll            :function(m){ 
			this.ScrollEvent.Scroll = (!m) ? undefined : N.BIND_FUNCTION(this.ScrollEvent.Scroll,m);
		},
		applyScrollEvent:function(flag){
			if(typeof flag !== "boolean") return;
			if(typeof this._applyScrollEvent === "undefined") {
				var _ = this;
				if(!this._currentMouseWheelEvent) {
					this._currentMouseWheelEvent = function(e){
						if(e.wheelDeltaY) {
							if( (e.wheelDeltaY !== 0) && (_.needScrollingOffsetY(e.wheelDeltaY/3) == true) && (_.restYSpace() !== 0) ) {
								e.stopPropagation();
								e.preventDefault();
							}
							if( (e.wheelDeltaX !== 0) && (_.needScrollingOffsetX(e.wheelDeltaX/3) == true) ) {
								e.stopPropagation();
								e.preventDefault();
							}
						} else if(e.wheelDelta) {
							if( (e.wheelDelta !== 0) && (_.needScrollingOffsetY(e.wheelDelta/3) !== false) && (_.restYSpace() !== 0) ) {
								e.stopPropagation();
								e.preventDefault();
							}
						}
					};
				}
		
				if(!this._currentScrollEvent) {
					this._currentScrollEvent = function(e){
						e.stopPropagation();
						e.preventDefault();
						return N.CALL(_.ScrollEvent.Scroll,_,e);
					};
				}
		
				this._applyScrollEvent = false;
			}
			if(this._applyScrollEvent !== flag) {
				if(flag){
					N.$on(this.Source,"mousewheel",this._currentMouseWheelEvent);
					N.$on(this.Source,"scroll",this._currentScrollEvent);
					this.Touch.applyTouchEvent(true);
				} else {
					N.$off(this.Source,"mousewheel",this._currentMouseWheelEvent);
					N.$off(this.Source,"scroll",this._currentScrollEvent);
					this.Touch.applyTouchEvent(false);
				}
				this._applyScrollEvent = flag;
			}
		},
		getBoundsInfo:function(){
			return  {
				frame:{
					width:this.Source.offsetWidth,
					height:this.Source.offsetHeight,
				},
				clipview:{
					x:this.Source.scrollLeft,
					y:this.Source.scrollTop,
					width:this.ClipView.offsetWidth ,
					//test
					height:this.ClipView.offsetHeight || this.Source.offsetHeight
				},
				contents:{
					width:this.Source.scrollWidth,
					height:this.Source.scrollHeight
				}
			}
		}
	},function(node,direction,virtureTouch){
		this.Source = N.findLite(node)[0];
		this.isMoving = false;
		if(this.Source){
	
			this.axisYPositiveLength = 0;
			this.axisYNegativeLength = 0;
			this.axisYPositiveItems = [];
			this.axisYNegativeItems = [];
	
			this.ClipView = N.make("div.nody-scroll-box-clip-view[style=min-height:100%]");
			N.$style(this.ClipView,"transform","matrix(1,0,0,1,0,0)");
			N.$style(this.ClipView,"position","relative");
	
			N.$append(this.ClipView,this.Source.childNodes);
			N.$append(this.Source,this.ClipView);
	
			//
			this.ScrollEvent = {};
	
			this.Touch = new N.Touch(this.Source);
	
			switch(direction) {
				case 'horizontal':
					this.allowScrollX = true;
					this.allowScrollY = false;
					break;
				case 'vertical':
					this.allowScrollX = false;
					this.allowScrollY = true;
					break;
				default :
					if(direction !== undefined) console.warn('ScrollBox :: direction 파라메터 영역에 알수없는 커멘드가 들어왔습니다.',direction)
					this.allowScrollX = true;
					this.allowScrollY = true;
					break;
			}
	
			N.$style(this.Source,"overflow","hidden");
			N.$style(this.Source,"position","relative");
	
			var _ = this;
			//
			this.Touch.whenTouchMove(function(offsetX,offsetY,e){
				var result = false;
				if( (offsetY !== 0) && (_.needScrollingOffsetY(offsetY) == true) && (_.restYSpace() !== 0) ) result = true;
				if( (offsetX !== 0) && (_.needScrollingOffsetX(offsetX) == true) ) result = true;
				if(result) _.isMoving = true;
				return result;
			});
			this.Touch.whenTouchEnd(function(){
				var t = setTimeout(function(){
					_.isMoving = false;
					clearTimeout(t);
				},10);
			});
			this.applyScrollEvent(true);
	
			if(virtureTouch === true) this.setAllowVirtureTouch(true);
		} else {
			console.warn("ScrollBox제대로 불러오지 못했습니다.",node);
		}
	});

	N.EXTEND_MODULE("ScrollBox","ZoomBox",{
		needZoom:function(needTo){
			needTo = N.toNumber(needTo);
			if(needTo < this.zoomMin) needTo = this.zoomMin;
			if(needTo > this.zoomMax) needTo = this.zoomMax;
	
			if(needTo === this.ZoomValue) return false;
	
			var offsetWidth  = Math.floor(((this.ClipView.offsetWidth  * needTo) - this.ClipView.offsetWidth) / 2);
			var offsetHeight = Math.floor(((this.ClipView.offsetHeight * needTo) - this.ClipView.offsetHeight) / 2);
	
			var zoomOffset = this.ZoomValue - needTo;
			if( zoomOffset !== 0) {
				this.needScrollingOffsetX( (this.Source.offsetWidth  * zoomOffset) / 2 );
				this.needScrollingOffsetY( (this.Source.offsetHeight * zoomOffset) / 2 );
			}
	
			N.$style(this.ClipView,"transform","matrix("+needTo+",0,0,"+needTo+","+offsetWidth+","+offsetHeight+")");
	
			var _ = this;
	
			if( !this.wasClipTimeout ) clearTimeout(this.wasClipTimeout);
			this.wasClipTimeout = setTimeout(function(){ N.CALL(_.ZoomEvent,_); },305);
	
			N.CALL(this.ZoomEvent,this);
			this.ZoomValue = needTo;
	
			return true;
		},
		needZoomWithOffset:function(offset){ 
			return this.needZoom(this.ZoomValue + offset);
		},
		whenZoom:function(event){ this.ZoomEvent = event; },
		resizeFix:function(){
			this.nzClipWidth  = this.Source.scrollWidth;
			this.nzClipHeigth = this.Source.scrollHeight;
		},
		getBoundsInfo:function(){
			var bi = this._super();
			bi.clipview.zoom     = this.ZoomValue;
			bi.contents.nzWidth  = this.nzClipWidth;
			bi.contents.nsHeight = this.nzClipHeigth;
			return bi;
		},
		setAllowZoom:function(flag){
			this.Touch.allowPinch = !!flag;
			this._allowZoom        = !!flag;
			return this;
		}
	},function(mainNode,initZoom){
		//scrollbox이벤트의 휠 이벤트를 변경
		var _ = this;
		this._currentMouseWheelEvent = function(e){
			e.preventDefault();
			if(_._allowZoom) if(e.wheelDelta) _.needZoomWithOffset(e.wheelDelta/1500)
		}

		this._super(mainNode);
		this.ZoomValue = 1.0
		this.zoomMin   = 1.0;
		this.zoomMax   = 3.0;
		this.ZoomEvent;
		this.resizeFix();
		this._allowZoom = true;
		this.Touch.whenPinch(function(zoomOffset,e){ 
			if(_._allowZoom) _.needZoomWithOffset(zoomOffset/30); 
		});
		this.setAllowVirtureTouch(true);

		if(typeof initZoom == "number") this.needZoom(initZoom);
	});

	N.MODULE("ScrollTrack",{		
		resizeFix:function(){
			if(this._autoScrollTrackHeight && this._autoScrollBoxSync){
				var scrollBox = this._autoScrollBoxSync;
				var lengthPer = ((100 / scrollBox.Source.scrollHeight) * scrollBox.Source.offsetHeight)/100;
				N.$style(this.ScrollHanlde,'height',N.toPx(this.ScrollTrack.offsetHeight * lengthPer));
		
			}
			this.scrollLength = this.ScrollTrack.offsetHeight - this.ScrollHanlde.offsetHeight;
			if( (typeof this.scrollPoint) !== 'number') this.scrollPoint = 0;
		},
		needScrollOffset:function(y){
			var needTo = this.scrollPoint + y;

			if(needTo < 0) {
				this.scrollPoint = 0;
			} else if(needTo > this.scrollLength) {
				this.scrollPoint = this.scrollLength;
			} else {
				this.scrollPoint = needTo;
			}
			N.$style(this.ScrollHanlde,'top',N.toPx(this.scrollPoint));
			N.CALL(this._whenScroll);
		},
		needScrollPercent:function(per){
			N.$style(this.ScrollHanlde,'top',N.toPx((this.scrollLength / 100) * per));
		},
		whenScroll:function(m){
			var _ = this;
			if(typeof m === 'function') this._whenScroll = function(){ m.call(_,(100 / _.scrollLength ) * _.scrollPoint)};
		},
		syncWithScrollBox:function(scrollBox){
			if(typeof scrollBox === 'object' && 'needScrollingPercentY' in scrollBox) {
				var _ = this;
				this.whenScroll(function(per){
					scrollBox.needScrollingPercentY(per);
				});
				scrollBox.whenScroll(function(a,b,c){
					_.needScrollPercent( (100 / (scrollBox.Source.scrollHeight - scrollBox.Source.offsetHeight)) * scrollBox.Source.scrollTop );
				});
				this._autoScrollBoxSync = scrollBox;
				this.resizeFix();
			}
		}
	},function(scrollContainer,direction,autoResizeFix,autoScrollTrackHeight){
		this.Source      = N.findLite(scrollContainer)[0];

		if(!this.Source) {
			return console.warn('스크롤바 초기화 실패하였습니다.');
		}

		this.ScrollHanlde = N.make('div.nody-scroll-handle',{style:'position:relative;'});
		this.ScrollTrack  = N.make('div.nody-scroll-track',{style:'position:absolute;'},this.ScrollHanlde);

		N.$put(this.Source,this.ScrollTrack);

		this.Touch = new N.Touch(this.ScrollHanlde,true);
		this.Touch.setAllowVirtureTouch(true);
		var _ = this;
		this.Touch.whenTouchMove(function(x,y){
			if( _.ScrollTrack.offsetHeight - _.ScrollHanlde.offsetHeight > 0) _.needScrollOffset(y);
		});

		if(autoResizeFix !== false) {
			N.$on(window,'resize',function(){
				_.resizeFix();
			});
		}
		this._autoScrollTrackHeight = autoScrollTrackHeight;

		this.resizeFix();
	});
	
	N.EXTEND_MODULE("Contexts","ActiveContexts",{
		whenWillActive:function(method){ this.ContextsEvents.willActive = method; return this; },
		whenDidActive:function(method){ this.ContextsEvents.didActive = method; return this;},
		whenDidInactive:function(method){ this.ContextsEvents.didInactive = method; return this; },
		whenWillChange:function(method){ this.ContextsEvents.willChange = method; return this;},
		whenDidChange:function(method){ this.ContextsEvents.didChange = method; return this;},
		whenActiveToggle:function(am,im){ this.whenDidActive(am); return this.whenDidInactive(im); },
		whenActiveStart:function(method){ this.ContextsEvents.activeStart = method; return this; },
		whenActiveEnd:function(method){this.ContextsEvents.activeEnd = method; return this;},
		shouldTriggering:function(index,wait){
			var _ = this;
			if(typeof index !== 'number') console.warn('index는 반드시 number이여야 합니다.');
		
			if((wait === 0) || (wait === false)) {
				_.on(_.ContextsEventName,index,wait);
			} else {
				var t = setTimeout(function(){
					_.on(_.ContextsEventName,index,wait);
					clearTimeout(t);
				},(typeof wait === 'number') ? wait : N.toNumber(wait));
			}
			return this;
		},
		getActiveIndexes:function(lastIndex){
			this.selectPoolStart();
		
			var indexes = [];
			N.dataEach( this.selects() ,function(node,i){ 
				if(N.node.hasClass(node,'active')) indexes.push(i); 
			 });
		 
			this.selectPoolEnd();
		
			if(typeof lastIndex === 'number')
				return indexes[lastIndex];
			if(lastIndex === true)
				return indexes[indexes.length - 1];
				return indexes;
		},
		setActiveIndexes:function(indexes,withEvent){;
			this.selectPoolStart();
		
			var indexesObject = new N.Array(indexes);
		
			if(withEvent === false) {
				N.dataEach( this.selects() , function(node,i){
					if( indexesObject.has(i) ) {
						if( !N.node.hasClass(node,'active') ) N.node.addClass(node,'active');
					} else {
						if( N.node.hasClass(node,'active') ) N.node.removeClass(node,'active');
					} 
				});
			} else {
				var _ = this;
				N.dataEach( this.selects() , function(node,i){
					if( indexesObject.has(i) ) {
						if( !N.node.hasClass(node,'active') ) _.shouldTriggering(i,withEvent);
					} else {
						if( N.node.hasClass(node,'active') ) _.shouldTriggering(i,withEvent);
					} 
				});
			}
			this.selectPoolEnd();
			return this;
		},
		shouldActive:function(index,withEvent,unique){
			if(typeof index === 'number') {
				this.selectPoolStart();
			
				var activeIndexes = this.getActiveIndexes();
				if( !N.dataHas(activeIndexes,index) ) {
					if(unique === true) {
						this.setActiveIndexes([index],withEvent);
					} else {
						activeIndexes.push(index);
						this.setActiveIndexes(activeIndexes,withEvent);
					}
				}
				this.selectPoolEnd();
			}
			return this;
		},
		shouldInactive:function(index,withEvent){
			if(typeof index === 'number') {
				this.selectPoolStart();
				var activeIndexes = new N.Array(this.getActiveIndexes()) ;
				if( N.dataHas(activeIndexes,index) ) {
					activeIndexes.remove(index);
					this.setActiveIndexes(activeIndexes,withEvent);
				}
				this.selectPoolEnd();
			}
			return this;
		},
		getActiveSelects:function(){
			this.selectPoolStart();
			var r = N.dataFilter(this.selects(),function(node){ return N.node.hasClass(node,'active'); });
			this.selectPoolEnd();
			return r;
		},
		getInactiveSelects:function(){
			this.selectPoolStart();
			var r = N.dataFilter(this.selects(),function(node){ return !N.node.hasClass(node,'active'); });
			this.selectPoolEnd();
			return r;
		},
		activeAll:function(withEvent){
			this.selectPoolStart();
			this.setActiveIndexes(N.dataMap(this.selects(),function(n,i){ return i; }),withEvent);
			this.selectPoolEnd();
			return this;
		},
		inactiveAll:function(withEvent){
			this.selectPoolStart();
			this.setActiveIndexes([],withEvent);
			this.selectPoolEnd();
			return this;
		},
		hasActive:function(){
			var result = false;
			this.selectPoolStart();
			var selects = this.selects();
			for(var i=0,l=selects.length;i<l;i++) if(N.node.is(selects[i],'.active')){ result = true; break; }
			this.selectPoolEnd();
			return result;
		},
		isActiveAll:function(){
			var result;
			this.selectPoolStart();
			result = (this.getActiveSelects().length == this.selects().length);
			this.selectPoolEnd();
			return result;
		},
		resetActiveTargetWithContexts:function(con,sel,pool){	
			var selects = this.getActiveIndexes();
			N.CALL(pool);
			this._initParams[0] = con || this._initParams[0];
			this._initParams[1] = sel || this._initParams[1];
			if(selects.length) this.setActiveIndexes(selects,false);
		},
		resetActiveTarget:function(sel){
			this.resetActiveTargetWithContexts(undefined,sel);
		},
		resetActiveTargetWithPool:function(sel,pool){
			this.resetActiveTargetWithContexts(undefined,sel,pool);
		}
	},function(cSel,sSel,selectEvent,willActive,shouldActiveIndex,allowMultiActive,allowInactive){
		this._super(cSel,sSel);
		this.ContextsEvents = {};
		this.ContextsEventName = (typeof selectEvent === "string") ? selectEvent : "click";
		this.preventDefault   = true;
		this.allowAutoActive  = true;
		this.allowMultiActive = (typeof allowMultiActive === "boolean") ? allowMultiActive : false;
		this.allowInactive    = (typeof allowInactive === "boolean")    ? allowInactive    : this.allowMultiActive;
		//
		var _ = this;
		this.on(this.ContextsEventName,function(e,i){
			var yesEvent = e.arguments ? !(e.arguments[0] === false) : true;
		
			var currentSelects = _.selects();
		
			if(_.preventDefault) e.preventDefault();
		
			//액티브가 실행될시
			if(yesEvent) if( N.CALL(_.ContextsEvents.willActive,this,e,i) === false ) return false;
		
			//자동으로 액티브 실행
			if(_.allowAutoActive) {
				//이미 액티브 된 상태의 아이템의 경우 
				if(N.node.hasClass(this,"active")) {
					if(_.allowInactive) {
						//인액티브가 가능한 경우
						if(yesEvent) N.CALL(_.ContextsEvents.willChange,this,i);
						N.node.removeClass(this,"active");
						if(yesEvent) N.CALL(_.ContextsEvents.didChange,this,i);
						if(yesEvent) if( N.find(".active",currentSelects).length == 0 ) N.CALL(_.ContextsEvents.activeEnd,this,i);
						return false;
					} else {
						//인액티브가 불가능한 경우
						return false;
					}
				}
				//새로운 액티브를 만들기 위한 순서
				//액티브 Item들을 찾아냄
				var activeItems = N.find(".active",currentSelects);
			
				if(_.allowMultiActive) {
					//다중 Active를 허용하는 경우
					if(yesEvent) N.CALL(_.ContextsEvents.willChange,this,i);
					N.node.addClass(this,"active");
					if(yesEvent) if(activeItems.length === 0) N.CALL(_.ContextsEvents.activeStart,this,i);
					if(yesEvent) N.CALL(_.ContextsEvents.didActive,this,i);
					if(yesEvent) N.CALL(_.ContextsEvents.didChange,this,i);
					//deactive를 실행하지 않음
					return false;
				} else {
					//다중 Active를 허용하지 않는 경우
					//인액티브 대상을 찾아 인액티브 시킵니다.
					(new N.Array(currentSelects)).remove(this).each(function(node){
						if(_.allowAutoActive) {
							N.node.removeClass(node,"active");
							if(yesEvent) N.CALL(_.ContextsEvents.didInactive,node);
						}
					});
				
					//액티브를 시작합니다.
					if(yesEvent) N.CALL(_.ContextsEvents.willChange,this,i);
					N.node.addClass(this,"active");
					if(yesEvent) if(activeItems.length === 0) N.CALL(_.ContextsEvents.activeStart,this,i);
					if(yesEvent) N.CALL(_.ContextsEvents.didActive,this,i);
					if(yesEvent) N.CALL(_.ContextsEvents.didChange,this,i);
					return false;
				}
			} 
		});
	
		//whenWillActiveSet
		if(willActive) this.whenWillActive(willActive);
		//shouldActiveSet
		if(typeof shouldActiveIndex === "function") shouldActiveIndex = shouldActiveIndex.call(this);
		if(typeof shouldActiveIndex === "number") this.shouldActive(shouldActiveIndex,1);
	});
	
	N.MODULE('ActiveContextsGroup',{
		getActiveIndexes:function(sourceIndex){
			var selectSource = this.Source[sourceIndex || (this.Source.length - 1) ];
			if(selectSource) return selectSource.getActiveIndexes();return [];
		},
		setActiveIndexes:function(indexes,withEvent,sender){
			(new N.Array(this.Source)).remove(sender).each(function(ac, i){ 
				ac.setActiveIndexes( indexes, (i === 0) ? (withEvent && true) : false ); });
			return this;
		},
		shouldInactive:function(index,withEvent,sender){
			(new N.Array(this.Source)).remove(sender).each(function(ac, i){
				//첫번째만 무조건 이벤트 발생
				ac.shouldInactive( index, (i === 0) ? (withEvent && true) : false ); 
			});
			return this;
		},
		shouldActive:function(index,withEvent,unique){
			N.dataEach(this.Source,function(ac,i){
				//첫번째만 무조건 이벤트 발생
				ac.shouldActive( index, (i === 0) ? (withEvent && true) : false, unique); 
			});
			return this;
		},
		activeAll:function(withEvent, sourceIndex){
			var lastSource = this.Source[ sourceIndex || (this.Source.length - 1) ];
			if(lastSource) this.setActiveIndexes(N.dataMap(lastSource.selects(),function(n,i){
				return i;
			}),withEvent && true);	
			return this;
		},
		inactiveAll:function(withEvent){
			this.setActiveIndexes([],withEvent && true);
		},
	
		getActiveSelects:function(sourceIndex){
			var selectSource = this.Source[sourceIndex || (this.Source.length - 1)];
			return selectSource.getActiveSelects();
		},
		hasActive:function(sourceIndex){
			var selectSource = this.Source[sourceIndex || (this.Source.length - 1)];
			return selectSource.hasActive();
		},
		syncActiveContexts:function(sender,syncPrevIndexes){
			this.Source.push(sender);
			var rootManager = this;
			sender.whenWillActive(
				function(i){ 
					var who=this; 
					return N.CALL(rootManager.ContextsEvents.willActive,who,i); 
				}
			);
			sender.whenDidActive(
				function(i){ 
					var who=this;
					rootManager.setActiveIndexes(sender.getActiveIndexes(),false,sender);
					return N.CALL(rootManager.ContextsEvents.didActive,who,i);
				}
			);
			sender.whenDidInactive(
				function(i){
					rootManager.setActiveIndexes(sender.getActiveIndexes(),false,sender);
					var who=this; 
					return N.CALL(rootManager.ContextsEvents.didInactive,who,i);
				}
			);
			sender.whenWillChange(
				function(){ 
					var who=this; 
					return N.CALL(rootManager.ContextsEvents.willChange,who);
				}
			);
			sender.whenDidChange(
				function(i){ 
					var who=this; 
					rootManager.setActiveIndexes(sender.getActiveIndexes(),false,sender);
					return N.CALL(rootManager.ContextsEvents.didChange,who,i);
				}
			);
			sender.whenActiveStart(
				function(i){ 
					var who=this;
					return N.CALL(rootManager.ContextsEvents.activeStart,who,i);
				}
			);
			sender.whenActiveEnd(
				function(i){ 
					var who=this;
					return N.CALL(rootManager.ContextsEvents.activeEnd,who,i);
				}
			);
		
			if(syncPrevIndexes === true) {
				var lastSource = this.Source[this.Source.length - 1];
				if(lastSource) sender.setActiveIndexes(lastSource.getActiveIndexes(),false);
			}
			return sender;
		},
		makeActiveContexts:function(){
			return this.syncActiveContexts(_ActiveContexts.apply(ActiveContexts,Array.prototype.slice.call(arguments)));
		},
		whenWillActive:function(method){ this.ContextsEvents.willActive = method; return this; },
		whenDidActive:function(method){ this.ContextsEvents.didActive = method; return this;},
		whenDidInactive:function(method){ this.ContextsEvents.didInactive = method; return this; },
		whenWillChange:function(method){ this.ContextsEvents.willChange = method; return this;},
		whenDidChange:function(method){ this.ContextsEvents.didChange = method; return this;},
		whenActiveToggle:function(am,im){ this.whenDidActive(am); return this.whenDidInactive(im); },
		whenActiveStart:function(method){ this.ContextsEvents.activeStart = method; return this; },
		whenActiveEnd:function(method){this.ContextsEvents.activeEnd = method; return this;}
	},function(controller){ 
		this.ContextsEvents = {};
		this.Source = []; 
	});
	
}
