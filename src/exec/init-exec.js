import chalk from "chalk";
import fs from 'fs';
import {REF} from "../config";
import {FsHelper} from "../helpers/fs-helper";
import RootConfigModel from "../models/root-config.model";
import {NpmExecHelper} from "../helpers/npm-exec-helper";
import {PackageHelper} from "../helpers/package-helper";

const processPkgJson = ()=> {
	return Promise.resolve().then(()=>{
		const rootPackageJsonPath = FsHelper.joinPath([FsHelper.cwd(), "package.json"]);
		if(FsHelper.exists(rootPackageJsonPath)) {
			let rootPackageJson = FsHelper.openPackageJson(FsHelper.cwd());
			const consolidatedPkgs = {};
			for(const pkg in PackageHelper.getInstalled(rootPackageJson)) {
				consolidatedPkgs[pkg] = PackageHelper.getInstalled(rootPackageJson)[pkg];
			}
			for(const pkg in PackageHelper.getDevInstalled(rootPackageJson)) {
				consolidatedPkgs[pkg] = PackageHelper.getDevInstalled(rootPackageJson)[pkg];
			}

			const packageList = [];
			for(const pkg in consolidatedPkgs) {
				packageList.push(`${pkg}@${consolidatedPkgs[pkg]}`);
			}

			rootPackageJson.dependencies = {};
			rootPackageJson.devDependencies = {};

			FsHelper.writeJson(rootPackageJsonPath, rootPackageJson);

			return NpmExecHelper.install(packageList, true).then(()=>{
				/**
				 * Reopen to pull package versions
				 */
				const installedPkgObj = FsHelper.getPackageJsonDeps(FsHelper.cwd());
				const rootConfig = FsHelper.getRootConfig();
				rootConfig.addPackages(installedPkgObj);
				FsHelper.saveRootConfig(rootConfig);
			});

		} else {
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
	});
};
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

	return processPkgJson().then(()=>{
		console.log(chalk.blue(`Roachy Init'd. Let roachy know what projects to keep track of via`), chalk.green("roachy add <appName> <appLocation>"));

	});
};