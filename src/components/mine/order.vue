<template>
  <div>
    <view-box ref="viewBox">
      <tab bar-active-color="#3f9de7" :line-width="2" active-color='#3f9de7'
           style="width: 100%">
        <tab-item  @on-item-click="cat" v-bind:selected="tab_index==0">
          全部
        </tab-item>
        <tab-item  @on-item-click="cat" v-bind:selected="tab_index==1">
          待付款
        </tab-item>
        <tab-item  @on-item-click="cat" v-bind:selected="tab_index==2">
          已完成
        </tab-item>
        <tab-item  @on-item-click="cat" v-bind:selected="tab_index==3">
          待评价
        </tab-item>
        <tab-item  @on-item-click="cat" v-bind:selected="tab_index==4">
          已退款
        </tab-item>
      </tab>
      <scroller lock-x :scrollbar-x=false :scrollbar-y=false>
        <div hover-class="ui-cell_active">
          <div class="page__bd">
            <div v-if="list.length == 0" class='loading'>
              <text style='color:#B6B6B6'>
                暂无数据
              </text>
            </div>
            <div v-if="start_loading" class='loading'>
              <text>
                {{loading_text}}
              </text>
            </div>
            <div v-if="loading" class='loading'>
              <image style='height:14px;width:14px;' src='/pages/images/loading.gif'></image>
            </div>
            <div v-for="(item,index) in list" v-key='index' class="weui-cells weui-cells_after-title">
              <div  class="weui-cell">
                <div class="weui-cell__hd">
                  <img slot="icon" :src="item.img" style="margin-right: 5px;vertical-align: middle;"></img>
                </div>
                <div class="weui-cell__bd">
                  <div class="weui-flex bd_title">

                    <div class="weui-flex__item left">
                      订单编号:{{item.billid}}
                    </div>
                    <div v-if="item.status == 1 && new Date(item.timeExpire) > nowDate" class="weui-flex__item right">
                      等待付款
                    </div>
                    <div style='color:#00FF00' v-if="item.status == 2 " class="weui-flex__item right">
                      已完成
                    </div>
                    <div style='color:#D3D3D3' v-if="new Date(item.timeExpire) < nowDate && item.status == 1" class="weui-flex__item right">
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
                      <flexbox-item :span="4"><div class="weui-flex__item left">￥{{item.total}}</div></flexbox-item>
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
                  <div v-if="item.type == 1" >
                    <x-button :data-id='item.cmid' v-on:click.native='toMovie'  type="default" mini plain>影片详情</x-button>
                  </div>
                  <div v-if="item.status == 1 && new Date(item.timeExpire) < nowDate" >
                    <x-button :billid='item.billid' v-on:click.native='toDelete' type="default" mini plain>删除订单</x-button>
                  </div>
                  <div v-if="item.status == 1 && new Date(item.timeExpire) > nowDate" >
                    <x-button :billid='item.billid' v-on:click.native='toCancel' type="warn" mini plain >取消订单</x-button>
                  </div>
                  <div v-if="item.status == 1 && new Date(item.timeExpire) > nowDate" >
                    <x-button v-on:click.native='toPay' :data-bill='item'  type="primary" mini plain >去付款</x-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="bloading" class='bloading' >{{bloading_text}}</div>
        </div>
      </scroller>
    </view-box>
  </div>
</template>

<script>
    import ViewBox from "vux/src/components/view-box/index";
    import {Tab, TabItem} from 'vux'
    import Scroller from "vux/src/components/scroller/index";
    import XButton from "vux/src/components/x-button/index";
    import Flexbox from "vux/src/components/flexbox/flexbox";
    import FlexboxItem from "vux/src/components/flexbox/flexbox-item";
    export default {
      components: {
        FlexboxItem,
        Flexbox,
        XButton,
        Scroller,
        ViewBox,TabItem,
        Tab},
      name: "order",
      data(){
        return{
          tab_index:0,
          activeIndex:0,
          list:[],
          cnt_style:'',
          loading:false,
          bloading: false,
          loading_text:'下拉刷新',
          bloading_text:'正在加载...',
          start_loading:false,
          loaddata:false,
          page:1,
          nowDate: new Date()
        }
      },
      mounted(){
        this.reload()
      },
      methods:{
        cat:function (res) {
          var that = this;
          that.activeIndex = res
          this.reload()
        },
        scroll:function(res){
          var scrollTop = res.detail.scrollTop
          if (this.data.loading){
            return;
          }
          if (scrollTop < -5 && scrollTop > -50){
            this.setData({
              start_loading: true,
              loading_text: '刷新列表'
            })
          }
          if (scrollTop > -5 && this.data.start_loading) {
            this.setData({
              start_loading: false
            })
          }
          if (scrollTop < -50) {
            xx = true
            this.setData({
              loading_text: '释放刷新'
            })
          }
          if (scrollTop > -10 && xx && !this.data.loaddata){
            xx = false
            this.setData({
              loading: true,
              start_loading: false
            })
            this.reload()
          }
          if (scrollTop >= 0 && this.data.loaddata) {
            this.setData({
              loaddata: false
            })
          }
        },reload:function(){
          this.page = 1

          this.loadData()
        }
        ,
        loadData:function(){
          this.$vux.loading.show({
            text: 'Loading'
          })
          var that = this
          that.loaddata = true
          var url = that.common.SERVER_URL + "api/bill?limit=8&page=" + this.page + "&openid=" + this.wxinfo.OPENID
          url += "&token=ff4bfbd8-572c-4e24-b415-b854d2e23c02&tokenType=1"
          if (this.activeIndex != 0){
            url += "&status=" + this.activeIndex
          }
          this.$http.post(url).then( function (res) {
            console.log(res.data.code)
            if (res.data.code == '0') {
              that.list = res.data.page.list
              that.nowDate = new Date()

            } else {
              this.$vux.toast.text(res.data.msg,'center')
            }
            this.$vux.loading.hide()
            that.loading = false
            that.bloading = false
          },function(){
            this.$vux.loading.hide()
            that.loading = false
            that.bloading = false

          })

        },
        addData:function(){
          var that = this
          that.setData({
            bloading: true
          })
          var page = this.data.page + 1
          var url = getApp().data.ip + "bill?limit=8&page=" + page + "&" + getApp().getidtoken()
          if (this.data.activeIndex != 0) {
            url += "&status=" + this.data.activeIndex
          }
          wx.showLoading({
            title: '',
          })
          wx.request({
            url: url,
            method: 'post',
            success: function (res) {
              var list = that.data.list

              if (res.data.code == '0') {
                if (res.data.page.list.length > 0){
                  that.setData({
                    page: page,
                  })
                }else{
                  that.setData({
                    bloading_text: '没有更多了'
                  })
                }
                for (var i = 0; i < res.data.page.list.length;i++){
                  list.push(res.data.page.list[i])
                }
                that.setData({
                  list: list,
                  nowDate:new Date()
                })

              } else {
                wx.showToast({
                  title: res.data.msg,
                })
              }
            }, complete: function () {
              wx.hideLoading()

            }
          })
        },
        toPay:function(res){
          var bill = res.currentTarget.dataset.bill
          wx.navigateTo({
            url: "/pages/video/pay/pay?billid=" + bill.billid + "&body=" + bill.body + "&total=" + bill.total + "&timeExpire=" + bill.timeExpire,
          })
        },
        toMovie: function (res){
          var id = res.currentTarget.dataset.id
          var url = getApp().data.ip + "vod/" + id + "?"+ getApp().getidtoken()
          wx.request({
            url: url,
            method: 'post',
            success: function (res) {
              if (res.data.code == '0') {
                getApp().setvideo(res.data.data)
                wx.navigateTo({
                  url: '/pages/video/detail/detail?vodtype=',
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                })
              }
            }
          })
        },
        toCancel: function (res){
          console.log(res)
          var that = this
          var billid = res.target.attributes.billid.value
          console.log("billid:",billid)
          this.$vux.confirm.show({
            title: '取消订单?',
            content: '',
            onConfirm () {
              that.cancleorder(billid);
            }
          })

        },
        toDelete: function (res) {
          console.log(res)
          var that = this
          var billid = res.target.attributes.billid.value
          this.$vux.confirm.show({
            title: '删除订单?',
            content: '',
            onConfirm () {
              that.cancleorder(billid);
            }
          })

        },
        cancleorder(billid) {
          this.$vux.loading.show({
            text: 'Loading'
          })
          var that = this;
          var url =  that.common.SERVER_URL + "api/canorder?billid=" + billid
          this.$http.post(url).then( function (res) {
            console.log(res.data.code)
            if (res.data.code == '0') {
              this.$vux.toast.text("已取消", 'center')
              that.delByBillid(billid)
            } else {
              this.$vux.toast.text(res.data.msg, 'center')
            }
            this.$vux.loading.hide()
          },function(){
            this.$vux.loading.hide()
          })

        },
        delByBillid:function(billid){
          var bills = this.list
          for(var i = 0;i < bills.length;i++){
            if(bills[i].billid == billid){
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
    margin-top:0;
  }
  .weui-cells {
    position:relative;
    background-color:#FFFFFF;
    line-height:1.41176471;
    font-size:17px;

  }
  view {
    display:block;

  }
  * {
    margin:0;

  }
  .weui-cells::after {
    content:" ";
    position:absolute;
    left:0;
    bottom:0;
    right:0;
    height:1px;
    border-bottom:0.5px solid #D9D9D9;
    color:#D9D9D9;

  }
  .weui-cells::before {
    content:" ";
    position:absolute;
    left:0;
    top:0;
    right:0;
    height:1px;
    border-top:0.5px solid #D9D9D9;
    color:#D9D9D9;

  }

  .weui-cell {
    padding:10px 15px;
    position:relative;
    display:-webkit-box;
    display:-webkit-flex;
    display:flex;
    -webkit-box-align:center;
    -webkit-align-items:center;
    align-items:center;

  }
  view {
    display:block;

  }
  .weui-cell:first-child::before {
     display:none;

  }
  .weui-cell::before {
    content:" ";
    position:absolute;
    left:0;
    top:0;
    right:0;
    height:1px;
    border-top:1px solid #D9D9D9;
    color:#D9D9D9;
    left:15px;

  }
  .weui-cell__bd {
    margin-left:10px;

  }
  .weui-cell__bd {
    -webkit-box-flex:1;
    -webkit-flex:1;
    flex:1;
  }

  .weui-flex {
    display:-webkit-box;
    display:-webkit-flex;
    display:flex;
  }

  .weui-flex__item {
    -webkit-box-flex:1;
    -webkit-flex:1;
    flex:1;
  }

  .weui-cell__hd,.weui-cell__hd img{
    width: 60px;
    height: 70px;
  }
  .weui-cell__bd{
    margin-left: 10px;
  }
  .left{
    align-items: left;
    text-align: left;
  }
  .right{
    align-items: right;
    text-align: right;
  }
  .bd_title{
    font-size:10px;
    color: #B6B6B6;
  }

  .bd_title .right{
    color: #75B8EC;
  }

  .bd_content{
    color: #5A5A5A;
    font-size: 16px;
    margin-top: 5px;
    font-weight: 600;
  }

  .bd_base{
    color: #5A5A5A;
    font-size: 13px;
    margin-top: 5px;
  }
  .bd_base .left{
    font-size: 14px;
    color: #3F9DE7;
  }
  .bd_base .right{
    font-size: 9px;
  }
  .cell_botton{
    height: 35px;
    align-items: right;
    text-align: right;
    line-height: 35px;
  }

  .cell_botton button{
    float: right;
    display: inline-block;
    height: 24px;
    line-height: 24px;
    /*font-size: 24px;*/
    margin-right: 5px;
  }
  .loading{
    height: 80px;
    /* line-height: 80px; */
    align-items: center;
    text-align: center;
  }
  .loading image{
    margin-top: 30px;
  }
  .bloading{
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
