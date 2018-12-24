import {AppNames, TestHelper} from "../../helpers/test-helper";
import chai from 'chai';
chai.use(require("chai-as-promised"));
import {expect} from "chai";
import {AppExec} from "../../../src/exec/app-exec";
import {ErrorMessages} from "../../../src/error-messages";

describe("cmd: app.detach", () => {
	describe("Bad Calls", () => {
		beforeEach(() => {
			TestHelper.prepEnvironment();
			return TestHelper.initEnvironment()
				.then(() => TestHelper.initLibUiApp())
		});
		it("errors if child app is not recognized", () => {
			return expect(AppExec(AppNames.LIB_UI, "detach", "lib")).to.be.rejectedWith(ErrorMessages.UNKNOWN_APP);
		});
	});
	describe("Good State", () => {
		beforeEach(() => {
			TestHelper.prepEnvironment();
			return TestHelper.initEnvironment()
				.then(() => TestHelper.initLibUiApp())
				.then(() => TestHelper.initTimewatcherUiLibUiApp())
				.then(() => TestHelper.installPackage(['request']));
		});
		it("detaches a child app", () => {
			let rootConfig = TestHelper.getRootConfig();
			expect(rootConfig.getAppNames()).to.eql([AppNames.LIB_UI, AppNames.TIMEWATCH_UI]);

			return AppExec(AppNames.LIB_UI, "attach", AppNames.TIMEWATCH_UI).then(() => {
				let rootConfig = TestHelper.getRootConfig();
				expect(rootConfig.getApp(AppNames.LIB_UI).getAttachedApps()).to.eql([AppNames.TIMEWATCH_UI]);
			}).then(()=>{
				return AppExec(AppNames.LIB_UI, "detach", AppNames.TIMEWATCH_UI).then(() => {
					let rootConfig = TestHelper.getRootConfig();
					expect(rootConfig.getApp(AppNames.LIB_UI).getAttachedApps()).to.eql([]);
				});
			});
		});
		it("detaches from app and removes dep",()=>{
			let rootConfig = TestHelper.getRootConfig();
			let timewatchUiConfig = rootConfig.getApp(AppNames.TIMEWATCH_UI);
			expect(timewatchUiConfig.getPackages()).to.eql([]);
			return TestHelper.addPackageToApp(AppNames.LIB_UI, ['request']).then(()=>{
				let rootConfig = TestHelper.getRootConfig();
				expect(rootConfig.getApp(AppNames.LIB_UI).getPackages()).to.eql(["request"]);

				return AppExec(AppNames.TIMEWATCH_UI, "attach", AppNames.LIB_UI).then(()=> {
					let rootConfig = TestHelper.getRootConfig();
					expect(rootConfig.getApp(AppNames.TIMEWATCH_UI).getAttachedApps()).to.eql([AppNames.LIB_UI]);
					let libAppConfig = rootConfig.getApp(AppNames.TIMEWATCH_UI);
					expect(libAppConfig.getPackages()).to.eql([]);

					/**
					 * Makes sure package.jsons got strick version of packages for all deps from attached app
					 */
					const libAppPackageJson = TestHelper.expectAppPackageJsonDeps(AppNames.LIB_UI, ["request"]);
					expect(libAppPackageJson.scripts).to.have.property("start");
					const timewatchAppPackageJson = TestHelper.expectAppPackageJsonDeps(AppNames.TIMEWATCH_UI, ["request"]);
					expect(timewatchAppPackageJson.scripts).to.have.property("start");


				}).then(()=>{
					return AppExec(AppNames.TIMEWATCH_UI, "detach", AppNames.LIB_UI).then(()=>{
						let rootConfig = TestHelper.getRootConfig();
						expect(rootConfig.getApp(AppNames.TIMEWATCH_UI).getAttachedApps()).to.eql([]);
						let libAppConfig = rootConfig.getApp(AppNames.TIMEWATCH_UI);
						expect(libAppConfig.getPackages()).to.eql([]);

						/**
						 * Makes sure package.jsons got strick version of packages for all deps from attached app
						 */
						TestHelper.expectAppPackageJsonDeps(AppNames.LIB_UI, ["request"]);
						TestHelper.expectAppPackageJsonDeps(AppNames.TIMEWATCH_UI, []);
					});
				});
			});
		});
	});
});