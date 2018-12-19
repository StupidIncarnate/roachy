import {FsHelper} from "../helpers/fs-helper";
import {RootConfigHelper} from "../helpers/root-config-helper";
import {ErrorMessages} from "../error-messages";
import {PackageHelper} from "../helpers/package-helper";

export default class AppsUpgrader {
	constructor(){
	}

	snapshotRoot() {
		const rootPackage = FsHelper.getRootPackageJson();
		this.installed = PackageHelper.getInstalled(rootPackage);
		this.devInstalled = RootConfigHelper.getDevInstalled(rootPackage);

	}

	upgradeApps(appName) {
		if(!this.installed || this.devInstalled) {
			throw new Error(ErrorMessages.APP_UPGRADER_NO_SNAPSHOT);
		}

		const rootPackage = FsHelper.getRootPackageJson();
		const newInstalled = RootConfigHelper.getPackages(rootPackage);
		const newDevInstalled = RootConfigHelper.getDevPackages(rootPackage);

		const changedInstalled = AppsUpgrader.getChanged(this.installed, newInstalled);
		const changedDevInstalled = AppsUpgrader.getChanged(this.devInstalled, newDevInstalled);


	}

	static getChanged(oldPackages, newPackages) {
		const changeObj = {};
		for(const pkg in newPackages) {
			/**
			 * Changed if pkg was added or if version was changed
			 */
			if(!(pkg in oldPackages) || oldPackages[pkg] !== newPackages[pkg]) {
				changeObj[pkg] = newPackages[pkg];

				if(changeObj[pkg].indexOf("^") === 0) {
					changeObj[pkg] = changeObj[pkg].substr(1);
				}
			}
		}

		return changeObj;
	}
	// _getRemoved(oldPackages, newPackages) {
	// 	return Object.keys(oldPackages).map(pkg => !(pkg in newPackages));
	// }
}