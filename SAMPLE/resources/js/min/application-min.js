var GNBNavigationController=new NavigationController("main",function(e,t){return e("#gnb menu","a","click",function(){return GNBNavigationController.active((this.textContent||this.innerText).toLowerCase())},2).makeAccessProperty(function(e,t){var n=(t.textContent||t.innerText).toLowerCase(),a=t.getAttribute("href");n&&a&&(e[n]=a)})}),gnb=GNBNavigationController,appearLoad=function(){var e=function(e,t){",-webkit-,-moz-,-ms-,-o-".replace(/[^\,]*\,/g,function(n){$(e).css(n.replace(",","")+"transform",t)})};window.css3Transform=e,FIND("#green-box",ELON,"click",function(){e(".gage-box-line-container",ZSTRING("rotate(\\(-80~20)deg)"))}),FIND("#yellow-box",ELON,"click",function(){e(".gage-box-line-container",ZSTRING("rotate(\\(-20~20)deg)"))}),FIND("#red-box",ELON,"click",function(){e(".gage-box-line-container",ZSTRING("rotate(\\(20~80)deg)"))})},appearOpen=function(){var e=function(e,t){",-webkit-,-moz-,-ms-,-o-".replace(/[^\,]*\,/g,function(n){$(e).css(n.replace(",","")+"transform",t)})};FIRE(FIND(".appear-ready"),function(e,t,n){var a=100*t;setTimeout(function(){$(e).addClass("appear-submit"),n()},a)},function(){setTimeout(function(){e(".gage-box-line-container",ZSTRING("rotate(\\(-60~60)deg)"))},500)})};GNBNavigationController.whenLoad("appear",function(){FIND(".code-block-1 code",ELVALUE,CODE(ZFIND(".read-block-1"))),CODEBLOCK(".code-block-1"),FIND(".code-block-2 code",ELVALUE,CODE(appearOpen,appearLoad)),CODEBLOCK(".code-block-2"),appearLoad()}),GNBNavigationController.whenActiveToggle("appear",function(){appearOpen()},function(){FIND(".appear-ready",DATAEACH,function(e,t){$(e).removeClass("appear-submit")}),window.css3Transform(".gage-box-line-container","rotate(-100deg)")}),GNBNavigationController.whenLoad("mvvm",function(){var e={list:[{title:"Section1",list:[{title:"Item1"},{title:"Item2"}]},{title:"Section2",list:[{title:"Item4"},{title:"Item5"}]},{title:"Section3",list:[{title:"Item7"},{title:"Item8"}]}]},t=$(MAKE("XMP")).appendTo("#init-data-view"),n=new DataContext(e,"list"),a=10,i=new ViewModel("template#mvvm-ul","template#mvvm-list","template#mvvm-td"),o=new Presenter("#listContainer",n.getRootManagedData(),i);o.dataDidChange=function(){var e=n.getJSONString().replace(/\:\[/,":[\n	").replace(/\}\]\}\,(\s|)/g,"}]},\n	").replace("]}]}","]}\n]}");t.text(e)},o.dataDidChange(),o.needDisplay()});var viewData=[{name:"Ghana","native":"Republic of Ghana",image:"resources/images/Ghana.png"},{name:"Gabon","native":"République Gabonaise",image:"resources/images/Gabon.png"},{name:"Guyana","native":"Co-operative Republic of Guyana",image:"resources/images/Guyana.png"},{name:"Gambia","native":"Republic of The Gambia",image:"resources/images/Gambia.png"},{name:"Guatemala","native":"República de Guatemala",image:"resources/images/Guatemala.png"},{name:"Greece","native":"Ελληνική Δημοκρατία",image:"resources/images/Greece.png"}],viewDataContext=new DataContext(viewData);window.viewDataContext=viewDataContext;var viewModels={small:new ViewModel(function(){return this.placeholder("ul")},function(){return MAKE("li.inline-box.small-box.text-center",MAKE("img",{src:this.value("image")}))}),large:new ViewModel(function(){return this.placeholder("ul")},function(){return MAKE("li.inline-box.text-center",MAKE("img",{src:this.value("image")}),this.bind("native","p"))}),list:new ViewModel(function(){return MAKE("table.table",MAKE("thead",MAKE("tr",MAKE("th::name"),MAKE("th::native"),MAKE("th::image"))),this.placeholder("tbody"))},function(){return MAKE("tr",MAKE("td",this.bind("name","input.full-width")),MAKE("td",this.bind("native","input.full-width")),MAKE("td",this.bind("image","p")))})};GNBNavigationController.whenLoad("viewmodel",function(){var e=new Presenter("#view-display",viewDataContext),t=new Contexts("#view-type","button");t.onSelects("click",function(){var t=$(this).addClass("active").attr("viewmodel");t in viewModels&&e.needDisplayWithViewModel(viewModels[t])},function(){$(this).removeClass("active")}),$("#view-type button").eq(1).trigger("click"),$("#view-data-2").click(function(){$("#viewmodel-modal").find("#viewmodel-modal-data").text(viewDataContext.getJSONString()),$("#viewmodel-modal").modal()})}),GNBNavigationController.whenLoad("selectbind",function(){var e=new ViewModel(function(){return this.placeholder("div.menu.list-group")},function(){return MAKE("a.list-group-item",MAKE("h4.list-group-item-heading",MAKE("img",{src:this.value("image")}),MAKE("span",{html:"&nbsp;"}),this.bind("name","span")),this.bind("native","p.list-group-item-text"))});e.whenSelectToggle(function(e){$(e).addClass("active")},function(e){$(e).removeClass("active")});var t=new ViewModel(function(){return MAKE("div",MAKE("h5::Name"),this.bind("name"),MAKE("h5::Native"),this.bind("native"),MAKE("h5::Image"),this.bind("image","p"))}),n=new Presenter("#bind-item-display",void 0,t),a=new Presenter("#bind-display",viewDataContext,e,function(){var e=this.needActiveController("/*",function(e,t){n.needDisplayWithData(t)},!1,!0);return e.whenActiveStart(function(){$(".side-bar-container").addClass("side-bar-active")}),e.whenActiveEnd(function(){$(".side-bar-container").removeClass("side-bar-active")}),$("#bind-close-button").on("click",function(){e.inactiveAll()}),!0})}),GNBNavigationController.whenLoad("multiselect",function(){var e=new ViewModel(function(){return this.placeholder("div.row-fluid")},function(){return MAKE("div.col-sm-6",MAKE("div.thumbnail",MAKE("img",{src:this.value("image")}),MAKE("div.caption",this.bind("name","h3"),this.bind("native","p"))))}),t=new Presenter("#multiselect-display",viewDataContext,e,function(){var e=this.needActiveController("/*",null,!0,!0);return e.whenActiveStart(function(){$(".side-bar-container").addClass("side-bar-active")}),e.whenActiveEnd(function(){$(".side-bar-container").removeClass("side-bar-active")}),$("#replaceData-submit").click(function(){var n=new Model("#replaceData").removeNothing();n.count()&&DATAEACH(DATAMAP(e.getActiveSelects(),function(e){return t.getManagedDataWithNode(e)}),function(t){n.each(function(e,n){t.value(n,e)}),_Form("#replaceData").empty(),e.inactiveAll()})}),!0})}),GNBNavigationController.whenLoad("scroll",function(){var e=new ScrollBox("#scroll-box"),t=new ScrollBox("#calendar-box"),n=$("#calendar-box-count"),a=new MixedMoment("ko");$(document).on("click",".zoomp",function(){LG("click zoom plus"),e.needZoomWithOffset(.2)}),$(document).on("click",".zoomm",function(){LG("click zoom minus"),e.needZoomWithOffset(-.2)}),t.drawAxisYItem(function(e){setTimeout(function(){n.text("generated to down : ["+t.axisYPositiveItems.length+"] generated to up : ["+t.axisYNegativeItems.length+"]")},1);var i=a.clone().setCommand("add",e,"month");return MAKE("div.calendar",MAKE("h1::"+i.format("YYYY년 MM월")),MAKE("table.calendar",MAKE("thead",i.drawCalendarHeaderRow(function(e){var t=$(e);return t.text(t.text().substr(0,1))[0]})),MAKE("tbody",i.drawCalendarBodyRows())))}),t.setAllowMakeAxisYItem(200,200)});var somenode=MAKE("div#one.two.three",MAKE("ul.list",MAKE("li.item"),MAKE("li.item"),MAKE("li.item"))),testset=[function(){IMPORTNODE(document.querySelectorAll("template#test")[0])},function(){IMPORTNODE($("template#test")[0])},function(){$("<div id='one' class='two three' />").append($("<ul class='list' />").append($("<li class='item'/>").data("alias","item"),$("<li class='item'/>").data("alias","item"),$("<li class='item'/>").data("alias","item")))},function(){MAKE("div#one.two.three",MAKE("ul.list",MAKE("li.item",{dataset:{alias:"item"}}),MAKE("li.item",{dataset:{alias:"item"}}),MAKE("li.item",{dataset:{alias:"item"}})))},function(){CLONENODES(somenode)[0]},function(){IMPORTNODE(MAKETEMP(TAG("div#one.two.three",TAG("ul.list",TAG("li.item"),TAG("li.item"),TAG("li.item")))))},function(){IMPORTNODE(ZFIND("template#test"))},function(){_Template("template#test").get()}];GNBNavigationController.whenLoad("speedtest",function(){setTimeout(function(){TIMES(testset.length,function(e){FIND(".code-block-"+e+" code",ELVALUE,CODE(testset[e])),CODEBLOCK(".code-block-"+e)}),FIND(".code-block-template code",ELVALUE,CODE("template#test")),CODEBLOCK(ZFIND(".code-block-template")),ELON("#teststart","click",function(){DATAEACH(testset,function(e,t){MARK("test"+t),TIMES(2e3,function(){e()}),FIND(".test-"+t+" .text-danger",ELVALUE,MARK("test"+t))})})},500)});var testset2=[function(){var e=[];DATAEACH([1,2,3,4],function(t){e.push(t+1)})},function(){var e=DATAMAP([1,2,3,4],function(e){return e+1})},function(){$.map([1,2,3,4],function(e){return e+1})},function(){for(var e=[1,2,3,4],t=[],n=0,a=e.length;a>n;n++)t.push(e[n]+1)}];GNBNavigationController.whenLoad("speedtest2",function(){setTimeout(function(){TIMES(testset2.length,function(e){FIND(".code-block-"+e+" code",ELVALUE,CODE(testset2[e])),CODEBLOCK(".code-block-"+e)}),FIND(".code-block-template code",ELVALUE,CODE("template#test")),CODEBLOCK(ZFIND(".code-block-template")),ELON("#teststart","click",function(){DATAEACH(testset2,function(e,t){MARK("test"+t),TIMES(8e3,function(){e()}),FIND(".test-"+t+" .text-danger",ELVALUE,MARK("test"+t))})})},500)}),GNBNavigationController.whenLoad("canvas2d",function(){var e=$("#canvas-area",this),t=$("#canvas-background td",this);_Context2D(100).drawCrossLine(2,0,0,0).needDraw().appendTo(e),_Context2D(100).drawCrossLine(2,2,0,0).needDraw().appendTo(e),_Context2D(100).drawCrossLine(4,4,4,0).needDraw().appendTo(e),_Context2D(100).drawCrossLine(6,6,6,6).needDraw().appendTo(e),_Context2D(t.eq(0)).drawCrossLine(4,4,4,5).needDraw().backgroundToResponder(),_Context2D(t.eq(1)).drawCrossLine(0,4,0,4,"#5c5").needDraw().backgroundToResponder(),_Context2D(t.eq(2)).drawCrossLine(0,0,4,4).needDraw().backgroundToResponder(),_Context2D(t.eq(3)).drawCrossLine(4,4,0,0,"#cc5").needDraw().backgroundToResponder(),_Context2D(t.eq(4)).drawCrossLine(0,4,4,4).needDraw().backgroundToResponder(),_Context2D(t.eq(5)).drawCrossLine(4,0,0,4).needDraw().backgroundToResponder()}),GNBNavigationController.whenLoad("formcontroller",function(){var e=new FormController(".plain-form-area",null,{normal:function(){this.controls(function(){$(this).css("color","inherit")},".em-target")},disabled:function(){this.controls(function(){$(this).css("color","red")},".em-target")}}),t=new FormController(".real-form-area",null,{normal:function(){this.disabled(!1)},disabled:function(){this.disabled(!0,".disabled-target")}});window.lastForm=t,$(".setdata-action-1").on("click",function(){var n=JSON.parse($(".data-example-1").text());e.setData(n),t.setData(n)}),$(".setdata-action-2").on("click",function(){var n=JSON.parse($(".data-example-2").text());e.setData(n),t.setData(n)}),$(".setdata-action-3").on("click",function(){var n=JSON.parse($(".data-example-3").text());e.setData(n),t.setData(n)}),$(".form-status-1").on("click",function(){e.status("normal"),t.status("normal")}),$(".form-status-2").on("click",function(){e.status("disabled"),t.status("disabled")}),$(".getdata-action").on("click",function(){$(".getdata-veriant").text(JSON.stringify(t.getData()))})});