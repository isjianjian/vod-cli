<template>
  <div>
    <group class='top'>
      <x-input type="number" :is-type="valid_amont" text-align="center" placeholder-align="center" placeholder="输入金额  元"
               v-model="amount">
        <img slot="label" class="userinfo-avatarm" :src="this.wxinfo.user.headImgUrl" background-size="cover"></img>
        <x-button slot="right" :gradients="['#3F9DE7','#3F9DE7']" @click.native="pay" mini>充值</x-button>
      </x-input>
    </group>
    <load-more tip="赠送积分规则" :show-loading="false" background-color="#fbf9fe"></load-more>
    <div style="color:#999999">
      <x-table>
        <thead>
        <tr>
          <th> 充值（元)</th>
          <th>赠送积分</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in grids">
          <td>{{item.amount }}</td>
          <td>{{item.sendpoints}}</td>
        </tr>
        </tbody>
      </x-table>
    </div>
    <div v-transfer-dom>
      <popup v-model="show_pay" height="270px" is-transparent>
        <div style="width: 95%;background-color:#fff;height:250px;margin:0 auto;border-radius:5px;padding-top:10px;">
          <group>
            <cell title="项目" :value="'余额充值_' + amount"></cell>
            <cell title="总额" :value="'￥' + amount"></cell>
          </group>
          <div style="padding:20px 15px;">
            <x-button @click.native="pay_1" type="primary">确认支付</x-button>
            <x-button @click.native="show_pay = false">取消</x-button>
          </div>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="pay_done" height="100%">
        <div class="popup1">
          <group>
            <msg :title="title" :description="description" :buttons="buttons" :icon="icon"></msg>
          </group>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
  import Group from "vux/src/components/group/index";
  import XInput from "vux/src/components/x-input/index";
  import XButton from "vux/src/components/x-button/index";
  import XTable from "vux/src/components/x-table/index";
  import LoadMore from "vux/src/components/load-more/index";
  import Popup from "vux/src/components/popup/index";
  import {TransferDom, Msg, Divider} from 'vux'
  import Cell from "vux/src/components/cell/index";

  export default {
    directives: {
      TransferDom
    },
    components: {
      Cell,
      Popup,
      LoadMore,
      XTable,
      XButton,
      XInput,
      Group,
      Msg,
      Divider
    },
    name: "recharge",
    data() {
      return {
        grids: {},
        amount: '',
        show_pay: false,
        pay_done: false,
        title: '充值成功',
        description: '您已成功充值，可进入余额页面查看充值记录，由于微信支付与平台有细微延迟 若充值未及时到账请耐心等待几分钟  如有疑问请联系客服',
        icon: 'success',
        buttons: [{
          type: 'primary',
          text: '查看余额',
          onClick: this.toBalance.bind(this)

        }, {
          type: 'default',
          text: '返回充值',
          onClick: this.toRecharge.bind(this)
        }]
      }
    },
    mounted() {
      var that = this;
      this.api_post("api/recharge/info", function (data) {
        console.log("recharge_info", data);
        that.grids = data.data
      })
    },
    methods: {
      pay: function () {
        if (!this.valid_amont().valid) {
          return
        }
        console.log("选择支付");
        this.show_pay = true
      },
      pay_1: function () {
        this.show_pay = false;
        var that = this;
        var url = this.common.SERVER_URL + "api/mp/recharge/order?amount=" + this.amount + "&mopenid=" + this.wxinfo.user.openId + "&openid=" + this.wxinfo.user.unionId
        // var url = this.common.SERVER_URL + "api/mp/recharge/order?amount=" + this.amount + "&mopenid=" + this.wxinfo.user.openId + "&openid=" + this.wxinfo.user.openId
          + "&token=" + this.common.TOKEN.token + "&tokenType=1";

        this.$http.post(url)
          .then(function (res) {
            console.log("微信支付", res);
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
                "appId": res.data.data.appId,     //公众号名称，由商户传入
                "timeStamp": res.data.data.timeStamp,         //时间戳，自1970年以来的秒数
                "nonceStr": res.data.data.nonceStr, //随机串
                "package": res.data.data.packageValue,
                "signType": "MD5",         //微信签名方式：
                "paySign": res.data.data.paySign //微信签名
              },
              function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                  that.pay_done = true
                }
              }
            );
          })
      },
      valid_amont: function () {
        if (this.amount == '' || this.amount <= 0 || this.amount.length > 10) {
          return {valid: false, msg: "输入有误"}
        }

        var regu = /^[0-9]+\.?[0-9]*$/;
        if (!regu.test(this.amount)) {
          return {valid: false, msg: "请输入正确的数字"}
        }
        if (this.amount.indexOf(".") > 0 && (this.amount.length - this.amount.indexOf(".")) > 3) {
          return {valid: false, msg: "充值金额不能小于'分'哦"}
        }
        return {valid: true}
      },
      toBalance() {
        this.pay_done = false;
        this.$router.replace("/mine/wallet/balance")
      },
      toRecharge() {
        this.pay_done = false;
        this.$router.replace("/mine/wallet/recharge")
      }
    }

  }
</script>

<style scoped>
  .top {
    background: #fff;
    display: flex;
    align-items: center;
    border-top: 3px solid #efeff4;
    border-bottom: 1px solid #efeff4;

  }

  .input {
    flex: 1;
    padding-right: 10px;
  }

  .userinfo-avatarm {
    width: 28px;
    height: 28px;
    border-radius: 50%;

  }

  .title {
    background: #fff;
    padding: 15px 15px 0 15px;
  }

</style>
<style>
  .weui-cells {
    width: 100% !important;
  }

</style>
