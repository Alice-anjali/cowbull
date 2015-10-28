var mainWord;
var noOfAns = 0;
var currAns;
var cow=0 , bull=0;
var game =0;
var playerName;
var startagame = function(word)
{
  mainWord = word;
  game =1;
  noOfAns = 0;
  document.getElementById('titleqstn').innerHTML = "_ _ _ _";
  $('.game').css('border-color' , 'black');
  $('#titleqstn').css('color' , 'black');
  $('#titlemarks').css('color' , 'black');
  $('.markslist').children().remove();
  $('.answerlist').children().remove();
};

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
    document.getElementById('titleqstn').innerHTML = mainWord;
    //socket.emit('message' , playerName + " has won in  " + noOfAns + " tries !");
  }
  else if (noOfAns == 9)
  {
    game = 0;
    $('.info').append("<br> You have lost !!");
    $('.game').css('border-color' , 'red');
    document.getElementById('titleqstn').innerHTML = mainWord;
    $('#titleqstn').css('color' , 'red');
    $('#titlemarks').css('color' , 'red');
    //socket.emit('message' , playerName + " has lost !");
  }
};
