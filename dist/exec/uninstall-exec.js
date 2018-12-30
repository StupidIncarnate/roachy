"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UninstallExec = void 0;

var _fsHelper = require("../helpers/fs-helper");

var _errorMessages = require("../error-messages");

var _npmExecHelper = require("../helpers/npm-exec-helper");

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UninstallExec = function UninstallExec(packages) {
  var rootConfig = _fsHelper.FsHelper.getRootConfig();

  if (!packages.length) {
    throw new Error(_errorMessages.ErrorMessages.PACKAGES_REQUIRED);
  }

  _fsHelper.FsHelper.ensureRootPath();
  /**
   * Check if any packages are unknown
   */


  var installedPkgs = Object.keys(rootConfig.getPackages());
  var unknownPackages = packages.filter(function (pkg) {
    return installedPkgs.indexOf(pkg) === -1;
  });

  if (unknownPackages.length) {
    throw new Error(_errorMessages.ErrorMessages.NOT_INSTALLED + " " + unknownPackages.join(","));
  }
  /**
   * Check if any packages are used by app
   */


  var usedPkgsByApp = rootConfig.getPackagesInUse(packages);

  if (Object.keys(usedPkgsByApp).length) {
    var errorStr = Object.keys(usedPkgsByApp).map(function (appName) {
      return "".concat(appName, ": ").concat(usedPkgsByApp[appName].join(", "));
    }).join(";");
    throw new Error(_errorMessages.ErrorMessages.PACKAGES_IN_USE + " " + errorStr);
  }

  return _npmExecHelper.NpmExecHelper.uninstall(packages, true).then(function () {
    rootConfig.removePackages(packages);

    _fsHelper.FsHelper.saveRootConfig(rootConfig);

    console.log(_chalk.default.blue("Removed the following packages from roachy: ".concat(packages.join(", "))));
  });
};

exports.UninstallExec = UninstallExec;