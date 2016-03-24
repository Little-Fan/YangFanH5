/**
 * Created by fanxiaolong on 2016/3/14.
 */
$(document).ready(function (e) {
    var d1 = $.ajax({
        method: "GET",
        url:      '../templates/program/layout.hbs'
    }).done(function (data) {
        $('body').html(data);
    });
});