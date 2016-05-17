/**
 * Created by fanxiaolong on 2016/5/17.
 */
define([
    '../common',
    'hbs!templates/special/layout'
], function (common, layoutTemplate) {
    var id = common.getQueryVariable('id');
    common.loading('#body-special');
    $.ajax({
        method: 'GET',
        url: common.baseURL + 'contents/detail',
        dataType: 'json',
        data: {
            ContentID: id
        }
    }).done(function (data) {
        $('#body-special').html(layoutTemplate(data));
    });
});