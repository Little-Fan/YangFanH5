/**
 * Created by fanxiaolong on 2016/5/12.
 */
define(["handlebars", 'moment'], function(Handlebars, moment) {
    function isTimeout(time, options) {
        var timestamp = Number(moment().unix());
        if (timestamp - Number(time) > 0) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    }
    Handlebars.registerHelper('isTimeout', isTimeout);
    return isTimeout;
});
