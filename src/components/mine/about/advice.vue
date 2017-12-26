<template>
  <div>

    <group>
      <x-textarea :max="200" name="detail"
                  placeholder="你的意见是我们最大的动力" :show-counter="true" @on-change="txt"></x-textarea>
    </group>
    <div class='btn' v-on:click='ok'>确定</div>
  </div>
</template>

<script>
  import XTextarea from "vux/src/components/x-textarea/index";
  import Group from "vux/src/components/group/index";

  var that
  export default {
    components: {
      Group,
      XTextarea
    }, data() {
      return {
        content: '',
        files: [],
      }
    },
    name: "advice",
    mounted() {
      that = this
    }

    , methods: {
      txt(res) {
        that.content = res;
      },
      ok() {

        if (that.content != '') {

          var url = "api/memberFeedback?feedback=" + that.content
          console.log("意见反馈", url)
          that.api_post(url, function (res) {
            console.log("意见反馈", res)
            that.$vux.toast.text("提交成功！", 'center')
          })
        } else {
          that.$vux.toast.text("请您输入您的宝贵意见和建议后进行提交！", 'center')
        }
      }


    }
  }
</script>

<style scoped>
  .btn {
    flex: 1;
    background: #3f9de7;
    color: #fff;
    text-align: center;
    padding: 10px 0;
    margin: 15px 15px;
  }

</style>
