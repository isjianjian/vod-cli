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
              <img :src="item.pic" style=" object-fit: cover;"></img>
            </div>
            <div class='detail' style="margin-top: 10px;">

              <flexbox orient="vertical">
                <flexbox-item>
                  <div>{{item.name}}</div>
                </flexbox-item>
                <flexbox-item>
                  <div class="star">购买时间：{{item.buyTime}}</div>

                </flexbox-item>
                <flexbox-item>
                  <div class="star">失效时间：{{item.failureTime}}</div>
                </flexbox-item>
              </flexbox>

              <div class="toplay" v-on:click="play(item)">播放</div>

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
        var url = "api/vod/buySource";
        console.log(url);
        that.api_post(url, function (res) {
          console.log(res);
          var list = res.vodBuyRecords;
          // for (var i = 0; i < list.length; i++) {
          //
          // }
          that.vodlist = list;

          that.resetvideotop()
        })
      }, resetvideotop() {//回到到顶部
        setTimeout(() => {

          that.$refs.scroller.donePulldown();
          that.$refs.scroller.reset({
            top: 0
          })
        }, 1000)

      }, detail(list) {//详情
        // console.log("详情", list)
        // this.current.video = list
        // this.current.vid = list.id
        // this.$router.push("detail?id=" + list.id, function () {
        // })
        that.play(list);
      }, play(list) {
        var id =list.id % 10000000000;
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
