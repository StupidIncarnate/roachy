import fs from "fs";
import path from "path";
import fsExtra from 'fs-extra';
import {REF} from "../config";
import {ErrorMessages} from "../error-messages";
import RootConfigModel from "../models/root-config.model";

export const FsHelper = {
	cwd() {
		return process.cwd();
	},
	joinPath(pathArr) {
		if(!Array.isArray(pathArr)) {
			pathArr = [pathArr];
		}
		return path.join.apply(null, pathArr);
	},
	getPath(pathArr) {
		if(!Array.isArray(pathArr)) {
			pathArr = [pathArr];
		}
		/**
		 * Convert to string to see if root is already appended
		 */
		let pathStr = path.join.apply(null, pathArr);
		let rootPath = this.getRootPath(this.cwd());
		if(pathStr.indexOf(rootPath) === -1) {
			return path.join(rootPath, pathStr);
		}
		return pathStr;
	},
	getRootPath(currentPath) {
		const splitPath = currentPath.split(path.sep);
		while(splitPath.length > 0) {
			const testPath = path.join(splitPath.join(path.sep), REF.configName)
			if(fs.existsSync(testPath)) {
				return splitPath.join(path.sep);
			}
			splitPath.pop();
		}

		throw new Error(ErrorMessages.ROOT_NOT_FOUND);
	},
	ensureRootPath() {
		process.chdir(this.getRootPath(this.cwd()));
	},
	exists(pathArr) {
		return fs.existsSync(this.getPath(pathArr));
	},
	openJson(folderPath) {
		return fsExtra.readJsonSync(path.join(folderPath, "package.json"));
	},
	writeJson(path, contents) {
		fsExtra.writeJsonSync(path, contents, {spaces: '\t'});
	},
	getRootConfig() {
		try{
			const initPath = FsHelper.getPath(REF.configName);
			if(!FsHelper.exists(initPath)) {
				throw new Error(ErrorMessages.ROOT_NOT_INIT);
			}
			return new RootConfigModel(fsExtra.readJsonSync(initPath));

		} catch(e) {
			throw new Error(ErrorMessages.ROOT_NOT_INIT);
		}
	},
	getRootPackageJson(){
		try{
			const initPath = FsHelper.getPath("package.json");
			if(!FsHelper.exists(initPath)) {
				throw new Error(ErrorMessages.ROOT_NOT_INIT);
			}
			return fsExtra.readJsonSync(initPath);

		} catch(e) {
			console.log(e);
			throw new Error(ErrorMessages.ROOT_NOT_INIT);
		}

	},
	saveRootConfig(config) {
		this.writeJson(FsHelper.getPath(REF.configName), config.toJSON());
	}
};