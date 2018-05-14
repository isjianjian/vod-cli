<template>
  <div v-if="vodlist">
    <scroller :pulldown-config="downconfig"
              @on-pulldown-loading="reloaddata"
              :use-pulldown="true" ref="scroller" lock-x :scrollbar-x=false
              :scrollbar-y=false>
      <div>
        <div class='film'>

          <div style='display:flex;'>
            <div class='vodimage'>
              <img :src="vodlist.pic" style=" object-fit: cover;"></img>
            </div>
            <div class='detail' v-on:click="detail(vodlist)">

              <flexbox orient="vertical">

                <flexbox-item>
                  <div style="color: #fff;">{{vodlist.name}}</div>
                </flexbox-item>

                <flexbox-item>
                  <div class="star">失效时间：{{vodlist.failureTime}}</div>

                </flexbox-item>
                <flexbox-item>
                  <div class="star">原价：￥{{vodlist.firstPrice}}</div>

                </flexbox-item>
                <flexbox-item>
                  <div class="star">优惠价：￥{{vodlist.offerPrice}}</div>
                </flexbox-item>
              </flexbox>

              <!--<div class="toplay" v-on:click="play(item)">播放</div>-->

            </div>

          </div>


        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
  import {Scroller, FlexboxItem, Flexbox} from 'vux'

  var that;

  export default {
    components: {
      Flexbox,
      FlexboxItem,
      Scroller
    },
    name: "discounts"

    , data() {
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
        vodlist: '',
      }
    }
    , mounted() {
      that = this;
      that.reloaddata()
    }, methods: {
      reloaddata() {
        var url = "api/vod/queryVod";
        // console.log(url);
        that.api_post(url, function (res) {
          console.log(res);
          that.vodlist = res.watch

        })
      }, detail(list) {
        var id = list.id % 10000000000;
        // that.Play(id);
        this.$router.push({path: '/detail', query: {id: id}})
      }


    }
  }
</script>

<style scoped>
  @import "video.css";

  .toplay {
    color: #fff;
    position: absolute;
    right: 0;
    bottom: 30px;
    background: #3f9de7;
    font-size: 10px;
    width: 50px;
    height: 23px;
    line-height: 23px;
    text-align: center;
    border-radius: 5px;
  }

  .toplay:active {
    background: #ECECEC;
  }
</style>
