<template>

  <div>

    <group title="安全验证" class="weui-cells_form">
      <!--<x-input title="手机号" class="weui-cell_vcode">-->
      <x-input @on-change="rephone" title="手机号" class="weui-vcode"
               placeholder="请输入手机号"
               :max="11" is-type="china-mobile" :required="true">
        <!--<img slot="right" class="weui-vcode-img" src="">-->
      </x-input>

      <x-input @on-change="recode" title="验证码" class="weui-vcode"
               placeholder="请输入验证码" :max="6"
               :required="true" ref="codeinput">
        <x-button :disabled="typeinput" ref="getcode" slot="right" type="primary" mini @click.native="memberSendCode">
          {{sendCodetips}}
        </x-button>
      </x-input>

    </group>
    <div style="padding:15px;">
      <x-button @click.native="check" type="primary">确定</x-button>
    </div>
  </div>

</template>

<script>
  import XInput from "vux/src/components/x-input/index";
  import Group from "vux/src/components/group/index";
  import XButton from "vux/src/components/x-button/index";
  import Search from "../video/search";
  import Cell from "vux/src/components/cell/index";

  var that;
  export default {

    components: {
      Cell,
      Search,
      XButton,
      Group,
      XInput
    },
    name: "phone",
    data() {
      return {
        tabs: ["手机号快捷登录", "密码登录"],
        activeIndex: 0,
        telPhone: '',
        sendCode: '',//输入二维码
        TruesendCode: '',//真实二维码
        passWord: '',
        sendCodetips: '发送验证码',
        sendCodetimeout: 60,
        TruesendCodeTips: '验证码有误',
        telPhoneTips: '请输入正确的手机号码',
        passWordTips: '密码有误',

        tolink: '',
        interval: '',

        typeinput: false,
      }
    }, destroyed() {
      this.resettime()
    }, mounted() {
      that = this

    }, methods: {

      one() {
      },
      memberSendCode() {//获取验证码

        // console.log(that.$refs.getcode);
        if (this.sendCodetimeout == 60) {
          var url = 'api/memberSendCode?telPhone=' + that.telPhone;

          if (that.telPhone != '' && that.telPhone.length == 11) {

            this.api_post(url, function (res) {
              that.Codetimeout();
              that.TruesendCode = res.sendCode;
              that.typeinput = true;
              console.log(res.sendCode)

              // that.sendCode = res.sendCode;
              // that.$refs.codeinput.currentValue = res.sendCode


            }, function () {
              that.$vux.toast.text("获取验证码失败", 'center');
              that.resettime();
            })

          }
        }

      }
      , resettime() {
        if (that.interval != "") {
          clearInterval(that.interval);//停止定时器
          that.typeinput = false;
          that.sendCodetips = '发送验证码',
            that.sendCodetimeout = 60,
            console.log("停止定时器", that.sendCodetimeout);
        }


      }, Codetimeout() {//获取验证码倒计时

        that.interval = setInterval(function () {
          console.log("验证码倒计时", that.sendCodetimeout);
          if (that.sendCodetimeout > 0) {
            var tmp = that.sendCodetimeout - 1;
            if (tmp == 59) {
            }
            that.sendCodetimeout = tmp,
              that.sendCodetips = '发送验证码(' + that.sendCodetimeout + ')'
          } else {
            that.resettime();
          }
        }, 1000)


      }
      , rephone(res) {//实时获取电话号码
        that.telPhone = res
      }
      , recode(res) {//实时获取输入的验证码
        that.sendCode = res
      }
      , check(res) {//核对验证码



        if (that.telPhone != '' && that.telPhone.length == 11) {


          if (that.sendCode != that.TruesendCode) {
            that.$vux.toast.text("输入验证码失败", 'center')
          } else {
            //注意 测试时用的data.TruesendCode为后台获取真实验证码。实际以data.sendCode传给后台
            //"&pushOpenId=1122&pushType=1&productId=2"推送者ID 推送类型 （1推送影片  2 推送酒店）影片id或者酒店id
            clearInterval(that.interval);//停止定时器

            var url = "api/phone/bind?telPhone=" + that.telPhone + "&sendCode=" + that.sendCode;
            this.api_post(url, function (res) {

              that.$vux.toast.text("綁定成功", 'center');
              that.$router.back();

            }, function (res) {
              that.$vux.toast.text(res.msg, 'center')
            })
          }

        } else {

        }


      }
    }
  }
</script>

<style scoped>

  .wallet-navbar {
    height: 40px;
    line-height: 40px;
    flex: none;
    display: flex;
  }

  .wallet-navbar .item {
    position: relative;
    flex: auto;
    text-align: center;
    width: 50%;
  }

  .wallet-navbar .item.active {
    color: #3f9de7;
    width: 50%;
  }

  .wallet-navbar .item.active:after {
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: #3f9de7;
  }

  .weui-cell-login {
    padding: 10px 0;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    border-bottom: 1px solid #000;
  }

  .weui-tab__panel-login {
    box-sizing: border-box;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    margin: 0 15px;
  }

  .weui-tab__content {
    text-align: left;
  }

  .weui-label-login {
    width: auto;
    word-wrap: break-word;
    word-break: break-all;
  }

  .weui-input-login {
    height: 2.58823529em;
    min-height: 2.58823529em;
    line-height: 2.58823529em;
    padding-left: 10px;
    padding-right: 10px;
  }

  .weui-vcode-btn-login {
    display: inline-block;
    height: 2.58823529em;
    margin-left: 5px;
    padding: 0 0.6em 0 0.7em;
    line-height: 2.58823529em;
    vertical-align: middle;
    font-size: 13px;
    color: #fff;
    background: #3f9de7;
    white-space: nowrap;
    border-radius: 5px;
  }

  .weui-vcode-btn-logindis {
    display: inline-block;
    height: 2.58823529em;
    margin-left: 5px;
    padding: 0 0.6em 0 0.7em;
    line-height: 2.58823529em;
    vertical-align: middle;
    font-size: 13px;
    color: #fff;
    background: #999;
    white-space: nowrap;
    border-radius: 5px;
  }

  .bottom-login {
    margin: 15px;
  }

  .preferential-purchase {
    width: 100%;
    background: #3f9de7;
    color: #fff;
    text-align: center;
    padding: 10px 0;
    margin-left: auto;
    margin-right: auto;
  }

</style>
