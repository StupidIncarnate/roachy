#! /usr/bin/env node
/**
 * Scaffold a project
 * roachy init
 */


import {InitExec} from "../exec/init-exec";

try {
	return InitExec();
} catch(e) {
	throw e;
}