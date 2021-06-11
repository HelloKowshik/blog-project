const express = require('express');
const mongoose = require('mongoose');
const app = express();
const morgan = require('morgan');
const PORT = process.env.PORT || 8080;
const authRoutes = require('./routes/authRoute');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
  uri: 'mongodb+srv://mongoAdminOne:mongo123@cluster0.e0fhg.mongodb.net/blogDb?retryWrites=true&w=majority',
  collection: 'sessions',
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const middlewires = [
  morgan('dev'),
  express.static('public'),
  express.urlencoded({ extended: true }),
  express.json(),
  session({
    secret: process.env.SECRET_KEY || 'SECRET_KEY',
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
];
app.use(middlewires);

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome Page!' });
});
// app.listen(PORT, () => console.log('Server Connected'));

mongoose
  .connect(
    'mongodb+srv://mongoAdminOne:mongo123@cluster0.e0fhg.mongodb.net/blogDb?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log('DB Connected!');
    app.listen(PORT, () => console.log('SERVER Connected!'));
  })
  .catch((err) => console.log(err.message));
