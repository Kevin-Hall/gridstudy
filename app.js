

var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    html = fs.readFileSync('consent.html');

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};













const express = require('express');
const path = require('path');
const app = express();


// -- public keys

var bucketName = "BUCKET_NAME";
var bucketRegion = "REGION";
var IdentityPoolId = "IDENTITY_POOL_ID";

var consent = require('./public/consent');

//app.use(express.static('public'));

//app.use(express.static(path.join(__dirname, '/')));
//app.use('/public', express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/consent.html'));
});

// exports.index = function(req, res) {
//  res.render('consent', {title: 'consent page'});
// };
//
// exports.add_consent = function(req, res) {
// };

app.get('/consent', consent.index);
app.post('/add_consent', consent.add_hike);



app.listen(port, () => {
    console.log("hello log");
})


// var AWS = require('aws-sdk');
// var s3 = new AWS.S3();
//
// var credentials = new AWS.SharedIniFileCredentials({profile: '....'});
// AWS.config.credentials = credentials;
//
//
// var params = {
//     Bucket: 'gridstudy',
//     Key: 'output.csv',
//     Body: csvFileContent,
//     ContentType: 'application/octet-stream',
//     ContentDisposition: contentDisposition(filePath, {
//         type: 'inline'
//     }),
//     CacheControl: 'public, max-age=86400'
// }


// s3.putObject(params, function(err, data) {
//     if (err) {
//         console.log("Error at uploadCSVFileOnS3Bucket function", err);
//         next(err);
//     } else {
//         console.log("File uploaded Successfully");
//         next(null, filePath);
//     }
// });

// function addCsv(csvName) {
//   var files = document.getElementById("").files;
//   if (!files.length) {
//     return alert("Please choose a file to upload first.");
//   }
//   var file = files[0];
//   var fileName = file.name;
//   var csvKey = encodeURIComponent(csvName) + "/";
//   var bucketName = "gridstudy"
//
//   // Use S3 ManagedUpload class as it supports multipart uploads
//   var upload = new AWS.S3.ManagedUpload({
//     params: {
//       Bucket: bucketName,
//       Key: csvKey,
//       Body: file,
//       ACL: "public-read"
//     }
//   });
//
//   var promise = upload.promise();
//
//   promise.then(
//     function(data) {
//       alert("Successfully uploaded csv file.");
//       viewAlbum(albumName);
//     },
//     function(err) {
//       return alert("There was an error uploading the file: ", err.message);
//     }
//   );
// }
