module.exports = function () {
    var query = parse(location.search.substring(1));
    var appid = 'wx682926e9be5cf5c5';
    if (!query['openid'] || !query['access_token'])
        location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='
            + appid
            + '&redirect_uri='
                // @todo change url here
            + 'http://wx.wine-dynasty.com/mjcq/proxy.html?url=' + encodeURIComponent(location.href)
            + '&response_type=code&scope=snsapi_userinfo&state=0#wechat_redirect';

    function parse(s) {
        if (!s)
            return {};
        var o = {};
        s.split('&').forEach(function (el) {
            o[el.split('=')[0]] = el.split('=')[1];
        });
        return o;
    }
};