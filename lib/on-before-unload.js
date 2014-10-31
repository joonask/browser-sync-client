"use strict";

/**
 * This is the plugin for showing confirmation popup when browser navigating to
 * external URL
 * @type {string}
 */
var eventManager = require("./events").manager;
var confirmPopupEnabled = true;

function disableConfirmPopup() {
    confirmPopupEnabled = false;
}

function enableConfirmPopup() {
    confirmPopupEnabled = true;
}

function handleClickEvent(bs) {
    return function (event) {
        var elem = event.target || event.srcElement;
        if (bs.utils.isExternalLink(elem)) {
            enableConfirmPopup();
        } else {
            disableConfirmPopup();
        }
    };
}

function confirmPopup() {
    window.onbeforeunload = function(e) {
        if (confirmPopupEnabled) {
            return "";
        } else {
            enableConfirmPopup();
            return void(0);
        }
    };
}

/**
 * @param {BrowserSync} bs
 */
exports.init = function (bs) {
    eventManager.addEvent(document.body, "click", handleClickEvent(bs));
    bs.emitter.on("idle-return", disableConfirmPopup);
    bs.socket.on("location", disableConfirmPopup);
    bs.socket.on("sync-location", disableConfirmPopup);
    confirmPopup();
};
