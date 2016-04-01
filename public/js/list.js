/**
 * Created by fanxiaolong on 2016/3/14.
 */
$(document).ready(function () {
    var id = getQueryVariable('id');
    $.ajax({
        method: 'GET',
        url: '../templates/list/layout.hbs'
    }).done(function (data1) {
        $('#body-list').html(data1);

        var pagesize = 4;  //分页大小
        var pageindex = 0;  //分页页码

        var d2 = $.ajax({
            method: 'GET',
            url: '../templates/list/list-item.hbs'
        });

        $('.more').click(function (e) {
            var d3 = $.ajax({
                method: 'GET',
                url: baseURL + 'contents/contentlist',
                dataType: 'json',
                data: {
                    CategoryID: id,
                    pagesize: pagesize,
                    pageindex: pageindex
                }
            });
            $.when(d2, d3).done(function (data1, data2) {
                var template = Handlebars.compile(data1[0]);
                var context = data2[0];
                var html = template(context);
                $('.list').children('p').remove();
                pageindex = Math.ceil($('.list').append(html).find('li').length / pagesize);
                if (pageindex > data2[0].PageCount) {
                    $(e.currentTarget).find('a').text('数据加载完成');
                    $(e.currentTarget).off();  //t
                }
            });
        }).trigger('click');
    });
});