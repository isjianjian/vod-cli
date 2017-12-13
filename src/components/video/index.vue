<template>
  <div style="background-color: #fff;">
    <view-box>

      <flexbox class="top">
        <img class="seacher_btn" src="../../assets/images/search.png"/>
        <x-input id="keyword" class="seacher_input" @on-change="keyword" placeholder="输入片名、主演或导演"/>
        <!--<search placeholder="输入片名、主演或导演"  style=""></search>-->
        <img class="histroy_btn" src="../../assets/images/menu.png"/>
      </flexbox>
      <!--分类-->
      <scroller lock-y :scrollbar-x=false :scrollbar-y=false>
        <tab bar-active-color="#3f9de7" :line-width="2" active-color='#3f9de7'
             v-bind:style="'width:'+cat_width +'px'">
          <tab-item v-for="(item,index) in catlist" @on-item-click="cat" v-bind:selected="index==0">{{item.name}}
          </tab-item>
        </tab>
      </scroller>

      <!--影片list-->
      <scroller lock-x :scrollbar-x=false :scrollbar-y=false>


        <div class="vux-tap-active">

          <div class='film' v-for="(item,index) in vodlist" :id="item.id" v-on:click="detail">

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
                    {{catlist[typeindex].name}}
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
                <button v-bind:class="item.paid?'play':'buy'" :buy="item" v-on:click="buy">{{item.paid?'播放':'购买'}}
                </button>
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
  import DatetimeView from "vux/src/components/datetime-view/index";

  export default {
    name: "index",

    components: {
      DatetimeView,
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
        vodlist: {},//电影列表
        typeindex: 0,//电影分类点击下标
        cat_width: screen.availWidth,//电影分类长度
      }
    }, mounted() {
      this.$http.post(this.common.SERVER_URL + "api/vod/classify?openid=oMH3q0Nw7Squr91CqjFi8ITCRgOQ")
        .then(function (res) {
          if (res.data.code == 0) {

            this.catlist = res.data.page.list
            console.log("电影分类", this.catlist)
            this.cat_width = this.catlist.length * 50 > screen.availWidth ? this.catlist.length * 50 : screen.availWidth
            this.cat(this.typeindex, null)

          } else {
            alert(res.data.msg)

          }

        })
    }, methods: {
      doShowToast() {
        console.log("sss")
        this.$vux.toast.show({
          text: 'toast'
        })
      },
      keyword(keyword) {
        console.log(keyword)
        this.cat(null, keyword)
      }
      ,
      cat(i, word) {

        this.typeindex = i

        var keyword = ""
        var cid = ""
        if (word != null && word != "") {//关键字搜索
          keyword = "&keyword=" + word
        }
        if (i != null &&i !=null) {//分类搜索
          cid = "&cid=" + this.catlist[this.typeindex].id
        }
        // alert(this.common.SERVER_URL + "api/vod?openid=oMH3q0Nw7Squr91CqjFi8ITCRgOQ" + cid + "&page=1&limit=999999"+ keyword )
        this.$http.post(this.common.SERVER_URL + "api/vod?openid=oMH3q0Nw7Squr91CqjFi8ITCRgOQ" + cid + "&page=1&limit=999999"+ keyword )
          .then(function (res) {
            if (res.data.code == 0) {
              this.vodlist = res.data.page.list
              console.log("电影搜索", this.vodlist)
            } else {
            }

          })
      }, detail(res) {
        console.log("详情", res)
        this.$router.replace("detail", function () {
          console.log("跳转")
        })

      }, buy(res) {
        console.log("购买", res)
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
  }

  .seacher_input {
    margin-top: 3px;
    margin-bottom: 3px;
    flex: 1;
    border-left: 1px solid #efeff4;
    font-size: 14px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .seacher_btn {
    width: 20px;
    height: 20px;
    padding: 8px;
  }


  .histroy_btn {
    border-left: 1px solid #efeff4;
    width: 20px;
    height: 20px;
    padding: 8px;
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
    height: 92.8px;
  }

  .vodimage img {
    margin-right: 10px;
    width: 70px;
    height: 100%;
  }

  .film .detail {
    flex: 1;
    position: relative;
    top: 0;
    left: 0;
  }

  .name {
    display: flex;
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
    margin-bottom: 6px;
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
    bottom: 30px;
    font-size: 14px;
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
    border: 1px solid #fff;
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
    border: 1px solid #fff;
  }

  .play:active {
    background: #ECECEC;
  }

  .loading {
    text-align: center;
    color: #efeff4;
    font-size: 16px;
  }

  .weui-search-bar__input {
    height: 28px;
    line-height: 28px;
    font-size: 14px;
  }

  .box1 {
    height: 20px;
    position: relative;
    width: 1490px;
  }

  .box1-item {
    width: 200px;
    height: 20px;
    background-color: #ccc;
    display: inline-block;
    margin-left: 15px;
    float: left;
    text-align: center;
    line-height: 100px;
  }

  .box1-item:first-child {
    margin-left: 0;
  }

  .box2-wrap {
    height: 300px;
    overflow: hidden;
  }

  .weui-search-bar {
    padding: 8px 0px !important;
  }
</style>
<style scoped lang="less">
  @import '~vux/src/styles/1px.less';

</style>
