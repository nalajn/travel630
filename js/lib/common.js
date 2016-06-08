
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
    $(this).remove()
  })

