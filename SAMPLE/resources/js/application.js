
var GNBNFContentLoader = new NFContentLoader("main",function(){	
	//active event controller
	return this.needActiveController("#gnb menu","a","click",function(){
		//willActive evnet
		return GNBNFContentLoader.active((this.textContent || this.innerText).toLowerCase());
	},2).makeAccessProperty(function(accessData,node){
		//navigation data
		var name = (node.textContent || node.innerText).toLowerCase(),href = node.getAttribute("href");
		if(name && href) accessData[name] = href;
	});
});
var gnb = GNBNFContentLoader;
var appearLoad = function(){
	/*linehide*/
	var css3Transform = function(query,value){
		",-webkit-,-moz-,-ms-,-o-".replace(/[^\,]*\,/g,function(s){ 
			$(query).css(s.replace(",","")+"transform",value);
		});
	}
	window.css3Transform = css3Transform;
	/*linehide*/
	
	/* Actions */
	FIND("#green-box",ELON,"click",function(){
		css3Transform(".gage-box-line-container",ZSTRING("rotate(\\(-80~20)deg)"));
	});
	FIND("#yellow-box",ELON,"click",function(){
		css3Transform(".gage-box-line-container",ZSTRING("rotate(\\(-20~20)deg)"));
	});
	FIND("#red-box",ELON,"click",function(){
		css3Transform(".gage-box-line-container",ZSTRING("rotate(\\(20~80)deg)"));
	});
};
var appearOpen = function(){
	
	/* CSS3 transform function for all browser */
	var css3Transform = function(query,value){
		",-webkit-,-moz-,-ms-,-o-".replace(/[^\,]*\,/g,function(s){ 
			$(query).css(s.replace(",","")+"transform",value);
		});
	}
	/*break*/
	/* Each element select and touch complete then fire */ 
	FIRE(FIND(".appear-ready"),
		function(node,i,touch){
			var timeout = 100*i;
	
			setTimeout(function(){
				$(node).addClass("appear-submit");
				touch();
			},timeout);
		},
		function(){
			setTimeout(function(){
				css3Transform(".gage-box-line-container",ZSTRING("rotate(\\(-60~60)deg)"));
			},500);
		}
	)
};

GNBNFContentLoader.whenLoad("appear",function(){
	FIND(".code-block-1 code",ELVALUE,CODE(FIND(".read-block-1",0)));
	CODEBLOCK(".code-block-1");
	
	FIND(".code-block-2 code",ELVALUE,CODE(appearOpen,appearLoad));
	CODEBLOCK(".code-block-2");
	
	appearLoad();
})
GNBNFContentLoader.whenActiveToggle("appear",function(){	
	appearOpen();
},function(){
	FIND(".appear-ready",DATAEACH,function(node,i){
		$(node).removeClass("appear-submit");
	});
	window.css3Transform(".gage-box-line-container","rotate(-100deg)");
});
GNBNFContentLoader.whenLoad("mvvm",function(){
    var data = {"list":[
    	{title:"Section1",list:[{title:"Item1"},{title:"Item2"}]},
  		{title:"Section2",list:[{title:"Item4"},{title:"Item5"}]},
		{title:"Section3",list:[{title:"Item7"},{title:"Item8"}]}
    ]};
	
	var mvvmXMP =  $(MAKE("XMP")).appendTo("#init-data-view");
	
	//데이터를 불러거나 다시 출력하는 역활
    var dataContext = new NFDataContext(data,"list");
	
	//뷰를 그리는 방법을 정의
	var itemIndex = 10;
	var viewModel = new NFViewModel("template#mvvm-ul","template#mvvm-list","template#mvvm-td");
	//뷰를 그리고 이벤트를 등록함
    var listViewController = new NFPresentor("#listContainer",dataContext.getRootManagedData(),viewModel);
	listViewController.dataDidChange = function(){
		var xmpText = dataContext.getJSONString().replace(/\:\[/,":[\n\t").replace(/\}\]\}\,(\s|)/g,"}]},\n\t").replace("]}]}","]}\n]}");
		mvvmXMP.text(xmpText);
	}
	listViewController.dataDidChange();
    listViewController.needDisplay();
});

// common data
var viewData = [
	{name:"Ghana",native:"Republic of Ghana",image:"resources/images/Ghana.png"},
	{name:"Gabon",native:"République Gabonaise",image:"resources/images/Gabon.png"},
	{name:"Guyana",native:"Co-operative Republic of Guyana",image:"resources/images/Guyana.png"},
	{name:"Gambia",native:"Republic of The Gambia",image:"resources/images/Gambia.png"},
	{name:"Guatemala",native:"República de Guatemala",image:"resources/images/Guatemala.png"},
	{name:"Greece",native:"Ελληνική Δημοκρατία",image:"resources/images/Greece.png"}
];
var viewNFDataContext = new NFDataContext(viewData);
window.viewNFDataContext = viewNFDataContext;

var viewModels = {
	"small":new NFViewModel(function(){
		return this.placeholder("ul");
	},function(){
		return MAKE("li.inline-box.small-box.text-center",
			MAKE("img",{src:this.value("image")})
		);
	}),
	"large":new NFViewModel(function(){
		return this.placeholder("ul");
	},function(){
		return MAKE("li.inline-box.text-center",
			MAKE("img",{src:this.value("image")}),
			this.bind("native","p")
		);
	}),
	"list":new NFViewModel(function(){
		return MAKE("table.table",
			MAKE("thead",
				MAKE("tr",
					MAKE("th::name"),
					MAKE("th::native"),
					MAKE("th::image")
				)
			),
			this.placeholder("tbody")
		);
	},function(){
		
		return MAKE("tr",
			MAKE("td",this.bind("name","input.full-width")),
			MAKE("td",this.bind("native","input.full-width")),
			MAKE("td",this.bind("image","p"))
		)	
	})
}

GNBNFContentLoader.whenLoad("viewmodel",function(){	

	var viewController = new NFPresentor("#view-display",viewNFDataContext);
	
	var viewType = new NFContexts("#view-type","button");
	
	viewType.onSelects("click",function(){
		
		var viewModelName = $(this).addClass("active").attr("viewmodel");
		if(viewModelName in viewModels) viewController.needDisplayWithViewModel(viewModels[viewModelName]);
		
	},function(){
		$(this).removeClass("active");
	});
	
	$("#view-type button").eq(1).trigger("click");
	
	$("#view-data-2").click(function(){
		$("#viewmodel-modal").find("#viewmodel-modal-data").text(viewNFDataContext.getJSONString());
		$("#viewmodel-modal").modal();
	});
	
});
GNBNFContentLoader.whenLoad("selectbind",function(){
	// view model
	var listNFViewModel = new NFViewModel(
	function(){
		return this.placeholder("div.menu.list-group");
	},function(){
		return MAKE("a.list-group-item",
			MAKE("h4.list-group-item-heading",MAKE("img",{src:this.value("image")}),MAKE("span",{html:"&nbsp;"}),this.bind("name","span")),
			this.bind("native","p.list-group-item-text")
		);
	});
	
	var itemNFViewModel = new NFViewModel(function(){
		return MAKE("div",
			MAKE("h5::Name"),
			this.bind("name"),
			MAKE("h5::Native"),
			this.bind("native"),
			MAKE("h5::Image"),
			this.bind("image","p")
		);
	});
	var itemController = new NFPresentor("#bind-item-display",undefined,itemNFViewModel);
	
	// list view
	var viewController = new NFPresentor("#bind-display",viewNFDataContext,listNFViewModel,function(){
		
		var activeController = this.needActiveController('/*',function(e,managedData){
			itemController.needDisplayWithData(managedData);
		},false,true);
		
		activeController.whenActiveStart(function(){
			$(".side-bar-container").addClass("side-bar-active");
		});
		
		activeController.whenActiveEnd(function(){
			$(".side-bar-container").removeClass("side-bar-active");
		});
		
		$('#bind-close-button').on('click',function(){
			activeController.inactiveAll();
		});
		
		return true;
	});
	
});
GNBNFContentLoader.whenLoad("multiselect",function(){
	var multiNFViewModel = new NFViewModel(function(){
		return this.placeholder("div.row-fluid");
	},function(){
		return MAKE("div.col-sm-6",
			MAKE("div.thumbnail",
				MAKE("img",{src:this.value("image")}),
				MAKE("div.caption",
					this.bind("name","h3"),
					this.bind("native","p")
				)
			)
		);
	});
	var viewController = new NFPresentor("#multiselect-display",viewNFDataContext,multiNFViewModel,function(){
		var activeController = this.needActiveController('/*',null,true,true);
		activeController.whenActiveStart(function(){
			$(".side-bar-container").addClass("side-bar-active");
		});
		activeController.whenActiveEnd(function(){
			$(".side-bar-container").removeClass("side-bar-active");
		});
		
		$("#replaceData-submit").click(function(){
			var model = new NFModel("#replaceData").removeNothing();
		
			if(model.count()){
				DATAEACH(DATAMAP(activeController.getActiveSelects(),function(node){
					return viewController.getManagedDataWithNode(node);
				}),function(managedItem){
					model.each(function(value,key){
						managedItem.value(key,value);
					});
					_NFForm("#replaceData").empty();
					activeController.inactiveAll();
				});
			}
		});
		
		return true;
	});
	
});

GNBNFContentLoader.whenLoad("scroll",function(){
	var scrollBox    = new NFScrollBox("#scroll-box");
	var calendarBox  = new NFScrollBox("#calendar-box");
	var countDisplay = $("#calendar-box-count");
	var nowMoment    = new MixedMoment("ko");
	
	$(document).on("click",".zoomp",function(){
		LG("click zoom plus");
		scrollBox.needZoomWithOffset(0.2);
	});
	$(document).on("click",".zoomm",function(){
		LG("click zoom minus");
		scrollBox.needZoomWithOffset(-0.2);
	});
	calendarBox.drawAxisYItem(function(index){
		setTimeout(function(){
			countDisplay.text( ("generated to down : [" + calendarBox.axisYPositiveItems.length + "] generated to up : ["+ calendarBox.axisYNegativeItems.length+"]") );
		},1);
		
		var drawMoment = nowMoment.clone().setCommand("add",index,"month");
		
		return MAKE("div.calendar",
			MAKE("h1::"+drawMoment.format("YYYY년 MM월")),
			MAKE("table.calendar",
				MAKE("thead",drawMoment.drawCalendarHeaderRow(function(node){ 
					var $node = $(node);
					return $node.text( $node.text().substr(0,1) )[0];
				})),
				MAKE("tbody",drawMoment.drawCalendarBodyRows())
			)
		);
	});
	calendarBox.setAllowMakeAxisYItem(200,200);
});

var somenode = MAKE("div#one.two.three",MAKE("ul.list",MAKE("li.item"),MAKE("li.item"),MAKE("li.item")));
var testset = [
function(){
IMPORTNODE( document.querySelectorAll("template#test")[0] );
},
function(){
IMPORTNODE( $("template#test")[0] );
},
function(){
$("<div id='one' class='two three' />").append(
	$("<ul class='list' />").append(
		$("<li class='item'/>").data("alias","item"),
		$("<li class='item'/>").data("alias","item"),
		$("<li class='item'/>").data("alias","item")
	)
)

},
function(){
MAKE("div#one.two.three",
	MAKE("ul.list",
		MAKE("li.item",{"dataset":{"alias":"item"}}),
		MAKE("li.item",{"dataset":{"alias":"item"}}),
		MAKE("li.item",{"dataset":{"alias":"item"}})
	)
);
},
function(){
CLONENODES(somenode)[0];
},
function(){
IMPORTNODE( 
	MAKETEMP(
		TAG("div#one.two.three",
			TAG("ul.list",
				TAG("li.item"),
				TAG("li.item"),
				TAG("li.item")
			)
		)  
	) 
);
},
function(){
IMPORTNODE( FIND("template#test",0) );
},
function(){
_NFTemplate("template#test").get();
}
]
GNBNFContentLoader.whenLoad("speedtest",function(){
	setTimeout(function(){
		TIMES(testset.length,function(i){
			FIND(".code-block-"+ i +" code",ELVALUE,CODE(testset[i]));
			CODEBLOCK(".code-block-"+ i);
		});
		FIND(".code-block-template code",ELVALUE,CODE("template#test"));
		CODEBLOCK(FIND(".code-block-template",0));
	
		ELON("#teststart","click",function(){
			DATAEACH(testset,function(method,i){
				MARK("test"+i);
				TIMES(2000,function(){
					method();
				});
				FIND(".test-"+i+" .text-danger",ELVALUE,MARK("test"+i));
			});
		});
	},500);
});

var testset2 = [
function(){
	var p = [];
	DATAEACH([1,2,3,4],function(v){
		p.push(v+1);
	});
},
function(){
	var p = DATAMAP([1,2,3,4],function(v){
		return v+1;
	});
},
function(){
	$.map([1,2,3,4],function(v){ return v+1; })
},
function(){
	var d = [1,2,3,4];
	var p = [];
	for(var i=0,l=d.length;i<l;i++) p.push(d[i]+1);
}

]

GNBNFContentLoader.whenLoad("speedtest2",function(){
	setTimeout(function(){
		TIMES(testset2.length,function(i){
			FIND(".code-block-"+ i +" code",ELVALUE,CODE(testset2[i]));
			CODEBLOCK(".code-block-"+ i);
		});
		FIND(".code-block-template code",ELVALUE,CODE("template#test"));
		CODEBLOCK(FIND(".code-block-template",0));
	
		ELON("#teststart","click",function(){
			DATAEACH(testset2,function(method,i){
				MARK("test"+i);
				TIMES(8000,function(){
					method();
				});
				FIND(".test-"+i+" .text-danger",ELVALUE,MARK("test"+i));
			});
		});
	},500);
});

GNBNFContentLoader.whenLoad("canvas2d",function(){
	var canvasArea = $("#canvas-area",this);
	var canvasBackground = $("#canvas-background td",this);
	_NFContext2D(100).drawCrossLine(2,0,0,0).needDraw().appendTo(canvasArea);
	_NFContext2D(100).drawCrossLine(2,2,0,0).needDraw().appendTo(canvasArea);
	_NFContext2D(100).drawCrossLine(4,4,4,0).needDraw().appendTo(canvasArea);
	_NFContext2D(100).drawCrossLine(6,6,6,6).needDraw().appendTo(canvasArea);
	
	
	_NFContext2D(canvasBackground.eq(0)).drawCrossLine(4,4,4,5).needDraw().backgroundToResponder();
	_NFContext2D(canvasBackground.eq(1)).drawCrossLine(0,4,0,4,"#5c5").needDraw().backgroundToResponder();
	_NFContext2D(canvasBackground.eq(2)).drawCrossLine(0,0,4,4).needDraw().backgroundToResponder();
	_NFContext2D(canvasBackground.eq(3)).drawCrossLine(4,4,0,0,"#cc5").needDraw().backgroundToResponder();
	_NFContext2D(canvasBackground.eq(4)).drawCrossLine(0,4,4,4).needDraw().backgroundToResponder();
	_NFContext2D(canvasBackground.eq(5)).drawCrossLine(4,0,0,4).needDraw().backgroundToResponder();
	
});

GNBNFContentLoader.whenLoad('formcontroller',function(){	
	
	var plainNFFormController = new NFFormController('.plain-form-area',null,{
		normal:function(){
			this.controls(function(){
				$(this).css('color','inherit');
			},'.em-target');
		},
		disabled:function(){
			this.controls(function(){
				$(this).css('color','red');
			},'.em-target');
			
		}
	});
	var realNFFormController  = new NFFormController('.real-form-area',{
		normal:function(){
			this.disabled(false);
		},
		disabled:function(){
			this.disabled(true,'.disabled-target');
		}
	});
	
	window.lastForm = realNFFormController;
	
	$(".setdata-action-1").on('click',function(){
		var data = JSON.parse($(".data-example-1").text())
		plainNFFormController.setData(data);
		realNFFormController.setData(data);
	});
	$(".setdata-action-2").on('click',function(){
		var data = JSON.parse($(".data-example-2").text())
		plainNFFormController.setData(data);
		realNFFormController.setData(data);
	});
	$(".setdata-action-3").on('click',function(){
		var data = JSON.parse($(".data-example-3").text())
		plainNFFormController.setData(data);
		realNFFormController.setData(data);
	});
	
	$(".form-status-1").on('click',function(){
		plainNFFormController.statusTo('normal');
		realNFFormController.statusTo('normal');
	});
	$(".form-status-2").on('click',function(){
		plainNFFormController.statusTo('disabled');
		realNFFormController.statusTo('disabled');
	});
	
	$('.getdata-action').on('click',function(){
		$('.getdata-veriant').text( JSON.stringify( realNFFormController.getData() ) );
	});
	
});