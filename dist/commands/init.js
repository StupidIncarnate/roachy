#! /usr/bin/env node

/**
 * Scaffold a project
 */
"use strict";

var _init = _interopRequireDefault(require("../exec/init"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

try {
  (0, _init.default)();
} catch (e) {
  throw e;
}