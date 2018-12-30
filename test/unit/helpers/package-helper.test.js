import {expect} from 'chai';
import {PackageHelper} from "../../../src/helpers/package-helper";

describe("helpers/package-helper", ()=>{
	describe("getCheckableVersion", ()=>{
		it("handles ^3.2.0", ()=>{
			expect(PackageHelper.getCheckableVersion("^3.2.0")).to.equal("3.2.0");
		});
		it("handles 3.2.0", ()=>{
			expect(PackageHelper.getCheckableVersion("^3.2.0")).to.equal("3.2.0");
		});
		it("handles ~3.2.0", ()=>{
			expect(PackageHelper.getCheckableVersion("~3.2.0")).to.equal("3.2.0");
		});
		it("handles 3.2.0-beta.0", ()=>{
			expect(PackageHelper.getCheckableVersion("3.2.0-beta.0")).to.equal("3.2.0-beta.0");
		});
		it("handles ^3.2.0-beta.0", ()=>{
			expect(PackageHelper.getCheckableVersion("^3.2.0-beta.0")).to.equal("3.2.0-beta.0");
		});
		it("handles *", ()=>{
			expect(PackageHelper.getCheckableVersion("*")).to.equal(null);
		});
	});
	describe("getPackageName", () => {
		it("handles just a name", ()=> {
			expect(PackageHelper.getPackageName("moment")).to.equal("moment");
		});
		it("handles a name with version", ()=> {
			expect(PackageHelper.getPackageName("moment@3.3.1")).to.equal("moment");
		});
	});
});