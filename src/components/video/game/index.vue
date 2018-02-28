<template>
  <div>
    <view-box>
      <group title="游戏列表"/>
      <scroller :pullup-config="upconfig" :pulldown-config="downconfig"
                @on-pulldown-loading="relist"
                @on-pullup-loading="addlist"
                :use-pulldown="true" :use-pullup="true" ref="scroller" height="-40" lock-x :scrollbar-x=false
                :scrollbar-y=false  style="padding-bottom: 20px;">
       <div>
         <div v-if="gamelist.length == 0" class='loading'>
              <span style='color:#B6B6B6;display: block;padding-top: 120px;'>
                暂无数据
              </span>
         </div>
         <flexbox :gutter="0" wrap="wrap">
           <flexbox-item :span="1/2"  v-for="(list,index) in gamelist" style="text-align: center;" @click.native="toplay(list)">
             <img class="gameicon" :src="list.img_list"   ></img>
             <div style="vertical-align: bottom;">
             {{list.name}}
             </div>
           </flexbox-item>
         </flexbox>
       </div>
        <divider v-if="nodata">我是有底线的</divider>
        <!--<load-more v-if="nodata" :show-loading="false" tip="这是底线" background-color="#fbf9fe"></load-more>-->
      </scroller>

    </view-box>
  </div>
</template>

<script>
  import { Grid, GridItem, GroupTitle } from 'vux'

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
      ViewBox
    },
    name: "index",
    data() {
      return {
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
    // , destroyed() {
    //   socket.disconnect()
    // }
    , mounted() {
      var that = this;
      that.getgamelist();

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


    }
    , methods: {
      getgamelist() {
        var that = this;
        var url = "http://" + localStorage.getItem("hs") + "/if/game_list.php?page=" + that.page + "&pagesize=" + that.limit;
        // console.log(url)
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
            el.img_list = host+JQ(e).find("[name='img_list']").html();
            el.img_detail = host+JQ(e).find("[name='img_detail']").html();
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
        this.common.playvideo = list;
        localStorage.setItem("playtype",5);
        localStorage.setItem("playname", list.name);

        var cm = "cmd=game_run&gamename=" + list.exe_path + "&gameid=" + list.id + "&type=2D";
        // alert(cm)
        this.sendcmd(cm)
      }, sendcmd(cmd) {
        // var cmd = "cmd=poweroff"
        // alert(cmd)
        socket.send(cmd);
        this.common.playtype=5;
        this.$router.push("/video/ctrl")
      },

    }
  }
</script>

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
</style>
