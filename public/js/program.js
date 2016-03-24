/**
 * Created by fanxiaolong on 2016/3/14.
 */
$(document).ready(function (e) {

    var id = getQueryVariable("id");

    var d1 = $.ajax({
        method: "GET",
        url:      '../templates/program/layout.hbs'
    });

    var d2 = $.ajax({
        method:   "GET",
        url:      baseURL + 'contents/detail',
        dataType: 'json',
        data:     {
            ContentID: id
        }
    });

    $.when(d1, d2).done(function (data1,data2) {

        var template = Handlebars.compile(data1[0]);
        var context = data2[0];
        var html= template(context);
        $('body').html(html);


        var pagesize = 5;  //分页大小
        var pageindex = 1;  //分页页码

        var d5 = $.ajax({
            method: "GET",
            url:      '../templates/channel/comment-item.hbs'
        });

        var d6 = $.ajax({
            method:   "GET",
            url:      baseURL + 'contents/getcomments',
            dataType: 'json',
            data:     {
                Model: 1,
                ContentID: id,
                pagesize: pagesize,
                pageindex: pageindex
            }
        });
        $.when(d5, d6).done(function (data1, data2) {
            var template = Handlebars.compile(data1[0]);
            var context = data2[0];
            var html= template(context);
            pageindex = $('.comment-list').append(html).find('li').length/pagesize;
            if (pageindex >= data2[0].PageCount){
                $(e.currentTarget).find('a').text('数据加载完成');
                $(e.currentTarget).off();
            }
        })
    });
});