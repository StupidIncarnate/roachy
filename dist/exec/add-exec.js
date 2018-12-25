"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AddExec = void 0;

var _fsHelper = require("../helpers/fs-helper");

var _errorMessages = require("../error-messages");

var _packageHelper = require("../helpers/package-helper");

var _installExec = require("./install-exec");

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Error if pkg
 */
var reconcileExistingPackageJson = function reconcileExistingPackageJson(rootConfig, appName, appLocation) {
  var appDeps = [],
      appDevDeps = [];
  return Promise.resolve().then(function () {
    /**
     * Account for package.json
     */
    if (!_fsHelper.FsHelper.exists([appLocation, "package.json"])) {
      console.log(_chalk.default.yellow("No app package.json existed. Creating in folder..."));

      _fsHelper.FsHelper.writeJson(_fsHelper.FsHelper.getPath([appLocation, "package.json"]), {
        name: appName,
        private: true,
        description: appName,
        version: "0.0.1",
        scripts: {
          "start": "index.js"
        },
        dependencies: {},
        devDependencies: {}
      });

      return true;
    }
    /**
     * Check if packages are copasetic with root packages
     */


    var rootPackages = rootConfig.getPackages();
    /**
     * getpkg and devPkgs for app
     */

    var pkgJson = _fsHelper.FsHelper.openPackageJson(_fsHelper.FsHelper.getPath(appLocation));

    appDeps = Object.keys(_packageHelper.PackageHelper.getInstalled(pkgJson));
    appDevDeps = Object.keys(_packageHelper.PackageHelper.getDevInstalled(pkgJson));

    var appPkgs = _fsHelper.FsHelper.getPackageJsonDeps(appLocation);

    var badVersions = [],
        newPackages = [];

    for (var pkgName in appPkgs) {
      if (rootPackages[pkgName] && _packageHelper.PackageHelper.getCheckableVersion(appPkgs[pkgName]) !== _packageHelper.PackageHelper.getCheckableVersion(rootPackages[pkgName])) {
        badVersions.push("".concat(pkgName, ": root(").concat(_packageHelper.PackageHelper.getCheckableVersion(rootPackages[pkgName]), ")-app(").concat(_packageHelper.PackageHelper.getCheckableVersion(appPkgs[pkgName]), ")"));
      }

      if (!rootPackages[pkgName]) {
        newPackages.push("".concat(pkgName, "@").concat(_packageHelper.PackageHelper.getCheckableVersion(appPkgs[pkgName])));
      }
    }
    /**
     * Throw if app pkgs versions need to be fixed
     */


    if (badVersions.length) {
      throw new Error("".concat(badVersions.join(", "), " ").concat(_errorMessages.ErrorMessages.APP_ROOT_VERSION_MISMATCH));
    }
    /**
     * We want to delete before installing just in case node tries to pull these in.
     */


    _fsHelper.FsHelper.deletePath([appLocation, "node_modules"]);

    if (!newPackages.length) {
      return true;
    }
    /**
     * If there are new packages, install them to root
     */


    return (0, _installExec.InstallExec)(newPackages);
  }).then(function () {
    return {
      packages: appDeps,
      devPackages: appDevDeps
    };
  });
};

var AddExec = function AddExec(appName, appLocation) {
  var rootConfig = _fsHelper.FsHelper.getRootConfig();

  if (!appName) {
    throw new Error(_errorMessages.ErrorMessages.APP_NAME_REQUIRED);
  }

  if (appName.match(/[^a-z\-]/)) {
    throw new Error(_errorMessages.ErrorMessages.APP_NAME_INVALID);
  }

  if (!appLocation) {
    throw new Error(_errorMessages.ErrorMessages.APP_LOCATION_REQUIRED);
  }

  if (!_fsHelper.FsHelper.exists(appLocation)) {
    throw new Error("".concat(_errorMessages.ErrorMessages.APP_LOCATION_INVALID, ": ").concat(appLocation));
  }

  var cwd = _fsHelper.FsHelper.cwd();

  return reconcileExistingPackageJson(rootConfig, appName, appLocation).then(function (_ref) {
    var packages = _ref.packages,
        devPackages = _ref.devPackages;
    console.log(_chalk.default.grey("Adding app to Roachy..."));

    var rootConfig = _fsHelper.FsHelper.getRootConfig();

    rootConfig.addApp(appName, appLocation);
    var appConfig = rootConfig.getApp(appName);
    appConfig.addPackages(packages);
    appConfig.addDevPackages(devPackages);

    _fsHelper.FsHelper.saveRootConfig(rootConfig);

    _fsHelper.FsHelper.regenAppPackageJsons(appName);

    _fsHelper.FsHelper.changeCwd(cwd);

    console.log(_chalk.default.blue("The following app has been added to Roachy: ".concat(appName)));
  });
};

exports.AddExec = AddExec;