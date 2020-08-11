
var csvFileContent;


var trialOrder;
var l_images = [];
var r_images = [];

var shuffled_l_images = [];
var shuffled_r_images = [];

var trialCount = 1;

// csv setup
let table;
var words_raw = [];
var wordscount = 0;
var comparisons = [];

var buttons_busy = false;
var interval;


var comparisons_test = [["grid1","grid2","grid1"],["grid1","grid2","grid1"],["grid1","grid2","grid1"],["grid1","grid2","grid1"],["grid1","grid2","grid1"]]

// var s3 = new AWS.S3();
// var params = {
//     Bucket: BUCKET_NAME,
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

function setImages(size){
  var lImg = document.getElementById("l_img");
  var rImg = document.getElementById("r_img");

  if (trialCount == 4 || trialCount == 129) {
    takeBreak();
    trialCount++;
  } else {
    lImg.src = l_images[trialCount].src;
    rImg.src = r_images[trialCount].src;
    trialCount++;

    comparisons.push("comparing " + l_images[trialCount].src + " to " + r_images[trialCount].src)
    console.log("comparing " + l_images[trialCount].src + " to " + r_images[trialCount].src);
  }
}

function preload() {
  table = loadTable('Eto.csv', 'csv', 'header');
}

function setup() {
  //table = loadTable('Eto.csv', 'csv', 'header');

  //count the columns
  print(table.getRowCount() + ' total rows in table');
  print(table.getColumnCount() + ' total columns in table');

  //cycle through the table
  for (let r = 0; r < table.getRowCount(); r++)
    for (let c = 0; c < table.getColumnCount()-1; c++) {
      print(table.getString(r, c));
      words_raw[wordscount] = table.getString(r, c);
      wordscount++;
    }

  //console.log(words_raw); // prints the whole file contents

  var words = words_raw;

  for(var i = 0;i < words.length/8;i++){
    //var words = lines[i].split(',');
    //console.log(words[i]);

    var Left_id = words[0+i*8];
    var Left_Arrangement = words[1+i*8];
    var Left_Percentage = words[2+i*8];
    var Left_Size = words[3+i*8];
    var Right_id = words[4+i*8];
    var Right_Arrangement = words[5+i*8];
    var Right_Percentage = words[6+i*8];
    var Right_Size = words[7+i*8];

    var left = Left_id + "_" + Left_Arrangement + "_" + Left_Percentage + "_" + Left_Size;
    var right = Right_id + "_" + Right_Arrangement + "_" + Right_Percentage + "_" + Right_Size;

    var l = new Image();
    l.src = "./svgs/" + left + ".svg";;
    var r = new Image();
    r.src = "./svgs/" + right + ".svg";

    l_images.push(l);
    r_images.push(r);
    console.log();
  }

  // shuffle the array to show comparisons in different order each time
  var shuffled_imgs = shuffle(l_images,r_images);
  shuffled_l_images = shuffled_imgs[0];
  shuffled_r_images = shuffled_imgs[1];
}

function start(){
  //arrayToCSV(comparisons_test);


  // table = new p5.Table();
  //
  // table.addColumn('id');
  // table.addColumn('species');
  // table.addColumn('name');
  //
  // //let newRow = table.addRow();
  // newRow.setNum('id', table.getRowCount() - 1);
  // newRow.setString('species', 'Panthera leo');
  // newRow.setString('name', 'Lion');
  //
  // // To save, un-comment next line then click 'run'
  // saveTable(table, 'user_output.csv');

  preload();
  setup();

  document.getElementById("experiment_btn_left").style.display = "inline-block";
  document.getElementById("experiment_btn_right").style.display = "inline-block";

  var startButton = document.getElementById("Begin");
  var lButton = document.getElementById("experiment_btn_left");
  var rButton = document.getElementById("experiment_btn_right");

  var lImg = document.getElementById("l_img");
  var rImg = document.getElementById("r_img");

  window.onkeyup = function(e) {
     var key = e.keyCode ? e.keyCode : e.which;

     if (key == 83) { // s
       // do a function
       if (!buttons_busy){
         leftImage();
       }
     }
     if (key == 75) { // k
       // do a function
       if (!buttons_busy){
         rightImage();
       }
     }
  }

  //hide the start buttond
  startButton.style.display = "none";

  // show the next svg
  setImages();
  buttons_busy = true;
  document.getElementById("experiment_btn_left").disabled = true;
  document.getElementById("experiment_btn_right").disabled = true;
  lButton.style.background = '#C4C4C4';
  rButton.style.background = '#C4C4C4';


  setTimeout(() => {
    lImg.src = "static.jpg";
    rImg.src = "static.jpg";
  }, 1000);

  // remove static image
  setTimeout(() => {
      lImg.src = "blank.svg";
      rImg.src = "blank.svg";
      buttons_busy = false;
      document.getElementById("experiment_btn_left").disabled = false;
      document.getElementById("experiment_btn_right").disabled = false;
      lButton.style.background = '#808080';
      rButton.style.background = '#808080';
  }, 2000);

}

function leftImage(element){
    var lImg = document.getElementById("l_img");
    var rImg = document.getElementById("r_img");
    var lButton = document.getElementById("experiment_btn_left");
    var rButton = document.getElementById("experiment_btn_right");

    lButton.style.background = '#C4C4C4';
    rButton.style.background = '#C4C4C4';
    lButton.disabled = true;
    rButton.disabled = true;
    buttons_busy = true;

    setTimeout(() => {
      // show the next svg
      setImages();
    }, 0);


    // set left and right img for 0.5 seconds
    setTimeout(() => {
      lImg.src = "static.jpg";
      rImg.src = "static.jpg";
    }, 1000);

    // remove static image
    setTimeout(() => {
        lImg.src = "blank.svg";
        rImg.src = "blank.svg";
        buttons_busy = false;
        document.getElementById("experiment_btn_left").disabled = false;
        document.getElementById("experiment_btn_right").disabled = false;
        lButton.style.background = '#808080';
        rButton.style.background = '#808080';
    }, 2000);

}

function rightImage(element){
  var lImg = document.getElementById("l_img");
  var rImg = document.getElementById("r_img");
  var lButton = document.getElementById("experiment_btn_left");
  var rButton = document.getElementById("experiment_btn_right");

  lButton.style.background = '#C4C4C4';
  rButton.style.background = '#C4C4C4';

  lButton.disabled = true;
  rButton.disabled = true;
  buttons_busy = true;

  setTimeout(() => {
    // show the next svg
    setImages();
  }, 0);

  // set left and right img for 0.5 seconds
  setTimeout(() => {
    lImg.src = "static.jpg";
    rImg.src = "static.jpg";
  }, 1000);

  // remove static image
  setTimeout(() => {
      lImg.src = "blank.svg";
      rImg.src = "blank.svg";

      buttons_busy = false;
      lButton.disabled = false;
      rButton.disabled = false;
      lButton.style.background = '#808080';
      rButton.style.background = '#808080';
  }, 2000);

}

// shuffle the arrays
function shuffle(array,array2) {
  var currentIndex = array.length, temporaryValue, temporaryValue2, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;

    temporaryValue2 = array2[currentIndex];
    array2[currentIndex] = array2[randomIndex];
    array2[randomIndex] = temporaryValue2;
  }

  return [array,array2];
}

function takeBreak(e) {

  const fileName = 'Eto.csv';

  const uploadFile = () => {
    const params = {
        Bucket: 'gridstudy', // pass your bucket name
        Key: 'test2.csv', // file will be saved as testBucket/contacts.csv
        Body: arrayToCSV(comparisons)
    };
    s3.upload(params, function(s3Err, data) {
        if (s3Err) throw s3Err
        console.log(`File uploaded successfully at ${data.Location}`)
    });
  };

  uploadFile();

  document.getElementById("timer").style.display = "block";
  document.getElementById("left").style.display = "none";
  document.getElementById("right").style.display = "none";

  var rn = new Date();
  var countDownDate = new Date(rn.getTime() + 5*60000); // 5 minute countdown

  // Update the count down every 1 second
  interval = setInterval(function() {

    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    document.getElementById("timer").innerHTML =
    minutes + "m " + seconds + "s" + "<br>" + "skip break";

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(interval);
      document.getElementById("timer").innerHTML = "Continue Experiment";
    }
  }, 1000);

  document.getElementById("exp_header_question").innerHTML = "Now, you can take a break"
}


function finishBreak(e) {

  clearInterval(interval);

  console.log("finish break");
  document.getElementById("timer").style.display = "none";
  document.getElementById("left").style.display = "block";
  document.getElementById("right").style.display = "block";
  //
  var lImg = document.getElementById("l_img");
  var rImg = document.getElementById("r_img");
  var lButton = document.getElementById("experiment_btn_left");
  var rButton = document.getElementById("experiment_btn_right");

  lButton.style.display = "inline-block";
  rButton.style.display = "inline-block";

  setTimeout(() => {
    // show the next svg
    setImages();
  }, 1000);
  buttons_busy = true;
  document.getElementById("experiment_btn_left").disabled = true;
  document.getElementById("experiment_btn_right").disabled = true;
  lButton.style.background = '#C4C4C4';
  rButton.style.background = '#C4C4C4';


  setTimeout(() => {
    lImg.src = "static.jpg";
    rImg.src = "static.jpg";
  }, 2000);

  // remove static image
  setTimeout(() => {
      lImg.src = "blank.svg";
      rImg.src = "blank.svg";
      buttons_busy = false;
      document.getElementById("experiment_btn_left").disabled = false;
      document.getElementById("experiment_btn_right").disabled = false;
      lButton.style.background = '#808080';
      rButton.style.background = '#808080';
  }, 3000);

  document.getElementById("exp_header_question").innerHTML = "<br>Which has a higher <b>percentage</b> black?<br><br><br>"
}


function arrayToCSV (rows) {
    //  Modified from: http://stackoverflow.com/questions/17836273/
    //  export-javascript-data-to-csv-file-without-server-interaction
    var csvRows = [];
    for (var i = 0; i < rows.length; ++i) {
        for (var j = 0; j < rows[i].length; ++j) {
            rows[i][j] = '\"' + rows[i][j] + '\"';  // Handle elements that contain commas
        }
        csvRows.push(rows[i].join(','));
    }
    var csvString = csvRows.join('\r\n');
    return csvString;

    // let csvContent = "data:text/csv;charset=utf-8,";
    //
    // rows.forEach(function(rowArray) {
    //     let row = rowArray.join(",");
    //     csvContent += row + "\r\n";
    // });
    //
    // return csvContent;


    // var a         = document.createElement('a');
    // a.href        = 'data:attachment/csv,' + csvString;
    // a.target      = '_blank';
    // a.download    = 'myFile.csv';
    //
    // document.body.appendChild(a);
    // a.click();
    // Optional: Remove <a> from <body> after done
}
