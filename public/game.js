var hashMainWord;
var noOfAns = 0;
var currAns = [] , tryhash = [];
var cow=0 , bull=0;
var game =0;
var playerName;
/*var showhash = function(hash)
{
  console.log(hash[0]);
}*/
var startagame = function(hash)
{
  for(var i=0;i<4;i++)
    hashMainWord[i]=hash[i];
  game =1;
  noOfAns = 0;
  document.getElementById('titleqstn').innerHTML = "_ _ _ _";
  $('.game').css('border-color' , 'black');
  $('#titleqstn').css('color' , 'black');
  $('#titlemarks').css('color' , 'black');
  $('.markslist').children().remove();
  $('.answerlist').children().remove();
  $('.game').show();
  $('#inputbox').show();
  $('acceptwordbox').show();
  $('.reset').show();
  //showhash(hash);
};

var newword = function(ele) {
    if(event.keyCode == 13) {
        currAns = ele.value.toUpperCase();
        for(var i=0;i<4;i++)
          tryhash[i]=CryptoJS.SHA256(currAns[i]).toString();
        if(check(currAns)){
          $('.answerlist').append("<li>" + currAns + "</li>");
          ele.value = '';
          $('#inputbox').css('border-color' , 'green');
          generatecb();
          $('.markslist').append("<li>" + cow + "/" + bull + "</li>");
          noOfAns++;
          checkwin();
        }
        else{
          $('#inputbox').css('border-color' , 'red');
        }
    }
};
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
var generatecb = function(word){
  //showhash(tryhash);
  cow=0;bull=0;
  for(var i=0;i<4;i++)
  {
    for(var j=0;j<4;j++)
    {
      if(tryhash[i]===hashMainWord[j])
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
  var win =1;
  for(var i=0;i<4;i++)
  {
    if(tryhash[i]!=hashMainWord[i])
    {
      win=0;break;
    }
  }
  if(win===1)
  {
    game = 0;
    $('.info').prepend("<br> You have won !!");
    $('.game').css('border-color' , 'green');
    $('#titleqstn').css('color' , 'green');
    $('#titlemarks').css('color' , 'green');
    //document.getElementById('titleqstn').innerHTML = mainWord;
    socket.emit('notify' , playerName + " solved " + opponentName + ' word in '+noOfAns+' tries');
  }
  else if (noOfAns == 9)
  {
    game = 0;
    $('.info').prepend("<br> You have lost !!");
    $('.game').css('border-color' , 'red');
    //document.getElementById('titleqstn').innerHTML = mainWord;
    $('#titleqstn').css('color' , 'red');
    $('#titlemarks').css('color' , 'red');
    socket.emit('notify' , playerName + " lost the word given by " + opponentName);
  }
};
