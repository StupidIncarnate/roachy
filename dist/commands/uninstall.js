#! /usr/bin/env node

/**
 * Scaffold a project
 * args: roachy add appName appPath
 */
"use strict";

var _argsHelper = require("../helpers/args-helper");

var _installExec = require("../exec/install-exec");

var args = _argsHelper.ArgsHelper.getArgs(); // remove add command from args


args.shift();

try {
  _installExec.InstallExec.apply(null, args);
} catch (e) {
  throw e;
}