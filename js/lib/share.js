/*
Append File:/as/js-2.0.5/share.js
*/
define("share", ["jquery"], function(e, r, n) {
    "use strict";
    var i = e("jquery"), t = function(e, r) {
        var n = this;
        n.$elem = i(e), n.$weixin = i(".share-weixin", n.$elem), n.$weibo = i(".share-weibo", n.$elem), n.$qzone = i(".share-qzone", n.$elem), n.$friend = i(".share-friend", n.$elem), n.$qq = i(".share-qq", n.$elem), n.options = r, n.init()
    };
    t.prototype = {constructor: t,init: function() {
            var e = this;
            e.$weixin.click(function(r) {
                e.$elem.trigger("weixin.share"), bShare.share(r.originalEvent, "weixin", 0);
                var n = i("#bsWXBox"), t = i(".bsTop span", n);
                return t.eq(0).html("扫描分享到微信好友或微信朋友圈"), t.eq(0).css("marginLeft", 8), t.eq(1).html(""), !1
            }), e.$weibo.click(function(r) {
                return e.$elem.trigger("weibo.share"), bShare.share(r.originalEvent, "sinaminiblog", 0), !1
            }), e.$qzone.click(function(r) {
                return e.$elem.trigger("qzone.share"), bShare.share(r.originalEvent, "qzone", 0), !1
            }), e.$friend.click(function(r) {
                e.$elem.trigger("friend.share"), bShare.share(r.originalEvent, "weixin", 0);
                var n = i("#bsWXBox"), t = i(".bsTop span", n);
                return t.eq(0).html("扫描分享到微信好友或微信朋友圈"), t.eq(0).css("marginLeft", 8), t.eq(1).html(""), !1
            }), e.$qq.click(function(r) {
                return e.$elem.trigger("qq.share"), bShare.share(r.originalEvent, "qqim", 0), !1
            }), i(document).click(function(e) {
                0 == i(e.target).closest("#bsWXBox").length && i("#bsWXBox").hide()
            })
        }}, i.fn.share = function(e) {
        return this.each(function() {
            var r = i(this), n = r.data("share"), a = i.extend({}, i.fn.share.defaults, r.data(), "object" == typeof e && e);
            n || r.data("share", n = new t(this, a)), "string" == typeof e ? n[e]() : a.show && n.show()
        })
    }, i.fn.share.Constructor = t, i.fn.share.defaults = {}, n.exports = i
});
