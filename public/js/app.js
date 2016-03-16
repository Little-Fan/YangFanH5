/**
 * Created by fanxiaolong on 2016/3/14.
 */
$(document).ready(function (e) {

    var opts = {
        lines: 13 // The number of lines to draw
        , length: 28 // The length of each line
        , width: 14 // The line thickness
        , radius: 42 // The radius of the inner circle
        , scale: 1 // Scales overall size of the spinner
        , corners: 1 // Corner roundness (0..1)
        , color: '#000' // #rgb or #rrggbb or array of colors
        , opacity: 0.25 // Opacity of the lines
        , rotate: 0 // The rotation offset
        , direction: 1 // 1: clockwise, -1: counterclockwise
        , speed: 1 // Rounds per second
        , trail: 60 // Afterglow percentage
        , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        , zIndex: 2e9 // The z-index (defaults to 2000000000)
        , className: 'spinner' // The CSS class to assign to the spinner
        , top: '50%' // Top position relative to parent
        , left: '50%' // Left position relative to parent
        , shadow: false // Whether to render a shadow
        , hwaccel: false // Whether to use hardware acceleration
        , position: 'absolute' // Element positioning
    };

    var target = $('#body')[0];  //获取DOM对象
    var spinner = new Spinner(opts).spin(target);  //loading加载动画

    var d1 = $.ajax({
        method: "GET",
        url:      '../templates/layout.hbs'
    });

    var d2 = $.ajax({
        method: "GET",
        url:      'http://ceshi2.chinacloudapp.cn:8080/rest/rest/contents/homecategorys',
        dataType: 'json'
    });
    
    $.when(d1, d2).done(function (data1, data2) {
        var template = Handlebars.compile(data1[0]);
        var context = data2[0];
        var html= template(context);
        $('#body').html(html);

        var id = $('.nav-bar .active').data('id');  //这个id用于获取子分类

        /* 子分类模板 */
        var d3 = $.ajax({
            method: "GET",
            url:      '../templates/categorys-item.hbs'
        });

        /* 子分类接口 */
        var d4 = $.ajax({
            method: "GET",
            url:      'http://ceshi2.chinacloudapp.cn:8080/rest/rest/contents/categorys',
            dataType: 'json',
            data: {
                ParentID: id
            }
        });

        $.when(d3, d4).done(function (data3, data4) {
            var template = Handlebars.compile(data3[0]);
            var context = data4[0];
            var html= template(context);
            $('.sub-nav').html(html);


            var id =[];

            var contentList = [];

            $('.sub-nav li').each(function (index, element) {
                id.push($(element).data('id'));
            });

            var d5 = $.ajax({
                method:   "GET",
                url:      'http://ceshi2.chinacloudapp.cn:8080/rest/rest/contents/contentlist',
                dataType: 'json',
                data:     {
                    CategoryID: id[0]
                }
            });

            var d6 = $.ajax({
                method:   "GET",
                url:      'http://ceshi2.chinacloudapp.cn:8080/rest/rest/contents/contentlist',
                dataType: 'json',
                data:     {
                    CategoryID: id[1]
                }
            });

            var d7 = $.ajax({
                method: "GET",
                url:      '../templates/live-item.hbs'
            });

            $.when(d5, d6, d7).done(function (data5, data6, data7) {

                contentList.push(data5[0]);
                contentList.push(data6[0]);
                var template = Handlebars.compile(data7[0]);
                var html= template(contentList);

                $('.main').html(html);

            })



        })




    })






});