/**
 * Created by fanxiaolong on 2016/5/16.
 */
define(["handlebars"], function(Handlebars) {
    Handlebars.registerHelper('isNowPlay', function (value, options) {
        if (Number(value) === 2) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
});
