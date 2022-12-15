import type { App } from 'vue'
import Contributes from './contributes.vue'
const install =  function(app: App) {
    app.component('Contributes', Contributes)
}
export default install