import {expect} from 'chai';
import chai from 'chai';
import RootConfigModel from "../../../src/models/root-config.model";

const nestedConfig =  new RootConfigModel({
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
});


describe("models/root-config-model", ()=>{
	describe("buildAppPackageList", ()=> {
		it("constructs a package deps list", ()=>{
			expect(nestedConfig.buildAppPackageList("common-ui", "packages"))
				.to.eql(["backbone", "moment", "react", "timegraph"]);
			expect(nestedConfig.buildAppPackageList("ui-app-child", "packages"))
				.to.eql(["backbone", "moment", "react", "timegraph"]);
		});
		it("constructs a devPackages deps list", ()=>{
			expect(nestedConfig.buildAppPackageList("ui-app", "devPackages"))
				.to.eql(["chai", "mocha", "react-tester"]);
		});
	});
	describe("getRequiredAppDeps", ()=>{
		it("does a basic list",()=>{
			const rootConfig = new RootConfigModel({
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
			});

			expect(rootConfig.getRequiredAppDeps("common")).to.eql([]);
			expect(rootConfig.getRequiredAppDeps("common-ui")).to.eql(["common"]);
			expect(rootConfig.getRequiredAppDeps("ui-app")).to.eql(["common", "common-ui"]);

		});
		it("does a nested complicated sort",()=>{

			expect(nestedConfig.getRequiredAppDeps("common"))
				.to.eql(["common", "common-x"]);
			expect(nestedConfig.getRequiredAppDeps("common-x"))
				.to.eql(["common", "common-x"]);
			expect(nestedConfig.getRequiredAppDeps("common-ui"))
				.to.eql(["common", "common-ui", "common-x", "heading-common-ui"]);
			expect(nestedConfig.getRequiredAppDeps("ui-app"))
				.to.eql(["common", "common-ui", "common-x", "heading-common-ui"]);
			expect(nestedConfig.getRequiredAppDeps("ui-app-child"))
				.to.eql(["common", "common-ui", "common-x", "heading-common-ui", "ui-app"]);
			expect(nestedConfig.getRequiredAppDeps("server-app"))
				.to.eql(["common", "common-server", "common-x"]);

		});
	});
	describe("collectAppPackages", ()=>{
		it("compiles package list from apps", ()=> {
			const config = new RootConfigModel({
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
			});
			expect(config.collectAppPackages(["common"], "packages"))
				.to.eql(["moment", "request"]);
			expect(config.collectAppPackages(["common"], "devPackages"))
				.to.eql(["chai", "mocha"]);

			expect(config.collectAppPackages(["common", "common-ui"], "packages"))
				.to.eql(["moment", "react", "request"]);
			expect(config.collectAppPackages(["common", "common-ui"], "devPackages"))
				.to.eql(["chai", "mocha"]);

			expect(config.collectAppPackages(["common", "common-ui", "ui-app"], "packages"))
				.to.eql(["backbone", "moment", "react", "request"]);
			expect(config.collectAppPackages(["ui-app", "common", "common-ui"], "devPackages"))
				.to.eql(["chai", "mocha", "needles"]);

			expect(config.collectAppPackages(["null-app", "common", "common-ui", "ui-app"], "packages"))
				.to.eql(["backbone", "moment", "react", "request"]);
			expect(config.collectAppPackages(["ui-app", "null-app", "common", "common-ui"], "devPackages"))
				.to.eql(["chai", "mocha", "needles"]);

		});
	})
});