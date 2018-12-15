
export const RootConfigHelper = {
	getDefaultStructure() {
		return {
			version: 0.1,
			apps: {},
			appDependencies: {},
			packages: {},
			devPackages: {}
		};
	},
	hasApp(config, appName) {
		return config.apps.indexOf(appName) !== -1;
	},
	addApp(config, appName, appLocation) {
		config.apps[appName] = appLocation;
	}
};