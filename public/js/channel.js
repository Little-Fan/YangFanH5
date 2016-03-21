/**
 * Created by fanxiaolong on 2016/3/14.
 */
$(document).ready(function (e) {

    var baseURL = 'http://ceshi2.chinacloudapp.cn:8080/rest/rest/'; //接口基准位置
    var id = location.search.substr(1);

    var d1 = $.ajax({
        method: "GET",
        url:      '../templates/channel/layout.hbs'
    }).done(function (data1) {
        $('#body-channel').html(data1);

        $('.nav-tabs li').click(function (e) {
            var index = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');
            $('.main').children().hide().eq(index).show();
        });
        
        $.ajax({
            method: "GET",
            url:      '../templates/channel/date-item.hbs'
        }).done(function (data) {
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