$(function () {

  const queryString = window.location.search;
  console.log(queryString);
  const urlParams = new URLSearchParams(queryString);
  const room = urlParams.get('room');
  console.log(room);

  var sounds = {};
  sounds["arrow shot"] = new Howl({
    src: ["sound/321553__brendan89__regular-arrow-shot-with-rattle.wav"],
    html5: true,
  });
  sounds["arrow impact"] = new Howl({
    src: ["sound/511490__lydmakeren__fx-bow-arrow.wav"],
    html5: true,
  });

  var socket = io("/howtobasic");
  $('form#room').submit(function(e){
    e.preventDefault(); // prevents page reloading
    socket.emit('connect room', $('#room_id').val());
    $('#room').val('');
    return false;
  });
  $('button.oneshot').click(function(e){
    e.preventDefault(); // prevents page reloading
    socket.emit('oneshot', $(this).attr("value"));
    return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
  socket.on('connection', function(msg){
    $('#messages').append($('<li>').text("a user connected!"));
  });
  socket.on('sound', function(msg){
    data = JSON.parse(msg);
    // console.log(sounds);
    // console.log(data.sound_name);
    sounds[data.sound_name].play();
  })
});