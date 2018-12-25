"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AddCmd = void 0;

var _fsHelper = require("../../helpers/fs-helper");

var _errorMessages = require("../../error-messages");

var _rootAppConfig = require("../../models/root-app-config.model");

var AddCmd = function AddCmd(appName, packageType) {
  var packages = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  /**
   * Args can be any number of apps and packages
   */
  _fsHelper.FsHelper.ensureRootPath();

  if (packages.length === 0) {
    throw new Error(_errorMessages.ErrorMessages.PACKAGES_REQUIRED);
  }

  var rootConfig = _fsHelper.FsHelper.getRootConfig();

  var installedPkgs = Object.keys(rootConfig.getPackages());
  var unknownPackages = packages.filter(function (pkg) {
    return installedPkgs.indexOf(pkg) === -1;
  });

  if (unknownPackages.length) {
    throw new Error(_errorMessages.ErrorMessages.NOT_INSTALLED + " " + unknownPackages.join(","));
  }

  var appConfig = rootConfig.getApp(appName);

  if (packageType === _rootAppConfig.PACKAGE_TYPES.PACKAGES) {
    appConfig.addPackages(packages);
  } else {
    appConfig.addDevPackages(packages);
  }

  _fsHelper.FsHelper.saveRootConfig(rootConfig);

  return Promise.resolve();
};

exports.AddCmd = AddCmd;