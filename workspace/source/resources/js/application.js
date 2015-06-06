//
console.log(window.nody);

var GNBNFContentLoader = new nd.ContentLoader("main",function(){	
	//active event controller
	return this.needActiveController("#gnb menu","a","click",function(){
		//willActive evnet
		return GNBNFContentLoader.active((this.textContent || this.innerText).toLowerCase());
	},1).injectSelects(function(accessData,node){
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
	nd.find("#green-box",nd.$on,"click",function(){
		css3Transform(".gage-box-line-container",ZSTRING("rotate(\\(-80~20)deg)"));
	});
	nd.find("#yellow-box",nd.$on,"click",function(){
		css3Transform(".gage-box-line-container",ZSTRING("rotate(\\(-20~20)deg)"));
	});
	nd.find("#red-box",nd.$on,"click",function(){
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
	FIRE(nd.find(".appear-ready"),
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
	appearLoad();
});
GNBNFContentLoader.whenActiveToggle("appear",function(){	
	appearOpen();
},function(){
	nd.find(".appear-ready",nd.dataEach,function(node,i){
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
	
	var mvvmXMP =  $(nd.make("XMP")).appendTo("#init-data-view");
	
	//데이터를 불러거나 다시 출력하는 역활
    var dataContext = new nd.DataContext(data,"list");
	
	//뷰를 그리는 방법을 정의
	var itemIndex = 10;
	var viewModel = new nd.ViewModel("template#mvvm-ul","template#mvvm-list","template#mvvm-td");
	//뷰를 그리고 이벤트를 등록함
    var listViewController = new nd.Presentor("#listContainer",dataContext.getRootManagedData(),viewModel);
	listViewController.dataDidChange = function(){
		var xmpText = dataContext.JSONString().replace(/\:\[/,":[\n\t").replace(/\}\]\}\,(\s|)/g,"}]},\n\t").replace("]}]}","]}\n]}");
		mvvmXMP.text(xmpText);
	}
	listViewController.dataDidChange();
    listViewController.needDisplay();
});

// common data
var viewData = [
	{name:"Ghana"    ,native:"Republic of Ghana"              ,image:"resources/images/Ghana.png"},
	{name:"Gabon"    ,native:"République Gabonaise"           ,image:"resources/images/Gabon.png"},
	{name:"Guyana"   ,native:"Co-operative Republic of Guyana",image:"resources/images/Guyana.png"},
	{name:"Gambia"   ,native:"Republic of The Gambia"         ,image:"resources/images/Gambia.png"},
	{name:"Guatemala",native:"República de Guatemala"         ,image:"resources/images/Guatemala.png"},
	{name:"Greece"   ,native:"Ελληνική Δημοκρατία"            ,image:"resources/images/Greece.png"}
];

var viewNFDataContext = new nd.DataContext(viewData);
window.viewNFDataContext = viewNFDataContext;

var viewModels = {
	"small":new nd.ViewModel(function(){
		return this.placeholder("ul");
	},function(){
		return nd.make("li.inline-box.small-box.text-center",
			nd.make("img",{src:this.value("image")})
		);
	}),
	"large":new nd.ViewModel(function(){
		return this.placeholder("ul");
	},function(){
		return nd.make("li.inline-box.text-center",
			nd.make("img",{src:this.value("image")}),
			this.bind("native","p")
		);
	}),
	"list":new nd.ViewModel(function(){
		return nd.make("table.table",
			nd.make("thead",
				nd.make("tr",
					nd.make("th::name"),
					nd.make("th::native"),
					nd.make("th::image")
				)
			),
			this.placeholder("tbody")
		);
	},function(){
		
		return nd.make("tr",
			nd.make("td",this.bind("name","input.full-width")),
			nd.make("td",this.bind("native","input.full-width")),
			nd.make("td",this.bind("image","p"))
		)	
	})
}

GNBNFContentLoader.whenLoad("viewmodel",function(){	

	var viewController = new nd.Presentor("#view-display",viewNFDataContext);
	
	var viewType = new nd.Contexts("#view-type","button");
	
	viewType.onSelects("click",function(){
		
		var viewModelName = $(this).addClass("active").attr("viewmodel");
		if(viewModelName in viewModels) viewController.needDisplayWithViewModel(viewModels[viewModelName]);
		
	},function(){
		$(this).removeClass("active");
	});
	
	$("#view-type button").eq(1).trigger("click");
	
	$("#view-data-2").click(function(){
		$("#viewmodel-modal").find("#viewmodel-modal-data").text(viewNFDataContext.JSONString());
		$("#viewmodel-modal").modal();
	});
	
});
GNBNFContentLoader.whenLoad("selectbind",function(){
	// view model
	var listNFViewModel = new nd.ViewModel(
	function(){
		return this.placeholder("div.menu.list-group");
	},function(){
		return nd.make("a.list-group-item",
			nd.make("h4.list-group-item-heading",nd.make("img",{src:this.value("image")}),nd.make("span",{html:"&nbsp;"}),this.bind("name","span")),
			this.bind("native","p.list-group-item-text")
		);
	});
	
	var itemNFViewModel = new nd.ViewModel(function(){
		return nd.make("div",
			nd.make("h5::Name"),
			this.bind("name"),
			nd.make("h5::Native"),
			this.bind("native"),
			nd.make("h5::Image"),
			this.bind("image","p")
		);
	});
	var itemController = new nd.Presentor("#bind-item-display",undefined,itemNFViewModel);
	
	// list view
	var viewController = new nd.Presentor("#bind-display",viewNFDataContext,listNFViewModel,function(){
		
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
	var multiNFViewModel = new nd.ViewModel(function(){
		return this.placeholder("div.row-fluid");
	},function(){
		return nd.make("div.col-sm-6",
			nd.make("div.thumbnail",
				nd.make("img",{src:this.value("image")}),
				nd.make("div.caption",
					this.bind("name","h3"),
					this.bind("native","p")
				)
			)
		);
	});
	var viewController = new nd.Presentor("#multiselect-display",viewNFDataContext,multiNFViewModel,function(){
		var activeController = this.needActiveController('/*',null,true,true);
		activeController.whenActiveStart(function(){
			$(".side-bar-container").addClass("side-bar-active");
		});
		activeController.whenActiveEnd(function(){
			$(".side-bar-container").removeClass("side-bar-active");
		});
		
		$("#replaceData-submit").click(function(){
			var model = new nd.Model("#replaceData").removeNothing();
		
			if(model.count()){
				nd.dataEach(nd.dataMap(activeController.getActiveSelects(),function(node){
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
	var scrollBox    = new nd.ScrollBox("#scroll-box");
	var calendarBox  = new nd.ScrollBox("#calendar-box");
	var countDisplay = $("#calendar-box-count");
	var nowMoment    = new nd.MixedMoment("ko");
	
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
		
		return nd.make("div.calendar",
			nd.make("h1::"+drawMoment.format("YYYY년 MM월")),
			nd.make("table.calendar",
				nd.make("thead",drawMoment.drawCalendarHeaderRow(function(node){ 
					var $node = $(node);
					return $node.text( $node.text().substr(0,1) )[0];
				})),
				nd.make("tbody",drawMoment.drawCalendarBodyRows())
			)
		);
	});
	calendarBox.setAllowMakeAxisYItem(200,200);
});

var somenode = nd.make("div#one.two.three",nd.make("ul.list",nd.make("li.item"),nd.make("li.item"),nd.make("li.item")));
var testset = [
function(){
nd.importNodes( document.querySelectorAll("template#test")[0] );
},
function(){
nd.importNodes( $("template#test")[0] );
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
nd.make("div#one.two.three",
	nd.make("ul.list",
		nd.make("li.item",{"dataset":{"alias":"item"}}),
		nd.make("li.item",{"dataset":{"alias":"item"}}),
		nd.make("li.item",{"dataset":{"alias":"item"}})
	)
);
},
function(){
nd.cloneNodes(somenode)[0];
},
function(){
var data = [
	{'class':'item','data-alias':'item'},
	{'class':'item','data-alias':'item'},
	{'class':'item','data-alias':'item'}
];
new nd.Template(
	"<div id='one' class='two three' node-put='items'></div>",
	{items:data},
	{items:function(data){ return nd.dataMap(data,function(itemData){ return nd.make('li',itemData); }); }}
	,true
)
},
function(){
nd.importNodes( nd.find("template#test",0) );
},
function(){
nd.makes("div#one.two.three>ul.list>li.item[data-alias=item]*3")
}
]
GNBNFContentLoader.whenLoad("speedtest",function(){
	nd.times(testset.length,function(i){
		nd.find(".code-block-"+ i +" code",nd.$value,testset[i]);
	});

	nd.$on("#teststart","click",function(){
		nd.dataEach(testset,function(method,i){
			MARK("test"+i);
			nd.times(2000,function(){
				method();
			});
			nd.find(".test-"+i+" .text-danger",nd.$value,MARK("test"+i));
		});
	});
});

var testset2 = [
function(){
	var p = [];
	nd.dataEach([1,2,3,4],function(v){
		p.push(v+1);
	});
},
function(){
	var p = nd.dataMap([1,2,3,4],function(v){
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
	nd.times(testset2.length,function(i){
		nd.find(".code-block-"+ i +" code",nd.$value,testset2[i]);
	});
	nd.$on("#teststart","click",function(){
		nd.dataEach(testset2,function(method,i){
			MARK("test"+i);
			nd.times(8000,function(){
				method();
			});
			nd.find(".test-"+i+" .text-danger",nd.$value,MARK("test"+i));
		});
	});
});

GNBNFContentLoader.whenLoad('formcontroller',function(){
	var plainNFFormController = new nd.FormController('.plain-form-area',null,{
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
	var realNFFormController  = new nd.FormController('.real-form-area',{
		normal:function(){
			this.FormControl.disabled(false);
		},
		disabled:function(){
			this.FormControl.disabled(true,'.disabled-target');
		}
	});
	
	window.lastForm = realNFFormController;
	
	$(".setdata-action-1").on('click',function(){
		var data = JSON.parse($(".data-example-1").text())
		plainNFFormController.setFormData(data);
		realNFFormController.setFormData(data);
	});
	$(".setdata-action-2").on('click',function(){
		var data = JSON.parse($(".data-example-2").text())
		plainNFFormController.setFormData(data);
		realNFFormController.setFormData(data);
	});
	$(".setdata-action-3").on('click',function(){
		var data = JSON.parse($(".data-example-3").text())
		plainNFFormController.setFormData(data);
		realNFFormController.setFormData(data);
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
		$('.getdata-veriant').text( JSON.stringify( realNFFormController.getFormData() ) );
	});
	
});