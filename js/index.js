(function(){
/*slider*/
$(".flexslider").flexslider({
	slideshowSpeed: 3000, //展示时间间隔ms
	animationSpeed: 400, //滚动时间ms
});

//返回顶部
$(window).scroll(function () {
	win_top = $(window).scrollTop();
	if(win_top >= 1800){
		$('.top').removeClass('hide');
	}else{
		$('.top').addClass('hide');
	}
})
$('.top').click(function(){
	$('body,html').animate({ scrollTop: 0 }, 200);
})

//二维码
$('.code').hover(function(){
	$('.show-code').removeClass('hide');
},function(){
	$('.show-code').addClass('hide');
})


//地址联响
  var setOffArea = {
    "message": "查询成功",
    "result": {
      "result": window.areaJson
    }
  }

  var availableTags = [];
  $.each(setOffArea.result.result, function(i, val) {
    availableTags.push(val.Name + ',' + val.Pinyin + ',' + val.lan + ',' + val.lon);
  });

  // 出发地
  var cache = {};
  $('#address').autocomplete({
    source: availableTags,
    minLength: 1,
    max: 5,
    formatItem: function(item) {
      return item;
    }
  })


})()