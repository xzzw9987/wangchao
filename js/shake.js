var SHAKE_THRESHOLD = 2000;
var last_update = 0;
var x = 0, y = 0, z = 0, last_x = 0, last_y = 0, last_z = 0;
var watchId;
var l = [];
if (window.DeviceMotionEvent) {// 判断设备标准javascript是否支持加速度API
    window.addEventListener('devicemotion', deviceMotionHandler, false);
} else { // 如果不支持则判断是否扩展该功能(这个是cordova的扩展方法，其他扩展可以自己再加判断)
    alert('您的手机不支持"摇一摇"功能');
}

function deviceMotionHandler(eventData) {
    var acceleration = eventData.accelerationIncludingGravity || eventData;
    var curTime = new Date().getTime();
    if ((curTime - last_update) > 100) {
        var diffTime = curTime - last_update;
        last_update = curTime;
        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;
        var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
        if (speed > SHAKE_THRESHOLD) {// 抛出shake事件到window
            l.forEach(f=>f());
        }
        last_x = x;
        last_y = y;
        last_z = z;
    }
}

module.exports = function (f) {
    if (!window.DeviceMotionEvent) {
        alert('您的手机不支持"摇一摇"功能');
        return;
    }
    l.push(f);
};