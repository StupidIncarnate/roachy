"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PackageHelper = void 0;
var PackageHelper = {
  getInstalled: function getInstalled(packagejson) {
    return packagejson.dependencies || {};
  },
  getDevInstalled: function getDevInstalled(packagejson) {
    return packagejson.devDependencies || {};
  },
  getPackageName: function getPackageName(pkgName) {
    if (pkgName.indexOf("@") > -1) {
      return pkgName.substr(0, pkgName.indexOf("@"));
    }

    return pkgName;
  },
  getCheckableVersion: function getCheckableVersion(version) {
    if (version === "*") {
      return null;
    }

    if (version.startsWith("^") || version.startsWith("~")) {
      return version.substr(1);
    }

    return version;
  }
};
exports.PackageHelper = PackageHelper;