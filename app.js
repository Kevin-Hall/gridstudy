
var express = require('express')
const fs = require('fs');
const AWS = require("aws-sdk");
//const router = express.Router();
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

// app.use("/", router);
app.get('/', function(req,res) {
  res.sendfile('public/index.html');
});

app.post('/api/upload', function (req, res, next) {
  // This grabs the additional parameters so in this case passing in

  // Grabs your file object from the request.
  const file = req.files.comparisons_test;
  console.log(file);

  // Begins the upload to the AWS S3
  uploadToS3(file);
});

function uploadToS3(file) {
  s3.createBucket(function () {
      var params = {
        Bucket: BUCKET_NAME,
        Key: file.name,
        Body: file.data
      };
      s3.upload(params, function (err, data) {
        if (err) {
          console.log('error in callback');
          console.log(err);
        }
        console.log('success');
        console.log(data);
      });
  });
}

//const fileName = 'Eto.csv';

//app.post('/api/upload', uploadCsv);

// function uploadCsv(datacontents){
//   const uploadFile = () => {
//      const params = {
//          Bucket: 'gridstudy', // pass your bucket name
//          Key: 'test.csv', // file will be saved as testBucket/contacts.csv
//          Body: datacontents
//      };
//      s3.upload(params, function(s3Err, data) {
//          if (s3Err) throw s3Err
//          console.log(`File uploaded successfully at ${data.Location}`)
//      });
//   };
// };

// const uploadFile = () => {
//   const params = {
//       Bucket: 'gridstudy', // pass your bucket name
//       Key: 'test2.csv', // file will be saved as testBucket/contacts.csv
//       Body: arrayToCSV(comparisons_test)
//   };
//   s3.upload(params, function(s3Err, data) {
//       if (s3Err) throw s3Err
//       console.log(`File uploaded successfully at ${data.Location}`)
//   });
// };

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Express app listening at http://%s:%s', host, port)
})
