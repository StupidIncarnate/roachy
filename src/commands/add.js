#! /usr/bin/env node
/**
 * Scaffold a project
 * args: roachy add name path
 */

import {AddExec} from '../exec/add-exec';
import {ArgsHelper} from "../helpers/args-helper";

try {
	AddExec().apply(null, ArgsHelper.getArgs());
} catch(e) {
	throw e;
}