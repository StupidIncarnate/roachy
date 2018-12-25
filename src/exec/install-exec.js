import chalk from 'chalk';
import {FsHelper} from "../helpers/fs-helper";
import {ErrorMessages} from "../error-messages";
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
			changeObj[pkg] = PackageHelper.getCheckableVersion(newPackages[pkg]);
			hasChanges = true;
		}
	}

	if(hasChanges) {
		const rootConfig = FsHelper.getRootConfig();
		rootConfig.addPackages(changeObj);
		FsHelper.saveRootConfig(rootConfig);

		console.log(chalk.blue(`Saved the following packages to roachy: ${Object.keys(changeObj).join(", ")}`));
	}

	return FsHelper.regenAppPackageJsons();
};
export const InstallExec = (packages) => {
	FsHelper.getRootConfig();

	if(!packages.length) {
		throw new Error(ErrorMessages.PACKAGES_REQUIRED);
	}

	FsHelper.ensureRootPath();

	const rootPackage = FsHelper.getRootPackageJson();
	const oldInstalled = PackageHelper.getDevInstalled(rootPackage);

	console.log(chalk.yellow(`Registering packages with Roachy... ${packages}`));
	return NpmExecHelper.install(packages, true).then(()=>{
		return outputChangedPackages(oldInstalled);
	}).catch(e =>{
		return outputChangedPackages(oldInstalled).then(()=>{
			throw e;
		});
	});
};