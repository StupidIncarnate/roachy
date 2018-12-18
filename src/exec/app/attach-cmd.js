/**
 * Attaches a child app to a parent app for dependency referencing
 */
import {FsHelper} from "../../helpers/fs-helper";
import {ErrorMessages} from "../../error-messages";
import {RootConfigHelper} from "../../helpers/root-config-helper";
import {NpmExecHelper} from "../../helpers/npm-exec-helper";

export const AttachCmd = (parentAppName, childAppName) => {
	const rootConfig = FsHelper.getRootConfig();

	if(!RootConfigHelper.hasApp(rootConfig, childAppName)) {
		throw new Error(`${ErrorMessages.UNKNOWN_APP}: ${childAppName}`);
	}

	/**
	 *  Add child to parent attached apps
	 *  Regen package.json for parent
	 */


};