import { __decorate } from "tslib";
import { Component, Vue, Watch } from 'vue-property-decorator';
import { AppModule, DeviceType } from '@/store/modules/app';
const WIDTH = 992; // refer to Bootstrap's responsive design
let default_1 = class default_1 extends Vue {
    get device() {
        return AppModule.device;
    }
    get sidebar() {
        return AppModule.sidebar;
    }
    onRouteChange() {
        if (this.device === DeviceType.Mobile && this.sidebar.opened) {
            AppModule.CloseSideBar(false);
        }
    }
    beforeMount() {
        window.addEventListener('resize', this.resizeHandler);
    }
    mounted() {
        const isMobile = this.isMobile();
        if (isMobile) {
            AppModule.ToggleDevice(DeviceType.Mobile);
            AppModule.CloseSideBar(true);
        }
    }
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeHandler);
    }
    isMobile() {
        const rect = document.body.getBoundingClientRect();
        return rect.width - 1 < WIDTH;
    }
    resizeHandler() {
        if (!document.hidden) {
            const isMobile = this.isMobile();
            AppModule.ToggleDevice(isMobile ? DeviceType.Mobile : DeviceType.Desktop);
            if (isMobile) {
                AppModule.CloseSideBar(true);
            }
        }
    }
};
__decorate([
    Watch('$route')
], default_1.prototype, "onRouteChange", null);
default_1 = __decorate([
    Component({
        name: 'ResizeMixin'
    })
], default_1);
export default default_1;
//# sourceMappingURL=resize.js.map