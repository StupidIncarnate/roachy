import {TestHelper} from "../../helpers/test-helper";
const expect = require('chai').expect;

import {InitExec} from "../../../src/exec/init-exec";
import {PackageHelper} from "../../../src/helpers/package-helper";

describe("cmd: init", ()=>{
	beforeEach(()=> {
		TestHelper.prepEnvironment();
	});
	it("creates init folder", ()=>{
		return InitExec().then(()=>{
			expect(TestHelper.ensureFileExists("roachy.config.json"), "Expect config.json").to.be.true;
			const configJson = TestHelper.getJsonContents("roachy.config.json");
			expect(configJson).to.have.property("version", 0.1);
			expect(configJson).to.have.property("apps").and.to.be.an("object");
			expect(configJson).to.have.property("packages").and.to.be.an("object");
		});
	});
	it("creates package.json if one doesn't exist", ()=>{
		TestHelper.deletePath(["package.json"]);
		expect(TestHelper.ensureFileExists(["package.json"])).to.equal(false);
		return InitExec().then(()=>{
			expect(TestHelper.ensureFileExists(["package.json"])).to.equal(true);
			expect(TestHelper.ensureFileExists("roachy.config.json"), "Expect config.json").to.be.true;
			const configJson = TestHelper.getJsonContents("roachy.config.json");
			expect(configJson).to.have.property("version", 0.1);
			expect(configJson).to.have.property("apps").and.to.be.an("object");
			expect(configJson).to.have.property("packages").and.to.be.an("object");
		});
	});
	it("installs if package.json but no node_modules", ()=>{
		const pJson = TestHelper.getRootPackage();
		pJson.dependencies = {"roachy-stub": "^0.0.1"};
		TestHelper.saveRootPackageJson(pJson);
		expect(TestHelper.ensureFileExists(["node_modules"])).to.equal(false);

		return InitExec().then(() => {
			expect(TestHelper.ensureFileExists(["node_modules"])).to.equal(true);
		});
	});
	it("registers any installed packages on init; skips devDependencies", ()=>{
		const pJson = TestHelper.getRootPackage();
		pJson.dependencies = {"roachy-stub": "^0.0.1"};
		TestHelper.saveRootPackageJson(pJson);

		return InitExec().then(() => {
			let rootPackageJson = TestHelper.getRootPackage();
			expect(PackageHelper.getInstalled(rootPackageJson)).to.eql({
				"roachy-stub": "^0.0.1"
			});

			let rootConfig = TestHelper.getRootConfig();
			expect(rootConfig.getPackages()).to.eql({
				"roachy-stub": "0.0.1"
			});

		});

	});

});