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
	getPackages(config) {
		return config.packages;
	},
};