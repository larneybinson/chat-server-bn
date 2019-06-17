const Ddos=require('ddos');
const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');

var Config=require('./config.json');
var Configuration=Config[Config.ConfigHost];

var app=express();

var ApiIndex=require('./index');

var ddos = new Ddos({burst:10, limit:15});
app.use(ddos.express);
app.use(cors());
app.use(bodyParser.json());
app.set('views', __dirname+"/mail-templates");
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public/images'));

ApiIndex.Apis(app);

