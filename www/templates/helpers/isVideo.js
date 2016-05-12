/**
 * Created by fanxiaolong on 2016/5/12.
 */

define(["handlebars"], function(Handlebars) {
    function isVideo(value, options) {
        value = value.substr(-2);
        return value === '频道' ? options.fn(this) : options.inverse(this);
    }

    Handlebars.registerHelper('isVideo', isVideo);

    return isVideo;
});
