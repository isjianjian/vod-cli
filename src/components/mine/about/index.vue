<template>
  <div>
    <cell title="意见反馈" is-link  link="/mine/about/advice">
    </cell>
    <cell title="服务条款" is-link  link="/mine/about/agree">
    </cell>
    <cell title="关于我们" is-link  link="/mine/about/about">
    </cell>
  </div>
</template>

<script>
  import Cell from "vux/src/components/cell/index";

  export default {
    components: {Cell},
    name: "index"
  }
</script>

<style scoped>

</style>
