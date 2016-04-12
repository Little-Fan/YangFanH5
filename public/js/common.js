window.baseURL = 'http://42.159.246.214:8080/rest/rest/'; //接口基准位置

function getQueryVariable(variable, url) {
    var query,
        vars;

    if (url) {
        query = url;
    } else {
        query = window.location.search.substring(1);
    }

    vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return false;
}

Handlebars.registerHelper('subString', function (stringObject, start, length) {
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
    if (type === 'Program') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('isNowPlay', function (value, options) {
    if (Number(value) === 2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('isVideo', function (value, options) {
    value = value.substr(-2);
    if (value === '频道') {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('equality', function (v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('formatTime', function (time, type) {
    if (type) {
        return moment.unix(time).format(type);
    }
});

Handlebars.registerHelper('isTimeout', function (time, options) {

    var timestamp = Number(moment().unix());

    if (timestamp - Number(time) > 0) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('replace', function (stringObject) {
    return stringObject.replace(/\:/g, '');
});

function isLogin() {
    var uid = getQueryVariable('uid');
    var oauthToken = getQueryVariable('oauth_token');

    if (uid === false || oauthToken === false) {
        // APP那边发起登陆
        if (window.AndroidWebView) {
            window.AndroidWebView.callLogin();
        }
    }
}




function callLoginCallback(data) {

    var uid = getQueryVariable('uid', data);
    var oauthToken = getQueryVariable('oauth_token', data);

    /* 测试 */
    alert(data);
    alert(uid);
    alert(oauthToken);

    $.ajax({
        url: baseURL + 'users/login',
        method: 'POST',
        dataType: 'json',
        async: false,
        data: {
            LoginType: 1,
            AppCode: 'apk02',
            LoginName: uid,
            UserID: uid,
            AuthToken: oauthToken
        },
        success: function (data) {
            /*  ResultCode === 0  就是登陆成功，其他的都是出错。 出错的消息字段 ResultDesc */
            if (Number(data.ResultCode) === 0) {
                Cookies.set('user-info', data, {expires: 7, path: '/'});
                $.ajaxSetup({
                    data: {
                        'UserID': data.User.ID,
                        'UserToken': data.UserToken
                    }
                });
            } else {
                alert(data.ResultDesc);   //失败时候的操作
            }
        }
    });
}

$(document).on('click', '.commend-wrap i', function (e) {
    var data = $(this).data();
    var userInfo = Cookies.getJSON('user-info');

    if (userInfo && userInfo.User && userInfo.User.ID) {
        $.ajax({
            url: baseURL + 'contents/addpraise',
            dataType: 'json',
            data: {
                ContentID: data.contentId,
                CommentID: data.commentId
            }
        }).done(function (data) {
            $(e.currentTarget).toggleClass('current').next().html(data.ResultRecord);
        });
    } else {
        isLogin();
    }
});

function getComment(insetElement, pageSize, pageIndex) {
    var id = getQueryVariable('id');
    var d1 = $.ajax({
        method: 'GET',
        url: '../templates/common/comment-layout.hbs'
    });

    var d2 = $.ajax({
        method: 'GET',
        url: '../templates/common/comment-item.hbs'
    });

    $.when(d1, d2).done(function (data1, data2) {
        var layout = insetElement.html(data1[0]);

        function getTemplates() {
            $.ajax({
                method: 'GET',
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

        $('#more-comment').click(function () {
            getTemplates(pageIndex + 1);
        });
    });
}
$(document).on('click', '#send', function (e) {
    var txt = $.trim($(this).prev().val());
    var id = getQueryVariable('id');
    var type = getQueryVariable('type');

    if (txt !== '') {
        var para = {
            ContentType: type,
            ContentID: id,
            Comment: txt
        };

        var userInfo = Cookies.getJSON('user-info');

        if (userInfo && userInfo.User && userInfo.User.ID) {
            var context = {
                /*UserID: Cookies.getJSON('user-info').User.ID,*/
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
            }).done(function () {
                $.ajax({
                    method: 'GET',
                    url: '../templates/common/comment-item.hbs'
                }).done(function (data) {
                    var template = Handlebars.compile(data);
                    var html = template(context);
                    $(e.currentTarget).prev().val('');
                    $('.comment-list').prepend(html);
                });
            });
        } else {
            isLogin();
        }
    }
});