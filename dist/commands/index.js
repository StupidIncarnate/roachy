#! /usr/bin/env node
"use strict";

var _argsHelper = require("../helpers/args-helper");

var _addExec = require("../exec/add-exec");

var _appExec = require("../exec/app-exec");

var _initExec = require("../exec/init-exec");

var _installExec = require("../exec/install-exec");

var _uninstallExec = require("../exec/uninstall-exec");

var args = _argsHelper.ArgsHelper.getArgs();

var callCmd = args.shift();
var p;

try {
  switch (callCmd) {
    case "add":
      p = _addExec.AddExec.apply(null, args);
      break;

    case "app":
      p = _appExec.AppExec.apply(null, args);
      break;

    case "init":
      p = (0, _initExec.InitExec)();
      break;

    case "install":
      p = (0, _installExec.InstallExec)(args);
      break;

    case "uninstall":
      p = (0, _uninstallExec.UninstallExec)(args);
      break;

    default:
      console.error("Unknown CMD: ".concat(callCmd, " ").concat(args));
  }

  if (p) {
    p.then(function () {
      process.exit();
    }).catch(function (e) {
      console.error(e);
      process.exit(1);
    });
  }
} catch (e) {
  console.error(e);
  throw e;
}