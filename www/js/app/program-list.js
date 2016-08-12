/**
 * Created by fanxiaolong on 2016/3/22.
 */
'use strict';
define([
    '../common',
    'hbs!templates/program-list/layout'
], function (common, layoutTemplate) {
    var id = common.getQueryVariable('id');
    common.loading('#body-program-list');

    $.ajax({
        method:   'GET',
        url:      common.baseURL + 'contents/detail',
        data:     {
            ContentID: id
        }
    }).done(function (data) {
        $('#body-program-list').html(layoutTemplate(data));
    });
});