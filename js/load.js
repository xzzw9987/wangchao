var ready;
var loadTimeout = null;
var maxHeight = 50;
$(window).on('load', function () {
    clearTimeout(loadTimeout);
    $('.load-fore').height(maxHeight);
    $('.percent').text('100%');
    ready && ready();
});

function load(t) {
    if (t < 100) {
        $('.load-fore').height(maxHeight * t / 100);
        $('.percent').text(t + '%');
        loadTimeout = setTimeout(function () {
            load(t + 3);
        }, 100);
    }
}

setTimeout(function () {
    load(0);
}, 5000);

module.exports = function (d) {
    ready = d;
};