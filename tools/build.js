({
    appDir: '../www',
    mainConfigFile: '../www/js/common.js',
    dir: '../www-built',
    optimizeCss: "standard",
    // optimize: "none",
    // inlining ftw
    inlineText: true,
    stubModules: ['hbs', 'hbs/underscore', 'hbs/json2', 'hbs/handlebars'],
    modules: [
        {
            //module names are relative to baseUrl
            name: 'common',
            include: [
                'hbs',
                'handlebars',
                'hbs/underscore',
                'hbs/json2',
                'hbs/handlebars'
            ]
        },
        {
            //module names are relative to baseUrl/paths config
            name: 'app/index',
            exclude: ['common']
        },
        {
            //module names are relative to baseUrl
            name: 'app/channel',
            exclude: ['common']
        }
    ]
})
