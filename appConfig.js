// vim: set ai et nu ts=4 sw=4 cc=100:
//

//#######################################
// Test server.
//DATA_SERVER = "http://otv.xun-ao.com/php/"
//#######################################
// Public server.
DATA_SERVER = "http://liveclips.otvcloud.com/php/"

var path    = require('path')
  , app     = require('express')()
  , pkg     = require('./package.json')
  ;

var DEFAULTS = {
    appName         : pkg.name,
    prefix          : '/',
    sessionAge      : 7 * 24 * 3600 * 1000,
    sessionSecret   : 'jcs secret',
    debugMode       : app.get('env') === 'development',
    webPort         : process.env.PORT || 3000,

    redisUrl        : 'redis://localhost:6379',
    redisMaxExpire  : 30 * 60,
    redisMinExpire  : 10 * 60,

    wxAppId         : "",
    wxAppSecret     : "",

    dataServer      : DATA_SERVER,
};

var CONF = {};

try{
    CONF = require(path.join(__dirname, 'CONF.json'));
} catch(err){
    if (err.code != 'MODULE_NOT_FOUND') {
        console.error(err);
    }
}

for(var k in DEFAULTS){
    if (typeof CONF[k] === 'undefined'){
        CONF[k] = DEFAULTS[k];
    }
}


module.exports = CONF;

