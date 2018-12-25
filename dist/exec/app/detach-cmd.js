"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DetachCmd = void 0;

var _fsHelper = require("../../helpers/fs-helper");

/**
 * Detach an app from roachy
 */
var DetachCmd = function DetachCmd(parentAppName, childAppName) {
  var rootConfig = _fsHelper.FsHelper.getRootConfig();

  rootConfig.detachApp(parentAppName, childAppName);
  /**
   *  Add child to parent attached apps
   *  Regen package.json for parent
   */

  _fsHelper.FsHelper.saveRootConfig(rootConfig);

  return Promise.resolve();
};

exports.DetachCmd = DetachCmd;