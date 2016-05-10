'use strict';

require.config({
    baseUrl: "../js",
    paths: {
        jquery: '../node_modules/jquery/dist/jquery',
        handlebars: '../node_modules/handlebars/dist/handlebars.min',
        cookie: '../node_modules/js-cookie/src/js.cookie.js',
        moment: '../node_modules/moment/min/moment.min',
        spin: '../node_modules/spin.js/spin.min',
        detect: '../node_modules/Detect.js/detect.min'
    }
});


require([
    'app/index'
], function (index) {
    console.log(index);
});