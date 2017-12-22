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
      <x-dialog v-model="show_success" hide-on-blur :dialog-style="{'max-width': '100%', width: '100%', height: '50%', 'background-color': 'transparent'}">
        <p style="color:#fff;text-align:center;" @click="show_success = false">
          <span style="font-size:30px;">支付成功</span>
          <br>
          <br>
          <x-icon type="ios-close-outline" style="fill:#fff;"></x-icon>
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
      },
      data(){
        return{
          billid:0,
          body:"",
          total:'',
          timeExpire:'',
          pay_type:1,
          radio001: [{
            icon: wechat_pay,
            key: 1,
            value: '微信支付'
          }, {
            icon: wallet_pay,
            key: 2,
            value: '钱包支付'
          }],
          show_success:true
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
            var url = 'api/vod/wxpay?billid=' + this.billid
            this.api_post(url,function (res) {

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

        }
      }
    }
</script>

<style scoped>
  .clock{
    text-align: center;
    font-size: 12px;
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
