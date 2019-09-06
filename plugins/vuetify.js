import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import colors from 'vuetify/es5/util/colors'
Vue.use(Vuetify)

export default ctx => {
    const vuetify = new Vuetify({
        theme: {
            dark: false,
            themes: {
                light: {
                    primary: 'FF4500', // orange darken-4
                    accent: 'E0E0E0', // grey lighten-1
                    secondary: colors.amber.darken3,
                    info: colors.teal.lighten1,
                    warning: colors.amber.base,
                    error: colors.deepOrange.accent4,
                    success: colors.green.accent4
                },
                dark: {}
			},
			options: {
				customProperties: true
			}
        }
    })

    ctx.app.vuetify = vuetify
    ctx.$vuetify = vuetify.framework
}
