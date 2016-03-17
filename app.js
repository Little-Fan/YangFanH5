// vim: set ai et nu ts=4 sw=4 cc=100:
var express     = require('express')
  , path        = require('path')
  , favicon     = require('serve-favicon')
  , logger      = require('morgan')
  , cookieParser= require('cookie-parser')
  , bodyParser  = require('body-parser')
  , appConfig   = require('./appConfig')
  ;

require('coffee-script/register');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(session({
//    secret: appConfig.sessionSecret,
//    saveUninitialized: true,
//    resave: true,
//    cookie: {
//        secure: false,
//        maxAge: appConfig.sessionAge
//    }
//}));

// jcs plugin.
// put the plugin into app's value paire, for cli tools.
app.set('jcs-middleware', require('./jcs'));
app.use(appConfig.prefix, app.get('jcs-middleware').middleware);

// Static plugin. Must be after jcs plugin.
console.log(appConfig.prefix);

app.use(appConfig.prefix, express.static(path.join(__dirname, 'public')));

// If prefixed, redirect root to prefixed dir.
app.use('/', function(req, res, next){
    if (appConfig.prefix && appConfig.prefix !== '/' && req.path === '/'){
        res.redirect(appConfig.prefix);
    } else {
        next();
    }
});

////////////////////////
// Here goes the routing
////////////////////////
app.use(appConfig.prefix, require('./routes/index'));
app.use('/channel', require('./routes/channel'));
app.use('/list', require('./routes/list'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
(function(debugMode){
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: debugMode ? err : {}
        });
    });
})(appConfig.debugMode);

console.log('preparing server done');
module.exports = app;

