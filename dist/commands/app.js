#! /usr/bin/env node

/**
 * Scaffold a project
 * args: roachy app appName install [packages]
 * args: roachy app appName uninstall [packages]
 * args: roachy app appName attach childApp
 * args: roachy app appName detach childApp
 */
"use strict";

var _argsHelper = require("../helpers/args-helper");

var _appExec = require("../exec/app-exec");

var args = _argsHelper.ArgsHelper.getArgs(); // remove app command from args


args.shift();

try {
  _appExec.AppExec.apply(null, args);
} catch (e) {
  throw e;
}