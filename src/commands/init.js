#! /usr/bin/env node
/**
 * Scaffold a project
 */


import {InitExec} from "../exec/init-exec";

try {
	InitExec();
} catch(e) {
	throw e;
}