import RootAppConfigModel, {PACKAGE_TYPES} from "./root-app-config.model";
import {ErrorMessages} from "../error-messages";
import {PackageHelper} from "../helpers/package-helper";

export default class RootConfigModel {
	static getDefaultStructure() {
		return {
			version: 0.1,
			apps: {},
			packages: {}
		};
	}
	constructor(configObj) {
		this.config = RootConfigModel.getDefaultStructure();
		if(configObj) {
			Object.keys(this.config).forEach(propName => this.config[propName] = configObj[propName] || null);
		}
	}
	toJSON() {
		return this.config;
	}

	hasApp(appName) {
		return Object.keys(this.config.apps).indexOf(appName) !== -1;
	}
	getApp(appName) {
		if(!this.hasApp(appName)) {
			throw new Error(`${ErrorMessages.UNKNOWN_APP} ${appName}`);
		}

		return new RootAppConfigModel(appName, this.config.apps[appName]);
	}
	addApp(appName, appLocation) {

		if(this.config.apps[appName]) {
			throw new Error(`${appName} ${ErrorMessages.APP_ALREADY_EXISTS}`);
		}
		this.config.apps[appName] = {
			path: appLocation,
			attachedApps: [],
			packages: [],
			devPackages: []
		};
	}
	getAppNames() {
		return Object.keys(this.config.apps);
	}

	/**
	 * Need to keep this logic here rather than in app config because the constraint can only be
	 * maintained in root.
	 */
	attachApp(parentApp, childApp) {
		if(!this.hasApp(childApp)) {
			throw new Error(`${ErrorMessages.UNKNOWN_APP} ${childApp}`);
		}

		if(parentApp === childApp) {
			throw new Error(ErrorMessages.PARENT_CHILD_COLLISION);
		}

		const appConfig = this.getApp(parentApp);
		if(!appConfig.hasAttachedApp(childApp)) {
			appConfig.getAttachedApps().push(childApp);
		}

	}

	getPackages() {
		return this.config.packages;
	}
	addPackages(pkgObj) {
		for(const pkg in pkgObj) {
			this.getPackages()[pkg] = PackageHelper.getCheckableVersion(pkgObj[pkg]);
		}
	}

	/**
	 * Dependency Tree Builder
	 */
	/**
	 * Builds obj of dependencies or devDeps to put into an app package json
	 */
	buildPackageDepList(appName, packageType) {
		const rootPackageList = this.getPackages(), pkgObj = {};
		this.buildAppPackageList(appName, packageType).forEach(pkgName => {
			if(!rootPackageList[pkgName]) {
				throw new Error(`${pkgName} has not been added to roachy. 'roachy add ${pkgName}'`);
			}
			pkgObj[pkgName] = rootPackageList[pkgName];
		});
		return pkgObj;
	}
	/**
	 * @param appName
	 * @param packageType packages || devPackages
	 */
	buildAppPackageList(appName, packageType) {
		let attachedApps = this.getRequiredAppDeps(appName);
		if(attachedApps.indexOf(appName) === -1) {
			attachedApps.push(appName);
		}

		return this.collectAppPackages(attachedApps, packageType);

	}
	getRequiredAppDeps(appName, collectedAppDeps) {
		collectedAppDeps = collectedAppDeps || [];
		this.getApp(appName).getAttachedApps().forEach(attachedAppName => {
			if(collectedAppDeps.indexOf(attachedAppName) === -1) {
				collectedAppDeps.push(attachedAppName);
				this.getRequiredAppDeps(attachedAppName, collectedAppDeps);
			}
		});

		return collectedAppDeps.sort();
	}
	collectAppPackages(appNames, packageType) {
		let packages = [];
		appNames.forEach((appName) => {
			const appConfig = this.getApp(appName);
			appConfig.getPackagesByType(packageType).forEach(pkg => {
				if (packages.indexOf(pkg) === -1) {
					packages.push(pkg);
				}
			});

		});

		return packages.sort();
	}
}