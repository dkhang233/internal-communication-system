// core
import { createApp } from "vue"
import App from "@/App.vue"
import store from "@/store"
import router from "@/router"
import "@/router/permission"
// load
import { loadSvg } from "@/icons"
import { loadPlugins } from "@/plugins"
import { loadDirectives } from "@/directives"
// css
import "uno.css"
import "normalize.css"
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "vxe-table/lib/style.css"
import "vxe-table-plugin-element/dist/style.css"
import "@/styles/index.scss"
import "vue3-emoji-picker/css"
import { connectWS } from "./utils/websocket"
import relativeTime from "dayjs/plugin/relativeTime"
import dayjs from "dayjs"

const app = createApp(App)

/** Load plugin */
loadPlugins(app)
/** Load global SVG */
loadSvg(app)
/** Load custom instructions */
loadDirectives(app)

// import relativeTime from 'dayjs/plugin/relativeTime' // ES 2015
dayjs.extend(relativeTime)

/** Connect to websocket */
connectWS()
app.use(store).use(router)
router.isReady().then(() => {
  app.mount("#app")
})
