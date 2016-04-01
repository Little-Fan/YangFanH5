/**
 * Created by fanxiaolong on 2016/3/22.
 */
$(document).ready(function () {
    
    var id = getQueryVariable('id');
    
    var d1 = $.ajax({
        method: 'GET',
        url:      '../templates/program-list/layout.hbs'
    });

    var d2 = $.ajax({
        method:   'GET',
        url:      baseURL + 'contents/detail',
        dataType: 'json',
        data:     {
            ContentID: id
        }
    });

    $.when(d1, d2).done(function (data1, data2) {


        var template = Handlebars.compile(data1[0]);
        var context = data2[0];
        var html= template(context);

        $('#body-program-list').html(html);
    });
});