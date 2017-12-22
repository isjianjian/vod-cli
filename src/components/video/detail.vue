<template>
  <view-box v-bind:style="windowHeight">
    <div>
      <div>

        <img class="top-bg" v-bind:style="'background-image: url('+list.pic+');'"/>
        <img class="top-bg2"/>
        <img class="top-bg3"/>
        <img class="top-bg4"/>
      </div>
      <div class="top">
        <img v-bind:src="list.pic"></img>
        <div class="info">
          <div style="width: 60vw;">
            <span class="name">{{list.name}}</span>
            <span class="year"> ({{list.year}})</span>
          </div>
          <div style="width: 60vw;"> 类型: {{list.cName}}</div>
          <div style="width: 60vw;"> 时长: {{list.length}}</div>
          <div style="width: 60vw;"> 导演: {{list.director}}</div>
          <div style="width: 60vw;"> 演员: {{list.act}}</div>
          <div style="width: 60vw;"> 语言: {{list.language}}</div>

          <div class="price-bottom">
            <div class="playAmount">播放量: {{list.playAmount}}</div>
            <div class="price">点播收费: ￥{{list.price}}</div>
          </div>
        </div>
      </div>
      <div class="desc">
        {{list.descript}}
      </div>
      <div v-bind:class="list.paid?'play':'buy'" v-on:click="ok(list)">
        <!--{{list.paid? "播放":"购买"}}-->
      </div>
    </div>

  </view-box>

</template>

<script>
  import ViewBox from "vux/src/components/view-box/index";

  export default {
    name: "detail",
    components: {
      ViewBox
    },
    data() {
      return {
        windowHeight: '',
        list: '',
      }
    },
    mounted(res) {
      this.windowHeight = "height: " + window.innerHeight + "px;background: #ececec;";
      var vid = 0;
      console.log("获取影片详情", this.$router.currentRoute.query)
      if (this.$router.currentRoute.query.id != null) {
        vid = this.$router.currentRoute.query.id;
      } else {
        vid = this.current.vid;
      }

      this.$http.post(this.common.SERVER_URL + "api/vod/" + vid + "?openid=" + this.wxinfo.user.unionId)
        .then(function (res) {
          if (res.data.code == '0') {
            this.list = res.data.data
          } else {
            alert(res.data.msg)
          }
        })
    }, methods: {
      ok(res) {
        console.log("res,",res)
        if (!res.paid) {//购买
          this.$router.replace({ path: '/video/buy', query: { id: res.id}})
        } else {//播放

        }
      }
    }
  }
</script>

<style scoped>
  .top {
    margin: 20px 15px;
    display: flex;
    position: relative;
  }

  .top-bg {
    margin-top: -20px;
    width: 100%;
    height: 200px;
    background-repeat: no-repeat;
    background-size: 120%;
    position: absolute;
    /*z-index: -2;*/
    opacity: 1;
    filter: blur(21px);
  }

  .top-bg2 {
    margin-top: -20px;
    width: 100%;
    height: 200px;
    background-repeat: no-repeat;
    position: absolute;
    z-index: -3;
    background-image: url("../../assets/images/detail_bg.png");
  }

  .top-bg3 {
    margin-top: -20px;
    width: 100%;
    height: 200px;
    background-repeat: no-repeat;
    position: absolute;
    z-index: -4;
    opacity: 1;
    background-image: url("../../assets/images/detail_bg.png");
  }

  .top-bg4 {
    margin-top: -20px;
    width: 100%;
    height: 200px;
    background-repeat: no-repeat;
    position: absolute;
    z-index: -5;
    opacity: 1;
    background-image: url("../../assets/images/detail_bg.png");
  }

  .top img {
    width: 106px;
    height: 150px;
    margin-right: 10px;
  }

  .name {
    color: #fff;
    font-size: 16px;
    line-height: 16px;
    height: 16px;
    width: auto;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .year {
    color: #fff;
    font-size: 13px;
    line-height: 13px;
    height: 13px;
    width: auto;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .info {
    width: 100%;
    height: 150px;
  }

  .info div {
    font-size: 13px;
    color: #fff;
    margin-top: 2px;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

  }

  .price-bottom {
    font-size: 16px;
    line-height: 16px;
    height: 16px;
    display: flex;
    border-top: 1px solid #fff;
    margin-right: 20px;
    bottom: 0;
  }

  .playAmount {
    height: 14px;
    font-size: 14px;
    line-height: 14px;
  }

  .price {
    height: 14px;
    font-size: 14px;
    line-height: 14px;
    position: absolute;
    right: 20px;
  }

  .desc {
    background: #fff;
    padding: 20px 20px;
    font-size: 13px;
    color: #666;
  }

  .buy {
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 50px;
    /*background: red;*/
    /*color: #fff;*/
    /*text-align: center;*/
    /*padding: 10px 0;*/
    background-image: url("../../assets/images/buy_n.png");
  }

  .buy:active {
    /*background: #ECECEC;*/
    background-image: url("../../assets/images/buy_p.png");
  }

  .play {
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 50px;
    /*background: #3f9de7;*/
    /*color: #fff;*/
    /*text-align: center;*/
    /*padding: 10px 0;*/
    background-image: url("../../assets/images/play_n.png");
  }

  .play:active {
    /*background: #ECECEC;*/
    background-image: url("../../assets/images/play_p.png");
  }
</style>
