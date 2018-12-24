import {FsHelper} from "../../helpers/fs-helper";
import {ErrorMessages} from "../../error-messages";
import {PACKAGE_TYPES} from "../../models/root-app-config.model";

export const AddCmd = (appName, packageType, packages = []) => {
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

	if(packageType === PACKAGE_TYPES.PACKAGES) {
		appConfig.addPackages(packages);
	} else {
		appConfig.addDevPackages(packages);
	}

	FsHelper.saveRootConfig(rootConfig);

	return Promise.resolve();

};