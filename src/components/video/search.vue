<template>
  <div style="background-color: #fff;">
    <view-box>

      <flexbox class="top">
        <div class="seacher_btn"/>
        <x-input class="seacher_input" placeholder="输入片名、主演或导演" @on-change="setkeyword" @on-enter="ok"></x-input>
        <div class="histroy_btn" v-on:click="histroy"/>
      </flexbox>
      <!--影片list  height="-81"-->
      <scroller lock-x :scrollbar-x=false :scrollbar-y=false @on-scroll-bottom="onScrollBottom">
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
  import {Scroller, XInput, ViewBox, Flexbox} from 'vux'

  export default {
    name: "search",
    components: {
      Scroller,
      XInput,
      ViewBox,
      Flexbox
    }, data() {
      return {
        page: 1,
        limit: 6,
        keyword: '',
        vodlist: {},//详细

        searchLoadingComplete: false,
        cnt_style: '',
      }
    }, mounted() {
    }, methods: {

      setkeyword(res) {
        this.keyword = res
      }
      , ok() {
        var that=this;
        var keyword = "";
        if (this.keyword.trim() != "") {//关键字搜索
          keyword = "&keyword=" + this.keyword;
          this.api_post( "api/vod?page=" + this.page + "&limit=" + this.limit + keyword,function (res) {
            that.vodlist = res.page.list
          })
        } else {
          //输入空
        }

      }, detail(list) {
        console.log("详情", list);
        this.current.video = list;
        this.current.vid = list.id;
        this.$router.replace("detail?id=" + list.cid, function () {
        })
      }, onScrollBottom() {

      }, histroy() {
        this.$router.replace("histroy", function () {

        })
      }
    }

  }
</script>

<style scoped>
  @import 'video.css';
</style>
