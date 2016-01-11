module.exports = function (s) {
    if (!s)
        return {};
    var o = {};
    s.split('&').forEach(function (el) {
        o[el.split('=')[0]] = el.split('=')[1];
    });
    return o;
};