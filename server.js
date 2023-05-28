const express = require("express");
const handlebars = require("express-handlebars");
const QRCode = require('qrcode');
const path = require('path');
const md5 = require('md5');
const app = express();

app.use(express.json());
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars.engine({
    layoutsDir: __dirname + '/views',
}));

app.use('/generated', express.static(path.join(__dirname, 'generated')))
app.use('/static', express.static('node_modules/bootstrap/dist/'));
app.use('/static', express.static('/'));

app.get('/static/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'style.css'), {
        headers: {
            'Content-Type': 'text/css'
        }
    });
});

app.get('/', (req, res) => {
    res.render('index.hbs');
});

app.post('/qrcode', (req, res) => {
    const fileName = 'generated/' + md5(req.body.url) + '.png';
    const qrcode = QRCode.toFile(fileName, req.body.url, function (error) {
        if (error) {
            console.error(error);
        }
    })
    Promise.all([qrcode]).then(() => {
        res.json({ fileName: fileName });
    });
});

app.listen(3000, () => {
    console.log("server nasłuchuje na porcie 3000");
});
