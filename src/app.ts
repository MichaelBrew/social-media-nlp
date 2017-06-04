import * as express from 'express';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as sentiment from 'sentiment';
import * as path from 'path';
import * as moment from 'moment';

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/views/index.html`));
});

app.post('/posts/analyze', (req, res) => {
  const analyzed = JSON.parse(req.body.posts)
    .map(post => Object.assign({}, post, {
      createdAt: moment(post.created_time).format('MMM Do, YYYY'),
      sentiment: sentiment(post.message)
    }));

  res.send(analyzed);
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new Error('Not Found'));
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
