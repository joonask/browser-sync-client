"use strict";

var BS, check, checkTimer, ping, pong, pingPongTimer, uuid, counter;

exports.init = function(bs, options) {
  if (options) {
    BS = window.___browserSync___ || {};
  }

  if (options.checkIntervalSeconds && options.returnUrl) {
    checkTimer = options.checkIntervalSeconds*1000;
    check = setInterval(function() {
      var socket = bs.socket.socket;
      if (!socket || socket.connected === false || socket.disconnected === true) {
        console.error('No socket connection to Browser Sync, returning home.');
        window.location = options.returnUrl;
      }
    }, checkTimer);
  }

  if (options.pingPong && options.pingPongIntervalSeconds) {
    uuid = bs.utils.getUUID();
    pingPongTimer = options.pingPongIntervalSeconds*1000;
    counter = 0;

    BS.socket.on('socket-check-pong', function(data) {
      if (!data) {
        return;
      }
      if (data.uuid === uuid && counter > data.counter) {
        clearTimeout(ping);
        ping = undefined;
        console.log('Pong!');
      } else {
        console.error('UUIDs did not match or counter is too large.');
      }
    });

    pong = setInterval(function() {
      if (!ping) {
        sendPing();
      }
    }, pingPongTimer);
  }

  function sendPing() {
    setPingTimer();
    BS.socket.emit('socket-check-ping', {
      uuid: uuid,
      counter: counter
    });
    counter++;
    console.log('Ping!');
  }

  function setPingTimer() {
    ping = setTimeout(function() {
      console.error('Ping-Pong failed, returning home.');
      window.location = options.returnUrl;
    }, 5000);
  }
};
