#! /usr/bin/env node
/**
 * Scaffold a project
 */

import init from '../exec/init';

try {
	init();
} catch(e) {
	throw e;
}