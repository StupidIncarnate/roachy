#! /usr/bin/env node

/**
 * Scaffold a project
 */
"use strict";

var _initExec = require("../exec/init-exec");

try {
  (0, _initExec.InitExec)();
} catch (e) {
  throw e;
}