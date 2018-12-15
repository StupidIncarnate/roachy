#! /usr/bin/env node

/**
 * Scaffold a project
 * args: roachy add name path
 */
"use strict";

var _addExec = require("../exec/add-exec");

var _argsHelper = require("../helpers/args-helper");

try {
  (0, _addExec.AddExec)().apply(null, _argsHelper.ArgsHelper.getArgs());
} catch (e) {
  throw e;
}