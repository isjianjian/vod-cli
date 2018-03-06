<template>
  <div>
    <div style="text-align: center; font-size: 12px;color:#6E6E6E;margin-top: 10px;">
      支付剩余时间
    </div>
    <div class="clock">
      <clocker :time="timeExpire!=''?timeExpire:''">
        <span class="day">%_H1</span>
        <span class="day">%_H2</span> :
        <span class="day">%_M1</span>
        <span class="day">%_M2</span> :
        <span class="day">%_S1</span>
        <span class="day">%_S2</span>
      </clocker>
    </div>

    <group style="margin-top:30px;" title="支付信息">
      <cell :inline-desc="body + ' -' + billid ">
        <span slot="title" style="color:#3C3C3C;"><span style="vertical-align:middle;font-size: 20px">￥{{total}}</span></span>
      </cell>
    </group>

    <group title="支付方式" style="margin-top: 30px;">
      <radio :options="radio001" v-model="pay_type">
        <template slot-scope="props" slot="each-item"><!-- use scope="props" when vue < 2.5.0 -->
          <p>
            <img :src="props.icon" class="vux-radio-icon"> <span
            style="color: #4A494B;font-weight: 500;margin-left: 5px;">{{ props.label }}</span>
          </p>
        </template>
      </radio>
    </group>
    <div style="margin-top: 80px;padding-left: 10px;padding-right: 10px;">
      <x-button type="primary" @click.native="pay">确认支付 ￥{{total}}</x-button>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="show_success"
                :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
        <p style="color:#fff;text-align:center;">
          <span style="color: #1AAD19;"> <x-icon type="ios-checkmark-outline" size="90"></x-icon></span>
          <br>
          <span style="font-size:30px;">支付成功</span>
          <br>
          <br>
          <span style="display: inline-block;padding-right: 20px;padding-left: 20px;">
            <x-button v-if="type == 1" @click.native="play" type="primary">播放影片</x-button>
            <x-button v-if="type == 2" @click.native="live" type="primary">去看直播</x-button>
            <x-button v-if="type == 3"  @click.native="ktv" type="primary">去KTV</x-button>
            <x-button v-if="type == 4"  @click.native="music" type="primary">去听音乐</x-button>
            <x-button v-if="type == 5"  @click.native="game" type="primary">去玩游戏</x-button>
          </span>

        </p>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import Group from "vux/src/components/group/index";
  import Cell from "vux/src/components/cell/index";
  import Clocker from "vux/src/components/clocker/index";
  import Radio from "vux/src/components/radio/index";
  import wechat_pay from '../../assets/images/wechat_pay.png'
  import wallet_pay from '../../assets/images/wallet_pay.png'
  import XButton from "vux/src/components/x-button/index";
  import {XDialog, TransferDomDirective as TransferDom} from 'vux'

  export default {
    directives: {
      TransferDom
    },
    components: {
      XDialog,
      XButton,
      Radio,
      Clocker,
      Cell,
      Group
    },
    name: "pay",
    mounted() {
      this.billid = this.$router.currentRoute.query.id;
      this.body = this.$router.currentRoute.query.body;
      this.total = this.$router.currentRoute.query.total;
      this.timeExpire = this.$router.currentRoute.query.timeExpire;
      this.cmid = this.$router.currentRoute.query.cmid;
      this.type = this.getSType(this.cmid);

      if (this.total == 0) {
        this.radio001 = [{
          icon: wallet_pay,
          key: 1,
          value: '钱包支付'
        }]
      }
    },
    data() {
      return {
        type:2,
        billid: 0,
        body: "",
        total: '',
        timeExpire: '',
        pay_type: 1,
        cmid: 0,

        radio001: [{
          icon: wallet_pay,
          key: 1,
          value: '钱包支付'
        }, {
          icon: wechat_pay,
          key: 2,
          value: '微信支付'
        }],
        show_success: false
      }
    },
    methods: {
      pay: function () {
        if (this.pay_type == 1) {
          this.wlPay()
        } else if (this.pay_type == 2) {
          this.wxPay()
        }
      },
      wxPay: function () {
        var that = this;
        var url = this.common.SERVER_URL + "api/vod/mppay?mopenid=" + this.wxinfo.user.openId + "&openid=" + this.wxinfo.user.openId
          + "&token=" + this.common.TOKEN.token + "&tokenType=1"
          + "&billid=" + this.billid;
        this.$http.post(url)
          .then(function (res) {
            console.log("微信支付", res);
            if (res.data.code != 0) {

            }
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
                  that.show_success = true
                }
              }
            );
          })
      },
      wlPay: function () {
        var url = 'api/vod/walletpay?billid=' + this.billid;
        var that = this;
        this.api_post(url, function (res) {
          console.log(res);
          that.success()
        },function (res) {
          that.$vux.toast.text(res.msg, 'center')
        })
      },
      success: function () {
        this.show_success = true
      },
      play: function () {
         this.$router.replace("/detail?id=" + this.formHighId(this.cmid));
        //this.$router.replace("/live");
      },
      live: function () {
        // this.$router.replace("/detail?id=" + this.cmid);
        this.$router.replace("/live");
      },
      ktv: function () {
        // this.$router.replace("/detail?id=" + this.cmid);
        this.$router.replace("/kmusic");
      },
      music: function () {
        // this.$router.replace("/detail?id=" + this.cmid);
        this.$router.replace("/music");
      },
      game: function () {
        // this.$router.replace("/detail?id=" + this.cmid);
        this.$router.replace("/game");
      }
    }
  }
</script>

<style scoped>
  .clock {
    text-align: center;
    font-size: 12px;
  }

  .vux-x-icon {
    fill: #1AAD19;
  }

  .clock span {

    background-color: #6E6E6E;
    color: #fff;
    text-align: center;
    display: inline-block;
    padding: 0 3px;
    border-radius: 3px;
  }
</style>
