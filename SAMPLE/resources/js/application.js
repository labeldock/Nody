var menuContext = new Contexts("#header menu","a");

var loader = new Loader("#main-container",{
	"appear":"subview/appear.html",
	"mvvm":"subview/mvvm.html",
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
    var data = {"root":"hello","list":[
    	{title:"카드이름1",description:"첫번째 카드입니다",list:[{title:"별명1"},{title:"별명2"},{title:"별명3"}]},
  		{title:"카드이름2",description:"두번째 카드입니다",list:[{title:"별명4"},{title:"별명5"},{title:"별명6"}]},
		{title:"카드이름3",description:"세번째 카드입니다",list:[{title:"별명7"},{title:"별명9"},{title:"별명10"}]}
    ]};
	
	//데이터를 불러거나 다시 출력하는 역활
    var dataContext = new DataContext(data,"list");
	window.dat = dataContext;
	//뷰를 그리는 방법을 정의
    var viewModel = new ViewModel(
  	  function(){
  		  return MAKE("div.inline-box",
  			this.bind("title","input"),
			this.action("delete","button::delete")
		 );
  	  },
  	  function(){
  		  return MAKE("li",
  		  	MAKE("table",
  				MAKE("tbody",
  					MAKE("tr",
  						MAKE("td",
  							MAKE("div.inline-box",
  	  						  MAKE("p",
							  	this.bind("title","p")),
  	  						  	this.action("up","button::up"),
  	  						  	this.action("down","button::down"),
  	  						  	this.action("append","button::append",{title:"별명99"})
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
    listViewController.needDisplay();
	
	$("#view-data-1").click(function(){
		$("#mvvm-modal").find("#mvvm-modal-data").text(dataContext.getJSONString());
		$("#mvvm-modal").modal();
	});
	
});

// common data
var viewData = [
	{title:"가나",fulltitle:"가나 공화국",english:"Ghana – Republic of Ghana"},
	{title:"가봉",fulltitle:"가봉 공화국",english:"Gabon – République Gabonaise"},
	{title:"가이아나",fulltitle:"가이아나 공동 공화국",english:"Guyana – Co-operative Republic of Guyana"},
	{title:"감비아",fulltitle:"감비아 공화국",english:"Gambia – Republic of The Gambia"},
	{title:"과테말라",fulltitle:"과테말라 공화국",english:"Guatemala – República de Guatemala"},
	{title:"그리스",fulltitle:"그리스 공화국",english:"Ελλάδα – Ελληνική Δημοκρατία"}
];
var viewDataContext = new DataContext(viewData);

var viewModels = {
	"small":new ViewModel(),
	"large":new ViewModel(function(){
		return this.bind("fulltitle","li.inline-box");
	},function(){
		return this.container("ul");
	}),
	"list":new ViewModel(function(){
		return MAKE("tr",
			MAKE("td",this.bind("title","input.full-width")),
			MAKE("td",this.bind("fulltitle","input.full-width")),
			MAKE("td",this.bind("english","input.full-width"))
		)
	},function(){
		return MAKE("table.table",
			MAKE("thead",
				MAKE("tr",
					MAKE("th::title"),
					MAKE("th::full"),
					MAKE("th::english")
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