import {FsHelper} from "../../helpers/fs-helper";
import {ErrorMessages} from "../../error-messages";
import {RootConfigHelper} from "../../helpers/root-config-helper";
import {NpmExecHelper} from "../../helpers/npm-exec-helper";

import AppsUpgrader from "../../classes/apps-upgrader";

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


	/**
	 * Check packages getting installed
	 * - if it doesnt exist in rootApp, install
	 * - if it does exist in root app, make sure to strip version so we dont install a bad version
	 *
	 * Add to app deps and rebuild dep trees
	 */

	// appsUpgrader.snapshotRoot();
	//
	// return NpmExecHelper.install(packages).then(()=>{
	// 	appsUpgrader.upgradeApps();
	// }).catch(err =>{
	// 	appsUpgrader.upgradeApps();
	// });
};