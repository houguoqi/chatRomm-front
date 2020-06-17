<template>
  <div class="wrapper">
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Bscroll from "better-scroll";
export default {
  name: "scroll",
  mounted() {
    //导入Better-Scroll
    //获取外层 wrapper
    this.scroll = new Bscroll(".wrapper", {
      click: true, //在滚动区域内是否可以点击
      probeType: 3,
      pullUpLoad: true, //是否可以监听事件
      // bounce: false
    });
    // this.scroll.on("scroll", position => {
    //   console.log("滚动监听", position.y);
    //   this.$emit("onScroll", position);
    // });
    this.scroll.on("pullingUp", () => {
      console.log("上拉加载更多");
      //然后重置
      // this.scroll.scrollTo(0,0,1000) //滚动定位
      this.scroll.finishPullUp(); //每次使用 以达到下次可以刷新的目的
    });
  },
  methods: {
    refresh() {
      this.scroll.refresh();
    }
  },
  data() {
    return {
      scroll: {}
    };
  }
};
</script>

<style scoped>
</style>