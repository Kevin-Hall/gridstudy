
var express = require('express')
var AWS = require("aws-sdk");
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

AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
  }
});

const uploadFile = (csvFileContent) => {
  // Setting up S3 upload parameters
  const params = {
      Bucket: BUCKET_NAME,
      Key: 'test.csv', // File name you want to save as in S3
      Body: "hello,hi,test"
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
      if (err) {
          throw err;
          console.log(err);
      }
      console.log(`File uploaded successfully. ${data.Location}`);
  });
};

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Express app listening at http://%s:%s', host, port)
})
