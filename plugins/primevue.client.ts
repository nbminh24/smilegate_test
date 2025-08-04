import PrimeVue from 'primevue/config'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Checkbox from 'primevue/checkbox'
import Paginator from 'primevue/paginator'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    ripple: true,
    inputStyle: 'outlined'
  })

  nuxtApp.vueApp.use(ToastService)
  nuxtApp.vueApp.use(ConfirmationService)

  // Register components
  nuxtApp.vueApp.component('Button', Button)
  nuxtApp.vueApp.component('InputText', InputText)
  nuxtApp.vueApp.component('Dropdown', Dropdown)
  nuxtApp.vueApp.component('DataTable', DataTable)
  nuxtApp.vueApp.component('Column', Column)
  nuxtApp.vueApp.component('Checkbox', Checkbox)
  nuxtApp.vueApp.component('Paginator', Paginator)
  nuxtApp.vueApp.component('Dialog', Dialog)
  nuxtApp.vueApp.component('Toast', Toast)
})
