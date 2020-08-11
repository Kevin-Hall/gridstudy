
var express = require('express')
const fs = require('fs');
const AWS = require("aws-sdk");
var app = express()

// bucket setup
const ID = 'AKIARN7TL5YNDCDNOQVT';
const SECRET = '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';
const BUCKET_NAME = 'gridstudy';
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

app.use(express.static('public'));

app.get('/', function(req,res) {
  res.sendfile('public/index.html');
});

const fileName = 'Eto.csv';

const uploadFile = () => {
  fs.readFile(fileName, (err, data) => {
     if (err) throw err;
     const params = {
         Bucket: 'gridstudy', // pass your bucket name
         Key: 'test.csv', // file will be saved as testBucket/contacts.csv
         Body: JSON.stringify(data, null, 2)
     };
     s3.upload(params, function(s3Err, data) {
         if (s3Err) throw s3Err
         console.log(`File uploaded successfully at ${data.Location}`)
     });
  });
};

uploadFile();

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Express app listening at http://%s:%s', host, port)
})
