<template>
  <div>
    <app-footer></app-footer>
  </div>
</template>
<style>
</style>
<script>
  import { Tab, TabItem } from 'vux'
  import AppFooter from './Footer'
  export default {
    name: "home",
    data () {
      return {
        tag: '影院',
        taglist: ['点播', '订房', '购物', '我的']
      }
    },
    components: {
      Tab,
      TabItem,
      AppFooter,
    }
  }
</script>

<style scoped>

</style>
