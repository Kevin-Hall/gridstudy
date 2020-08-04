

var csvComparisonData;

// used to ungray button when correct answer is chosen
var tutorial_passed = false;

// used for blocking button press while changing trial images
var buttons_busy = false;


function loadCSV(){
    Papa.parse("http://node-express-env.eba-3j7cikm9.us-east-2.elasticbeanstalk.com/Eto.csv", {
        download: true,
        complete: function(results) {
            i = 1;
            console.log(results);
            //csvComparisonData = results.data;
            results.data.forEach(function(entry){
              csvComparisonData = entry;
              console.console.log(entry);
            });
         }
    });
}

var index = 0;
function next(e){

  if (index == 0){
    window.location.href = "instructions_2.html";
  } else if (index == 1){
    window.location.href = "instructions_3.html";
  } else if (index == 2){
    window.location.href = "instructions_4.html";
  } else if (index == 3){
    window.location.href = "instructions_5.html";
  }
  index++;
}

function signedConsent(signed){
  if (signed == 1) {
    go_page_one();
  } else {
    document.getElementById("container").style.display = "none";
    alert("Please close the window");
  }
}

function go_page_one(e){
  window.location.href = "instructions.html";
  tutorial_passed = false;
}

var instructions_shown = false
var ask_to_max = false
function go_page_two(e){
  if (!ask_to_max){
      alert("Please maximize your browser");
      ask_to_max = true;
  }else if (!instructions_shown){
    document.getElementById("intro_text").innerHTML = "You will be looking at two icon arrays, A (on the left) and B (on the right).<br><br>Choose the one you believe has more <u><b>percentage<b><u> of black dots.";
    instructions_shown = true;
  } else {
    window.location.href = "instructions_2.html";
    tutorial_passed = false;
  }
}
function go_page_three(e){
  if (tutorial_passed == true) {
    window.location.href = "instructions_3.html";
    tutorial_passed = false;
  } else {
      alert("Choose the correct answer to proceed.");
  }
}
function go_page_four(e){
  if (tutorial_passed == true) {
    window.location.href = "instructions_4.html";
    tutorial_passed = false;
  } else {
      alert("Choose the correct answer to proceed.");
  }
}
function go_page_five(e){
  if (tutorial_passed == true) {
    window.location.href = "instructions_5.html";
    tutorial_passed = false;
  } else {
      alert("Choose the correct answer to proceed.");
  }
}

var shown_end_instruction = false;

function go_to_fast_practice(e){
  var limg = document.getElementById("instruction_img_left");
  var rimg = document.getElementById("instruction_img_right");
  var lbla = document.getElementById("icon_labelA");
  var lblb = document.getElementById("icon_labelB");
  var btna = document.getElementById("L");
  var btnb = document.getElementById("R");
  var eoi_text = document.getElementById("end_of_intruction_text");

  if (shown_end_instruction == false){
    limg.src = "blank.svg";
    rimg.src = "blank.svg";
    lbla.style.display = "none";
    lblb.style.display = "none";
    btna.style.display = "none";
    btnb.style.display = "none";
    eoi_text.style.display = "block";
    shown_end_instruction = true;

  } else {
    window.location.href = "fastPractice.html"
  }
}

function go_to_experiment(e){
    window.location.href = "grids.html"
}


function wrong_answer(index){
  if (index == 0){
    alert("Incorrect. \n B has half the amount of black filled in as A.");
  } else if (index == 1){
    alert("Incorrect. \n B has more black dots however A has more percentage of black");
  } else if (index == 2){
    alert("Incorrect. \n B has more black dots however A has more percentage of black");
  } else if (index == 3){
    alert("Incorrect. \n B has half the amount of black filled in as A.");
  }
}

function right_answer(index){

  if (index == 0){
    alert("Correct. \n\n A has more black filled in than B");
    document.getElementById("Next").style.background='#808080';
  } else if (index == 1){
    alert("Correct. \n\n A has a lower absolute number of black dots, but a higher percentage black dots. So in this case, A is the right choice.");
    document.getElementById("Next").style.background='#808080';
  } else if (index == 2){
    alert("Correct. \n\n Another case showing that arrangement shouldn’t matter. In this case, it should be B since it almost has 50% black dots, whereas A as far fewer than 50%)! ");
    document.getElementById("Next").style.background='#808080';
  } else if (index == 3){
    alert("Correct. \n\n Another case showing that arrangement shouldn’t matter. In this case, it should be B since it almost has 50% black dots, whereas A as far fewer than 50%)! ");
    document.getElementById("Next").style.background='#808080';
  }
  tutorial_passed = true;
}


// fast practice trials

var l_images = [];
var r_images = [];

var fast_practice_finished = false;

function begin_fast_practice(){

  if (fast_practice_finished){
    go_to_experiment();
  }

  window.onkeyup = function(e) {
     var key = e.keyCode ? e.keyCode : e.which;

     if (key == 83) { // s
       // do a function
       if (!buttons_busy){
         next_icon_grids();
       }
     }
     if (key == 75) { // k
       // do a function
       if (!buttons_busy){
         next_icon_grids();
       }
     }
  }

  // //hide begin button
  document.getElementById("Begin").style.display = "none";

  //show left and right buttons
  document.getElementById("fast_lbtn").style.display = "inline-block";
  document.getElementById("fast_rbtn").style.display = "inline-block";
  document.getElementById("cross").style.display = "inline-block";


  for(var i = 0;i <= 5;i++){

    var left = "FastExample" + i + "_A";
    var right = "FastExample" + i + "_B"

    var l = new Image();
    l.src = left + ".svg";
    var r = new Image();
    r.src = right + ".svg";

    l_images.push(l);
    r_images.push(r);

    console.log(left);
    console.log(right);
    console.log();
    //code here using lines[i] which will give you each line
    //console.log(lines[i]);
  }
  setTimeout(() => {
    next_icon_grids();
  }, 300);
}


index = 0;
function next_icon_grids(){
  var lImg = document.getElementById("left_img");
  var rImg = document.getElementById("right_img");
  var lButton = document.getElementById("fast_lbtn");
  var rButton = document.getElementById("fast_rbtn");

  var ldiv = document.getElementById("left");
  var rdiv = document.getElementById("right");
  var eoi_text = document.getElementById("end_of_intruction_text");


  if (index > 3){
    ldiv.style.display = "none";
    rdiv.style.display = "none";
    eoi_text.style.display = "block";

    document.getElementById("Begin").style.display = "block";
    document.getElementById("Begin").innerHTML = "Next";
    document.getElementById("cross").style.display = "none";
    document.getElementById("header").style.display = "none";
    fast_practice_finished = true;

  } else {
      buttons_busy = true;
      document.getElementById("fast_lbtn").disabled = true;
      document.getElementById("fast_rbtn").disabled = true;
      setTimeout(() => {
        // show the next svg
        lImg.src = l_images[index].src;
        rImg.src = r_images[index].src;
      }, 100);

      // set left and right img for 0.5 seconds
      setTimeout(() => {
        lImg.src = "static.jpg";
        rImg.src = "static.jpg";
      }, 1100);

      // remove static image
      setTimeout(() => {
          lImg.src = "blank.svg";
          rImg.src = "blank.svg";
          buttons_busy = false;
          document.getElementById("fast_lbtn").disabled = false;
          document.getElementById("fast_rbtn").disabled = false;
      }, 2100);
  }
  index++;
}



//loadCSV();

// var words = csvComparisonData.split(',');

// for(var i = 0;i < words.length/8;i++){
//   //var words = lines[i].split(',');
//   //console.log(words[i]);
//
//   var Left_id = words[0+i*8];
//   var Left_Arrangement = words[1+i*8];
//   var Left_Percentage = words[2+i*8];
//   var Left_Size = words[3+i*8];
//   var Right_id = words[4+i*8];
//   var Right_Arrangement = words[5+i*8];
//   var Right_Percentage = words[6+i*8];
//   var Right_Size = words[7+i*8];
//
//   var left = Left_id + "_" + Left_Arrangement + "_" + Left_Percentage + "_" + Left_Size;
//   var right = Right_id + "_" + Right_Arrangement + "_" + Right_Percentage + "_" + Right_Size;
//
//   var l = new Image();
//   l.src = left + ".svg";;
//   var r = new Image();
//   r.src = right + ".svg";
//
//   // left_images.push(l);
//   // right_images.push(r);
//
//   console.log(left);
//   console.log(right);
// }


//window.location.href = "grids.html";

// var nextParagraph = document.getElementById("1");
// nextParagraph.style.display = "none";
//
// var nextParagraph = document.getElementById("2");
// nextParagraph.style.display = "block";
