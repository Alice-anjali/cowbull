var sendWord;
var connected = false;
var room;
var multi =false;
var opponentName = null;
var roomlist = {};
var hashMainWord = [];
jQuery(document).ready(function($){
  $('.createroomdiv').hide();
  $('.joinroomdiv').hide();
  $('.sendwordbox').hide();
  $('#chatbox').hide();
  $('.acceptwordbox').hide();
  $('.exitroom').hide();
  playerName = prompt("Enter your Name");
  $('.info').prepend("<br>Hello "+playerName);
  multi = confirm("Do you want to play multiplayer ? ");
  if(multi)
 {
    socket.emit('join',playerName);
    //room=prompt("Enter the name of the room you want to enter. If the room doesn't exist , a new room will be created.");
    //socket.emit('createroom',room);
    $('.createroomdiv').show();
    $('.joinroomdiv').show();
    $('.game').hide();
    $('#inputbox').hide();
    $('.reset').hide();
  }
  else
  {
    $('.sendwordbox').hide();
    $('#chatbox').hide();
    socket.disconnect();
    var temp;
    do{
        temp = prompt("Enter the hidden word to play !").toUpperCase();
    }while(!check(temp));
    startagame(temp);
  }

});
socket.on('addroomlist' , function(name , id){
  roomlist[name] = id;
  //console.log(' Room ' + name + " created with id " + id);
  if(id!==undefined)
    $('#roomlist').append('<li>' + name + '</li>');
});
socket.on('getdictionary',function(words){
  Object.keys(words).forEach(function(key) {
     dictionary[ key ] = words[ key ];
   });
  console.log(dictionary);
});
socket.on('clearroomlist',function(){
  $('#roomlist').text('');
});
var createroom = function(){
  var ele = document.getElementById('createroominput');
  socket.emit('trycreateroom',ele.value);
  ele.value ='';
};
socket.on('createroom',function(name){
  $('#chatbox').show();
  $('.sendwordbox').show();
  $('.createroomdiv').hide();
  $('.joinroomdiv').hide();
  $('.exitroom').show();
  $('#roomname').text(name);
});
var joinroom = function(){
  var ele = document.getElementById('joinroominput');
  socket.emit('tryjoinRoom',roomlist[ele.value]);
  ele.value ='';
}
socket.on('joinroom',function(name){
  $('#chatbox').show();
  $('.sendwordbox').show();
  $('.createroomdiv').hide();
  $('.joinroomdiv').hide();
  $('.exitroom').show();
  $('#roomname').text(name);
});
var sendnewWord = function()
{
  var ele = document.getElementById('inputsendbox');
  console.log(" Sending word : " + ele.value);
  if(check(ele.value.toUpperCase())){
    sendWord = ele.value.toUpperCase();
    socket.emit('trynewgame' , sendWord , playerName);
    $('#inputsendbox').css('border-color' , 'green');
    ele.value = '';
  }
  else{
    $('#inputsendbox').css('border-color' , 'red');
  }
}
var exitroom = function(){
  $('.createroomdiv').show();
  $('.joinroomdiv').show();
  $('.game').hide();
  $('#inputbox').hide();
  $('.reset').hide();
  $('.exitroom').hide();
  $('.sendwordbox').hide();
  $('#roomname').text("No-one");
  socket.emit('exitroom');
};
var acceptnewWord = function(){
  startagame(hashMainWord);
  $('.acceptwordbox').hide();
  socket.emit('notify', playerName + " Accepted word from " + opponentName);
};
var rejectnewWord = function(){
  $('.acceptwordbox').hide();
};
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
    $('.game').hide();
    $('#inputbox').hide();
    $('.reset').hide();
    socket.emit('notify' , playerName + " has surrendered " + opponentName + " word ");
    game = 0;
  }
};
socket.on('newgame',function(playerName,hash){

  hash = JSON.parse(hash);
  //console.log(hash[0]);
  //log(dictionary);
  if(game==0)
  {
    $('#recievedfromtext').text("A new Word is recieved from " + playerName);
    $('.acceptwordbox').show();
    //showhash(hash);
    for(var i=0;i<4;i++)
      hashMainWord[i]=hash[i];
    opponentName = playerName;
  }
});

socket.on('message',function(msg){
  $('.info').append("<br>"+msg);
});
socket.on('update',function(msg){
  $('.info').append("<br>"+msg);
});
