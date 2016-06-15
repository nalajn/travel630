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

