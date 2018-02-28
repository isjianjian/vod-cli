<template>
  <div>
    <view-box>
      <flexbox orient="vertical" style="height:100%; overflow:hidden;" :gutter="0">

        <flexbox-item :span="1/5" class="flex-demo">
          <flexbox style="margin-top: 20px;">
            <flexbox-item class="flex-demo">
              <img class="ico-size" src="../../assets/images/cl_info_n.png" v-on:click="info"></img>
            </flexbox-item>
            <flexbox-item class="flex-demo">
            </flexbox-item>
            <flexbox-item class="flex-demo">
              <img class="ico-size" src="../../assets/images/cl_novol_n.png" v-on:click="jinyin"></img>
            </flexbox-item>
          </flexbox>
        </flexbox-item>


        <flexbox-item :span="2/5" class="flex-demo">
          <img class="ico-menu-size" src="../../assets/images/cl_menu.png" usemap="planetmap"></img>

          <map name="planetmap" id="planetmap">
            <area shape="rectangle" coords="76,0,144,76" v-on:click="vol_jia" alt="vol_jia"/>
            <area shape="rectangle" coords="76,144,144,220" v-on:click="vol_jian" alt="vol_jian"/>

            <area shape="rectangle" coords="0,76,76,144" v-on:click="rewind" alt="rewind"/>
            <area shape="rectangle" coords="144,76,220,144" v-on:click="forward" alt="forward"/>

            <area shape="rectangle" coords="76,76,144,144" v-on:click="pause" alt="pause"/>
          </map>

          <!--<flexbox orient="vertical">-->
          <!--<flexbox-item class="flex-demo">-->
          <!--<img class="up" src="../../assets/images/cl_voljia.png" v-on:click="vol_jia"></img>-->
          <!--</flexbox-item>-->
          <!--<flexbox-item class="flex-demo">-->
          <!--<img class="left" src="../../assets/images/cl_rewind.png" v-on:click="rewind"></img>-->
          <!--<img class="ok" src="../../assets/images/cl_pause.png" v-on:click="pause"></img>-->
          <!--<img class="right" src="../../assets/images/cl_forward.png" v-on:click="forward"></img>-->
          <!--</flexbox-item>-->
          <!--<flexbox-item class="flex-demo">-->
          <!--<img class="down" src="../../assets/images/cl_voljian.png" v-on:click="vol_jian"></img>-->
          <!--</flexbox-item>-->
          <!--</flexbox>-->
        </flexbox-item>

        <flexbox-item :span="1/5" class="flex-demo" style="padding: 20px 0">

          <flexbox>
            <flexbox-item>
              <cell :inline-desc="'当前: '+data+'%'" primary="content">
              </cell>

              <range v-model="data" :range-bar-height="4" @on-change="changedata"></range>
            </flexbox-item>
          </flexbox>
        </flexbox-item>

        <flexbox-item :span="1/5" class="flex-demo" style="padding-top: 20px;">
          <flexbox>
            <flexbox-item class="flex-demo">
              <img class="ico-size" src="../../assets/images/cl_zimu_n.png" v-on:click="zimu"></img>

            </flexbox-item>
            <flexbox-item class="flex-demo">
              <img class="ico-size" src="../../assets/images/cl_yingui_n.png" v-on:click="yingui"></img>
            </flexbox-item>
            <flexbox-item class="flex-demo">
              <img class="ico-size" src="../../assets/images/cl_info_n.png" v-on:click="info"></img>
            </flexbox-item>
          </flexbox>
        </flexbox-item>

        <flexbox-item :span="1/5" class="flex-demo" style="padding-top: 20px;">
          <flexbox>
            <flexbox-item class="flex-demo">
              <img class="ico-size" src="../../assets/images/cl_zimu_n.png" v-on:click="zimu"></img>

            </flexbox-item>
            <flexbox-item class="flex-demo">
              <img class="ico-size" src="../../assets/images/cl_yingui_n.png" v-on:click="yingui"></img>
            </flexbox-item>
            <flexbox-item class="flex-demo">
              <div><div>字幕</div><img class="ico-size" src="../../assets/images/cl_info_n.png" v-on:click="info"></img></div>

            </flexbox-item>
          </flexbox>
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

  var socket;
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
        options: {
          host:
            "192.168.44.123:9000"
        },

        restype: {},
        duration: 0,
      }
    }, mounted() {
      // this.$router.currentRoute.query.
      var that = this;
      that.restype = 1;

      var ws = "ws://" + this.options.host;
      socket = new WebSocket(ws, 'dumb-increment-protocol');
      socket.onopen = function (msg) {
        console.log(msg);
        that.$vux.toast.text("连接客户端成功", 'center')
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

        that.duration = that.getStrValue("duration", msg.data, "1")
      };
      socket.onclose = function (msg) {
        that.$vux.toast.text("与服务器失去连接，请检查网络。", 'center')
      }


    }, methods: {
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

      info() {
        // socket.send("cmd=movie_play")
        socket.send("cmd=ktv_vol&value=0")
        // this.sendml("86")
      }, jinyin() {
        // this.sendml("164")

        socket.send("cmd=ktv_vol&value=0")
      },
      jindu() {
        this.sendml("991")
      },
      yingui() {
        this.sendml("992")
      },
      zimu() {
        this.sendml("993")
      },
      vol_jia() {
        console.log("vol_jia");
        this.sendml("24")
      },
      vol_jian() {
        console.log("vol_jian");
        this.sendml("25")
      },
      rewind() {
        console.log("rewind");
        this.sendml("89")
      },
      forward() {
        console.log("forward");
        this.sendml("90")
      },
      pause() {
        console.log("pause");
        this.sendml("85");
      },
      changedata(res) {
        var that = this;
        that.data = res;
        console.log(that.data);
        if (that.current != null) {
          clearTimeout(that.current);
        }

        that.current = setTimeout(function (res) {
          // that.sendml("00," + that.data)
          socket.send("cmd=ktv_vol&value=0")
        }, 1000)


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
      }, getStrValue(fieldName, str, flag) {
        var fieldIndex = str.indexOf(fieldName + "=");
        var fieldRemain = str.substr(fieldIndex + 5, str.length);
        if (flag == "1")
          return fieldRemain.substr(0, fieldRemain.indexOf("&"));
        else {
          return fieldRemain.substr(0, str.length);
        }
      }
    }

  }
</script>

<style scoped>

  /*.flex-demo {*/
  /*text-align: center;*/
  /*color: #fff;*/
  /*background-color: #20b907;*/
  /*border-radius: 4px;*/
  /*background-clip: padding-box;*/
  /*}*/
  .flex-body {
    align-items: center;
  }

  .flex-demo {
    text-align: center;
  }

  .ico-size {
    width: 85px;
    height: 40px;
  }

  .ico-menu-size {
    width: 220px;
    height: 220px;
    /*left: 25%;*/
    /*top: 25%;*/
    margin: auto auto;

  }

  .up {
    width: 178px;
    height: 86px;
    position: absolute;
    left: 100px;
    top: 100px;
  }

  .down {
    width: 178px;
    height: 86px;
    position: absolute;
    left: 100px;
    top: 266px;
  }

  .left {
    width: 86px;
    height: 178px;
    position: absolute;
    left: 63px;
    top: 137px;
  }

  .right {
    width: 86px;
    height: 178px;
    position: absolute;
    right: 60px;
    top: 137px;
  }

  .ok {
    width: 110px;
    height: 110px;
    position: absolute;
    left: 135px;
    top: 171px;
  }
</style>
