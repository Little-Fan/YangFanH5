/**
 * Created by fanxiaolong on 2016/5/12.
 */
define(["handlebars"], function(Handlebars) {
    function contentType(type, options) {
        return type === 'Program' ? options.fn(this) : options.inverse(this);
    }

    Handlebars.registerHelper('contentType', contentType);

    return contentType;
});