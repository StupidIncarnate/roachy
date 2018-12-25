import {ErrorMessages} from "../error-messages";

export const PACKAGE_TYPES = {
	PACKAGES: "packages",
	DEV_PACKAGES: "devPackages"
};

export default class RootAppConfigModel {
	constructor(name, configObj) {
		this.name = name;
		/**
		 * We want to keep pointer ref to root config object so we dont need to pass up change events
		 */
		this.config = configObj;
	}
	getConfig() {
		return this.config;
	}
	getPath() {
		return this.config.path;
	}
	hasAttachedApp(appName) {
		return this.config.attachedApps.indexOf(appName) !== -1;
	}
	getAttachedApps() {
		return this.config.attachedApps;
	}
	getPackagesByType(packageType) {
		switch (packageType) {
			case PACKAGE_TYPES.PACKAGES:
				return this.getPackages();
			case PACKAGE_TYPES.DEV_PACKAGES:
				return this.getDevPackages();
			default:
				throw new Error(`Unknown packageType ${packageType}`);
		}
	}
	getPackages() {
		return this.config.packages;
	}
	addPackages(packageArr = []) {
		this.consolidatePackages(this.config.packages, packageArr);
	}
	removePackages(packages = []) {
		const knownPkgs = packages.filter(pkg => this.config.packages.indexOf(pkg) > -1);
		this.config.packages = this.config.packages.filter(pkg => packages.indexOf(pkg) === -1);
		return knownPkgs;
	}
	getDevPackages() {
		return this.config.devPackages;
	}
	addDevPackages(packageArr = []) {
		this.consolidatePackages(this.config.devPackages, packageArr);
	}
	removeDevPackages(packages = []) {
		const knownPkgs = packages.filter(pkg => this.config.devPackages.indexOf(pkg) > -1);
		this.config.devPackages = this.config.devPackages.filter(pkg => packages.indexOf(pkg) === -1);
		return knownPkgs;
	}
	consolidatePackages(pkgArr, newPackages = []) {
		newPackages.forEach(item => {
			pkgArr.indexOf(item) === -1 && pkgArr.push(item);
		});
		pkgArr.sort();
	}

}