/**
 * Created by fanxiaolong on 2016/5/17.
 */
define(["handlebars"], function (Handlebars) {
    Handlebars.registerHelper('praiseMark', function (conditional, options) {
        conditional = Number(conditional);
        if (conditional) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
});