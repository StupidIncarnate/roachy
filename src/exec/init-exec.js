import chalk from "chalk";
import fs from 'fs';
import {REF} from "../config";
import {FsHelper} from "../helpers/fs-helper";
import RootConfigModel from "../models/root-config.model";
import {NpmExecHelper} from "../helpers/npm-exec-helper";
import {PackageHelper} from "../helpers/package-helper";

const ensureNodeModulesExists = () => {
	const rootPackageJsonPath = FsHelper.joinPath([FsHelper.cwd(), "package.json"]);
	if(!FsHelper.exists(rootPackageJsonPath)) {
		FsHelper.writeJson(rootPackageJsonPath, {
			name: "app-commander",
			private: true,
			description: "app-commander",
			version: "0.0.1",
			scripts: {},
			dependencies: {

			},
			devDependencies: {

			}
		});
	}
	if(!FsHelper.exists(FsHelper.joinPath([FsHelper.cwd(), "node_modules"]))) {
		return NpmExecHelper.install();
	}

	return Promise.resolve();
};
const processPkgJson = ()=> {
	return ensureNodeModulesExists().then(()=>{

		let rootPackageJson = FsHelper.openPackageJson(FsHelper.cwd());

		/**
		 * Get installed dep versions
		 */
		const versionPromises = [];
		const pkgVersions = {};
		for(const pkg in PackageHelper.getInstalled(rootPackageJson)) {
			versionPromises.push(NpmExecHelper.getInstalledVersion(pkg).then(version => {
				pkgVersions[pkg] = version;
			}));
		}

		return Promise.all(versionPromises).then(()=> {
			const rootConfig = FsHelper.getRootConfig();
			rootConfig.addPackages(pkgVersions);
			FsHelper.saveRootConfig(rootConfig);
		});

	});
};
export const InitExec = () => {

	const initPath = FsHelper.joinPath([FsHelper.cwd(), REF.configName]);
	if(fs.existsSync(initPath)) {
		throw new Error("Roachy already initialized. Too many cockroaches are a bad thing, ya know?");
	}

	/**
	 * This needs to be a direct write because the save in RootConfigModel
	 * checks for an existing root modelconfig to save properly
	 */
	FsHelper.writeJson(initPath, RootConfigModel.getDefaultStructure());

	return processPkgJson().then(()=>{
		console.log(chalk.blue(`Roachy Init'd. Let roachy know what projects to keep track of via`), chalk.green("roachy add <appName> <appLocation>"));

	});
};