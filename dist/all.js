


/*slider*/
$(".flexslider").flexslider();

$('.top').click(function(){
	$('body,html').animate({ scrollTop: 0 }, 200);
})

$('.code').hover(function(){
	$('.show-code').removeClass('hide');
},function(){
	$('.show-code').addClass('hide');
})






  	//标签选择
  	var tag_txt;
  	$('.tags-search').on('click','li',function(){
  		if(!$(this).hasClass('active')){
  			tag_txt = $(this).text();
  			console.log(tag_txt)
  		}
  	})
