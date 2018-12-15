"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FsHelper = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _config = require("../config");

var _errorMessages = require("../error-messages");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FsHelper = {
  cwd: function cwd() {
    return process.cwd();
  },
  joinPath: function joinPath(pathArr) {
    if (!Array.isArray(pathArr)) {
      pathArr = [pathArr];
    }

    return _path.default.join.apply(null, pathArr);
  },
  getPath: function getPath(pathArr) {
    if (!Array.isArray(pathArr)) {
      pathArr = [pathArr];
    }
    /**
     * Convert to string to see if root is already appended
     */


    var pathStr = _path.default.join.apply(null, pathArr);

    var rootPath = this.getRootPath(this.cwd());

    if (pathStr.indexOf(rootPath) === -1) {
      return _path.default.join(rootPath, pathStr);
    }

    return pathStr;
  },
  getRootPath: function getRootPath(currentPath) {
    var splitPath = currentPath.split(_path.default.sep);

    while (splitPath.length > 0) {
      var testPath = _path.default.join(splitPath.join(_path.default.sep), _config.REF.configName);

      if (_fs.default.existsSync(testPath)) {
        return splitPath.join(_path.default.sep);
      }

      splitPath.pop();
    }

    throw new Error(_errorMessages.ErrorMessages.ROOT_NOT_FOUND);
  },
  exists: function exists(pathArr) {
    return _fs.default.existsSync(this.getPath(pathArr));
  },
  writeJson: function writeJson(path, contents) {
    _fsExtra.default.writeJsonSync(path, contents, {
      spaces: '\t'
    });
  },
  getRootConfig: function getRootConfig() {
    try {
      var initPath = FsHelper.getPath(_config.REF.configName);

      if (!FsHelper.exists(initPath)) {
        throw new Error(_errorMessages.ErrorMessages.ROOT_NOT_INIT);
      }

      return _fsExtra.default.readJsonSync(initPath);
    } catch (e) {
      throw new Error(_errorMessages.ErrorMessages.ROOT_NOT_INIT);
    }
  },
  saveRootConfig: function saveRootConfig(config) {
    this.writeJson(FsHelper.getPath(_config.REF.configName), config);
  }
};
exports.FsHelper = FsHelper;