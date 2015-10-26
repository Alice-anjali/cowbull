var sendWord;
var mainWord;
var connected = false;
var noOfAns = 0;
var currAns;
var cow,bull;
var game =1 , multi =false;
var playerName , opponentName;
jQuery(document).ready(function($){
  playerName = prompt("Enter your Name");
  $('.info').text("Hello "+playerName);
  multi = confirm("Do you want to play multiplayer ? ");
  if(multi)
    sendWord = prompt("Enter a word to send to opponent !").toUpperCase();
  else
    mainWord = prompt("Enter the hidden word to play !").toUpperCase();
  if(multi && !connected)
  {
    $('input').hide();
    socket.emit('getnewgame' , playerName);
  }
});
//newword is called when user inputs a words in the input box and press Enter
var newword = function(ele) {
    if(event.keyCode == 13) {
        currAns = ele.value.toUpperCase();
        if(check(currAns)){
          $('.answerlist').append("<li>" + currAns + "</li>");
          ele.value = '';
          $('input').css('border-color' , 'green');
          generatecb(currAns);
          $('.markslist').append("<li>" + cow + "/" + bull + "</li>");
          noOfAns++;
          checkwin();
        }
        else{
          $('input').css('border-color' , 'red');
        }
    }
};
//Check validity of words
var check = function(ans){
  if(ans.length != 4)
  {
    alert("Only 4 letter words are allowed !");
    return 0;
  }
  for(var i=0;i<4;i++)
  {
    for(var j=i+1;j<4;j++)
    {
      if(ans[i]==ans[j])
      {
          alert("Repeated Letters not allowed !");
          return 0;
      }
    }
  }
  return 1;
};
//Generates cow and bull marks for the current word
var generatecb = function(word){
  cow=0;bull=0;
  for(var i=0;i<4;i++)
  {
    for(var j=0;j<4;j++)
    {
      if(word[i]===mainWord[j])
      {
        if(i==j)
          bull++;
        else
          cow++;
        break;
      }
    }
  }
};
var checkwin = function(){
  if(currAns === mainWord)
  {
    game = 0;
    $('.info').append("<br> You have won !!");
    $('.game').css('border-color' , 'green');
    $('#titleqstn').css('color' , 'green');
    $('#titlemarks').css('color' , 'green');
    $('#inputbox').hide();
    document.getElementById('titleqstn').innerHTML = mainWord;
    socket.emit('message' , playerName + " has won in  " + noOfAns + " tries !");
  }
  else if (noOfAns == 9)
  {
    game = 0;
    $('.info').append("<br> You have lost !!");
    $('.game').css('border-color' , 'red');
    $('#inputbox').hide();
    document.getElementById('titleqstn').innerHTML = mainWord;
    $('#titleqstn').css('color' , 'red');
    $('#titlemarks').css('color' , 'red');
    socket.emit('message' , opponentName + " has lost !");
  }
};
//resets the game.
var reset = function(){
  if(!multi)
  {
    game =1;
    noOfAns = 0;
    document.getElementById('titleqstn').innerHTML = "_ _ _ _";
    $('.game').css('border-color' , 'black');
    $('#titleqstn').css('color' , 'black');
    $('#titlemarks').css('color' , 'black');
    $('#inputbox').show();
    $('.markslist').children().remove();
    $('.answerlist').children().remove();
    mainWord = prompt("Enter the hidden word ! ").toUpperCase();
    $('input').show();
  }
  else
  {
    socket.emit('askgamereset');
  }
};
var initializegame = function(){
  game = 1;
};
socket.on('getnewgame' , function(name){
  //console.log("Get newgame ping recieved");
  opponentName = name;
  $('#opponent').text(opponentName);
  socket.emit('newgame',sendWord);
  if(!connected)
  {
    socket.emit('getnewgame',playerName);
  }
});
socket.on('newgame',function(word){
  console.log("newgame ping recieved");
  //console.log("Word is " + word);
  mainWord = word;
  $('.info').append("<br>New Word recieved ! <br>Start playing !");
  connected = true;
  $('input').show();
});
socket.on('askgamereset',function(){
  if(confirm(opponentName + " has asked to reset the game. Do you wish to accept ?"))
  {
    socket.emit('gamereset'); 
  }
  else
  {
    socket.emit('message' , "Reset Denied");
  }
});
socket.on('gamereset',function(){
  game =1;
  noOfAns = 0;
  document.getElementById('titleqstn').innerHTML = "_ _ _ _";
  $('.game').css('border-color' , 'black');
  $('#titleqstn').css('color' , 'black');
  $('#titlemarks').css('color' , 'black');
  $('#inputbox').show();
  $('.markslist').children().remove();
  $('.answerlist').children().remove();
  sendWord = prompt("Enter the hidden word ! ").toUpperCase();
  socket.emit('getnewgame',playerName);
});
socket.on('message',function(msg){
  $('.info').append("<br>"+msg);
});
