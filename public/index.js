
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

// the final csv table
var comparison_table;

//response time vars
var rt_start = new Date();
var rt_end = new Date();


// used to keep track of shuffled locations
var indicies = [];

var info={

    timeOpened:new Date(),
    timezone:(new Date()).getTimezoneOffset()/60,

    pageon(){return window.location.pathname},
    referrer(){return document.referrer},
    previousSites(){return history.length},

    browserName(){return navigator.appName},
    browserEngine(){return navigator.product},
    browserVersion1a(){return navigator.appVersion},
    browserVersion1b(){return navigator.userAgent},
    browserLanguage(){return navigator.language},
    browserOnline(){return navigator.onLine},
    browserPlatform(){return navigator.platform},
    javaEnabled(){return navigator.javaEnabled()},
    dataCookiesEnabled(){return navigator.cookieEnabled},
    dataCookies1(){return document.cookie},
    dataCookies2(){return decodeURIComponent(document.cookie.split(";"))},
    dataStorage(){return localStorage},

    sizeScreenW(){return screen.width},
    sizeScreenH(){return screen.height},
    sizeDocW(){return document.width},
    sizeDocH(){return document.height},
    sizeInW(){return innerWidth},
    sizeInH(){return innerHeight},
    sizeAvailW(){return screen.availWidth},
    sizeAvailH(){return screen.availHeight},
    scrColorDepth(){return screen.colorDepth},
    scrPixelDepth(){return screen.pixelDepth},


    latitude(){return position.coords.latitude},
    longitude(){return position.coords.longitude},
    accuracy(){return position.coords.accuracy},
    altitude(){return position.coords.altitude},
    altitudeAccuracy(){return position.coords.altitudeAccuracy},
    heading(){return position.coords.heading},
    speed(){return position.coords.speed},
    timestamp(){return position.timestamp},


    };

  console.log(info);
  console.log(navigator);
  console.log(screen);


//
function setImages(size){
  var lImg = document.getElementById("l_img");
  var rImg = document.getElementById("r_img");

  //if (trialCount == 129 || trialCount == 258) {
  if (trialCount == 258 || trialCount == 516) {
    takeBreak();
    trialCount++;
  } else if (trialCount == 773){
    // end of experiment

    //display end info and link to qualtrics survey
    document.getElementById("exp_header_question").style.display = "none";
    document.getElementById("exp_header_question").hidden = true;
    document.getElementById("end_of_intruction_text").style.display = "block";
    document.getElementById("end_of_intruction_text").hidden = false;
    document.getElementById("survey_link").style.display = "block";
    document.getElementById("survey_link").hidden = false;
    document.getElementById("left").style.display = "none";
    document.getElementById("right").style.display = "none";
    document.getElementById("cross").style.display = "none";

    //generate file
    var csvContent = comparison_table.getArray().join('\n');
    var header = 'index,left,right,choice,choice_method,response_time\n';
    var csv = header + csvContent + "\ninfo," + navigator.appCodeName + "," + navigator.oscpu + "," + "screen width : " + screen.width + ", availscreen width : " + screen.availWidth;
    var blob = new Blob([csv], {type: 'text/csv'});
    var file = new File([blob], "newcsv", {type: "text/csv"});

    var formData=new FormData();
    formData.append("uploadCsv",file);

    // upload file
    getSignedRequest(file);

  } else {
    lImg.src = l_images[trialCount].src;
    rImg.src = r_images[trialCount].src;
    trialCount++;

    // add the displayed svgs to the array tracking whats shown
    comparisons.push(GetFilename(l_images[trialCount].src))
    comparisons.push(GetFilename(r_images[trialCount].src))
    //console.log("comparing " + l_images[trialCount].src + " to " + r_images[trialCount].src);
  }
  //console.log(comparison_table);
  console.log(trialCount + "/" + l_images.length);
  console.log();
}

// loads the comparison info
function preload() {
  table = loadTable('Eto.csv', 'csv', 'header');
}

// reads the comparison info and shuffle the arrays
function setup() {

  //count the columns
  //print(table.getRowCount() + ' total rows in table');
  //print(table.getColumnCount() + ' total columns in table');

  //cycle through the table
  for (let r = 0; r < table.getRowCount(); r++)
    for (let c = 0; c < table.getColumnCount()-1; c++) {
      //print(table.getString(r, c));
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
    //console.log();
  }

  // shuffle the array to show comparisons in different order each time
  //shuffle(l_images,r_images);
  shuffleLeft(l_images);
  shuffleRight(r_images);
  //shuffled_l_images = shuffled_imgs[0];
  //shuffled_r_images = shuffled_imgs[1];
  // console.log("l_images len :" + l_images.length);
  // console.log("shuffled left :" + shuffled_l_images);
  // console.log("shuffled left :" + shuffled_r_images);
  //console.log(shuffled_l_images);
}

// called when begin is pressed
//
function start(){
  // preload();
  // setup();

  comparison_table = new p5.Table();
  comparison_table.addColumn('index');
  comparison_table.addColumn('left');
  comparison_table.addColumn('right');
  comparison_table.addColumn('choice');
  comparison_table.addColumn('choice_method');
  comparison_table.addColumn('response_time');

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

  // show static after 1 second
  setTimeout(() => {
    lImg.src = "static.jpg";
    rImg.src = "static.jpg";
  }, 1000);

  // remove static image
  setTimeout(() => {
      rt_start = new Date();
      lImg.src = "blank.svg";
      rImg.src = "blank.svg";
      buttons_busy = false;
      document.getElementById("experiment_btn_left").disabled = false;
      document.getElementById("experiment_btn_right").disabled = false;
      lButton.style.background = '#808080';
      rButton.style.background = '#808080';
  }, 2000);


  console.log(l_images);
  console.log(r_images);

}

function leftImage(choice_method){
    if (choice_method == null){
      choice_method = "click";
    }
    rt_end = new Date();

    let newRow = comparison_table.addRow();
    newRow.setNum('index', trialCount-1);
    newRow.setString('left', comparisons.slice(-2)[0]);
    newRow.setString('right', comparisons.slice(-1)[0]);
    newRow.setString('choice', 'left');
    newRow.setString('choice_method', choice_method);
    var diff = rt_end - rt_start; //in ms
    // strip the ms
    diff /= 1000;

    console.log(diff + " seconds");
    newRow.setNum('response_time', diff);

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
    }, 1000);

    // set left and right img for 0.5 seconds
    // hide cross
    setTimeout(() => {
      lImg.src = "static.jpg";
      rImg.src = "static.jpg";
      document.getElementById("cross").style.display = "none";
    }, 2000);

    // remove static image
    setTimeout(() => {
        rt_start = new Date();
        lImg.src = "blank.svg";
        rImg.src = "blank.svg";
        buttons_busy = false;
        document.getElementById("experiment_btn_left").disabled = false;
        document.getElementById("experiment_btn_right").disabled = false;
        lButton.style.background = '#808080';
        rButton.style.background = '#808080';

    }, 3000);


}

function rightImage(choice_method){
  if (choice_method == null){
    choice_method = "click";
  }
  rt_end = new Date();

  let newRow = comparison_table.addRow();
  newRow.setNum('index', trialCount);
  newRow.setString('left', comparisons.slice(-2)[0]);
  newRow.setString('right', comparisons.slice(-1)[0]);
  newRow.setString('choice', 'right');
  newRow.setString('choice_method', choice_method);
  var diff = rt_end - rt_start; //in ms
  // strip the ms
  //timeDiff /= 1000;
  diff /= 1000;

  newRow.setNum('response_time', diff);

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
  }, 500);

  setTimeout(() => {
    // show the next svg
    setImages();
  }, 1000);

  // set left and right img for 0.5 seconds
  // hide cross
  setTimeout(() => {
    lImg.src = "static.jpg";
    rImg.src = "static.jpg";
    document.getElementById("cross").style.display = "none";
  }, 1500);

  // remove static image
  setTimeout(() => {
    rt_start = new Date();
    lImg.src = "blank.svg";
    rImg.src = "blank.svg";

    buttons_busy = false;
    lButton.disabled = false;
    rButton.disabled = false;
    lButton.style.background = '#808080';
    rButton.style.background = '#808080';

  }, 2500);

}

// shuffle the arrays
function shuffleLeft(array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];

    // And swap it with the current element.
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;

    indicies.push(randomIndex);
  }
}

// shuffle the arrays
function shuffleRight(array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;
  var i = 0;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = indicies[i];
    i += 1;
    currentIndex -= 1;

    temporaryValue = array[currentIndex];

    // And swap it with the current element.
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;

  }

  console.log(indicies);
}

function takeBreak(e) {
  document.getElementById("cross").style.display = "none";
  document.getElementById("timer").style.display = "block";
  document.getElementById("left").style.display = "none";
  document.getElementById("right").style.display = "none";

  var rn = new Date(); // get the time right now
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

  document.getElementById("exp_header_question").innerHTML = "You can take a break, but feel free to skip it if you would like."
}


function finishBreak(e) {
  document.getElementById("cross").style.display = "inline-block";

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

// Generates the body for the CSV file using the array
function arrayToCSV (array) {
  var lineArray = [];
  array.forEach(function (infoArray, index) {
    var line = infoArray.join(",");
    //lineArray.push(index == 0 ? "data:text/csv;charset=utf-8," + line : line);
    lineArray.push(index == 0 ? "" + line : line);
  });
  var csvFile = lineArray.join("\n");
  return csvFile;
}

// Get the signed request -> upload -> send the request
function getSignedRequest(file){
  const xhr = new XMLHttpRequest();
  //xhr.setRequestHeader('Content-Type', "text/csv")
  xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        const response = JSON.parse(xhr.responseText);
        uploadFile(file, response.signedRequest, response.url);
      }
      else{
        alert('Could not get signed URL.');
      }
    }
  };
  xhr.send();
}

// Uploads file to s3 using PUT
function uploadFile(file, signedRequest, url){
  const xhr = new XMLHttpRequest();
  xhr.open('PUT', signedRequest);
  xhr.setRequestHeader('Content-Type', "text/csv")
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4){
      if(xhr.status === 200){
        //console.log('upload to s3 success');
      }
      else{
        alert('Could not upload file.');
      }
    }
  };
  xhr.send(file);
}


// returns the ending of a hyperlink https:gridstudy.com/GETS_THIS
function GetFilename(url){
   if (url){
      var m = url.toString().match(/.*\/(.+?)\./);
      if (m && m.length > 1){
         return m[1];
      }
   }
   return "";
}
