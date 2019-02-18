"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NpmExecHelper = void 0;

var _errorMessages = require("../error-messages");

var _fsHelper = require("./fs-helper");

var _path = _interopRequireDefault(require("path"));

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
    var cmd = "npm install ".concat(asDev ? '--save-dev' : '', " ");

    if (packages) {
      cmd += packages.join(" ");
    }

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
  getInstalledVersion: function getInstalledVersion(pkgName, includePath) {
    return Promise.resolve().then(function () {
      /**
       * So we can ensure we're pulling proper versions
       */
      try {
        var openPath = includePath ? _path.default.join(includePath, "node_modules", pkgName) : _path.default.join("node_modules", pkgName);

        var pkgJson = _fsHelper.FsHelper.openPackageJson(openPath);

        return pkgJson.version;
      } catch (e) {
        throw e;
      }
    });
  },
  writePackageLock: function writePackageLock() {
    var cmd = "npm install --package-lock-only";
    return NpmExecHelper.exec(cmd).catch(function (e) {
      throw new Error(_errorMessages.ErrorMessages.UNKNOWN_NPM_ERROR);
    });
  },
  ensureNodeModules: function ensureNodeModules(locPath) {
    var _this = this;

    /**
     * This wont make a node modules if no packages exist but thats fine because this is only
     * called when pulling package versions
     */
    return Promise.resolve().then(function () {
      if (_fsHelper.FsHelper.exists([locPath, "node_modules"])) {
        return true;
      }

      var cwd = _fsHelper.FsHelper.cwd();

      _fsHelper.FsHelper.changeCwd(_fsHelper.FsHelper.getPath(locPath));

      return _this.exec('npm install').then(function () {
        _fsHelper.FsHelper.changeCwd(cwd);
      });
    });
  }
};
exports.NpmExecHelper = NpmExecHelper;