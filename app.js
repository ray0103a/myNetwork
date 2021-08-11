var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mainMenuRouter = require('./routes/mainMenu');
var barcodeRouter = require('./routes/barcode');
var barcode2Router = require('./routes/barcode2');
var barcode3Router = require('./routes/barcode3');
var qrtestRouter = require('./routes/qrtest');
var qrtest2Router = require('./routes/qrtest2');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//passportに必要
//npm install passport
//npm install passport-local
//npm install express-session
var passport = require('passport');

var myServer = require(path.resolve() + '/public/javascripts/myServer.js');

app.use(session({ 
    resave:false,
    saveUninitialized:false,
    rolling: true, //cookieが有効期限が都度更新されるか
    cookie: {maxAge:1 * 60 * 1000},  //有効期限
    secret: 'passport test' }));
app.use(passport.initialize());
app.use(passport.session());

var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
    session: true,
}, function (req, username, password, done) {    
    let checkPass = 'defaultXXXXXXXXXX';
    process.nextTick(function () {
        async function funcSelect() {
            //usernameを検索条件にし、passwordを取得する
            /*
            await myServer.selectNeDb(username).then(function(result) {
                checkPass = result;
            }).catch(function(value) {
                // 非同期処理が失敗した場合
                console.log('実行結果:' + value);
            });
            */

            if (password == checkPass) {
                //return done(null, username)
                var kaihatsu = 'zzz';
                return done(null, { username: username, myKey: kaihatsu});
                //return done(null, { username: username, password: password, myKey: kaihatsu});
            } else {
                console.log("login error")
                return done(null, false, { message: 'パスワードが正しくありません。' })
            }
        }
        funcSelect();  
    })
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});
//passportここまで

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/mainMenu', mainMenuRouter);
app.use('/qrtest', qrtestRouter);
app.use('/qrtest2', qrtest2Router);
app.use('/barcode', barcodeRouter);
app.use('/barcode2', barcode2Router);
app.use('/barcode3', barcode3Router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
