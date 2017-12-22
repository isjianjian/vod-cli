<template>
  <div style="background-color: #fff;">
    <view-box>

      <flexbox class="top">
        <div class="seacher_btn" v-on:click="search"/>
        <!--<group >-->
        <x-input @click.native="search" readonly="readonly" class="seacher_input" placeholder="输入片名、主演或导演"></x-input>
        <!--</group>-->
        <!--<search placeholder="输入片名、主演或导演"  style=""></search>-->
        <div class="histroy_btn" v-on:click="histroy"/>

      </flexbox>
      <!--分类-->
      <scroller lock-y :scrollbar-x=false :scrollbar-y=false>
        <tab bar-active-color="#3f9de7" :line-width="2" active-color='#3f9de7'
             v-bind:style="'width:'+cat_width +'px'">
          <tab-item v-for="(item,index) in catlist" @on-item-click="recat(item)" v-bind:selected="index==0">
            {{item.name}}
          </tab-item>
        </tab>
      </scroller>

      <!--影片list-->
      <scroller height="-81" ref="scroller1" lock-x :scrollbar-x=false :scrollbar-y=false
                @on-scroll-bottom="onScrollBottom">
        <div>

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
                <div v-bind:class="item.paid?'play':'buy'" :buy="item" v-on:click="buy">{{item.paid?'播放':'购买'}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <load-more tip="加载更多"></load-more>
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
        cid: '',
        cat_width: screen.availWidth,//电影分类长度

        loadmore: false,
        page: 0,
        limit: 5,
      }
    }, mounted() {

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
      this.doShowToast()
    }, methods: {
      recat(list) {//重置分类

        // console.log(list)
        this.page = 0;
        this.vodlist = []
        console.log(list != null)
        if (list != null) {
          this.cid = "&cid=" + list.id
          // console.log(this.cid)
        }
        this.cat(list)
        console.log('ss', this.$refs.scrollerEvent)
        this.$refs.scrollerEvent.reset({top: 0})

      }, cat(list) {
        var page = this.page + 1
        console.log(this.common.SERVER_URL + "api/vod?openid=" + this.wxinfo.user.unionId + this.cid + "&page=" + page + "&limit=" + this.limit)

        this.$http.post(this.common.SERVER_URL + "api/vod?openid=" + this.wxinfo.user.unionId + this.cid + "&page=" + page + "&limit=" + this.limit)
          .then(function (res) {
            if (res.data.code == 0) {
              // console.log("加载更多", res)
              var list = this.vodlist
              console.log("NOW:" + list.length + "**********ADD:" + res.data.page.list.length)
              if (res.data.page.list.length > 0) {
                this.page = page
                for (var i = 0; i < res.data.page.list.length; i++) {
                  list.push(res.data.page.list[i])
                }
              } else {
                this.$vux.toast.show({
                  text: res.data.msg,
                })
              }
              this.loadmore = false;
              this.vodlist = list
            } else {


            }


          })
      }, detail(list) {
        console.log("详情", list)
        this.current.video = list
        this.current.vid = list.id
        this.$router.push("detail?id=" + list.cid, function () {
        })
      }, search() {
        console.log("搜索")
        this.$router.push("search", function () {

        })
      }, histroy() {
        this.$router.push("histroy", function () {

        })
      }, buy(res) {
        console.log("购买", res)
      }, onScrollBottom() {
        if (!this.loadmore) {
          this.loadmore = true;
          this.cat()
        }
      }

    }
  }
</script>

<style scoped>
  @import 'video.css';


</style>
<!--<style scoped lang="less">-->
<!--@import '~vux/src/styles/1px.less';-->

<!--</style>-->
