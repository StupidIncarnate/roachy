import {FsHelper} from "../helpers/fs-helper";
import {ErrorMessages} from "../error-messages";
import {PackageHelper} from "../helpers/package-helper";
import {InstallExec} from "./install-exec";
import chalk from "chalk";

/**
 * Error if pkg
 */
const reconcileExistingPackageJson = (rootConfig, appName, appLocation) => {
	let appDeps = [], appDevDeps = [];
	return Promise.resolve().then(() =>{
		/**
		 * Account for package.json
		 */
		if(!FsHelper.exists([appLocation, "package.json"])) {
			console.log(chalk.yellow(`No app package.json existed. Creating in folder...`));
			FsHelper.writeJson(FsHelper.getPath([appLocation, "package.json"]), {
				name: appName,
				private: true,
				description: appName,
				version: "0.0.1",
				scripts: {
					"start": "index.js"
				},
				dependencies: {

				},
				devDependencies: {

				}
			});

			return true;

		}

		/**
		 * Check if packages are copasetic with root packages
		 */
		const rootPackages = rootConfig.getPackages();

		/**
		 * getpkg and devPkgs for app
		 */
		const pkgJson = FsHelper.openPackageJson(FsHelper.getPath(appLocation));
		appDeps = Object.keys(PackageHelper.getInstalled(pkgJson));
		appDevDeps = Object.keys(PackageHelper.getDevInstalled(pkgJson));

		const appPkgs = FsHelper.getPackageJsonDeps(appLocation);
		const badVersions = [], newPackages = [];

		for(const pkgName in appPkgs) {
			if(rootPackages[pkgName]
				&& PackageHelper.getCheckableVersion(appPkgs[pkgName]) !== PackageHelper.getCheckableVersion(rootPackages[pkgName])) {
				badVersions.push(
					`${pkgName}: root(${PackageHelper.getCheckableVersion(rootPackages[pkgName])})-app(${PackageHelper.getCheckableVersion(appPkgs[pkgName])})`
				);
			}

			if(!rootPackages[pkgName]) {
				newPackages.push(`${pkgName}@${PackageHelper.getCheckableVersion(appPkgs[pkgName])}`);
			}
		}

		/**
		 * Throw if app pkgs versions need to be fixed
		 */
		if(badVersions.length) {
			throw new Error(`${badVersions.join(", ")} ${ErrorMessages.APP_ROOT_VERSION_MISMATCH}`);
		}

		/**
		 * We want to delete before installing just in case node tries to pull these in.
		 */
		FsHelper.deletePath([appLocation, "node_modules"]);

		if(!newPackages.length) {
			return true;
		}

		/**
		 * If there are new packages, install them to root
		 */
		return InstallExec(newPackages);
	}).then(()=>{
		return {
			packages: appDeps,
			devPackages: appDevDeps
		}
	});
};
export const AddExec = (appName, appLocation) => {
	const rootConfig = FsHelper.getRootConfig();

	if(!appName) {
		throw new Error(ErrorMessages.APP_NAME_REQUIRED)
	}
	if(appName.match(/[^a-z\-]/)) {
		throw new Error(ErrorMessages.APP_NAME_INVALID);
	}

	if(!appLocation) {
		throw new Error(ErrorMessages.APP_LOCATION_REQUIRED);
	}


	if(!FsHelper.exists(appLocation)){
		throw new Error(`${ErrorMessages.APP_LOCATION_INVALID}: ${appLocation}`)
	}

	const cwd = FsHelper.cwd();
	return reconcileExistingPackageJson(rootConfig, appName, appLocation).then(({packages, devPackages}) => {

		console.log(chalk.grey(`Adding app to Roachy...`));
		const rootConfig = FsHelper.getRootConfig();
		rootConfig.addApp(appName, appLocation);

		const appConfig = rootConfig.getApp(appName);
		appConfig.addPackages(packages);
		appConfig.addDevPackages(devPackages);

		FsHelper.saveRootConfig(rootConfig);

		FsHelper.regenAppPackageJsons(appName);

		FsHelper.changeCwd(cwd);
		console.log(chalk.blue(`The following app has been added to Roachy: ${appName}`));
	});


};