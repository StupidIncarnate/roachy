"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FsHelper = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _config = require("../config");

var _errorMessages = require("../error-messages");

var _rootConfig = _interopRequireDefault(require("../models/root-config.model"));

var _rootAppConfig = require("../models/root-app-config.model");

var _npmExecHelper = require("./npm-exec-helper");

var _packageHelper = require("./package-helper");

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FsHelper = {
  cwd: function cwd() {
    return process.cwd();
  },
  joinPath: function joinPath(pathArr) {
    if (!Array.isArray(pathArr)) {
      pathArr = [pathArr];
    }

    return _path.default.join.apply(null, pathArr);
  },
  getPath: function getPath(pathArr) {
    if (!Array.isArray(pathArr)) {
      pathArr = [pathArr];
    }
    /**
     * Convert to string to see if root is already appended
     */


    var pathStr = _path.default.join.apply(null, pathArr);

    var rootPath = this.getRootPath(this.cwd());

    if (pathStr.indexOf(rootPath) === -1) {
      return _path.default.join(rootPath, pathStr);
    }

    return pathStr;
  },
  getRootPath: function getRootPath(currentPath) {
    var splitPath = currentPath.split(_path.default.sep);

    while (splitPath.length > 0) {
      var testPath = _path.default.join(splitPath.join(_path.default.sep), _config.REF.configName);

      if (_fs.default.existsSync(testPath)) {
        return splitPath.join(_path.default.sep);
      }

      splitPath.pop();
    }

    throw new Error(_errorMessages.ErrorMessages.ROOT_NOT_FOUND);
  },
  deletePath: function deletePath(pathArr) {
    if (FsHelper.exists(pathArr)) {
      var deletePath = this.getPath(pathArr);
      console.log(_chalk.default.yellow("Deleting ".concat(deletePath, "...")));
      return _fsExtra.default.removeSync(deletePath);
    }

    return true;
  },
  ensureRootPath: function ensureRootPath() {
    process.chdir(this.getRootPath(this.cwd()));
  },
  changeCwd: function changeCwd(pathArr) {
    process.chdir(this.getPath(pathArr));
  },
  exists: function exists(pathArr) {
    return _fs.default.existsSync(this.getPath(pathArr));
  },
  openPackageJson: function openPackageJson(folderPath) {
    return _fsExtra.default.readJsonSync(_path.default.join(folderPath, "package.json"));
  },
  writeJson: function writeJson(path, contents) {
    _fsExtra.default.writeJsonSync(path, contents, {
      spaces: '\t'
    });
  },
  getProdPackageJsonDeps: function getProdPackageJsonDeps(folderPath) {
    var pkgJson = this.openPackageJson(this.getPath(folderPath));
    var returnPkgs = {};

    var installedPkgs = _packageHelper.PackageHelper.getInstalled(pkgJson);

    for (var pkgName in installedPkgs) {
      returnPkgs[pkgName] = _packageHelper.PackageHelper.getCheckableVersion(installedPkgs[pkgName]);
    }

    return returnPkgs;
  },
  getPackageJsonDeps: function getPackageJsonDeps(folderPath) {
    var pkgJson = this.openPackageJson(this.getPath(folderPath));

    var returnPkgs = _packageHelper.PackageHelper.getDevInstalled(pkgJson);

    var installedPkgs = _packageHelper.PackageHelper.getInstalled(pkgJson);

    for (var pkgName in installedPkgs) {
      returnPkgs[pkgName] = _packageHelper.PackageHelper.getCheckableVersion(installedPkgs[pkgName]);
    }

    return returnPkgs;
  },
  getRootConfig: function getRootConfig() {
    try {
      var initPath = FsHelper.getPath(_config.REF.configName);

      if (!FsHelper.exists(initPath)) {
        throw new Error(_errorMessages.ErrorMessages.ROOT_NOT_INIT);
      }

      return new _rootConfig.default(_fsExtra.default.readJsonSync(initPath));
    } catch (e) {
      throw new Error(_errorMessages.ErrorMessages.ROOT_NOT_INIT);
    }
  },
  getRootPackageJson: function getRootPackageJson() {
    try {
      var initPath = FsHelper.getPath("package.json");

      if (!FsHelper.exists(initPath)) {
        throw new Error(_errorMessages.ErrorMessages.ROOT_NOT_INIT);
      }

      return _fsExtra.default.readJsonSync(initPath);
    } catch (e) {
      console.log(e);
      throw new Error(_errorMessages.ErrorMessages.ROOT_NOT_INIT);
    }
  },
  saveRootConfig: function saveRootConfig(config) {
    this.writeJson(FsHelper.getPath(_config.REF.configName), config.toJSON());
  },
  getAppPackageJson: function getAppPackageJson(appConfig) {
    return this.openPackageJson(this.getPath(appConfig.getPath()));
  },
  saveAppPackageJson: function saveAppPackageJson(appConfig, pkgJson) {
    return this.writeJson(this.getPath([appConfig.getPath(), "package.json"]), pkgJson);
  },
  regenAppPackageJsons: function regenAppPackageJsons(appName) {
    /**
     * re-pull for struct changes
     */
    var rootConfig = FsHelper.getRootConfig();
    var cwd = FsHelper.cwd();
    var apps = appName ? [appName] : rootConfig.getAppNames();
    /**
     * Rebuild package.jsons for each app
     */

    var p = Promise.resolve();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      var _loop = function _loop() {
        var appName = _step.value;
        p = p.then(function () {
          var appConfig = rootConfig.getApp(appName);
          var appPackageJson = FsHelper.getAppPackageJson(appConfig);
          var oldDepStr = JSON.stringify(appPackageJson.dependencies);
          var oldDevDepStr = JSON.stringify(appPackageJson.devDependencies);
          appPackageJson.dependencies = rootConfig.buildPackageDepList(appName, _rootAppConfig.PACKAGE_TYPES.PACKAGES);
          appPackageJson.devDependencies = rootConfig.buildPackageDepList(appName, _rootAppConfig.PACKAGE_TYPES.DEV_PACKAGES);
          /**
           *  If one of the deps have changed, then we want to output the new package.json /lock files
           */

          if (oldDepStr !== JSON.stringify(appPackageJson.dependencies) || oldDevDepStr !== JSON.stringify(appPackageJson.devDependencies)) {
            console.log(_chalk.default.yellow("Regening package.json for ".concat(appName)));
            FsHelper.saveAppPackageJson(appConfig, appPackageJson);
            FsHelper.deletePath([appConfig.getPath(), "package-lock.json"]);
            FsHelper.changeCwd(appConfig.getPath());
            return _npmExecHelper.NpmExecHelper.writePackageLock();
          }
        });
      };

      for (var _iterator = apps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        _loop();
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    p = p.then(function () {
      FsHelper.changeCwd(cwd);
    });
    return p;
  }
};
exports.FsHelper = FsHelper;