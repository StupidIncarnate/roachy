"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NpmExecHelper = void 0;

var _errorMessages = require("../error-messages");

var _npmPackageArg = _interopRequireDefault(require("npm-package-arg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _exec = require('child_process').execSync;

var NpmExecHelper = {
  exec: function exec(cmd) {
    return new Promise(function (resolve, reject) {
      try {
        var result = _exec(cmd).toString();

        resolve(result);
      } catch (error) {
        reject(error.message);
      }
    });
  },
  install: function install(packages, asDev) {
    var cmd = "npm install ".concat(asDev ? '--save-dev' : '', " ").concat(packages.join(" "));
    return NpmExecHelper.exec(cmd).then(function (msg) {
      return true;
    }).catch(function (e) {
      switch (true) {
        case e.indexOf("E404") > -1:
          throw new Error(_errorMessages.ErrorMessages.UNKNOWN_PACKAGE);
          break;

        default:
          throw new Error(_errorMessages.ErrorMessages.UNKNOWN_NPM_ERROR);
      }
    });
  },
  uninstall: function uninstall(packages, asDev) {
    var cmd = "npm uninstall ".concat(asDev ? '--save-dev' : '', " ").concat(packages.join(" "));
    return NpmExecHelper.exec(cmd).then(function (msg) {
      return true;
    }).catch(function (e) {
      switch (true) {
        case e.indexOf("E404") > -1:
          throw new Error(_errorMessages.ErrorMessages.UNKNOWN_PACKAGE);
          break;

        default:
          throw new Error(_errorMessages.ErrorMessages.UNKNOWN_NPM_ERROR);
      }
    });
  },
  writePackageLock: function writePackageLock() {
    var cmd = "npm install --package-lock-only";
    return NpmExecHelper.exec(cmd).catch(function (e) {
      throw new Error(_errorMessages.ErrorMessages.UNKNOWN_NPM_ERROR);
    });
  }
};
exports.NpmExecHelper = NpmExecHelper;