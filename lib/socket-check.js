"use strict";

var check;

exports.init = function(bs, options) {
  if (options && options.checkIntervalSeconds && options.returnUrl) {
    check = setInterval(function() {
      var socket = bs.socket.socket;
      if (!socket || socket.connected === false || socket.disconnected === true) {
        console.error('No socket connection to Browser Sync, returning home.');
        window.location = options.returnUrl;
      }
    }, options.checkIntervalSeconds*1000);
  }
};