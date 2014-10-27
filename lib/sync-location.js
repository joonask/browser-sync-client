"use strict";

/**
 * This is the plugin for syncing out-of-sync location
 * @type {string}
 */

function getLocation(bs) {
    return function() {
        bs.socket.emit("current-location", {url: window.location.pathname });
    };
}

function syncLocation(data) {
    if (window.location.pathname !== data.url) {
        window.location = data.url;
    }
}

/**
 * @param {BrowserSync} bs
 */
exports.init = function (bs) {
    bs.socket.on("get-location", getLocation(bs));
    bs.socket.on("sync-location", syncLocation);
};
