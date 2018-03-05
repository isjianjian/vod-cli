<template>
  <div>
    <x-header :left-options="{showBack:false}" title="slot:overwrite-title">
      <div class="overwrite-title-demo" slot="overwrite-title">

        <marquee style="margin-top: 8px;" :interval="3000">
          <marquee-item class="align-middle" v-if="open">
            <div style="text-align: center; font-size: 14px;color:#6E6E6E;">
              您已开通游戏功能
            </div>
          </marquee-item>
          <marquee-item class="align-middle">
            <div v-if="open" class="clock" style="color: #6e6e6e">
              剩余时间
              <clocker :time="timeExpire" :on-finish="finish">
                <span class="day">%_H1</span>
                <span class="day">%_H2</span>
                <span class="day">:</span>
                <span class="day">%_M1</span>
                <span class="day">%_M2</span>
                <span class="day">:</span>
                <span class="day">%_S1</span>
                <span class="day">%_S2</span>
              </clocker>
            </div>
            <div v-if="!open" style="text-align: center; font-size: 14px;color:#6E6E6E;">
              未开通游戏功能
            </div>
          </marquee-item>
        </marquee>
      </div>
      <div slot="left">
        <div v-if="open" style="padding-bottom: 10px;">
          <x-button :gradients="['#3F9DE7','#3F9DE7']" @click.native="ctrl" mini>遥控</x-button>
        </div>
      </div>
      <div slot="right">
        <div v-if="!open" style="padding-bottom: 10px;">
          <x-button :gradients="['#3F9DE7','#3F9DE7']" @click.native="open_model" mini>开通</x-button>
        </div>
        <div v-if="open" style="padding-bottom: 10px;">
          <x-button :gradients="['#3F9DE7','#3F9DE7']" @click.native="open_model" mini>续费</x-button>
        </div>
      </div>
    </x-header>
    <view-box>
      <group title="游戏列表"/>
      <scroller :pullup-config="upconfig" :pulldown-config="downconfig"
                @on-pulldown-loading="relist"
                @on-pullup-loading="addlist"
                @on-scroll="savetop"
                :use-pulldown="true" :use-pullup="true" ref="scroller" height="-40" lock-x :scrollbar-x=false
                :scrollbar-y=false style="padding-bottom: 20px;">
        <div>
          <div v-if="gamelist.length == 0" class='loading'>
              <span style='color:#B6B6B6;display: block;padding-top: 120px;'>
                暂无数据
              </span>
          </div>
          <flexbox :gutter="0" wrap="wrap">
            <flexbox-item :span="1/2" v-for="(list,index) in gamelist" style="text-align: center;"
                          @click.native="toplay(list)">
              <img class="gameicon" :src="list.img_list"></img>
              <div style="vertical-align: bottom;">
                {{list.name}}
              </div>
            </flexbox-item>
          </flexbox>
        </div>
        <divider v-if="nodata">我是有底线的</divider>
      </scroller>
    </view-box>

    <div v-transfer-dom>

      <popup v-model="show" height="270px" is-transparent>
        <div style="width: 95%;background-color:#fff;height:250px;margin:0 auto;border-radius:5px;padding-top:10px;">
          <group :title="'请选择开通续费时长(单位：小时)'">
            <radio :selected-label-style="{color: '#FF9900'}" fill-mode :options="hours" v-model="hoursValue"
                   @on-change="changehours"></radio>
            <div style="padding:20px 15px;">
              <x-button type="primary" @click.native="otherbuy">确定</x-button>
            </div>
          </group>
        </div>
      </popup>
    </div>
  </div>

</template>

<script>
  import {XHeader, Popup, Radio} from 'vux'
  import {Grid, GridItem, GroupTitle, Clocker, Marquee, MarqueeItem, XButton} from 'vux'

  var socket;
  import ViewBox from "vux/src/components/view-box/index";
  import Cell from "vux/src/components/cell/index";
  import JQ from 'jquery';
  import Group from "vux/src/components/group/index";
  import Scroller from "vux/src/components/scroller/index";
  import LoadMore from "vux/src/components/load-more/index";
  import Flexbox from "vux/src/components/flexbox/flexbox";
  import FlexboxItem from "vux/src/components/flexbox/flexbox-item";
  import Divider from "vux/src/components/divider/index";

  export default {
    components: {
      Divider,
      FlexboxItem,
      Flexbox,
      GridItem,
      Grid,
      LoadMore,
      Scroller,
      Group,
      Cell,
      ViewBox,
      XHeader,
      Clocker,
      Marquee,
      MarqueeItem,
      XButton,
      Popup,
      Radio,
    },
    name: "index",
    data() {
      return {
        hour: 3,
        hours: ['3', '6'],
        hoursValue: '3',
        show: false,
        open: false,
        timeExpire: '2018-03-04 12:00:00',
        gamelist: [],
        page: 1,
        limit: 12,
        nodata: false,
        downconfig: {
          content: '下拉刷新',
          height: 60,
          autoRefresh: false,
          downContent: '下拉刷新',
          upContent: '松手刷新数据',
          loadingContent: '正在刷新...',
          clsPrefix: 'xs-plugin-pulldown-'
        },
        upconfig: {
          content: '上拉加载',
          pullUpHeight: 60,
          height: 40,
          autoRefresh: false,
          downContent: '上拉加载',
          upContent: '加载更多',
          loadingContent: '正在加载...',
          clsPrefix: 'xs-plugin-pullup-'
        },
        options: {},

      }
    }
    , destroyed() {
      var that = this;
      that.common.currentlistgame = that.gamelist
    }
    , mounted() {
      var that = this;
      if (that.common.currentlistgame != null) {

        that.gamelist = that.common.currentlistgame;
        that.page = Math.ceil(that.gamelist.length / that.limit)
        console.log(that.page)
        setTimeout(function () {
          that.$refs.scroller.reset({
            top: that.common.savevodlistgame
          })
          if (that.gamelist.length < that.limit) {
            that.$refs.scroller.disablePullup()
          }
        }, 1)

      } else {
        that.getgamelist();
      }


      if (localStorage.getItem("ws") != "") {
        that.options = {host: localStorage.getItem("ws")}
      } else {
        that.$vux.toast.text("连接客户端失败", 'center');
        return
      }

      var ws = "ws://" + this.options.host;
      socket = new WebSocket(ws, 'dumb-increment-protocol');
      socket.onopen = function (msg) {
        console.log(msg)
        // that.$vux.toast.text("连接客户端成功", 'center')

      };
      socket.onerror = function (res) {
        that.$vux.toast.text("连接客户端失败", 'center')
      };
      socket.onmessage = function (msg) {
        // messageObj
        // cmd 命令名
        // duration 总时长(int，单位秒)
        // curpos 当前时间(int, 单位秒)
        // status 状态(int, 0停止1播放中2暂停3缓冲4初始化中)
        // vol 音量(int, 0-100)
        // mute 静音(int, 1静音 0有声)
        // melody 原伴唱(0原唱 1伴唱)
        // screenstatus 屏幕状态
      };
      socket.onclose = function (msg) {
        that.$vux.toast.text("与服务器失去连接，请检查网络。", 'center')
      }


      this.checkOpen();

    }
    , methods: {
      otherbuy() {
        try {
          var h= this.hour
          if(parseInt(h)>0&&parseInt(h)<24){
            this.$router.push("/video/otherbuy?type=5&hour="+this.hour)
          }else{
            this.$vux.toast.text("请输入有效时间", 'center')
          }
        } catch (e) {
          this.$vux.toast.text("请输入有效时间", 'center')
        }
      },
      changehours(res) {
        this.hour = res
      },
      open_model() {
        var that = this;
        that.show = true;
      },
      checkOpen() {
        var that = this;
        that.api_post("api/module/countdown?type=5", function (res) {
          that.open = true;
          that.timeExpire = new Date().getTime() + res.data.count;
          console.log('timeExpire', that.timeExpire)
        }, function () {
          that.open = false;
        })
      },
      finish(){
        this.checkOpen();
      },
      savetop(res) {

        var that = this;
        if (res.top != 0) {
          that.common.savevodlistgame = res.top
        }
      },
      getgamelist() {
        var that = this;
        var url = "http://" + localStorage.getItem("hs") + "/if/game_list.php?page=" + that.page + "&pagesize=" + that.limit + "&sn=" + localStorage.getItem("sn");
        console.log(url);
        that.$http.get(url).then(function (res) {
          // console.log(res)
          var styles = JQ(res.bodyText.replace(/param/g, "p")).find("list[name='game_list'] entry");
          var host = JQ(res.bodyText.replace(/param/g, "p")).find("seg[id='game_list']").find("[name='poster']").html();
          var list = [];
          JQ(styles).each(function (i, e) {
            var el = {};
            el.id = JQ(e).find("[name='id']").html();
            el.name = JQ(e).find("[name='name']").html();
            el.exe_path = JQ(e).find("[name='exe_path']").html();
            el.img_list = host + JQ(e).find("[name='img_list']").html();
            el.img_detail = host + JQ(e).find("[name='img_detail']").html();
            el.joystick = JQ(e).find("[name='joystick']").html();
            el.flag_3d = JQ(e).find("[name='flag_3d']").html();
            el.flag_vr = JQ(e).find("[name='flag_vr']").html();
            list.push(el)
          });


          if (that.page == 1) {
            that.gamelist = list;
            that.resettop()
          } else {
            for (var i = 0; i < list.length; i++) {
              that.gamelist.push(list[i])
            }
            that.$refs.scroller.donePullup();
            that.$refs.scroller.reset()
          }


          if (that.page != 1) {
            that.nodata = true
          }
          if (list.length < that.limit) {
            // console.log("=========================")
            that.$refs.scroller.disablePullup()
          } else if (list.length == that.limit) {
            that.nodata = false;
            that.$refs.scroller.enablePullup()
          }


          that.$vux.loading.hide();

          console.log("************", that.gamelist)
        }, function (res) {
        })

      }, relist() {
        var that = this;
        that.page = 1;
        that.getgamelist()
      }, addlist() {
        var that = this;
        that.page = that.page + 1;
        that.getgamelist()
      }, resettop() {
        var that = this;
        setTimeout(() => {
          that.$refs.scroller.reset({
            top: 0
          });
          that.$refs.scroller.donePulldown()
        }, 1 * 500)
      }, toplay(list) {
        // console.log(list)
        // cmd=game_run 		立即运行（参数：gamename=游戏目录名称&gameid=游戏编号&type=2D运行维度&vol=默认音量）;
        if (this.open) {
          this.common.playvideo = list;
          localStorage.setItem("playtype", 5);
          localStorage.setItem("playname", list.name);

          var cm = "cmd=game_run&gamename=" + list.exe_path + "&gameid=" + list.id + "&type=2D";
          // alert(cm)
          this.sendcmd(cm)
        } else {
          this.$vux.toast.text("请先开通", "center")
        }
      }, sendcmd(cmd) {
        // var cmd = "cmd=poweroff"
        // alert(cmd)
        socket.send(cmd);

      }, ctrl() {
        // this.common.playtype = 5;
        this.$router.push("/video/ctrl")
      }


    }
  }
</script>


<style>
  .vux-header .vux-header-left {
    top: 10px !important;
  }
  .vux-header .vux-header-right {
    top: 10px !important;
  }
</style>
<style scoped>
  .loading {
    height: 80px;
    /* line-height: 80px; */
    align-items: center;
    text-align: center;
  }

  .gameicon {
    width: 94%;
    height: 116px;
    border-radius: 4px;
  }

  .gameicon:active {
    transform: scale(1.1);
  }

  .clock {
    text-align: center;
    font-size: 14px;
  }

  .vux-x-icon {
    fill: #1AAD19;
  }

  .clock span {

    color: #6E6E6E;
    text-align: center;
    display: inline-block;

  }
</style>
