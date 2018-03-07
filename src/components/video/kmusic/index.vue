<template>
  <div>
    <!--style="background-color: #fff;"-->

    <x-header :left-options="{showBack:false}" title="slot:overwrite-title">
      <div class="overwrite-title-demo" slot="overwrite-title">

        <marquee style="margin-top: 8px;" :interval="3000">
          <marquee-item class="align-middle" v-if="open">
            <div style="text-align: center; font-size: 14px;color:#6E6E6E;">
              您已开通K歌功能
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
              未开通K歌功能
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


    <view-box ref="box">

      <div v-if="iscat" style="position:absolute;z-index: 3;background: #fff;width: 100%;top: 37px;">
        <flexbox :gutter="0" wrap="wrap" style="text-align: center;background: gray;padding: 10px 0px;">
          <flexbox-item :span="1/3" style="padding: 5px 0;" v-for="list in catlist">
            <x-button @click.native="remusiccat(list.id)" mini>{{list.name}}</x-button>
          </flexbox-item>
        </flexbox>
      </div>

      <flexbox class="top">

        <div>
          <x-button style="width:80px;margin-left: 5px;" v-if="!showsearch" @click.native="showcat" mini>分类</x-button>
        </div>

        <search ref="search" placeholder="歌曲名称" @on-change="setkeyword"
                @on-submit="research" @on-focus="searchshow" @on-cancel="searchhide">
        </search>

        <div ref="histroy" v-if="!showsearch" class="histroy_btn"
             v-on:click="histroyshow"/>

      </flexbox>


      <scroller v-if="!showsearch" :pullup-config="upconfig" :pulldown-config="downconfig"
                @on-pulldown-loading="revideo"
                @on-pullup-loading="addvideo"
                @on-scroll="savetop"
                :use-pulldown="true" :use-pullup="true" ref="scroller" height="-83" lock-x :scrollbar-x=false
                :scrollbar-y=false
                style="width: 100%;top: 37px;">
        <div>
          <div v-if="vodlist.length == 0" class='loading'>
              <span style='color:#B6B6B6;display: block;padding-top: 120px;'>
                暂无数据
              </span>
          </div>
          <div class='film' v-for="(item,index) in vodlist" v-on:click="toplay(item)">

            <div style='display:flex;'>
              <div class='vodimage'>

              </div>
              <div class='detail'>
                <div class='name'>
                  <div>{{item.name}}
                  </div>

                </div>
                <div class='star-bottom'>
                  <div class='type'>
                    {{item.singer_list}}
                  </div>
                  <div class='time'>
                    <!--<div class='price'>{{item.singer_list}}-->
                    <!--</div>-->
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
        <load-more v-if="nodata" :show-loading="false" tip="这是底线" background-color="#fbf9fe"></load-more>
      </scroller>


      <div v-bind:hidden="!showhistroy" style="position:absolute;z-index: 3;background: #fff;width: 100%;top: 37px;">
        <cell title="已点歌曲" is-link link="/kmusic/nowplay">
          <img slot="icon" width="20" style="display:block;margin-right:5px;"
               src="../../../assets/images/histroy_icon.png">
        </cell>
      </div>

      <scroller :pullup-config="upconfig" :pulldown-config="downconfig"
                @on-pulldown-loading="research"
                @on-pullup-loading="addsearch"
                @on-scroll="savevodlist"
                :use-pulldown="true" :use-pullup="true" ref="scroller1" height="-90" lock-x :scrollbar-x=false
                :scrollbar-y=false
                style="z-index: 2;width: 100%;top: 37px;" :hidden="!showsearch">

        <div>
          <div v-if="searchlist.length == 0" class='loading'>
              <span style='color:#B6B6B6;display: block;padding-top: 120px;'>
                暂无数据
              </span>
          </div>

          <div class='film' v-for="(item,index) in searchlist" v-on:click="toplay(item)">

            <div style='display:flex;'>
              <div class='vodimage'>

              </div>
              <div class='detail'>
                <div class='name'>
                  <div>{{item.name}}
                  </div>

                </div>
                <div class='star-bottom'>
                  <div class='type'>
                    {{item.singer_list}}
                  </div>
                  <div class='time'>
                    <div class='price'>{{item.singer_list}}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
        <load-more v-if="searchnodata" :show-loading="false" tip="这是底线" background-color="#fbf9fe"></load-more>
      </scroller>

      <div v-transfer-dom>

        <popup v-model="show" height="270px" is-transparent>
          <div
            style="width: 95%;background-color:#fff;height:250px;margin:0 auto;border-radius:5px;padding-top:10px;">
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
    </view-box>
  </div>


</template>

<script>
  import {XHeader, Popup, Radio} from 'vux'
  import {Grid, GridItem, GroupTitle, Clocker, Marquee, MarqueeItem, XButton} from 'vux'

  import {Tab, TabItem, Scroller, XInput, FlexboxItem, Flexbox, Selector} from 'vux'
  import Search from "vux/src/components/search/index";
  import Cell from "vux/src/components/cell/index";
  import Group from "vux/src/components/group/index";
  import Toast from "vux/src/components/toast/index";
  import ViewBox from "vux/src/components/view-box/index";
  import LoadMore from "vux/src/components/load-more/index";
  import JQ from 'jquery';

  var that;
  var socket
  export default {
    name: "index",

    components: {
      LoadMore,
      ViewBox,
      Toast,
      Group,
      Cell,
      Search,
      Flexbox,
      FlexboxItem,
      XInput,
      Scroller,
      TabItem,
      Tab,
      JQ,
      Selector,
      XHeader,
      Clocker,
      Marquee,
      MarqueeItem,
      XButton,
      Popup,
      Radio,
    }, data() {
      return {
        iscat: false,
        open: false,
        timeExpire: '2018-03-04 12:00:00',
        hour: 3,
        hours: ['3', '6'],
        hoursValue: '3',
        show: false,
        defaultValue: 'qb',
        list: [{key: 'qb', value: '全部'}, {key: 'py', value: '拼音'}],
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

        nodata: false,
        searchnodata: false,
        catlist: [{id: '0', name: '全部'}, {id: '167', name: '热门'},
          {id: '166', name: '新歌'}, {id: '167', name: '流行'}, {id: '178', name: '男声'},
          {id: '179', name: '女生'}, {id: '191', name: '经典'}, {id: '171', name: '怀旧'}, {id: '162', name: 'DJ'},
          {id: '149', name: '国语'}, {id: '150', name: '粤语'}, {id: '152', name: '英语'}, {id: '153', name: '韩语'},
          {id: '189', name: '俄语'}, {id: '154', name: '日语'}, {id: '158', name: '儿歌'}, {id: '175', name: '其他'}],//电影分类
        vodlist: [],//电影列表
        searchlist: [],//电影搜索
        cid: '',
        cat_width: screen.availWidth,//电影分类长度

        onFetching: false,
        page: 1,
        limit: 10,


        showsearch: false,

        keyword: '',
        searchpage: 1,
        searchlimit: 10,
        showhistroy: false,

        clickbuy: false,

        histroy_n: '',
        histroy_p: '',
        savevodcatpos: 0,
      }
    }, destroyed() {
      var that = this;
      that.common.currentlistktv = that.vodlist
    }
    , mounted() {
      that = this;
      that.checkOpen();

      socket = window.dqsocket


      if (that.common.currentlistktv != null) {

        that.vodlist = that.common.currentlistktv;
        that.page = Math.ceil(that.vodlist.length / that.limit)
        setTimeout(function () {
          that.$refs.scroller.reset({
            top: that.common.savevodlistktv
          })
          if (that.vodlist.length < that.limit) {
            that.$refs.scroller.disablePullup()
          }
          that.$refs.scroller.donePulldown()
          that.$refs.scroller.donePullup()
        }, 1)


      } else {

        that.revideo()
      }


    }, methods: {
      remusiccat(id) {
        var that = this
        that.page = 1
        that.getvideo(id)
      },
      showcat() {
        var that = this
        console.log(that.catlist.length)
        this.iscat = !this.iscat
      },
      otherbuy() {
        try {
          var h = this.hour
          if (parseInt(h) > 0 && parseInt(h) < 24) {
            this.$router.push("/video/otherbuy?type=3&hour=" + this.hour)
          } else {
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
        that.api_post("api/module/countdown?type=3", function (res) {
          that.open = true;
          that.timeExpire = new Date().getTime() + res.data.count;
          console.log('timeExpire', that.timeExpire)
        }, function () {
          that.open = false;
        })
      },
      finish() {
        this.checkOpen();
      },
      savetop(res) {

        var that = this;
        if (res.top != 0) {
          that.common.savevodlistktv = res.top
        }
      },
      histroyshow() {//显示已点歌曲

        var that = this
        that.showhistroy = !that.showhistroy
      },
      savevodcat(res) {
        // var that = this;
        // that.common.savevodcat = res.left
      },
      savevodlist(res) {
        // var that = this;
        // that.common.savevodlist = res.top
      }, revideo() {
        that.page = 1;
        that.getvideo()
      }
      , getvideo(id) {
        var top = ""
        if (id != null) {
          top = "&top=" + id
        }
        that.$vux.loading.show({
          text: 'Loading'
        });

        var url = "http://" + localStorage.getItem("hs") + "/if/song_list.php?page=" + that.page + "&pagesize=" + that.limit  + top;
        console.log(url);
        that.$http.get(url).then(function (res) {


          var styles = JQ(res.bodyText.replace(/param/g, "p")).find("list[name='song_list'] entry")
          var host = JQ(res.bodyText.replace(/param/g, "p")).find("seg[id='song_list']").find("[name='poster']").html()

          console.log(res)

          var list = [];
          JQ(styles).each(function (i, e) {
            var el = {};
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
          });


          if (that.page == 1) {
            that.vodlist = list;

            that.$refs.scroller.reset({
              top: 0
            });
            that.$refs.scroller.donePulldown()

          } else {
            for (var i = 0; i < list.length; i++) {
              that.vodlist.push(list[i])
            }
            that.$refs.scroller.donePullup();
            that.$refs.scroller.reset()
          }
          if (list.length == 0) {
            that.$refs.scroller.disablePullup();
            if (that.page != 1) {
              that.nodata = true
            }
          } else {
            that.nodata = false;
            that.$refs.scroller.enablePullup()
          }
          if (list.length < that.limit && that.page == 1) {
            that.$refs.scroller.disablePullup()
          }

          that.$vux.loading.hide()
          console.log(that.vodlist)

        })
        if (that.iscat) {
          this.iscat = !this.iscat
        }
      }, addvideo() {//影片下拉加载
        that.page = that.page + 1;
        that.getvideo()
      }, searchshow() {//聚焦输入框
        that.showsearch = true;
        that.showhistroy = false;
        if (that.searchlist.length < that.searchlimit && that.searchpage == 1) {
          that.$refs.scroller1.disablePullup()
        }
      }, searchhide() {//点击取消
        that.showsearch = false
      }, setkeyword(res) {//输入关键词
        that.keyword = res;
        that.research2()
      }, research() {//搜索下拉刷新
        this.$refs.search.setBlur();
        that.searchpage = 1;
        that.getsearch()
      }, research2() {//搜索下拉刷新
        that.searchpage = 1;
        that.getsearch()
      }, addsearch() {//搜索上拉加载更多
        that.searchpage = that.searchpage + 1;
        that.getsearch()
      }, getsearch() {
        var keyword = "";
        if (that.keyword.trim() != "") {
          that.$vux.loading.show({
            text: 'Loading'
          });


          var url = "http://" + localStorage.getItem("hs") + "/if/song_list.php?page=" + that.searchpage + "&pagesize=" +
            that.searchlimit + "&keyword=" + that.keyword;
          console.log(url);
          that.$http.get(url).then(function (res) {


            var styles = JQ(res.bodyText.replace(/param/g, "p")).find("list[name='song_list'] entry")
            var host = JQ(res.bodyText.replace(/param/g, "p")).find("seg[id='song_list']").find("[name='poster']").html()

            console.log(res)

            var list = [];
            JQ(styles).each(function (i, e) {
              var el = {};
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
            });


            if (that.searchpage == 1) {
              that.searchlist = list;
              that.$refs.scroller1.reset({
                top: 0
              });
              that.$refs.scroller1.donePulldown()
            } else {
              for (var i = 0; i < list.length; i++) {
                that.searchlist.push(list[i])
              }
              that.$refs.scroller1.donePullup();
              that.$refs.scroller1.reset()
            }

            if (list.length == 0) {
              that.$refs.scroller1.disablePullup();
              if (that.page != 1) {
                that.searchnodata = true
              }
            } else {
              that.searchnodata = false;
              that.$refs.scroller1.enablePullup()
            }
            if (list.length < that.searchlimit && that.page == 1) {
              that.$refs.scroller1.disablePullup()
            }

            that.$vux.loading.hide()
          })

        } else {
          //输入空
          if (that.searchpage == 1) {
            that.$refs.scroller1.reset({
              top: 0
            });
            that.$refs.scroller1.donePulldown()
          }
        }


      },
      buy(list) {// 购买&播放
        if (!that.clickbuy) {
          that.clickbuy = true;
          that.current.video = list;
          that.current.vid = list.id;
          if (list.paid) {// 播放
            that.Play(list.id);
          } else {// 购买
            that.$router.push("/video/buy?id=" + list.lib_id)

          }
          setTimeout(() => {
            that.clickbuy = false
          }, 2000)
        }
      }, toplay(list) {
        // console.log(list)
        // 立即播放（参数：song_id=节目编号&type=164节目类型&cloud=是否云播放&first=Y/N是否插播&player=）;
        if (that.open) {
          this.common.playvideo = list
          localStorage.setItem("playtype", 3)
          localStorage.setItem("playname", list.name)

          that.$vux.confirm.show({
            title: "温馨提示",
            content: "",
            confirmText: "播放",
            cancelText: "添加",
            onCancel() {
              var cm = "cmd=ktv_play&song_id=" + list.id + "&type=164" + "&cloud=N&first=Y&player=";
              that.sendcmd(cm)
            },
            onConfirm() {
              var cm = "cmd=ktv_play&song_id=" + list.id + "&type=164" + "&cloud=N&first=N&player=";
              that.sendcmd(cm)

            }
          })
        } else {
          that.$vux.toast.text("请先开通", "center")
        }


      }, sendcmd(cmd) {
        // alert(cmd)
        window.dqsocket.send(cmd)

      }, ctrl() {
        // this.common.playtype = 3
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
  .vux-search-fixed {
    top: 46px !important;
  }

  .top {
    height: 36px;
    line-height: 36px;
    display: flex;
    background: #fff;
    border-bottom: 1px solid #efeff4;
    position: absolute;

  }

  .seacher_input {
    margin-top: 3px;
    margin-bottom: 3px;
    flex: 1;
    font-size: 14px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .seacher_btn {
    width: 20px;
    height: 20px;
    padding: 8px;
    background: url("../../../assets/images/search.png");
    background-size: 20px;
    background-repeat: no-repeat;
    background-position: center;
    border-right: 1px solid #efeff4;
  }

  .seacher_btn:active {
    width: 20px;
    height: 20px;
    padding: 8px;
    background: url("../../../assets/images/search_p.png");
    background-size: 20px;
    background-repeat: no-repeat;
    background-position: center;
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

  .histroy_btn_p {
    border-left: 1px solid #efeff4;
    width: 20px;
    height: 20px;
    padding: 8px;
    background: url("../../../assets/images/menu_p.png");
    background-size: 20px;
    background-repeat: no-repeat;
    background-position: center;
  }

  /* 电影list */

  .film {
    background: #fff;
    padding: 8px 10px;
    border-bottom: 1px solid #efeff4;
  }

  .film:active {
    background: #ECECEC;
  }

  .vodimage {
    height: 50px;
  }

  .vodimage img {
    margin-right: 10px;
    width: 70px;
    height: 100%;
  }

  .detail {
    flex: 1;
    position: relative;
    top: 0;
    left: 0;
  }

  .name {
    display: flex;
    max-width: 80%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .name div {
    height: 16px;
    font-size: 16px;
    line-height: 16px;
  }

  .times {
    position: absolute;
    right: 0px;
    color: #3f9de7;
    font-size: 14px;
  }

  .star-bottom {
    position: absolute;
    bottom: 0;
    width: 100%;
  }

  .type {
    font-size: 14px;
    margin-top: 6px;
    color: #666;
    width: auto;
    max-width: 80%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .time {
    margin-bottom: 6px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    font-size: 14px;
    color: #666;
    width: auto;
    max-width: 80%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .price {
    position: absolute;
    right: 0px;
    bottom: 15px;
    font-size: 15px;
  }

  .star {
    height: 14px;
    font-size: 14px;
    line-height: 14px;
    color: #666;
    width: auto;
    max-width: 80%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .buy {
    float: right;
    position: absolute;
    right: 0;
    bottom: 0;
    background: red;
    font-size: 10px;
    width: 50px;
    height: 23px;
    line-height: 23px;
    text-align: center;
    color: #fff;
    border-radius: 5px;
  }

  .buy:active {
    background: #ECECEC;
  }

  .play {
    float: right;
    color: #fff;
    position: absolute;
    right: 0;
    bottom: 0;
    background: #3f9de7;
    font-size: 10px;
    width: 50px;
    height: 23px;
    line-height: 23px;
    text-align: center;
    border-radius: 5px;
  }

  .play:active {
    background: #ECECEC;
  }

  .loading {
    height: 80px;
    /* line-height: 80px; */
    align-items: center;
    text-align: center;
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
