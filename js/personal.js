

//切换tab
$('.tabs-tit').on('click','li',function(){
	var index = $(this).index();
	$('.tabs-tit li').removeClass('active');
	$(this).addClass('active')
	$('.tabs-con').addClass('hide');
	$('.tabs-con').eq(index).removeClass('hide');
})

$('.con-tit').on('click','li',function(){
	$('.con-tit li').removeClass('active')
	$(this).addClass('active');
})