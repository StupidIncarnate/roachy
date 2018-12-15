import {REF} from "../config";

import fs from "fs";
import path from "path";
import chalk from "chalk";

export default () => {
	const initDir = __dirname;

	if(fs.existsSync(path.join(__dirname, initDir))) {
		throw new Error("Roachy already initialized. Too many cockroaches are a bad thing, ya know?");
	}

	fs.writeFileSync(path.join(initDir, REF.configName), {
		version: 0.1,
		projects: [],
		projectDependencies: {},
		packages: {}
	});

	console.log(chalk.blue(`Roachy Init'd. Let roachy know what projects to keep track of via`), chalk.green("roachy add <projectName> <projectLocation>"));
}