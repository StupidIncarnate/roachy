import {REF} from "./config";

export const ErrorMessages = {
	ROOT_NOT_INIT: "Roachy needs to be initialized: roachy init",
	ROOT_NOT_FOUND: `Roachy couldn't find its commander config ${REF.configName} anywhere up the tree where you are`,
	APP_NAME_REQUIRED: "appName is a required argument",
	APP_NAME_INVALID: "appName must be all lowercase and only have dashes",
	APP_LOCATION_REQUIRED: "appLocation is a required argument",
	APP_LOCATION_INVALID: "appLocation is invalid",
	APP_ALREADY_EXISTS: "already exists. Will not overwrite",
	APPS_REQUIRED: "One or more appNames are required as an argument",
	PACKAGES_REQUIRED: "One or more npm packages are required as an argument",
	PACKAGES_IN_USE: "The following packages are in use so cannot uninstall them:",
	UNKNOWN_PACKAGE: "Unknown npm package",
	NOT_INSTALLED: "Following packages not installed as dependencies; Make sure you've installed via 'roachy install pkg[...]' like you would npm install:",
	UNKNOWN_APP: "Provided app is unknown",
	UNKNOWN_NPM_ERROR: "An unexpected npm error happened. Look above to diagnose.",
	UNKNOWN_APP_COMMAND: "Unknown app command:",
	APP_UPGRADER_NO_SNAPSHOT: "App upgrader never made a snapshot",
	PARENT_CHILD_COLLISION: "Parent app cannot link to child",
	APP_ROOT_VERSION_MISMATCH: "are unreconcilable version mismatches. Fix the versions in the app you're trying to add to match root version of package in order to proceed.",
};