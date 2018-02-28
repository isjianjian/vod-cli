<template>
  <div style="text-align: center">
    <div v-if="state == 1" style=" background: #FDFD13;font-size: 10px;color: #B8860B;text-shadow:1px 1px 1px #FAFAD2;
      padding-top: 10px;padding-bottom: 10px;">
      恭喜你!!! 获得好友赠送的影片 <span style="font-size: 14px;color:#FD2A13"> {{movie.name}} </span> 的优惠观看资格
    </div>
    <div v-if="state == 402" style=" background: #FDFD13;font-size: 10px;color: #B8860B;text-shadow:1px 1px 1px #FAFAD2;
      padding-top: 10px;padding-bottom: 10px;">
      你已拥有优惠,不能重复获取哦
    </div>
    <div v-if="state != 402 && state != 1 " style=" background: #FDFD13;font-size: 10px;color: #B8860B;text-shadow:1px 1px 1px #FAFAD2;
      padding-top: 10px;padding-bottom: 10px;">
      该优惠已失效
    </div>
    <div style="margin-top: 80px;" class="weui-cells weui-cells_after-title">
      <div class="weui-cell">
        <div class="weui-cell__hd">
          <img slot="icon" :src="movie.pic" style="margin-left: 110px;vertical-align: middle;"></img>
        </div>
        <div class="weui-cell__bd">
          <div class="weui-flex bd_title">
            <div class="weui-flex__item left">
            </div>
            <div class="weui-flex__item right">
              <img src="../../assets/images/friend.gif" style="width: 120px;"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-for="">
      <cell></cell>
    </div>
    <div v-if="state == 1" class="buy" v-on:click="buy">
      <span><span style="font-weight: 600;font-size: 21px;">{{account.giftseemoney}}</span>元观看</span>
      <img src="../../assets/images/watch.png" style="width: 20px;margin-left:5px;position: relative;top:4px;"/>
    </div>
    <div v-if="state == 402 || state == 401 || state == 400" class="hotel" style="background-color: #3f9de7"
         v-on:click="hotel">
      <span>附近的酒店</span>
    </div>
    <div v-if="state == 402 || state == 401 || state == 400" class="buy" style="background-color: #3f9de7"
         v-on:click="detail">
      <span>查看详情</span>
    </div>

  </div>
</template>

<script>
  import {Divider, Card} from 'vux'
  import Cell from "vux/src/components/cell/index";

  export default {
    name: "act",
    components: {
      Cell,
      Card,
      Divider
    },
    mounted() {


      var that = this;
      this.sid = this.$router.currentRoute.query.sid;
      this.tsid = this.$router.currentRoute.query.openid;
      var url = "api/tuisong/add?sid=" + this.sid + "&tsid=" + this.tsid;
      alert(this.tsid)
      this.api_post(url, function (res) {
        alert(res.code)
        console.log(res);
        that.account = res.data;
        that.state = 1;
      }, function (res) {  alert(res.code)
        that.state = res.code
      });
      this.api_post("api/vod/" + this.sid, function (res) {
        that.movie = res.data
      });

      that.hotellist();
    },
    data() {
      return {
        sid: 0,
        tsid: '',
        movie: {},
        account: {},
        state: 0,
        hotel_list: {},
      }
    },
    methods: {
      buy: function () {
        this.$router.replace('/video/buy?id=' + this.sid)
      }, hotel() {
        this.$router.push('/video/hotel')
      },
      detail: function () {
        this.$router.replace('/detail?id=' + this.sid)
      }
    }

  }
</script>

<style scoped lang="less">

  .weui-cells_after-title {
    margin-top: 0;
  }

  .weui-cells {
    position: relative;
    background-color: #FFFFFF;
    line-height: 1.41176471;
    font-size: 17px;
    background-size: 100%;
    height: 100%;
    background: #FBF9FE;
  }

  view {
    display: block;

  }

  .hotel {
    position: absolute;
    display: block;
    width: 100%;
    bottom: 70px;
    background: red;
    color: #FDFD13;
    text-align: center;
    font-size: 15px;
    font-weight: 500;
    line-height: 20px;
    padding: 6px 0;
    border-radius: 10px;
    /*background-image: url("../../assets/images/buy_n.png");*/
  }

  .hotel:active {
    background-image: url("../../assets/images/detail_bg.png");
  }

  .buy {
    position: absolute;
    display: block;
    width: 100%;
    bottom: 30px;
    background: red;
    color: #FDFD13;
    text-align: center;
    font-size: 15px;
    font-weight: 500;
    line-height: 20px;
    padding: 6px 0;
    border-radius: 10px;
    /*background-image: url("../../assets/images/buy_n.png");*/
  }

  .buy:active {
    background-image: url("../../assets/images/detail_bg.png");
  }

  .weui-cells::after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    color: #D9D9D9;

  }

  .weui-cells::before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    color: #D9D9D9;

  }

  .weui-cell {
    padding: 10px 15px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;

  }

  view {
    display: block;
  }

  .weui-cell:first-child::before {
    display: none;
  }

  .weui-cell::before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    left: 15px;

  }

  .weui-cell__bd {
    margin-left: 10px;

  }

  .weui-cell__bd {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
  }

  .weui-flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
  }

  .weui-flex__item {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
  }

  .weui-cell__hd, .weui-cell__hd img {
    width: 120px;

  }

  .weui-cell__bd {
    margin-left: 10px;
  }

  .left {
    align-items: left;
    text-align: left;
  }

  .right {
    align-items: right;
    text-align: right;
  }

  .bd_title {
    font-size: 10px;
    color: #B6B6B6;
  }

  .bd_title .right {
    color: #75B8EC;
  }

  html, body {
    height: 100%
  }

</style>
