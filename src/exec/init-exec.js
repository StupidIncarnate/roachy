import chalk from "chalk";
import fs from 'fs';
import {REF} from "../config";
import {FsHelper} from "../helpers/fs-helper";
import RootConfigModel from "../models/root-config.model";

export const InitExec = () => {

	const initPath = FsHelper.joinPath([FsHelper.cwd(), REF.configName]);
	if(fs.existsSync(initPath)) {
		throw new Error("Roachy already initialized. Too many cockroaches are a bad thing, ya know?");
	}

	/**
	 * This needs to be a direct write because the save in RootConfigModel
	 * checks for an existing rootmodelconfig to save properly
	 */
	FsHelper.writeJson(initPath, RootConfigModel.getDefaultStructure());

	console.log(chalk.blue(`Roachy Init'd. Let roachy know what projects to keep track of via`), chalk.green("roachy add <appName> <appLocation>"));

}