/**
 * Created by fanxiaolong on 2016/3/14.
 */
$(document).ready(function (e) {
    var id = getQueryVariable("id");
    var d1 = $.ajax({
        method: "GET",
        url:      '../templates/channel/layout.hbs'
    }).done(function (data1) {
        $('body').html(data1);
        var isLoad = false;  //是否是首次加载
        $('.nav-tabs li').click(function (e) {
            var index = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');
            $('.main').children().hide().eq(index).show();
            if (index == 1 && !isLoad) {
                var pagesize = 5;  //分页大小
                var pageindex = 1;  //分页页码
                var d1 = $.ajax({
                    method: "GET",
                    url:      '../templates/channel/comment-item.hbs'
                });

                $('.more').click(function (e) {
                    var d2 = $.ajax({
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
                    $.when(d1, d2).done(function (data1, data2) {
                        var template = Handlebars.compile(data1[0]);
                        var context = data2[0];
                        var html= template(context);
                        pageindex = $('.comment-list').append(html).find('li').length/pagesize;
                        isLoad = true;
                        if (pageindex >= data2[0].PageCount){
                            $(e.currentTarget).find('a').text('数据加载完成');
                            $(e.currentTarget).off();
                        }
                    })
                }).trigger('click');
            }
        });
        $.ajax({
            method: "GET",
            url:      '../templates/channel/date-item.hbs'
        }).done(
            function (data) {
            var template = Handlebars.compile(data);
            var context = [
                {
                    'name': '今天',
                    'date': moment().format("YYYYMMDD")
                },
                {
                    'name': '昨天',
                    'date': moment().day(0).format("YYYYMMDD")
                },
                {
                    'name': '前天',
                    'date': moment().day(-1).format("YYYYMMDD")
                },
                {
                    'name': moment().day(-2).format("MM-DD"),
                    'date': moment().day(-2).format("YYYYMMDD")
                },
                {
                    'name': moment().day(-3).format("MM-DD"),
                    'date': moment().day(-3).format("YYYYMMDD")
                },
                {
                    'name': moment().day(-4).format("MM-DD"),
                    'date': moment().day(-4).format("YYYYMMDD")
                },
                {
                    'name': moment().day(-5).format("MM-DD"),
                    'date': moment().day(-5).format("YYYYMMDD")
                }
            ];
            var html= template(context);
            $('.tabs-nav').html(html);
            $('.tabs-nav li').click(function (e) {

                $(this).addClass('active').siblings().removeClass('active');


                var channelList = $('.channel-list').html('<p>数据加载中……</p>');
                var date = $(this).data('date');


                var d2 = $.ajax({
                    method: "GET",
                    url:      '../templates/channel/program-item.hbs'
                });

                var d3 = $.ajax({
                    method: "GET",
                    url:      baseURL + 'channels/scheduleList',
                    dataType: 'json',
                    data: {
                        ChannelID: id,
                        Date: date,
                        ResultType: 1
                    }
                });

                $.when(d2, d3).done(function (data1, data2) {
                    var template = Handlebars.compile(data1[0]);
                    var context = data2[0];
                    var html= template(context);
                    channelList.html(html);
                })
            });
            $('.tabs-nav .active').trigger('click');
        });
    });
});