import {REF} from "./config";

export const ErrorMessages = {
	ROOT_NOT_INIT: "Roachy needs to be initialized: roachy init",
	ROOT_NOT_FOUND: `Roachy couldn't find its commander config ${REF.configName} anywhere up the tree where you are`,
	APP_NAME_REQUIRED: "appName is a required argument",
	APP_LOCATION_REQUIRED: "appLocation is a required argument",
	APP_LOCATION_INVALID: "appLocation is invalid",

};