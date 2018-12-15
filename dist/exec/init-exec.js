"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InitExec = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _fs = _interopRequireDefault(require("fs"));

var _config = require("../config");

var _fsHelper = require("../helpers/fs-helper");

var _rootConfigHelper = require("../helpers/root-config-helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InitExec = function InitExec() {
  var initPath = _fsHelper.FsHelper.joinPath([_fsHelper.FsHelper.cwd(), _config.REF.configName]);

  if (_fs.default.existsSync(initPath)) {
    throw new Error("Roachy already initialized. Too many cockroaches are a bad thing, ya know?");
  }

  _fsHelper.FsHelper.writeJson(initPath, _rootConfigHelper.RootConfigHelper.getDefaultStructure());

  console.log(_chalk.default.blue("Roachy Init'd. Let roachy know what projects to keep track of via"), _chalk.default.green("roachy add <appName> <appLocation>"));
};

exports.InitExec = InitExec;