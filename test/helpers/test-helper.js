import path from "path";
import fs from 'fs';
import fsExtra from "fs-extra";
const currentDir = __dirname;

export const TestHelper = {
	getTestArea: ()=> path.join(currentDir, "..", "stg"),
	formatPath(pathArr) {
		if(!Array.isArray(pathArr)) {
			pathArr = [pathArr];
		}
		pathArr.unshift(this.getTestArea());
		return path.join.apply(null, pathArr)
	},
	getJsonContents(pathArr) {
		return fsExtra.readJsonSync(this.formatPath(pathArr))
	},
	ensureFileExists(pathArr){
		return fs.existsSync(this.formatPath(pathArr));
	},
	prepEnvironment() {
		fsExtra.emptyDirSync(this.getTestArea());
		process.chdir(this.getTestArea());
	}
};