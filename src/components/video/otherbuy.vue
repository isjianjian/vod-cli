<template>
  <div>
    <group title="包时">
      <cell :title="desc" :inline-desc="'费用: ￥' + price">
        <img slot="icon" width="44" height="56" style="display:block;margin-right:10px;" src=""/>
      </cell>
      <cell v-if="preorder.discounts" title="优惠观看">
        <img slot="icon" width="20" style="display:block;" :src="youhui"/>
        <div>
          <span style="color: red">-￥{{preorder.discounts_amount}}</span>
        </div>
      </cell>
      <!--<x-switch v-model="use_credit" @on-change="use_credits" :title="'<span >积分抵扣</span>&nbsp;<span style=\'color:red;\'>' +-->
      <!--'  -￥'+ preorder.can_use_credits/preorder.credits_ratio+'</span>'"-->
      <!--:inline-desc="'使用积分抵扣现金,将消耗 ' + preorder.can_use_credits +' 积分' "-->
      <!--prevent-default @on-click="dis"></x-switch>-->
    </group>
    <group>
      <x-number :min="0" :max="preorder.credits<preorder.can_use_credits?preorder.credits:preorder.can_use_credits"
                title="积分抵扣" fillable @on-change="changecredit"></x-number>
    </group>
    <flexbox class="buybar">
      <flexbox-item :span="4">
        <div style="text-align: center;">已优惠 ￥{{discounts}}</div>
      </flexbox-item>
      <flexbox-item :span="4">
        <div style="text-align: right; font-size: 16px;">合计 ￥{{total}}</div>
      </flexbox-item>
      <flexbox-item>
        <div v-on:click='order' class="buybutton">提交订单</div>
      </flexbox-item>
    </flexbox>
    <div v-transfer-dom>

      <popup v-model="pay_done" height="40%">
        <div>
          <form-preview header-label="金额" :header-value="'￥' + oldOrder.total || 0 " :body-items="oldOrderItem"
                        :footer-buttons="buttons1"></form-preview>
        </div>
      </popup>
    </div>

  </div>
</template>

<script>
  import Group from "vux/src/components/group/index";
  import XNumber from "vux/src/components/x-number/index";
  import Cell from "vux/src/components/cell/index";
  import XSwitch from "vux/src/components/x-switch/index";
  import youhui from "../../assets/images/youhui.png"
  import Flexbox from "vux/src/components/flexbox/flexbox";
  import FlexboxItem from "vux/src/components/flexbox/flexbox-item";
  import FormPreview from "vux/src/components/form-preview/index";
  import Popup from "vux/src/components/popup/index";
  import {TransferDom} from 'vux'
  import JQ from 'jquery';

  export default {
    directives: {
      TransferDom
    },
    components: {
      Popup,
      FormPreview,
      FlexboxItem,
      Flexbox,
      XSwitch,
      Cell,
      Group,
      JQ,
      XNumber,
    },
    name: "buy",
    mounted() {
      var that = this;
      var type = this.$router.currentRoute.query.type;
      var hour = this.$router.currentRoute.query.hour;

      that.type = type
      that.hour = hour
      switch (type) {
        case '2':
          that.desc = "直播";
          break;
        case '3':
          that.desc = "KTV";
          break;
        case '4':
          that.desc = "音乐";
          break;
        case '5':
          that.desc = "游戏";
          break;
      }
      console.log("desc--", that.desc)
      console.log("type---", type)

      that.desc += hour + "小时"
      var url = 'api/other/preorder?hour=' + that.hour + "&sType=" + type;   //根据资源类型获取预下单信息

      that.api_post(url, function (res) {
        console.log("sssssssssssssssss", res);
        that.preorder = res.data;
        that.price = res.data.price;
        that.total = res.data.price;

      }, function (res) {
        if (res.code == 202) {
          that.$vux.toast.show("未绑定手机号");

          setTimeout(function () {
            that.$router.push("/mine/phone")
          }, 1500)

        } else {
          that.$vux.toast.text(res.msg, "center")
        }
      })


    },
    data() {
      return {
        desc: '',
        type: 2,
        hour: 1,
        youhui: youhui,
        preorder: {},
        discounts: 0,
        total: 0,
        price: 0,
        use_credit: false,
        oldOrder: {},
        oldOrderItem: [],
        buttons1: [{
          style: 'default',
          text: '取消订单',
          onButtonClick: (name) => {
            this.toCancel()
          }
        }, {
          style: 'primary',
          text: "去支付",
          onButtonClick: (name) => {
            var data = this.oldOrder;
            var query = {
              id: data.id,
              body: data.body,
              total: data.total,
              timeExpire: data.timeExpire,
              cmid: data.comdId
            };
            this.$router.replace({path: '/video/pay', query: query})
          }
        }],
        pay_done: false,
        endcredits: 0,

      }
    },
    beforeRouteLeave(to, from, next) {
      var router = this.$router;
      if (router.app.his.from == to.path &&
        router.app.his.to == from.path && new Date().getTime() - router.app.his.time < 200) {
        console.log("拒绝返回", from.path);
        next(false)
      } else {
        next()
      }
    }
    ,
    methods: {
      order: function () {
        var that = this;
        console.log('提交订单');
        var url = 'api/vod/order?sid=' + that.hour + "&sType=" + that.type + '&credits=' + this.endcredits;

        // if (this.use_credit) {
        //   url += '&credits=' + this.preorder.can_use_credits
        // } else {
        //   url += '&credits=' + 0
        // }
        this.api_post(url, function (res) {
            console.log(res);
            var data = res.data;
            var query = {
              id: data.id,
              body: data.body,
              total: data.total,
              timeExpire: data.timeExpire,
              cmid: data.comdId
            };
            that.$router.replace({path: '/video/pay', query: query})

          },
          function (res) {
            if (res.code == 100) {
              that.$vux.confirm.show({
                confirmText: "扫描二维码",
                title: "未认证设备",
                content: "购买影片时需扫描你所在酒店播放/设备显示的二维码",
                onCancel() {
                },
                onConfirm() {
                  that.QRcode()
                }
              })

            }
            if (res.code == 202) {
              var data = that.oldOrder = res.data;
              that.$vux.confirm.show({
                confirmText: "查看详情",
                title: "请勿重复下单",
                content: "你有一份未支付的订单",
                onCancel() {
                },
                onConfirm() {
                  var list = [];
                  list.push({label: '内容', value: data.body});
                  list.push({label: '流水号', value: data.id});
                  list.push({label: '下单时间', value: data.timeStart});
                  list.push({label: '失效时间', value: data.timeExpire});
                  that.oldOrderItem = list;
                  that.pay_done = true
                }
              })
            }
            if (res.code == 500) {
              that.$vux.toast.text(res.msg, 'center')
            }
          }
        )
      }, dis(newVal, oldVal) {
        // alert("可用积分"+ this.preorder.can_use_credits)
        // alert("可抵积分"+ this.preorder.credits)
        // if (this.preorder.credits < this.preorder.can_use_credits) {
        if (this.preorder.credits < this.preorder.can_use_credits) {
          console.log(newVal, oldVal);
          this.$vux.toast.text("积分不足", 'center');
          return
          // this.use_credit = false
        }
        this.use_credit = !this.use_credit
      }, changecredit(res) {
        this.endcredits = res
        this.total = (this.preorder.price - res / this.preorder.credits_ratio).toFixed(2);
        this.discounts = res / this.preorder.credits_ratio
      },

      use_credits: function (res) {

        if (res) {
          this.total -= this.preorder.can_use_credits / this.preorder.credits_ratio;
          this.discounts += this.preorder.can_use_credits / this.preorder.credits_ratio
        } else {
          this.total += this.preorder.can_use_credits / this.preorder.credits_ratio;
          this.discounts -= this.preorder.can_use_credits / this.preorder.credits_ratio
        }
      },
      toCancel: function (res) {
        var that = this;
        this.$vux.confirm.show({
          title: '取消订单?',
          content: '',
          onConfirm() {
            that.cancleorder(that.oldOrder.id);
          }
        })

      },
      cancleorder(billid) {
        this.$vux.loading.show({
          text: 'Loading'
        });
        var that = this;
        var url = that.common.SERVER_URL + "api/mp/canorder?billid=" + billid + "&openid=" + this.wxinfo.user.openId
          + "&token=" + this.common.TOKEN.token + "&tokenType=1";
        this.$http.post(url).then(function (res) {
          console.log(res.data.code);
          if (res.data.code == '0') {
            that.pay_done = false;
            this.$vux.toast.text("取消成功", 'center')
          } else {
            this.$vux.toast.text(res.data.msg, 'center')
          }
          this.$vux.loading.hide()
        }, function () {
          this.$vux.loading.hide()
        })

      }

    }
  }
</script>

<style scoped>
  .buybar {
    position: fixed;
    bottom: 0px;
    background: #6E6E6E;
    height: 48px;
    line-height: 48px;
    color: white;
    font-size: 14px;
  }

  .buybutton {
    background-color: #17ac66;
    text-align: center;
    border-radius: 2px;
    font-weight: 600;
  }

  .buybutton:active {
    background-color: #60ac6f;
  }
</style>
