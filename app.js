
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
  uploadCsv("hello,test\n");
  res.sendfile('public/index.html');
});

// app.post('/api/upload', function (req, res) {
//   // This grabs the additional parameters so in this case passing in
//
//   // Grabs your file object from the request.
//   //const file = req.files.comparisons_test;
//   const file = req.query.data;
//   console.log(file);
//
//   // Begins the upload to the AWS S3
//   uploadToS3(file);
// });

app.post("/api/upload", function (req, res) {
    //const folder = (req.user.username + "/");
    const file = (req.body.imageUpload);
    const params = {
      Bucket: BUCKET_NAME,
      Key: `user-${new Date().getTime()}.csv`,
      Expires: 60,
      ACL: 'public-read',
      Body: file
    };
    console.log("Folder name: " + folder);
    console.log("File: " + file);


    s3.putObject(params, function (err, data) {
      if (err) {
        console.log("Error: ", err);
      } else {
        console.log(data);
      }
    });
    res.redirect("/grids.html");
  });

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

// const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
// const records = require('../data');
// const ResponseService = require('../services/responseService');
//
//
// module.exports = {
//
//     /**
//      * This function will generate a stringified csv and upload to AWS S3 as a csv
//      * @param {Object} req
//      * @param {Object} res
//      */
//     generateCsv: (req, res) => {
//
//         try {
//             const csvStringifier = createCsvStringifier({
//                 header: [
//                     {id: 'name', title: 'NAME'},
//                     {id: 'lang', title: 'LANGUAGE'}
//                 ]
//             });
//
//             const csv = csvStringifier.stringifyRecords(records);
//
//             const params = {
//                 Bucket: process.env.AWS_BUCKET, // pass your bucket name
//                 Key: `users-${new Date().getTime()}.csv`, // file will be saved as testBucket/contacts.csv
//                 ACL: "public-read",
//                 Body: csv,
//                 ContentType: "text/csv",
//             };
//
//             s3.upload(params, function (s3Err, data) {
//                 if (s3Err) throw s3Err;
//                 else {
//                 return ResponseService.json(201, res, "File created successfully", {
//                     redirectUri: data.Location,
//                 });
//                 }
//             });
//
//         } catch(e) {
//             return ResponseService.error(
//                 e,
//                 res
//             );
//         }
//     }
// }

//const fileName = 'Eto.csv';

//app.post('/api/upload', uploadCsv);

// function uploadCsv(datacontents){
//   const uploadFile = () => {
//      const params = {
//          Bucket: 'gridstudy', // pass your bucket name
//          Key: `user-${new Date().getTime()}.csv`, // file will be saved as testBucket/contacts.csv
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

const fs = require('fs')

const send = async () => {
  const rs = fs.createReadStream('./eto.csv')
  rs.on('open', () => {
    console.log('OPEN')
  })
  rs.on('end', () => {
    console.log('END')
  })
  rs.on('close', () => {
    console.log('CLOSE')
  })
  // rs.on('data', (chunk) => {
  //   console.log('DATA: ', chunk)
  // })

  console.log('START UPLOAD')

  const response = await s3.upload({
    Bucket: 'test-bucket',
    Key: 'output.csv',
    Body: rs,
  }).promise()

  console.log('response:')
  console.log(response)
}

send().catch(err => { console.log(err) })

var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Express app listening at http://%s:%s', host, port)
})
