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
        <img :src="jia_img"  v-on:click ="balance_jia_m" />
        <img :src="jian_img" v-on:click ="balance_jian_m"/>
      </div>
    </div>
    <div>
      <div  v-for="(item,index) in balancelist" >
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
    import balance_jia from "../../../assets/images/balance_jia.png"
    import balance_jian from "../../../assets/images/balance_jian.png"
    import balance_jia_s from "../../../assets/images/balance_jia_s.png"
    import balance_jian_s from "../../../assets/images/balance_jian_s.png"
    export default {
        name: "balance",
        data(){
          return{
            balancelist: {},
            balance: 0,
            jia_img:balance_jia,
            jian_img:balance_jian,
            type:0
          }
        },
      mounted(){
        this.$emit('ref-tab')
        var that = this;
        this.reloadData()
        this.api_post("api/member/balance/residue",function (res) {
          that.balance =  res.balance
        })
      },
      methods:{
        reloadData:function () {
          var that = this;
          var url = "api/memberBalance"
          console.log("this.type ",this.type )
          if (this.type != 0){
            url += "?type=" + this.type
          }
          this.api_post(url,function (res) {
            that.balancelist =  res.finBalanceList
          })
        },
        balance_jia_m:function () {
          if (this.type == 2){
            this.jia_img = balance_jia
            this.type = 0
          }else {
            this.jia_img = balance_jia_s
            this.jian_img = balance_jian
            this.type = 2
          }
          this.reloadData()
        },
        balance_jian_m:function () {
          if (this.type == 1){
            this.jian_img = balance_jian
            this.type = 0
          }else {
            this.jian_img = balance_jian_s
            this.jia_img= balance_jia
            this.type = 1
          }
          this.reloadData()
        }
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

  .icon img {
    width: 32px;
    height: 32px;
    margin-left: 5px;
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
