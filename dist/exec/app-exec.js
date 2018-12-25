"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppExec = void 0;

var _fsHelper = require("../helpers/fs-helper");

var _errorMessages = require("../error-messages");

var _attachCmd = require("./app/attach-cmd");

var _addCmd = require("./app/add-cmd");

var _detachCmd = require("./app/detach-cmd");

var _rootAppConfig = require("../models/root-app-config.model");

var _removeCmd = require("./app/remove-cmd");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var AppExec = function AppExec(appName, subCommand) {
  for (var _len = arguments.length, subCommandArgs = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    subCommandArgs[_key - 2] = arguments[_key];
  }

  var rootConfig = _fsHelper.FsHelper.getRootConfig();

  if (!rootConfig.hasApp(appName)) {
    throw new Error("".concat(_errorMessages.ErrorMessages.UNKNOWN_APP, ": ").concat(appName));
  }

  return Promise.resolve().then(function () {
    var _ref, _ref2, _ref3, _ref4;

    switch (subCommand) {
      /**
       * Attach child App to parent app
       */
      case "attach":
        return (0, _attachCmd.AttachCmd)(appName, subCommandArgs.shift());
        break;

      case "detach":
        return (0, _detachCmd.DetachCmd)(appName, subCommandArgs.shift());
        break;

      case "add":
        /**
         * in case packages come in as multi dimensional
         */
        subCommandArgs = (_ref = []).concat.apply(_ref, _toConsumableArray(subCommandArgs));
        /**
         * Add package(s) to app
         */

        return (0, _addCmd.AddCmd)(appName, _rootAppConfig.PACKAGE_TYPES.PACKAGES, subCommandArgs);
        break;

      case "add-dev":
        /**
         * in case packages come in as multi dimensional
         */
        subCommandArgs = (_ref2 = []).concat.apply(_ref2, _toConsumableArray(subCommandArgs));
        /**
         * Add package(s) to app
         */

        return (0, _addCmd.AddCmd)(appName, _rootAppConfig.PACKAGE_TYPES.DEV_PACKAGES, subCommandArgs);
        break;

      case "remove":
        /**
         * in case packages come in as multi dimensional
         */
        subCommandArgs = (_ref3 = []).concat.apply(_ref3, _toConsumableArray(subCommandArgs));
        /**
         * Remove package(s) to app
         */

        return (0, _removeCmd.RemoveCmd)(appName, _rootAppConfig.PACKAGE_TYPES.PACKAGES, subCommandArgs);
        break;

      case "remove-dev":
        /**
         * in case packages come in as multi dimensional
         */
        subCommandArgs = (_ref4 = []).concat.apply(_ref4, _toConsumableArray(subCommandArgs));
        /**
         * Remvoe package(s) to app
         */

        return (0, _removeCmd.RemoveCmd)(appName, _rootAppConfig.PACKAGE_TYPES.DEV_PACKAGES, subCommandArgs);
        break;

      default:
        throw new Error(_errorMessages.ErrorMessages.UNKNOWN_APP_COMMAND + " " + subCommand);
    }
  }).then(_fsHelper.FsHelper.regenAppPackageJsons);
};

exports.AppExec = AppExec;