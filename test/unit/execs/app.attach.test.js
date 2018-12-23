import {AppNames, TestHelper} from "../../helpers/test-helper";
import chai from 'chai';
chai.use(require("chai-as-promised"));
import {expect} from "chai";
import {AppExec} from "../../../src/exec/app-exec";
import {ErrorMessages} from "../../../src/error-messages";

describe("cmd: app.attach", () => {
	describe("Bad Calls", ()=>{
		beforeEach(()=>{
			TestHelper.prepEnvironment();
			TestHelper.initEnvironment();
			TestHelper.initLibUiApp();
		});
		it("errors if child app is not recognized", ()=>{
			return expect(AppExec(AppNames.LIB_UI, "attach", "lib")).to.be.rejectedWith(ErrorMessages.UNKNOWN_APP);
		});
		it("errors if child is same as parent",()=>{
			return expect(AppExec(AppNames.LIB_UI, "attach", AppNames.LIB_UI)).to.be.rejectedWith(Error, ErrorMessages.PARENT_CHILD_COLLISION);
		})
	});
	describe("Good State", ()=>{
		beforeEach(()=>{
			TestHelper.prepEnvironment();
			TestHelper.initEnvironment();
			TestHelper.initLibUiApp();
			TestHelper.initTimewatcherUiLibUiApp();
			return TestHelper.installPackage(['request']);
		});
		it("attaches a child app to a parent with no packages", ()=>{
			let rootConfig = TestHelper.getRootConfig();
			expect(rootConfig.getAppNames()).to.eql([AppNames.LIB_UI, AppNames.TIMEWATCH_UI]);

			return AppExec(AppNames.LIB_UI, "attach", AppNames.TIMEWATCH_UI).then(()=>{
				let rootConfig = TestHelper.getRootConfig();
				expect(rootConfig.getApp(AppNames.LIB_UI).getAttachedApps()).to.eql([AppNames.TIMEWATCH_UI]);
			});
		});
		it("ensures attach will bring over deps from child attached", ()=>{
			let rootConfig = TestHelper.getRootConfig();
			let timewatchUiConfig = rootConfig.getApp(AppNames.TIMEWATCH_UI);
			expect(timewatchUiConfig.getPackages()).to.eql([]);
			return TestHelper.addPackageToApp(AppNames.LIB_UI, ['request']).then(()=>{
				let rootConfig = TestHelper.getRootConfig();
				expect(rootConfig.getApp(AppNames.LIB_UI).getPackages()).to.eql(["request"]);

				/**
				 * Makes sure package.jsons got strick version of packages for all deps from attached app
				 */
				const libAppPackageJson = TestHelper.expectAppPackageJsonDeps(AppNames.LIB_UI, ["request"]);
				expect(libAppPackageJson.scripts).to.have.property("start");
				const timewatchAppPackageJson = TestHelper.expectAppPackageJsonDeps(AppNames.TIMEWATCH_UI, []);
				expect(timewatchAppPackageJson.scripts).to.have.property("start");

				/**
				 * Make sure package-locks are gen'd as well
				 */
				expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "package-lock.json"])).to.equal(true);
				expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "package-lock.json"])).to.equal(true);

				return AppExec(AppNames.TIMEWATCH_UI, "attach", AppNames.LIB_UI).then(()=>{
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

					/**
					 * Make sure package-locks are gen'd as well
					 */
					expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "package-lock.json"])).to.equal(true);
					expect(TestHelper.ensureFileExists([TestHelper.getTimewatchUiPath(), "package-lock.json"])).to.equal(true);

				});
			});
		});
	});
});