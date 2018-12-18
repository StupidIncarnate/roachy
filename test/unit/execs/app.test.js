import {TestHelper} from "../../helpers/test-helper";
import {expect} from 'chai';

import {ErrorMessages} from "../../../src/error-messages";
import {REF} from "../../../src/config";
import {AppExec} from "../../../src/exec/app-exec";

describe.only("cmd: app", () => {
    describe("Bad State", () => {
        describe("Not Init Yet", ()=> {
            beforeEach(()=> {
                TestHelper.prepEnvironment();
            });
            it("errors if not init'd", () => {
                expect(()=> AppExec()).to.throw(ErrorMessages.ROOT_NOT_INIT);
            });
        });
        describe("Bad Calls", ()=>{
            beforeEach(()=>{
                TestHelper.prepEnvironment();
                TestHelper.initEnvironment();
                TestHelper.initLibUiApp();
            });
            it("errors if app is not recognized", ()=>{
                expect(()=>AppExec("lib", "install", "request")).to.throw(ErrorMessages.UNKNOWN_APP);
            });
            it("errors if sub command not recognized", () =>{
                expect(()=> AppExec("lib-ui", "installxx", "request")).to.throw(ErrorMessages.UNKNOWN_APP_COMMAND)
            });
        });
    })
});