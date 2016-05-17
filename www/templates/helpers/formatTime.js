/**
 * Created by fanxiaolong on 2016/5/17.
 */
define(["handlebars", 'moment'], function(Handlebars, moment) {
    Handlebars.registerHelper('formatTime', function (time, type) {
        if (type) {
            return moment.unix(time).format(type);
        }
    });
});