'use strict';

require.config({
    baseUrl: "../js",
    paths: {
        jquery: '../node_modules/jquery/dist/jquery',
        hbs: '../bower_components/require-handlebars-plugin/hbs',
        cookie: '../node_modules/js-cookie/src/js.cookie.js',
        moment: '../node_modules/moment/min/moment.min',
        spin: '../node_modules/spin.js/spin.min',
        detect: '../node_modules/Detect.js/detect.min',
        templates: '../templates'
    },
    hbs: {
        helpers: true,            // default: true
        templateExtension: 'hbs', // default: 'hbs'
        partialsUrl: ''           // default: ''
    }
});

require([
    'jquery',
    'app/index'
], function ($, index) {
    console.log(index);
});