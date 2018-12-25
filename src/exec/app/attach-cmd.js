/**
 * Attaches a child app to a parent app for dependency referencing
 */
import {FsHelper} from "../../helpers/fs-helper";
import chalk from "chalk";

export const AttachCmd = (parentAppName, childAppName) => {
	let rootConfig = FsHelper.getRootConfig();

	rootConfig.attachApp(parentAppName, childAppName);
	/**
	 *  Add child to parent attached apps
	 *  Regen package.json for parent
	 */

	FsHelper.saveRootConfig(rootConfig);

	console.log(chalk.blue(`${childAppName} has been attached as a dependency to ${parentAppName}`));

	return Promise.resolve();
};