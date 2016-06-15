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

