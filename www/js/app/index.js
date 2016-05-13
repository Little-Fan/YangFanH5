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

    function getCategorised(element) {
        return $.ajax({
            method:   'GET',
            url:      common.baseURL + 'contents/categorys',
            dataType: 'json',
            data:     {
                ParentID: id
            }
        }).done(function (data) {
            data.$element = element.html(liveLayoutView(data));
        });
    }

    $.ajax({
        method: 'GET',
        url: common.baseURL + 'contents/homecategorys',
        dataType: 'json'
    }).done(function (data) {
        data.type = type;
        data.$element = $('#body-index').html(layoutView(data)).find('.content').html(commonLoadView);
    }).done(function (data) {
        if (type === 'live') {
            getCategorised(data.$element).done(function (data) {
                data.$element.find('.sub-nav').html(categoryItemView(data));
                console.timeStamp('fan')
            }).done(function (data) {
                console.timeStamp('fan2')
            })
        }
    })
});