"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AttachCmd = void 0;

var _fsHelper = require("../../helpers/fs-helper");

/**
 * Attaches a child app to a parent app for dependency referencing
 */
var AttachCmd = function AttachCmd(parentAppName, childAppName) {
  var rootConfig = _fsHelper.FsHelper.getRootConfig();

  rootConfig.attachApp(parentAppName, childAppName);
  /**
   *  Add child to parent attached apps
   *  Regen package.json for parent
   */

  _fsHelper.FsHelper.saveRootConfig(rootConfig);

  return Promise.resolve();
};

exports.AttachCmd = AttachCmd;