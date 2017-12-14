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
        <img src="" bindtap='jia' />
        <img src="" bindtap='jian' />
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
        this.$http.post(this.common.SERVER_URL + "api/member/balance/residue?openid=")
          .then(function (res) {
          })
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
