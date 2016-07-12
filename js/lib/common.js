(function(){
  /*head 消息*/
  $('.login-register').hover(function(){
    $('.msg-con').removeClass('hide');
  },function(){
    $('.msg-con').addClass('hide');
  })


  //控制图片显示大小
  $('.list .list-item,.grid-box .grid-item').each(function(){
    var width = $(this).find('img').width(),
        height = $(this).find('img').height(),
        left = -(width/2-158/2),
        top = -(height/2-120/2);
    /*中线外扩*/
    // $(this).find('dt img').css('marginLeft',left);
    // $(this).find('dt img').css('marginTop',top);
    
    /*横图height100%,纵图width100%*/
    if(width / height > 1){
      $(this).find('dt img').css('height','100%');
    }else{
      $(this).find('dt img').css('width','100%');
    }

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
  
  /*最热、最新*/
  $('.best-box .title,.best-new .title').on('click','.item',function(){
    $(this).addClass('active').siblings().removeClass('active');
  })
  $('.best-new-btns').on('click','li',function(){
    $(this).addClass('active').siblings().removeClass('active');
  })


  /*标签选择*/

  //当有lable参数时 显示已选标签，参数带过来的标签默认选中
  var selected_id = $('.tags-search .selected li').attr('id');
  $('.tags-list:not(".selected") li:not(".unlimited")').each(function(){
    if($(this).attr('id') == selected_id){
      $('.tags-search .selected').removeClass('hide');
      $(this).addClass('active').siblings().removeClass('active');
    }
  })

  //选择标签
  var tag_txt;
  $('.tags-search').on('click','li',function(){
    var selected_tags = '';
    $('.tags-search .selected').removeClass('hide');
    //触发改变样式
    $(this).addClass('active').siblings().removeClass('active');

    $('.tags-search .selected .tags-con').empty();
    $('.tags-search .tags-list li.active').each(function(){
      if(!$(this).hasClass('unlimited')){
        selected_tags += '<li>'+$(this).text()+'</li>';
      }
    })
    $('.tags-search .selected .tags-con').append(selected_tags);

    //当没有筛选条件的标签时，隐藏已选条件栏
    if($('.tags-search .selected .tags-con li').length == 0){
      $('.tags-search .selected').addClass('hide');
    }
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

    //当没有筛选条件的标签时，隐藏已选条件栏
    if($('.tags-search .selected .tags-con li').length == 0){
      $('.tags-search .selected').addClass('hide');
    }
  })

  

  function getUrlParam(name, url) {
    var search = url || document.location.search;
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = search.substr(1).match(reg);  //匹配目标参数
    if (r!=null) {
        return unescape(r[2]);
    }
    else{
        return null;
    }
  }


  /*发布时间（xx分钟之前发布）*/

  /* 返回时间戳
   * 举例 getDateTimeStamp('2015-05-05 12:12:12')  返回// 1430799132000
   */
  function getDateTimeStamp(dateStr){
    return Date.parse(dateStr.replace(/-/gi,"/"));
  }

  /* 发布时间
   * 举例 getDateDiff(1430799132000)  返回// 发表于xx月之前
   */
  var minute = 1000 * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var halfamonth = day * 15;
  var month = day * 30;
  function getDateDiff(dateTimeStamp){
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if(diffValue < 0){
      //若日期不符则弹出窗口告之
      //alert("结束日期不能小于开始日期！");
    }
    var monthC =diffValue/month;
    var weekC =diffValue/(7*day);
    var dayC =diffValue/day;
    var hourC =diffValue/hour;
    var minC =diffValue/minute;
    if(monthC>=1){
      result="发表于" + parseInt(monthC) + "个月前";
    }else if(weekC>=1){
      result="发表于" + parseInt(weekC) + "周前";
    }else if(dayC>=1){
      result="发表于"+ parseInt(dayC) +"天前";
    }else if(hourC>=1){
      result="发表于"+ parseInt(hourC) +"个小时前";
    }else if(minC>=1){
      result="发表于"+ parseInt(minC) +"分钟前";
    }else{
      result="刚刚发表";
    }
    return result;
  }

  /* 通过IP获得地址信息
   * 前提 使用该方法的页面需要引入address.js文件
   * 使用 getAddressInfo('北京')  //["北京", "beijing", "39.9299857781", "116.395645038"]
   */
  function getAddressInfo(address){
    var availableTags = [],
        pin,lan,lon,address_arr;

    var setOffArea = {
      "message": "查询成功",
      "result": {
        "result": window.areaJson
      }
    }

    $.each(setOffArea.result.result, function(i, val) {
      availableTags.push(val.Name + ',' + val.Pinyin + ',' + val.lan + ',' + val.lon);
    });
    console.log(availableTags)

    for(i in availableTags){
      if(availableTags[i].indexOf(address)>=0){
        address_arr = availableTags[i].split(',');
        // pin = address_arr[1];  //拼音
        // lan = address_arr[2];  //经度
        // lon = address_arr[3];  //纬度
        return address_arr;
      }
    }
  }


})(jQuery)

