<template>
  <div>
    <div v-if="common.hotel!=null" style="background: #393a3f;">

      <div>
        <flexbox class="video_top">
          <flexbox-item :span="4/5">
            <flexbox
              style="background: #ccc;border-radius:17px;margin: 20px 0 20px 20px; height: 36px;line-height: 36px; ">

              <div class="seacher_btn" v-on:click="research"/>
              <x-input placeholder="请输入片名、主演或导演" style="height: 30px;" @on-change="setkeyword"
                       @on-submit="research"
                       @on-focus="searchshow" @on-cancel="searchhide"></x-input>

            </flexbox>

          </flexbox-item>
          <flexbox-item>
            <div ref="histroy" v-if="showsearch" v-on:click="cancle"
                 style=" color: #3f9de7; position: absolute;right: 0;top: 0;width: 50px; height: 26px; ">取消
            </div>
            <div ref="histroy" v-if="!showsearch" class="histroy_btn"
                 v-on:click="histroyshow"/>
          </flexbox-item>
          <!--<search ref="search" placeholder="请输入片名、主演或导演" @on-change="setkeyword"-->
          <!--@on-submit="research" @on-focus="searchshow" @on-cancel="searchhide">-->
          <!--</search>-->


        </flexbox>
      </div>
      <!--分类  :selected="index === common.savevodcatpos"-->
      <div>
        <scroller v-if="catlist.length>0" v-bind:hidden="showsearch" lock-y :scrollbar-x=false :scrollbar-y=false
                  ref="scrollercat" @on-scroll="savevodcat">
          <!--style="background: #C0C0C0;"-->
          <tab style="background: #999;" bar-active-color="#3f9de7" :line-width="2" active-color='#fff'
               v-bind:style="'width:'+cat_width +'px'">
            <tab-item v-for="(item,index) in catlist" @on-item-click="recat(item,index)" active-class="active_cat"
                      style="color: #fff;"
                      :selected="index==savevodcatpos">
              {{item.name}}
            </tab-item>
          </tab>
        </scroller>
      </div>

      <div v-if="!showsearch">
        <scroller :pullup-config="upconfig" :pulldown-config="downconfig"
                  @on-pulldown-loading="revideo"
                  @on-pullup-loading="addvideo"
                  @on-scroll="savevodlist"
                  :use-pulldown="true" :use-pullup="true" ref="scroller" lock-x :scrollbar-x=false
                  :scrollbar-y=false height="-94">
          <div>
            <div v-if="vodlist.length == 0" class='loading'>
              <span style='color:#B6B6B6;display: block;padding-top: 120px;'>
                暂无数据
              </span>
            </div>
            <div class='film' v-for="(item,index) in vodlist" v-on:click="detail(item)">

              <div style='display:flex;'>
                <div class='vodimage'>
                  <img :src="item.pic" style=" object-fit: cover;"></img>
                </div>
                <div class='detail'>
                  <div class='name'>
                    <div>{{item.name}}
                    </div>

                    <div class='times' style="display: none">{{item.playAmount}}
                      <span style='font-size:12px'>次</span>
                    </div>

                  </div>
                  <div class='star-bottom'>
                    <div class='type'>
                      类型：{{item.cName}}
                    </div>
                    <div class='time'>
                      <div>年份：{{item.length}}</div>
                      <div class='price'>{{isNaN(item.price)?"未设置价格":item.price}}
                        <span style='font-size:12px' v-if="!isNaN(item.price)">元</span>
                      </div>
                    </div>
                    <div class='star'>
                      主演：{{item.act}}
                    </div>
                  </div>

                  <div hidden="true" v-bind:class="item.paid?'play':'buy'" :buy="item" v-on:click="buy(item)">
                    {{item.paid?'播放':'购买'}}
                  </div>

                </div>
              </div>
            </div>
          </div>
          <load-more v-if="nodata" :show-loading="false" tip="这是底线" background-color="#fbf9fe"></load-more>
        </scroller>
      </div>


      <div v-bind:hidden="!showhistroy" style="position:absolute;z-index: 3;background: #393a3f;width: 100%;top: 49px;"
           v-on:click="histroyshow">
        <cell title="历史记录" is-link link="/record" style="color: #fff;">
          <img slot="icon" width="20" style="display:block;margin-right:5px;"
               src="../../assets/images/histroy_icon.png">
        </cell>
        <cell title="已购买影片" is-link link="/bought" style="color: #fff;">
          <img slot="icon" width="20" style="display:block;margin-right:5px;"
               src="../../assets/images/ispay_icon.png">
        </cell>
        <cell title="优惠影片" is-link link="/discounts" style="color: #fff;">
          <img slot="icon" width="20" style="display:block;margin-right:5px;"
               src="../../assets/images/discount_icon.png">
        </cell>
      </div>

      <div v-if="showsearch">
        <scroller :pullup-config="upconfig" :pulldown-config="downconfig"
                  @on-pulldown-loading="research"
                  @on-pullup-loading="addsearch"
                  :use-pulldown="true" :use-pullup="true" ref="scroller1" height="-50" lock-x :scrollbar-x=false
                  :scrollbar-y=false>

          <div>
            <div v-if="searchlist.length == 0" class='loading'>
              <span style='color:#B6B6B6;display: block;padding-top: 120px;'>
                暂无数据
              </span>
            </div>

            <div class='film' v-for="(item,index) in searchlist" v-on:click="detail(item)">

              <div style='display:flex;'>
                <div class='vodimage'>
                  <img :src="item.pic" style=" object-fit: cover;"></img>
                </div>
                <div class='detail'>
                  <div class='name'>
                    <div>{{item.name}}
                    </div>

                    <div class='times' style="display: none">{{item.playAmount}}
                      <span style='font-size:12px'>次</span>
                    </div>

                  </div>
                  <div class='star-bottom'>
                    <div class='type'>
                      类型：{{item.cName}}
                    </div>
                    <div class='time'>
                      <div> 年份：{{item.length}}</div>
                      <div class='price'>{{isNaN(item.price)?"未设置价格":item.price}}
                        <span style='font-size:12px' v-if="!isNaN(item.price)">元</span>
                      </div>
                    </div>
                    <div class='star'>
                      主演:{{item.act}}
                    </div>
                  </div>
                  <div hidden="true" v-bind:class="item.paid?'play':'buy'" :buy="item" v-on:click="buy(item)">
                    {{item.paid?'播放':'购买'}}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <load-more v-if="searchnodata" :show-loading="false" tip="这是底线" background-color="#fbf9fe"></load-more>
        </scroller>

      </div>

    </div>

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
  import JQ from 'jquery';

  var that;
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
    }, data() {
      return {
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
        limit: 50,


        showsearch: false,

        keyword: '',
        searchpage: 1,
        searchlimit: 50,
        showhistroy: false,

        clickbuy: false,

        histroy_n: '',
        histroy_p: '',
        savevodcatpos: 0,
      }
    }, destroyed() {
      var that = this;
      that.common.currentlist = that.vodlist
    }
    , mounted() {

      that = this;

      that.getcat()


    }, methods: {
      savevodcat(res) {
        var that = this;
        that.common.savevodcat = res.left
      },
      savevodlist(res) {
        var that = this;
        that.common.savevodlist = res.top
      }, getcat() {

        // var url = "http://cms.kfg365.com/if/movie_home.php";
        var url = "http://" + localStorage.getItem("hs") + "/if/movie_home.php";
        // console.log(url)
        that.$http.get(url).then(function (res) {
            // var cc = JQ(res.bodyText.replace(/param/g, "p")).find("p[name='code']");
            // console.log("111111111111111111",cc)

            var styles = JQ(res.bodyText.replace(/param/g, "p")).find("list[name='home_tag'] entry");
            var list = [];
            var el = {id: '', name: "全部"};

            list.push(el);

            JQ(styles).each(function (i, e) {
              // console.log("e", e)
              var el = {};
              // console.log("  JQ(e).find(\"[name='id']\")", JQ(e))
              el.id = JQ(e).find("[name='id']").html();
              el.name = JQ(e).find("[name='name']").html();
              list.push(el)
            });
            that.catlist = list;
            that.cat_width = that.catlist.length * 65 > window.innerWidth ? that.catlist.length * 65 : window.innerWidth;


            if (that.common.currentlist != null) {

              that.vodlist = that.common.currentlist;
              that.page = Math.ceil(that.vodlist.length / that.limit)
              that.savevodcatpos = that.common.savevodcatpos
              if (that.savevodcatpos != null) {
                that.cid = "&tid=" + that.catlist[that.savevodcatpos].id;
              }
              setTimeout(function () {
                that.$refs.scroller.reset({
                  top: that.common.savevodlist
                })
                if (that.vodlist.length < that.limit) {
                  that.$refs.scroller.disablePullup()
                }
                that.$refs.scroller.donePulldown()
              }, 1)

            } else {
              that.recat(that.catlist[0])
            }

          }
        )

      },


      recat(list, index) {//重置分类
        console.log("重置分类", list)
        that.common.savevodcatpos = index
        this.common.savevodlist = 0;

        if (list.id != "" && list.id != "search") {
          that.cid = "&tid=" + list.id;
        } else {
          that.cid = "";
        }
        that.revideo(list)
      }, revideo(list) {//点击分类初始化列表
        that.page = 1;
        that.getvideo()
      }, getvideo() {
        that.$vux.loading.show({
          text: 'Loading'
        });

        var url = "http://" + localStorage.getItem("hs") + "/if/movie_list.php?page=" + that.page + "&pagesize=" + that.limit + that.cid;
        console.log(url);
        that.$http.get(url).then(function (res) {

          var styles = JQ(res.bodyText.replace(/param/g, "p")).find("list[name='movie_list'] entry");
          var host = JQ(res.bodyText.replace(/param/g, "p")).find("seg[id='movie_list']").find("[name='base']").html();


          var list = [];
          JQ(styles).each(function (i, e) {
            var el = {};
            el.id = JQ(e).find("[name='movie_id']").html();//影片id
            el.lib_id = JQ(e).find("[name='lib_id']").html();//影片lib_id
            el.pic = host + JQ(e).find("[name='img_list']").html();//海报
            el.name = JQ(e).find("[name='name']").html();//影片名称
            el.playAmount = 0;//播放次数
            el.cName = JQ(e).find("[name='tname_list']").html().replace(/,/g, " ")//分类名
            el.length = JQ(e).find("[name='publish']").html();//时长年份
            el.price = JQ(e).find("[name='price']").html() / 100; //价格
            el.act = JQ(e).find("[name='actor']").html();//演员
            el.director = JQ(e).find("[name='director']").html();//导演

            // for (var i = 0; i < 100; i++) {
            //   list.push(el)
            // }
            list.push(el);
          });


          if (that.page == 1) {
            that.vodlist = list;

            that.$refs.scroller.reset({
              top: 0
            });
            that.$refs.scroller.donePulldown()

          } else {

            if (list.length > 0) {
              for (var i = 0; i < list.length; i++) {
                that.vodlist.push(list[i])
              }
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

        }, function () {
          that.$vux.loading.hide()
          that.$refs.scroller.donePulldown();
          that.$refs.scroller.disablePullup();
        })

      }, addvideo() {//影片下拉加载
        that.page = that.page + 1;
        that.getvideo()
      }, cancle() {//取消
        that.showsearch = false;
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

          // var url = "http://cms.kfg365.com/if/movie_list.php";
          var url = "http://" + localStorage.getItem("hs") + "/if/movie_list.php?page=" + that.searchpage + "&pagesize=" +
            that.searchlimit + "&keyword=" + that.keyword;
          console.log(url);
          that.$http.get(url).then(function (res) {

            var styles = JQ(res.bodyText.replace(/param/g, "p")).find("list[name='movie_list'] entry");
            var host = JQ(res.bodyText.replace(/param/g, "p")).find("seg[id='movie_list']").find("[name='base']").html();

            var list = [];
            JQ(styles).each(function (i, e) {
              var el = {};


              el.id = JQ(e).find("[name='movie_id']").html();//影片id
              el.lib_id = JQ(e).find("[name='lib_id']").html();//影片lib_id
              el.pic = host + JQ(e).find("[name='img_list']").html();//海报
              el.name = JQ(e).find("[name='name']").html();//影片名称
              el.playAmount = 0;//播放次数
              el.cName = JQ(e).find("[name='tname_list']").html().replace(/,/g, " ")//分类名
              el.length = JQ(e).find("[name='publish']").html();//时长年份
              el.price = JQ(e).find("[name='price']").html() / 100; //价格
              el.act = JQ(e).find("[name='actor']").html();//演员
              el.director = JQ(e).find("[name='director']").html();//导演
              list.push(el)
            });

            if (that.searchpage == 1) {
              that.searchlist = list;
              that.$refs.scroller1.reset({
                top: 0
              });
              that.$refs.scroller1.donePulldown()
            } else {
              if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                  that.searchlist.push(list[i])
                }
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
          }, function () {
            that.$vux.loading.hide()
            that.$refs.scroller1.donePulldown();
            that.$refs.scroller1.disablePullup();
          })

        } else {
          //输入空
          // if (that.searchpage == 1) {
          //   that.$refs.scroller1.reset({
          //     top: 0
          //   });
          //   that.$refs.scroller1.donePulldown()
          // }
          that.searchlist = ""
        }


      },
      histroyshow() {//历史记录
        console.log(that.$refs.histroy);
        that.showhistroy = !that.showhistroy
        // if (that.showhistroy) {
        //   that.$refs.menu.class = 'histroy_btn_p'
        // } else {
        //   that.$refs.menu.class = 'histroy_btn_n'
        // }
      }
      ,
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
      }
      ,
      detail(list) {//详情
        // console.log(list.lib_id)
        if (!that.clickbuy) {//未点击购买
          // console.log("详情", list)
          that.current.video = list;
          that.current.vid = list.lib_id;
          that.$router.push("/detail?id=" + list.lib_id, function () {
          })
        }
      }
    }
  }
</script>


<style scoped>
  @import 'video.css';

  .video_top {
    height: 45px;
    line-height: 45px;
    background: #393a3f;
    border-bottom: 5px solid #393a3f;
  }

  .vux-search-fixed {
    top: 0px !important;
  }

  .active_cat {
    background: #3f9de7 !important;
    border-radius: 6px;
  }
</style>

<!--<style>-->


<!--/*393a3f*/-->
<!--.weui-search-bar__box {-->
<!--/*最底层背景*/-->
<!--background-color: #393a3f !important;-->
<!--}-->

<!--.weui-search-bar {-->
<!--background: #393a3f !important;-->
<!--position: relative;-->
<!--padding: 0px 0px !important;;-->

<!--}-->

<!--.weui-search-bar:before {-->
<!--content: " ";-->
<!--position: absolute;-->
<!--left: 0px !important;-->
<!--top: 0;-->
<!--right: 0px !important;-->
<!--height: 1px;-->
<!--border-top: 0px solid #000 !important;-->
<!-- -webkit-transform-origin: 0 0;-->
<!--transform-origin: 0 0;-->
<!-- -webkit-transform: scaleY(0.5);-->
<!--transform: scaleY(0.5);-->
<!--/*background: #fff !important;*/-->
<!--}-->

<!--.weui-search-bar__label {-->
<!--/*默认显示搜索框*/-->
<!--position: absolute;-->
<!--top: 0px !important;-->
<!--right: 10px !important;-->
<!--bottom: 0px !important;-->
<!--left: 20px !important;-->
<!--padding-left: 8px !important;-->
<!--/*padding-top: 5px!important;*/-->
<!--z-index: 2;-->
<!--border-radius: 20px !important;;-->
<!--text-align: left !important;-->
<!--vertical-align: center !important;-->
<!--color: #393a3f !important;-->
<!--background: #ccc !important;-->
<!--}-->

<!--.weui-search-bar__form:after {-->
<!--/*点击搜索框后*/-->
<!--content: '';-->
<!--position: absolute;-->
<!--left: 20px;-->
<!--top: 0;-->
<!--width: 200%;-->
<!--height: 200%;-->
<!-- -webkit-transform: scale(0.5);-->
<!--transform: scale(0.5);-->
<!-- -webkit-transform-origin: 0 0;-->
<!--transform-origin: 0 0;-->
<!--border-radius: 0px !important;-->
<!--border: 0px solid #E6E6EA !important;-->
<!-- -webkit-box-sizing: border-box;-->
<!--box-sizing: border-box;-->
<!--background: #ccc !important;-->
<!--}-->

<!--.weui-icon-search { /*选中层搜索按钮*/-->
<!--font-size: 30px !important;-->

<!--}-->

<!--.weui-search-bar__box .weui-icon-search {-->
<!--/*选中层搜索图标*/-->
<!--position: absolute;-->
<!--left: 14px !important;-->
<!--top: 10px !important;-->
<!--line-height: 35px;-->
<!--font-size: 30px !important;-->

<!--}-->

<!--.weui-search-bar__input {-->
<!--/*选中层输入框*/-->
<!--margin-left: 25px !important;-->

<!--}-->

<!--.weui-search-bar__box .weui-icon-clear {-->
<!--/*清除内容*/-->
<!--position: absolute;-->
<!--top: 10px !important;-->
<!--right: 0;-->
<!--padding: 0 10px;-->
<!--line-height: 30px;-->
<!--}-->

<!--.weui-icon-clear {-->
<!--/*清除内容*/-->
<!--color: #B2B2B2;-->
<!--font-size: 14px;-->
<!--}-->

<!--.weui-search-bar__cancel-btn {-->
<!--/*取消按钮*/-->
<!--display: none;-->
<!--margin-left: 0px !important;;-->
<!--margin: 10px 10px !important;-->
<!--/*line-height:48px !important;*/-->
<!--color: #3f9de7 !important;-->
<!--/*background: #0bb20c!important;*/-->
<!--white-space: nowrap;-->
<!--/*border-bottom: 0px!important;*/-->

<!--}-->


<!--</style>-->

