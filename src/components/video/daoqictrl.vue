<template>

  <div v-if="common.hotel!=null" style="height:100%;background: #fff;">
    <view-box ref="viewBox">
      <div>


        <div v-if="restype==1">
          <divider v-if="restype!= 0"> {{restype==5?"正在玩"+name:"正在播放"+name}}</divider>
          <divider> 电影</divider>
          <flexbox :gutter="0" wrap="wrap" style="margin-top: 10px;">
            <div class="page-ctrl-btns ctrl-btn-info sendcmd" v-on:click="sendcmd('cmd=movie_info')"></div>
            <div class="page-ctrl-btns ctrl-btn-track sendcmd" v-on:click="sendcmd('cmd=movie_track')"></div>
            <div class="page-ctrl-btns ctrl-btn-subtitle sendcmd" v-on:click="sendcmd('cmd=movie_subtitle')"></div>
            <div class="page-ctrl-btns ctrl-btn-stop sendcmd" v-on:click="sendcmd('cmd=movie_stop')"></div>
            <div class="page-ctrl-btns ctrl-btn-vol-add sendcmd" v-on:click="sendcmd('cmd=movie_vol&value=1000')"></div>
            <div class="page-ctrl-btns ctrl-btn-vol-reduct sendcmd"
                 v-on:click="sendcmd('cmd=movie_vol&value=-1000')"></div>
            <div class="page-ctrl-btns ctrl-btn-mute sendcmd" v-on:click="sendcmd('cmd=movie_mute')"></div>
            <div class="page-ctrl-btns ctrl-btn-pause sendcmd" v-on:click="sendcmd('cmd=movie_resume')"></div>
          </flexbox>
        </div>
        <div v-if="restype==3">
          <divider> K歌</divider>
          <flexbox :gutter="0" wrap="wrap">
            <div class="page-ctrl-btns ctrl-btn-mic-add sendcmd" v-on:click="sendcmd('cmd=ktv_mic_add')"></div>
            <div class="page-ctrl-btns ctrl-btn-mic-reduct sendcmd" v-on:click="sendcmd('cmd=ktv_mic_reduce')"></div>
            <div class="page-ctrl-btns ctrl-btn-vol-add sendcmd" v-on:click="sendcmd('cmd=ktv_vol&value=1000')"></div>
            <div class="page-ctrl-btns ctrl-btn-vol-reduct sendcmd"
                 v-on:click="sendcmd('cmd=ktv_vol&value=-1000')"></div>
            <div class="page-ctrl-btns ctrl-btn-mute sendcmd" v-on:click="sendcmd('cmd=ktv_mute')"></div>
            <div class="page-ctrl-btns ctrl-btn-replay sendcmd" v-on:click="sendcmd('cmd=ktv_replay')"></div>
            <div class="page-ctrl-btns ctrl-btn-next sendcmd" v-on:click="sendcmd('cmd=ktv_next')"></div>
            <div class="page-ctrl-btns ctrl-btn-original sendcmd" v-on:click="sendcmd('cmd=ktv_original')"></div>
            <div class="page-ctrl-btns ctrl-btn-pause sendcmd" v-on:click="sendcmd('cmd=ktv_resume')"></div>
            <!--<div class="page-ctrl-btns btn-ktv-additional ctrl-btn-light" v-on:click="sendcmd('cmd=ktv_mic_add')"></div>-->
            <div class="page-ctrl-btns ctrl-btn-stop sendcmd" v-on:click="sendcmd('cmd=ktv_stop')"></div>
          </flexbox>
        </div>
        <div v-if="restype==4">

          <divider> HIFI音乐</divider>
          <flexbox :gutter="0" wrap="wrap">
            <div class="page-ctrl-btns ctrl-btn-random sendcmd" v-on:click="sendcmd('cmd=music_random')"></div>
            <div class="page-ctrl-btns ctrl-btn-loop sendcmd" v-on:click="sendcmd('cmd=cmd=music_all_repeat')"></div>
            <div class="page-ctrl-btns ctrl-btn-stop sendcmd" v-on:click="sendcmd('cmd=music_stop')"></div>
            <div class="page-ctrl-btns ctrl-btn-vol-add sendcmd" v-on:click="sendcmd('cmd=music_vol&value=1000')"></div>
            <div class="page-ctrl-btns ctrl-btn-vol-reduct sendcmd"
                 v-on:click="sendcmd('cmd=music_vol&value=-1000')"></div>
            <div class="page-ctrl-btns ctrl-btn-next-music sendcmd" v-on:click="sendcmd('cmd=music_next')"></div>
            <div class="page-ctrl-btns ctrl-btn-pause sendcmd" v-on:click="sendcmd('cmd=music_resume')"></div>
          </flexbox>
        </div>

        <div v-if="restype==5">
          <divider v-if="restype!= 0"> {{restype==5?"正在玩"+name:"正在播放"+name}}</divider>
          <divider> 游戏</divider>
          <flexbox :gutter="0" wrap="wrap">
            <div class="page-ctrl-btns ctrl-btn-vol-add sendcmd" v-on:click="sendcmd('cmd=game_vol&value=1000')"></div>
            <div class="page-ctrl-btns ctrl-btn-vol-reduct sendcmd"
                 v-on:click="sendcmd('cmd=game_vol&value=-1000')"></div>
            <div class="page-ctrl-btns ctrl-btn-pause sendcmd" v-on:click="sendcmd('cmd=game_resume')"></div>
            <div class="page-ctrl-btns ctrl-btn-exit sendcmd" v-on:click="sendcmd('cmd=game_stop')"></div>
          </flexbox>
        </div>


        <div v-if="restype==1||restype==3||restype==4">
          <flexbox :gutter="0" wrap="wrap">
            <flexbox-item>
              <cell :inline-desc="sec_to_time(curpos)+'|'+sec_to_time(duration)" primary="content"/>


              <range v-model="data" :range-bar-height="4" @on-change="changedata"></range>
            </flexbox-item>
          </flexbox>
        </div>


        <div v-if="restype== 0" class='loading'>
              <span style='color:#B6B6B6;display: block;padding-top: 120px;'>
                先去播放吧
              </span>
        </div>

      </div>

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
  import Divider from "vux/src/components/divider/index";

  var socket;
  export default {
    name: "ctrl",
    components: {
      Divider,
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
        restype: 0,
        duration: 0,
        seekto: 0,
        name: '...',
        curpos: '',
      }
    }
    , mounted() {
      var that = this;
      var ws = that.$router.currentRoute.query.ws;
      // that.restype = this.common.playtype
      // that.name = this.common.playvideo.name
      // alert(this.common.playvideo.name)
      if (localStorage.getItem("playtype") != null) {
        that.restype = localStorage.getItem("playtype")
      }
      if (localStorage.getItem("playname") != null) {
        that.name = localStorage.getItem("playname")
      }


      if (that.$router.currentRoute.query.seekto != null) {
        this.seekto = this.$router.currentRoute.query.seekto
      }


      if (ws == null) {
        if (localStorage.getItem("ws") != "") {
          that.options = {host: localStorage.getItem("ws")}
        } else {
          that.$vux.toast.text("连接客户端失败", 'center');
          return
        }
      } else {
        that.options = {host: ws}
      }

      // console.log(that.options)


      var ws = "ws://" + this.options.host;
      socket = new WebSocket(ws, 'dumb-increment-protocol');
      socket.onopen = function (msg) {
        console.log(msg);
        // that.$vux.toast.text("连接客户端成功", 'center')
        if (that.seekto != 0) {
          that.$vux.confirm.show({
            title: "温馨提示",
            content: "系统记录到您最近播放到" + that.sec_to_time(that.seekto / 1000) + ", 按确认键继续播放，取消键重新播放。",
            onCancel() {
              var cmd = 'cmd=seek&value=0';
              socket.send(cmd);
              that.$vux.toast.text("重新播放", 'center')

            },
            onConfirm() {
              // var cmd = 'cmd=seek&value=' + (that.seekto / 1000);
              // socket.send(cmd);
              // that.$vux.toast.text("继续播放", 'center')
            }
          })
        }
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
        that.curpos = that.getQueryString(msg.data, "curpos");
        that.duration = that.getQueryString(msg.data, "duration");

        setTimeout(function () {
          that.data = that.curpos / that.duration * 100
        }), 1 * 1000
      };

      socket.onclose = function (msg) {
        that.$vux.toast.text("与服务器失去连接，请检查网络。", 'center')
      }


    }, methods: {

      sendcmd(cmd) {
        // var cmd = "cmd=poweroff"
        // alert(cmd)
        var that = this;

        socket.send(cmd)


        if (cmd == "cmd=movie_stop" || cmd == "cmd=ktv_stop" || cmd == "cmd=game_stop" || cmd == "cmd=music_stop") {
          window.history.back()
          localStorage.setItem("playtype", 0)
          that.restype = localStorage.getItem("playtype")
          location.reload();
          // router.go(0)
        }
      },

//   cmd=movie_resume	继续播放（暂停）
//   cmd=movie_stop		停止
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
        var that = this;
        var cmd = 'cmd=seek&value=' + res;

        that.current = setTimeout(function (res) {
          socket.send(cmd)
        }, 1000)
      },
      stopseekto() {
        var that = this;
        clearTimeout(that.current);

      },
      changedata(res) {
        var that = this;
        var cmd = 'cmd=seek&value=' + parseInt(res / 100 * that.duration);


        var tmp = Math.abs(res - parseInt(that.curpos / that.duration * 100));

        // that.$vux.toast.text("res：" + res + "that.data：" + parseInt(that.curpos / that.duration * 100) + "tmp：" + tmp + "", 'center')


        if (tmp >= 5) {
          socket.send(cmd)
        }


      }, sendml(res) {
        var that = this;
        var url = "/api/ml?ml=" + res;
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
      }, getQueryString(data, name) {
        let reg = `(^|&)${name}=([^&]*)(&|$)`;
        let r = data.substr(1).match(reg);
        if (r != null) {
          var value = unescape(r[2]);
          return value
        } else {
          return null;
        }
      }
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

  .ctrl-btn-info:active {
    transform: scale(0.8);
  }

  .ctrl-btn-track {
    background: url(../../assets/images/ctrl-btn-track.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-track:active {
    transform: scale(0.8);
  }

  .ctrl-btn-subtitle {
    background: url(../../assets/images/ctrl-btn-subtitle.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-subtitle:active {
    transform: scale(0.8);
  }

  .ctrl-btn-play {
    background: url(../../assets/images/ctrl-btn-play.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-play:active {
    transform: scale(0.8);
  }

  .ctrl-btn-stop {
    background: url(../../assets/images/ctrl-btn-stop.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-stop:active {
    transform: scale(0.8);
  }

  .ctrl-btn-queue {
    background: url(../../assets/images/ctrl-btn-queue.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-queue:active {
    transform: scale(0.8);
  }

  .ctrl-btn-history {
    background: url(../../assets/images/ctrl-btn-history.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-history:active {
    transform: scale(0.8);
  }

  .ctrl-btn-mute {
    background: url(../../assets/images/ctrl-btn-mute.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-mute:active {
    transform: scale(0.8);
  }

  .ctrl-btn-mute.on {
    background: url(../../assets/images/ctrl-btn-mute-off.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-mute.on:active {
    transform: scale(0.8);
  }

  .ctrl-btn-vol-add {
    background: url(../../assets/images/ctrl-btn-vol-add.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-vol-add:active {
    transform: scale(0.8);
  }

  .ctrl-btn-vol-reduct {
    background: url(../../assets/images/ctrl-btn-vol-reduct.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-vol-reduct:active {
    transform: scale(0.8);
  }

  .ctrl-btn-mic-add {
    background: url(../../assets/images/ctrl-btn-mic-add.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-mic-add:active {
    transform: scale(0.8);
  }

  .ctrl-btn-mic-reduct {
    background: url(../../assets/images/ctrl-btn-mic-reduct.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-mic-reduct:active {
    transform: scale(0.8);
  }

  .ctrl-btn-pause {
    background: url(../../assets/images/ctrl-btn-pause.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-pause:active {
    transform: scale(0.8);
  }

  .ctrl-btn-pause.on {
    background: url(../../assets/images/ctrl-btn-continue.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-pause.on :active {
    transform: scale(0.8);
  }

  .ctrl-btn-replay {
    background: url(../../assets/images/ctrl-btn-replay.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-replay:active {
    transform: scale(0.8);
  }

  .ctrl-btn-next {
    background: url(../../assets/images/ctrl-btn-next.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-next:active {
    transform: scale(0.8);
  }

  .ctrl-btn-original {
    background: url(../../assets/images/ctrl-btn-original.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-original:active {
    transform: scale(0.8);
  }

  .ctrl-btn-original.on {
    background: url(../../assets/images/ctrl-btn-backing.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-original.on:active {
    transform: scale(0.8);
  }

  .ctrl-btn-light {
    background: url(../../assets/images/ctrl-btn-light.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-light:active {
    transform: scale(0.8);
  }

  .ctrl-btn-light.on {
    background: url(../../assets/images/ctrl-btn-light-on.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-light.on :active {
    transform: scale(0.8);
  }

  .ctrl-btn-light-1 {
    background: url(../../assets/images/ctrl-btn-light-1.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-light-1:active {
    transform: scale(0.8);
  }

  .ctrl-btn-light-2 {
    background: url(../../assets/images/ctrl-btn-light-2.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-light-2:active {
    transform: scale(0.8);
  }

  .ctrl-btn-light-3 {
    background: url(../../assets/images/ctrl-btn-light-3.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-light-3:active {
    transform: scale(0.8);
  }

  .ctrl-btn-light-4 {
    background: url(../../assets/images/ctrl-btn-light-4.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-light-4:active {
    transform: scale(0.8);
  }

  .ctrl-btn-scene {
    background: url(../../assets/images/ctrl-btn-scene.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-scene:active {
    transform: scale(0.8);
  }

  .ctrl-btn-scene.on {
    background: url(../../assets/images/ctrl-btn-scene-on.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-scene.on:active {
    transform: scale(0.8);
  }

  .ctrl-btn-scene-1 {
    background: url(../../assets/images/ctrl-btn-scene-1.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-scene-1:active {
    transform: scale(0.8);
  }

  .ctrl-btn-scene-2 {
    background: url(../../assets/images/ctrl-btn-scene-2.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-scene-2:active {
    transform: scale(0.8);
  }

  .ctrl-btn-scene-3 {
    background: url(../../assets/images/ctrl-btn-scene-3.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-scene-3:active {
    transform: scale(0.8);
  }

  .ctrl-btn-scene-4 {
    background: url(../../assets/images/ctrl-btn-scene-4.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-scene-4:active {
    transform: scale(0.8);
  }

  .ctrl-btn-atmosphere {
    background: url(../../assets/images/ctrl-btn-atmosphere.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-atmosphere:active {
    transform: scale(0.8);
  }

  .ctrl-btn-atmosphere.on {
    background: url(../../assets/images/ctrl-btn-atmosphere-on.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-atmosphere.on :active {
    transform: scale(0.8);
  }

  .ctrl-btn-atmosphere-1 {
    background: url(../../assets/images/ctrl-btn-atmosphere-1.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-atmosphere-1:active {
    transform: scale(0.8);
  }

  .ctrl-btn-atmosphere-2 {
    background: url(../../assets/images/ctrl-btn-atmosphere-2.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-atmosphere-2:active {
    transform: scale(0.8);
  }

  .ctrl-btn-atmosphere-3 {
    background: url(../../assets/images/ctrl-btn-atmosphere-3.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-atmosphere-3:active {
    transform: scale(0.8);
  }

  .ctrl-btn-atmosphere-4 {
    background: url(../../assets/images/ctrl-btn-atmosphere-4.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-atmosphere-4:active {
    transform: scale(0.8);
  }

  .ctrl-btn-list {
    background: url(../../assets/images/ctrl-btn-list.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-list:active {
    transform: scale(0.8);
  }

  .ctrl-btn-random {
    background: url(../../assets/images/ctrl-btn-random.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-random:active {
    transform: scale(0.8);
  }

  .ctrl-btn-loop {
    background: url(../../assets/images/ctrl-btn-loop.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-loop:active {
    transform: scale(0.8);
  }

  .ctrl-btn-next-music {
    background: url(../../assets/images/ctrl-btn-next-music.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-next-music:active {
    transform: scale(0.8);
  }

  .ctrl-arrow-up {
    width: 221px;
    height: 68px;
    background: url(../../assets/images/ctrl-circle-up.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-arrow-middle {
    width: 250px;
    height: 118px;
  }

  .ctrl-arrow-left {
    width: 71px;
    height: 118px;
    background: url(../../assets/images/ctrl-circle-left.png) center no-repeat;
    background-size: 100%;
    float: left;
  }

  .ctrl-arrow-center {
    width: 108px;
    height: 118px;
    background: url(../../assets/images/ctrl-circle-center.png) center no-repeat;
    background-size: 100%;
    float: right;
  }

  .ctrl-arrow-right {
    width: 71px;
    height: 118px;
    background: url(../../assets/images/ctrl-circle-right.png) center no-repeat;
    background-size: 100%;
    float: right;
  }

  .ctrl-arrow-down {
    width: 219px;
    height: 66px;
    background: url(../../assets/images/ctrl-circle-down.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-temp-up {
    width: 80px;
    height: 80px;
    background: url(../../assets/images/ctrl-temp-up.png) center no-repeat;
    background-size: 100%;
    float: left;
    margin-top: 1.3em;
  }

  .ctrl-temp-down {
    width: 80px;
    height: 80px;
    background: url(../../assets/images/ctrl-temp-down.png) center no-repeat;
    background-size: 100%;
    float: right;
    margin-left: 1em;
    margin-top: 1.3em;
  }

  .panel-air-temp {
    display: block;
    float: right;
    font-size: 6em;
    color: #b5d888;
  }

  .panel-intelligent-air > .panel-circle {
    height: 150px;
    padding-top: 2em;
  }

  .ctrl-btn-exit {
    background: url(../../assets/images/ctrl-btn-exit.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-exit:active {
    transform: scale(0.8);
  }

  .ctrl-btn-menu {
    background: url(../../assets/images/ctrl-btn-menu.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-tv {
    background: url(../../assets/images/ctrl-btn-tv.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-back {
    background: url(../../assets/images/ctrl-btn-back.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-poweroff {
    background: url(../../assets/images/ctrl-poweroff.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-auto {
    background: url(../../assets/images/ctrl-btn-auto.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-hwind {
    background: url(../../assets/images/ctrl-btn-hwind.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-mwind {
    background: url(../../assets/images/ctrl-btn-mwind.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-lwind {
    background: url(../../assets/images/ctrl-btn-lwind.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-hot {
    background: url(../../assets/images/ctrl-btn-hot.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-cool {
    background: url(../../assets/images/ctrl-btn-cool.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-wind {
    background: url(../../assets/images/ctrl-btn-wind.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-wet {
    background: url(../../assets/images/ctrl-btn-wet.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-voladd {
    background: url(../../assets/images/ctrl-mute-1.png) center no-repeat;
    background-size: 100%;
  }

  .ctrl-btn-volreduce {
    background: url(../../assets/images/ctrl-volreduce.png) center no-repeat;
    background-size: 100%;
  }
</style>
