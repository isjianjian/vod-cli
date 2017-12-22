<template>
  <div style="background-color: #fff;">
    <view-box>

      <flexbox class="top">
        <search ref="search" placeholder="输入片名、主演或导演" @on-change="setkeyword"
                @on-submit="ok" @on-focus="searchshow" @on-cancel="searchhide"></search>

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


      <scroller @on-scroll-bottom="updatevideo" height="300" v-bind:hidden="showsearch"
                style="position:absolute;width: 100%;top: 81px;" lock-x
                :scrollbar-x=false
                :scrollbar-y=false>

        <!--<load-more v-bind:hidden="!onFetching" tip="加载更多"></load-more>-->

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
                  {{catlist[index].name}}
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


      </scroller>


      <div v-bind:hidden="!showhistroy" style="position:absolute;z-index: 3;background: #fff;width: 100%;top: 37px;">
        <cell title="历史记录" is-link v-on:click.native="">
          <img slot="icon" width="20" style="display:block;margin-right:5px;"
               src="../../assets/images/histroy_icon.png">
        </cell>
        <cell title="已购买影片" is-link v-on:click.native="">
          <img slot="icon" width="20" style="display:block;margin-right:5px;" src="../../assets/images/ispay_icon.png">
        </cell>
        <cell title="优惠影片" is-link v-on:click.native="">
          <img slot="icon" width="20" style="display:block;margin-right:5px;"
               src="../../assets/images/discount_icon.png">
        </cell>
      </div>

      <scroller v-bind:hidden="!showsearch" style="position:absolute;z-index: 2;width: 100%;top: 37px;" lock-x
                :scrollbar-x=false
                :scrollbar-y=false
                @on-scroll-bottom="onScrollBottom2">

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
                  <!--{{catlist[index].name}}-->
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
        catlist: {},//电影分类
        vodlist: [],//电影列表
        searchlist: [],//电影搜索
        cid: '',
        cat_width: screen.availWidth,//电影分类长度

        onFetching: false,
        page: 1,
        limit: 5,


        showsearch: false,
        keyword: '',
        searchpage: 1,
        searchlimit: 6,
        showhistroy: false,

        clickbuy: false,
      }
    }, mounted() {
      that = this
      // console.log("电影分类", this.common.SERVER_URL + "api/vod/classify?openid=" + this.wxinfo.user.unionId)
      this.$http.post(this.common.SERVER_URL + "api/vod/classify?openid=" + this.wxinfo.user.unionId)
        .then(function (res) {
          if (res.data.code == 0) {

            this.catlist = res.data.page.list
            // console.log("电影分类", this.catlist)
            this.cat_width = this.catlist.length * 50 > window.innerWidth ? this.catlist.length * 50 : window.innerWidth
            this.recat(this.catlist[0])
          } else {
            alert(res.data.msg)
          }

        })
    }, methods: {
      recat(list) {//重置分类
        this.page = 1;
        this.vodlist = []
        // console.log(list != null)

        if (list != null) {
          this.cid = "&cid=" + list.id
        }
        this.initvideo(list)

        // this.$nextTick(() => {
        //   this.$refs.scroller.reset({
        //     top: 0
        //   })
        // })

      }, initvideo(list) {
        console.log(this.common.SERVER_URL + "api/vod?openid=" + this.wxinfo.user.unionId + this.cid + "&page=" + this.page + "&limit=" + this.limit)
        this.$http.post(this.common.SERVER_URL + "api/vod?openid=" + this.wxinfo.user.unionId + this.cid + "&page=" + this.page + "&limit=" + this.limit)
          .then(function (res) {
            if (res.data.code == 0) {
              this.vodlist = res.data.page.list
            } else {
            }
          })
      }, detail(list) {
        if (!this.clickbuy) {
          console.log("详情", list)
          this.current.video = list
          this.current.vid = list.id
          this.$router.push("detail?id=" + list.cid, function () {
          })
        }
      }, searchshow() {
        this.showsearch = true
        this.showhistroy = false

      }, searchhide() {
        this.showsearch = false
      }, setkeyword(res) {
        this.keyword = res
      }
      , ok() {
        var keyword = ""
        if (this.keyword.trim() != "") {//关键字搜索
          keyword = "&keyword=" + this.keyword

          console.log(this.common.SERVER_URL + "api/vod?openid=" + this.wxinfo.user.unionId + "&page=" + this.searchpage + "&limit=" + this.searchlimit + keyword)
          this.$http.post(this.common.SERVER_URL + "api/vod?openid=" + this.wxinfo.user.unionId + "&page=" + this.searchpage + "&limit=" + this.searchlimit + keyword)
            .then(function (res) {
              console.log(res)
              if (res.data.code == 0) {
                this.searchlist = res.data.page.list;
              } else {
              }
            })
        } else {
          //输入空
        }

      }, histroyshow() {
        this.showhistroy = !this.showhistroy
        // this.$router.push("histroy", function () {
        //
        // })
      }, buy(list) {
        if (!this.clickbuy) {
          this.clickbuy = true
          this.current.video = list
          this.current.vid = list.id
          if (list.paid) {
            // 播放

          } else {
            // 购买
            this.$router.push("buy")
          }


          setTimeout(() => {
            this.clickbuy = false
          }, 2000)
        }
      }

      , updatevideo() {
        var that = this
        if (this.onFetching) {

        } else {
          // console.log("上拉刷新")
          this.onFetching = true
          // that.addvideo()
          setTimeout(function () {
            that.onFetching = false
          }, 2000)
        }
      }, addvideo(list) {
        // var page = this.page + 1
        // console.log(this.common.SERVER_URL + "api/vod?openid=" + this.wxinfo.user.unionId + this.cid + "&page=" + page + "&limit=" + this.limit)
        //
        // this.$http.post(this.common.SERVER_URL + "api/vod?openid=" + this.wxinfo.user.unionId + this.cid + "&page=" + page + "&limit=" + this.limit)
        //   .then(function (res) {
        //     if (res.data.code == 0) {
        //       // console.log("加载更多", res)
        //       var list = this.vodlist
        //       console.log("NOW:" + list.length + "**********ADD:" + res.data.page.list.length)
        //       if (res.data.page.list.length > 0) {
        //         this.page = page
        //         for (var i = 0; i < res.data.page.list.length; i++) {
        //           list.push(res.data.page.list[i])
        //         }
        //       } else {
        //
        //       }
        //       this.vodlist = list
        //     } else {
        //
        //
        //     }
        //
        //
        //   })
      }, onScrollBottom2() {
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

