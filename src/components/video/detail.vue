<template>
  <view-box>
    <div>
      <div>
        <img
          style="margin-top:-20px;margin-left:-20px;width:100%;height:200px;background-image: url('http://7xqbwh.dl1.z0.glb.clouddn.com/upload/20171118/08ead76fae8043e6b3200bf204363ecc');background-repeat: no-repeat;background-size: 400%;position:absolute;z-index:-1;opacity:1;filter: blur(10px);"/>
      </div>
      <div class="top">
        <img src="http://7xqbwh.dl1.z0.glb.clouddn.com/upload/20171118/08ead76fae8043e6b3200bf204363ecc"></img>
        <div class="info">
          <div>
            <span class="name">功守道</span>
            <span class="year"> (2084)</span>
          </div>
          <div> 类型: 科幻片</div>
          <div> 时长: 146分钟</div>
          <div> 导演: 赵钱孙李</div>
          <div> 演员: 周吴郑王</div>
          <div> 语言: 简体中文</div>
          <div style=""></div>
          <div class="price-bottom">
            <div class="playAmount">播放量: 8</div>
            <div class="price">点播收费: ￥50</div>
          </div>
        </div>
      </div>
      <div class="desc">
        123赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李赵钱孙李
      </div>
      <div class="buy">
        购买
      </div>
    </div>

  </view-box>

</template>

<script>
  import ViewBox from "vux/src/components/view-box/index";

  export default {
    components: {
      ViewBox
    },
    name: "detail",
    mounted(){
      console.log(this.$router.currentRoute.params.id);
    }
  }
</script>

<style scoped>
  .top {
    height: 200px;
    margin-top: 20px;
    margin-bottom: 0px;
    margin-left: 20px;
    margin-right: 0px;
    display: flex;
    position: relative;
  }

  .top img {
    width: 150px;
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

  .top .btns {
    display: none;
  }

  .top .btns button {
    background: rgba(0, 0, 0, 0.4);
    height: 20px;
    line-height: 20px;
    flex: 1;
    color: #fff;
    margin: 0 5px;
    font-size: 14px;
  }

  .desc {
    background: #fff;
    padding: 20px 20px;
    font-size: 13px;

    color: #666;
  }

  .controlText {
    text-align: center;
  }


  .controlText text {
    display: inline-block;
    width: 28px;
    height: 20px;
  }

  .controlText text:after {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border: 1px solid;
    border-left-width: 0;
    border-top-width: 0;
    transform: rotate(45deg);
  }

  .down text:after {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border: 1px solid;
    border-left-width: 0;
    border-top-width: 0;
    transform: rotate(-135deg);
    position: fixed;
    bottom: 10%;
  }

  .comment {
    margin-top: 20px;
    background: #fff;
  }

  .comment .item {
    display: flex;
    padding: 10px;
  }

  .comment .item image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .comment .nickname {
    font-size: 14px;
  }

  .comment .main {
    padding: 10px 20px 5px 0;
    border-bottom: 1px solid #ccc;
  }

  .comment .main:last-child {
    border-bottom: none;
  }

  .comment .img {
    margin-right: 20px;
  }

  .buy {
    position: fixed;
    width: 100%;
    bottom: 0px;
    background: red;
    color: #fff;
    text-align: center;
    padding: 10px 0;
    border-radius: 8px;
    z-index: 999999;
  }

  .play {
    position: fixed;
    width: 100%;
    bottom: 0;
    background: #3f9de7;
    color: #fff;
    text-align: center;
    padding: 10px 0;
    z-index: 999999;
  }

</style>
