import chalk from "chalk";
import fs from 'fs';
import {REF} from "../config";
import {FsHelper} from "../helpers/fs-helper";
import {RootConfigHelper} from "../helpers/root-config-helper";

export const InitExec = () => {

	const initPath = FsHelper.joinPath([FsHelper.cwd(), REF.configName]);
	if(fs.existsSync(initPath)) {
		throw new Error("Roachy already initialized. Too many cockroaches are a bad thing, ya know?");
	}

	FsHelper.writeJson(initPath, RootConfigHelper.getDefaultStructure());

	console.log(chalk.blue(`Roachy Init'd. Let roachy know what projects to keep track of via`), chalk.green("roachy add <appName> <appLocation>"));

}