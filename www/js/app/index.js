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
], function (common,
             layoutView,
             commonLoadView,
             liveLayoutView,
             categoryItemView,
             liveItemView,
             listLayoutView,
             listItemView) {
    common.loading('#body-index');

    var type = common.getQueryVariable('type');
    var id = common.getQueryVariable('id');

    function renderTitle(parentElement, templateView) {
        return $.ajax({
            method: 'GET',
            url: common.baseURL + 'contents/categorys',
            dataType: 'json',
            data: {
                ParentID: id
            }
        }).done(function (data) {
            data.type = type;
            data.$element = parentElement.html(templateView(data));
        });
    }

    function renderMain(data, templateView) {
        /** @namespace data.Categorys */
        /** @namespace data.Categorys.Category */
        $.each(data.Categorys.Category, function (index, obj) {
            $.ajax({
                method: 'GET',
                url: common.baseURL + 'contents/contentlist',
                dataType: 'json',
                data: {
                    CategoryID: obj.CategoryID
                }
            }).done(function (contentList) {
                if (type === 'live') {
                    data.$element.find('.main').append(templateView(contentList));
                } else {
                    data.$element.find('.list').eq(index).html(templateView(contentList));
                }
            })
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
            renderTitle(data.$element, liveLayoutView).done(function (data) {
                data.$element.find('.sub-nav').html(categoryItemView(data));
            }).done(function (data) {
                renderMain(data, liveItemView);
            })
        } else {
            renderTitle(data.$element, listLayoutView).done(function (data) {
                renderMain(data, listItemView)
            })
        }
    })
});