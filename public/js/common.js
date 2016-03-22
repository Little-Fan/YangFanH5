window.baseURL =  'http://42.159.246.214:8080/rest/rest/'; //接口基准位置

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {return pair[1];}
    }
    return false;
}

Handlebars.registerHelper('praiseMark', function(conditional, options) {

    conditional = Number(conditional);

    if(conditional) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('contentType', function(type, options) {
    console.log(type);
    if (type == "Program") {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});