"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RootConfigHelper = void 0;
var RootConfigHelper = {
  getDefaultStructure: function getDefaultStructure() {
    return {
      version: 0.1,
      apps: {},
      appDependencies: {},
      packages: {},
      devPackages: {}
    };
  },
  hasApp: function hasApp(config, appName) {
    return config.apps.indexOf(appName) !== -1;
  },
  addApp: function addApp(config, appName, appLocation) {
    config.apps[appName] = appLocation;
  }
};
exports.RootConfigHelper = RootConfigHelper;