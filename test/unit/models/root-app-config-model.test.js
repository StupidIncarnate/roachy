import {expect} from "chai";
import RootAppConfigModel from "../../../src/models/root-app-config.model";
import {TestHelper} from "../../helpers/test-helper";


describe("models/root-app-config-model", ()=>{
	let config;
	beforeEach(()=>{
		config = new RootAppConfigModel("lib-ui", {
			path: TestHelper.getLibUiPath(),
			attachedApps:[],
			packages: [
				"backbone",
				"moment",
				"react"
			],
			devPackages: [
				"mocha",
				"chai",
				"chai-as-promise"
			]
		});
	});
	describe("removePackages", ()=>{
		it("can remove a pkg", ()=>{
			expect(config.getPackages()).to.eql([
				"backbone",
				"moment",
				"react"
			]);

			expect(config.removePackages(["backbone"])).to.eql(["backbone"]);

			expect(config.getPackages()).to.eql([
				"moment",
				"react"
			]);
		});
		it("can remove multiple, but skips unknown", ()=>{
			expect(config.getPackages()).to.eql([
				"backbone",
				"moment",
				"react"
			]);

			expect(config.removePackages(["backbone", "moment", "kardish"])).to.eql(["backbone", "moment"]);

			expect(config.getPackages()).to.eql([
				"react"
			]);
		});
		it("handles removing just invalid", ()=>{
			expect(config.getPackages()).to.eql([
				"backbone",
				"moment",
				"react"
			]);

			expect(config.removePackages([ "kardish"])).to.eql([]);

			expect(config.getPackages()).to.eql([
				"backbone",
				"moment",
				"react"
			]);
		});
	});
	describe("removeDevPackages", ()=>{
		it("can remove a pkg", ()=>{
			expect(config.getDevPackages()).to.eql([
				"mocha",
				"chai",
				"chai-as-promise"
			]);

			expect(config.removeDevPackages(["chai"])).to.eql(["chai"]);

			expect(config.getDevPackages()).to.eql([
				"mocha",
				"chai-as-promise"
			]);
		});
		it("can remove multiple, but skips unknown", ()=>{
			expect(config.getDevPackages()).to.eql([
				"mocha",
				"chai",
				"chai-as-promise"
			]);

			expect(config.removeDevPackages(["chai", "mocha", "kardish"])).to.eql(["chai", "mocha"]);

			expect(config.getDevPackages()).to.eql([
				"chai-as-promise"
			]);
		});
		it("handles removing just invalid", ()=>{
			expect(config.getDevPackages()).to.eql([
				"mocha",
				"chai",
				"chai-as-promise"
			]);

			expect(config.removeDevPackages([ "kardish"])).to.eql([]);

			expect(config.getDevPackages()).to.eql([
				"mocha",
				"chai",
				"chai-as-promise"
			]);
		});
	});
});