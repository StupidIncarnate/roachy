import fs from "fs";
import path from "path";
import fsExtra from 'fs-extra';
import {REF} from "../config";
import {ErrorMessages} from "../error-messages";
import RootConfigModel from "../models/root-config.model";
import {PACKAGE_TYPES} from "../models/root-app-config.model";
import {NpmExecHelper} from "./npm-exec-helper";
import {PackageHelper} from "./package-helper";
import chalk from "chalk";

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
	deletePath(pathArr) {
		if(FsHelper.exists(pathArr)) {
			const deletePath = this.getPath(pathArr);
			console.log(chalk.yellow(`Deleting ${deletePath}...`));
			return fsExtra.removeSync(deletePath);
		}

		return true
	},
	ensureRootPath() {
		process.chdir(this.getRootPath(this.cwd()));
	},
	changeCwd(pathArr) {
		process.chdir(this.getPath(pathArr));
	},
	exists(pathArr) {
		return fs.existsSync(this.getPath(pathArr));
	},
	openPackageJson(folderPath) {
		return fsExtra.readJsonSync(path.join(folderPath, "package.json"));
	},
	writeJson(path, contents) {
		fsExtra.writeJsonSync(path, contents, {spaces: '\t'});
	},
	getProdPackageJsonDeps(folderPath) {
		const pkgJson = this.openPackageJson(this.getPath(folderPath));
		const returnPkgs = {};
		const installedPkgs = PackageHelper.getInstalled(pkgJson);
		for(const pkgName in installedPkgs) {
			returnPkgs[pkgName] = PackageHelper.getCheckableVersion(installedPkgs[pkgName]);
		}

		return returnPkgs;
	},
	getPackageJsonDepNames(folderPath) {
		const pkgJson = this.openPackageJson(this.getPath(folderPath));

		const returnPkgs = Object.keys(PackageHelper.getDevInstalled(pkgJson));
		const installedPkgs = Object.keys(PackageHelper.getInstalled(pkgJson));
		for(const pkgName of installedPkgs) {
			if(returnPkgs.indexOf(pkgName) === -1) {
				returnPkgs.push(pkgName);
			}
		}

		return returnPkgs;
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
	},
	getAppPackageJson(appConfig) {
		return this.openPackageJson(this.getPath(appConfig.getPath()));
	},
	saveAppPackageJson(appConfig, pkgJson) {
		return this.writeJson(this.getPath([appConfig.getPath(), "package.json"]), pkgJson);
	},
	regenAppPackageJsons(appName) {
		/**
		 * re-pull for struct changes
		 */
		let rootConfig = FsHelper.getRootConfig();

		const cwd = FsHelper.cwd();
		const apps = appName ? [appName] : rootConfig.getAppNames();

		console.log(chalk.yellow(`Seeing about regen'ing package.jsons any apps....`));
		/**
		 * Rebuild package.jsons for each app
		 */
		let p = Promise.resolve();
		for(const appName of apps) {

			p = p.then(()=>{
				const appConfig = rootConfig.getApp(appName);
				const appPackageJson = FsHelper.getAppPackageJson(appConfig);
				const oldDepStr = JSON.stringify(appPackageJson.dependencies);
				const oldDevDepStr = JSON.stringify(appPackageJson.devDependencies);

				appPackageJson.dependencies = rootConfig.buildPackageDepList(appName, PACKAGE_TYPES.PACKAGES);
				appPackageJson.devDependencies = rootConfig.buildPackageDepList(appName, PACKAGE_TYPES.DEV_PACKAGES);

				/**
				 *  If one of the deps have changed, then we want to output the new package.json /lock files
				 */
				if(
					oldDepStr !== JSON.stringify(appPackageJson.dependencies)
					|| oldDevDepStr !== JSON.stringify(appPackageJson.devDependencies)
				) {
					console.log(chalk.yellow(`Regening package.json for ${appName}`));
					FsHelper.saveAppPackageJson(appConfig, appPackageJson);
					FsHelper.deletePath([appConfig.getPath(), "package-lock.json"]);
					FsHelper.changeCwd(appConfig.getPath());
					return NpmExecHelper.writePackageLock();
				}
			});

		}

		p = p.then(()=>{
			FsHelper.changeCwd(cwd);
		});
		return p;
	}
};