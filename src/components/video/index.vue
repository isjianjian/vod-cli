<template>
  <div style="background-color: #fff;">
    <view-box>

      <flexbox class="top">
        <search ref="search" placeholder="输入片名、主演或导演" @on-change="setkeyword"
                @on-submit="research" @on-focus="searchshow" @on-cancel="searchhide"></search>

        <div v-bind:hidden="showsearch" class="histroy_btn" v-on:click="histroyshow"/>

      </flexbox>
      <!--分类-->
      <scroller v-bind:hidden="showsearch" lock-y :scrollbar-x=false :scrollbar-y=false
                style="position:absolute;width: 100%;top: 37px;">
        <tab bar-active-color="#3f9de7" :line-width="2" active-color='#3f9de7'
             v-bind:style="'width:'+cat_width +'px'">
          <tab-item v-for="(item,index) in catlist" @on-item-click="recat(item)" v-bind:selected="index==0">
            {{item.name}}
          </tab-item>
        </tab>
      </scroller>

      <scroller v-bind:hidden="showsearch" :pullup-config="upconfig" :pulldown-config="downconfig"
                @on-pulldown-loading="revideo"
                @on-pullup-loading="addvideo"
                :use-pulldown="true" :use-pullup="true" ref="scroller" height="-134" lock-x :scrollbar-x=false
                :scrollbar-y=false
                style="position:absolute;width: 100%;top: 81px;">
        <div>
          <div v-if="vodlist.length == 0" class='loading'>
              <span style='color:#B6B6B6'>
                暂无数据
              </span>
          </div>
          <div class='film' v-for="(item,index) in vodlist" v-on:click="detail(item)">

            <div style='display:flex;'>
              <div class='vodimage'>
                <img :src="item.pic"></img>
              </div>
              <div class='detail'>
                <div class='name'>
                  <div>{{item.name}}
                  </div>

                  <div class='times'>{{item.playAmount}}
                    <span style='font-size:12px'>次</span>
                  </div>

                </div>
                <div class='star-bottom'>
                  <div class='type'>
                    {{item.cName}}
                  </div>
                  <div class='time'>
                    <div>时长:{{item.length}}分钟</div>
                    <div class='price'>{{item.price}}
                      <span style='font-size:12px'>元</span>
                    </div>
                  </div>
                  <div class='star'>
                    主演:{{item.act}}
                  </div>
                </div>
                <div v-bind:class="item.paid?'play':'buy'" :buy="item" v-on:click="buy(item)">{{item.paid?'播放':'购买'}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <load-more v-if="nodata" :show-loading="false" tip="这是底线" background-color="#fbf9fe"></load-more>
      </scroller>


      <div v-bind:hidden="!showhistroy" style="position:absolute;z-index: 3;background: #fff;width: 100%;top: 37px;">
        <cell title="历史记录" is-link link="/record">
          <img slot="icon" width="20" style="display:block;margin-right:5px;"
               src="../../assets/images/histroy_icon.png">
        </cell>
        <cell title="已购买影片" is-link link="/bought">
          <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/images/ispay_icon.png">
        </cell>
        <cell title="优惠影片" is-link link="/discounts">
          <img slot="icon" width="20" style="display:block;margin-right:5px;"
               src="../../assets/images/discount_icon.png">
        </cell>
      </div>
      <!---->
      <scroller :pullup-config="upconfig" :pulldown-config="downconfig"
                @on-pulldown-loading="research"
                @on-pullup-loading="addsearch"
                :use-pulldown="true" :use-pullup="true" ref="scroller1" height="-90" lock-x :scrollbar-x=false
                :scrollbar-y=false
                style="position:absolute;z-index: 2;width: 100%;top: 37px;" :hidden="!showsearch">

        <div>
          <div v-if="searchlist.length == 0" class='loading'>
              <span style='color:#B6B6B6'>
                暂无数据
              </span>
          </div>

          <div class='film' v-for="(item,index) in searchlist" v-on:click="detail(item)">

            <div style='display:flex;'>
              <div class='vodimage'>
                <img :src="item.pic"></img>
              </div>
              <div class='detail'>
                <div class='name'>
                  <div>{{item.name}}
                  </div>

                  <div class='times'>{{item.playAmount}}
                    <span style='font-size:12px'>次</span>
                  </div>

                </div>
                <div class='star-bottom'>
                  <div class='type'>
                    {{item.cName}}
                  </div>
                  <div class='time'>
                    <div>时长:{{item.length}}分钟</div>
                    <div class='price'>{{item.price}}
                      <span style='font-size:12px'>元</span>
                    </div>
                  </div>
                  <div class='star'>
                    主演:{{item.act}}
                  </div>
                </div>
                <div v-bind:class="item.paid?'play':'buy'" :buy="item" v-on:click="buy(item)">{{item.paid?'播放':'购买'}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <load-more v-if="searchnodata" :show-loading="false" tip="这是底线" background-color="#fbf9fe"></load-more>
      </scroller>
    </view-box>
  </div>

</template>

<script>
  import {Tab, TabItem, Scroller, XInput, FlexboxItem, Flexbox} from 'vux'
  import Search from "vux/src/components/search/index";
  import Cell from "vux/src/components/cell/index";
  import Group from "vux/src/components/group/index";
  import XButton from "vux/src/components/x-button/index";
  import Toast from "vux/src/components/toast/index";
  import ViewBox from "vux/src/components/view-box/index";
  import LoadMore from "vux/src/components/load-more/index";

  var that
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
      Tab
    }, data() {
      return {
        nodata: false,
        searchnodata: false,
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
        catlist: {},//电影分类
        vodlist: [],//电影列表
        searchlist: [],//电影搜索
        cid: '',
        cat_width: screen.availWidth,//电影分类长度

        onFetching: false,
        page: 1,
        limit: 6,


        showsearch: false,
        keyword: '',
        searchpage: 1,
        searchlimit: 6,
        showhistroy: false,

        clickbuy: false,
      }
    }, mounted() {
      that = this
      // console.log("电影分类", that.common.SERVER_URL + "api/vod/classify?openid=" + that.wxinfo.user.unionId)
      var url = "api/vod/classify"
      console.log(url)
      that.api_post(url, function (res) {
        console.log(res)
        that.catlist = res.page.list
        // console.log("电影分类", that.catlist)
        that.cat_width = that.catlist.length * 50 > window.innerWidth ? that.catlist.length * 50 : window.innerWidth
        that.recat(that.catlist[0])
      })

    }, methods: {
      recat(list) {//重置分类
        var cid = list.id
        if (cid != null) {
          that.cid = "&cid=" + cid
          that.revideo(list)
        }
      }, revideo(list) {//点击分类初始化列表
        that.page = 1;
        that.getvideo()
      }, resetvideotop() {//回到到顶部
        setTimeout(() => {
          that.$refs.scroller.reset({
            top: 0
          })
          that.$refs.scroller.donePulldown()
        }, 1 * 800)
      }, getvideo() {
        that.$vux.loading.show({
          text: 'Loading'
        })
        var url = "api/vod?page=" + that.page + "&limit=" + that.limit + that.cid;
        that.api_post(url, function (res) {
          if (that.page == 1) {
            that.vodlist = res.page.list
            that.resetvideotop()
          } else {
            for (var i = 0; i < res.page.list.length; i++) {
              that.vodlist.push(res.page.list[i])
            }
            setTimeout(() => {
              that.$refs.scroller.donePullup()
              that.$refs.scroller.reset()
            }, 1 * 800)

          }

          if (res.page.list.length == 0) {
            that.$refs.scroller.disablePullup()
            if (that.page != 1) {
              that.nodata = true
            }
          } else {
            that.nodata = false
            that.$refs.scroller.enablePullup()
          }
          if (res.page.list.length < that.limit && that.page == 1) {
            that.$refs.scroller.disablePullup()
          }
          setTimeout(() => {
            that.$vux.loading.hide()
          }, 1 * 200)

        }, function (res) {
          setTimeout(() => {
            that.$vux.loading.hide()
          }, 1 * 200)
          that.$vux.toast.text(res.msg, 'center')
        })
      }, addvideo() {//影片下拉加载
        that.page = that.page + 1;
        that.getvideo()
      }, searchshow() {//聚焦输入框
        that.showsearch = true
        that.showhistroy = false
        if (that.searchlist.length < that.searchlimit && that.searchpage == 1) {
          that.$refs.scroller1.disablePullup()
        }
      }, searchhide() {//输入框失去焦点
        that.showsearch = false
      }, setkeyword(res) {//输入关键词
        that.keyword = res
      }
      , research() {//搜索下拉刷新
        that.searchpage = 1
        that.getsearch()
      }, addsearch() {//搜索上拉加载更多
        that.searchpage = that.searchpage + 1
        that.getsearch()
      }, getsearch() {
        var keyword = ""
        if (that.keyword.trim() != "") {
          that.$vux.loading.show({
            text: 'Loading'
          })
          keyword = "&keyword=" + that.keyword

          var url = "api/vod?page=" + that.searchpage + "&limit=" + that.searchlimit + keyword;
          // console.log(url)
          that.api_post(url, function (res) {
            console.log(res)

            if (that.searchpage == 1) {
              that.searchlist = res.page.list
              that.resetsearchtop()
            } else {
              for (var i = 0; i < res.page.list.length; i++) {
                that.searchlist.push(res.page.list[i])
              }
              setTimeout(() => {
                that.$refs.scroller1.donePullup()
                that.$refs.scroller1.reset()
              }, 1 * 800)

            }

            if (res.page.list.length == 0) {
              that.$refs.scroller1.disablePullup()
              if (that.searchpage != 1) {
                that.searchnodata = true
              }
            } else {
              that.searchnodata = false
              that.$refs.scroller1.enablePullup()
            }
            if (res.page.list.length < that.searchlimit && that.searchpage == 1) {
              that.$refs.scroller1.disablePullup()
            }
            setTimeout(() => {
              that.$vux.loading.hide()
            }, 1 * 200)

          }, function (res) {
            setTimeout(() => {
              that.$vux.loading.hide()
            }, 1 * 200)
            that.$vux.toast.text(res.msg, 'center')
          })
        } else {
          //输入空
          if (that.searchpage == 1) {
            that.resetsearchtop()
          }
        }
      }, resetsearchtop() {//回到到顶部
        setTimeout(() => {
          that.$refs.scroller1.reset({
            top: 0
          })
          that.$refs.scroller1.donePulldown()
        }, 1 * 800)
      }, histroyshow() {//历史记录
        that.showhistroy = !that.showhistroy
      }, buy(list) {// 购买&播放
        if (!that.clickbuy) {
          that.clickbuy = true
          that.current.video = list
          that.current.vid = list.id
          if (list.paid) {// 播放
            that.Play(list.id);
          } else {// 购买
            that.$router.push("/video/buy?id=" + list.id)

          }
          setTimeout(() => {
            that.clickbuy = false
          }, 2000)
        }
      }, detail(list) {//详情
        if (!that.clickbuy) {//未点击购买
          console.log("详情", list)
          that.current.video = list
          that.current.vid = list.id
          that.$router.push("/detail?id=" + list.id, function () {
          })
        }
      }
    }
  }
</script>


<style scoped>
  @import 'video.css';
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

