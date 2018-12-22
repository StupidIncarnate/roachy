import {TestHelper} from "../../helpers/test-helper";
import {expect} from "chai";
import {AppExec} from "../../../src/exec/app-exec";
import {ErrorMessages} from "../../../src/error-messages";

describe("cmd: app.attach", () => {
	describe("Bad Calls", ()=>{
		beforeEach(()=>{
			TestHelper.prepEnvironment();
			TestHelper.initEnvironment();
			TestHelper.initLibUiApp();
		});
		it("errors if child app is not recognized", ()=>{
			expect(()=>AppExec("lib-ui", "attach", "lib")).to.throw(ErrorMessages.UNKNOWN_APP);
		});
		it("errors if child is same as parent",()=>{
			expect(() => AppExec("lib-ui", "attach", "lib-ui")).to.throw(ErrorMessages.PARENT_CHILD_COLLISION);
		})
	});
	describe("Good State", ()=>{
		beforeEach(()=>{
			TestHelper.prepEnvironment();
			TestHelper.initEnvironment();
			TestHelper.initLibUiApp();
			TestHelper.initTimewatcherUiLibUiApp();
			return TestHelper.installPackage(['request']);
		});
		it("attaches a child app to a parent with no packages", ()=>{
			let rootConfig = TestHelper.getRootConfig();
			expect(rootConfig.getAppNames()).to.eql(["lib-ui", "timewatch-ui"]);

			return AppExec("lib-ui", "attach", "timewatch-ui").then(()=>{
				let rootConfig = TestHelper.getRootConfig();
				expect(rootConfig.getApp("lib-ui").getAttachedApps()).to.eql(["timewatch-ui"]);
			});
		});
		it("attaches app and adds packages to parent app", ()=>{
			let rootConfig = TestHelper.getRootConfig();
			let timewatchUiConfig = rootConfig.getApp("timewatch-ui");
			expect(timewatchUiConfig.getPackages()).to.eql([]);
			return TestHelper.addPackageToApp("timewatch-ui", ['request']).then(()=>{
				let rootConfig = TestHelper.getRootConfig();
				let timewatchUiConfig = rootConfig.getApp("timewatch-ui");
				expect(timewatchUiConfig.getPackages()).to.eql(["request"]);

				return AppExec("lib-ui", "attach", "timewatch-ui").then(()=>{
					let rootConfig = TestHelper.getRootConfig();
					expect(rootConfig.getApp("lib-ui").getAttachedApps()).to.eql(["timewatch-ui"]);
					let libAppConfig = rootConfig.getApp("lib-ui");
					expect(libAppConfig.getPackages()).to.eql(["request"]);
				});
			});
		});
	});
});