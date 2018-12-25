"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RemoveCmd = void 0;

var _fsHelper = require("../../helpers/fs-helper");

var _errorMessages = require("../../error-messages");

var _rootAppConfig = require("../../models/root-app-config.model");

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RemoveCmd = function RemoveCmd(appName, packageType) {
  var packages = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  /**
   * Args can be any number of apps and packages
   */
  _fsHelper.FsHelper.ensureRootPath();

  if (packages.length === 0) {
    throw new Error(_errorMessages.ErrorMessages.PACKAGES_REQUIRED);
  }

  var rootConfig = _fsHelper.FsHelper.getRootConfig();

  var appConfig = rootConfig.getApp(appName);
  var removedPackages = [];

  if (packageType === _rootAppConfig.PACKAGE_TYPES.PACKAGES) {
    removedPackages = appConfig.removePackages(packages);
  } else {
    removedPackages = appConfig.removeDevPackages(packages);
  }

  _fsHelper.FsHelper.saveRootConfig(rootConfig);

  console.log(_chalk.default.blue("The following ".concat(_rootAppConfig.PACKAGE_TYPES.PACKAGES, " were removed from ").concat(appName, ": ").concat(removedPackages.join(", "))));
  return Promise.resolve();
};

exports.RemoveCmd = RemoveCmd;