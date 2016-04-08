/**
 * Created by fanxiaolong on 2016/3/14.
 */
$(document).ready(function () {

    var id = getQueryVariable('id');
    var type = getQueryVariable('type');

    var d1 = $.ajax({
        method: 'GET',
        url:      '../templates/program/layout.hbs'
    });

    var d2 = $.ajax({
        method:   'GET',
        url:      baseURL + 'contents/detail',
        dataType: 'json',
        data:     {
            ContentID: id
        }
    });

    $.when(d1, d2).done(function (data1,data2) {

        var template = Handlebars.compile(data1[0]);

        if (data2[0] && data2[0].Content && data2[0].Content.RelateContents && data2[0].Content.RelateContents.Content && data2[0].Content.RelateContents.Content.length > 2) {
            data2[0].Content.RelateContents.Content = data2[0].Content.RelateContents.Content.slice(0, 2);
        }

        var context = data2[0];
        var html= template(context);
        $('body').html(html);

        $.ajax({
            method:   'GET',
            url:      baseURL + 'services/getAccessUrl',
            dataType: 'json',
            data:     {
                PhysicalContentID: context.Content.Program.Movies.Movie[0].PhysicalContentID,
                ContentType: type,
                Domain: 0
            }
        }).done(function (data) {
            $('video').attr('src',data.AccessUrl);
        });
        getComment($('#comment-wrapper'), 3, 1);
    });
});