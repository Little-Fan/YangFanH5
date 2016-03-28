/**
 * Created by fanxiaolong on 2016/3/14.
 */
$(document).ready(function (e) {
    var isLoad = false;  //是否是首次加载
    var id = getQueryVariable("id");
    var type = getQueryVariable("type");
    var PhysicalContentID = getQueryVariable("PhysicalContentID");
    var d1 = $.ajax({
        method: "GET",
        url:    '../templates/channel/layout.hbs'
    }).done(function (data1) {
        $('body').html(data1);

        $.ajax({
            method:   "GET",
            url:      baseURL + 'services/getAccessUrl',
            dataType: 'json',
            data:     {
                PhysicalContentID: PhysicalContentID,
                ContentType:       type,
                Domain:            0
            }
        }).done(function (data) {
            $('video').attr('src', data.AccessUrl);
        });

        $('.nav-tabs li').click(function (e) {
            var index = $(this).index();
            if (index < 2) {
                $(this).addClass('active').siblings().removeClass('active');
                $('.main').children().hide().eq(index).show();
                if(!isLoad){
                    isLoad = true;
                    getComment($('#comment-wrapper'), 3, 1);
                }
            }
        });

        $.ajax({
            method: "GET",
            url:    '../templates/channel/date-item.hbs'
        }).done(function (data) {
            var template = Handlebars.compile(data);
            var context = [
                {
                    'name': '今天',
                    'date': moment().format("YYYYMMDD")
                },
                {
                    'name': '昨天',
                    'date': moment().subtract(1, 'days').format("YYYYMMDD")
                },
                {
                    'name': '前天',
                    'date': moment().subtract(2, 'days').format("YYYYMMDD")
                },
                {
                    'name': moment().subtract(3, 'days').format("MM-DD"),
                    'date': moment().subtract(3, 'days').format("YYYYMMDD")
                },
                {
                    'name': moment().subtract(4, 'days').format("MM-DD"),
                    'date': moment().subtract(4, 'days').format("YYYYMMDD")
                },
                {
                    'name': moment().subtract(5, 'days').format("MM-DD"),
                    'date': moment().subtract(5, 'days').format("YYYYMMDD")
                },
                {
                    'name': moment().subtract(6, 'days').format("MM-DD"),
                    'date': moment().subtract(6, 'days').format("YYYYMMDD")
                }
            ];
            var html = template(context);

            $('.tabs-nav').html(html);
            $('.tabs-nav li').click(function (e) {

                $(this).addClass('active').siblings().removeClass('active');

                var channelList = $('.channel-list').html('<p>数据加载中……</p>');
                var date = $(this).data('date');

                var d2 = $.ajax({
                    method: "GET",
                    url:    '../templates/channel/program-item.hbs'
                });

                var d3 = $.ajax({
                    method:   "GET",
                    url:      baseURL + 'channels/scheduleList',
                    dataType: 'json',
                    data:     {
                        ChannelID:  id,
                        Date:       date,
                        ResultType: 1
                    }
                });

                $.when(d2, d3).done(function (data1, data2) {
                    var template = Handlebars.compile(data1[0]);
                    var context = data2[0];
                    var html = template(context);
                    channelList.html(html);
                    var nowPlay = $('#play');
                    if (nowPlay.length) {
                        var top = nowPlay.position().top;
                        if (top > 0){
                            $("#tabs_container").scrollTop(top);
                        }
                    }
                });
            });
            $('.tabs-nav .active').trigger('click');
        });
    });
});