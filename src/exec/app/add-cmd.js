import {FsHelper} from "../../helpers/fs-helper";
import {ErrorMessages} from "../../error-messages";
import {RootConfigHelper} from "../../helpers/root-config-helper";

export const AddCmd = (appName, packages) => {
	/**
	 * Args can be any number of apps and packages
	 */

	FsHelper.ensureRootPath();

	packages = packages || [];

	if(packages.length === 0) {
		throw new Error(ErrorMessages.PACKAGES_REQUIRED);
	}

	const rootConfig = FsHelper.getRootConfig();
	const installedPkgs = Object.keys(RootConfigHelper.getPackages(rootConfig));

	const unknownPackages = packages.filter(pkg => installedPkgs.indexOf(pkg) === -1);
	if(unknownPackages.length) {
		throw new Error(ErrorMessages.NOT_INSTALLED + " " + unknownPackages.join(","))
	}

	const appConfig = RootConfigHelper.getAppConfig(rootConfig, appName);
	RootConfigHelper.setAppPackages(appConfig, RootConfigHelper.getAppPackages(appConfig).concat(packages));

	FsHelper.saveRootConfig(rootConfig);

	// Build out package.json deps for all apps

	// appsUpgrader.snapshotRoot();
	//
	// return NpmExecHelper.install(packages).then(()=>{
	// 	appsUpgrader.upgradeApps();
	// }).catch(err =>{
	// 	appsUpgrader.upgradeApps();
	// });
};