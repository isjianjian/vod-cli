<template>
  <div>
    <div class='ui-yue'>
      <div>剩余积分</div>
      <div class='num'>{{integral}}
        <span style='font-size:10px;'></span>
      </div>
    </div>

    <div class='ui-yue'>
      <div bindtap='all'>历史记录</div>
      <div class='icon'>
        <img :src="jia_img"  v-on:click ="integral_jia_m" />
        <img :src="jian_img" v-on:click ="integral_jian_m"/>
      </div>
    </div>
    <div>
      <div  v-for="(item,index) in integrallist" >
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
  import integral_jia from "../../../assets/images/integral_jia.png"
  import integral_jian from "../../../assets/images/integral_jian.png"
  import integral_jia_s from "../../../assets/images/integral_jia_s.png"
  import integral_jian_s from "../../../assets/images/integral_jian_s.png"
  export default {
    name: "integral",
    data(){
      return{
        integrallist: {},
        integral: 0,
        jia_img:integral_jia,
        jian_img:integral_jian,
        type:0
      }
    },
    mounted(){
      var that = this;
      this.reloadData()
      this.api_post("api/member/credits/residue",function (res) {
        that.integral =  res.credits
      })
    },
    methods:{
      reloadData:function () {
        var that = this;
        var url = "api/memberCredits"
        console.log("this.type ",this.type )
        if (this.type != 0){
          url += "?costtype=" + this.type
        }
        this.api_post(url,function (res) {
          that.integrallist =  res.finCreditsEntities
        })
      },
      integral_jia_m:function () {
        if (this.type == 2){
          this.jia_img = integral_jia
          this.type = 0
        }else {
          this.jia_img = integral_jia_s
          this.jian_img = integral_jian
          this.type = 2
        }
        this.reloadData()
      },
      integral_jian_m:function () {
        if (this.type == 1){
          this.jian_img = integral_jian
          this.type = 0
        }else {
          this.jian_img = integral_jian_s
          this.jia_img= integral_jia
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
