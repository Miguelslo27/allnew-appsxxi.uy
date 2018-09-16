//Install express server
const express = require('express');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');
const multer = require('multer'); // v1.0.5
const upload = multer(); // for parsing multipart/form-data

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/dist/index.html'));
});

app.post('/send', function (req, res) {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  console.log(process.env.SENDGRID_API_KEY);
  console.log(req.body);
  
  const msg = {
    to: 'miguel.sosa@appsxxi.com',
    from: req.body.name + ' <' + req.body.email + '>',
    subject: 'AppsXXI - ' + req.body.name,
    text: req.body.message,
    html: '<strong>' + req.body.message + '</strong>',
  };

  sgMail.send(msg);
  res.redirect('/?email=sent');
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080, () => {
  console.log("Server started");
});
