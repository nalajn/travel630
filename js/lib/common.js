(function(){
  /*head 消息*/
  $('.login-register').hover(function(){
    $('.msg-con').removeClass('hide');
  },function(){
    $('.msg-con').addClass('hide');
  })


  /*玩转周边*/
  $('.tabs-tit .active').prev()
    .find('p').css({'width':'100%','margin':'0'})
    .find('.big').css({'margin':'30px 0 0 25px'});
  $('.tabs-tit li').click(function(){
    $('.tabs-tit li').removeClass('active');
    $(this).addClass('active');

    $('.tabs-tit .active').prev()
    .find('p').css({'width':'100%','margin':'0'})
    .find('.big').css({'margin':'30px 0 0 25px'});

    var longitude = $('.choice-address').attr('data-longitude'),//经度
        latitude = $('.choice-address').attr('data-latitude'),//纬度
        behavior = $('.tabs-tit li.active .big').text(),//行为
        result_lon = longitude.substr(0,longitude.indexOf('.'))+longitude.substr(longitude.indexOf('.'),7)*1000000,
        result_lat = latitude.substr(0,latitude.indexOf('.'))+latitude.substr(latitude.indexOf('.'),7)*1000000;

      switch (behavior){ 
        case "玩" : behavior = "06"; break; 
        case "吃" : behavior = "02"; break; 
        case "住" : behavior = "03"; break; 
        case "购" : behavior = "04"; break;
        default : behavior = "06"; break; 
      } 


    console.log(result_lon,result_lat,behavior)

  });
  
  


  //标签选择
  var tag_txt;
  $('.tags-search').on('click','li',function(){
    var selected_tags = '';
    //触发改变样式
    $(this).addClass('active').siblings().removeClass('active');

    $('.tags-search .selected .tags-con').empty();
    $('.tags-search .tags-list li.active').each(function(){
      if(!$(this).hasClass('unlimited')){
        selected_tags += '<li>'+$(this).text()+'</li>';
      }
    })
    $('.tags-search .selected .tags-con').append(selected_tags);
  })

  //删除标签
  $('.tags-search .selected .tags-con').on('click','li',function(){
    $(this).remove();
    var remove_item = $(this).text();
    $('.tag-box li.active').each(function(){
      if($(this).text() == remove_item){
        $(this).removeClass('active')
          .parent().find('.unlimited').addClass('active');
      }
    })
  })

})(jQuery)

