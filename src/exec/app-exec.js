import {FsHelper} from "../helpers/fs-helper";
import {ErrorMessages} from "../error-messages";

import {AttachCmd} from "./app/attach-cmd";
import {AddCmd} from "./app/add-cmd";

export const AppExec = (appName, subCommand, ...subCommandArgs) => {
	const rootConfig = FsHelper.getRootConfig();

	if(!rootConfig.hasApp(appName)) {
		throw new Error(`${ErrorMessages.UNKNOWN_APP}: ${appName}`);
	}

	switch(subCommand) {
		case "attach":
			return AttachCmd(appName, subCommandArgs.shift());
			break;
		case "add":
			/**
			 * in case packages come in as multi dimensional
			 */
			subCommandArgs = [].concat(...subCommandArgs);
			return AddCmd(appName, subCommandArgs);
			break;
		default:
			throw new Error(ErrorMessages.UNKNOWN_APP_COMMAND + " " + subCommand);
	}

};