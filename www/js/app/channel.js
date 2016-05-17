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

    $('.tabs-nav').html(dateItemTemplate(dateMap));  //渲染选择播放日期列表
});