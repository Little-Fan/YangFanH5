//Load common code that includes config, then load the app logic for this page.
define([
    '../common',
    'hbs!templates/index/layout',
    'hbs!templates/common/common-load',
    'hbs!templates/index/live-layout',
    'hbs!templates/index/category-item',
    'hbs!templates/index/live-item',
    'hbs!templates/index/list-layout',
    'hbs!templates/index/list-item'
], function (common, layoutView, commonLoadView, liveLayoutView, categoryItemView, liveItemView, listLayoutView, listItemView) {
    common.loading('#body-index');

    var type = common.getQueryVariable('type');
    var id = common.getQueryVariable('id');

    $.ajax({
        method: 'GET',
        url: common.baseURL + 'contents/homecategorys',
        dataType: 'json'
    }).done(function (data) {
        data.type = type;
        return $('#body-index').html(layoutView(data)).find('.content').html(commonLoadView);
    }).done(function (data) {

        console.log(data);
        
        if (type === 'live') {

        }

    })
});