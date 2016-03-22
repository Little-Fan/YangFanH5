/**
 * Created by fanxiaolong on 2016/3/22.
 */
$(document).ready(function (e) {

    var d1 = $.ajax({
        method: "GET",
        url:      '../templates/special/layout.hbs'
    }).done(function (data) {
        $('body').html(data);
    });
});