"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InstallExec = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _fsHelper = require("../helpers/fs-helper");

var _errorMessages = require("../error-messages");

var _npmExecHelper = require("../helpers/npm-exec-helper");

var _packageHelper = require("../helpers/package-helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var outputChangedPackages = function outputChangedPackages(oldPackages) {
  var rootPackage = _fsHelper.FsHelper.getRootPackageJson();

  var newPackages = _packageHelper.PackageHelper.getInstalled(rootPackage);

  var changeObj = {};
  var hasChanges = false;

  for (var pkg in newPackages) {
    /**
     * Changed if pkg was added or if version was changed
     */
    if (!(pkg in oldPackages) || oldPackages[pkg] !== newPackages[pkg]) {
      changeObj[pkg] = _packageHelper.PackageHelper.getCheckableVersion(newPackages[pkg]);
      hasChanges = true;
    }
  }

  if (hasChanges) {
    var rootConfig = _fsHelper.FsHelper.getRootConfig();

    rootConfig.addPackages(changeObj);

    _fsHelper.FsHelper.saveRootConfig(rootConfig);

    console.log(_chalk.default.blue("Saved the following packages to roachy: ".concat(Object.keys(changeObj).join(", "))));
  }

  return _fsHelper.FsHelper.regenAppPackageJsons();
};

var InstallExec = function InstallExec(packages) {
  _fsHelper.FsHelper.getRootConfig();

  if (!packages.length) {
    throw new Error(_errorMessages.ErrorMessages.PACKAGES_REQUIRED);
  }

  _fsHelper.FsHelper.ensureRootPath();

  var rootPackage = _fsHelper.FsHelper.getRootPackageJson();

  var oldInstalled = _packageHelper.PackageHelper.getInstalled(rootPackage);

  console.log(_chalk.default.yellow("Registering packages with Roachy... ".concat(packages)));
  return _npmExecHelper.NpmExecHelper.install(packages).then(function () {
    return outputChangedPackages(oldInstalled);
  }).catch(function (e) {
    return outputChangedPackages(oldInstalled).then(function () {
      throw e;
    });
  });
};

exports.InstallExec = InstallExec;