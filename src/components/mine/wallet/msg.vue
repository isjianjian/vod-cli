<template>
  <div>
    <msg :title="title" :description="description" :buttons="buttons" :icon="icon"></msg>
  </div>
</template>


<script>
  import { Msg, Divider, XButton } from 'vux'
  export default {
    components: {
      Msg,
      Divider,
      XButton
    },
    mounted(){

    },
    methods: {

    },
    data () {
      return {
        title:'充值成功',
        description: '您已成功充值，可进入余额页面查看充值记录，由于微信支付与平台有细微延迟 若充值未及时到账请耐心等待几分钟  如有疑问请联系客服',
        icon: 'success',
        buttons: [{
          type: 'primary',
          text: '查看余额',
          link: '/mine/wallet/balance'
        }, {
          type: 'default',
          text: '返回充值',
          link: '/mine/wallet/recharge'
        }]
      }
    }
  }
</script>
