import fs from "fs";
import path from "path";
import fsExtra from 'fs-extra';
import {REF} from "../config";
import {ErrorMessages} from "../error-messages";
import RootConfigModel from "../models/root-config.model";
import {PACKAGE_TYPES} from "../models/root-app-config.model";
import {NpmExecHelper} from "./npm-exec-helper";

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
	regenAppPackageJsons() {
		/**
		 * re-pull for struct changes
		 */
		let rootConfig = FsHelper.getRootConfig();

		const cwd = FsHelper.cwd();
		/**
		 * Rebuild package.jsons for each app
		 */
		let p = Promise.resolve();
		for(const appName of rootConfig.getAppNames()) {

			p = p.then(()=>{
				const appConfig = rootConfig.getApp(appName);
				const appPackageJson = FsHelper.getAppPackageJson(appConfig);
				appPackageJson.dependencies = rootConfig.buildPackageDepList(appName, PACKAGE_TYPES.PACKAGES);
				appPackageJson.devDpendencies = rootConfig.buildPackageDepList(appName, PACKAGE_TYPES.DEV_PACKAGES);

				FsHelper.saveAppPackageJson(appConfig, appPackageJson);

				FsHelper.changeCwd(appConfig.getPath());
				return NpmExecHelper.writePackageLock();
			});

		}

		p = p.then(()=>{
			FsHelper.changeCwd(cwd);
		});
		return p;
	}
};