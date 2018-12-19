import {expect} from 'chai';
import chai from 'chai';
import {RootConfigHelper} from "../../../src/helpers/root-config-helper";
const chaiAsPromised = require("chai-as-promised");

const nestedConfig = {
	apps: {
		"common-server": {
			path: null,
			attachedApps: ["common"],
			packages: [
				"express"
			],
			devPackages: []
		},
		"common": {
			path: null,
			attachedApps: ["common-x"],
			packages: [
				"timegraph"
			],
			devPackages: [
				"chai",
				"mocha"
			]
		},
		"common-x": {
			path: null,
			attachedApps: ["common"],
			packages: [
				"moment"
			],
			devPackages: [
			]
		},
		"common-ui": {
			path: null,
			attachedApps: ["common", "heading-common-ui"],
			packages: [
				"backbone",
				"react"
			],
			devPackages: [
				"react-tester"
			]
		},
		"heading-common-ui": {
			path: null,
			attachedApps: ["common-ui"],
			packages: [],
			devPackages: []
		},
		"ui-app": {
			path: null,
			attachedApps: ["common-ui"],
			packages: [
				"react"
			],
			devPackages: []
		},
		"ui-app-child": {
			path: null,
			attachedApps: ["ui-app"],
			packages: [
				"backbone",
				"react"
			],
			devPackages: []
		},
		"server-app": {
			path: null,
			attachedApps: ["common-server"],
			packages: [],
			devPackages: []
		}
	}
};


describe("helpers/root-config-helper", ()=>{
	describe("buildAppPackageList", ()=> {
		it("constructs a package deps list", ()=>{
			expect(RootConfigHelper.buildAppPackageList(nestedConfig, "common-ui", "packages"))
				.to.eql(["backbone", "moment", "react", "timegraph"]);
			expect(RootConfigHelper.buildAppPackageList(nestedConfig, "ui-app-child", "packages"))
				.to.eql(["backbone", "moment", "react", "timegraph"]);
		});
		it("constructs a devPackages deps list", ()=>{
			expect(RootConfigHelper.buildAppPackageList(nestedConfig, "ui-app", "devPackages"))
				.to.eql(["chai", "mocha", "react-tester"]);
		});
	});
	describe("getRequiredAppDeps", ()=>{
		it("does a basic list",()=>{
			const config = {
				apps: {
					"common": {
						path: null,
						attachedApps: [],
						packages: [],
						devPackages: []
					},
					"common-ui": {
						path: null,
						attachedApps: ["common"],
						packages: [],
						devPackages: []
					},
					"ui-app": {
						path: null,
						attachedApps: ["common-ui"],
						packages: [],
						devPackages: []
					}
				}
			};

			expect(RootConfigHelper.getRequiredAppDeps(config, "common")).to.eql([]);
			expect(RootConfigHelper.getRequiredAppDeps(config, "common-ui")).to.eql(["common"]);
			expect(RootConfigHelper.getRequiredAppDeps(config, "ui-app")).to.eql(["common", "common-ui"]);

		});
		it("does a nested complicated sort",()=>{

			expect(RootConfigHelper.getRequiredAppDeps(nestedConfig, "common"))
				.to.eql(["common", "common-x"]);
			expect(RootConfigHelper.getRequiredAppDeps(nestedConfig, "common-x"))
				.to.eql(["common", "common-x"]);
			expect(RootConfigHelper.getRequiredAppDeps(nestedConfig, "common-ui"))
				.to.eql(["common", "common-ui", "common-x", "heading-common-ui"]);
			expect(RootConfigHelper.getRequiredAppDeps(nestedConfig, "ui-app"))
				.to.eql(["common", "common-ui", "common-x", "heading-common-ui"]);
			expect(RootConfigHelper.getRequiredAppDeps(nestedConfig, "ui-app-child"))
				.to.eql(["common", "common-ui", "common-x", "heading-common-ui", "ui-app"]);
			expect(RootConfigHelper.getRequiredAppDeps(nestedConfig, "server-app"))
				.to.eql(["common", "common-server", "common-x"]);

		});
	});
	describe("collectAppPackages", ()=>{
		it("compiles package list from apps", ()=> {
			const config = {
				apps: {
					"common": {
						path: null,
						attachedApps: [],
						packages: [
							"moment",
							"request"
						],
						devPackages: [
							"mocha",
							"chai"
						]
					},
					"common-ui": {
						path: null,
						attachedApps: ["common"],
						packages: [
							"react"
						],
						devPackages: [
							"chai"
						]
					},
					"ui-app": {
						path: null,
						attachedApps: ["common-ui"],
						packages: [
							"backbone",
							"react"
						],
						devPackages: [
							"needles"
						]
					},
					"null-app": {
						path: null,
						attachedApps: [],
						packages: [],
						devPackages: []
					},
				}
			};
			expect(RootConfigHelper.collectAppPackages(config, ["common"], "packages"))
				.to.eql(["moment", "request"]);
			expect(RootConfigHelper.collectAppPackages(config, ["common"], "devPackages"))
				.to.eql(["chai", "mocha"]);

			expect(RootConfigHelper.collectAppPackages(config, ["common", "common-ui"], "packages"))
				.to.eql(["moment", "react", "request"]);
			expect(RootConfigHelper.collectAppPackages(config, ["common", "common-ui"], "devPackages"))
				.to.eql(["chai", "mocha"]);

			expect(RootConfigHelper.collectAppPackages(config, ["common", "common-ui", "ui-app"], "packages"))
				.to.eql(["backbone", "moment", "react", "request"]);
			expect(RootConfigHelper.collectAppPackages(config, ["ui-app", "common", "common-ui"], "devPackages"))
				.to.eql(["chai", "mocha", "needles"]);

			expect(RootConfigHelper.collectAppPackages(config, ["null-app", "common", "common-ui", "ui-app"], "packages"))
				.to.eql(["backbone", "moment", "react", "request"]);
			expect(RootConfigHelper.collectAppPackages(config, ["ui-app", "null-app", "common", "common-ui"], "devPackages"))
				.to.eql(["chai", "mocha", "needles"]);

		});
	})
});