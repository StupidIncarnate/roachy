import chalk from "chalk";
import {REF} from "../config";
import {FsHelper} from "../helpers/fs-helper";

export default () => {

	const initPath = FsHelper.getPath([FsHelper.cwd(), REF.configName]);
	if(FsHelper.exists(initPath)) {
		throw new Error("Roachy already initialized. Too many cockroaches are a bad thing, ya know?");
	}

	FsHelper.writeJson(initPath, {
		version: 0.1,
		projects: [],
		projectDependencies: {},
		packages: {}
	});

	console.log(chalk.blue(`Roachy Init'd. Let roachy know what projects to keep track of via`), chalk.green("roachy add <projectName> <projectLocation>"));

}