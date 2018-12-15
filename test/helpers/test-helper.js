import path from "path";
import fsExtra from "fs-extra";
const currentDir = __dirname;

export const TestHelper = {
	getTestArea: ()=> path.join(currentDir, "..", "stg"),
	ensureFileExists(pathArr){
		return fs.ensureFile(this.getTestArea(), pathArr);
	},
	prepEnvironment() {
		fsExtra.emptyDirSync(this.getTestArea());
		process.chdir(this.getTestArea());
	}
};