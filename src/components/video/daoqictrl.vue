<template>
  <div>
    <view-box>

      <group :hidden="true">
        <cell :title="'正在播放: '+name"></cell>
      </group>

      <flexbox :gutter="0" wrap="wrap" style="margin-top: 10px;">
        <div class="page-ctrl-btns ctrl-btn-info sendcmd" v-on:click="sendcmd('cmd=movie_info')"></div>
        <div class="page-ctrl-btns ctrl-btn-track sendcmd" v-on:click="sendcmd('cmd=movie_track')"></div>
        <div class="page-ctrl-btns ctrl-btn-subtitle sendcmd" v-on:click="sendcmd('cmd=movie_subtitle')"></div>
        <div class="page-ctrl-btns ctrl-btn-stop sendcmd" v-on:click="sendcmd('cmd=movie_stop')"></div>
        <div class="page-ctrl-btns ctrl-btn-vol-add sendcmd" v-on:click="sendcmd('cmd=movie_vol&value=1000')"></div>
        <div class="page-ctrl-btns ctrl-btn-vol-reduct sendcmd" v-on:click="sendcmd('cmd=movie_vol&value=-1000')"></div>
        <div class="page-ctrl-btns ctrl-btn-mute sendcmd" v-on:click="sendcmd('cmd=movie_mute')"></div>
        <div class="page-ctrl-btns ctrl-btn-pause sendcmd" v-on:click="sendcmd('cmd=movie_resume')"></div>
      </flexbox>


      <!--<flexbox :gutter="0" wrap="wrap">-->
      <!--<div class="page-ctrl-btns ctrl-btn-mic-add sendcmd" v-on:click="sendcmd('cmd=ktv_mic_add')"></div>-->
      <!--<div class="page-ctrl-btns ctrl-btn-mic-reduct sendcmd" v-on:click="sendcmd('cmd=ktv_mic_reduce')"></div>-->
      <!--<div class="page-ctrl-btns ctrl-btn-vol-add sendcmd" v-on:click="sendcmd('cmd=ktv_vol&value=1000')"></div>-->
      <!--<div class="page-ctrl-btns ctrl-btn-vol-reduct sendcmd" v-on:click="sendcmd('cmd=ktv_vol&value=-1000')"></div>-->
      <!--<div class="page-ctrl-btns ctrl-btn-mute sendcmd" v-on:click="sendcmd('cmd=ktv_mute')"></div>-->
      <!--<div class="page-ctrl-btns ctrl-btn-replay sendcmd" v-on:click="sendcmd('cmd=ktv_replay')"></div>-->
      <!--<div class="page-ctrl-btns ctrl-btn-next sendcmd" v-on:click="sendcmd('cmd=ktv_next')"></div>-->
      <!--<div class="page-ctrl-btns ctrl-btn-original sendcmd" v-on:click="sendcmd('cmd=ktv_original')"></div>-->
      <!--<div class="page-ctrl-btns ctrl-btn-pause sendcmd" v-on:click="sendcmd('cmd=ktv_resume')"></div>-->
      <!--&lt;!&ndash;<div class="page-ctrl-btns btn-ktv-additional ctrl-btn-light" v-on:click="sendcmd('cmd=ktv_mic_add')"></div>&ndash;&gt;-->
      <!--<div class="page-ctrl-btns ctrl-btn-stop sendcmd" v-on:click="sendcmd('cmd=ktv_stop')"></div>-->
      <!--</flexbox>-->
      <!--<flexbox :gutter="0" wrap="wrap">-->
      <!--<div class="page-ctrl-btns ctrl-btn-vol-add sendcmd" data-idx=0 data-value=1000></div>-->
      <!--<div class="page-ctrl-btns ctrl-btn-vol-reduct sendcmd" data-idx=0 data-value=-1000></div>-->
      <!--<div class="page-ctrl-btns ctrl-btn-pause sendcmd" data-idx=1></div>-->
      <!--<div class="page-ctrl-btns ctrl-btn-exit sendcmd" data-idx=2></div>-->
      <!--</flexbox>-->
      <!--<flexbox :gutter="0" wrap="wrap">-->
      <!--<div class="page-ctrl-btns ctrl-btn-list" role="button" data-toggle="modal" data-target=".bs-pop-list"></div>-->
      <!--<div class="page-ctrl-btns ctrl-btn-random sendcmd" data-idx=0></div>-->
      <!--<div class="page-ctrl-btns ctrl-btn-loop sendcmd" data-idx=1></div>-->
      <!--<div class="page-ctrl-btns ctrl-btn-stop sendcmd" data-idx=2></div>-->
      <!--<div class="page-ctrl-btns ctrl-btn-vol-add sendcmd" data-idx=3 data-value=1000>-->
      <!--<div class="raiseup"><span style="display: none;">80</span></div>-->
      <!--</div>-->
      <!--<div class="page-ctrl-btns ctrl-btn-vol-reduct sendcmd" data-idx=3 data-value=-1000>-->
      <!--<div class="raiseup"><span style="display: none;">80</span></div>-->
      <!--</div>-->
      <!--<div class="page-ctrl-btns ctrl-btn-next-music sendcmd" data-idx=4></div>-->
      <!--<div class="page-ctrl-btns ctrl-btn-pause sendcmd" data-idx=5></div>-->
      <!--</flexbox>-->

      <flexbox :gutter="0" wrap="wrap">
        <flexbox-item>
          <cell :inline-desc="'当前: '+data+'%'" primary="content">
          </cell>

          <range v-model="data" :range-bar-height="4" @on-change="changedata"></range>
        </flexbox-item>
      </flexbox>

    </view-box>
  </div>
</template>

<script>
  import Group from "vux/src/components/group/index";
  import Cell from "vux/src/components/cell/index";
  import FlexboxItem from "vux/src/components/flexbox/flexbox-item";
  import Flexbox from "vux/src/components/flexbox/flexbox";
  import Range from "vux/src/components/range/index";
  import ViewBox from "vux/src/components/view-box/index";

  var socket
  export default {
    name: "ctrl",
    components: {
      ViewBox,
      Range,
      Flexbox,
      FlexboxItem,
      Cell,
      Group,
    }, data() {
      return {
        data: 0,
        current: {},
        options: {},
        restype: 1,
        duration: 0,
        seekto: 0,
        name: '请返回点击播放按钮',
      }
    }, mounted() {
      var that = this;
      var ws = that.$router.currentRoute.query.ws
      that.restype = this.$router.currentRoute.query.restype

      // alert(this.common.playvideo.name)

      if (this.common.playvideo != null) {
        that.name =this.common.playvideo.name
      }
      if (that.$router.currentRoute.query.seekto != null) {
        this.seekto = this.$router.currentRoute.query.seekto
      }


      if (ws == null) {
        if (that.ws != "") {
          that.options = {host: that.ws}
        } else {
          that.$vux.toast.text("连接客户端失败", 'center')
          return
        }
      } else {
        that.options = {host: ws}
      }

      // console.log(that.options)


      var ws = "ws://" + this.options.host
      socket = new WebSocket(ws, 'dumb-increment-protocol');
      socket.onopen = function (msg) {
        console.log(msg)
        that.$vux.toast.text("连接客户端成功", 'center')
        if (that.seekto != 0) {
          that.$vux.confirm.show({
            title: "温馨提示",
            content: "系统记录到您最近播放到" + that.sec_to_time(that.seekto / 1000) + ", 按确认键继续播放，取消键重新播放。",
            onCancel() {
              // that.$vux.toast.text("重新播放", 'center')
              // that.playseekto(0)
            },
            onConfirm() {
              that.$vux.toast.text("继续播放", 'center')
            }
          })
        }
      }
      socket.onerror = function (res) {
        that.$vux.toast.text("连接客户端失败", 'center')
      }
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

        that.duration = that.getStrValue("duration", msg.data, "1", 9)
      }
      socket.onclose = function (msg) {
        that.$vux.toast.text("与服务器失去连接，请检查网络。", 'center')
      }


    }, methods: {

      sendcmd(cmd) {
        // var cmd = "cmd=poweroff"
        // alert(cmd)

        socket.send(cmd)
      },

//       cmd=movie_resume	继续播放（暂停）
// cmd=movie_stop		停止
//   cmd=movie_stereo	立体感
//   cmd=movie_mute		静音
//   cmd=movie_audio		音频输出
//   cmd=movie_track		音轨
//   cmd=movie_subtitle	字幕
//   cmd=movie_3dmode	3D
//   cmd=movie_screen	宽屏
//   cmd=movie_info		信息
//   cmd=movie_vol		音量（参数：value=音量大小）

      playseekto(res) {
        var that = this
        var cmd = 'cmd=seek&value=' + res

        that.current = setTimeout(function (res) {
          socket.send(cmd)
        }, 1000)
      },

      changedata(res) {

        var that = this
        var cmd = 'cmd=seek&value=' + parseInt(that.duration / 100 * res)
        that.data = res
        console.log(that.data)
        if (that.current != null) {
          clearTimeout(that.current);
        }

        that.current = setTimeout(function (res) {
          // that.sendml("00," + that.data)
          socket.send(cmd)
        }, 1000)


      }, sendml(res) {
        var that = this;
        var url = "/api/ml?ml=" + res
        that.api_post(url, function (res) {
          // console.log(res)
          that.$vux.toast.show("操作成功")
        }, function (res) {
          that.$vux.confirm.show({
            confirmText: "扫描二维码",
            title: "未认证设备",
            content: "购买影片时需扫描你所在酒店播放设备显示的二维码",
            onCancel() {
            },
            onConfirm() {
              that.QRcode()
            }
          })
        })
      }, getStrValue(fieldName, str, flag, plength) {
        var fieldIndex = str.indexOf(fieldName + "=");
        var fieldRemain = str.substr(fieldIndex + plength, str.length);
        if (flag == "1")
          return fieldRemain.substr(0, fieldRemain.indexOf("&"));
        else {
          return fieldRemain.substr(0, str.length);
        }
      }, sec_to_time(s) {
        var t;
        if (s > -1) {
          var hour = Math.floor(s / 3600);
          var min = Math.floor(s / 60) % 60;
          var sec = s % 60;
          if (hour < 10) {
            t = '0' + hour + ":";
          } else {
            t = hour + ":";
          }

          if (min < 10) {
            t += "0";
          }
          t += min + ":";
          if (sec < 10) {
            t += "0";
          }
          // t += sec.toFixed(2);
          t += sec;
        }
        return t;
      }
    }

  }
</script>

<style scoped>
  .page-ctrl-btns1 {
    width: 33%;
  }

  .page-ctrl-btns {
    width: 20%;
    height: 80px;
  }

  .ctrl-btn-info {
    background: url(../../assets/images/ctrl-btn-info.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-track {
    background: url(../../assets/images/ctrl-btn-track.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-subtitle {
    background: url(../../assets/images/ctrl-btn-subtitle.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-play {
    background: url(../../assets/images/ctrl-btn-play.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-stop {
    background: url(../../assets/images/ctrl-btn-stop.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-queue {
    background: url(../../assets/images/ctrl-btn-queue.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-history {
    background: url(../../assets/images/ctrl-btn-history.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-mute {
    background: url(../../assets/images/ctrl-btn-mute.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-mute.on {
    background: url(../../assets/images/ctrl-btn-mute-off.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-vol-add {
    background: url(../../assets/images/ctrl-btn-vol-add.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-vol-reduct {
    background: url(../../assets/images/ctrl-btn-vol-reduct.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-mic-add {
    background: url(../../assets/images/ctrl-btn-mic-add.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-mic-reduct {
    background: url(../../assets/images/ctrl-btn-mic-reduct.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-pause {
    background: url(../../assets/images/ctrl-btn-pause.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-pause.on {
    background: url(../../assets/images/ctrl-btn-continue.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-replay {
    background: url(../../assets/images/ctrl-btn-replay.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-next {
    background: url(../../assets/images/ctrl-btn-next.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-original {
    background: url(../../assets/images/ctrl-btn-original.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-original.on {
    background: url(../../assets/images/ctrl-btn-backing.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-light {
    background: url(../../assets/images/ctrl-btn-light.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-light.on {
    background: url(../../assets/images/ctrl-btn-light-on.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-light-1 {
    background: url(../../assets/images/ctrl-btn-light-1.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-light-2 {
    background: url(../../assets/images/ctrl-btn-light-2.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-light-3 {
    background: url(../../assets/images/ctrl-btn-light-3.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-light-4 {
    background: url(../../assets/images/ctrl-btn-light-4.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-scene {
    background: url(../../assets/images/ctrl-btn-scene.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-scene.on {
    background: url(../../assets/images/ctrl-btn-scene-on.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-scene-1 {
    background: url(../../assets/images/ctrl-btn-scene-1.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-scene-2 {
    background: url(../../assets/images/ctrl-btn-scene-2.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-scene-3 {
    background: url(../../assets/images/ctrl-btn-scene-3.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-scene-4 {
    background: url(../../assets/images/ctrl-btn-scene-4.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-atmosphere {
    background: url(../../assets/images/ctrl-btn-atmosphere.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-atmosphere.on {
    background: url(../../assets/images/ctrl-btn-atmosphere-on.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-atmosphere-1 {
    background: url(../../assets/images/ctrl-btn-atmosphere-1.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-atmosphere-2 {
    background: url(../../assets/images/ctrl-btn-atmosphere-2.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-atmosphere-3 {
    background: url(../../assets/images/ctrl-btn-atmosphere-3.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-atmosphere-4 {
    background: url(../../assets/images/ctrl-btn-atmosphere-4.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-list {
    background: url(../../assets/images/ctrl-btn-list.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-random {
    background: url(../../assets/images/ctrl-btn-random.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-loop {
    background: url(../../assets/images/ctrl-btn-loop.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-next-music {
    background: url(../../assets/images/ctrl-btn-next-music.png) center no-repeat;
    background-size: 100%;
  }
</style>
