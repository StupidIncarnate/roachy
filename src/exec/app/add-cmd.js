import {FsHelper} from "../../helpers/fs-helper";
import {ErrorMessages} from "../../error-messages";

export const AddCmd = (appName, packages = []) => {
	/**
	 * Args can be any number of apps and packages
	 */

	FsHelper.ensureRootPath();

	if(packages.length === 0) {
		throw new Error(ErrorMessages.PACKAGES_REQUIRED);
	}

	const rootConfig = FsHelper.getRootConfig();
	const installedPkgs = Object.keys(rootConfig.getPackages());

	const unknownPackages = packages.filter(pkg => installedPkgs.indexOf(pkg) === -1);
	if(unknownPackages.length) {
		throw new Error(ErrorMessages.NOT_INSTALLED + " " + unknownPackages.join(","))
	}

	const appConfig = rootConfig.getApp(appName);
	appConfig.addPackages(packages);

	FsHelper.saveRootConfig(rootConfig);

	return Promise.resolve();
	// Build out package.json deps for all apps

	// appsUpgrader.snapshotRoot();
	//
	// return NpmExecHelper.install(packages).then(()=>{
	// 	appsUpgrader.upgradeApps();
	// }).catch(err =>{
	// 	appsUpgrader.upgradeApps();
	// });
};