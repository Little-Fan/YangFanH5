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
            //List common dependencies here. Only need to list
            //top level dependencies, "include" will find
            //nested dependencies.
            include: ['jquery']
        },
        {
            //module names are relative to baseUrl/paths config
            name: 'index',
            include: ['app/index'],
            exclude: ['common']
        }
    ]
})
