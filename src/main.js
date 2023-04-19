import {createApp} from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import globalComponents from '@/global-components'
import appComponents from '@/app-components/index'
import utils from '@/utils'
import '@/libs'

import 'mosha-vue-toastify/dist/style.css'

import $ from 'jquery'
import './assets/css/main.css'
// SASS Theme
import './assets/sass/app.scss'
import {createI18n} from 'vue-i18n'
import ru from './i18n/messages/ru.json'


const i18n = createI18n({
  locale: 'ru', // язык по умолчанию
  fallbackLocale: 'ru',
  messages: {
   ru,
    fr: {
      message: {
        greeting: 'Bonjour!',
        farewell: 'Au revoir!'
      }
    }
  }
})
const app = createApp(App)
  .use(store)
  .use(router)
  .use(i18n)


appComponents.forEach(c => {
  app.component(c.name, c.component)
})

globalComponents(app)
utils(app)

app.mount('#app')
