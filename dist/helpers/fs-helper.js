"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FsHelper = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FsHelper = {
  cwd: function cwd() {
    return process.cwd();
  },
  getPath: function getPath(pathArr) {
    if (!Array.isArray(pathArr)) {
      pathArr = [pathArr];
    }

    return _path.default.join.apply(null, pathArr);
  },
  exists: function exists(pathArr) {
    return _fs.default.existsSync(this.getPath(pathArr));
  },
  writeJson: function writeJson(path, contents) {
    _fsExtra.default.outputJsonSync(path, contents);
  }
};
exports.FsHelper = FsHelper;