<template>
  <view-box>
    <div>
      <flexbox class="top">
        <img class="seacher_btn" src="../../assets/images/search.png"/>
        <x-input id="keyword" class="seacher_input" @on-change="keyword" placeholder="输入片名、主演或导演" @on-enter="ok"/>
        <!--<search placeholder="输入片名、主演或导演"  style=""></search>-->
        <img class="histroy_btn" src="../../assets/images/menu.png"/>
      </flexbox>

      <!--影片list-->
      <scroller lock-x :scrollbar-x=false :scrollbar-y=false height="200px" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="200">


        <div class="vux-tap-active">

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
                <div v-bind:class="item.paid?'play':'buy'" :buy="item" v-on:click="buy">{{item.paid?'播放':'购买'}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroller>
    </div>

  </view-box>
</template>

<script>
  import ViewBox from "vux/src/components/view-box/index";
  import XInput from "vux/src/components/x-input/index";
  import Scroller from "vux/src/components/scroller/index";

  export default {
    name: "search",
    components: {
      Scroller,
      XInput,
      ViewBox
    }, data() {
      return {
        keyword: '',
      }
    }, mounted() {
    }, methods: {
      keyword(keyword) {
        this.keyword = keyword
        this.ok(keyword)
      }
      , ok(keyword) {
        var keyword = ""
        if (this.keyword != null && this.keyword != "") {//关键字搜索
          keyword = "&keyword=" + this.keyword
        }
        this.$http.post(this.common.SERVER_URL + "api/vod?openid=" + this.wxinfo.user.unionId + cid + "&page=1&limit=5" + keyword)
          .then(function (res) {
            if (res.data.code == 0) {
              this.vodlist = res.data.page.list
              console.log("电影搜索", this.vodlist)
            } else {
            }

          })
      }, detail(list) {
        console.log("详情", list)
        this.current.video = list
        this.current.vid = list.id
        this.$router.replace("detail?id=" + list.cid, function () {
        })
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
    text-align: center;
    color: #efeff4;
    font-size: 16px;
  }

</style>
