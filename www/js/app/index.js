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
], function (common, layoutTemplate, commonLoadTemplate, liveLayoutTemplate, categoryItemTemplate, liveItemTemplate, listLayoutTemplate, listItemTemplate) {
    common.loading('#body-index');

    var type = common.getQueryVariable('type');
    var id = common.getQueryVariable('id');

    function renderTitle(parentElement, templateTemplate) {
        return $.ajax({
            method: 'GET',
            url: common.baseURL + 'contents/categorys',
            dataType: 'json',
            data: {
                ParentID: id
            }
        }).done(function (data) {
            data.type = type;
            data.$element = parentElement.html(templateTemplate(data));
        });
    }

    function renderMain(data, template) {
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
                    data.$element.find('.main').append(template(contentList));
                } else {
                    data.$element.find('.list').eq(index).html(template(contentList));
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
        data.$element = $('#body-index').html(layoutTemplate(data)).find('.content').html(commonLoadTemplate);
    }).done(function (data) {
        if (type === 'live') {
            renderTitle(data.$element, liveLayoutTemplate).done(function (data) {
                data.$element.find('.sub-nav').html(categoryItemTemplate(data));
            }).done(function (data) {
                renderMain(data, liveItemTemplate);
            })
        } else {
            renderTitle(data.$element, listLayoutTemplate).done(function (data) {
                renderMain(data, listItemTemplate)
            })
        }
    })
});