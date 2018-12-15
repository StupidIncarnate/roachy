"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArgsHelper = void 0;

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ArgsHelper = {
  getArgs: function getArgs() {
    var _process$argv = _toArray(process.argv),
        args = _process$argv.slice(2);

    return args;
  }
};
exports.ArgsHelper = ArgsHelper;