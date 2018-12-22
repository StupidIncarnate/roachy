import {TestHelper} from "../../helpers/test-helper";
import {expect} from "chai";
import {AppExec} from "../../../src/exec/app-exec";
import {ErrorMessages} from "../../../src/error-messages";

describe("cmd: app.add", () => {
	describe("Bad State", () => {
		describe("Bad Calls", ()=>{
			beforeEach(()=>{
				TestHelper.prepEnvironment();
				TestHelper.initEnvironment();
				TestHelper.initLibUiApp();
			});
			it("errors if no packages supplied to install", ()=>{
				expect(()=>AppExec("lib-ui", "add")).to.throw(ErrorMessages.PACKAGES_REQUIRED);
			});
			it("errors if a package passed is not installed", ()=>{
				expect(()=>AppExec("lib-ui", "add", "request")).to.throw(ErrorMessages.NOT_INSTALLED);
			});
		});
		describe("Good State", ()=>{
			describe("Adds package to roachy", ()=>{
				beforeEach(()=>{
					TestHelper.prepEnvironment();
					TestHelper.initEnvironment();
					TestHelper.initLibUiApp();
					return TestHelper.installPackage(['request']);
				});
				it("adds pkg to root", ()=>{
					expect(TestHelper.ensureFileExists("node_modules")).to.equal(true);
					expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
					expect(TestHelper.getRootConfigObject().packages).to.have.property("request");
					expect(TestHelper.getRootConfigObject().packages.request).to.be.a("string");
					return AppExec("lib-ui", "add", "request").then(()=>{
						expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
						const rootConfig = TestHelper.getRootConfig();
						expect(rootConfig.getPackages()).to.have.property("request");
						expect(rootConfig.getPackages().request).to.be.a("string");
						TestHelper.expectStaticVersions(rootConfig.packages);
					});
				});
				it("installs package and then updates an attached app with package as well", ()=>{

					// return TestHelper.installPackage(['request']);
					//
					// const appPackageJson = TestHelper.getJsonContents(TestHelper.getLibUiPath());
					// expect(PackageHelper.getInstalled(appPackageJson)).to.not.have.property("request");
					// TestHelper.expectStaticVersions(PackageHelper.getInstalled(appPackageJson));
				});
				it("ensures to update the package.json of an app indirectly attached view parent", ()=>{

				});
			});
			describe("Installs existing package", ()=>{
				it("adds installed package to app", ()=>{

				});
				it("installs newer version and updates app", ()=>{

				});
			});
		});
	})
});