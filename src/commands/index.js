#! /usr/bin/env node

import {ArgsHelper} from "../helpers/args-helper";
import {AddExec} from "../exec/add-exec";
import {AppExec} from "../exec/app-exec";
import {InitExec} from "../exec/init-exec";
import {InstallExec} from "../exec/install-exec";
import {UninstallExec} from "../exec/uninstall-exec";
const args =  ArgsHelper.getArgs();

const callCmd = args.shift();
let p;
try {
	switch(callCmd) {
		case "add":
			p = AddExec.apply(null, args);
			break;
		case "app":
			p = AppExec.apply(null, args);
			break;
		case "init":
			p = InitExec();
			break;
		case "install":
			p = InstallExec(args);
			break;
		case "uninstall":
			p = UninstallExec(args);
			break;
		default:
			console.error(`Unknown CMD: ${callCmd} ${args}`);
	}

	if(p) {
		p.then(()=>{
			process.exit();
		}).catch(e =>{
			console.error(e);
			process.exit(1);
		})
	}
} catch(e) {
	console.error(e);
	throw e;
}