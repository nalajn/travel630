
  $(".flexslider").flexslider();


  	//标签选择
  	var tag_txt;
  	$('.tags-search').on('click','li',function(){
  		if(!$(this).hasClass('active')){
  			tag_txt = $(this).text();
  			console.log(tag_txt)
  		}
  	})
