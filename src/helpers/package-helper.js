

export const PackageHelper = {
	getInstalled(packagejson) {
		return packagejson.dependencies || {};
	},
	getDevInstalled(packagejson) {
		return packagejson.devDependencies || {};
	},
	getPackageName(pkgName) {
		if(pkgName.indexOf("@") > -1) {
			return pkgName.substr(0, pkgName.indexOf("@"));
		}

		return pkgName;
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