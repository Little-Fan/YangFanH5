// vim: set ai et nu ts=4 sw=4 cc=100:
var path        = require('path')
  , appConfig   = require('./appConfig')
  ;

module.exports = require('jcs-middleware')({
    debug:          appConfig.debugMode,
    compress:       !appConfig.debugMode,
    staticRoot:     path.join(__dirname, 'public'),
    // urlBase:        appConfig.prefix,

    coffeeSrc:      path.join(__dirname, 'views',  'jcs'),
    coffeeDst:      path.join(__dirname, 'public', 'jcs'),

    stylusSrc:      path.join(__dirname, 'views',  'jcs'),
    stylusDst:      path.join(__dirname, 'public', 'jcs'),

    jadeSrc:        path.join(__dirname, 'views',  'jcs'),
    jadeDst:        path.join(__dirname, 'public', 'jcs'),
    jadeStatics:    {
        appConfig: appConfig,
        renderMode: 'static'
    }
});

