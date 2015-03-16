FIND('pre>code',DATAEACH,function(node){
	$(node).text( $(node).text().trim() );
});

$('.run-modal').on('click',function(e){
	if(e.target == this) $(this).removeClass('run-modal-show');
})
.on('click','.run-modal-escape',function(e){
	$(e.delegateTarget).removeClass('run-modal-show');
});

$(document).on('keyup',function(e){
	if(e.keyCode == 27) {
		if($('.run-modal').hasClass('run-modal-show')){
			$('.run-modal-escape').trigger('click');
		}
	}
});

var runTabContentsActiveController = new NFActiveController('.run-content .tabs','li','click',function(e,i){
	if(i == 0) {
		$('.run-modal .code-set').removeClass('code-set-origin');
	} else {
		$('.run-modal .code-set').addClass('code-set-origin');
	}
});

$('.code-wrapper').on('click','a.live-run-action',function(e){
	
	$('.run-modal').addClass('run-modal-show');
	
	//
	var javascriptCode = $(e.delegateTarget).find('code.language-javascript').text();
	var htmlCode       = $(e.delegateTarget).find('code.language-markup').text();
	
	var viewDoc  = FINDDOCUMENT('.view-result');
	var htmlDoc  = FINDDOCUMENT('.html-result');
	var jsDoc    = FINDDOCUMENT('.javascript-result') ;
	var htmlCodeDoc = FINDDOCUMENT('.html-code') ;
	var jsCodeDoc   = FINDDOCUMENT('.javascript-code') ;
	//
	
	switch($(this).data('require')) {
		case 'javascript-to-html':
			//javascript run
			var runResult = viewDoc.runCode(javascriptCode);
			
			viewDoc.setHTML(runResult);
			jsDoc.setJSResult(runResult);
			htmlDoc.setHTMLResult(runResult);
			htmlCodeDoc.setHTMLResult(htmlCode);
			jsCodeDoc.setHTMLResult(javascriptCode,'javascript');
			break;
		case 'default': default :
			
			//html set
			viewDoc.setHTML(htmlCode);
			
			//javascript run
			var runResult = viewDoc.runCode(javascriptCode);
			htmlDoc.setHTMLResult(viewDoc.body.innerHTML);
			jsDoc.setJSResult(runResult);
			htmlCodeDoc.setHTMLResult(htmlCode);
			jsCodeDoc.setHTMLResult(javascriptCode,'javascript');
			
			break;
	}
	runTabContentsActiveController.shouldActive(0);
});

FIND('.code-section > article > header',DATAMAP,function(header){
	//with position hack
	var ankor = MAKE('a');
	ELBEFORE(header,ankor);
	
	return MAKE('li',MAKE('a',{
		href:'#'+ELUNIQUEID(ankor),
		html:header.innerHTML
	}));
	
},ELAPPENDTO,'.table-of-contents menu');

var DropdownInterface = function(opt){
	$(document).on('click',opt.wrapper + ' > ' + opt.toggler,function(e){
		var $dropdownParent  = $(this).parent();
		var $dropdownContent = $dropdownParent.children(opt.content);
		if($dropdownContent.length){
			if(opt.onlyToggle || $dropdownParent.is('.'+opt.name+'-only-toggle-button')) {
				if( !$dropdownContent.is('.show') ) {
					$dropdownContent.addClass('show');
					$dropdownParent.addClass(opt.name+'-open');
				} else {
					$dropdownContent.removeClass('show');
					$dropdownParent.removeClass(opt.name+'-open');
				}
			} else {
				if( !$dropdownContent.is('.show') ) {
					$dropdownParent.addClass(opt.name+'-open');
					$dropdownContent.addClass('show');
					$(document).one('click',function(e){ 
						$dropdownContent.removeClass('show'); 
						$dropdownParent.removeClass(opt.name+'-open');
					});
				}
			}
		}
	});
};

DropdownInterface({
	name   :'dropdown',
	wrapper:'.dropdown',
	toggler:'.dropdown-toggle',
	content:'.dropdown-content'
});