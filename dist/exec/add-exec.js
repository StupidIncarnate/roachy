"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AddExec = void 0;

var _fsHelper = require("../helpers/fs-helper");

var _errorMessages = require("../error-messages");

var _rootConfigHelper = require("../helpers/root-config-helper");

var AddExec = function AddExec(appName, appLocation) {
  var rootConfig = _fsHelper.FsHelper.getRootConfig();

  if (!appName) {
    throw new Error(_errorMessages.ErrorMessages.APP_NAME_REQUIRED);
  }

  if (!appLocation) {
    throw new Error(_errorMessages.ErrorMessages.APP_LOCATION_REQUIRED);
  }

  if (!_fsHelper.FsHelper.exists(appLocation)) {
    throw new Error("".concat(_errorMessages.ErrorMessages.APP_LOCATION_INVALID, ": "));
  }

  _rootConfigHelper.RootConfigHelper.addApp(rootConfig, appName, appLocation);

  _fsHelper.FsHelper.saveRootConfig(rootConfig);
};

exports.AddExec = AddExec;