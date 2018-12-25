#! /usr/bin/env node
/**
 * Scaffold a project
 * args: roachy add appName appPath
 */

import {ArgsHelper} from "../helpers/args-helper";
import {InstallExec} from "../exec/install-exec";
const args =  ArgsHelper.getArgs();
// remove add command from args
args.shift();

try {
	InstallExec.apply(null, args);
} catch(e) {
	throw e;
}