(function(x, p) {
    if (!x[p]) {
        x[p] = function(e, n) {
            var o = this,
                l = o.length,
                j = n ? n: 0;
            if (! (l === 0 || j >= l)) {
                if (j < 0) {
                    j = (l - Math.abs(j))
                };
                for (var i = j; i < l; i++) {
                    if (o[i] === e) {
                        return i
                    }
                }
            };
            return - 1
        }
    }
})(Array.prototype, 'indexOf');
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }
        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function() {},
            fBound = function() {
                return fToBind.apply(this instanceof fNOP ? this: oThis, aArgs.concat(Array.prototype.slice.call(arguments)))
            };
        if (this.prototype) {
            fNOP.prototype = this.prototype
        }
        fBound.prototype = new fNOP();
        return fBound
    }
}
var AutoHeader = function(channel) {
    this.init(channel)
};
AutoHeader.prototype = {
    $dom: function() {
        var elements = new Array();
        for (var i = 0; i < arguments.length; i++) {
            var element = arguments[i];
            if (typeof element == 'string') element = document.getElementById(element);
            if (arguments.length == 1) return element;
            elements.push(element)
        }
        return elements
    },
    cookies: {
        read: function(name, defval) {
            var nameEq = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEq) == 0) return decodeURIComponent(c.substring(nameEq.length, c.length))
            }
            return typeof defval == "undefined" ? null: defval
        },
        set: function(name, value, option) {
            var str = name + '=' + encodeURIComponent(value);
            if (option) {
                if (option.expireHours) {
                    var d = new Date();
                    d.setTime(d.getTime() + option.expireHours * 3600 * 1000);
                    str += '; expires=' + d.toGMTString()
                };
                if (option.path) str += '; path=' + option.path;
                else str += '; path=/';
                if (option.domain) str += '; domain=' + option.domain;
                if (option.secure) str += '; true'
            };
            document.cookie = str
        },
        del: function(name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = this.read(name);
            if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString()
        }
    },
    eventHandle: {
        add: function(el, type, fn) {
            window.addEventListener ? el.addEventListener(type, fn, false) : el.attachEvent('on' + type, fn)
        },
        remove: function(el, type, fn) {
            window.removeEventListener ? el.removeEventListener(type, fn, false) : el.detachEvent('on' + type, fn)
        }
    },
    timer: null,
    logoffFunctionArray: new Array(),
    jsLoad: function() {
        var src, fn, args = [],
            length = arguments.length;
        if (length == 1) {
            var target = arguments[0] || {};
            if (typeof target == "object") {
                src = target.url;
                fn = target.fn;
                args = target.args
            } else {
                src = target
            }
        } else {
            src = arguments[0];
            fn = arguments[1];
            for (var i = 0; i < length - 2; i++) {
                args[i] = arguments[i + 2]
            }
        };
        var s = document.createElement("script");
        s.setAttribute("type", "text/javascript");
        s.setAttribute("src", src);
        s.onload = s.onreadystatechange = function() {
            if (!s.readyState || s.readyState == "loaded" || s.readyState == "complete") {
                if (typeof fn == "function") fn.apply(this, args);
                s.onload = s.onreadystatechange = null;
                try {
                    s.parentNode && s.parentNode.removeChild(s)
                } catch(e) {}
            }
        };
        document.getElementsByTagName("head")[0].appendChild(s)
    },
    host: {
        www: "http://www.autohome.com.cn/",
        club: "http://club.autohome.com.cn/",
        clubService: "http://club.service.autohome.com.cn/",
        user: "http://i.autohome.com.cn",
        login: "http://account.autohome.com.cn/?backurl=" + encodeURIComponent(location.href),
        register: "http://account.autohome.com.cn/register?backurl=" + encodeURIComponent(location.href)
    },
    user: {
        isLogin: false,
        uid: null,
        un: null,
        up: null
    },
    userArea: {
        cookieArea: null,
        cookieCityId: null,
        areaId: null,
        oldCityId: null,
        cityName: null,
        cityPinyin: null,
        provinceId: null,
        provinceName: null,
        provincePinyin: null,
        provinceSimple: null
    },
    getUserArea: function(inputCityId) {
        var url;
        if (inputCityId) url = this.host.www + "Ashx/AjaxHeadArea.ashx?OperType=GetAreaInfo&VarName=areaData&CityId=" + (inputCityId == 0 ? "110100": inputCityId);
        else {
            var cookie = {
                cookieCityId: this.cookies.read("cookieCityId"),
                area: this.cookies.read("area")
            };
            this.userArea.cookieCityId = cookie.cookieCityId ? parseInt(cookie.cookieCityId, 10) : 0,
                this.userArea.cookieArea = cookie.area ? parseInt(cookie.area) : 0,
                this.userArea.areaId = this.userArea.cookieCityId == 0 ? parseInt(this.userArea.cookieArea / 100) * 100 : this.userArea.cookieCityId;
            if (this.userArea.areaId == 0) this.userArea.areaId = 110100;
            url = this.host.www + "Ashx/AjaxHeadArea.ashx?OperType=GetAreaInfo&VarName=areaData&CityId=" + this.userArea.areaId
        }
        this.jsLoad(url,
            function() {
                if (typeof areaData != "undefined") {
                    if (areaData.Status) {
                        autoHeaderObj.userArea.oldCityId = areaData.AreaInfo[0].DealerCityId;
                        autoHeaderObj.userArea.cityName = areaData.AreaInfo[0].CityName;
                        autoHeaderObj.userArea.cityPinyin = areaData.AreaInfo[0].Pinyin;
                        autoHeaderObj.userArea.provinceId = areaData.ProvinceInfo[0].ProvinceId;
                        autoHeaderObj.userArea.provinceName = areaData.ProvinceInfo[0].ProvinceName;
                        autoHeaderObj.userArea.provincePinyin = areaData.ProvinceInfo[0].Pinyin;
                        autoHeaderObj.userArea.provinceSimple = areaData.ProvinceInfo[0].ProvinceSample
                    }
                }
            });
        return false
    },
    getUser: function() {
        var cookieClubUserShow = this.cookies.read('clubUserShow');
        if (cookieClubUserShow == null) {
            this.user.isLogin = false
        } else {
            this.user.isLogin = true;
            this.user.un = cookieClubUserShow.split("|")[3];
            this.user.uid = cookieClubUserShow.split("|")[0];
            this.user.up = cookieClubUserShow.split("|")[2]
        }
        return false
    },
    showUserStatus: function() {
        var html, obj = this.$dom('auto-header-login'),
            that = this;
        if (this.user.isLogin) {
            html = '您好！&nbsp;<a target="_blank" class="orangelink" href="' + this.host.user + '">' + this.user.un + '</a>&nbsp;或&nbsp;<a target="_self" href="javascript:void(0);" onclick="autoHeaderObj.logoff();return false;" class="orangelink">退出</a>';
            if (this.$dom('auto-header-info')) {
                this.$dom('auto-header-info').style.display = ''
            }
            this.getHome();
            if (window.addEventListener) {
                window.addEventListener("focus", startTimer, false);
                window.addEventListener("blur", endTimer, false)
            } else {
                window.attachEvent("onfocus", startTimer, false);
                window.attachEvent("onblur", endTimer, false)
            }
        } else {
            html = '您好！请&nbsp;<a target="_self" class="whitelink" href="' + this.host.login + '">登录</a>&nbsp;或&nbsp;<a target="_self" class="whitelink" href="' + this.host.register + '">注册</a>'
        }
        if (obj) obj.innerHTML = html;
        var timer = null;
        function startTimer() {
            timer && clearTimeout(timer);
            timer = setTimeout(function() {
                    that.getHome();
                    startTimer()
                },
                15000)
        }
        function endTimer() {
            timer && clearTimeout(timer)
        }
    },
    popControl: function(id, that, overStyle, isKillAd) {
        var obj = function(id) {
            return this.init(id)
        };
        obj.prototype = {
            init: function(id) {
                this.li = document.getElementById(id);
                this.list = document.getElementById(id + '-list');
                var _this = this,
                    timer;
                that.eventHandle.add(this.li, 'mouseover',
                    function() {
                        clearTimeout(timer);
                        _this.show()
                    });
                that.eventHandle.add(this.li, 'mouseout',
                    function() {
                        timer = setTimeout(function() {
                                _this.hide()
                            },
                            50)
                    })
            },
            li: null,
            list: null,
            shown: false,
            show: function() {
                this.shown = true;
                this.list.style.display = 'block';
                if (overStyle) {
                    this.li.className = overStyle
                }
                var isie6 = navigator.userAgent.indexOf("MSIE 6.0") > 0;
                if (isKillAd && isie6 && this.li.getElementsByTagName("iframe").length == 0) {
                    var width = this.list.offsetWidth;
                    var height = this.list.offsetHeight;
                    var iframe = document.createElement("iframe");
                    iframe.setAttribute("scrolling", "no");
                    iframe.setAttribute("frameborder", 0);
                    iframe.style.cssText = 'zoom:1;position:absolute;top:0;left:0;filter:alpha(opacity=0);z-index:-1; width:' + width + 'px;height:' + height + 'px';
                    this.list.appendChild(iframe)
                }
            },
            hide: function() {
                this.shown = false;
                this.list.style.display = 'none';
                if (overStyle) {
                    this.li.className = ''
                }
            }
        };
        return document.getElementById(id) ? new obj(id) : null
    },
    popMaskControl: function(id) {
        function setOpacity(elem, value) {
            elem.filters ? elem.style.filter = 'alpha(opacity=' + value + ')': elem.style.opacity = value / 100
        }
        function isFixed() {
            var outer = document.createElement('div'),
                inner = document.createElement('div');
            outer.style.position = 'absolute';
            outer.style.top = '200px';
            inner.style.position = 'fixed';
            inner.style.top = '100px';
            outer.appendChild(inner);
            document.body.appendChild(outer);
            if (inner.getBoundingClientRect && inner.getBoundingClientRect().top == outer.getBoundingClientRect().top) {
                return false
            }
            document.body.removeChild(outer);
            return true
        }
        var pop = document.getElementById(id),
            mask = null,
            header = document.getElementById('auto-header');
        function showMask(callback) {
            mask = document.createElement("div");
            var w = window.innerWidth,
                h = window.innerHeight;
            if (typeof w != "number") {
                if (document.compatMode == "number") {
                    w = document.documentElement.clientWidth;
                    h = document.documentElement.clientHeight
                } else {
                    w = document.body.clientWidth;
                    h = document.body.clientHeight
                }
            }
            mask.style.width = w + 'px';
            mask.style.height = h + 'px';
            mask.style.cssText = 'background:#000;opacity:0.5;filter:alpha(opacity=50);top:0;left:0;z-index:1000;width:' + w + 'px;height:' + h + 'px;position:' + (isFixed() ? 'fixed': 'absolute');
            mask.innerHTML = isFixed() ? '': '<iframe scrolling="no" frameborder="0" style="width:100%;height:100%;filter:alpha(opacity=0);position:absolute;top:0;left:0;z-index:1;"></iframe>';
            if (callback) {
                document.body.appendChild(mask);
                fadeIn(mask);
                callback()
            }
            function fadeIn(elem, speed, opacity) {
                speed = speed || 5;
                opacity = opacity || 50;
                elem.style.display = 'block';
                setOpacity(elem, 0);
                var val = 0; (function() {
                    setOpacity(elem, val);
                    val += 5;
                    if (val <= opacity) {
                        setTimeout(arguments.callee, speed)
                    }
                })()
            }
        }
        function hideMask(callback) {
            fadeOut(mask,
                function() {
                    try {
                        document.body.removeChild(mask)
                    } catch(e) {}
                    if (callback) {
                        callback()
                    }
                });
            function fadeOut(elem, ck) {
                var speed = 5;
                var opacity = 0;
                elem.style.display = 'block';
                setOpacity(elem, 50);
                var val = 50; (function() {
                    setOpacity(elem, val);
                    val -= 5;
                    if (val >= opacity) {
                        setTimeout(arguments.callee, speed)
                    } else {
                        if (ck) ck()
                    }
                })()
            }
        }
        this.show = function(e) {
            e = e || window.event;
            e.cancelBubble = true;
            if (e.stopPropagation) e.stopPropagation();
            if (pop.getAttribute('status') == 'shown') return;
            var _this = this;
            showMask(function() {
                var w = window.innerWidth,
                    h = window.innerHeight;
                if (typeof w != "number") {
                    if (document.compatMode == "number") {
                        w = document.documentElement.clientWidth;
                        h = document.documentElement.clientHeight
                    } else {
                        w = document.body.clientWidth;
                        h = document.body.clientHeight
                    }
                }
                mask.style.width = w + 'px';
                mask.style.height = h + 'px';
                pop.setAttribute('status', 'shown');
                pop.style.position = isFixed() ? 'fixed': 'absolute';
                pop.style.zIndex = '1001';
                pop.style.display = '';
                pop.style.left = (w / 2 - pop.offsetWidth / 2) + 'px';
                if (navigator.userAgent.indexOf("MSIE") < 0) {
                    pop.style.top = (((h - pop.offsetHeight) / 2) + (isFixed() ? 0 : document.body.scrollTop)) + 'px'
                } else {
                    pop.style.top = (((window.screen.availHeight - pop.offsetHeight) / 2) + (isFixed() ? 0 : document.body.scrollTop)) + 'px'
                }
                header.className += ' topbar-helper';
                setTimeout(function() {
                        _this.event.call(_this)
                    },
                    0)
            })
        };
        this.hide = function(e) {
            e = e || window.event;
            e.cancelBubble = true;
            if (e.stopPropagation) e.stopPropagation();
            if (pop.getAttribute('status') != 'shown') return;
            var _this = this;
            hideMask(function() {
                pop.removeAttribute('status');
                pop.style.display = 'none';
                header.className = header.className.replace(' topbar-helper', '');
                setTimeout(function() {
                        _this.event.call(_this)
                    },
                    0)
            })
        };
        this.bind = function(obj, fun) {
            return function() {
                fun.apply(obj, arguments)
            }
        };
        this.eventKeyup = this.bind(this,
            function(e) {
                var that = this;
                e = e || window.event;
                e.keyCode == 27 && that.hide(e)
            });
        this.eventClick = this.bind(this,
            function(e) {
                var that = this;
                e = e || window.event;
                that.hide(e)
            });
        this.eventResize = this.bind(this,
            function() {
                var w = window.innerWidth,
                    h = window.innerHeight;
                if (typeof w != "number") {
                    if (document.compatMode == "number") {
                        w = document.documentElement.clientWidth;
                        h = document.documentElement.clientHeight
                    } else {
                        w = document.body.clientWidth;
                        h = document.body.clientHeight
                    }
                }
                mask.style.width = w + 'px';
                mask.style.height = h + 'px';
                pop.setAttribute('status', 'shown');
                pop.style.position = isFixed() ? 'fixed': 'absolute';
                pop.style.zIndex = '1001';
                pop.style.display = '';
                pop.style.left = (w / 2 - pop.offsetWidth / 2) + 'px';
                if (navigator.userAgent.indexOf("MSIE") < 0) {
                    pop.style.top = (((h - pop.offsetHeight) / 2) + (isFixed() ? 0 : document.body.scrollTop)) + 'px'
                } else {
                    pop.style.top = (((window.screen.availHeight - pop.offsetHeight) / 2) + (isFixed() ? 0 : document.body.scrollTop)) + 'px'
                }
            });
        this.event = function() {
            if (pop.getAttribute('status') == 'shown') {
                autoHeaderObj.eventHandle.add(window, 'resize', this.eventResize);
                autoHeaderObj.eventHandle.add(window, 'keyup', this.eventKeyup);
                autoHeaderObj.eventHandle.add(mask, 'click', this.eventClick)
            } else {
                autoHeaderObj.eventHandle.remove(window, 'resize', this.eventResize);
                autoHeaderObj.eventHandle.add(window, 'keyup', this.eventKeyup);
                autoHeaderObj.eventHandle.remove(mask, 'click', this.eventClick)
            }
        }
    },
    getClub: function(e) {
        e = e || window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
        var that = this,
            popMaskControlObj = new this.popMaskControl('auto-header-clubpop');
        popMaskControlObj.show(e);
        this.$dom('auto-header-clubhide').onclick = function(e) {
            e = e || window.event;
            e.cancelBubble = true;
            if (e.stopPropagation) e.stopPropagation();
            popMaskControlObj.hide(e)
        };
        var tablist = this.$dom('auto-header-clubtab').getElementsByTagName('a');
        for (var i = 0; i < tablist.length; i++) {
            tablist[i].onclick = function() {
                for (var j = 0; j < tablist.length; j++) tablist[j].className = '';
                this.className = 'cur';
                that.$dom('auto-header-clubhtml').innerHTML = '';
                that.jsLoad(this.getAttribute('data-ajax'),
                    function() {
                        that.$dom('auto-header-clubhtml').innerHTML = data.html;
                        executeScript(data.html)
                    });
                return false
            }
        }
        that.jsLoad('http://club.autohome.com.cn/ajax/AllBBS',
            function() {
                that.$dom('auto-header-clubhtml').innerHTML = data.html;
                executeScript(data.html)
            });
        function executeScript(html) {
            var reg = /<script[^>]*>([^\x00]+)$/i;
            var htmlBlock = html.split("<\/script>");
            for (var i = 0; i < htmlBlock.length; i++) {
                var blocks;
                if (blocks = htmlBlock[i].match(reg)) {
                    try {
                        eval(blocks[1])
                    } catch(ex) {}
                }
            }
        }
    },
    getHome: function() {
        this.jsLoad('http://msg.autohome.com.cn/clubalert?callback=autoHeaderObj.getHomeCallback&uid=' + this.user.uid + '&r=' + Math.random());
        return false
    },
    getHomeCallback: function(data) {
        var html, htmlUp = '',
            htmlDown = '';
        if (data.NewReply > 0) htmlUp += '<a target="_blank" href="http://i.autohome.com.cn/receivereply/#pvareaid=101298"><span class="cn">' + (data.NewReply > 99 ? "99+": data.NewReply) + '条新论坛回复</span><span class="ck">查看论坛回复</span></a>';
        else htmlDown += '<a target="_blank" href="http://i.autohome.com.cn/receivereply/#pvareaid=101606">查看论坛回复</a>';
        if (data.commentreply > 0) htmlUp += '<a target="_blank" href="http://i.autohome.com.cn/inbox/#pvareaid=101482"><span class="cn">' + (data.commentreply > 99 ? "99+": data.commentreply) + '条新评论回复</span><span class="ck">查看评论回复</span></a>';
        else htmlDown += '<a target="_blank" href="http://i.autohome.com.cn/inbox/#pvareaid=101607">查看评论回复</a>';
        if (data.NewLetter > 0) htmlUp += '<a target="_blank" href="http://i.autohome.com.cn/club/message/#pvareaid=101300"><span class="cn">' + (data.NewLetter > 99 ? "99+": data.NewLetter) + '条新私信</span><span class="ck">查看私信</span></a>';
        else htmlDown += '<a target="_blank" href="http://i.autohome.com.cn/club/message/#pvareaid=101609">查看私信</a>';
        if (data.NewNotice > 0) htmlUp += '<a target="_blank" href="http://i.autohome.com.cn/club/notice/#pvareaid=101301"><span class="cn">' + (data.NewNotice > 99 ? "99+": data.NewNotice) + '条新通知</span><span class="ck">查看通知</span></a>';
        else htmlDown += '<a target="_blank" href="http://i.autohome.com.cn/club/notice/#pvareaid=101610">查看通知</a>';
        if (data.NewFollowers > 0) htmlUp += '<a target="_blank" href="http://i.autohome.com.cn/club/follower/#pvareaid=101297"><span class="cn">' + (data.NewFollowers > 99 ? "99+": data.NewFollowers) + '个新粉丝</span><span class="ck">查看粉丝</span></a>';
        else htmlDown += '<a target="_blank" href="http://i.autohome.com.cn/club/follower/#pvareaid=101611">查看粉丝</a>';
        if (data.order && data.order != null) {
            if (data.order > 0) htmlUp += '<a target="_blank" href="http://i.autohome.com.cn/orderlist/#pvareaid=101548"><span class="cn">' + (data.order > 99 ? "99+": data.order) + '条新订单</span><span class="ck">查看订单</span></a>'
        } else htmlDown += '<a target="_blank" href="http://i.autohome.com.cn/orderlist/#pvareaid=101612">查看订单</a>';
        if (htmlUp != '' && htmlDown != '') {
            html = htmlUp + '<div class="linedc"></div>' + htmlDown
        } else if (htmlDown == '') {
            html = htmlUp
        } else {
            html = htmlDown
        }
        var allCount = data.NewLetter + data.NewReply + data.NewComment + data.NewNotice + data.NewFollowers + data.commentreply + (data.order && data.order != null ? data.order: 0);
        var allCountObj = this.$dom('auto-header-info-allcount');
        if (allCountObj) {
            if (allCount > 99) {
                allCountObj.innerHTML = '99+';
                allCountObj.style.display = ''
            } else if (allCount == 0) {
                allCountObj.innerHTML = '';
                allCountObj.style.display = 'none'
            } else {
                allCountObj.innerHTML = allCount;
                allCountObj.style.display = ''
            }
            var that = this,
                eventReady = that.$dom('auto-header-info-listdata').getAttribute('eventready');
            that.$dom('auto-header-info-listdata').innerHTML = html;
            if (!eventReady) {
                that.$dom('auto-header-info-listdata').setAttribute('eventready', 1);
                if (window.addEventListener) {
                    that.$dom('auto-header-info-listdata').addEventListener("click",
                        function() {
                            setTimeout(function() {
                                    that.getHome()
                                },
                                500)
                        },
                        false)
                } else {
                    that.$dom('auto-header-info-listdata').attachEvent("onclick",
                        function() {
                            setTimeout(function() {
                                    that.getHome()
                                },
                                500)
                        },
                        false)
                }
            }
        }
    },
    init: function(channel) {
        this.popControl('auto-header-info', this, 'moreli-active', true);
        this.popControl('auto-header-app', this, 'moreli-active', true);
        this.popControl('auto-header-suv', this, '', true);
        this.popControl('auto-header-news', this, '', true);
        this.popControl("auto-header-v", this, "", true);
        if (channel) document.getElementById('auto-header-channel' + channel).className += ' navlink-item-current';
        this.getUserArea();
        this.getUser();
        this.showUserStatus()
    },
    logoff: function() {
        clearInterval(this.timer);
        var that = this;
        this.jsLoad('http://account.autohome.com.cn/login/logoutjson?backvar=autologinout&timestamp=' + Math.random(),
            function() {
                that.$dom('auto-header-info').style.display = 'none';
                for (var i = 0,
                         length = that.logoffFunctionArray.length; i < length; i++) {
                    if (typeof that.logoffFunctionArray[i] == "function") {
                        try {
                            that.logoffFunctionArray[i]()
                        } catch(err) {}
                    }
                }
                that.init();
                if (window.loginoutcallback) {
                    loginoutcallback()
                }
                that.jsLoad('http://account.che168.com/login/logoutjson?backvar=cheloginout&timestamp=' + Math.random())
            })
    },
    __AuthorCallback: null,
    checkAuthor: function(callback) {
        var that = this;
        if (this.__AuthorCallback == null) this.__AuthorCallback = callback;
        if (this.user.isLogin) {
            this.jsLoad('/Authors/IsAuthor?callback=autoHeaderObj.authorcallback&timestamp=' + Math.random())
        } else {}
    },
    authorcallback: function(data) {
        this.__AuthorCallback(data)
    }
};
function readCookie(name, defauleValue) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length))
    };
    return typeof defauleValue != "undefined" ? defauleValue: null
};
function AutohomeJsLoad(args) {
    var s = document.createElement("script");
    s.setAttribute("type", "text/javascript");
    s.setAttribute("src", args.url);
    s.onload = s.onreadystatechange = function() {
        if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
            if (typeof args.callBack == "function") args.callBack(args.args);
            s.onload = s.onreadystatechange = null;
            try {
                s.parentNode && s.parentNode.removeChild(s)
            } catch(e) {}
        }
    };
    document.getElementsByTagName("head")[0].appendChild(s)
};