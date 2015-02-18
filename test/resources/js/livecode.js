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
	
	var viewDoc  = IFRAMEDOCUMENT('.view-result');
	var htmlDoc  = IFRAMEDOCUMENT('.html-result');
	var jsDoc    = IFRAMEDOCUMENT('.javascript-result') ;
	var htmlCodeDoc = IFRAMEDOCUMENT('.html-code') ;
	var jsCodeDoc   = IFRAMEDOCUMENT('.javascript-code') ;
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

var d = FIND('.code-section > article > header',DATAMAP,function(header){
	//with position hack
	var ankor = MAKE('a');
	ELBEFORE(header,ankor);
	
	return MAKE('li',MAKE('a',{
		href:'#'+ELUNIQUEID(ankor),
		html:header.innerHTML
	}));
	
},ELAPPENDTO,'.table-of-contents menu');
