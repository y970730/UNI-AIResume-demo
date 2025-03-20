"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/talk/talk.js";
  "./pages/folder/folder.js";
  "./pages/person/person.js";
  "./pages/login/login.js";
  "./subpkg_task/rootpkg/rootpkg.js";
}
const _sfc_main = {
  // 相当于小程序app.js
  // 这里负责监听整个程序的全局生命周期
  onLaunch: function() {
    console.log("App Launch, 全局App加载周期");
  },
  onShow: function() {
    console.log("App Show, 全局App显示周期");
  },
  onHide: function() {
    console.log("App Hide, 全局App隐藏周期");
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/white/Downloads/UNI-AIResume/UNI-AIResume-demo/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
