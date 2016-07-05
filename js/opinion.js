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