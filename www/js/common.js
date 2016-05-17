/*global define*/
'use strict';
require.config({
    baseUrl: 'js/',
    hbs: {
        helpers: true,            // default: true
        templateExtension: 'hbs', // default: 'hbs'
        partialsUrl: '',           // default: ''
        helperDirectory: "templates/helpers/",
        handlebarsPath: "handlebars"
    },
    paths: {
        jquery: '../../node_modules/jquery/dist/jquery.min',
        hbs: '../../bower_components/require-handlebars-plugin/hbs',
        handlebars: "../../bower_components/require-handlebars-plugin/hbs/handlebars.runtime",
        Cookies: '../../node_modules/js-cookie/src/js.cookie',
        moment: '../../node_modules/moment/min/moment.min',
        Spinner: '../../node_modules/spin.js/spin.min',
        detect: '../../node_modules/Detect.js/detect.min',
        templates: '../templates',  //模板目录
        'jquery.transform2d': 'lib/circleplayer/js/jquery.transform2d',
        'jquery.grab': 'lib/circleplayer/js/jquery.grab',
        'jquery.jplayer': 'lib/circleplayer/js/jquery.jplayer.min',
        'mod.csstransforms': 'lib/circleplayer/js/mod.csstransforms.min',
        'circle.player': 'lib/circleplayer/js/circle.player'
    },
    shim: {
        'jquery.transform2d': ['jquery'],
        'jquery.grab': ['jquery.transform2d'],
        'mod.csstransforms': ['jquery.jplayer', 'jquery.grab'],
        'circle.player': ['mod.csstransforms']
    }
});

define(['jquery', 'Cookies', 'Spinner'], function ($, Cookies, Spinner) {
    //全局ajax配置
    $.ajaxSetup({
        dataType: 'json'
    });

    return {
        baseURL: 'http://42.159.246.214:8080/rest/rest/', //接口基准位置
        setVideoCookie: function (playURL) {
            var regexp = new RegExp('(http[s]{0,1}|ftp)://[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&*+?:_/=<>]*)?', 'gi');

            if (regexp.test(playURL)) {
                Cookies.set('userShareUrl', playURL);
            }
        },
        getQueryVariable: function (variable, url) {
            var query, vars;
            query = url ? url : window.location.search.substring(1);
            vars = query.split('&');

            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                if (pair[0] === variable) {
                    return pair[1];
                }
            }
            return false;
        },
        loading: function (selector, options) {

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
        },
        isNil: function (value) {
            return value === null || value === undefined;
        },
        isIOSWebView: function () {
            var ua = detect.parse(navigator.userAgent);
            return ua.device.manufacturer === 'Apple' && ua.device.family === 'iPhone' && ua.os.family === 'iOS' && ua.device.type === 'Mobile';
        },
        setupWebViewJavascriptBridge: function (callback) {

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
        },
        isLogin: function () {
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
    };
});
