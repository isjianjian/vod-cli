<template>
  <div style="height:100%;background: #fff;">
    <!--<actionsheet v-model="otypeshow" :menus="otypemenus" @on-click-menu="otype" show-cancel></actionsheet>-->
    <view-box ref="viewBox">
      <div class="userinfo">
        <div class="h_img"><img width="68" height="68" :src="this.wxinfo.user.headImgUrl"></div>
        <div class="name"><span>{{this.wxinfo.user.nickname}}</span><img :src="sex_img"/></div>
        <div class="leave">{{this.wxinfo.user.level}}</div>
      </div>
      <group>
        <cell title="我的订单" is-link @click.native="showtype(0)">
          <img slot="icon" width="26" style="display:block;margin-right:5px;" src="../../assets/images/order.png">
        </cell>
        <grid>
          <grid-item @click.native="showtype(1)" label="余额">
            <img slot="icon" src="../../assets/images/obligation.png">
            <span style="color:#8DE93A;" slot="label">待付款</span>
          </grid-item>
          <grid-item @click.native="showtype(3)">
            <img slot="icon" src="../../assets/images/dis_evaluate.png">
            <span style="color:#F9D48E;" slot="label">待评价</span>
          </grid-item>
          <grid-item @click.native="showtype(2)">
            <img slot="icon" src="../../assets/images/completed.png">
            <span style="color:#FF5555;" slot="label">已完成</span>
          </grid-item>
          <grid-item @click.native="showtype(4)">
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
            <img slot="icon" src="../../assets/images/balance.png">
            <span style="color:#F5C25F;" slot="label">余额({{balance}})</span>
          </grid-item>
          <grid-item link="/mine/wallet/integral">
            <img slot="icon" src="../../assets/images/integral.png">
            <span style="color:#EB62FF;" slot="label">积分({{integral}})</span>
          </grid-item>
          <grid-item link="/mine/wallet/recharge">
            <img slot="icon" src="../../assets/images/recharge.png">
            <span style="color:#49E8C1;" slot="label">充值</span>
          </grid-item>
          <grid-item>
          </grid-item>
        </grid>
      </group>
      <group>
        <cell title="我的评价" is-link link="/mine/about/agree">
          <img slot="icon" width="26" style="display:block;margin-right:5px;" src="../../assets/images/evaluate.png">
        </cell>
        <cell title="收货地址" is-link v-on:click.native="address">
          <img slot="icon" width="26" style="display:block;margin-right:5px;" src="../../assets/images/address.png">
        </cell>
        <cell title="绑定手机" is-link link="/mine/phone">
          <img slot="icon" width="26" style="display:block;margin-right:5px;" src="../../assets/images/password.png">
        </cell>
        <cell title="关于我们" is-link link="/mine/about/index">
          <img slot="icon" width="26" style="display:block;margin-right:5px;" src="../../assets/images/about.png">
        </cell>
        <cell title="发票" is-link link="/mine/about/agree">
          <img slot="icon" width="26" style="display:block;margin-right:5px;" src="../../assets/images/receipt.png">
        </cell>
        <!--<cell title="测试" is-link link="/video/otherbuy?hour=1&type=2">-->
          <!--<img slot="icon" width="26" style="display:block;margin-right:5px;" src="../../assets/images/receipt.png">-->
        <!--</cell>-->

      </group>
      <div v-transfer-dom>
        <x-dialog v-model="otypeshow" class="dialog-demo" hide-on-blur>
          <div style="padding-top:5px; padding-bottom:5px;">选择订单类型</div>
          <grid>
            <grid-item @click.native="otype(1)">
              <img style="" slot="icon" src="../../assets/images/vod_order.png">
              <span style="color: #EF0000" slot="label">娱乐</span>
            </grid-item>
            <grid-item @click.native="otype(2)">
              <img style="" slot="icon" src="../../assets/images/room_order.png">
              <span style="color: #7ED479" slot="label">订房</span>
            </grid-item>
            <grid-item @click.native="otype(3)">
              <img style=""  slot="icon" src="../../assets/images/shop_order_no.png">
              <span style="color: #CECECE" slot="label">商城</span>
            </grid-item>
          </grid>
        </x-dialog>
      </div>
    </view-box>
  </div>
</template>
<style>
  .weui-grid:after {
    border-bottom: 0px !important;
  }

  .weui-grid:before {
    border-right: 0px !important;
  }

  .weui-grids:after {
    border-left: 0px !important;
  }

  .weui-grid__icon {
    width: 22px !important;
    height: 21px !important;
  }

  .weui-grid__label {
    font-size: 12px !important;
  }

  .weui-cells {
    font-size: 14px !important;
    margin-top: 0em !important;
  }

  .userinfo {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .userinfo img {
    border-radius: 50%;
  }

  .userinfo .name {
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
  import md5 from 'js-md5';

  let Base64 = require('js-base64').Base64;
  import {Divider, Card, Group, Cell, CellBox, Grid, GridItem, Actionsheet,XDialog,TransferDomDirective as TransferDom} from 'vux'
  import XImg from "vux/src/components/x-img/index";
  import ViewBox from "vux/src/components/view-box/index";
  import man_img from '../../assets/images/man.png'
  import woman_img from '../../assets/images/woman.png'

  export default {
    directives: {
      TransferDom
    },
    data() {
      return {
        url: "http://1.dev-reservation.ffun360.com/site_admin/order_entrance?",
        typeindex: 0,
        otypeshow: false,
        otypemenus: {
          menu1: "娱乐",
          menu2: "订房"
        },
        balance: 0,
        integral: 0,
        sex_img: woman_img
      }
    },
    components: {
      XDialog,
      ViewBox,
      XImg,
      Card,
      Divider,
      Group,
      Cell,
      CellBox,
      Grid,
      GridItem,
      Actionsheet
    },
    mounted() {
      if (this.wxinfo.user.sexId == 1) {
        this.sex_img = man_img
      }
      this.walletInfo()
    },
    methods: {
      showtype(res) {

        this.typeindex = res
        if (res == 4){
          this.otype(2)
          return
        }
        this.otypeshow = !this.otypeshow
      },
      otype(index) {
        if (index == 1) {
          this.$router.push("/mine/order?i=" + this.typeindex)
        } else if (index == 2) {
          this.toroomlink()
        }
      },
      walletInfo: function () {
        var that = this;
        this.api_post("api/member/credits/residue", function (res) {
          console.log("credits", res);
          that.integral = res.credits
        });


        this.api_post("api/member/balance/residue", function (res) {
          console.log("credits", res);
          that.balance = res.balance
        })

      },
      address: function () {
        this.$wechat.openAddress({
          success: function (res) {
            console.log("address:", res)
          },
          cancel: function (res) {
            // 用户取消拉出地址
          }
        });
      },
      pay: function () {

      }, toroomlink() {
        var that = this
        var user = this.wxinfo.user
        var time = Math.round(new Date().getTime() / 1000);
        var order_state = 100
        switch (this.typeindex) {
          case 0://全部
            order_state = 100
            break;
          case 1://待付款
            order_state = 101
            break;
          case 2://已完成
            order_state = 103
            break;
          case 3://待使用
            order_state = 102
            break;
          case 4: //退款
            order_state = 104
            break;
        }

        var eidtionTypeList = [
          {key: "come_from", val: "1"},
          {key: "t", val: time},
          {key: "openid", val: user.openId},
          {key: "order_state", val: order_state},
          {key: "yxtoken", val: that.common.TOKEN.token},
        ];

        eidtionTypeList.sort(function (a, b) {
          return a.key > b.key;
        });

        console.log(eidtionTypeList[0].key + "" + eidtionTypeList[0].val);

        var s = ""
        for (var i = 0; i < eidtionTypeList.length; i++) {
          s += eidtionTypeList[i].key + "" + eidtionTypeList[i].val
        }
        s = "8cff406dd2e5897bf0581723e95fe246" + s + "8cff406dd2e5897bf0581723e95fe246";
        console.log(s);
        var token = md5(s)

        this.url = this.url + "come_from=1" + "&t=" + time + "&openid=" + user.openId + "&order_state=" + order_state +
          "&token=" + token + "&yxtoken=" + this.common.TOKEN.token;

        location.href = this.url
      }

    }
  }
</script>

<style scoped lang="less">
  @import '~vux/src/styles/1px.less';

</style>
