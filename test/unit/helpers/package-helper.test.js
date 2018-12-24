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
});