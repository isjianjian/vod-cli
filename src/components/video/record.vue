<template>
  <div>
    <scroller :pulldown-config="downconfig"
              @on-pulldown-loading="reloaddata"
              :use-pulldown="true" ref="scroller" lock-x :scrollbar-x=false
              :scrollbar-y=false>
      <div>
        <div class='film' v-for="(item,index) in vodlist" v-on:click="detail(item)">

          <div style='display:flex;'>
            <div class='vodimage'>
              <img :src="item.spic" style=" object-fit: cover;"></img>
            </div>
            <div class='detail' style="margin-top: 10px;">

              <flexbox orient="vertical">
                <flexbox-item>
                  <div class="star">{{item.lastTime}}</div>
                </flexbox-item>
                <flexbox-item>
                  <div style="color: #fff;">{{item.sdesc}}</div>
                </flexbox-item>
                <flexbox-item>
                  <div class="star">上次观看至{{item.m}}分钟{{item.s}}秒</div>
                </flexbox-item>
              </flexbox>
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
    name: "record",
    data() {
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
        vodlist: [],
        // page: 1,
        // limit: 5,

      }
    }, mounted() {
      that = this;
      that.reloaddata()

    }, methods: {
      reloaddata() {
        var url = "api/vod/playRecord";
        console.log(url);
        that.api_post(url, function (res) {
          console.log(res);
          var list = res.vodPlayRecordEntities;
          for (var i = 0; i < list.length; i++) {
            list[i].m = parseInt(list[i].lastLength / 1000 / 60);
            list[i].s = parseInt(list[i].lastLength / 1000) % 60
          }
          that.vodlist = list;

          that.resetvideotop()
        })
      }, resetvideotop() {//回到到顶部
        setTimeout(() => {

          that.$refs.scroller.donePulldown();
          this.$refs.scroller.reset({
            top: 0
          })
        }, 1000)

      }, detail(list) {//详情
        console.log("详情", list);
        this.$router.push("detail?id=" + list.sid, function () {
        })
      }
    }
  }
</script>

<style scoped>
  @import "video.css";

</style>
