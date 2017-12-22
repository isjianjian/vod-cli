<template>

  <div>
    <checker v-model="demo1" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
      <checker-item chec value="1" style="width: 100%;" :key="0">潘</checker-item>
    </checker>


    <div class="buy" v-on:click="buy">
     立即购买
    </div>
  </div>
</template>


<script>
  import Checker from "vux/src/components/checker/checker";
  import CheckerItem from "vux/src/components/checker/checker-item";

  export default {
    components: {
      CheckerItem,
      Checker, },
    name: "buy",
    data() {
      return {
        commonList: ['积分抵扣：'],

        credits: 0,
        willbuy: {},
        usecredits: '&credits=0',
        ischeck: false,
      }
    }, mounted() {
      this.willbuy()
    }, methods: {
      willbuy() {

        console.log("预下单", this.common.SERVER_URL + "api/vod/preorder?openid=" + this.wxinfo.user.unionId + "&sid=" + this.current.vid)
        this.$http.post(this.common.SERVER_URL + "api/vod/preorder?openid=" + this.wxinfo.user.unionId + "&sid=" + this.current.vid).then(function (res) {
          console.log("预下单:", res)
          if (res.data.code == '0') {

            this.willbuy = res.data,
              this.credits = res.data.data.can_use_credits

          } else {

          }
        })

      }, usecredits(res) {

        if (!this.ischeck) {

          this.usecredits = "&credits=" + that.data.credits,
            this.ischeck = true

        } else {
          tthis.usecredits = "&credits=0",
            this.ischeck = false

        }

      }, buy(res) {
        // var that = this
        // console.log("下单", app.data.ip + "vod/order?openid=" + app.data.openid + "&sid=" + app.data.video.id + that.data.usecredits)
        // wx.request({
        //   url: app.data.ip + "vod/order?openid=" + app.data.openid + "&sid=" + app.data.video.id + that.data.usecredits,
        //   method: 'post',
        //   success: function (res) {
        //     console.log("下单:", res)
        //     if (res.data.code == '0') {
        //       that.topay(res.data.data)
        //     } else if (res.data.code == '202') {
        //       var r = res;
        //       wx.showModal({
        //         title: '您有未支付的订单',
        //         cancelText: '取消订单',
        //         confirmText: '去支付',
        //         success: function (res) {
        //           console.log("确认&取消订单", res)
        //           if (res.confirm) {
        //             that.topay(r.data.data)
        //           } else if (res.cancel) {
        //             that.cancleorder(r.data.data.id);
        //           } else {
        //             wx.navigateBack({})
        //           }
        //         }
        //       })
        //     }
        //     else if (res.data.code == '100') {
        //       wx.showToast({
        //         title: '扫描房间二维码',
        //         success: function (res) {
        //           app.getscanCode();
        //         }
        //       })
        //     } else {
        //       wx.showToast({
        //         title: res.data.msg,
        //       })
        //     }
        //   }
        // })
      }, cancleorder(res) {
        // var that = this;
        // console.log("取消订单", app.data.ip + "canorder?billid=" + res)
        // wx.request({
        //   url: app.data.ip + "canorder?billid=" + res,
        //   method: 'post',
        //   success: function (res) {
        //     console.log("取消订单", res)
        //     wx.showToast({
        //       title: res.data.msg,
        //       success: function () {
        //         setTimeout(function () {
        //
        //         }, 1000)
        //       }
        //     })
        //   }
        // })

      }, topay(res) {
        // wx.redirectTo({
        //   url: "../pay/pay?billid=" + res.id + "&body=" + res.body + "&total=" + res.total + "&timeExpire=" + res.timeExpire,
        // })
      }
    }
  }
</script>

<style scoped>
  .demo1-item-selected {
    border: 1px solid green;
  }
  /*.demo5-item {*/
    /*width: 100px;*/
    /*height: 26px;*/
    /*line-height: 26px;*/
    /*text-align: center;*/
    /*border-radius: 3px;*/
    /*border: 1px solid #ccc;*/
    /*background-color: #fff;*/
    /*margin-right: 6px;*/
  /*}*/
  /*.demo5-item-selected {*/
    /*background: #ffffff url(../assets/demo/checker/active.png) no-repeat right bottom;*/
    /*border-color: #ff4a00;*/
  /*}*/

  .buy {
    position: absolute;
    width: 100%;
    bottom: 0;
    background: red;
    color: #fff;
    text-align: center;
    padding: 10px 0;
    /*background-image: url("../../assets/images/buy_n.png");*/
  }

  .buy:active {
    /*background: #3f9de7;*/
    /*background-image: url("../../assets/images/buy_p.png");*/
  }
</style>
