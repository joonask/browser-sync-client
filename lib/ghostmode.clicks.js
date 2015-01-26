"use strict";

/**
 * This is the plugin for syncing clicks between browsers
 * @type {string}
 */
var EVENT_NAME  = "click";
exports.canEmitEvents = true;

/**
 * @param {BrowserSync} bs
 * @param eventManager
 */
exports.init = function (bs, eventManager) {
    eventManager.addEvent(document.body, EVENT_NAME, exports.browserEvent(bs));
    console.log("clicks event init");
    bs.socket.on(EVENT_NAME, exports.socketEvent(bs, eventManager));
};

/**
 * Uses event delegation to determine the clicked element
 * @param {BrowserSync} bs
 * @returns {Function}
 */
exports.browserEvent = function (bs) {

    return function (event) {

      console.log("trigger click");
        if (exports.canEmitEvents) {

            var elem = event.target || event.srcElement;

            if (elem.type === "checkbox" || elem.type === "radio") {
                bs.utils.forceChange(elem);
                return;
            }

            if (bs.utils.isExternalLink(elem)) {
                var data = bs.utils.getExternalHref(elem);
                if (data.href) {
                    bs.socket.emit('click:externalurl', bs.utils.getExternalHref(elem));
                }
                // Do nothing if no href element
            } else {
                bs.socket.emit(EVENT_NAME, bs.utils.getElementData(elem));
            }

        } else {
            exports.canEmitEvents = true;
        }
    };
};

/**
 * @param {BrowserSync} bs
 * @param {manager} eventManager
 * @returns {Function}
 */
exports.socketEvent = function (bs, eventManager) {

    return function (data) {
        console.log("socketEvent", data);
        if (bs.canSync(data)) {
            console.log("bs.canSync true");

            var elem = bs.utils.getSingleElement(data.tagName, data.index);

            if (elem) {
                exports.canEmitEvents = false;
                eventManager.triggerClick(elem);
            }
        } else {
          console.log("bs.canSync false");
        }
    };
};