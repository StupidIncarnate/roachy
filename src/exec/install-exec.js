import chalk from 'chalk';
import {FsHelper} from "../helpers/fs-helper";
import {ErrorMessages} from "../error-messages";
import {RootConfigHelper} from "../helpers/root-config-helper";
import {NpmExecHelper} from "../helpers/npm-exec-helper";
import {PackageHelper} from "../helpers/package-helper";

const outputChangedPackages = (oldPackages) => {

	const rootPackage = FsHelper.getRootPackageJson();
	const newPackages = PackageHelper.getDevInstalled(rootPackage);

	const changeObj = {};
	let hasChanges = false;
	for(const pkg in newPackages) {
		/**
		 * Changed if pkg was added or if version was changed
		 */
		if(!(pkg in oldPackages) || oldPackages[pkg] !== newPackages[pkg]) {
			changeObj[pkg] = newPackages[pkg];

			if(changeObj[pkg].indexOf("^") === 0) {
				changeObj[pkg] = changeObj[pkg].substr(1);
			}
			hasChanges = true;
		}
	}

	if(hasChanges) {
		const rootConfig = FsHelper.getRootConfig();
		for(const pkg in changeObj) {
			RootConfigHelper.getPackages(rootConfig)[pkg] = changeObj[pkg];
		}
		FsHelper.saveRootConfig(rootConfig);
		console.log(chalk.blue(`Saved the following packages to roachy: ${Object.keys(changeObj).join(", ")}`));
	}
	/**
	 * TODO need to regen apps using any packages that changed versions
	 */

	return changeObj;
};
export const InstallExec = (packages) => {
	FsHelper.getRootConfig();

	if(!packages.length) {
		throw new Error(ErrorMessages.PACKAGES_REQUIRED)
	}

	FsHelper.ensureRootPath();

	const rootPackage = FsHelper.getRootPackageJson();
	const oldInstalled = PackageHelper.getDevInstalled(rootPackage);

	return NpmExecHelper.install(packages, true).then(()=>{
		outputChangedPackages(oldInstalled);
	}).catch(e =>{
		outputChangedPackages(oldInstalled);
		throw e;
	});
};