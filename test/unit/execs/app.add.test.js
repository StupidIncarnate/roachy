import {TestHelper} from "../../helpers/test-helper";
import {expect} from "chai";
import {AppExec} from "../../../src/exec/app-exec";
import {ErrorMessages} from "../../../src/error-messages";
import {RootConfigHelper} from "../../../src/helpers/root-config-helper";
import {PackageHelper} from "../../../src/helpers/package-helper";

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
			describe("Adds package to app", ()=>{
				beforeEach(()=>{
					TestHelper.prepEnvironment();
					TestHelper.initEnvironment();
					TestHelper.initLibUiApp();
					return TestHelper.installPackage(['request']);
				});
				it("adds pkg to app", ()=>{
					expect(TestHelper.ensureFileExists("node_modules")).to.equal(true);
					expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
					expect(TestHelper.getRootConfig().packages).to.have.property("request");
					expect(TestHelper.getRootConfig().packages.request).to.be.a("string");
					return AppExec("lib-ui", "add", "request").then(()=>{
						expect(TestHelper.ensureFileExists([TestHelper.getLibUiPath(), "node_modules"])).to.equal(false);
						const rootConfig = TestHelper.getRootConfig();
						expect(rootConfig.packages).to.have.property("request");
						expect(rootConfig.packages.request).to.be.a("string");
						expect(RootConfigHelper.getAppPackages(rootConfig)).to.eql(["request"]);

						const appPackageJson = TestHelper.getJsonContents(TestHelper.getLibUiPath());
						expect(PackageHelper.getInstalled(appPackageJson)).to.have.property("request");
						TestHelper.expectStaticVersion(PackageHelper.getInstalled(appPackageJson).request);
					});
				});
				it("installs package and then updates an attached app with package as well", ()=>{

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