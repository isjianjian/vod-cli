<template>
<div>
  <divider>Use header slot and content slot</divider>
  <card>
    <img slot="header" src="http://placeholder.qiniudn.com/640x300" style="width:100%;display:block;">
    <div slot="content" class="card-padding">
      <p style="color:#999;font-size:12px;">Posted on January 21, 2015</p>
      <p style="font-size:14px;line-height:1.2;">Quisque eget vestibulum nulla. Quisque quis dui quis ex ultricies efficitur vitae non felis. Phasellus quis nibh hendrerit..</p>
    </div>
  </card>
</div>
</template>

<script>
    import { Divider, Card } from 'vux'
    export default {
        name: "act",
        components: {
          Card,
          Divider
        },
        mounted () {
          this.sid = this.$router.currentRoute.query.sid;
          this.tsid = this.$router.currentRoute.query.openid;
          var url = "api/tuisong/add?sid=" + this.sid + "&tsid=" + this.tsid
          this.api_post(url,function (res) {
            console.log("tuisong/add",res)
          })
        },
        data(){
          return{
            sid:0,
            tsid:''
          }
        },

    }
</script>

<style scoped lang="less">
  @import '~vux/src/styles/1px.less';
  .card-demo-flex {
    display: flex;
  }
  .card-demo-content01 {
    padding: 10px 0;
  }
  .card-padding {
    padding: 15px;
  }
  .card-demo-flex > div {
    flex: 1;
    text-align: center;
    font-size: 12px;
  }
  .card-demo-flex span {
    color: #f74c31;
  }
</style>
