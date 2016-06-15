/**
 * CityPop
 */

+(function($) {
  'use strict';

  var ATTR_DATA_LETTER = 'data-citypop-letter';
  var ATTR_DATA_LETTER_SELECTOR = '[' + ATTR_DATA_LETTER + ']';

  var indexOf = function(array, item) {
    for (var i = 0, len = array.length; i < len; i++) {
      if (array[i] === item) {
        return i;
      }
    }
    return -1;
  };

  // CityPop PUBLIC CLASS DEFINITION
  // ==============================

  var CityPop = function(elem, options) {
    var that = this;
    that.$elem = $(elem);
    that.options = $.extend({}, CityPop.DEFAULTS, options);

    this._init(that.options);
  };

  CityPop.DEFAULTS = {
    input: '.citypop-search input[type="text"]',
    inputContent: '.citypop-search .citypop-ct',
    searchTipNone: '.citypop-search .ntextdicon',
    searchTipZD: '.citypop-search .zdicon',
    searchResult: '.citypop-search ul',
    hidemode: 'click',
    // 详细城市数据
    data: null,
    // 默认选中的城市
    cityId: null,
    // 热门城市: 北京, 上海, 深圳, 广州, 杭州, 南京
    hot: [110100, 310100, 440300, 440100, 330100, 320100],
    // 直辖市: 北京, 上海, 天津, 重庆
    zx: [110100, 310100, 120100, 500100],
    // 不出现在字母列表里的省份
    no: [110000, 310000, 120000, 500000, 710000, 810000, 820000]
  };

  CityPop.prototype._init = function(options) {
    var that = this;

    // 城市数据
    that.data = options.data;

    // 渲染
    that._render();

    // 搜索框
    that.$input = $(options.input, that.$elem);
    that.$inputContent = $(options.inputContent, that.$elem);
    that.$searchTipNone = $(options.searchTipNone, that.$elem);
    that.$searchTipZD = $(options.searchTipZD, that.$elem);
    that.$searchResult = $(options.searchResult, that.$elem);

    // 触发按钮
    that.$trigger = $(options.trigger);

    if (that.$input.size() < 1 && that.$inputContent.size() < 1) {
      return;
    }

    that._initTrigger();
    that._initClose();
    that._initLetter();
    that._initContent();
    that._initSearch();

    options.cityId && that.select(options.cityId);

    // 选中城市
    that.$elem.on('click.citypop', '[data-info]', function(e) {
      that._submit($(this).attr('data-info'));
    });
  };

  CityPop.prototype._initTrigger = function() {
    var that = this;

    // 触发器
    that.$trigger.on('click.citypop', function() {
      that._timer && clearTimeout(that._timer);
      that.$elem.show();
      $.isFunction(that.options.shown) && that.options.shown.call(that);
    });
  };

  CityPop.prototype._initClose = function() {
    var that = this;

    // 关闭按钮
    that.$elem.on('click.citypop', '.pop-close', function() {
      that.$elem.hide();
    });

    // 关闭行为
    if (that.options.hidemode === 'click') {
      $(document).on('click.citypop', function(e) {
        if ($(e.target).closest(that.$elem).length === 0
            && $(e.target).closest(that.$trigger).length === 0) {
          that.$elem.hide();
          // fix IE6 下不隐藏的 bug
          that.$inputContent.css({
            visibility: 'hidden',
            display: 'none'
          });
        }
      });
    } else {
      that.$elem.on('mouseleave.citypop', function() {
        that._timer = setTimeout(function() {
          that.$elem.hide();
          // fix IE6 下不隐藏的 bug
          that.$inputContent.css({
            visibility: 'hidden',
            display: 'none'
          });
        }, 100);
      });

      that.$elem.on('mouseenter.citypop', function() {
        that._timer && clearTimeout(that._timer);
        that.$elem.show();
      });

      that.$trigger.on('mouseleave.citypop', function() {
        that._timer = setTimeout(function() {
          that.$elem.hide();
          // fix IE6 下不隐藏的 bug
          that.$inputContent.css({
            visibility: 'hidden',
            display: 'none'
          });
        }, 100);
      });
    }
  };

  CityPop.prototype._initLetter = function() {
    var that = this;
    var $elem = that.$elem;
    var $latter = $('.citypop-nb', $elem);
    var $content = $('.citypop-scity', $elem);
    var $chars = $(ATTR_DATA_LETTER_SELECTOR, $latter);

    var isIE6 = !!(window.attachEvent && !window.opera && navigator.userAgent.indexOf('MSIE 6') > -1);
    var fix = isIE6 || (parseInt(document.documentMode, 10) === 7);

    $latter.on('click.citypop', ATTR_DATA_LETTER_SELECTOR, function() {
      var latter = $(this).attr(ATTR_DATA_LETTER);
      var dl = $content.find('.js-citypop-dl-' + latter).get(0);

      if (fix) {
        $content.scrollTop(dl.offsetTop + 1);
      } else {
        $content.scrollTop(dl.offsetTop - 73);
      }

      $chars.removeClass('current');
      $(this).addClass('current');
    });
  };

  CityPop.prototype._initContent = function() {
    var that = this;
    var $content = $('.citypop-scity', that.$elem);
    var $links = $('a', $content);

    $content.on('click.citypop', 'a', function() {
      $links.removeClass('current');
      $(this).addClass('current');
    });
  };

  CityPop.prototype._initSearch = function() {
    var that = this;

    // 搜索行为
    that.$input.on('keyup.citypop', $.proxy(that._get, that));
    that.$input.on('focus.citypop', $.proxy(that._focus, that));
    that.$input.on('blur.citypop', $.proxy(that._blur, that));

    // 搜索结果选中
    that.$inputContent.on('click.citypop', 'li', function(e) {
      $('body').off('keyup.citypop');
      that._submit($(this).attr('data-info'));
    });

  };

  CityPop.prototype._get = function(e) {
    var that = this;
    var key = e.keyCode;

    if (key === 38 || key === 40 || key === 13) {
      return;
    }

    that._timer && clearTimeout(that._timer);
    that._timer = setTimeout(function() {
      that.$inputContent.css({visibility: ''});

      var data = that.data;
      var text = that.$input.val();
      var match = [];
      var province;
      var city;
      var i;
      var j;
      var html = '';

      if (text.length <= 0) {
        that.$inputContent.hide();
        return;
      }

      for (i = 0; i < data.length; i++) {
        province = data[i];
        for (j = 0; j < province.City.length; j++) {
          city = province.City[j];
          if (city.Pinyin.indexOf(text) === 0 || city.Name.indexOf(text) === 0) {
            if (match.length >= 10) {
              break;
            }
            match.push(city);
          }
        }
        if (match.length >= 10) {
          break;
        }
      }

      if (match.length > 0) {
        that.$inputContent.show();
        that.$searchTipNone.hide();
        that.$searchTipZD.show();

        for (i = 0; i < match.length; i++) {
          var dataInfo = '[' + match[i].Id + ', ' + match[i].OldCityId + ', \'' + match[i].Name + '\', \'' + match[i].Pinyin + '\']';
          html += '<li data-key="' + match[i].Id + '" data-info="' + dataInfo + '"><a href="javascript:void(0);" target="_self"><span>' + match[i].Name + '</span><b>' + match[i].Pinyin + '</b></a></li>';
        }

        that.$searchResult.html(html).show();
      } else {
        that.$inputContent.show();
        that.$searchTipNone.show();
        that.$searchTipZD.hide();
        that.$searchResult.html('').hide();
      }

    }, that.sleep || 300);
  };

  CityPop.prototype._focus = function() {
    var that = this;

    if (that.$input.val() === '请输入城市名') {
      that.$input.val('');
    }
    that.$input.addClass('focus');

    setTimeout(function() {
      $('body').off('keyup.citypop').on('keyup.citypop', that, listenerKey);
    }, 0);

    // 快捷键
    function listenerKey(e) {
      var key = e.keyCode;
      var os = e.data;
      var ul = os.$inputContent.children('ul');
      var li = ul.children('li');
      var len = li.size();
      var index = 0;
      var temp = 0;
      var active = 'selected';

      function isCheck() {
        var b = false;
        $.each(li, function(i) {
          if ($(this).hasClass(active)) {
            b = true;
            index = i;
            return false;
          }
        });

        return b;
      }

      if ((key === 38 || key === 40 || key === 13) && len > 0) {
        switch (key) {
          case 40:
            if (isCheck()) {
              $(li.get(index)).removeClass(active);
              if (index + 1 < len) {
                $(li.get(index + 1)).addClass(active);
                temp = index + 1;
              } else {
                $(li.get(0)).addClass(active);
              }
            } else {
              $(li.get(0)).addClass(active);
            }
            os.$input.val($(li.get(temp)).find('span').html());
            os.$input.attr('data-input-key', $(li.get(temp)).attr('data-key'));
            os.$input.attr('data-input-info', $(li.get(temp)).attr('data-info'));
            break;
          case 38:
            if (isCheck()) {
              $(li.get(index)).removeClass(active);
              if (index > 0) {
                $(li.get(index - 1)).addClass(active);
                temp = index - 1;
              } else {
                $(li.get(len - 1)).addClass(active);
                temp = len - 1;
              }
            } else {
              $(li.get(len - 1)).addClass(active);
              temp = len - 1;
            }
            os.$input.val($(li.get(temp)).find('span').html());
            os.$input.attr('data-input-key', $(li.get(temp)).attr('data-key'));
            os.$input.attr('data-input-info', $(li.get(temp)).attr('data-info'));
            break;
          case 13:
            // 执行
            $('body').off('keyup.citypop');
            os._submit(os.$input.attr('data-input-info'));
            break;
        }
      }
    }
  };

  CityPop.prototype._blur = function() {
    var that = this;

    if (that.$input.val() === '') {
      that.$input.val('请输入城市名');
    }
    that.$input.removeClass('focus');

    setTimeout(function() {
      $('body').off('keyup.citypop');
      that.$inputContent.hide();
    }, 150);
  };

  CityPop.prototype._render = function() {
    var hotCity = [];
    var zxCity = [];
    var firstChar = [];

    var hotCityHtml = '<a target="_self" href="javascript:void(0);" data-key="0" data-info="[0, 0, \'全国\', \'\']">全国</a>';
    var zxCityHtml = '';
    var firstCharHtml = '';
    var listHtml = '';

    var i;
    var j;
    var k;

    // 生成字母列表, 热门城市, 直辖市等数据
    for (i = 0; i < this.data.length; i++) {
      // 字母列表新增字母
      if (indexOf(firstChar, this.data[i].FirstCharacter) === -1
          && indexOf(this.options.no, this.data[i].Id) === -1) {
        firstChar.push(this.data[i].FirstCharacter);
      }

      var city = this.data[i].City;
      for (j = 0; j < city.length; j++) {
        // 新增热门城市
        if (indexOf(this.options.hot, city[j].Id) > -1) {
          hotCity.push(city[j]);
        }

        // 新增直辖市
        if (indexOf(this.options.zx, city[j].Id) > -1) {
          zxCity.push(city[j]);
        }
      }
    }

    // 生成字母列表内容
    for (i = 0; i < firstChar.length; i++) {
      firstCharHtml += '<a target="_self" href="javascript:void(0);" '
        + ATTR_DATA_LETTER + '="' + firstChar[i] + '">' + firstChar[i] + '</a>';
    }

    // 生成热门城市内容
    for (i = 0; i < hotCity.length; i++) {
      hotCityHtml += '<a target="_self" href="javascript:void(0);" '
        + 'data-key="' + hotCity[i].Id + '" '
        + 'data-info="[' + hotCity[i].Id + ', ' + hotCity[i].OldCityId + ', \'' + hotCity[i].Name + '\', \'' + hotCity[i].Pinyin + '\']">' + hotCity[i].Name + '</a>';
    }

    // 生成直辖市内容
    for (i = 0; i < zxCity.length; i++) {
      zxCityHtml += '<a target="_self" href="javascript:void(0);" '
        + 'data-key="' + zxCity[i].Id + '" '
        + 'data-info="[' + zxCity[i].Id + ', ' + zxCity[i].OldCityId + ', \'' + zxCity[i].Name + '\', \'' + zxCity[i].Pinyin + '\']">' + zxCity[i].Name + '</a>';
    }

    // 生成城市列表内容
    listHtml += ''
      + '<dl class="dlbg dlbg-top">'
        + '<dt><span class="tx">直辖市：</span></dt>'
        + '<dd>'
          + zxCityHtml
        + '</dd>'
      + '</dl>';

    for (i = 0; i < firstChar.length; i++) {
      var fcSpan = '<span class="nu">' + firstChar[i] + '</span>';
      var rowHtml = '';
      for (j = 0; j < this.data.length; j++) {
        var province = this.data[j];
        if (firstChar[i] !== province.FirstCharacter || indexOf(this.options.no, province.Id) > -1) {
          continue;
        }
        rowHtml += '<dt><span class="tx">' + province.Name + '：</span>' + fcSpan + '</dt>';
        rowHtml += '<dd>';
        var city = province.City;
        for (k = 0; k < city.length; k++) {
          rowHtml += '<a target="_self" href="javascript:void(0);" data-key="' + city[k].Id + '"  data-info="[' + city[k].Id + ', ' + city[k].OldCityId + ', \'' + city[k].Name + '\', \'' + city[k].Pinyin + '\']">' + city[k].Name + '</a>';
        }
        rowHtml += '</dd>';
        fcSpan = '';
      }
      if (rowHtml !== '') {
        listHtml += '<dl class="js-citypop-dl-' + firstChar[i] + '">';
        listHtml += rowHtml;
        listHtml += '</dl>';
      }
    }

    var html = ''
      + '<div class="pop-content">'
        + '<h3>'
          + '<div class="citypop-search">'
            + '<i class="icon16 icon16-search2"></i><input type="text" value="请输入城市名">'
            + '<div class="citypop-ct" style="display:none;">'
              + '<div class="ntextdicon" style="display:none;"><i class="icon12 icon12-exc"></i>对不起，找不到您输入的内容</div>'
              + '<div class="zdicon" style="display:none;"><i class="icon10 icon10-down3"></i>点击直达</div>'
              + '<ul></ul>'
            + '</div>'
          + '</div>'
          + '<div class="citypop-hotcity">'
            + hotCityHtml
          + '</div>'
          + '<a class="pop-close" href="javascript:void(0);" title="关闭" target="_self"><i class="icon16 icon16-close"></i></a>'
        + '</h3>'
        + '<div class="pop-content-info">'
          + '<div class="citypop-nb">'
            + firstCharHtml
          + '</div>'
          + '<div class="citypop-scity">'
            + listHtml
          + '</div>'
        + '</div>'
      + '</div>'
      + '<span class="pop-bottom pop-arrow"></span>';

    this.$elem.html(html);
  };

  CityPop.prototype._submit = function(cityInfo) {
    var cityInfo = eval(cityInfo);
    $.isFunction(this.options.sumbit) && this.options.sumbit.call(this, cityInfo);
  };

  CityPop.prototype.select = function(cityId) {
    var $list = this.$elem.find('.citypop-scity a');
    var $current = this.$elem.find('.citypop-scity a.current');
    for (var i = 0; i < $list.length; i++) {
      if (parseInt($($list[i]).attr('data-key'), 10) === cityId) {
        $($list[i]).addClass('current');
        break;
      }
    }
    $current.removeClass('current');
  };

  CityPop.prototype.hide = function() {
    this.$elem.hide();
  };

  // CityPop PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function() {
      var $this = $(this);
      var data = $this.data('citypop');
      var options = $.extend({}, typeof option === 'object' && option);

      if (!data) {
        $this.data('citypop', (data = new CityPop(this, options)));
      }

      if (typeof option === 'string') {
        data[option](Array.prototype.slice.call(arguments, 1));
      }
    });
  }

  var old = $.fn.citypop;

  $.fn.citypop = Plugin;
  $.fn.citypop.Constructor = CityPop;


  // CityPop NO CONFLICT
  // ==================

  $.fn.citypop.noConflict = function() {
    $.fn.citypop = old;
    return this;
  };

})(jQuery);