import {AppNames, TestHelper} from "../../helpers/test-helper";
import {expect} from 'chai';
import chai from 'chai';
chai.use(require("chai-as-promised"));

import {ErrorMessages} from "../../../src/error-messages";
import {InstallExec} from "../../../src/exec/install-exec";
import {UninstallExec} from "../../../src/exec/uninstall-exec";
import {PackageHelper} from "../../../src/helpers/package-helper";

describe("cmd: uninstall", () => {
	describe("Bad State", () => {
		describe("Not Init Yet", () => {
			beforeEach(() => {
				TestHelper.prepEnvironment();
			});
			it("errors if not init'd", () => {
				expect(() => InstallExec()).to.throw(ErrorMessages.ROOT_NOT_INIT);
			});
		});
		describe("After Init", () => {
			beforeEach(() => {
				TestHelper.prepEnvironment();
				return TestHelper.initEnvironment()
					.then(() => TestHelper.initLibUiApp())
			});
			it("errors if nothing passed", () => {
				expect(() => UninstallExec([])).to.throw(ErrorMessages.PACKAGES_REQUIRED);
			});
			it("errors if package one package is not recognized", () => {
				expect(()=>UninstallExec(["jksdhkds"])).to.throw(ErrorMessages.NOT_INSTALLED);
			});
			it("errors when one package is in use", () => {
				let rootConfig = TestHelper.getRootConfig();
				expect(Object.keys(rootConfig.getPackages())).to.eql([]);
				return InstallExec(["roachy-stub"]).then(()=>{
					return TestHelper.addPackageToApp(AppNames.LIB_UI, "roachy-stub").then(()=>{
						let rootConfig = TestHelper.getRootConfig();
						expect(rootConfig.getApp(AppNames.LIB_UI).getPackages()).to.eql(["roachy-stub"]);
						expect(()=>UninstallExec(["roachy-stub"])).to.throw(ErrorMessages.PACKAGES_IN_USE);
					});
				});
			});
		});

	});
	describe("Good State", ()=>{
		beforeEach(() => {
			TestHelper.prepEnvironment();
			return TestHelper.initEnvironment()
				.then(() => TestHelper.initLibUiApp())
		});
		it("can remove unused packages from roachy", ()=>{
			let rootConfig = TestHelper.getRootConfig();
			expect(Object.keys(rootConfig.getPackages())).to.eql([]);
			const rootPackage = TestHelper.getRootPackage();
			expect(Object.keys(PackageHelper.getInstalled(rootPackage))).to.eql([]);
			expect(Object.keys(PackageHelper.getDevInstalled(rootPackage))).to.eql([]);

			return InstallExec(["roachy-stub"]).then(()=> {
				const rootPackage = TestHelper.getRootPackage();
				expect(Object.keys(PackageHelper.getInstalled(rootPackage))).to.eql(["roachy-stub"]);
				expect(Object.keys(PackageHelper.getDevInstalled(rootPackage))).to.eql([]);

				return UninstallExec(["roachy-stub"]).then(() => {
					let rootConfig = TestHelper.getRootConfig();
					expect(Object.keys(rootConfig.getPackages())).to.eql([]);

					const rootPackage = TestHelper.getRootPackage();
					expect(Object.keys(PackageHelper.getInstalled(rootPackage))).to.eql([]);
					expect(Object.keys(PackageHelper.getDevInstalled(rootPackage))).to.eql([]);
				});
			});

		});
	});
});