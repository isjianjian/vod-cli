<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
    <div  class="userinfo">
      <div class="h_img"><img width="68" height="68" :src="this.wxinfo.user.headImgUrl"></div>
      <div class="name"><span>{{this.wxinfo.user.nikeName}}</span><img :src="sex_img"/></div>
      <div class="leave">会员等级</div>
    </div>
    <group>
      <cell title="我的订单" link="/mine/order?i=0" is-link>
        <img slot="icon" width="26" style="display:block;margin-right:5px;" src="../../assets/images/order.png">
      </cell>
      <grid>
        <grid-item link="/mine/order?i=1" label="余额">
          <img  slot="icon" src="../../assets/images/obligation.png">
          <span style="color:#8DE93A;" slot="label">待付款</span>
        </grid-item>
        <grid-item link="/mine/order?i=3" >
          <img slot="icon" src="../../assets/images/dis_evaluate.png">
          <span style="color:#F9D48E;" slot="label">待评价</span>
        </grid-item>
        <grid-item link="/mine/order?i=2">
          <img slot="icon" src="../../assets/images/completed.png">
          <span style="color:#FF5555;" slot="label">已完成</span>
        </grid-item>
        <grid-item link="/mine/order?i=4">
          <img slot="icon" src="../../assets/images/refund.png">
          <span style="color:#55B9FF;" slot="label">退款</span>
        </grid-item>
      </grid>
    </group>
    <group>
      <cell title="我的钱包" is-link link="/mine/wallet/balance">
        <img slot="icon" width="26" style="display:block;margin-right:5px;" src="../../assets/images/wallet.png">
      </cell>
      <grid>
        <grid-item link="/mine/wallet/balance" label="余额">
          <img  slot="icon" src="../../assets/images/balance.png">
          <span style="color:#F5C25F;" slot="label">余额({{balance}})</span>
        </grid-item>
        <grid-item link="/mine/wallet/integral" >
          <img slot="icon" src="../../assets/images/integral.png">
          <span style="color:#EB62FF;" slot="label">积分({{integral}})</span>
        </grid-item>
        <grid-item link="/mine/wallet/recharge">
          <img slot="icon" src="../../assets/images/recharge.png">
          <span style="color:#49E8C1;" slot="label">充值</span>
        </grid-item>
        <grid-item >
        </grid-item>
      </grid>
    </group>
    <group>
      <cell title="我的评价" is-link link="/video/buy">
        <img slot="icon" width="26" style="display:block;margin-right:5px;" src="../../assets/images/evaluate.png">
      </cell>
      <cell title="收货地址" is-link v-on:click.native="address">
        <img slot="icon" width="26" style="display:block;margin-right:5px;" src="../../assets/images/address.png">
      </cell>
      <cell title="密码设置" is-link link="/video/pay">
        <img slot="icon" width="26" style="display:block;margin-right:5px;" src="../../assets/images/password.png">
      </cell>
      <cell title="关于我们" is-link link="/mine/about/index">
        <img slot="icon" width="26" style="display:block;margin-right:5px;" src="../../assets/images/about.png">
      </cell>
      <cell title="发票" is-link>
        <img slot="icon" width="26" style="display:block;margin-right:5px;" src="../../assets/images/receipt.png">
      </cell>
    </group>
    </view-box>
  </div>
</template>
<style>
  .weui-grid:after{
    border-bottom:0px!important;
  }
  .weui-grid:before{
    border-right:0px!important;
  }
  .weui-grids:after{
    border-left:0px!important;
  }
  .weui-grid__icon{
    width: 18px!important;
    height: 18px!important;
  }
  .weui-grid__label{
    font-size: 10px!important;
  }
  .weui-cells{
    font-size: 14px!important;
    margin-top: 0em!important;
  }
  .userinfo{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .userinfo img{
    border-radius: 50%;
  }
  .userinfo .name{
    font-size: 14px;
    color: #333;
  }

  .name img {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    vertical-align: middle;
    margin-left: 5px;
    margin-top: 5px;
  }


  .leave {
    color: #da251c;
    font-size: 8px;
  }

</style>
<script>
  import { Divider, Card ,Group, Cell, CellBox,Grid, GridItem} from 'vux'
  import XImg from "vux/src/components/x-img/index";
  import ViewBox from "vux/src/components/view-box/index";
  import man_img from '../../assets/images/man.png'
  import woman_img from '../../assets/images/woman.png'
  export default {
    data(){
      return {
        balance:0,
        integral:0,
        sex_img:woman_img
      }
    },
    components: {
      ViewBox,
      XImg,
      Card,
      Divider,
      Group,
      Cell,
      CellBox,
      Grid,
      GridItem
    },
    mounted(){
      if (this.wxinfo.user.sexId == 1){
        this.sex_img = man_img
      }
      this.walletInfo()
    },
    methods:{
      walletInfo:function () {
        this.$http.post(this.common.SERVER_URL + "api/member/credits/residue?openid=" + this.wxinfo.user.unionId)
          .then(function (res) {
            console.log("credits",res)
            this.integral = res.data.credits
          })
        this.$http.post(this.common.SERVER_URL + "api/member/balance/residue?openid=" + this.wxinfo.user.unionId)
          .then(function (res) {
            this.balance = res.data.balance
          })
      },
      address:function () {
        this.$wechat.openAddress({
          success: function (res) {
            console.log("address:",res)
          },
          cancel: function (res) {
            // 用户取消拉出地址
          }
        });
      },
      pay:function () {

      }
    }
  }
</script>

<style scoped lang="less">
  @import '~vux/src/styles/1px.less';

</style>
