"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.PACKAGE_TYPES = void 0;

var _errorMessages = require("../error-messages");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PACKAGE_TYPES = {
  PACKAGES: "packages",
  DEV_PACKAGES: "devPackages"
};
exports.PACKAGE_TYPES = PACKAGE_TYPES;

var RootAppConfigModel =
/*#__PURE__*/
function () {
  function RootAppConfigModel(name, configObj) {
    _classCallCheck(this, RootAppConfigModel);

    this.name = name;
    /**
     * We want to keep pointer ref to root config object so we dont need to pass up change events
     */

    this.config = configObj;
  }

  _createClass(RootAppConfigModel, [{
    key: "getConfig",
    value: function getConfig() {
      return this.config;
    }
  }, {
    key: "getPath",
    value: function getPath() {
      return this.config.path;
    }
  }, {
    key: "hasAttachedApp",
    value: function hasAttachedApp(appName) {
      return this.config.attachedApps.indexOf(appName) !== -1;
    }
  }, {
    key: "getAttachedApps",
    value: function getAttachedApps() {
      return this.config.attachedApps;
    }
  }, {
    key: "getPackagesByType",
    value: function getPackagesByType(packageType) {
      switch (packageType) {
        case PACKAGE_TYPES.PACKAGES:
          return this.getPackages();

        case PACKAGE_TYPES.DEV_PACKAGES:
          return this.getDevPackages();

        default:
          throw new Error("Unknown packageType ".concat(packageType));
      }
    }
  }, {
    key: "getPackages",
    value: function getPackages() {
      return this.config.packages;
    }
  }, {
    key: "addPackages",
    value: function addPackages() {
      var packageArr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      this.consolidatePackages(this.config.packages, packageArr);
    }
  }, {
    key: "removePackages",
    value: function removePackages() {
      var _this = this;

      var packages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var knownPkgs = packages.filter(function (pkg) {
        return _this.config.packages.indexOf(pkg) > -1;
      });
      this.config.packages = this.config.packages.filter(function (pkg) {
        return packages.indexOf(pkg) === -1;
      });
      return knownPkgs;
    }
  }, {
    key: "getDevPackages",
    value: function getDevPackages() {
      return this.config.devPackages;
    }
  }, {
    key: "addDevPackages",
    value: function addDevPackages() {
      var packageArr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      this.consolidatePackages(this.config.devPackages, packageArr);
    }
  }, {
    key: "removeDevPackages",
    value: function removeDevPackages() {
      var _this2 = this;

      var packages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var knownPkgs = packages.filter(function (pkg) {
        return _this2.config.devPackages.indexOf(pkg) > -1;
      });
      this.config.devPackages = this.config.devPackages.filter(function (pkg) {
        return packages.indexOf(pkg) === -1;
      });
      return knownPkgs;
    }
  }, {
    key: "consolidatePackages",
    value: function consolidatePackages(pkgArr) {
      var newPackages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      newPackages.forEach(function (item) {
        pkgArr.indexOf(item) === -1 && pkgArr.push(item);
      });
    }
  }]);

  return RootAppConfigModel;
}();

exports.default = RootAppConfigModel;