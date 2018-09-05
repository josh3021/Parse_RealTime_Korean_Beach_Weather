const express = require('express') 
  , parse = require('./parse')
  , http = require('http')
  , path = require('path')
const app = express()
const bodyParser=require("body-parser")

app.set('trush proxy', 1)

app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname + '/views'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
 
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.post('/gettemp', parse.getTemp)
app.post('/parser', parse.parser)
 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});