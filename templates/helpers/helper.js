define(["hbs/handlebars"], function (Handlebars) {
    Handlebars.registerHelper('subString', function (stringObject, start, length) {
        return stringObject.substring(start, length);
    });

    Handlebars.registerHelper('praiseMark', function (conditional, options) {
        conditional = Number(conditional);
        if (conditional) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    Handlebars.registerHelper('contentType', function (type, options) {
        if (type === 'Program') {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    Handlebars.registerHelper('isNowPlay', function (value, options) {
        if (Number(value) === 2) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    Handlebars.registerHelper('isVideo', function (value, options) {
        value = value.substr(-2);
        if (value === '频道') {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    Handlebars.registerHelper('equality', function (v1, v2, options) {
        if (v1 === v2) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    Handlebars.registerHelper('formatTime', function (time, type) {
        if (type) {
            return moment.unix(time).format(type);
        }
    });

    Handlebars.registerHelper('isTimeout', function (time, options) {

        var timestamp = Number(moment().unix());

        if (timestamp - Number(time) > 0) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    Handlebars.registerHelper('replace', function (stringObject) {
        return stringObject.replace(/\:/g, '');
    });

    return Handlebars;
});