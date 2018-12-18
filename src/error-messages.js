import {REF} from "./config";

export const ErrorMessages = {
	ROOT_NOT_INIT: "Roachy needs to be initialized: roachy init",
	ROOT_NOT_FOUND: `Roachy couldn't find its commander config ${REF.configName} anywhere up the tree where you are`,
	APP_NAME_REQUIRED: "appName is a required argument",
	APP_LOCATION_REQUIRED: "appLocation is a required argument",
	APP_LOCATION_INVALID: "appLocation is invalid",
	APPS_REQUIRED: "One or more appNames are required as an argument",
	PACKAGES_REQUIRED: "One or more npm packages are required as an argument",
	UNKNOWN_PACKAGE: "Unknown npm package",
	UNKNOWN_APP: "Provided app is unknown",
	UNKNOWN_NPM_ERROR: "An unexpected npm error happened. Look above to diagnose.",
	UNKNOWN_APP_COMMAND: "Unknown app command:"

};