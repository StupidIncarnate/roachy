#! /usr/bin/env node
/**
 * Scaffold a project
 * args: roachy app appName install [packages]
 * args: roachy app appName uninstall [packages]
 * args: roachy app appName attach childApp
 * args: roachy app appName detach childApp
 */

import {ArgsHelper} from "../helpers/args-helper";
import {AppExec} from "../exec/app-exec";
const args = ArgsHelper.getArgs();
// remove app command from args
args.shift();

try {
	return AppExec.apply(null, args);
} catch(e) {
	throw e;
}