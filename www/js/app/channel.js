/**
 * Created by fanxiaolong on 2016/3/14.
 */
'use strict';
define([
    '../common',
    'moment',
    './main',
    'hbs!templates/channel/layout',
    'hbs!templates/channel/channel-type',
    'hbs!templates/channel/date-item',
    'hbs!templates/channel/program-item',
    'circle.player'
], function (common, moment, main, layoutTemplate, channelTypeTemplate, dateItemTemplate, programItemTemplate) {
    var isLoad = false,  //是否是首次加载
        id = common.getQueryVariable('id'),
        type = common.getQueryVariable('type'),
        PhysicalContentID = common.getQueryVariable('PhysicalContentID'),
        mode = common.getQueryVariable('mode'),
        title = decodeURI(common.getQueryVariable('title')),
        scheduleList = {},  //缓存接口单列表数据
        playURL = '',
        myCirclePlayer,
        dateMap;

    $('title').text(title);  //增加APP上需要的title
    common.loading('#body-channel');

    $('#body-channel').html(layoutTemplate).find('.main').height($(window).height() - 280);  //在不支持calc属性的浏览器

    $.ajax({
        method: 'GET',
        url: common.baseURL + 'services/getAccessUrl',
        data: {
            PhysicalContentID: PhysicalContentID,
            ContentType: type,
            Domain: 0
        }
    }).done(function (data) {
        data.video = mode;  //模板中需要的字段，用来判断是否是视频
        playURL = data.AccessUrl;
        common.setVideoCookie(playURL);
        data.$el = $('#media-wrapper').html(channelTypeTemplate(data));

        //播放器实例化
        myCirclePlayer = new CirclePlayer("#jquery_jplayer_1",
            {
                m3u8a: playURL
            }, {
                solution: "html,flash",
                supplied: 'm4a, m3u8a',
                swfPath: "../circleplayer/dist/jplayer/jquery.jplayer.swf",
                cssSelectorAncestor: "#cp_container_1"
            });
    });

    //切换节目单
    $('.nav-tabs li').click(function () {
        var index = $(this).index();
        if (index < 2) {
            $(this).addClass('active').siblings().removeClass('active');
            $('.main').children().hide().eq(index).show();
            if(!isLoad){
                isLoad = true;
                main.renderComment(id, '#comment-wrapper', '#more-comment', 3, 1);  //拉取评论列表
            }
        }
    });

    dateMap = [
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




    //获取节目单列表接口
    function getScheduleList(date) {
        return $.ajax({
            method: 'GET',
            url: common.baseURL + 'channels/scheduleList',
            data: {
                ChannelID: id,
                Date: date,
                ResultType: 1
            }
        })
    }

    //渲染选择播放日期列表，并添加节目单日期事件
    $('.tabs-nav').html(dateItemTemplate(dateMap)).find('li').click(function (e) {
        var date = $(this).data('date'),
            channelList = $('.channel-list').html('<p>数据加载中……</p>');
        $(this).addClass('active').siblings().removeClass('active');
        if(common.isNil(scheduleList[date])){
            getScheduleList(date).done(function (data) {
                scheduleList[date] = data;
                channelList.html(programItemTemplate(data));
            })
        } else {
            channelList.html(programItemTemplate(scheduleList[date]));
        }

        //页面进入时，滚动条滚动到正在播放的位置
        var nowPlay = $('.play'),
            tab = $('#tabs_container');

        tab.scrollTop(0);  //重置为0的位置

        if (nowPlay.length >= 1) {
            var top = nowPlay.position().top;
            tab.scrollTop(top);
        }
    });

    $('.tabs-nav .active').trigger('click');

    $('#tabs_container').on('click', '.replay', function () {
        var startTime= $(this).data('date');
        var duration = $(this).data('duration');
        var h = Number(duration.substr(0,2));
        var m = Number(duration.substr(2,2));
        var s = Number(duration.substr(4,2));
        var length = (h * 60 + m) * 60 + s;

        if ($(this).hasClass('now-playing')) {
            return false;
        }

        if (playURL.length > 0) {
            var replayURL = playURL.replace(/\/(live)\//g, '/review/');
        }

        replayURL = replayURL + '?starttime=' + startTime + '&length=' + length;

        if(mode === 'Video'){
            $('#video').attr('src', replayURL)
        } else {
            myCirclePlayer.destroy();

            new CirclePlayer("#jquery_jplayer_1",
                {
                    m3u8a: replayURL
                }, {
                    solution: "html,flash",
                    supplied: 'm3u8a',
                    cssSelectorAncestor: "#cp_container_1"
                });
        }
        $(this).addClass('active').siblings().removeClass('active');
    });
});