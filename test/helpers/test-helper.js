import path from "path";
import fs from 'fs';
import fsExtra from "fs-extra";
import {InitExec} from "../../src/exec/init-exec";
import {REF} from "../../src/config";
import {AddExec} from "../../src/exec/add-exec";
import {InstallExec} from "../../src/exec/install-exec";
import chai, {expect} from "chai";
import {AppExec} from "../../src/exec/app-exec";
import RootConfigModel from "../../src/models/root-config.model";
import {FsHelper} from "../../src/helpers/fs-helper";
const currentDir = __dirname;

chai.use(require("chai-match"));

export const AppNames = {
	LIB_COMMON: "lib-common",
	LIB_UI: "lib-ui",
	TIMEWATCH_UI: "timewatch-ui"
};

export const TestHelper = {
	getTestArea: ()=> path.join(currentDir, "..", "stg"),
	formatPath(pathArr) {
		if(!Array.isArray(pathArr)) {
			pathArr = [pathArr];
		}
		pathArr.unshift(this.getTestArea());
		return path.join.apply(null, pathArr)
	},
	getRootConfig(){
		return new RootConfigModel(this.getJsonContents(REF.configName));
	},
	getRootConfigObject() {
		return this.getRootConfig().config;
	},
	getRootPackage(){
		return this.getJsonContents("package.json");
	},
	getJsonContents(pathArr) {
		return fsExtra.readJsonSync(this.formatPath(pathArr))
	},
	ensureFileExists(pathArr){
		return fs.existsSync(this.formatPath(pathArr));
	},
	prepEnvironment() {
		fsExtra.emptyDirSync(this.getTestArea());
		fsExtra.copySync(path.join(__dirname, "..", "bootstrap-structure"), this.getTestArea());
		process.chdir(this.getTestArea());
	},
	getLibCommonPath(){
		return "src/lib/lib-common";
	},
	getLibUiPath(){
		return "src/lib/lib-ui";
	},
	getTimewatchUiPath(){
		return "src/apps/timewatch-app/ui";
	},
	initEnvironment() {
		InitExec();
	},
	initLibCommonApp(){
		AddExec("lib-common", this.getLibCommonPath());
	},
	initLibUiApp() {
		AddExec("lib-ui", this.getLibUiPath());
	},
	initTimewatcherUiLibUiApp() {
		AddExec("timewatch-ui", this.getTimewatchUiPath());
	},
	installPackage(pkg) {
		return InstallExec([pkg]);
	},
	addPackageToApp(appName, pkgs) {
		return AppExec(appName, "add", pkgs);
	},
	attachApp(parentAppName, childAppName) {
		return AppExec(parentAppName, "attach", childAppName);
	},

	expectStaticVersions(pkgObj) {
		for(const pkg in pkgObj) {
			expect(pkgObj[pkg]).to.match(/^\d+\.\d+\.\d+$/);
		}
	},
	expectAppPackageJsonDeps(appName, pkgs) {
		const rootConfig = this.getRootConfig();
		const appPackageJson = FsHelper.getAppPackageJson(rootConfig.getApp(appName));
		pkgs.forEach(pkg => {
			expect(appPackageJson.dependencies).to.have.property(pkg);
		});
		TestHelper.expectStaticVersions(appPackageJson.dependencies);

		return appPackageJson;
	}
};