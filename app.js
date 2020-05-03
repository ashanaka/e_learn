const express = require('express');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const path = require('path');
const passport = require('passport');
require('dotenv').config();

const app = express();

// Express session midleware
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Method override middleware
app.use(methodOverride('_method'));

// Load routes
const users = require('./routes/users');

const hbs = exphbs.create({
    defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
        if_equal: function (a, b, opts) {
            if (a == b) {
                return opts.fn(this)
            } else {
                return opts.inverse(this)
            }
        }
    }
});
// Handlebars Middleware
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


// Passport Config
require('./config/passport')(passport);

mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/e_learn', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});


//=============================Routes================================

// Index Route
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});
// About Us Route
app.get('/about', (req, res) => {
    const title = 'About Us';
    res.render('about', {
        title: title
    });
});


// Use routes
app.use('/users', users);


// Connect with the server port
app.listen(process.env.PORT || 5000, process.env.IP);