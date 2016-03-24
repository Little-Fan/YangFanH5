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

$.ajax({
    url:      baseURL + 'users/login',
    method:   'POST',
    dataType: 'json',
    async:    false,
    data:     {
        LoginType: 1,
        LoginName: 'hezhoujun'
    },
    success:  function (data) {
        Cookies.set('user-info', data, { expires: 7, path: '/' });
        $.ajaxSetup({
            data: {
                'UserID':    data.User.ID,
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

$(document).on('click', '#send', function (e) {
    var txt = $.trim($(this).prev().val());
    var id =getQueryVariable('id');
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
                url:    '../templates/common/comment-item.hbs'
            }).done(function (data) {
                var template = Handlebars.compile(data);
                var html= template(context);
                $('.comment-list').prepend(html);
            })
        })
    }
});