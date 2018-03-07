<template>
  <div>

    <div v-if="common.hotel!=null">
      <view-box ref="box">

        <x-header slot="header" :left-options="{showBack:false}" title="已点歌曲">
          <div slot="left">
            <div v-if="!isedit" style="padding-bottom: 10px;">
              <x-button :gradients="['#3F9DE7','#3F9DE7']" @click.native="switch_song" mini>切歌</x-button>
            </div>
          </div>
          <div slot="right">
            <div v-if="!isedit" style="padding-bottom: 10px;">
              <x-button :gradients="['#3F9DE7','#3F9DE7']" @click.native="edit" mini>排序</x-button>
            </div>
            <div v-if="isedit" style="padding-bottom: 10px;">
              <x-button :gradients="['#3F9DE7','#3F9DE7']" @click.native="canedit" mini>确定</x-button>
            </div>
          </div>
        </x-header>
        <scroller v-bind:hidden="showsearch" :pullup-config="upconfig" :pulldown-config="downconfig"
                  @on-pulldown-loading="revideo"
                  @on-pullup-loading="addvideo"
                  @on-scroll="savetop"
                  :use-pulldown="true" :use-pullup="true" ref="scroller" height="-53" :lock-x="true" :lock-y="isedit" :scrollbar-x=false
                  :scrollbar-y=false
                  style="width: 100%;top:1px;">
          <div>
            <div v-if="vodlist.length == 0" class='loading'>
              <span style='color:#B6B6B6;display: block;padding-top: 120px;'>
                暂无数据
              </span>
            </div>
            <div class='film' >
              <div  class="item" style='display:flex;'>
                <div class='vodimage'>

                </div>
                <div class='detail'>
                  <div class='name'>
                    <div>{{vodlist[0].name}}
                    </div>

                  </div>
                  <div class='star-bottom'>
                    <div class='type'>
                      {{vodlist[0].singer}}
                    </div>
                    <div class='time'>
                      <div class='price'>正在播放...
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
                <swipeout>
                  <draggable  :list="vodlist" :move="getdata" @update="datadragEnd" :options="{animation: 100,handle:'.td'}">
                  <swipeout-item v-for="(item,index) in vodlist" v-if="item.sequence != 0" :ref="'swipeoutItem' + item.id" :right-menu-width="210" :sensitivity="15">
                    <div slot="right-menu">
                      <swipeout-button @click.native="totop(item.id)" type="primary" :width="70">置顶</swipeout-button>
                      <swipeout-button @click.native="deletes(item.id)" type="warn" :width="70">删除</swipeout-button>
                      <!--<swipeout-button @click.native="onButtonClick('ignore')" type="default" :width="70">取消</swipeout-button>-->
                    </div>
                    <div slot="content" class='film' >

                    <div  class="item" style='display:flex;'>
                        <div class='vodimage'>

                        </div>
                        <div class='detail'>
                         <div class='name'>
                         <div>{{item.name}}
                         </div>

                  </div>
                  <div class='star-bottom'>
                    <div class='type'>
                      {{item.singer}}
                    </div>
                    <div class='time'>
                      <!--<div class='price'>{{item.singer}}-->
                      <!--</div>-->
                      <div class="td" v-if="isedit && item.sequence != 0" >
                        <img src="../../../assets/images/td.png" style="-webkit-touch-callout:none;" width="25"/>
                      </div>
                    </div>

                  </div>
                        </div>
</div>
                        </div>
                  </swipeout-item>
                  </draggable>
                </swipeout>
          </div>
          <load-more v-if="nodata" :show-loading="false" tip="这是底线" background-color="#fbf9fe"></load-more>
        </scroller>
      </view-box>
    </div>

  </div>
</template>

<script>
  import {Tab, TabItem, Scroller, XInput, FlexboxItem, Flexbox, Selector,XHeader,Swipeout, SwipeoutItem, SwipeoutButton} from 'vux'
  import Search from "vux/src/components/search/index";
  import Cell from "vux/src/components/cell/index";
  import Group from "vux/src/components/group/index";
  import XButton from "vux/src/components/x-button/index";
  import Toast from "vux/src/components/toast/index";
  import ViewBox from "vux/src/components/view-box/index";
  import LoadMore from "vux/src/components/load-more/index";
  import JQ from 'jquery';
  import draggable from 'vuedraggable'
  import Sortable  from 'sortablejs'

  var that;
  var socket;
  export default {
    name: "index",

    components: {
      LoadMore,
      ViewBox,
      Toast,
      XButton,
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
      draggable,
      Sortable,
      XHeader,
      Swipeout,
      SwipeoutItem,
      SwipeoutButton
    }, data() {
      return {
        editid:0,
        isedit:false,
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

        catlist: {},//电影分类
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
      that.common.currentlistktvp = that.vodlist
    }
    , mounted() {
      socket = window.dqsocket
      that = this;

      if (that.common.currentlistktvp != null) {

        that.vodlist = that.common.currentlistktvp;
        that.page = Math.ceil(that.vodlist.length / that.limit)
        setTimeout(function () {
          that.$refs.scroller.reset({
            top: that.common.savevodlistktvp
          })
          if (that.vodlist.length < that.limit) {
            that.$refs.scroller.disablePullup()
          }
        }, 1)


      } else {

        that.revideo()
      }


    }, methods: {

      edit:function () {       // 编辑排序
        this.isedit = true;
        this.$refs.scroller.reset()
      },
      canedit:function () {       // 取消编辑
        this.isedit = false
        this.$refs.scroller.reset()

      },
      getdata: function(evt){     //当前移动
        console.log(evt.draggedContext.element.id);
        this.editid = evt.draggedContext.element.id
      },
      datadragEnd:function(evt){
        console.log('拖动前的索引：'+evt.oldIndex);
        console.log('拖动后的索引：'+evt.newIndex);
        var url = "http://" + localStorage.getItem("hs") + "/if/song_playlist_change.php?sn=" + localStorage.getItem("sn") + "&id=" + this.editid+
                  "&seq=" + evt.newIndex;
        console.log(url);
        that.$http.get(url).then(function (res) {
            console.log("song_playlist_change res:",res)
        });
      },
      totop:function (id) {    //置顶
        console.log(id)
      },
      deletes:function (id) {    //删除
        console.log(id)
      },
      switch_song:function () {    //切歌

      },
      savetop(res) {

        var that = this;
        if (that.isedit){
          that.$refs.scroller.reset({
            top: that.common.savevodlistktvp
          })
          return false;
        }
        if (res.top != 0) {
          that.common.savevodlistktvp = res.top
        }

      },
      revideo() {
        that.page = 1;
        that.getvideo()
      }, getvideo() {
        that.$vux.loading.show({
          text: 'Loading'
        });

        var url = "http://" + localStorage.getItem("hs") + "/if/song_playlist_list.php?page=" + that.page + "&pagesize=" + that.limit + "&type=1&sn=" + localStorage.getItem("sn");
        console.log(url);
        that.$http.get(url).then(function (res) {


          var styles = JQ(res.bodyText.replace(/param/g, "p")).find("list[name='playlist'] entry")
          var host = JQ(res.bodyText.replace(/param/g, "p")).find("seg[id='playlist']").find("[name='poster']").html()

          console.log(res)

          var list = [];
          JQ(styles).each(function (i, e) {
            var el = {};
            el.id = JQ(e).find("[name='id']").html()
            el.sequence = JQ(e).find("[name='sequence']").html()
            el.song_id = JQ(e).find("[name='song_id']").html()
            el.flag_cloud = JQ(e).find("[name='flag_cloud']").html()
            // el.player = JQ(e).find("[name='player']").html().
            // el.play_time = JQ(e).find("[name='play_time']").html()
            el.name = JQ(e).find("[name='name']").html()
            list.push(el)
          });


          if (that.page == 1) {
            for(var i = 0; i < 10;i++){
              var item =  {}
              item.id = i
              item.name = '歌曲' + i;
              item.singer = '歌手' + i;
              item.sequence = i;
              list.push(item)
            }
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

        },function () {

          // that.$vux.loading.hide()
        })

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

        this.common.playvideo = list
        localStorage.setItem("playtype", 4)
        localStorage.setItem("playname", list.name)

        this.common.playtype = 4
        this.$router.push("/video/ctrl")

      }
    }
  }
</script>

<style scoped>


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
    right: 20px;
    bottom: 15px;
    font-size: 15px;
    color: #3f9de7;
  }

  .td {
    position: absolute;
    right: 0px;
    bottom: 8px;
    font-size: 15px;
    -webkit-touch-callout:none;
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
