/**
 * Created by fanxiaolong on 2016/3/14.
 */
define([
    '../common',
    './main',
    'hbs!templates/program/layout'
], function (common, main, layoutTemplate) {

    var id = common.getQueryVariable('id'),
        type = common.getQueryVariable('type');

    function getAccessUrl(id) {
        return $.ajax({
            method: 'GET',
            url: common.baseURL + 'services/getAccessUrl',
            data: {
                PhysicalContentID: id,
                ContentType: type,
                Domain: 0
            }
        })
    }
    common.loading('#body-program');

    $.ajax({
        method:   'GET',
        url:      common.baseURL + 'contents/detail',
        data:     {
            ContentID: id
        }
    }).done(function (data) {
        /** @namespace data.Content.RelateContents */
        if (data &&
            data.Content &&
            data.Content.RelateContents &&
            data.Content.RelateContents.Content &&
            data.Content.RelateContents.Content.length > 2
        ) {
            data.Content.RelateContents.Content = data.Content.RelateContents.Content.slice(0, 2);
        }

        $('#body-program').html(layoutTemplate(data));
        getAccessUrl(data.Content.Program.Movies.Movie[0].PhysicalContentID).done(function (data) {
            /** @namespace data.AccessUrl */
            var playURL = data.AccessUrl;
            $('video').attr('src',playURL);
            common.setVideoCookie(playURL);
        });
        main.renderComment(id, '#comment-wrapper', '#more-comment', 3, 1);  //拉取评论列表
    })
});