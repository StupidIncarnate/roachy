import {FsHelper} from "../../helpers/fs-helper";
import {ErrorMessages} from "../../error-messages";
import {PACKAGE_TYPES} from "../../models/root-app-config.model";
import chalk from "chalk";

export const RemoveCmd = (appName, packageType, packages = []) => {
	/**
	 * Args can be any number of apps and packages
	 */

	FsHelper.ensureRootPath();

	if(packages.length === 0) {
		throw new Error(ErrorMessages.PACKAGES_REQUIRED);
	}

	const rootConfig = FsHelper.getRootConfig();
	const appConfig = rootConfig.getApp(appName);

	let removedPackages = [];
	if(packageType === PACKAGE_TYPES.PACKAGES) {
		removedPackages = appConfig.removePackages(packages);
	} else {
		removedPackages = appConfig.removeDevPackages(packages);
	}

	FsHelper.saveRootConfig(rootConfig);

	console.log(chalk.blue(`The following ${PACKAGE_TYPES.PACKAGES} were removed from ${appName}: ${removedPackages.join(", ")}`));

	return Promise.resolve();

};