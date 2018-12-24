import {FsHelper} from "../helpers/fs-helper";
import {ErrorMessages} from "../error-messages";

import {AttachCmd} from "./app/attach-cmd";
import {AddCmd} from "./app/add-cmd";
import {DetachCmd} from "./app/detach-cmd";
import {PACKAGE_TYPES} from "../models/root-app-config.model";

export const AppExec = (appName, subCommand, ...subCommandArgs) => {
	let rootConfig = FsHelper.getRootConfig();

	if(!rootConfig.hasApp(appName)) {
		throw new Error(`${ErrorMessages.UNKNOWN_APP}: ${appName}`);
	}

	return Promise.resolve().then(()=>{
		switch(subCommand) {
			/**
			 * Attach child App to parent app
			 */
			case "attach":
				return AttachCmd(appName, subCommandArgs.shift());
				break;
			case "detach":
				return DetachCmd(appName, subCommandArgs.shift());
				break;
			case "add":
				/**
				 * in case packages come in as multi dimensional
				 */
				subCommandArgs = [].concat(...subCommandArgs);
				/**
				 * Add package(s) to app
				 */
				return AddCmd(appName, PACKAGE_TYPES.PACKAGES, subCommandArgs);
				break;
			case "add-dev":
				/**
				 * in case packages come in as multi dimensional
				 */
				subCommandArgs = [].concat(...subCommandArgs);
				/**
				 * Add package(s) to app
				 */
				return AddCmd(appName, PACKAGE_TYPES.DEV_PACKAGES, subCommandArgs);
				break;
			default:
				throw new Error(ErrorMessages.UNKNOWN_APP_COMMAND + " " + subCommand);
		}
	}).then(FsHelper.regenAppPackageJsons);

};