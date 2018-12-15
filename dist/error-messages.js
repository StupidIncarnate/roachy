"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorMessages = void 0;

var _config = require("./config");

var ErrorMessages = {
  ROOT_NOT_INIT: "Roachy needs to be initialized: roachy init",
  ROOT_NOT_FOUND: "Roachy couldn't find its commander config ".concat(_config.REF.configName, " anywhere up the tree where you are"),
  APP_NAME_REQUIRED: "appName is a required argument",
  APP_LOCATION_REQUIRED: "appLocation is a required argument",
  APP_LOCATION_INVALID: "appLocation is invalid"
};
exports.ErrorMessages = ErrorMessages;