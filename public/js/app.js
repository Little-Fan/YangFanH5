/**
 * Created by fanxiaolong on 2016/3/14.
 */
$(document).ready(function (e) {

    var opts = {
        lines: 13 // The number of lines to draw
        , length: 28 // The length of each line
        , width: 14 // The line thickness
        , radius: 42 // The radius of the inner circle
        , scale: 1 // Scales overall size of the spinner
        , corners: 1 // Corner roundness (0..1)
        , color: '#000' // #rgb or #rrggbb or array of colors
        , opacity: 0.25 // Opacity of the lines
        , rotate: 0 // The rotation offset
        , direction: 1 // 1: clockwise, -1: counterclockwise
        , speed: 1 // Rounds per second
        , trail: 60 // Afterglow percentage
        , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        , zIndex: 2e9 // The z-index (defaults to 2000000000)
        , className: 'spinner' // The CSS class to assign to the spinner
        , top: '50%' // Top position relative to parent
        , left: '50%' // Left position relative to parent
        , shadow: false // Whether to render a shadow
        , hwaccel: false // Whether to use hardware acceleration
        , position: 'absolute' // Element positioning
    };

    var target = $('#body')[0];  //获取DOM对象
    var spinner = new Spinner(opts).spin(target);  //loading加载动画


    /*var data = {
        ParentID: '',
        pageindex: 0,
        pagesize: -1
    };*/

    $.ajax({
        method: "GET",
        url:      '../templates/layout.hbs'
    }).done(function (data) {
        var template = Handlebars.compile(data);
        var context = {
            items: [
                {name: "Handlebars", emotion: "love"},
                {name: "Mustache", emotion: "enjoy"},
                {name: "Ember", emotion: "want to learn"}
            ]
        };

        var html= template(context);

        $('#body').html(html);
    });

    $.ajax({
        method: "GET",
        url:      'http://ceshi2.chinacloudapp.cn:8080/rest/rest/contents/homecategorys',
        dataType: 'json',
        success:  function (data) {
            console.log(data);
        }
    })
});