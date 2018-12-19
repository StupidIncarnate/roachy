import {TestHelper} from "../../helpers/test-helper";
import {expect} from "chai";
import {AppExec} from "../../../src/exec/app-exec";
import {ErrorMessages} from "../../../src/error-messages";

describe("cmd: app.attach", () => {
	describe("Bad State", () => {
		describe("Bad Calls", ()=>{
			beforeEach(()=>{
				TestHelper.prepEnvironment();
				TestHelper.initEnvironment();
				TestHelper.initLibUiApp();
			});
			it("errors if child app is not recognized", ()=>{
				// expect(()=>AppExec("lib", "install", "request")).to.throw(ErrorMessages.UNKNOWN_APP);
			});
		});
		describe("Good State", ()=>{

		});
	})
});