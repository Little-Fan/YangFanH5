/**
 * Created by fanxiaolong on 2016/5/16.
 */
define(["handlebars"], function (Handlebars) {
    Handlebars.registerHelper('replace', function (stringObject) {
        return stringObject.replace(/\:/g, '');
    });
});