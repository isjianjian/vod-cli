<template>
  <div>
  <div style="text-align: center; font-size: 12px;color:#6E6E6E;margin-top: 10px;">
    支付剩余时间
  </div>
  <div class="clock">
    <clocker :time="timeExpire">
      <span class="day">%_H1</span>
      <span class="day">%_H2</span> :
      <span class="day">%_M1</span>
      <span class="day">%_M2</span> :
      <span class="day">%_S1</span>
      <span class="day">%_S2</span>
    </clocker>
  </div>

  <group style="margin-top:30px;" title="支付信息">
    <cell  :inline-desc="body + ' -' + billid ">
      <span slot="title" style="color:#3C3C3C;"><span style="vertical-align:middle;font-size: 20px">￥{{total}}</span></span>
    </cell>
  </group>

    <group title="支付方式" style="margin-top: 30px;">
      <radio  :options="radio001" v-model="pay_type">
        <template slot-scope="props" slot="each-item"><!-- use scope="props" when vue < 2.5.0 -->
          <p>
             <img :src="props.icon" class="vux-radio-icon"> <span style="color: #4A494B;font-weight: 500;margin-left: 5px;">{{ props.label }}</span>
          </p>
        </template>
      </radio>
    </group>
    <div  style="margin-top: 80px;padding-left: 10px;padding-right: 10px;">
      <x-button  type="primary" @click.native="pay" >确认支付 ￥{{total}}</x-button>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="show_success"  :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
        <p style="color:#fff;text-align:center;" >
         <span style="color: #1AAD19;"> <x-icon  type="ios-checkmark-outline" size="90"></x-icon></span>
          <br>
          <span  style="font-size:30px;">支付成功</span>
          <br>
          <br>
          <span style="display: inline-block;padding-right: 20px;padding-left: 20px;">
            <x-button @click.native="play" type="primary">播放影片</x-button>
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
    import { XDialog, TransferDomDirective as TransferDom } from 'vux'
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
      mounted(){
        this.billid = this.$router.currentRoute.query.id
        this.body = this.$router.currentRoute.query.body
        this.total = this.$router.currentRoute.query.total
        this.timeExpire = this.$router.currentRoute.query.timeExpire
        this.cmid = this.$router.currentRoute.query.cmid
      },
      data(){
        return{
          billid:0,
          body:"",
          total:'',
          timeExpire:'',
          pay_type:1,
          cmid:0,
          radio001: [{
            icon: wechat_pay,
            key: 1,
            value: '微信支付'
          }, {
            icon: wallet_pay,
            key: 2,
            value: '钱包支付'
          }],
          show_success:false
        }
      },
      methods: {
        pay:function() {
          if (this.pay_type == 1){
            this.wxPay()
          }else {
            this.wlPay()
          }
        },
        wxPay:function () {
          var that = this
          var url = this.common.SERVER_URL  + "api/vod/mppay?openid="+this.wxinfo.user.openId
                    + "&billid=" + this.billid
          this.$http.post(url)
            .then(function (res) {
              console.log("微信支付",res)
              if (res.data.code != 0){

              }
              WeixinJSBridge.invoke(
                'getBrandWCPayRequest', {
                  "appId":res.data.data.appId,     //公众号名称，由商户传入
                  "timeStamp":res.data.data.timeStamp,         //时间戳，自1970年以来的秒数
                  "nonceStr":res.data.data.nonceStr, //随机串
                  "package":res.data.data.packageValue,
                  "signType":"MD5",         //微信签名方式：
                  "paySign": res.data.data.paySign //微信签名
                },
                function(res){
                  if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                    that.pay_done = true
                  }
                }
              );
            })
        },
        wlPay:function () {
          var url = 'api/vod/walletpay?billid=' + this.billid
          var that = this
          this.api_post(url,function (res) {
            console.log(res)
            that.success()
          })
        },
        success:function () {
          this.show_success == true
        },
        play:function () {
          this.$router.replace("/detail?id=" + this.cmid);
        }
      }
    }
</script>

<style scoped>
  .clock{
    text-align: center;
    font-size: 12px;
  }
  .vux-x-icon {
    fill: #1AAD19;
  }
  .clock span{

    background-color:#6E6E6E;
    color:#fff;
    text-align:center;
    display:inline-block;
    padding:0 3px;
    border-radius:3px;
  }
</style>
