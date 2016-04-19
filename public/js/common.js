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

function loading(selector, options) {

    var defaults = {
        lines: 17, // The number of lines to draw
        length: 0, // The length of each line
        width: 3, // The line thickness
        radius: 20, // The radius of the inner circle
        scale: 2, // Scales overall size of the spinner
        corners: 1, // Corner roundness (0..1)
        color: '#000', // #rgb or #rrggbb or array of colors
        opacity: 0.25, // Opacity of the lines
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        className: 'spinner', // The CSS class to assign to the spinner
        top: '50%', // Top position relative to parent
        left: '50%', // Left position relative to parent
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        position: 'absolute' // Element positioning
    };

    var settings = $.extend({}, defaults, options);  //合并参数

    new Spinner(settings).spin($(selector)[0]);  //loading加载动画
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

function _isNil(value) {
    return value === null || value === undefined;
}

function isIOSWebView() {
    var ua = detect.parse(navigator.userAgent);
    return ua.device.manufacturer === 'Apple' && ua.device.family === 'iPhone' && ua.os.family === 'iOS' && ua.device.type === 'Mobile';
}

function setupWebViewJavascriptBridge(callback) {

    if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
    }

    if (isIOSWebView()) {
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function () {
            document.documentElement.removeChild(WVJBIframe);
        }, 0);
    }
}

function isLogin() {
    var userInfo = Cookies.getJSON('user-info');

    if (userInfo && userInfo.User && userInfo.User.ID) {
        return true;
    } else {
        // 安卓APP那边发起登陆
        if (window.AndroidWebView) {
            window.AndroidWebView.callLogin();
        }

        // IOS发起登陆
        if (isIOSWebView()) {
            setupWebViewJavascriptBridge(function (bridge) {
                bridge.callHandler('callLogin');
            });
        }
    }
    return false;
}

function callLoginCallback(data) {
    var uid = getQueryVariable('uid', data);
    var oauthToken = getQueryVariable('oauth_token', data);

    $.ajax({
        url: baseURL + 'test',
        method: 'POST',
        dataType: 'json',
        async: false,
        data: {
            data: data,
            uid: uid,
            oauthToken: oauthToken
        }
    });

    if (uid.length > 0 && oauthToken.length > 0) {
        /* 登陆接口 */
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
            }
        }).done(function (data) {
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
        });
    }
}

if (isIOSWebView()) {
    setupWebViewJavascriptBridge(function (bridge) {
        bridge.registerHandler('callLoginCallback', function (data) {
            callLoginCallback(data);
        });
    });
}

$(document).on('click touchstart', '.share', function () {

    var userShareUrl = Cookies.getJSON('userShareUrl');

    if (window.AndroidWebView) {
        window.AndroidWebView.callShareSDK(userShareUrl);
    }

    setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('callShareSDK', userShareUrl, function responseCallback(responseData) {
            alert('callShareSDK');
        });
    });

});

$(document).on('click touchstart', '.commend-wrap i', function (e) {
    if (isLogin()) {
        var contentData = $(this).data();
        var userInfo = Cookies.getJSON('user-info');
        $.ajax({
            url: baseURL + 'contents/addpraise',
            dataType: 'json',
            data: {
                ContentID: contentData.contentId,
                CommentID: contentData.commentId,
                UserID: userInfo.User.ID
            }
        }).done(function (data) {
            $(e.currentTarget).toggleClass('current').next().html(data.ResultRecord);
        });
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

$(document).on('click touchstart', '#send', function (e) {
    var txt = $.trim($(this).prev().val());
    var id = getQueryVariable('id');
    var type = getQueryVariable('type');
    var userInfo = Cookies.getJSON('user-info');

    if (isLogin() && txt !== '') {
        var para = {
            ContentType: type,
            ContentID: id,
            Comment: txt,
            UserID: userInfo.User.ID
        };

        var context = {};

        context.Comments = {};
        context.Comments.Comment = [];
        context.Comments.Comment[0] = {
            UserID: Cookies.getJSON('user-info').User.ID,
            CreateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
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
            if (Number(data.ResultCode) === 0) {
                $.ajax({
                    method: 'GET',
                    url: '../templates/common/comment-item.hbs'
                }).done(function (data) {
                    var template = Handlebars.compile(data);
                    var html = template(context);
                    var comment = $('.comment-list');

                    $(e.currentTarget).prev().val('');
                    comment.prepend(html);
                    comment.children('p').remove();
                });
            } else {
                alert(data.ResultDesc);
            }
        });
    }

});