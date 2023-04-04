const express = require('express');
const cors = require('cors');
const apiHandler = require('./routes/api')
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

app.use('/', apiHandler);

app.use(function(err,req,res,next){
    res.status(422).send({error: err.message});
});

app.listen(process.env.PORT || 3001, function(){
    console.log('Ready to Go!');
});