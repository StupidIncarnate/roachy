import fs from "fs";
import path from "path";
import fsExtra from 'fs-extra';
import {REF} from "../config";
import {ErrorMessages} from "../error-messages";

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
	exists(pathArr) {
		return fs.existsSync(this.getPath(pathArr));
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
			return fsExtra.readJsonSync(initPath);

		} catch(e) {
			throw new Error(ErrorMessages.ROOT_NOT_INIT);
		}
	},
	saveRootConfig(config) {
		this.writeJson(FsHelper.getPath(REF.configName), config);
	}
};