<template>
  <div style="background-color: #fff;">
    <view-box>
      <div>ssssssssssssssss</div>

      <flexbox class="top">
        <img class="seacher_btn" src="../../assets/images/search.png" v-on:click="search"/>
        <x-input readonly="readonly" id="keyword" class="seacher_input" placeholder="输入片名、主演或导演" onclick="search"/>
        <!--<search placeholder="输入片名、主演或导演"  style=""></search>-->
        <img class="histroy_btn" src="../../assets/images/menu.png"/>
      </flexbox>

      <!--影片list-->
      <scroller lock-x :scrollbar-x=false :scrollbar-y=false >


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

    </view-box>
  </div>
</template>

<script>
  import {Tab, TabItem, Scroller, XInput, FlexboxItem, Flexbox} from 'vux'

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
  @import 'video.css';
</style>
