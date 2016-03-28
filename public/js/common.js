window.baseURL = 'http://42.159.246.214:8080/rest/rest/'; //接口基准位置

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {return pair[1];}
    }
    return false;
}

Handlebars.registerHelper('subString', function (stringObject, start, length, options) {
    return stringObject.substring(start, length);
});

Handlebars.registerHelper('praiseMark', function (conditional, options) {
    conditional = Number(conditional);
    if (conditional) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('contentType', function (type, options) {
    if (type == "Program") {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper("isNowPlay", function (value, options) {
    if (value == 2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper("formatTime", function (time, type, options) {
    if (type) {
        return moment.unix(time).format(type);
    }
});

$.ajax({
    url: baseURL + 'users/login',
    method: 'POST',
    dataType: 'json',
    async: false,
    data: {
        LoginType: 1,
        LoginName: 'hezhoujun'
    },
    success: function (data) {
        Cookies.set('user-info', data, {expires: 7, path: '/'});
        $.ajaxSetup({
            data: {
                'UserID': data.User.ID,
                'UserToken': data.UserToken
            }
        });
    }
});
$(document).on('click', '.commend-wrap i', function (e) {
    var data = $(this).data();
    $.ajax({
        url: baseURL + 'contents/addpraise',
        dataType: 'json',
        data: {
            ContentID: data.contentId,
            CommentID: data.commentId
        }
    }).done(function (data) {
        $(e.currentTarget).toggleClass('current').next().html(data.ResultRecord);
    })
});

function getComment(insetElement, pageSize, pageIndex) {
    var id = getQueryVariable('id');
    var d1 = $.ajax({
        method: "GET",
        url: '../templates/common/comment-layout.hbs'
    });

    var d2 = $.ajax({
        method: "GET",
        url: '../templates/common/comment-item.hbs'
    });

    $.when(d1, d2).done(function (data1, data2) {
        var layout = insetElement.html(data1[0]);
        function getTemplates() {
            var d3 = $.ajax({
                method: "GET",
                url: baseURL + 'contents/getcomments',
                dataType: 'json',
                async: false,
                data: {
                    Model: 1,
                    ContentID: id,
                    pagesize: pageSize,
                    pageindex: pageIndex
                }
            }).done(function (data) {
                var template = Handlebars.compile(data2[0]);
                var html = template(data);
                var moreComment = $('#more-comment');

                if (pageIndex >= data.PageCount) {
                    moreComment.off().find('a').text('数据加载完成');
                }
                if (data.Comments.Comment.length === 0) {
                    moreComment.remove();
                }
                pageIndex = data.Page + 1;
                layout.find('.comment-list').append(html);
            });
        }
        getTemplates(pageIndex);
        
        $('#more-comment').click(function (e) {
            getTemplates(pageIndex+1)
        })
    })
}

$(document).on('click', '#send', function (e) {
    var txt = $.trim($(this).prev().val());
    var id = getQueryVariable('id');
    var type = getQueryVariable('type');

    if (txt != '') {
        var para = {
            ContentType: type,
            ContentID: id,
            Comment: txt
        };

        var context = {
            UserID: Cookies.getJSON('user-info').User.ID,
            CreateTime: moment().format('YYYY-MM-DD h:mm:ss'),
            ContentID: id,
            Praise: 0,
            Detail: txt
        };
        $.ajax({
            url: baseURL + 'contents/addcomment',
            method: 'POST',
            dataType: 'json',
            data: para
        }).done(function (data) {
            $.ajax({
                method: "GET",
                url: '../templates/common/comment-item.hbs'
            }).done(function (data) {
                var template = Handlebars.compile(data);
                var html = template(context);
                $(e.currentTarget).prev().val('');
                $('.comment-list').prepend(html);
            })
        })
    }
});