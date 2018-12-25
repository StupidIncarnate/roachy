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