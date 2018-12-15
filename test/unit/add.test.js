import {TestHelper} from "../helpers/test-helper";
import {expect} from 'chai';

import {ErrorMessages} from "../../src/error-messages";
import {AddExec} from "../../src/exec/add-exec";
import {REF} from "../../src/config";

describe("cmd: add", () => {
	describe("Bad State", () => {
		describe("Not Init Yet", ()=> {
			beforeEach(()=> {
				TestHelper.prepEnvironment();
			});
			it("errors if not init'd", () => {
				expect(()=> AddExec()).to.throw(ErrorMessages.ROOT_NOT_INIT);
			});
		});
		describe("After Init", ()=> {
			beforeEach(()=>{
				TestHelper.prepEnvironment();
				TestHelper.initEnvironment();
			});
			it("errors if appName not passed", () => {
				expect(() => AddExec()).to.throw(ErrorMessages.APP_NAME_REQUIRED);
			});
			it("errors if location not passed", ()=>{
				expect(() => AddExec("app-name")).to.throw(ErrorMessages.APP_LOCATION_REQUIRED);
			});
			it("errors if location does not exist", ()=>{
				expect(() => AddExec("app-name", "app-loc")).to.throw(ErrorMessages.APP_LOCATION_INVALID);
				expect(() => AddExec("app-name", "src/app-loc")).to.throw(ErrorMessages.APP_LOCATION_INVALID);
			});
		});

	});
	describe("Good State", () => {
		beforeEach(()=>{
			TestHelper.prepEnvironment();
			TestHelper.initEnvironment();
		});
		it("adds an app to config", ()=>{
			const appName = "lib-ui";
			const appLoc = "src/lib/lib-ui";
			const childConfigPath = "src/lib/lib-ui/" + REF.childConfigName;
			AddExec(appName, appLoc);
			expect(TestHelper.getRootConfig()).to.have.property("apps").and.to.eql( {[appName]: appLoc});
			//expect(TestHelper.ensureFileExists(childConfigPath), `${"src/lib/lib-ui/" + REF.childConfigName} exists`).to.be.true;
		});

	});
});