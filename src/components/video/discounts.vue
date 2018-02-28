<template>
  <div>
    <!--<scroller :pulldown-config="downconfig"-->
    <!--@on-pulldown-loading="reloaddata"-->
    <!--:use-pulldown="true" ref="scroller" lock-x :scrollbar-x=false-->
    <!--:scrollbar-y=false>-->


    <!--<div v-if="loading" class='loading'>-->
    <!--<img style='height:14px;width:14px;' src='../../assets/images/loading.gif'></img>-->
    <!--</div>-->
    <!--<div v-if="list != null" class="weui-cells weui-cells_after-title">-->
    <!--<div data-sid='{{list.id}}' bindtap='toMovie' class="weui-cell" hover-class="weui-cell_active">-->
    <!--<div class="weui-cell__hd">-->
    <!--<img src="{{list.pic}}" style="margin-right: 5px;vertical-align: middle;"></img>-->
    <!--</div>-->
    <!--<div class="weui-cell__bd">-->
    <!--<div class="weui-flex bd_content">-->
    <!--<div class="weui-flex__item left">-->
    <!--{{list.name}}-->
    <!--</div>-->
    <!--<div class="right">-->
    <!--优惠观影-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="weui-flex price">-->
    <!--<div class="weui-flex__item left buytime">-->
    <!--价格:-->
    <!--<text class='firstPrice'>{{list.firstPrice}}</text>-->
    <!--<text class="offerPrice">{{list.offerPrice}}</text>-->
    <!--元-->
    <!--</div>-->
    <!--<div class="right">-->
    <!--<img v-if=" list.failureTime < nowDate " src='../../assets/images/due.png'/>-->

    <!--<img v-if="list.buy == 1" src='../../assets/images/used.png'/>-->

    <!--</div>-->
    <!--</div>-->
    <!--<div class="weui-flex bd_base">-->
    <!--<div class="weui-flex__item left">-->
    <!--失效时间:{{list.failureTime}}-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->


    <!--</div>-->
    <!--</scroller>-->
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
        list: null,
        nowDate: '',
      }
    }
    , mounted() {
      that = this;
      that.reloaddata()
    }, methods: {
      reloaddata() {
        var url = "api/vod/queryVod";
        console.log(url);
        that.api_post(url, function (res) {
          console.log(res);
          that.list = res.watch
        })
      }, resetvideotop() {//回到到顶部
        setTimeout(() => {

          that.$refs.scroller.donePulldown();
          that.$refs.scroller.reset({
            top: 0
          })
        }, 1000)

      }, detail(list) {//详情

        that.play(list);
      }, play(list) {
        that.Play(list.id);
      }


    }
  }
</script>

<style scoped>

  .weui-cell__hd, .weui-cell__hd img {
    width: 140px;
    height: 180px;
  }

  .weui-cell__bd {
    margin-left: 20px;
  }

  .left {
    align-items: left;
    text-align: left;
  }

  .right {
    align-items: right;
    text-align: right;
  }

  .bd_title {
    font-size: 20px;
    color: #B6B6B6;
  }

  .bd_title .right {
    color: #75B8EC;
  }

  .bd_content {
    color: #5A5A5A;
    font-size: 36px;
    font-weight: 600;
  }

  .bd_content .right {
    font-size: 18px;
    font-weight: 500;
    color: #3F9DE7;
  }

  .bd_base {
    color: #C3C3C3;
    font-size: 22px;
    margin-top: 25px;
  }

  .bd_base .right {
    font-size: 16px;
  }

  .price {
    font-size: 28px;
    margin-top: 25px;
  }

  .bd_base .buytime {
    margin-top: 10px;
  }

  .loading {
    height: 80px;
    /* line-height: 80px; */
    align-items: center;
    text-align: center;
  }

  .loading img {
    margin-top: 30px;
  }

  .bloading {
    height: 30px;
    /* line-height: 80px; */
    align-items: center;
    text-align: center;
    color: #737373;
  }

  .play {
    float: right;
    color: #fff;
    background: #3f9de7;
    font-size: 10px;
    width: 50px;
    height: 23px;
    line-height: 23px;
    text-align: center;
  }

  .lose {
    float: right;
    color: #fff;
    background: #C3C3C3;
    font-size: 10px;
    width: 50px;
    height: 23px;
    line-height: 23px;
    text-align: center;
  }

  .firstPrice {
    text-decoration: line-through;
  }

  .offerPrice {
    margin-left: 10px;
    font-size: 32px;
    color: red;
  }

  .price .right {
    position: absolute;
    right: 180px;
    top: 30px;
  }

  .price .right img {
    width: 160px;
    height: 160px;
  }
</style>
