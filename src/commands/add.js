#! /usr/bin/env node
/**
 * Scaffold a project
 * args: roachy add appName appPath
 */

import {AddExec} from '../exec/add-exec';
import {ArgsHelper} from "../helpers/args-helper";
const args =  ArgsHelper.getArgs();
// remove add command from args
args.shift();

try {
	AddExec.apply(null, args);
} catch(e) {
	throw e;
}