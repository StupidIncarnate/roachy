import {FsHelper} from "../helpers/fs-helper";
import {ErrorMessages} from "../error-messages";
import {RootConfigHelper} from "../helpers/root-config-helper";

import {AttachCmd} from "./app/attach-cmd";
import {AddCmd} from "./app/add-cmd";

export const AppExec = (appName, subCommand, ...subCommandArgs) => {
	const rootConfig = FsHelper.getRootConfig();

	if(!RootConfigHelper.hasApp(rootConfig, appName)) {
		throw new Error(`${ErrorMessages.UNKNOWN_APP}: ${appName}`);
	}

	console.log(appName, subCommand, subCommandArgs);

	switch(subCommand) {
		case "attach":
			return AttachCmd(appName, subCommandArgs.shift());
			break;
		case "add":
			return AddCmd(appName, subCommandArgs);
			break;
		default:
			throw new Error(ErrorMessages.UNKNOWN_APP_COMMAND + " " + subCommand);
	}

};