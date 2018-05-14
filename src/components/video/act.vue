<template>
  <view-box v-bind:style="windowHeight">
    <div>
      <div>
        <img class="top-bg" v-bind:style="'background-image: url('+list.pic+');'"/>
      </div>
      <div class="top">
        <img v-bind:src="list.pic"></img>
        <div class="info">
          <div style="width: 60vw;">
            <span class="name">{{list.name}}</span>
            <span hidden="true" class="year"> ({{list.year}})</span>
          </div>
          <div style="width: 60vw;"> 年份：{{list.year}}</div>
          <div style="width: 60vw;">{{list.length}}</div>
          <div style="width: 60vw;"> 导演：{{list.director}}</div>
          <div style="width: 55vw;"> 演员：{{list.act}}</div>
          <div style="width: 60vw;"> 类型：{{list.language}}</div>

          <div class="price-bottom">
            <div class="playAmount"><span>收费：</span><span style="font-size: 22px; color: #da251c;">
              {{list.price!=null?"￥"+list.price:'未设置价格'}}
              <!--{{ preorder.price}}-->
            </span>
            </div>
            <div class="price" style="display: none">播放量: {{list.playAmount}}</div>
          </div>
        </div>
      </div>

      <scroller ref="scroller" lock-x :scrollbar-x=false height="-340"
                :scrollbar-y=false>

        <div class="desc">
          {{list.descript}}
        </div>
      </scroller>

      <div class="adbottom">
        <img src="http://mp.11yuanxian.com/share.jpg" style="width: 100%;height: 120px;" v-on:click="toad"></img>
        <div class="play" v-on:click="buy(list)">
          播放
        </div>
      </div>

      <div @click="ctrl" :hidden="true">
        <img v-if="paid" class="pause" src="../../assets/images/cl_pause.png"/>
      </div>
      <div v-if="!show_share && paid" @click="show_share = true" class="flow">
        <img src="../../assets/images/flow.png"/>
      </div>
    </div>

  </view-box>

</template>

<script>
  import {Actionsheet, Scroller} from 'vux'
  import md5 from 'js-md5';

  let Base64 = require('js-base64').Base64;

  var that;
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
      Scroller,
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

        // url: "http://1.dev-reservation.ffun360.com/site_admin/nearby_hotel?",
        url: " http://1.reservation.11yuanxian.com/site_admin/nearby_hotel?",
        preorder: "",
        account: '',
        state: '',

      }
    },
    mounted(res) {


      that = this;
      var sid = this.$router.currentRoute.query.sid;
      var tsid = this.$router.currentRoute.query.openid;
      that.windowHeight = "height: " + window.innerHeight + "px;background: #ececec;";
      var url = "api/tuisong/add?sid=" + sid + "&tsid=" + tsid;
      this.api_post(url, function (res) {
        that.account = res.data;
        that.state = 1;
      }, function (res) {
        that.state = res.code;
        that.$vux.toast.text(res.msg, 'center');
      });

      this.api_post("api/vod/" + sid, function (res) {
        console.log("----", res)
        // that.list = res.data
      }, function () {
        console.log("----0000000000")
      });


      this.getlib_id(sid % 10000000000);

      var url = "api/vod/queryVod";
      console.log(url);
      that.api_post(url, function (res) {
        console.log(res);
        if (res.offerPrice != null) {
          that.list.price = res.offerPrice
        } else {
          if (res.firstPrice != null) {
            that.list.price = res.firstPrice
          }
        }
      })

    }, methods: {
      toad() {
        location.href = "https://www.baidu.com"
      },
      ispay(vid) {
        var url = "api/vod/vi?sid=" + vid;
        that.api_post(url, function (res) {
          // console.log(res)
          that.paid = res.data;
          if (!that.paid) {
            that.btn_style = 1;
          } else {
            that.btn_style = 2;
          }
        })
      },
      getlib_id(id) {

        var url = "http://" + localStorage.getItem("hs") + "/if/movie_path.php?uid=" + id + "" +
          "&type=134&sn=" + localStorage.getItem("sn") + "&cloud=&pid=&idx=1&output=1";

        console.log("111111111111111111", url);
        that.$http.get(url).then(function (res) {
            var styles = JQ(res.bodyText.replace(/param/g, "p")).find("seg[id='program_info']");

            JQ(styles).each(function (i, e) {
              // console.log("e", e)
              that.id = JQ(e).find("[name='pid']").html()
            });

            that.getdetail();
          }, function (res) {

          }
        )

        // var url2 = 'api/vod/preorder?sid=' + id;
        // console.log("sssssssssssssssss", url2);
        // that.api_post(url2, function (res) {
        //   console.log("sssssssssssssssss", res);
        //   that.preorder = res.data;
        // }, function (res) {
        //   that.$vux.toast.text(res.msg, "center")
        // })

      },
      getdetail() {
        var url = "http://" + localStorage.getItem("hs") + "/if/movie_detail.php?id=" + that.id;
        // console.log("111111111111111111", url)
        that.$http.get(url).then(function (res) {
            // console.log("111111111111111111",res)

            var styles = JQ(res.bodyText.replace(/param/g, "p")).find("seg[id='movie_detail']");
            var listtmp = [];
            JQ(styles).each(function (i, e) {
              // console.log("e", e)
              var el = {};

              el.id = JQ(e).find("[name='id']").html();
              el.lib_id = JQ(e).find("[name='lib_id']").html();
              el.pic = JQ(e).find("[name='org_poster']").html();
              el.name = JQ(e).find("[name='name']").html();
              el.year = JQ(e).find("[name='year']").html();
              el.cName = JQ(e).find("[name='name']").html();
              el.length = JQ(e).find("[name='alias']").html();
              el.director = JQ(e).find("[name='director']").html();
              el.act = JQ(e).find("[name='actor']").html();
              el.language = JQ(e).find("[name='dimension']").html();
              el.dimension = JQ(e).find("[name='dimension']").html();
              el.playAmount = '0';
              el.price = JQ(e).find("[name='price']").html() / 100;
              el.descript = JQ(e).find("[name='intro']").html();

              listtmp.push(el)
            });
            that.list = listtmp[0]
            // console.log("--------------", that.list)
          }
        )
      },
      buy(list) {
        var that = this
        that.$vux.confirm.show({
          confirmText: "确定",
          cancelText:"取消",
          title: "温馨提示",
          content: "观看影片需要入住我们的电影酒店哦，点击确定进入订房系统，选择您心仪的酒店。如您已经入住点击取消",
          onCancel() {
          },
          onConfirm() {
            that.to(list);
          }
        })


      }, to(list) {
        var that = this
        var user = this.wxinfo.user
        var time = Math.round(new Date().getTime() / 1000);
        var order_state = 100
        var eidtionTypeList = [
          {key: "city", val: user.city},
          {key: "come_from", val: "1"},
          {key: "country", val: user.country},
          {key: "headimgurl", val: user.headImgUrl},
          {key: "nickname", val: user.nickname},
          {key: "openid", val: user.openId},
          {key: "province", val: user.province},
          {key: "sex", val: user.sexId},
          {key: "t", val: time},
          {key: "unionid", val: user.unionId},
          {key: "yxtoken", val: that.common.TOKEN.token},
        ];
        // eidtionTypeList.sort(function (a, b) {
        //   return a.key + "" > b.key + "";
        // });


        var s = ""
        for (var i = 0; i < eidtionTypeList.length; i++) {
          s += eidtionTypeList[i].key + "" + eidtionTypeList[i].val

          // console.log(eidtionTypeList[i].key + "----" + eidtionTypeList[i].val);
        }
        s = "8cff406dd2e5897bf0581723e95fe246" + s + "8cff406dd2e5897bf0581723e95fe246";
        // 8cff406dd2e5897bf0581723e95fe2467892E144620F8264634487B77C2BE562
        // console.log(s);


        var token = md5(s)
        token = token.toString().toUpperCase()


        this.url = this.url + "come_from=1" + "&t=" + time + "&openid=" + user.openId + "&unionid=" + user.unionId + "&nickname=" + encodeURIComponent(user.nickname)
          + "&sex=" + user.sexId + "&province=" + encodeURIComponent(user.province) + "&city=" + encodeURIComponent(user.city) + "&country=" + encodeURIComponent(user.country) +
          "&headimgurl=" + encodeURIComponent(user.headImgUrl) + "&token=" + token + "&yxtoken=" + this.common.TOKEN.token;

        location.href = this.url

      }, ctrl() {
        this.$router.push("/video/ctrl")
      }, menud(res) {
        var dimensions = "2d";
        if (res == "d2") {
          dimensions = "1"
        } else if (res == "d3") {
          dimensions = "2"
        } else if (res == "蓝光") {
          dimensions = "3"
        }
        that.Play(that.list.lib_id, dimensions, this.list, 1);
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
    font-size: 26px;
    line-height: 26px;
    height: 26px;
    display: flex;
    border-top: 1px solid #fff;
    margin-right: 20px;
    bottom: 0;
  }

  .playAmount {
    height: 24px;
    font-size: 24px;
    line-height: 24px;
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

  .adbottom {
    width: 100%;
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .buy {
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
    right: 20px;
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
