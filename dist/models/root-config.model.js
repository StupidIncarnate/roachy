"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rootAppConfig = _interopRequireWildcard(require("./root-app-config.model"));

var _errorMessages = require("../error-messages");

var _packageHelper = require("../helpers/package-helper");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RootConfigModel =
/*#__PURE__*/
function () {
  _createClass(RootConfigModel, null, [{
    key: "getDefaultStructure",
    value: function getDefaultStructure() {
      return {
        version: 0.1,
        apps: {},
        packages: {}
      };
    }
  }]);

  function RootConfigModel(configObj) {
    var _this = this;

    _classCallCheck(this, RootConfigModel);

    this.config = RootConfigModel.getDefaultStructure();

    if (configObj) {
      Object.keys(this.config).forEach(function (propName) {
        return _this.config[propName] = configObj[propName] || null;
      });
    }
  }

  _createClass(RootConfigModel, [{
    key: "toJSON",
    value: function toJSON() {
      return this.config;
    }
  }, {
    key: "hasApp",
    value: function hasApp(appName) {
      return Object.keys(this.config.apps).indexOf(appName) !== -1;
    }
  }, {
    key: "getApp",
    value: function getApp(appName) {
      if (!this.hasApp(appName)) {
        throw new Error("".concat(_errorMessages.ErrorMessages.UNKNOWN_APP, " ").concat(appName));
      }

      return new _rootAppConfig.default(appName, this.config.apps[appName]);
    }
  }, {
    key: "addApp",
    value: function addApp(appName, appLocation) {
      if (this.config.apps[appName]) {
        throw new Error("".concat(appName, " ").concat(_errorMessages.ErrorMessages.APP_ALREADY_EXISTS));
      }

      this.config.apps[appName] = {
        path: appLocation,
        attachedApps: [],
        packages: [],
        devPackages: []
      };
    }
  }, {
    key: "getAppNames",
    value: function getAppNames() {
      return Object.keys(this.config.apps);
    }
    /**
     * Need to keep this logic here rather than in app config because the constraint can only be
     * maintained in root.
     */

  }, {
    key: "attachApp",
    value: function attachApp(parentApp, childApp) {
      if (!this.hasApp(childApp)) {
        throw new Error("".concat(_errorMessages.ErrorMessages.UNKNOWN_APP, " ").concat(childApp));
      }

      if (parentApp === childApp) {
        throw new Error(_errorMessages.ErrorMessages.PARENT_CHILD_COLLISION);
      }

      var appConfig = this.getApp(parentApp);

      if (!appConfig.hasAttachedApp(childApp)) {
        appConfig.getAttachedApps().push(childApp);
      }
    }
  }, {
    key: "detachApp",
    value: function detachApp(parentApp, childApp) {
      if (!this.hasApp(childApp)) {
        throw new Error("".concat(_errorMessages.ErrorMessages.UNKNOWN_APP, " ").concat(childApp));
      }

      if (parentApp === childApp) {
        throw new Error(_errorMessages.ErrorMessages.PARENT_CHILD_COLLISION);
      }

      var appConfig = this.getApp(parentApp);

      if (appConfig.hasAttachedApp(childApp)) {
        appConfig.getAttachedApps().splice(appConfig.getAttachedApps().indexOf(childApp), 1);
      }
    }
  }, {
    key: "getPackages",
    value: function getPackages() {
      return this.config.packages;
    }
  }, {
    key: "addPackages",
    value: function addPackages(pkgObj) {
      for (var pkg in pkgObj) {
        this.getPackages()[pkg] = _packageHelper.PackageHelper.getCheckableVersion(pkgObj[pkg]);
      }
    }
  }, {
    key: "removePackages",
    value: function removePackages(pkgArr) {
      var _this2 = this;

      pkgArr.forEach(function (pkg) {
        delete _this2.config.packages[pkg];
      });
    }
  }, {
    key: "getAllAppPackages",
    value: function getAllAppPackages() {
      var _this3 = this;

      var usedPkgs = [];
      this.getAppNames().forEach(function (appName) {
        _this3.getApp(appName).getPackages().forEach(function (pkgName) {
          if (usedPkgs.indexOf(pkgName) === -1) {
            usedPkgs.push(pkgName);
          }
        });

        _this3.getApp(appName).getDevPackages().forEach(function (pkgName) {
          if (usedPkgs.indexOf(pkgName) === -1) {
            usedPkgs.push(pkgName);
          }
        });
      });
      return usedPkgs.sort();
    }
    /**
     * Dependency Tree Builder
     */

    /**
     * Builds obj of dependencies or devDeps to put into an app package json
     */

  }, {
    key: "buildPackageDepList",
    value: function buildPackageDepList(appName, packageType) {
      var rootPackageList = this.getPackages(),
          pkgObj = {};
      this.buildAppPackageList(appName, packageType).forEach(function (pkgName) {
        if (!rootPackageList[pkgName]) {
          throw new Error("".concat(pkgName, " has not been added to roachy. 'roachy add ").concat(pkgName, "'"));
        }

        pkgObj[pkgName] = rootPackageList[pkgName];
      });
      return pkgObj;
    }
    /**
     * @param appName
     * @param packageType packages || devPackages
     */

  }, {
    key: "buildAppPackageList",
    value: function buildAppPackageList(appName, packageType) {
      var attachedApps = this.getRequiredAppDeps(appName);

      if (attachedApps.indexOf(appName) === -1) {
        attachedApps.push(appName);
      }

      return this.collectAppPackages(attachedApps, packageType);
    }
  }, {
    key: "getRequiredAppDeps",
    value: function getRequiredAppDeps(appName, collectedAppDeps) {
      var _this4 = this;

      collectedAppDeps = collectedAppDeps || [];
      this.getApp(appName).getAttachedApps().forEach(function (attachedAppName) {
        if (collectedAppDeps.indexOf(attachedAppName) === -1) {
          collectedAppDeps.push(attachedAppName);

          _this4.getRequiredAppDeps(attachedAppName, collectedAppDeps);
        }
      });
      return collectedAppDeps.sort();
    }
  }, {
    key: "collectAppPackages",
    value: function collectAppPackages(appNames, packageType) {
      var _this5 = this;

      var packages = [];
      appNames.forEach(function (appName) {
        var appConfig = _this5.getApp(appName);

        appConfig.getPackagesByType(packageType).forEach(function (pkg) {
          if (packages.indexOf(pkg) === -1) {
            packages.push(pkg);
          }
        });
      });
      return packages.sort();
    }
  }]);

  return RootConfigModel;
}();

exports.default = RootConfigModel;