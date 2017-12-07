<template>
  <div style="background-color: #fff;">
    <flexbox class="top">
      <img class="seacher_btn" src="../../assets/images/search.png"/>
      <x-input class="seacher_input" @on-change="keyword" placeholder="输入片名、主演或导演"/>
      <img class="histroy_btn" src="../../assets/images/menu.png"/>
    </flexbox>

    <scroller lock-y :scrollbar-x=false :scrollbar-y=false>
      <tab bar-active-color="#3f9de7" line-width="2" active-color='#3f9de7'
           v-bind:style="{width: catlist.length * 50 + 'px'}">
        <tab-item  v-for="list in catlist" @on-item-click="cat">{{list.name}}</tab-item>
      </tab>
    </scroller>


  </div>
</template>

<script>


  import {Tab, TabItem, Scroller, XInput, FlexboxItem, Flexbox} from 'vux'
  import Search from "vux/src/components/search/index";

  export default {
    name: "index",

    components: {
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
      }
    }, mounted() {
      this.$http.post("https://15783510.qcloud.la/hotel_vod/api/vod/classify?openid=oMH3q0Nw7Squr91CqjFi8ITCRgOQ")
        .then(function (res) {

          if (res.data.code == 0) {
            this.catlist = res.data.page.list
            console.log("电影分类", this.catlist)
            this.cat(0)
          } else {

          }

        })
    }, methods: {
      showPosition(position) {
        this.position = position
        this.showPositionValue = true
      },
      keyword(res) {
        console.log(res)
      }
      ,
      cat(res, keyword) {
        // https://15783510.qcloud.la/hotel_vod/api/vod?openid=oMH3q0Nw7Squr91CqjFi8ITCRgOQ&cid=25&page=1&limit=999999
        console.log(keyword)
        if (keyword != null) {//关键字搜索
          keyword = "&keyword=" + keyword
        }
        this.$http.post("https://15783510.qcloud.la/hotel_vod/api/vod?openid=oMH3q0Nw7Squr91CqjFi8ITCRgOQ&cid=" + this.catlist[res].id + "&page=1&limit=999999")
          .then(function (res) {
            if (res.data.code == 0) {
              this.vodlist = res.data.page.list
              console.log("电影搜索", this.vodlist)
            } else {

            }

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

  .film .image {
    height: 92.8px;
  }

  .film image {
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

  .name view {
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

  /* .film .threeD {
      background-color: #49d95d;
      border: 1px solid #efeff4;
  }

  .film .imax {
      background-color: transparent;
      border: 1px solid #efeff4;
      border-left: none;
  } */

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
</style>
