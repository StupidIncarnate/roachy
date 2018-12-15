"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _config = require("../config");

var _fsHelper = require("../helpers/fs-helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default() {
  var initPath = _fsHelper.FsHelper.getPath([_fsHelper.FsHelper.cwd(), _config.REF.configName]);

  if (_fsHelper.FsHelper.exists(initPath)) {
    throw new Error("Roachy already initialized. Too many cockroaches are a bad thing, ya know?");
  }

  _fsHelper.FsHelper.writeJson(initPath, {
    version: 0.1,
    projects: [],
    projectDependencies: {},
    packages: {}
  });

  console.log(_chalk.default.blue("Roachy Init'd. Let roachy know what projects to keep track of via"), _chalk.default.green("roachy add <projectName> <projectLocation>"));
};

exports.default = _default;