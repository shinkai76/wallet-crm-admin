import { __decorate } from "tslib";
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import { getSidebarStatus, setSidebarStatus } from '@/utils/cookies';
import store from '@/store';
export var DeviceType;
(function (DeviceType) {
    DeviceType[DeviceType["Mobile"] = 0] = "Mobile";
    DeviceType[DeviceType["Desktop"] = 1] = "Desktop";
})(DeviceType || (DeviceType = {}));
let App = class App extends VuexModule {
    constructor() {
        super(...arguments);
        this.sidebar = {
            opened: getSidebarStatus() !== 'closed',
            withoutAnimation: false
        };
        this.device = DeviceType.Desktop;
    }
    TOGGLE_SIDEBAR(withoutAnimation) {
        this.sidebar.opened = !this.sidebar.opened;
        this.sidebar.withoutAnimation = withoutAnimation;
        if (this.sidebar.opened) {
            setSidebarStatus('opened');
        }
        else {
            setSidebarStatus('closed');
        }
    }
    CLOSE_SIDEBAR(withoutAnimation) {
        this.sidebar.opened = false;
        this.sidebar.withoutAnimation = withoutAnimation;
        setSidebarStatus('closed');
    }
    TOGGLE_DEVICE(device) {
        this.device = device;
    }
    ToggleSideBar(withoutAnimation) {
        this.TOGGLE_SIDEBAR(withoutAnimation);
    }
    CloseSideBar(withoutAnimation) {
        this.CLOSE_SIDEBAR(withoutAnimation);
    }
    ToggleDevice(device) {
        this.TOGGLE_DEVICE(device);
    }
};
__decorate([
    Mutation
], App.prototype, "TOGGLE_SIDEBAR", null);
__decorate([
    Mutation
], App.prototype, "CLOSE_SIDEBAR", null);
__decorate([
    Mutation
], App.prototype, "TOGGLE_DEVICE", null);
__decorate([
    Action
], App.prototype, "ToggleSideBar", null);
__decorate([
    Action
], App.prototype, "CloseSideBar", null);
__decorate([
    Action
], App.prototype, "ToggleDevice", null);
App = __decorate([
    Module({ dynamic: true, store, name: 'app' })
], App);
export const AppModule = getModule(App);
//# sourceMappingURL=app.js.map