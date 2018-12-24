/**
 * Detach an app from roachy
 */
import {FsHelper} from "../../helpers/fs-helper";

export const DetachCmd = (parentAppName, childAppName) => {
	let rootConfig = FsHelper.getRootConfig();

	rootConfig.detachApp(parentAppName, childAppName);
	/**
	 *  Add child to parent attached apps
	 *  Regen package.json for parent
	 */

	FsHelper.saveRootConfig(rootConfig);

	return Promise.resolve();
};