import fs from "fs";
import path from "path";
import fsExtra from 'fs-extra';

export const FsHelper = {
	cwd() {
		return process.cwd();
	},
	getPath(pathArr) {
		if(!Array.isArray(pathArr)) {
			pathArr = [pathArr];
		}
		return path.join.apply(null, pathArr);
	},
	exists(pathArr) {
		return fs.existsSync(this.getPath(pathArr));
	},
	writeJson(path, contents) {
		fsExtra.outputJsonSync(path, contents);
	}
};