import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "@/assets/styles/_reset.scss";
import {snackbarService} from "@/shared/services/snackbar.service";

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from "vuetify/lib/iconsets/mdi";
import { VIconBtn } from 'vuetify/labs/VIconBtn'
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify({
    components: {
        ...components,
        VIconBtn
    },
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
})

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.provide('snackbarService', snackbarService)
app.mount('#app')