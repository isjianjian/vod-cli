<template>
  <div>
    <!--<view-box ref="viewBox">-->
    <tab id="state" name="state" bar-active-color="#3f9de7" :line-width="2" active-color='#3f9de7'
         style="width: 100%">
      <tab-item @on-item-click="cat" v-bind:selected="tab_index==0">
        全部
      </tab-item>
      <tab-item @on-item-click="cat" v-bind:selected="tab_index==1">
        待付款
      </tab-item>
      <tab-item @on-item-click="cat" v-bind:selected="tab_index==2">
        已完成
      </tab-item>
      <tab-item @on-item-click="cat" v-bind:selected="tab_index==3">
        待评价
      </tab-item>
      <tab-item @on-item-click="cat" v-bind:selected="tab_index==4">
        已退款
      </tab-item>
    </tab>
    <scroller :pullup-config="upconfig" :pulldown-config="downconfig" @on-pulldown-loading="reload"
              @on-pullup-loading="add"
              :use-pulldown="true" :use-pullup="true" ref="scroller" height="-43" lock-x :scrollbar-x=false
              :scrollbar-y=false>
      <div hover-class="ui-cell_active">
        <div class="page__bd">
          <div v-if="list.length == 0" class='loading'>
              <span style='color:#B6B6B6;display: block;padding-top: 120px;'>
                暂无数据
              </span>
          </div>
          <div v-for="(item,index) in list" class="weui-cells weui-cells_after-title">
            <div class="weui-cell">
              <div class="weui-cell__hd">
                <img slot="icon" :src="item.img" style="margin-right: 5px;vertical-align: middle;"></img>
              </div>
              <div class="weui-cell__bd">
                <div class="weui-flex bd_title">

                  <div class="weui-flex__item left">
                    订单编号:{{item.billid}}
                  </div>
                  <div v-if="item.status == 1 && !item.isExpire" class="weui-flex__item right">
                    等待付款
                  </div>
                  <div style='color:#00FF00' v-if="item.status == 2 " class="weui-flex__item right">
                    已完成
                  </div>
                  <div style='color:#D3D3D3' v-if="item.isExpire && item.status == 1" class="weui-flex__item right">
                    已失效
                  </div>
                </div>
                <div class="weui-flex bd_content">
                  <div class="weui-flex__item left">
                    {{item.body}}
                  </div>
                </div>
                <div class="weui-flex bd_base">
                  <flexbox>
                    <flexbox-item :span="4">
                      <div class="weui-flex__item left">￥{{item.total}}</div>
                    </flexbox-item>
                    <flexbox-item>
                      <div v-if="item.status == 1" class="weui-flex__item right">
                        失效时间:{{item.timeExpire}}
                      </div>
                      <div v-if="item.status == 2" class="weui-flex__item right">
                        完成时间:{{item.timeEnd}}
                      </div>
                    </flexbox-item>
                  </flexbox>
                </div>
              </div>
            </div>
            <div class='cell_botton weui-flex'>
              <div class='weui-flex__item'>
                <div v-if="item.type == 1 && item.isvod">
                  <x-button :cmid='item.cmid' v-on:click.native='toMovie' type="default" mini plain>影片详情</x-button>
                </div>
                <div v-if="item.status == 1 && item.isExpire ">
                  <x-button :billid='item.billid' v-on:click.native='toDelete' type="default" mini plain>删除订单</x-button>
                </div>
                <div v-if="item.status == 1 && !item.isExpire">
                  <x-button :billid='item.billid' v-on:click.native='toCancel' type="warn" mini plain>取消订单</x-button>
                </div>
                <div v-if="item.status == 1 && !item.isExpire">
                  <x-button v-on:click.native='toPay' :data-bill='JSON.stringify(item)' type="primary" mini plain>去付款
                  </x-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <load-more v-if="nodata" :show-loading="false" tip="这是底线" background-color="#fbf9fe"></load-more>
    </scroller>

    <!--</view-box>-->
  </div>
</template>

<script>
  import ViewBox from "vux/src/components/view-box/index";
  import {Tab, TabItem} from 'vux'
  import Scroller from "vux/src/components/scroller/index";
  import XButton from "vux/src/components/x-button/index";
  import Flexbox from "vux/src/components/flexbox/flexbox";
  import FlexboxItem from "vux/src/components/flexbox/flexbox-item";
  import LoadMore from "vux/src/components/load-more/index";

  export default {
    components: {
      LoadMore,
      FlexboxItem,
      Flexbox,
      XButton,
      Scroller,
      ViewBox, TabItem,
      Tab
    },
    name: "order",
    data() {
      return {
        tab_index: 0,
        activeIndex: 0,
        list: [],
        cnt_style: '',
        start_loading: false,
        loaddata: false,
        page: 1,
        nowDate: new Date(),
        // sc_height:document.documentElement.clientHeight - 45
        nodata: false,
        downconfig: {
          content: '下拉刷新',
          height: 60,
          autoRefresh: false,
          downContent: '下拉刷新',
          upContent: '松手刷新数据',
          loadingContent: '正在刷新...',
          clsPrefix: 'xs-plugin-pulldown-'
        },
        upconfig: {
          content: '上拉加载',
          pullUpHeight: 60,
          height: 40,
          autoRefresh: false,
          downContent: '上拉加载',
          upContent: '加载更多',
          loadingContent: '正在加载...',
          clsPrefix: 'xs-plugin-pullup-'
        }
      }
    },
    mounted() {
      var i = this.$router.currentRoute.query.i;
      if (i == null) {
        i = 0
      }
      this.tab_index = this.activeIndex = i;
      this.reload()
    },
    methods: {
      cat: function (res) {
        var that = this;
        that.activeIndex = res;
        this.reload()
      },
      reload: function () {
        this.page = 1;
        this.loadData()
      },
      add: function () {
        this.page += 1;
        this.loadData()
      }
      ,
      loadData: function () {

        this.$vux.loading.show({
          text: 'Loading'
        });
        var that = this;
        var url = "api/bill?limit=8&page=" + this.page;
        if (this.activeIndex != 0) {
          url += "&status=" + this.activeIndex
        }
        this.api_post(url, function (res) {
          if (that.page == 1) {
            for (var i = 0; i < res.page.list.length; i++) {
              var item = res.page.list[i];
              item.isExpire = new Date(item.timeExpire).getTime() < new Date().getTime()

              item.isvod = that.getSType(item.cmid) == 1
              console.log(item.isvod)
            }
            that.list = res.page.list;

            that.$refs.scroller.reset({
              top: 0
            });
            that.$refs.scroller.donePulldown()
          } else {
            for (var i = 0; i < res.page.list.length; i++) {
              var item = res.page.list[i];
              item.isExpire = new Date(item.timeExpire).getTime() < new Date().getTime();
              item.isvod = that.getSType(item.comd_id) == 1;
              that.list.push(item)
            }
            that.$refs.scroller.donePullup();
            that.$refs.scroller.reset()
          }
          if (res.page.list.length == 0) {
            that.$refs.scroller.disablePullup();
            if (that.page != 1) {
              that.nodata = true
            }
          } else {
            that.nodata = false;
            that.$refs.scroller.enablePullup()
          }
          if (res.page.list.length < 8 && that.page == 1) {
            that.$refs.scroller.disablePullup()
          }
          that.nowDate = new Date();
          that.$vux.loading.hide()
        }, function (res) {
          that.$vux.loading.hide();
          that.$vux.toast.text(res.msg, 'center')
        })
      },
      toPay: function (res) {
        var bill = JSON.parse(res.target.dataset.bill);
        console.log(res, bill);
        this.$router.push("/video/pay?id=" + bill.billid + "&body=" + bill.body + "&total=" + bill.total + "&timeExpire=" + bill.timeExpire+"&cmid="+bill.cmid)
      },
      toMovie: function (res) {
        var cmid = res.target.attributes.cmid.value % 10000000000;
        this.$router.push({path: '/detail', query: {id: cmid}})
      },
      toCancel: function (res) {
        var that = this;
        var billid = res.target.attributes.billid.value;
        this.$vux.confirm.show({
          title: '取消订单?',
          content: '',
          onConfirm() {
            that.cancleorder(billid);
          }
        })

      },
      toDelete: function (res) {
        console.log(res);
        var that = this;
        var billid = res.target.attributes.billid.value;
        this.$vux.confirm.show({
          title: '删除订单?',
          content: '',
          onConfirm() {
            that.cancleorder(billid);
          }
        })

      },
      cancleorder(billid) {
        this.$vux.loading.show({
          text: 'Loading'
        });
        var that = this;
        var url = "api/mp/canorder?billid=" + billid;
        this.api_post(url, function (res) {
          console.log(res.code);
          that.$vux.toast.text("已取消", 'center');
          that.delByBillid(billid);
          that.$vux.loading.hide()
        }, function (res) {
          that.$vux.toast.text(res.msg, 'center');
          that.$vux.loading.hide()
        })

      },
      delByBillid: function (billid) {
        var bills = this.list;
        for (var i = 0; i < bills.length; i++) {
          if (bills[i].billid == billid) {
            bills.splice(i, 1);
          }
        }
        this.list = bills
      }
    }
  }
</script>

<style scoped>

  .weui-cells_after-title {
    margin-top: 0;
  }

  .weui-cells {
    position: relative;
    background-color: #FFFFFF;
    line-height: 1.41176471;
    font-size: 17px;

  }

  view {
    display: block;

  }

  * {
    margin: 0;

  }

  .weui-cells::after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 0.5px solid #D9D9D9;
    color: #D9D9D9;

  }

  .weui-cells::before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 0.5px solid #D9D9D9;
    color: #D9D9D9;

  }

  .weui-cell {
    padding: 10px 15px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;

  }

  view {
    display: block;

  }

  .weui-cell:first-child::before {
    display: none;

  }

  .weui-cell::before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    left: 15px;

  }

  .weui-cell__bd {
    margin-left: 10px;

  }

  .weui-cell__bd {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
  }

  .weui-flex {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
  }

  .weui-flex__item {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
  }

  .weui-cell__hd, .weui-cell__hd img {
    width: 60px;
    height: 70px;
  }

  .weui-cell__bd {
    margin-left: 10px;
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
    font-size: 10px;
    color: #B6B6B6;
  }

  .bd_title .right {
    color: #75B8EC;
  }

  .bd_content {
    color: #5A5A5A;
    font-size: 16px;
    margin-top: 5px;
    font-weight: 600;
  }

  .bd_base {
    color: #5A5A5A;
    font-size: 13px;
    margin-top: 5px;
  }

  .bd_base .left {
    font-size: 14px;
    color: #3F9DE7;
  }

  .bd_base .right {
    font-size: 9px;
  }

  .cell_botton {
    height: 35px;
    align-items: right;
    text-align: right;
    line-height: 35px;
  }

  .cell_botton button {
    float: right;
    display: inline-block;
    height: 24px;
    line-height: 24px;
    /*font-size: 24px;*/
    margin-right: 5px;
  }

  .loading {
    height: 80px;
    /* line-height: 80px; */
    align-items: center;
    text-align: center;
  }

  .loading image {
    margin-top: 30px;
  }

  .bloading {
    height: 30px;
    /* line-height: 80px; */
    align-items: center;
    text-align: center;
    color: #737373;
  }
</style>
<style lang="less">

  body {
    background-color: #fbf9fe;
  }
</style>
<style>
  .weui-loadmore {
    width: 100% !important;
    margin-top: 30px;
  }
</style>
