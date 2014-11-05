var menuContext = new Contexts("#header menu","a");

var loader = new Loader("#main-container",{
	"appear":"subview/appear.html",
	"mvvm":"subview/mvvm.html",
	"bind":"subview/bind.html",
	"viewmodel":"subview/viewmodel.html",
	"multiselect":"subview/multiselect.html"
});

menuContext.onSelects("click",function(){
	var pagename = ELATTR(this,"loadpage");
	if(pagename) loader.open(pagename);
});
loader.setSwitchEvent("appear",function(){
	FIND(".appear-ready",DATAEACH,function(node,i){
		
		var timeout = 100*i;
		
		setTimeout(function(){
			$(node).addClass("appear-submit");
		},timeout);
		
	});
},function(){
	FIND(".appear-ready",DATAEACH,function(node,i){
		$(node).removeClass("appear-submit");
	});
});
loader.setLoadEvent("mvvm",function(){
    var data = {"list":[
    	{title:"카드이름1",description:"첫번째 카드입니다",list:[{title:"별명1"},{title:"별명2"},{title:"별명3"}]},
  		{title:"카드이름2",description:"두번째 카드입니다",list:[{title:"별명4"},{title:"별명5"},{title:"별명6"}]},
		{title:"카드이름3",description:"세번째 카드입니다",list:[{title:"별명7"},{title:"별명9"},{title:"별명10"}]}
    ]};
	
	var mvvmXMP =  $(MAKE("XMP")).appendTo("#init-data-view");
	
	
	//데이터를 불러거나 다시 출력하는 역활
    var dataContext = new DataContext(data,"list");
	window.dat = dataContext;
	//뷰를 그리는 방법을 정의
    var viewModel = new ViewModel(
  	  function(){
  		  return MAKE("div.inline-box.blue",
  			this.bind("title","input.full-width"),
			this.action("delete",MAKE("button",MAKE("span.glyphicon.glyphicon-trash")))
		 );
  	  },
  	  function(){
  		  return MAKE("li",
  		  	MAKE("table",
  				MAKE("tbody",
  					MAKE("tr",
  						MAKE("td.in-set-sm",
  							MAKE("div.inline-box.green",
								MAKE("div",this.bind("title","input.full-width")),
								MAKE("div",this.bind("description","input.full-width")),
  	  						  	MAKE("label",this.action("up",MAKE("button",MAKE("span.glyphicon.glyphicon-arrow-up")))),
  	  						  	MAKE("label",this.action("down",MAKE("button",MAKE("span.glyphicon.glyphicon-arrow-down")))),
  	  						  	MAKE("label",this.action("append",MAKE("button",MAKE("span.glyphicon.glyphicon-plus")),{title:"새로운 별명"}))
  						  )
  						),
						this.container("td")
  					)
  				)
  	  		)
  	  	  );
  	  },
  	  function(){
  		  return this.container("ul.menu")
  	  }
    );
	//뷰를 그리고 이벤트를 등록함
    var listViewController = new DataContextViewController("#listContainer",dataContext.getRootManagedData(),viewModel);
	listViewController.dataDidChange = function(){
		var xmpText = dataContext.getJSONString().replace(/\:\[/,":[\n\t").replace(/\}\]\}\,(\s|)/g,"}]},\n\t").replace("]}]}","]}\n]}");
		mvvmXMP.text(xmpText);
	}
	listViewController.dataDidChange();
    listViewController.needDisplay();
});

// common data
var viewData = [
	{korean:"가나 공화국",language:"Ghana – Republic of Ghana",image:"resources/images/Ghana.png"},
	{korean:"가봉 공화국",language:"Gabon – République Gabonaise",image:"resources/images/Gabon.png"},
	{korean:"가이아나 공동 공화국",language:"Guyana – Co-operative Republic of Guyana",image:"resources/images/Guyana.png"},
	{korean:"감비아 공화국",language:"Gambia – Republic of The Gambia",image:"resources/images/Gambia.png"},
	{korean:"과테말라 공화국",language:"Guatemala – República de Guatemala",image:"resources/images/Guatemala.png"},
	{korean:"그리스 공화국",language:"Ελλάδα – Ελληνική Δημοκρατία",image:"resources/images/Greece.png"}
];
var viewDataContext = new DataContext(viewData);

var viewModels = {
	"small":new ViewModel(function(){
		return MAKE("li.inline-box.small-box.text-center",
			MAKE("img",{src:this.data("image")})
		);
	},function(){
		return this.container("ul");
	}),
	"large":new ViewModel(function(){
		return MAKE("li.inline-box.text-center",
			MAKE("img",{src:this.data("image")}),
			this.bind("language","p")
		);
		
		
	},function(){
		return this.container("ul");
	}),
	"list":new ViewModel(function(){
		return MAKE("tr",
			MAKE("td",this.bind("korean","input.full-width")),
			MAKE("td",this.bind("language","input.full-width")),
			MAKE("td",this.bind("image","p"))
		)
	},function(){
		return MAKE("table.table",
			MAKE("thead",
				MAKE("tr",
					MAKE("th::korean"),
					MAKE("th::language"),
					MAKE("th::image")
				)
			),
			this.container("tbody")
		);
	})
}

loader.setLoadEvent("viewmodel",function(){	
	window.dat = viewDataContext;
	
	var viewController = new DataContextViewController("#view-display",viewDataContext);
	
	var viewType = new Contexts("#view-type","button");
	
	viewType.onSelects("click",function(){
		
		var viewModelName = $(this).addClass("active").attr("viewmodel");
		if(viewModelName in viewModels) viewController.needDisplayWithViewModel(viewModels[viewModelName]);
		
	},function(){
		$(this).removeClass("active");
	});
	
	$("#view-type button").eq(1).trigger("click");
	
	$("#view-data-2").click(function(){
		$("#viewmodel-modal").find("#viewmodel-modal-data").text(viewDataContext.getJSONString());
		$("#viewmodel-modal").modal();
	});
	
});

loader.setLoadEvent("multiselect",function(){
	var viewController = new DataContextViewController("#multiselect-display",viewDataContext,viewModels["large"]);
	viewController.needSelectable(true);
	viewController.needDisplay();
	
	viewController.selectItemDidChange = function(items){
		if(items.length > 0){
			$(".side-bar-container").addClass("side-bar-active");
		} else {
			$(".side-bar-container").removeClass("side-bar-active");
		}
	};
	
	$("#replaceData-submit").click(function(){
		var model = new Model("#replaceData").removeNothing();
		
		if(model.count()){
			var managedItems = viewController.getSelectableManagedItem();
			managedItems.each(function(managedItem){
				model.each(function(value,key){
					managedItem.data(key,value);
				});
				
				_Form("#replaceData").empty();
				viewController.deselectAll();
			});
			
		}
		
	});
});
loader.setOpenEvent("multiselect",function(){
	//viewController.needDisplay();
});