#! /usr/bin/env node

/**
 * Scaffold a project
 * args: roachy add appName appPath
 */
"use strict";

var _addExec = require("../exec/add-exec");

var _argsHelper = require("../helpers/args-helper");

var args = _argsHelper.ArgsHelper.getArgs(); // remove add command from args


args.shift();

try {
  _addExec.AddExec.apply(null, args);
} catch (e) {
  throw e;
}