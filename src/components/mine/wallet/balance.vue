<template>
  <div>
    <div class='ui-yue'>
      <div>当前余额</div>
      <div class='num'>{{balance}}
        <span style='font-size:10px;'>元</span>
      </div>
    </div>

    <div class='ui-yue'>
      <div bindtap='all'>历史记录</div>
      <div class='icon'>
        <img src="../../images/balance_jia.png" bindtap='jia' />
        <img src="../../images/balance_jian.png" bindtap='jian' />
      </div>
    </div>
    <div>
      <div  v-for="item in balancelist.finBalanceList" >
        <div class='ui-txt' hover-class='ui-cell_active'>
          <div>
            <div>{{item.body}}</div>
            <view class='ui-txtm'>{{item.opTime}}</view>
          </div>
          <div class='ui-txt-right'>
            <div>{{item.amount}}</div>
            <!-- <view class='ui-txtm'>599</view> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "balance",
        data(){
          return{
            balancelist: {},
            balance: 0,
          }
        },
      mounted(){
        var that = this;
        console.log("余额查询", app.data.ip + "member/balance/residue?" + app.getidtoken())

        this.$http.post(this.common.SERVER_URL + "api/member/balance/residue?" + code)
          .then(function (res) {

            this.wxinfo.user = res.data.data
            var state = { 'page_id': 1, 'user_id': 5 };
            var title = '11院线';
            var url = '/#'+ this.$router.currentRoute.path;
            history.pushState(state, title, url);
            console.log("res:", res)
            this.$router.replace(this.$router.currentRoute.path)
            this.initWechat()
          })
        wx.request({


          url: app.data.ip + "" + app.getidtoken(),
          method: 'post',
          success: function (res) {
            console.log("余额查询", res)
            if (res.data.code == '0') {
              that.setData({
                balance: res.data.balance,
              })
            }
          }
        })

        that.getdata("")
      },
      methods:{

      }
    }
</script>

<style scoped>
  .ui-yue {
    border-top: 3px solid #efeff4;
    display: flex;
    padding: 10px 15px;
    align-items: center;
  }

  .num {
    position: absolute;
    right: 15px;
    color: #da251c;
  }

  .icon {
    position: absolute;
    right: 15px;
    display: flex;
  }

  .icon image {
    width: 40px;
    height: 40px;
  }

  .icon:hover {
    opacity: 0.8;
  }

  .ui-txt {
    display: flex;
    flex: 1;
    padding: 8px 15px;
    border-top: 1px solid #efeff4;
    color: #666;
  }

  .ui-txt-right {
    position: absolute;
    right: 15px;
    text-align: right;
  }

  .ui-txtm {
    color: #999;
    font-size: 16px;
  }
  .cell_active {
    background-color: #ff0000;
  }
</style>
