//Import node modules
require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const multer = require('multer');
//DB Query Functions
const { autUser } = require('./src/queries/authUser');
const { getImages } = require('./src/queries/getImages');
const { getSiteSettings } = require('./src/queries/getSiteSettings');
const { handleFileUpload } = require('./src/modules/handleFileUpload');
const { loginUser } = require('./src/queries/loginUser');
const { registerUser } = require('./src/queries/registerUser');
//Construct and define express server (including multer)
const app = express();
const serverPort = process.env.SERVER_PORT;
const upload = multer({ dest: 'tmp/' });
var sitename = getSiteSettings().name
var theme = getSiteSettings().theme;
var isonepage = getSiteSettings().isonepage
// Middleware configuratie
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/static/'));

// End-user homepage
app.get('/', (req, res) => {
    res.render('index', { title: `${sitename}`, theme: theme });
});

// Admin login
app.get('/admin/login', (req, res) => {
    if (!req.cookies.token) {
        res.render('admin/login', { title: `${sitename} | Admin | Login` });
    } else {
        res.redirect('/admin/');
    }
});

app.post('/admin/login', (req, res) => {
    const request = loginUser(req.body);
    console.log(request);
    if (request.status === 'true') {
        res.cookie('token', request.data, { expires: new Date(Date.now() + 900000), httpOnly: true });
        res.redirect('/admin/');
    } else {
        res.render('admin/login', { inputerror: `Couldn't login`, title: `${sitename} | Login` });
    }
});

// Admin logout
app.get('/admin/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin/login');
});

// Admin register
app.get('/admin/register', (req, res) => {
    res.render('admin/register', { title: `${sitename} | Admin | Register` });
});

app.post('/admin/register', (req, res) => {
    const request = registerUser(req.body);
    console.log(request);
    if (request.status === 'true') {
        res.redirect('/admin/login');
    } else {
        res.redirect('/admin/register');
    }
});

// Admin dashboard
app.get('/admin', (req, res) => {
    const request = autUser(req.cookies.token);
    console.log(request);
    if (request.status === 'true') {
        res.render('admin/index', { title: `${sitename} | Admin | Home`, data: req.cookies.token });
    } else {
        res.redirect('/admin/login');
    }
});
// Admin about
app.get('/admin/about', (req, res) => {
    const request = autUser(req.cookies.token);
    console.log(request);
    if (request.status === 'true') {
        res.render('admin/about', { title: `${sitename} | Admin | About`, data: req.cookies.token });
    } else {
        res.redirect('/admin/login');
    }
});

// Add images (GET & POST)
app.get('/admin/add-images', (req, res) => {
    const request = autUser(req.cookies.token);
    console.log(request);
    if (request.status === 'true') {
        res.render('admin/add-images', { title: `${sitename} | Admin | Add Images`, data: req.cookies.token });
    } else {
        res.redirect('/admin/login');
    }
});

app.post('/admin/add-images', upload.array('photos', 10), async (req, res) => {
    const files = req.files;
    const request = await handleFileUpload(files);
    if (request.status === "true") {
        res.send("Foto's geüpload!");
    } else {
        res.send("Kon foto's niet uploaden ;(");
    }
});

// Edit images
app.get('/admin/edit-images', (req, res) => {
    const request = autUser(req.cookies.token);
    console.log(request);
    if (request.status === 'true') {
        const images = getImages();
        console.log(typeof (images[0].year))
        res.render('admin/edit-images', { title: `${sitename} | Admin | Edit Images`, data: images });
    } else {
        res.redirect('/admin/login');
    }
});


// adding users
app.get('/admin/add-users', (req, res) => {
    const request = autUser(req.cookies.token);
    console.log(request);

    if (request.status === "false") {
        res.redirect('/admin/login');
    }
    if (request.status === "true" && request.data.isadmin === 0) {
        res.redirect('/admin/')
    } if (request.status === "true" && request.data.isadmin === 1) {
        res.render('admin/add-users', { title: `${sitename} | Admin | Adding Users`, data: request });
    }
});

// changing site settings
app.get('/admin/site-settings', (req, res) => {
    const request = autUser(req.cookies.token);
    console.log(request);
    const data = getSiteSettings()

    if (request.status === "false") {
        res.redirect('/admin/login');
    }
    if (request.status === "true" && request.data.isadmin === 0) {
        res.redirect('/admin/')
    } if (request.status === "true" && request.data.isadmin === 1) {
        res.render('admin/site-settings', { title: `${sitename} | Admin | Adding Users`, data: data });
    }
});

// 404 Error page
app.use((req, res) => {
    res.render('error', {
        title: `${sitename} | Error 404`,
        errorcode: '404',
        url: req.url,
        theme: theme
    });
});

// Start server
app.listen(serverPort, () => {
    console.log(`PhotoFolio started running on port: ${serverPort}`);
});
