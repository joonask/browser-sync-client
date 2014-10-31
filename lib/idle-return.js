"use strict";

var idleTimeoutId;

/**
 * Load plugins for enabled options
 * @param bs
 * @param opts
 */
exports.init = function (bs, opts) {

    function resetCounter() {
        clearTimeout(idleTimeoutId);
        idleTimeoutId = setTimeout(returnHome, opts.idleSeconds*1000);
    }

    function returnHome() {
        bs.emitter.emit("idle-return");
        window.location = opts.returnUrl;
    }

    resetCounter();

    // Reset counter on received events
    bs.socket.on("scroll", resetCounter);
    bs.socket.on("location", resetCounter);
    bs.socket.on("input:toggles", resetCounter);
    bs.socket.on("form:submit", resetCounter);
    bs.socket.on("input:text", resetCounter);
    bs.socket.on("click", resetCounter);

    // Override emit function to reset counter
    var BS = window.___browserSync___ || {};
    if (BS.socket && BS.socket.emit) {
        var origFunc = BS.socket.emit;
        BS.socket.emit = function() {
            resetCounter();
            origFunc.apply(this, arguments);
        };
    }
};