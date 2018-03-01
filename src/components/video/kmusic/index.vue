<template>
  <div>
    <view-box>

      <!--<flexbox class="kmtop">-->
        <!--<search ref="search" placeholder="输入歌曲名称" @on-change="setkeyword"-->
                <!--@on-submit="research" @on-focus="searchshow" @on-cancel="searchhide" >-->
        <!--</search>-->

        <!--<div ref="histroy" v-bind:hidden="showsearch" class="histroy_btn"-->
             <!--v-on:click="histroyshow"/>-->
      <!--</flexbox>-->


      <group title="K歌列表"/>
      <scroller :pullup-config="upconfig" :pulldown-config="downconfig"
      @on-pulldown-loading="relist"
      @on-pullup-loading="addlist"
      :use-pulldown="true" :use-pullup="true" ref="scroller" height="-30" lock-x :scrollbar-x=false
      :scrollbar-y=false
      >
      <div>
      <div v-if="kmusiclist.length == 0" class='loading'>
      <span style='color:#B6B6B6;display: block;padding-top: 120px;'>
      暂无数据
      </span>
      </div>

      <cell v-for="(list,index) in kmusiclist" :title="(index+1)+'.'+ list.name" @click.native="toplay(list)"
      is-link>
      {{list.singer_list}}
      </cell>
      </div>
      <load-more v-if="nodata" :show-loading="false" tip="这是底线" background-color="#fbf9fe"></load-more>
      </scroller>

      <div v-bind:hidden="!showhistroy" style="position:absolute;z-index: 3;background: #fff;width: 100%;top: 37px;">

        <cell title="已点歌曲" is-link link="/nowplay">
          <img slot="icon" width="20" style="display:block;margin-right:5px;"
               src="../../../assets/images/ispay_icon.png">
        </cell>

      </div>
    </view-box>
  </div>
</template>

<script>
  import ViewBox from "vux/src/components/view-box/index";
  import Cell from "vux/src/components/cell/index";
  import JQ from 'jquery';
  import Group from "vux/src/components/group/index";
  import Scroller from "vux/src/components/scroller/index";
  import LoadMore from "vux/src/components/load-more/index";
  import Search from "vux/src/components/search/index";

  var socket
  export default {
    components: {
      Search,
      LoadMore,
      Scroller,
      Group,
      Cell,
      ViewBox
    },
    name: "index",
    data() {
      return {
        kmusiclist: [],
        page: 1,
        limit: 13,
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
        }, options: {},
        showhistroy: false,
      }
    }
    // , destroyed() {
    //   socket.disconnect()
    // }
    , mounted() {
      var that = this
      this.getkmusiclist();

      if (localStorage.getItem("ws") != "") {
        that.options = {host: localStorage.getItem("ws")}
      } else {
        that.$vux.toast.text("连接客户端失败", 'center')
        return
      }

      var ws = "ws://" + this.options.host
      socket = new WebSocket(ws, 'dumb-increment-protocol');
      socket.onopen = function (msg) {
        console.log(msg)
        // that.$vux.toast.text("连接客户端成功", 'center')

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

      }
      socket.onclose = function (msg) {
        that.$vux.toast.text("与服务器失去连接，请检查网络。", 'center')
      }
    }
    , methods: {
    setkeyword(res) {//输入关键词
      that.keyword = res;
    },
    histroyshow() {//显示已点歌曲

      var that =this
      that.showhistroy = !that.showhistroy
    },
    getkmusiclist() {
      var that = this
      var url = "http://" + localStorage.getItem("hs") + "/if/song_list.php?page=" + that.page + "&pagesize=" + that.limit
      // console.log(url)
      that.$http.get(url).then(function (res) {
        var styles = JQ(res.bodyText.replace(/param/g, "p")).find("list[name='song_list'] entry")
        var host = JQ(res.bodyText.replace(/param/g, "p")).find("seg[id='song_list']").find("[name='poster']").html()
        var list = []
        JQ(styles).each(function (i, e) {
          var el = {}
          el.id = JQ(e).find("[name='id']").html()
          el.lib_id = JQ(e).find("[name='lib_id']").html()
          el.name = JQ(e).find("[name='name']").html()
          el.list_poster = JQ(e).find("[name='list_poster']").html()
          el.singer_list = JQ(e).find("[name='singer_list']").html().split("|")[1]
          el.flag_cloud = JQ(e).find("[name='flag_cloud']").html()
          el.flag_hd = JQ(e).find("[name='flag_hd']").html()
          el.flag_new = JQ(e).find("[name='flag_new']").html()
          el.flag_hot = JQ(e).find("[name='flag_hot']").html()
          el.flag_mv = JQ(e).find("[name='flag_mv']").html()
          el.create_time = JQ(e).find("[name='create_time']").html()
          el.dl_status = JQ(e).find("[name='dl_status']").html()
          el.dl_percent = JQ(e).find("[name='dl_percent']").html()
          list.push(el)
        })
        if (that.page == 1) {
          that.kmusiclist = list
          that.resettop()
        } else {
          for (var i = 0; i < list.length; i++) {
            that.kmusiclist.push(list[i])
          }
          that.$refs.scroller.donePullup()
          // that.$refs.scroller.reset()
        }


        if (that.page != 1) {
          that.nodata = true
        }
        if (list.length < that.limit) {
          console.log("=========================")
          that.$refs.scroller.disablePullup()
        } else if (list.length == that.limit) {
          that.nodata = false
          that.$refs.scroller.enablePullup()
        }


        that.$vux.loading.hide()
        console.log("************", that.kmusiclist)
      }, function (res) {
      })

    }, relist() {
      var that = this
      that.page = 1;
      that.getkmusiclist()
    }, addlist() {
      var that = this
      that.page = that.page + 1;
      that.getkmusiclist()
    }, resettop() {
      var that = this
      setTimeout(() => {
        that.$refs.scroller.reset({
          top: 0
        })
        that.$refs.scroller.donePulldown()
      }, 1 * 500)
    }, toplay(list) {
      // console.log(list)
      // 立即播放（参数：song_id=节目编号&type=164节目类型&cloud=是否云播放&first=Y/N是否插播&player=）;
      this.common.playvideo = list
      localStorage.setItem("playtype", 3)
      localStorage.setItem("playname", list.name)
      var cm = "cmd=ktv_play&song_id=" + list.id + "&type=164" + "&cloud=N&first=Y&player=";
      // alert(cm)
      this.sendcmd(cm)
    }, sendcmd(cmd) {
      // var cmd = "cmd=poweroff"
      // alert(cmd)
      socket.send(cmd)
      this.common.playtype = 3
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

  .kmtop {
    height: 36px;
    line-height: 36px;
    display: flex;
    background: #fff;
    border-bottom: 1px solid #efeff4;
    /*position: absolute;*/

  }

  .histroy_btn {
    border-left: 1px solid #efeff4;
    width: 20px;
    height: 20px;
    padding: 8px;
    background: url("../../../assets/images/menu.png");
    background-size: 20px;
    background-repeat: no-repeat;
    background-position: center;
  }

  .histroy_btn:active {
    border-left: 1px solid #efeff4;
    width: 20px;
    height: 20px;
    padding: 8px;
    background: url("../../../assets/images/menu_p.png");
    background-size: 20px;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>


<style>

  .weui-search-bar {
    position: relative;
    padding: 0px 0px !important;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #fff !important;
  }

  .weui-search-bar:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 0px solid #D7D6DC !important;
    color: #fff !important;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  .weui-search-bar__label {
    /*默认显示搜索框*/
    position: absolute;
    top: 0px !important;
    right: 0px !important;
    bottom: 0px !important;
    left: 0px !important;
    padding-left: 8px;
    z-index: 2;
    border-radius: 0px !important;
    text-align: left !important;
    color: #9B9B9B !important;
  }

  .weui-search-bar__form:after {
    /*点击搜索框后*/
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 200%;
    height: 200%;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    border-radius: 0px !important;
    border: 10px solid #E6E6EA;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .weui-search-bar__box .weui-icon-search {
    /*搜索图标*/
    position: absolute;
    left: 8px !important;
    top: 5px !important;
    line-height: 28px;
  }

  .weui-search-bar__box .weui-icon-clear {
    /*清除内容*/
    position: absolute;
    top: 5px !important;
    right: 0;
    padding: 0 10px;
    line-height: 28px;
  }

  .weui-icon-clear {
    /*清除内容*/
    color: #B2B2B2;
    font-size: 14px;
  }

  .weui-search-bar__cancel-btn {
    /*取消按钮*/
    display: none;
    margin-left: 0px !important;
    margin: 5px 10px !important;
    line-height: 28px;
    color: #3f9de7 !important;
    white-space: nowrap;

  }


</style>

