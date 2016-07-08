
jQuery.extend({


    createUploadIframe: function (id, uri) {
        //create frame
        var frameId = 'jUploadFrame' + id;
        var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px"';
        if (window.ActiveXObject) {
            if (typeof uri == 'boolean') {
                iframeHtml += ' src="' + 'javascript:false' + '"';

            }
            else if (typeof uri == 'string') {
                iframeHtml += ' src="' + uri + '"';

            }
        }
        iframeHtml += ' />';
        jQuery(iframeHtml).appendTo(document.body);

        return jQuery('#' + frameId).get(0);
    },
    createUploadForm: function (id, fileElementId, data) {
        //create form	
        var formId = 'jUploadForm' + id;
        var fileId = 'jUploadFile' + id;
        var form = jQuery('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
        if (data) {
            for (var i in data) {
                jQuery('<input type="hidden" name="' + i + '" value="' + data[i] + '" />').appendTo(form);
            }
        }
        var oldElement = jQuery('#' + fileElementId);
        var newElement = jQuery(oldElement).clone();
        jQuery(oldElement).attr('id', fileId);
        jQuery(oldElement).before(newElement);
        jQuery(oldElement).appendTo(form);



        //set attributes
        jQuery(form).css('position', 'absolute');
        jQuery(form).css('top', '-1200px');
        jQuery(form).css('left', '-1200px');
        jQuery(form).appendTo('body');
        return form;
    },

    ajaxFileUpload: function (s) {
        // TODO introduce global settings, allowing the client to modify them for all requests, not only timeout		
        s = jQuery.extend({}, jQuery.ajaxSettings, s);
        var id = new Date().getTime()
        var form = jQuery.createUploadForm(id, s.fileElementId, (typeof (s.data) == 'undefined' ? false : s.data));
        var io = jQuery.createUploadIframe(id, s.secureuri);
        var frameId = 'jUploadFrame' + id;
        var formId = 'jUploadForm' + id;
        // Watch for a new set of requests
        if (s.global && !jQuery.active++) {
            jQuery.event.trigger("ajaxStart");
        }
        var requestDone = false;
        // Create the request object
        var xml = {}
        if (s.global)
            jQuery.event.trigger("ajaxSend", [xml, s]);
        // Wait for a response to come back
        var uploadCallback = function (isTimeout) {
            var io = document.getElementById(frameId);
            try {
                if (io.contentWindow) {
                    xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML : null;
                    xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument : io.contentWindow.document;

                } else if (io.contentDocument) {
                    xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML : null;
                    xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument : io.contentDocument.document;
                }
            } catch (e) {
                jQuery.handleError(s, xml, null, e);
            }
            if (xml || isTimeout == "timeout") {
                requestDone = true;
                var status;
                try {
                    status = isTimeout != "timeout" ? "success" : "error";
                    // Make sure that the request was successful or notmodified
                    if (status != "error") {
                        // process the data (runs the xml through httpData regardless of callback)
                        var data = jQuery.uploadHttpData(xml, s.dataType);
                        // If a local callback was specified, fire it and pass it the data

                        if (s.success)
                            s.success(data, status);

                        // Fire the global callback
                        if (s.global)
                            jQuery.event.trigger("ajaxSuccess", [xml, s]);
                    } else
                        jQuery.handleError(s, xml, status);
                } catch (e) {
                    status = "error";
                    jQuery.handleError(s, xml, status, e);
                }

                // The request was completed
                if (s.global)
                    jQuery.event.trigger("ajaxComplete", [xml, s]);

                // Handle the global AJAX counter
                if (s.global && ! --jQuery.active)
                    jQuery.event.trigger("ajaxStop");

                // Process result
                if (s.complete)
                    s.complete(xml, status);

                jQuery(io).unbind()

                setTimeout(function () {
                    try {
                        jQuery(io).remove();
                        jQuery(form).remove();

                    } catch (e) {
                        jQuery.handleError(s, xml, null, e);
                    }

                }, 100)

                xml = null

            }
        }
        // Timeout checker
        if (s.timeout > 0) {
            setTimeout(function () {
                // Check to see if the request is still happening
                if (!requestDone) uploadCallback("timeout");
            }, s.timeout);
        }
        try {

            var form = jQuery('#' + formId);
            jQuery(form).attr('action', s.url);
            jQuery(form).attr('method', 'POST');
            jQuery(form).attr('target', frameId);
            if (form.encoding) {
                jQuery(form).attr('encoding', 'multipart/form-data');
            }
            else {
                jQuery(form).attr('enctype', 'multipart/form-data');
            }
            jQuery(form).submit();

        } catch (e) {
            jQuery.handleError(s, xml, null, e);
        }

        jQuery('#' + frameId).load(uploadCallback);
        return { abort: function () { } };

    },

    uploadHttpData: function (r, type) {
        var data = !type;
        data = type == "xml" || data ? r.responseXML : r.responseText;
        // If the type is "script", eval it in global context
        if (type == "script")
            jQuery.globalEval(data);
        // Get the JavaScript object, if JSON is used.
        if (type == "json") {
            eval("data = " + data);
        }
        // evaluate scripts within html
        if (type == "html")
            jQuery("<div>").html(data).evalScripts();

        return data;
    }
})




//显示分享框
$('.share-num').click(function(){
	if($('.share-box').hasClass('hide')){
		$('.share-box').removeClass('hide');
	}else{
		$('.share-box').addClass('hide');
	}
})

//滚动条
$('.chapter-box').mouseover(function(){
	$('.scrollbar').removeClass('hide');
});
$('.chapter-box').mouseout(function(){
	$('.scrollbar').addClass('hide');
});

//滚动条
jQuery(document).ready(function ($) {
    "use strict";
    $('#Default').perfectScrollbar();
    $('#SuppressScrollX').perfectScrollbar({suppressScrollX: true});
    $('#SuppressScrollY').perfectScrollbar({suppressScrollY: true});
});

//目录
$('.chapter-box').height($(window).height()*0.7);
var win_top,item_top,next_top,id;
$(window).scroll(function () {
	win_top = $(window).scrollTop();
	if(win_top > 632){
		$('.menu-box').addClass('menu-fixed').addClass('ie');
	}else{
		$('.menu-box').removeClass('menu-fixed').removeClass('ie');
	}

	$('.journey-box .day-tit,.journey-box .journey').each(function(){
	  	item_top = $(this).offset().top;
		next_top = $(this).offset().top + $(this).height();
		id = $(this).attr('id');
		if(item_top <= win_top && next_top > win_top){
			$('.menu a').each(function(){
				if($(this).attr('href').slice(1) == id){
					$('.menu .item-tit,.menu .item-txt').removeClass('active');
					$(this).parent().addClass('active');
					$('.chapter-box').scrollTop($(this).position().top);
				}
			})
		}
	})

});

//点赞
$('.options-box,.user-con').on('click','.zan,.zan-num',function(){
	if(!$(this).hasClass('move')){
		$(this).find('em').removeClass('hide').addClass('move');
	}
});

//输入框字数限制
var total_num = 5000;
$('.comment-box .txt-num').find('em').html(total_num);
$('.comment-box').on('keyup', 'textarea', function() {
	var txt_num = $(this).val().length,
		left_num = $(this).next('.txt-num').find('em').text();

	$(this).next('.txt-num').find('em').text(total_num-txt_num);
	if(left_num <= 0){
		$(this).val($(this).val().slice(0,total_num));
		$(this).next('.txt-num').find('em').html(0);
	}
});


//表情
window.TRAVEL_CONFIG = {
  UPLOAD_IMG_TYPE: '.jpg，.bmp，jpeg，.png',
  QQ_FACE: [{"name":"[微笑]","url":"http://x.autoimg.cn/club/smiles/0.gif"},{"name":"[撇嘴]","url":"http://x.autoimg.cn/club/smiles/1.gif"},{"name":"[色]","url":"http://x.autoimg.cn/club/smiles/2.gif"},{"name":"[发呆]","url":"http://x.autoimg.cn/club/smiles/3.gif"},{"name":"[得意]","url":"http://x.autoimg.cn/club/smiles/4.gif"},{"name":"[流泪]","url":"http://x.autoimg.cn/club/smiles/5.gif"},{"name":"[害羞]","url":"http://x.autoimg.cn/club/smiles/6.gif"},{"name":"[闭嘴]","url":"http://x.autoimg.cn/club/smiles/7.gif"},{"name":"[睡]","url":"http://x.autoimg.cn/club/smiles/8.gif"},{"name":"[大哭]","url":"http://x.autoimg.cn/club/smiles/9.gif"},{"name":"[尴尬]","url":"http://x.autoimg.cn/club/smiles/10.gif"},{"name":"[发怒]","url":"http://x.autoimg.cn/club/smiles/11.gif"},{"name":"[调皮]","url":"http://x.autoimg.cn/club/smiles/12.gif"},{"name":"[嘻嘻]","url":"http://x.autoimg.cn/club/smiles/13.gif"},{"name":"[惊讶]","url":"http://x.autoimg.cn/club/smiles/14.gif"},{"name":"[难过]","url":"http://x.autoimg.cn/club/smiles/15.gif"},{"name":"[酷]","url":"http://x.autoimg.cn/club/smiles/16.gif"},{"name":"[冷汗]","url":"http://x.autoimg.cn/club/smiles/17.gif"},{"name":"[抓狂]","url":"http://x.autoimg.cn/club/smiles/18.gif"},{"name":"[吐]","url":"http://x.autoimg.cn/club/smiles/19.gif"},{"name":"[偷笑]","url":"http://x.autoimg.cn/club/smiles/20.gif"},{"name":"[可爱]","url":"http://x.autoimg.cn/club/smiles/21.gif"},{"name":"[白眼]","url":"http://x.autoimg.cn/club/smiles/22.gif"},{"name":"[傲慢]","url":"http://x.autoimg.cn/club/smiles/23.gif"},{"name":"[饥饿]","url":"http://x.autoimg.cn/club/smiles/24.gif"},{"name":"[困]","url":"http://x.autoimg.cn/club/smiles/25.gif"},{"name":"[惊恐]","url":"http://x.autoimg.cn/club/smiles/26.gif"},{"name":"[汗]","url":"http://x.autoimg.cn/club/smiles/27.gif"},{"name":"[憨笑]","url":"http://x.autoimg.cn/club/smiles/28.gif"},{"name":"[大兵]","url":"http://x.autoimg.cn/club/smiles/29.gif"},{"name":"[奋斗]","url":"http://x.autoimg.cn/club/smiles/30.gif"},{"name":"[咒骂]","url":"http://x.autoimg.cn/club/smiles/31.gif"},{"name":"[疑问]","url":"http://x.autoimg.cn/club/smiles/32.gif"},{"name":"[嘘]","url":"http://x.autoimg.cn/club/smiles/33.gif"},{"name":"[晕]","url":"http://x.autoimg.cn/club/smiles/34.gif"},{"name":"[折磨]","url":"http://x.autoimg.cn/club/smiles/35.gif"},{"name":"[衰]","url":"http://x.autoimg.cn/club/smiles/36.gif"},{"name":"[骷髅]","url":"http://x.autoimg.cn/club/smiles/37.gif"},{"name":"[敲打]","url":"http://x.autoimg.cn/club/smiles/38.gif"},{"name":"[再见]","url":"http://x.autoimg.cn/club/smiles/39.gif"},{"name":"[擦汗]","url":"http://x.autoimg.cn/club/smiles/40.gif"},{"name":"[挖鼻]","url":"http://x.autoimg.cn/club/smiles/41.gif"},{"name":"[鼓掌]","url":"http://x.autoimg.cn/club/smiles/42.gif"},{"name":"[糗大了]","url":"http://x.autoimg.cn/club/smiles/43.gif"},{"name":"[坏笑]","url":"http://x.autoimg.cn/club/smiles/44.gif"},{"name":"[左哼哼]","url":"http://x.autoimg.cn/club/smiles/45.gif"},{"name":"[右哼哼]","url":"http://x.autoimg.cn/club/smiles/46.gif"},{"name":"[哈欠]","url":"http://x.autoimg.cn/club/smiles/47.gif"},{"name":"[鄙视]","url":"http://x.autoimg.cn/club/smiles/48.gif"},{"name":"[委屈]","url":"http://x.autoimg.cn/club/smiles/49.gif"},{"name":"[快哭了]","url":"http://x.autoimg.cn/club/smiles/50.gif"},{"name":"[阴险]","url":"http://x.autoimg.cn/club/smiles/51.gif"},{"name":"[亲亲]","url":"http://x.autoimg.cn/club/smiles/52.gif"},{"name":"[吓]","url":"http://x.autoimg.cn/club/smiles/53.gif"},{"name":"[可怜]","url":"http://x.autoimg.cn/club/smiles/54.gif"},{"name":"[菜刀]","url":"http://x.autoimg.cn/club/smiles/55.gif"},{"name":"[西瓜]","url":"http://x.autoimg.cn/club/smiles/56.gif"},{"name":"[啤酒]","url":"http://x.autoimg.cn/club/smiles/57.gif"},{"name":"[篮球]","url":"http://x.autoimg.cn/club/smiles/58.gif"},{"name":"[乒乓]","url":"http://x.autoimg.cn/club/smiles/59.gif"},{"name":"[咖啡]","url":"http://x.autoimg.cn/club/smiles/60.gif"},{"name":"[饭]","url":"http://x.autoimg.cn/club/smiles/61.gif"},{"name":"[猪头]","url":"http://x.autoimg.cn/club/smiles/62.gif"},{"name":"[玫瑰]","url":"http://x.autoimg.cn/club/smiles/63.gif"},{"name":"[凋零]","url":"http://x.autoimg.cn/club/smiles/64.gif"},{"name":"[示爱]","url":"http://x.autoimg.cn/club/smiles/65.gif"},{"name":"[爱心]","url":"http://x.autoimg.cn/club/smiles/66.gif"},{"name":"[心碎]","url":"http://x.autoimg.cn/club/smiles/67.gif"},{"name":"[蛋糕]","url":"http://x.autoimg.cn/club/smiles/68.gif"},{"name":"[闪电]","url":"http://x.autoimg.cn/club/smiles/69.gif"},{"name":"[炸弹]","url":"http://x.autoimg.cn/club/smiles/70.gif"},{"name":"[刀]","url":"http://x.autoimg.cn/club/smiles/71.gif"},{"name":"[足球]","url":"http://x.autoimg.cn/club/smiles/72.gif"},{"name":"[瓢虫]","url":"http://x.autoimg.cn/club/smiles/73.gif"},{"name":"[便便]","url":"http://x.autoimg.cn/club/smiles/74.gif"},{"name":"[月亮]","url":"http://x.autoimg.cn/club/smiles/75.gif"},{"name":"[太阳]","url":"http://x.autoimg.cn/club/smiles/76.gif"},{"name":"[礼物]","url":"http://x.autoimg.cn/club/smiles/77.gif"},{"name":"[拥抱]","url":"http://x.autoimg.cn/club/smiles/78.gif"},{"name":"[强]","url":"http://x.autoimg.cn/club/smiles/79.gif"},{"name":"[弱]","url":"http://x.autoimg.cn/club/smiles/80.gif"},{"name":"[握手]","url":"http://x.autoimg.cn/club/smiles/81.gif"},{"name":"[胜利]","url":"http://x.autoimg.cn/club/smiles/82.gif"},{"name":"[抱拳]","url":"http://x.autoimg.cn/club/smiles/83.gif"},{"name":"[勾引]","url":"http://x.autoimg.cn/club/smiles/84.gif"},{"name":"[拳头]","url":"http://x.autoimg.cn/club/smiles/85.gif"},{"name":"[差劲]","url":"http://x.autoimg.cn/club/smiles/86.gif"},{"name":"[爱你]","url":"http://x.autoimg.cn/club/smiles/87.gif"},{"name":"[NO]","url":"http://x.autoimg.cn/club/smiles/88.gif"},{"name":"[OK]","url":"http://x.autoimg.cn/club/smiles/89.gif"}],
  TAGS: [
    {
      'code': 0060001000001,
      'text': '自然风貌'
    },
    {
      'code': 0040001000001,
      'text': '购物'
    },
    {
      'code': 0060001000004,
      'text': '海岛'
    },
    {
      'code': 0060001000002,
      'text': '民俗文化'
    },
    {
      'code': 0060001000010,
      'text': '自驾'
    },
    {
      'code': 0060001000013,
      'text': '潜水'
    },
    {
      'code': 0060001000015,
      'text': '户外'
    },
    {
      'code': 0030001000003,
      'text': '露营'
    },
    {
      'code': 0060006000002,
      'text': '免签'
    }
  ]
}
var qqFacePackage = getFaceHtml();
function getFaceHtml() {
	var html = '';
	var qqFaceItem = '';
	$.each(TRAVEL_CONFIG.QQ_FACE, function(i, val) {
	  qqFaceItem += '<li>'
	    + '<a href="javascript:void(0);" title="' + val.name + '">'
	      + '<img src="' + val.url + '">'
	    + '</a>'
	  + '</li>'; 
	});
	html = '<ul>' + qqFaceItem + '</ul>';
	return html;
}
$('.pop-content-info').html(qqFacePackage);

//显示表情框
$('.emoji-btn').on('click','.emoji',function(){
	$('.qq-face').removeClass('hide');
})

// 选择表情
$('.js_face').on('click', 'a', function() {
	var targetTextarea = $('.comment-box textarea');
	var textareaVal = $(targetTextarea).val();
	textareaVal ? $(targetTextarea).val($(targetTextarea).val() + $(this).attr('title')) : $(targetTextarea).val($(this).attr('title'));
});
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
//输入框字数限制
var total_num = 5000;
$('.opinion-box .txt-num').find('em').html(total_num);
$('.opinion-box').on('keyup', 'textarea', function() {
    var txt_num = $(this).val().length,
        left_num = $(this).next('.txt-num').find('em').text();

    $(this).next('.txt-num').find('em').text(total_num-txt_num);
    if(left_num <= 0){
        $(this).val($(this).val().slice(0,total_num));
        $(this).next('.txt-num').find('em').html(0);
    }
});



//显示上传图片文本框
$('.emoji-btn').click(function(){
	$('.upload-img').removeClass('hide');
})
//隐藏上传图片文本框
$('.upload-img .emoji').click(function(){
	$('.upload-img').addClass('hide');
})

//点击add按钮相当于点击上传文件
$('.upload-img .add').click(function(){
	return $("#upload_file").click(); 
})

//生成图片
// $("#upload_file").on("change", function(){ 
// 	handleFiles();
// });
var inputElement = document.getElementById("upload_file");    
inputElement.addEventListener("change", handleFiles, false);  
  
function handleFiles(){  
    var fileList = this.files,
    	max_len = 10-$('.upload-img .img-list li').length; 
    console.log(fileList)
    if(fileList.length > max_len){
    	alert('最多上传9张图片');
    }else{
	    for( var i = 0; i < fileList.length; i++ ){  
	    	var id = fileList[i].lastModified;
	        if (/^image/.test( fileList[i].type)){          
				var reader = new FileReader();            
				reader.readAsDataURL(fileList[i]);                 
				reader.onloadend = function(){  
					$('.upload-img .img-list').prepend('<li><img id="'+id+'" src="'+this.result+'" alt="" /><a class="delete"></a></li>');                   
					$('.upload-img .img-list li').removeAttr('style');
					$('.upload-img .img-list li:nth-child(3n)').css('marginRight','0');
					if($('.upload-img .img-list li').length >= 10){
						$('.upload-img .img-list li.add').addClass('hide');
					}

					//ajaxFileUpload(id);

				} 
			} 
	    }  
	}
} 

function ajaxFileUpload() {
    $.ajaxFileUpload
    (
        {
            url: 'http://10.168.99.140:8080/upload/uploadpic.do', //用于文件上传的服务器端请求地址
            secureuri: false, //一般设置为false
            fileElementId: 'upload_file', //文件上传空间的id属性  <input type="file" id="file" name="file" />
            dataType: 'json', //返回值类型 一般设置为json
            success: function (data, status){  //服务器成功响应处理函数
                alert(data);
            },
            error: function (data, status, e)//服务器响应失败处理函数
            {
                alert(e);
            }
        }
    )
    return false;
}



//删除已选择的图片
$('.img-list').on('click','.delete',function(){
	$(this).parent('li').remove();
	if($('.upload-img .img-list li').length < 10){
    	$('.add').removeClass('hide');
    	$('.upload-img .img-list li').removeAttr('style');
		$('.upload-img .img-list li:nth-child(3n)').css('marginRight','0');
    }
})

//显示删除按钮
$('.img-list').on('mouseover','li',function(){
	$(this).find('.delete').show();
})
//隐藏删除按钮
$('.img-list').on('mouseout','li',function(){
	$(this).find('.delete').hide();
})


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



  	//标签选择
  	var tag_txt;
  	$('.tags-search').on('click','li',function(){
  		if(!$(this).hasClass('active')){
  			tag_txt = $(this).text();
  			console.log(tag_txt)
  		}
  	})
