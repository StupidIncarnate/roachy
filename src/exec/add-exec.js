import {FsHelper} from "../helpers/fs-helper";
import {ErrorMessages} from "../error-messages";

export const AddExec = (appName, appLocation) => {
	const rootConfig = FsHelper.getRootConfig();

	if(!appName) {
		throw new Error(ErrorMessages.APP_NAME_REQUIRED)
	}

	if(!appLocation) {
		throw new Error(ErrorMessages.APP_LOCATION_REQUIRED);
	}

	if(!FsHelper.exists(appLocation)){
		throw new Error(`${ErrorMessages.APP_LOCATION_INVALID}: ${appLocation}`)
	}

	rootConfig.addApp(appName, appLocation);
	FsHelper.saveRootConfig(rootConfig);


};