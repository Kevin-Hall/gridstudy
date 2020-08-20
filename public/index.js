
var csvFileContent;


var trialOrder;
var l_images = [];
var r_images = [];

var shuffled_l_images = [];
var shuffled_r_images = [];

var trialCount = 0;

// csv setup
let table;
var words_raw = [];
var wordscount = 0;
var comparisons = [];

var buttons_busy = false;
var interval;

var last_choice_method;


var array = [0,9,8]

// the final csv table
var comparison_table;

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

  //if (trialCount == 129 || trialCount == 258) {
  if (trialCount == 3 || trialCount == 258) {
    takeBreak();
    trialCount++;
  } else if (trialCount == 387){

    // end of experiment
    document.getElementById("end_of_intruction_text").style.display = "block";
    document.getElementById("end_of_intruction_text").hidden = false;
    document.getElementById("survey_link").style.display = "block";
    document.getElementById("survey_link").hidden = false;
    document.getElementById("left").style.display = "none";
    document.getElementById("right").style.display = "none";
    document.getElementById("cross").style.display = "none";


    var csv = saveTable(comparison_table, 'test.csv');
  } else {
    lImg.src = l_images[trialCount].src;
    rImg.src = r_images[trialCount].src;
    trialCount++;

    comparisons.push(GetFilename(l_images[trialCount].src))
    comparisons.push(GetFilename(r_images[trialCount].src))
    console.log("comparing " + l_images[trialCount].src + " to " + r_images[trialCount].src);
  }
  console.log(comparison_table);
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

    l_images.push(r);
    r_images.push(l);
    console.log();
  }

  // shuffle the array to show comparisons in different order each time
  var shuffled_imgs = shuffle(l_images,r_images);
  shuffled_l_images = shuffled_imgs[0];
  shuffled_r_images = shuffled_imgs[1];

  console.log(shuffled_l_images);
}

function start(){
  //arrayToCSV(comparisons_test);

  comparison_table = new p5.Table();
  comparison_table.addColumn('index');
  comparison_table.addColumn('left');
  comparison_table.addColumn('right');
  comparison_table.addColumn('choice');
  comparison_table.addColumn('choice_method');
  comparison_table.addColumn('response_time');

  //
  // //let newRow = table.addRow();
  // newRow.setNum('id', table.getRowCount() - 1);
  // newRow.setString('species', 'Panthera leo');
  // newRow.setString('name', 'Lion');

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
         leftImage("key_press");
       }
     }
     if (key == 75) { // k
       // do a function
       if (!buttons_busy){
         rightImage("key_press");
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

function leftImage(choice_method){
    if (choice_method == null){
      choice_method = "click";
    }

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
    // hide cross
    setTimeout(() => {
      lImg.src = "static.jpg";
      rImg.src = "static.jpg";
      document.getElementById("cross").hidden = true;
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

    let newRow = comparison_table.addRow();
    newRow.setNum('index', trialCount-1);
    newRow.setString('left', comparisons.slice(-2)[0]);
    newRow.setString('right', comparisons.slice(-1)[0]);
    newRow.setString('choice', 'left');
    newRow.setString('choice_method', choice_method);
}

function rightImage(choice_method){
  if (choice_method == null){
    choice_method = "click";
  }

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
    document.getElementById("cross").style.display = "inline-block";
  }, 0);

  setTimeout(() => {
    // show the next svg
    setImages();
  }, 300);

  // set left and right img for 0.5 seconds
  // hide cross
  setTimeout(() => {
    lImg.src = "static.jpg";
    rImg.src = "static.jpg";
    document.getElementById("cross").style.display = "none";
  }, 1300);

  // remove static image
  setTimeout(() => {
    lImg.src = "blank.svg";
    rImg.src = "blank.svg";

      buttons_busy = false;
      lButton.disabled = false;
      rButton.disabled = false;
      lButton.style.background = '#808080';
      rButton.style.background = '#808080';
  }, 2300);

  let newRow = comparison_table.addRow();
  newRow.setNum('index', trialCount-1);
  newRow.setString('left', comparisons.slice(-2)[0]);
  newRow.setString('right', comparisons.slice(-1)[0]);
  newRow.setString('choice', 'right');
  newRow.setString('choice_method', choice_method);
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

  // const fileName = 'Eto.csv';
  //
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
  //
  // uploadFile();


  // var csv = saveTable(comparison_table, 'test.csv');

  var content = arrayToCSV(comparison_table.getArray());
  var encodedUri = encodeURI(content);
  //
  var blob = new Blob([JSON.stringify(content)]);
  var url = URL.createObjectURL(blob);

  //define new form
  var formData = new FormData();
  formData.append('csv', blob);

  var file = new File([blob], "newcsv");
  //getSignedRequest(content);



  //
  // setTimeout(() => {
  //   //const file = formData.files[0];
  // },0);

  //
  // var csv = saveTable(comparison_table, 'new.csv');
  //
  // var saveData = $.ajax({
  //     type: 'GET',
  //     url: "api/upload",
  //     data: csv,
  //     dataType: "json",
  //     success: function(resultData) { alert("Save Complete") }
  // });
  // saveData.error(function() { alert("Something went wrong"); });



  // $.post("/api/upload", function(comparisons_test) {
  //   console.log( "uploadcsv function");
  // });


  // $.ajax({
  //   url: 'superman',
  //   type: 'POST',
  //   data: jQuery.param({ field1: "hello", field2 : "hello2"}) ,
  //   contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
  //   success: function (response) {
  //       alert(response.status);
  //   },
  //   error: function () {
  //       alert("error");
  //   }
  // });

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

function arrayToCSV (data) {
  var lineArray = [];
  data.forEach(function (infoArray, index) {
    var line = infoArray.join(",");
    lineArray.push(index == 0 ? "data:text/csv;charset=utf-8," + line : line);
  });
  var csvFile = lineArray.join("\n");
  return csvFile;
}

function getSignedRequest(fileContent){
  console.log("getSignedUrl");
  console.log(fileContent);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', `/sign-s3?file-name=${"hey"}&file-content=${fileContent}`);
  // xhr.onreadystatechange = () => {
  //   if(xhr.readyState === 4){
  //     if(xhr.status === 200){
  //       const response = JSON.parse(xhr.responseText);
  //       //uploadFile(file, response.signedRequest, response.url);
  //     } else{
  //       alert('Could not get signed URL.');
  //     }
  //   }
  // };
  xhr.send();
}


function uploadFile(file, signedRequest, url){
  console.console.log(file);
  console.console.log(signedRequest);
  console.console.log(url);
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', signedRequest);
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        //document.getElementById('preview').src = url;
        //document.getElementById('avatar-url').value = url;
        alert('upload success');
      }
      else{
        alert('Could not upload file.');
      }
    }
  };
  xhr.send(file);
}




function GetFilename(url){
   if (url)
   {
      var m = url.toString().match(/.*\/(.+?)\./);
      if (m && m.length > 1)
      {
         return m[1];
      }
   }
   return "";
}
