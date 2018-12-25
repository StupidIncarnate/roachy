"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AttachCmd = void 0;

var _fsHelper = require("../../helpers/fs-helper");

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  console.log(_chalk.default.blue("".concat(childAppName, " has been attached as a dependency to ").concat(parentAppName)));
  return Promise.resolve();
};

exports.AttachCmd = AttachCmd;