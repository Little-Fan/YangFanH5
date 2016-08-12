/**
 * Created by fanxiaolong on 2016/5/16.
 */
define(["handlebars"], function (Handlebars) {
    Handlebars.registerHelper('subString', function (stringObject, start, length) {
        return stringObject.substring(start, length);
    });
});