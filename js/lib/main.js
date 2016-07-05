var Cookie = {
  read: function(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  },
  write: function(name, value, option) {
    var str = name + '=' + escape(value);
    if (option) {
      if (option.expireHours) {
        var d = new Date();
        d.setTime(d.getTime() + option.expireHours * 3600 * 1000);
        str += '; expires=' + d.toGMTString();
      }
      if (option.path) {
        str += '; path=' + option.path;
      } else {
        str += '; path=/';
      }
      if (option.domain) {
        str += '; domain=' + option.domain;
      }
      if (option.secure) {
        str += '; true';
      }
    }
    document.cookie = str;
  },
  del: function(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.read(name);
    if (cval != null) {
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
    }
  }
};

var City = {
  cookieName: 'cookieCityId',
  cookieLongitude: 'cookieLongitude',
  cookieLatitude: 'cookieLatitude',
  cookiePin:'cookiePin',
  cityCode: null,
  cityName: null,
  areaJson: null,
  init: function() {
    var that = this;
    City.areaJson = window.areaJson;

    var cityCode = City.cityCode = City.getCityCode();
    var cityName = City.cityName =  City.getCityName();

    // 初始化当前城市
    $('#currentCity').html(cityName);
    $('#currentCity').attr('href', '#' + cityCode);
    $('#currentCity').attr('data-longitude',Cookie.read(that.cookieLongitude));
    $('#currentCity').attr('data-latitude',Cookie.read(that.cookieLatitude));
    $('#currentCity').attr('data-pin',Cookie.read(that.cookiePin));

    // 初始化城市浮层
    City.initCityPop();
  },
  initCityPop: function() {
    $('#cityPop').citypop({
      // 热门城市: 北京, 上海, 深圳, 广州, 杭州, 南京
      hot: [110100, 310100, 440300, 440100, 330100, 320100],
      // 直辖市: 北京, 上海, 天津, 重庆
      zx: [110100, 310100, 120100, 500100],
      // 不出现在字母列表里的省份
      no: [110000, 310000, 120000, 500000, 710000, 810000, 820000],
      trigger: '#currentCity',
      data: City.areaJson,
      cityId: City.cityCode,
      sumbit: function(cityInfo) {
        //console.log(cityInfo); // [110100, 经度, 纬度, 646, "北京", "beijing"]

        $('#currentCity').text(cityInfo[4])
          .attr('data-longitude',cityInfo[1])
          .attr('data-latitude',cityInfo[2])
          .attr('data-Id',cityInfo[0])
          .attr('data-OldId',cityInfo[3])
          .attr('data-pin',cityInfo[5]);

        /*执行筛选*/
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



        // Hide CityPop
        this.hide();

        // Update cookie
        City.rewriteCityCode(cityInfo[0],cityInfo[1],cityInfo[2],cityInfo[5]);

        // Reload page
        //window.location.reload();
        // or
        // ajaxUpdateSomething();

        indexCircumInit(result_lat,result_lon,behavior);

        $(".weather-address .city").html(cityInfo[4]);
        $(".weather-address .e-city").html(cityInfo[5]);
        $("#citynamet").html(cityInfo[4]);
      }
    });
  },
  getCityCode: function() {
    var that = this;
    var cityId = parseInt(Cookie.read(that.cookieName), 10) || parseInt(Cookie.read('area'), 10) || 110100;
    cityId = parseInt(cityId / 100, 10) * 100;
    if (cityId === 110200 || cityId === 120200 || cityId === 500200 || cityId === 310200) {
      return parseInt(cityId / 10000, 10) * 10000 + 100;
    }

    return cityId;
  },
  getUrlParam: function(name, url) {
    var search = url || document.location.search;
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = search.substr(1).match(reg);  //匹配目标参数
    if (r!=null) {
      return unescape(r[2]);
    }
    else{
      return null;
    }
  },
  getCityName: function() {
    var that = this;
    var cityId = that.getCityCode();
    var cityname = that.getUrlParam('cityname');
    //cityname = getIpPlace();
    cityname = cityname?(cityname!='null'?decodeURI(cityname):''):'';
    var cname = cityname?(cityname!='null'?decodeURI(cityname):"全国"):"全国";

    var province;
    var city;
    var i;
    var j;
    if (cityId > 0) {
      for (i = 0; i < that.areaJson.length; i++) {
        province = that.areaJson[i];
        for (j = 0; j < province.City.length; j++) {
          city = province.City[j];
          if (cityId === city.Id) {
            cname = city.Name;
            return cname;
          }
        }
      }
    }
    return cname;
  },
  rewriteCityCode: function(cityid,longitude,latitude,pin) {
    var that = this;
    Cookie.del(that.cookieName);
    // TODO 必须有 domain 设置
    // Cookie.write(that.cookieName, cityid, {expireHours: 3600 * 24 * 10, domain: '.autohome.com.cn'});
    // Cookie.write(that.cookieName, cityid, {expireHours: 3600 * 24 * 10});
    Cookie.write(that.cookieName, cityid, {expireHours: 3600 * 24 * 10});
    Cookie.write(that.cookieLongitude, longitude, {expireHours: 3600 * 24 * 10});
    Cookie.write(that.cookieLatitude, latitude, {expireHours: 3600 * 24 * 10});
    Cookie.write(that.cookiePin, pin, {expireHours: 3600 * 24 * 10});
  }
};

City.init();
