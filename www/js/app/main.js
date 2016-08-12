'use strict';
define([
    '../common',
    'hbs!templates/common/comment-layout',
    'hbs!templates/common/comment-item'
], function (common, commentLayoutTemplate, commentItemTemplate) {
    return {
        pageIndex: 1,  //初始页面的位置
        getTemplates: function (commentId, moreSelector, pageSize, pageIndex) {
            return $.ajax({
                method: 'GET',
                url: common.baseURL + 'contents/getcomments',
                data: {
                    Model: 1,
                    ContentID: commentId,
                    pagesize: pageSize,
                    pageindex: pageIndex
                }
            }).done(function (data) {
                var moreComment = $(moreSelector);  //页面上【更多】元素的选择器

                //如果传入页面大于等于页面的总数
                if (pageIndex >= data.PageCount) {
                    moreComment.off().find('a').text('数据加载完成');  //删除元素的所有事件
                }

                //如果没有评论数据
                if (data.Comments.Comment.length === 0) {
                    moreComment.remove();
                }
                this.pageIndex = data.Page + 1;
            });
        },
        renderComment: function (commentId, insetSelector, moreSelector, pageSize, pageIndex) {
            var layout = $(insetSelector).html(commentLayoutTemplate({}));
            this.getTemplates(commentId, moreSelector, pageSize, pageIndex).done(function (data) {
                layout.find('.comment-list').append(commentItemTemplate(data));
            });
            $(moreSelector).click(function () {
                this.getTemplates(this.pageIndex + 1);
            });
        }
    }
});