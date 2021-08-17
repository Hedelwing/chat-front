import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import apolloProvider from './vue-apollo'
import * as VeeValidate from 'vee-validate'
import { required, email, min } from 'vee-validate/dist/rules'

Vue.use(VeeValidate, { inject: false })

VeeValidate.extend('required', {
  ...required,
  message: 'Обязательное поле'
})

VeeValidate.extend('email', {
  ...email,
  message: 'Некорректный email'
})

VeeValidate.extend('min', {
  ...min,
  params: ['length'],
  message: 'Поле должно содержать минимум {length} символов'
})

VeeValidate.extend('hasLowerCase', {
  validate: value => /[a-zа-яё]+/.test(value),
  message: 'Поле должно содержать строчные буквы'
})

VeeValidate.extend('hasUpperCase', {
  validate: value => /[A-ZА-ЯЁ]+/.test(value),
  message: 'Поле должно содержать заглавные буквы'
})

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
