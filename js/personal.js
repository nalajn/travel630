

//切换tab
$('.tabs-tit').on('click','li',function(){
	var index = $(this).index();
	$('.tabs-con').addClass('hide');
	$('.tabs-con').eq(index).removeClass('hide');
})