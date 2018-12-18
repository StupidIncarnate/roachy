

export const PackageHelper = {
	getInstalled(packagejson) {
		return packagejson.dependencies;
	},
	getDevInstalled(packagejson) {
		return packagejson.devDependencies;
	}
};