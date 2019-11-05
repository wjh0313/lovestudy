const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended : false}));
app.use(express.static(__dirname+'/..'+'/static'));
const router = require('../routers/router');
app.use(router);
app.listen(3000,()=>{});