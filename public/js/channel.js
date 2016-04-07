/**
 * Created by fanxiaolong on 2016/3/14.
 */
'use strict';

$(document).ready(function () {
    var isLoad = false;  //是否是首次加载
    var id = getQueryVariable('id');
    var type = getQueryVariable('type');
    var PhysicalContentID = getQueryVariable('PhysicalContentID');
    var mode = getQueryVariable('mode');
    var playURL = '';
    $.ajax({
        method: 'GET',
        url:    '../templates/channel/layout.hbs'
    }).done(function (data1) {
        $('body').html(data1);

        var channelType = $.ajax({
            method: 'GET',
            url: '../templates/channel/channel-type.hbs'
        });

        var getAccessUrl = $.ajax({
            method: 'GET',
            url: baseURL + 'services/getAccessUrl',
            dataType: 'json',
            data: {
                PhysicalContentID: PhysicalContentID,
                ContentType: type,
                Domain: 0
            }
        });

        $.when(channelType, getAccessUrl).done(function (data1, data2) {
            var template = Handlebars.compile(data1[0]);
            var context = data2[0];
            context.video = mode;
            var html = template(context);
            $('#media-wrapper').html(html);

            $('.audio-wrapper').click(function () {

                var audio = $('#audio'), isPaused = audio.prop('paused');

                if(isPaused){
                    $('#audio')[0].play();
                } else {
                    $('#audio')[0].pause();
                }
                
            });

        });

        $('.nav-tabs li').click(function () {
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
            method: 'GET',
            url:    '../templates/channel/date-item.hbs'
        }).done(function (data) {
            var template = Handlebars.compile(data);
            var context = [
                {
                    'name': '今天',
                    'date': moment().format('YYYYMMDD')
                },
                {
                    'name': '昨天',
                    'date': moment().subtract(1, 'days').format('YYYYMMDD')
                },
                {
                    'name': '前天',
                    'date': moment().subtract(2, 'days').format('YYYYMMDD')
                },
                {
                    'name': moment().subtract(3, 'days').format('MM-DD'),
                    'date': moment().subtract(3, 'days').format('YYYYMMDD')
                },
                {
                    'name': moment().subtract(4, 'days').format('MM-DD'),
                    'date': moment().subtract(4, 'days').format('YYYYMMDD')
                },
                {
                    'name': moment().subtract(5, 'days').format('MM-DD'),
                    'date': moment().subtract(5, 'days').format('YYYYMMDD')
                },
                {
                    'name': moment().subtract(6, 'days').format('MM-DD'),
                    'date': moment().subtract(6, 'days').format('YYYYMMDD')
                }
            ];
            var html = template(context);

            $('.tabs-nav').html(html);
            $('.tabs-nav li').click(function () {

                $(this).addClass('active').siblings().removeClass('active');

                var channelList = $('.channel-list').html('<p>数据加载中……</p>');
                var date = $(this).data('date');

                var d2 = $.ajax({
                    method: 'GET',
                    url:    '../templates/channel/program-item.hbs'
                });

                var d3 = $.ajax({
                    method:   'GET',
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
                            $('#tabs_container').scrollTop(top);
                        }
                    }
                });
            });
            $('.tabs-nav .active').trigger('click');

            $(document).on('click', '#replay', function () {
                var startTime= $(this).data('date');
                var duration = $(this).data('duration');
                var h = Number(duration.substr(0,2));
                var m = Number(duration.substr(2,2));
                var s = Number(duration.substr(4,2));
                var length = (h * 60 + m) * 60 + s;

                if(playURL.length>0){
                    var replayURL = playURL.replace('live','review');
                }
                replayURL = replayURL + '?starttime=' + startTime + '&length=' + length;
                $('video').attr('src', replayURL);
            });
        });
    });
});