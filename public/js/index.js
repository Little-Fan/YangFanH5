/**
 * Created by fanxiaolong on 2016/3/14.
 */
$(document).ready(function () {
    var opts = {
        lines: 17, // The number of lines to draw
        length: 0, // The length of each line
        width: 3, // The line thickness
        radius: 20, // The radius of the inner circle
        scale: 2, // Scales overall size of the spinner
        corners: 1, // Corner roundness (0..1)
        color: '#000', // #rgb or #rrggbb or array of colors
        opacity: 0.25, // Opacity of the lines
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        className: 'spinner', // The CSS class to assign to the spinner
        top: '50%', // Top position relative to parent
        left: '50%', // Left position relative to parent
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        position: 'absolute' // Element positioning
    };
    var target = $('#body-index')[0];  //获取DOM对象
    new Spinner(opts).spin(target);  //loading加载动画

    var type = getQueryVariable('type');
    var id = getQueryVariable('id');

    var d1 = $.ajax({
        method: 'GET',
        url:    '../templates/index/layout.hbs'
    });

    var d2 = $.ajax({
        method:   'GET',
        url:      baseURL + 'contents/homecategorys',
        dataType: 'json'
    });

    $.when(d1, d2).done(function (data1, data2) {
        var template = Handlebars.compile(data1[0]);

        var context = data2[0];
        context.type = type;

        var html = template(context);

        $('#body-index').html(html);

        var categoryData = $.ajax({
            method:   'GET',
            url:      baseURL + 'contents/categorys',
            dataType: 'json',
            data:     {
                ParentID: id
            }
        });

        $.ajax({
            method: 'GET',
            url:    '../templates/common/common-load.hbs'
        }).done(function (data) {

            $('.content').html(data);

            if (type === 'live') {
                var d1 = $.ajax({
                    method: 'GET',
                    url:    '../templates/index/live-layout.hbs'
                });
                var d2 = $.ajax({
                    method: 'GET',
                    url:    '../templates/index/categorys-item.hbs'
                });

                $.when(d1, d2, categoryData).done(function (data1, data2, data3) {

                    $('.content').html(data1[0]);
                    var template = Handlebars.compile(data2[0]);
                    var context = data3[0];
                    var html = template(context);
                    $('.sub-nav').html(html);

                    var id = [];

                    var contentList = [];

                    $('.sub-nav li').each(function (index, element) {
                        id.push($(element).data('id'));
                    });

                    var d5 = $.ajax({
                        method:   'GET',
                        url:      baseURL + 'contents/contentlist',
                        dataType: 'json',
                        data:     {
                            CategoryID: id[0]
                        }
                    });

                    var d6 = $.ajax({
                        method:   'GET',
                        url:      baseURL + 'contents/contentlist',
                        dataType: 'json',
                        data:     {
                            CategoryID: id[1]
                        }
                    });

                    var d7 = $.ajax({
                        method: 'GET',
                        url:    '../templates/index/live-item.hbs'
                    });

                    $.when(d5, d6, d7).done(function (data5, data6, data7) {
                        contentList.push(data5[0]);
                        contentList.push(data6[0]);

                        var template = Handlebars.compile(data7[0]);
                        var html = template(contentList);

                        $('.main').html(html);
                    });
                });
            } else {
                var list = $.ajax({
                    method: 'GET',
                    url:    '../templates/index/list-layout.hbs'
                });

                $.when(list, categoryData).done(function (data1, data2) {
                    var template = Handlebars.compile(data1[0]);
                    var content = data2[0];
                    content.type = type;
                    var html = template(content);
                    $('.content').html(html);

                    var listItem = $.ajax({
                        method: 'GET',
                        url:    '../templates/index/list-item.hbs'
                    });

                    $('.list-group h2').each(function (index, element) {
                        var id = $(element).data('id');

                        var contentList = $.ajax({
                            method:   'GET',
                            url:      baseURL + 'contents/contentlist',
                            dataType: 'json',
                            data:     {
                                CategoryID: id
                            }
                        });

                        $.when(listItem, contentList).done(function (data1, data2) {
                            var template = Handlebars.compile(data1[0]);
                            data2[0].type = type;
                            if (type === 'Series' && data2[0].Contents.Content.length > 4) {
                                data2[0].Contents.Content = data2[0].Contents.Content.slice(0, 4);
                                $('.list-more').text('更多');
                            }
                            var html = template(data2[0]);
                            $(element).next('.list').html(html);
                        });
                    });
                });
            }
        });
    });
});
