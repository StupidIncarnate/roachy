"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InitExec = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _fs = _interopRequireDefault(require("fs"));

var _config = require("../config");

var _fsHelper = require("../helpers/fs-helper");

var _rootConfig = _interopRequireDefault(require("../models/root-config.model"));

var _npmExecHelper = require("../helpers/npm-exec-helper");

var _packageHelper = require("../helpers/package-helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ensureNodeModulesExists = function ensureNodeModulesExists() {
  var rootPackageJsonPath = _fsHelper.FsHelper.joinPath([_fsHelper.FsHelper.cwd(), "package.json"]);

  if (!_fsHelper.FsHelper.exists(rootPackageJsonPath)) {
    _fsHelper.FsHelper.writeJson(rootPackageJsonPath, {
      name: "app-commander",
      private: true,
      description: "app-commander",
      version: "0.0.1",
      scripts: {},
      dependencies: {},
      devDependencies: {}
    });
  }

  if (!_fsHelper.FsHelper.exists(_fsHelper.FsHelper.joinPath([_fsHelper.FsHelper.cwd(), "node_modules"]))) {
    return _npmExecHelper.NpmExecHelper.install();
  }

  return Promise.resolve();
};

var processPkgJson = function processPkgJson() {
  return ensureNodeModulesExists().then(function () {
    var rootPackageJson = _fsHelper.FsHelper.openPackageJson(_fsHelper.FsHelper.cwd());
    /**
     * Get installed dep versions
     */


    var versionPromises = [];
    var pkgVersions = {};

    var _loop = function _loop(pkg) {
      versionPromises.push(_npmExecHelper.NpmExecHelper.getInstalledVersion(pkg).then(function (version) {
        pkgVersions[pkg] = version;
      }));
    };

    for (var pkg in _packageHelper.PackageHelper.getInstalled(rootPackageJson)) {
      _loop(pkg);
    }

    return Promise.all(versionPromises).then(function () {
      var rootConfig = _fsHelper.FsHelper.getRootConfig();

      rootConfig.addPackages(pkgVersions);

      _fsHelper.FsHelper.saveRootConfig(rootConfig);
    });
  });
};

var InitExec = function InitExec() {
  var initPath = _fsHelper.FsHelper.joinPath([_fsHelper.FsHelper.cwd(), _config.REF.configName]);

  if (_fs.default.existsSync(initPath)) {
    throw new Error("Roachy already initialized. Too many cockroaches are a bad thing, ya know?");
  }
  /**
   * This needs to be a direct write because the save in RootConfigModel
   * checks for an existing root modelconfig to save properly
   */


  _fsHelper.FsHelper.writeJson(initPath, _rootConfig.default.getDefaultStructure());

  return processPkgJson().then(function () {
    console.log(_chalk.default.blue("Roachy Init'd. Let roachy know what projects to keep track of via"), _chalk.default.green("roachy add <appName> <appLocation>"));
  });
};

exports.InitExec = InitExec;