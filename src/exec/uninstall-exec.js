import {FsHelper} from "../helpers/fs-helper";
import {ErrorMessages} from "../error-messages";
import {NpmExecHelper} from "../helpers/npm-exec-helper";
import chalk from "chalk";

export const UninstallExec = (packages) => {
	const rootConfig = FsHelper.getRootConfig();

	if(!packages.length) {
		throw new Error(ErrorMessages.PACKAGES_REQUIRED);
	}

	FsHelper.ensureRootPath();

	/**
	 * Check if any packages are unknown
	 */
	const installedPkgs = Object.keys(rootConfig.getPackages());

	const unknownPackages = packages.filter(pkg => installedPkgs.indexOf(pkg) === -1);
	if(unknownPackages.length) {
		throw new Error(ErrorMessages.NOT_INSTALLED + " " + unknownPackages.join(","));
	}

	/**
	 * Check if any packages are used by app
	 */
	const usedPkgsByApp = rootConfig.getPackagesInUse(packages);
	if(Object.keys(usedPkgsByApp).length) {
		const errorStr = Object.keys(usedPkgsByApp)
			.map((appName) => `${appName}: ${usedPkgsByApp[appName].join(", ")}`)
			.join(";");

		throw new Error(ErrorMessages.PACKAGES_IN_USE + " " + errorStr);
	}

	return NpmExecHelper.uninstall(packages, true).then(()=>{
		rootConfig.removePackages(packages);
		FsHelper.saveRootConfig(rootConfig);

		console.log(chalk.blue(`Removed the following packages from roachy: ${packages.join(", ")}`));
	});
};