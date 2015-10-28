var sendmessage = function(){
    console.log('A chat message sent !');
    var msg= document.getElementById('m').value;
    socket.emit('chat-message', msg , playerName);
    $('#m').val('');
};
socket.on('chat-message', function(msg){
  console.log("A chat message recieved : " + msg);
  $('#messages').append($('<li>').text(msg));
  $('#messages').scrollTop($('#messages')[0].scrollHeight);
});
