<template>
  <div>
    <div v-if="common.hotel!=null">
      <view-box style="margin: 10px 10px;">
        <!--11111111111111111111111111111-->
        <flexbox :gutter="0">
          <flexbox-item :span="2/3">
            <div class="images">
              <img class="bwbh" src="../../assets/images/m_video_icon.png" v-on:click="menus(1)"/>
            </div>
          </flexbox-item>

          <flexbox-item :span="1/3">
            <flexbox orient="vertical" :gutter="0">
              <flexbox-item>
                <div class="images">
                  <img class="mwmh" src="../../assets/images/m_sport_icon.png"
                       v-on:click="menus(2)"/></div>
              </flexbox-item>
              <flexbox-item>

                <div class="images">
                  <img class="mwmh" src="../../assets/images/m_concert_icon.png"
                       v-on:click="menus(3)"/></div>
              </flexbox-item>
            </flexbox>
          </flexbox-item>
        </flexbox>
        <!--222222222222222222222222-->
        <flexbox :gutter="0">
          <flexbox-item :span="1/3">
            <div class="images">
              <img class="mwmh" src="../../assets/images/m_music_icon.png" v-on:click="menus(4)"/></div>
          </flexbox-item>
          <flexbox-item :span="2/3">
            <div class="images">
              <img class="bwmh" src="../../assets/images/m_kmusic_icon.png" v-on:click="menus(5)"/></div>
          </flexbox-item>
        </flexbox>
        <!--3333333333333333333333333-->
        <flexbox :gutter="0">
          <flexbox-item :span="2/3">
            <div class="images">
              <img class="bwmh" src="../../assets/images/m_vrgame_icon.png" v-on:click="menus(6)"/></div>
          </flexbox-item>
          <flexbox-item :span="1/3">
            <div class="images">
              <img class="mwmh" src="../../assets/images/m_game_icon.png" v-on:click="menus(7)"/></div>
          </flexbox-item>
        </flexbox>
      </view-box>


    </div>

    <div v-if="common.hotel==null">
      <group title="未绑定设备，请扫描酒店屏幕二维码">
        <x-button type="warn" @click.native="checkroom">点击扫描</x-button>
      </group>
    </div>
  </div>
</template>

<script>
  import ViewBox from "vux/src/components/view-box/index";
  import FlexboxItem from "vux/src/components/flexbox/flexbox-item";
  import Flexbox from "vux/src/components/flexbox/flexbox";
  import Group from "vux/src/components/group/index";
  import XButton from "vux/src/components/x-button/index";

  export default {
    components: {
      XButton,
      Group,
      Flexbox,
      FlexboxItem,
      ViewBox
    },
    name: "main",
    methods: {
      checkroom() {
        this.QRcode()
      },
      menus(type) {
        var url = "";
        switch (type) {
          case 1://高清影视
            url = "/video";
            break;
          case 2://体育赛事
            break;
          case 3://演唱会
            break;
          case 4://HIFI音乐
            // url = "/music";
            break;
          case 5://K歌
            url = "/kmusic";
            break;
          case 6://VR体验
            break;
          case 7://电子游戏
            url = "/game";
            break;
        }
        if (url == "") {
          this.$vux.toast.text("此功能尚未开通", "center");

        } else {
          this.$router.push(url)
        }

      }
    }
  }
</script>

<style scoped>

  .images {
    text-align: center;
  }

  .images:active {
    transform: scale(1.2);
  }

  .bwbh {
    width: 98%;
    height: 98%;
    border-radius: 4px;
  }

  .mwmh {
    width: 96%;
    height: 96%;
    border-radius: 4px;
  }

  .bwmh {
    width: 98%;
    height: 98%;
    border-radius: 4px;
  }


</style>
