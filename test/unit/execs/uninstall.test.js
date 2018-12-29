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
			it("errors when one package is in user", () => {
				let rootConfig = TestHelper.getRootConfig();
				expect(Object.keys(rootConfig.getPackages())).to.eql(["moment"]);
				return InstallExec(["request"]).then(()=>{
					return TestHelper.addPackageToApp(AppNames.LIB_UI, "request").then(()=>{
						let rootConfig = TestHelper.getRootConfig();
						expect(rootConfig.getApp(AppNames.LIB_UI).getPackages()).to.eql(["request"]);
						expect(()=>UninstallExec(["request"])).to.throw(ErrorMessages.PACKAGES_IN_USE);
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
			expect(Object.keys(rootConfig.getPackages())).to.eql(["moment"]);
			const rootPackage = TestHelper.getRootPackage();
			expect(Object.keys(PackageHelper.getInstalled(rootPackage))).to.eql(["moment"]);
			expect(Object.keys(PackageHelper.getDevInstalled(rootPackage))).to.eql(["chai-as-promised"]);

			return UninstallExec(["moment"]).then(()=>{
				let rootConfig = TestHelper.getRootConfig();
				expect(Object.keys(rootConfig.getPackages())).to.eql([]);

				const rootPackage = TestHelper.getRootPackage();
				expect(Object.keys(PackageHelper.getInstalled(rootPackage))).to.eql([]);
				expect(Object.keys(PackageHelper.getDevInstalled(rootPackage))).to.eql(["chai-as-promised"]);
			})

		});
	});
});