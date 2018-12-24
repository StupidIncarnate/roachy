

export const PackageHelper = {
	getInstalled(packagejson) {
		return packagejson.dependencies || {};
	},
	getDevInstalled(packagejson) {
		return packagejson.devDependencies || {};
	},
	getCheckableVersion(version) {
		if(version === "*") {
			return null;
		}
		if(version.startsWith("^") || version.startsWith("~")) {
			return version.substr(1);
		}

		return version;
	},

};