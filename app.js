// Import các module cần thiết
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Khởi tạo ứng dụng Express
const app = express();

// Cấu hình MongoDB
mongoose.connect('mongodb+srv://trinhntph48046:qUoByP22aCrhCnix@admin123456.p07ii.mongodb.net/?retryWrites=true&w=majority&appName=admin123456', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Import router
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// Thiết lập view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sử dụng các route
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Bắt lỗi 404 và chuyển tiếp tới error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Xử lý lỗi
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render trang lỗi
  res.status(err.status || 500);
  res.render('error');
});

// Khởi động server
app.listen(3001, () => {
  console.log('Server started on http://localhost:3001');
});
const carRouter = require('./routes/routes/car');
app.use('/car', carRouter);

module.exports = app;
