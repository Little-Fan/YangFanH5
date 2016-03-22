/**
 * Created by fanxiaolong on 2016/3/14.
 */
$(document).ready(function (e) {
    var d1 = $.ajax({
        method: "GET",
        url:      '../templates/demand/layout.hbs'
    }).done(function (data) {
        $('body').html(data);
    });
});