<template>
  <div style="height:100%;">
      <router-view  v-bind:style="{height: root_style + 'px'}" class="router-view"></router-view>
      <app-footer></app-footer>
  </div>
</template>
<style>
</style>
<script>
  import { Tab, TabItem,TransferDom} from 'vux'
  import AppFooter from './Footer'
  export default {
    name: "home",
    data () {
      console.log("窗口高度", document.documentElement.clientHeight)
      return {
        root_style: document.documentElement.clientHeight - 53
      }
    },
    components: {
      Tab,
      TabItem,
      AppFooter,
    },
    mounted() {
    },
    methods:{

    }
  }
</script>

<style scoped>

</style>
