({
    appDir: "./",
    baseUrl: "./",
    dir: "../dist",
    mainConfigFile: 'main.js',
    optimizeCss: "standard",
    // optimize: "none",
    // inlining ftw
    inlineText: true,
    stubModules: ['hbs', 'hbs/underscore', 'hbs/json2', 'hbs/handlebars'],
    modules: [
        {
            name: "main"
        }
    ]
})
