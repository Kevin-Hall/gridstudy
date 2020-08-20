
var express = require('express')
const fs = require('fs');
const AWS = require("aws-sdk");
//const router = express.Router();
var app = express()

// const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;

// bucket setup
const ID = 'AKIARN7TL5YNDCDNOQVT';
const SECRET = '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';
const BUCKET_NAME = 'gridstudies';
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

app.use(express.static('public'));

// app.use("/", router);
app.get('/', function(req,res) {
  res.sendfile('public/index.html');
});


app.get('/sign-s3', (req, res) => {
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  console.log(fileName);
  console.log(fileType);
  const s3Params = {
    Bucket: BUCKET_NAME,
    Key: `user-completed-${new Date().toString()}.csv`,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Express app listening at http://%s:%s', host, port)
})



function getCurrentTimeString(){
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var d = new Date();
  var day = days[d.getDay()];
  var hr = d.getHours();
  var min = d.getMinutes();
  if (min < 10) {
      min = "0" + min;
  }
  var ampm = "am";
  if( hr > 12 ) {
      hr -= 12;
      ampm = "pm";
  }
  var date = d.getDate();
  var month = months[d.getMonth()];
  var year = d.getFullYear();
  return hr + "-" + min + ampm + " " + date + " " + month;
}

// app.get('/sign-s3', function(req,res) {
//   const fileName = req.query['file-name'];
//   const fileContent = req.query['file-content'];
//
//   uploadFile(fileContent);
// });

// app.get('/sign-s3', (req, res) => {
//   const s3 = new aws.S3();
//   const fileName = req.query['file-name'];
//   const fileContent = req.query['file-content'];
//
//   uploadToS3(fileContent);
//   // const s3Params = {
//   //   Bucket: BUCKET_NAME,
//   //   Key: `user-${new Date().getTime()}.csv`,
//   //   Expires: 60,
//   //   ContentType: fileType,
//   //   ACL: 'public-read'
//   // };
//
//   // s3.upload(params, function (err, data) {
//   //   if (err) {
//   //     console.log('error in callback');
//   //     console.log(err);
//   //   }
//   //   console.log('success');
//   //   console.log(data);
//   // });
//
//   // s3.getSignedUrl('putObject', s3Params, (err, data) => {
//   //   if(err){
//   //     console.log(err);
//   //     return res.end();
//   //   }
//   //   const returnData = {
//   //     signedRequest: data,
//   //     url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
//   //   };
//   //   res.write(JSON.stringify(returnData));
//   //   res.end();
//   // });
// });


// function uploadToS3(fileContent) {
//   s3.createBucket(function () {
//     const params = {
//       Bucket: BUCKET_NAME,
//       Key: `user-${new Date().getTime()}.csv`,
//       Expires: 60,
//       ContentType: fileType,
//       ACL: 'public-read'
//     };
//     s3.upload(params, function (err, data) {
//       if (err) {
//         console.log('error in callback');
//         console.log(err);
//       }
//       console.log('success');
//       console.log(data);
//     });
//   });
// }
