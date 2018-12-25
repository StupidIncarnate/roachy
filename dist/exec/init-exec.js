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

var processPkgJson = function processPkgJson() {
  return Promise.resolve().then(function () {
    var rootPackageJsonPath = _fsHelper.FsHelper.joinPath([_fsHelper.FsHelper.cwd(), "package.json"]);

    if (_fsHelper.FsHelper.exists(rootPackageJsonPath)) {
      var rootPackageJson = _fsHelper.FsHelper.openPackageJson(_fsHelper.FsHelper.cwd());

      var consolidatedPkgs = {};

      for (var pkg in _packageHelper.PackageHelper.getInstalled(rootPackageJson)) {
        consolidatedPkgs[pkg] = _packageHelper.PackageHelper.getInstalled(rootPackageJson)[pkg];
      }

      for (var _pkg in _packageHelper.PackageHelper.getDevInstalled(rootPackageJson)) {
        consolidatedPkgs[_pkg] = _packageHelper.PackageHelper.getDevInstalled(rootPackageJson)[_pkg];
      }

      var packageList = [];

      for (var _pkg2 in consolidatedPkgs) {
        packageList.push("".concat(_pkg2, "@").concat(consolidatedPkgs[_pkg2]));
      }

      if (process.env.NODE_ENV !== "testing") {
        packageList.push("roachy");
      }

      rootPackageJson.dependencies = {};
      rootPackageJson.devDependencies = {};

      _fsHelper.FsHelper.writeJson(rootPackageJsonPath, rootPackageJson);

      return _npmExecHelper.NpmExecHelper.install(packageList, true).then(function () {
        /**
         * Reopen to pull package versions
         */
        var installedPkgObj = _fsHelper.FsHelper.getPackageJsonDeps(_fsHelper.FsHelper.cwd());

        var rootConfig = _fsHelper.FsHelper.getRootConfig();

        rootConfig.addPackages(installedPkgObj);

        _fsHelper.FsHelper.saveRootConfig(rootConfig);
      });
    } else {
      _fsHelper.FsHelper.writeJson(rootPackageJsonPath, {
        name: "app-commander",
        private: true,
        description: "app-commander",
        version: "0.0.1",
        scripts: {
          "roachy": "roachy"
        },
        dependencies: {},
        devDependencies: {}
      });

      if (process.env.NODE_ENV !== "testing") {
        return _npmExecHelper.NpmExecHelper.install(["roachy"], true);
      }
    }
  });
};

var InitExec = function InitExec() {
  var initPath = _fsHelper.FsHelper.joinPath([_fsHelper.FsHelper.cwd(), _config.REF.configName]);

  if (_fs.default.existsSync(initPath)) {
    throw new Error("Roachy already initialized. Too many cockroaches are a bad thing, ya know?");
  }
  /**
   * This needs to be a direct write because the save in RootConfigModel
   * checks for an existing rootmodelconfig to save properly
   */


  _fsHelper.FsHelper.writeJson(initPath, _rootConfig.default.getDefaultStructure());

  return processPkgJson().then(function () {
    console.log(_chalk.default.blue("Roachy Init'd. Let roachy know what projects to keep track of via"), _chalk.default.green("roachy add <appName> <appLocation>"));
  });
};

exports.InitExec = InitExec;