/**
 * Attaches a child app to a parent app for dependency referencing
 */
import {FsHelper} from "../../helpers/fs-helper";
import {PACKAGE_TYPES} from "../../models/root-app-config.model";

export const AttachCmd = (parentAppName, childAppName) => {
	let rootConfig = FsHelper.getRootConfig();

	rootConfig.attachApp(parentAppName, childAppName);
	const consolidatedPackageApps = rootConfig.buildAppPackageList(parentAppName, PACKAGE_TYPES.PACKAGES);
	console.log(consolidatedPackageApps);

	/**
	 *  Add child to parent attached apps
	 *  Regen package.json for parent
	 */

	FsHelper.saveRootConfig(rootConfig);


	return Promise.resolve();
};