import {FsHelper} from "./fs-helper";

export const RootConfigHelper = {
	getDefaultStructure() {
		return {
			version: 0.1,
			apps: {},
			packages: {}
		};
	},
	hasApp(config, appName) {
		return Object.keys(config.apps).indexOf(appName) !== -1;
	},
	addApp(config, appName, appLocation) {
		config.apps[appName] = {
			path: appLocation,
			attachedApps: [],
			packages: [],
			devPackages: []
		};
	},
	getAppNames(config) {
		try {
			return Object.keys(config.apps);
		} catch(e) {
		}

		return [];
	},
	getAppConfig(config, appName) {
		try {
			return config.apps[appName];
		} catch(e){
			throw e;
		}

	},
	getAttachedApps(config, appName) {
		return this.getAppConfig(config, appName).attachedApps || [];
	},
	getPackages(config) {
		return config.packages || [];
	},
	getAppPackages(appConfig) {
		return appConfig.packages || [];
	},
	setAppPackages(appConfig, packages) {
		appConfig.packages = packages || [];
	},
	/**
	 *
	 * @param config
	 * @param appName
	 * @param packageType packages || devPackages
	 */
	buildAppPackageList(config, appName, packageType) {
		let attachedApps = this.getRequiredAppDeps(config, appName);
		if(attachedApps.indexOf(appName) === -1) {
			attachedApps.push(appName);
		}

		return this.collectAppPackages(config, attachedApps, packageType);

	},
	getRequiredAppDeps(config, appName, collectedAppDeps) {
		collectedAppDeps = collectedAppDeps || [];
		this.getAttachedApps(config, appName).forEach(attachedAppName => {
			if(collectedAppDeps.indexOf(attachedAppName) === -1) {
				collectedAppDeps.push(attachedAppName);
				this.getRequiredAppDeps(config, attachedAppName, collectedAppDeps);
			}
		});

		return collectedAppDeps.sort();
	},
	collectAppPackages(config, appNames, packageType) {
		let packages = [];
		appNames.forEach((appName) => {
			const appConfig = RootConfigHelper.getAppConfig(config, appName);
			if(appConfig[packageType]) {
				appConfig[packageType].forEach(pkg => {
					if (packages.indexOf(pkg) === -1) {
						packages.push(pkg);
					}
				});
			}
		});

		return packages.sort();
	}
};