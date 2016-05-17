/**
 * Created by fanxiaolong on 2016/3/14.
 */
'use strict';
define([
    '../common',
    'hbs!templates/channel/layout',
    'hbs!templates/channel/channel-type',
    'hbs!templates/channel/date-item',
    'hbs!templates/channel/program-item',
    'circle.player'
], function (common, layoutTemplate, channelTypeTemplate, dateItemTemplate, programItemTemplate) {
    var isLoad = false;  //是否是首次加载
    var id = common.getQueryVariable('id');
    var type = common.getQueryVariable('type');
    var PhysicalContentID = common.getQueryVariable('PhysicalContentID');
    var mode = common.getQueryVariable('mode');
    var title = decodeURI(common.getQueryVariable('title'));
    var playURL = '', myCirclePlayer;

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
    })
});