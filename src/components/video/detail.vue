<template>
  <view-box v-bind:style="windowHeight">
    <div style="background: rgba(0,0,0,0.5);">
      <div>
        <img class="top-bg" v-bind:style="'background-image: url('+list.pic+');'"/>
        <img class="top-bg2"/>
        <img class="top-bg3"/>
        <img class="top-bg4"/>

      </div>
      <div class="top">
        <img v-bind:src="list.pic"></img>
        <div class="info">
          <div style="width: 60vw;">
            <span class="name">{{list.name}}</span>
            <span hidden="true" class="year"> ({{list.year}})</span>
          </div>
          <div style="width: 60vw;"> {{list.year}}</div>
          <div style="width: 60vw;"> {{list.length}}</div>
          <div style="width: 60vw;"> 导演: {{list.director}}</div>
          <div style="width: 55vw;"> 演员: {{list.act}}</div>
          <div style="width: 60vw;"> {{list.language}}</div>

          <div class="price-bottom">
            <div class="playAmount">播放量: {{list.playAmount}}</div>
            <div class="price">点播收费: ￥{{list.price}}</div>
          </div>
        </div>
      </div>
      <div class="desc">
        {{list.descript}}
      </div>
      <div v-bind:class="btn_style==0?'buy':btn_style==1?'buy':'play'" v-on:click="buy(list)">
        {{btn_style==0?'购买':btn_style==1?'购买':'播放'}}
      </div>
      <div @click="ctrl">
        <img v-if="paid" class="pause" src="../../assets/images/cl_pause.png"/>
      </div>
      <div v-if="!show_share && paid" @click="show_share = true" class="flow">
        <img src="../../assets/images/flow.png"/>
      </div>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="show_share" hide-on-blur
                :dialog-style="{'max-width': '100%', width: '100%', height: '90%', 'background-color': 'transparent'}">
        <div style="color:#fff; height:100%;" @click="show_share = false">
          <div style="margin-left: 120px">
            <img src="../../assets/images/point.png"/>
          </div>
          <div style="text-align: center;font-size: 20px;color: #D1D0CE;">
            好东西就要一起分享
          </div>
          <div style="text-indent:2em;font-size: 14px;text-align: left; margin-top: 20px;color: #3F9DE7;">
            已购买的影片发送给好友，Ta只需支付<span style="color: red">{{account.giftseemoney}}</span>元即可获取本片(限新用户)，并且您也能得到一定积分哦
          </div>
        </div>
      </x-dialog>
      <actionsheet v-model="show1" :menus="menus1" @on-click-menu="menud"></actionsheet>
    </div>
  </view-box>

</template>

<script>
  import Actionsheet from "vux/src/components/actionsheet/index";

  var that
  import ViewBox from "vux/src/components/view-box/index";
  import {XDialog, TransferDomDirective as TransferDom} from 'vux'
  import JQ from 'jquery';

  export default {
    directives: {
      TransferDom
    },
    name: "detail",
    components: {
      Actionsheet,
      XDialog,
      ViewBox,
      JQ
    },
    data() {
      return {
        windowHeight: '',
        list: '',
        show_share: false,
        account: {},
        id: 0,
        btn_style: 0,
        paid: false,
        show1: false,
        menus1: {
          d2: '2D 播放',
          d3: '3D 播放'
        },
      }
    },
    mounted(res) {
      that = this
      that.windowHeight = "height: " + window.innerHeight + "px;background: #ececec;";
      var vid = 0;
      // console.log("获取影片详情", that.$router.currentRoute.query)
      // alert(that.$router.currentRoute.query.id)
      if (that.$router.currentRoute.query.id != null) {
        vid = that.$router.currentRoute.query.id;
      } else {
        vid = that.current.vid
      }
      that.ispay(vid)
      that.getlib_id(vid);//获取影片


      that.api_post("api/account", function (res) {
        // console.log("---------------", res)
        that.account = res.data
      })

      var basdUel = window.location.href.substring(0, window.location.href.indexOf("#"));
      var link = basdUel + "#/act?openid=" + that.wxinfo.user.openId + "&sid=" + vid
      // console.log("link", link)
      that.$wechat.onMenuShareAppMessage({
        title: '好友赠送你一部影片', // 分享标题
        desc: '好友赠送你一部影片', // 分享描述
        link: link, // 分享链接
        imgUrl: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1040759678,2647214604&fm=58', // 分享图标
        success: function () {
          that.show_share = false
          that.$vux.toast.text('分享成功！', 'center')
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      });


    }, methods: {
      ispay(vid) {
        var url = "api/vod/vi?sid=" + vid;
        that.api_post(url, function (res) {
          // console.log(res)
          that.paid = res.data
          if (!that.paid) {
            that.btn_style = 1;
          } else {
            that.btn_style = 2;
          }
        })
      },
      getlib_id(id) {
        var url = that.HOTEL_URL_DAOQI + "/if/movie_path.php?uid=" + id + "" +
          "&type=134&sn=" + that.sn + "&cloud=&pid=&idx=1&output=1";

        // console.log("111111111111111111", url)
        that.$http.get(url).then(function (res) {
            // console.log("111111111111111111",res)

            var styles = JQ(res.bodyText.replace(/param/g, "p")).find("seg[id='program_info']");

            JQ(styles).each(function (i, e) {
              // console.log("e", e)
              that.id = JQ(e).find("[name='pid']").html()
            })

            that.getdetail();
          }
        )
      },
      getdetail() {
        var url = that.HOTEL_URL_DAOQI + "/if/movie_detail.php?id=" + that.id;
        // console.log("111111111111111111", url)
        that.$http.get(url).then(function (res) {
            // console.log("111111111111111111",res)

            var styles = JQ(res.bodyText.replace(/param/g, "p")).find("seg[id='movie_detail']");
            var listtmp = []
            JQ(styles).each(function (i, e) {
              // console.log("e", e)
              var el = {}

              el.id = JQ(e).find("[name='id']").html()
              el.lib_id = JQ(e).find("[name='lib_id']").html()
              el.pic = JQ(e).find("[name='org_poster']").html()
              el.name = JQ(e).find("[name='name']").html()
              el.year = JQ(e).find("[name='year']").html()
              el.cName = JQ(e).find("[name='name']").html()
              el.length = JQ(e).find("[name='alias']").html()
              el.director = JQ(e).find("[name='director']").html()
              el.act = JQ(e).find("[name='actor']").html()
              el.language = JQ(e).find("[name='dimension']").html()
              el.dimension = JQ(e).find("[name='dimension']").html()
              el.playAmount = '0'
              el.price = JQ(e).find("[name='price']").html()
              el.descript = JQ(e).find("[name='intro']").html()

              listtmp.push(el)
            })
            that.list = listtmp[0]
            // console.log("--------------", that.list)
          }
        )
      },
      buy(list) {
        if (that.paid) {
          // 播放
          if (that.list.dimension == "2D") {
            that.Play(that.list.lib_id, 1);
          } else {
            that.show1 = true
          }
        } else {
          // 购买
          that.$router.push({path: '/video/buy', query: {id: list.lib_id, pid: list.id}})
        }
      }, ctrl() {
        that.$router.push("/video/daoqictrl?restype=1")
      }, menud(res) {
        var dimensions = "2d";
        if (res == "d2") {
          dimensions = "1"
        } else if (res == "d3") {
          dimensions = "2"
        } else if (res == "蓝光") {
          dimensions = "3"
        }
        this.common.playvideo = this.list

        that.Play(that.list.lib_id, dimensions, this.list);
      }
    }
  }
</script>

<style scoped>
  .top {

    margin: 20px 15px;
    display: flex;
    position: relative;
  }

  .top-bg {
    margin-top: -20px;
    width: 100%;
    height: 200px;
    background-repeat: no-repeat;
    background-size: 120%;
    position: absolute;
    /*z-index: -2;*/
    opacity: 1;
    filter: blur(21px);
  }

  .top-bg2 {
    margin-top: -20px;
    width: 100%;
    height: 200px;
    background-repeat: no-repeat;
    position: absolute;
    z-index: -3;
    background-image: url("../../assets/images/detail_bg.png");
  }

  .top-bg3 {
    margin-top: -20px;
    width: 100%;
    height: 200px;
    background-repeat: no-repeat;
    position: absolute;
    z-index: -4;
    opacity: 1;
    background-image: url("../../assets/images/detail_bg.png");
  }

  .top-bg4 {
    margin-top: -20px;
    width: 100%;
    height: 200px;
    background-repeat: no-repeat;
    position: absolute;
    z-index: -5;
    opacity: 1;
    background-image: url("../../assets/images/detail_bg.png");
  }

  .top img {
    width: 106px;
    height: 150px;
    margin-right: 10px;
  }

  .name {
    color: #fff;
    font-size: 16px;
    line-height: 16px;
    height: 16px;
    width: auto;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .year {
    color: #fff;
    font-size: 13px;
    line-height: 13px;
    height: 13px;
    width: auto;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .info {
    width: 100%;
    height: 150px;
  }

  .info div {
    font-size: 13px;
    color: #fff;
    margin-top: 2px;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

  }

  .price-bottom {
    font-size: 16px;
    line-height: 16px;
    height: 16px;
    display: flex;
    border-top: 1px solid #fff;
    margin-right: 20px;
    bottom: 0;
  }

  .playAmount {
    height: 14px;
    font-size: 14px;
    line-height: 14px;
  }

  .price {
    height: 14px;
    font-size: 14px;
    line-height: 14px;
    position: absolute;
    right: 20px;
  }

  .desc {
    background: #fff;
    padding: 20px 20px;
    font-size: 13px;
    color: #666;
  }

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

  .play {
    position: absolute;
    width: 100%;
    bottom: 0;
    background: #3f9de7;
    color: #fff;
    text-align: center;
    padding: 10px 0;
    /*background-image: url("../../assets/images/play_n.png");*/
  }

  .play:active {
    /*background: red;*/
    /*background-image: url("../../assets/images/play_p.png");*/
  }

  .pause {
    position: fixed;
    right: 20px;
    bottom: 70px;
    width: 100px;
    height: 100px;
    height: 100px;
  }

  .flow {
    position: fixed;
    left: 20px;
    bottom: 70px;
    width: 40px;
    height: 40px;
    background: red;
    border-radius: 20px;
    border: 1px solid #696;
    padding: 1px 0;
    text-align: center;
    -webkit-border-radius: 20px;
    -moz-border-radius: 20px;
    border-radius: 20px;
    -webkit-box-shadow: #666 0px 0px 10px;
    -moz-box-shadow: #666 0px 0px 10px;

    box-shadow: #666 0px 0px 10px;
  }

  .flow img {
    height: 36px;
    width: 36px;
    text-align: center;
  }
</style>
