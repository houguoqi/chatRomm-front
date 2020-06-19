<template>
  <div class="login">
    <div class="toast">
      <div class="tip" style="color:black;font-weight:600">请输入您的昵称</div>
      <el-input style="width:80%" placeholder="请输入内容" v-model="username" clearable></el-input>
      <el-button type="primary" round @click.native="open">进入聊天室</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: ""
    };
  },
  mounted() {
    document.onkeydown=(e)=>{
      if(e.keyCode===13)
      this.open()
    }
  },
  methods: {
    open() {
      if (this.username === "") {
        this.$message.error({
            message:"昵称不能为空!",
            center:true
        });
      }else if(this.username.includes("'")||this.username.includes('"')){
           this.$message.error({
            message:"昵称不合法!",
            center:true
        });
      }else{
          //跳转到聊天室
          this.$router.push({
              path:'/chat',
              query:{
                  username:this.username
              }
          })
      }
    }
  }
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 100vh;
  background: -webkit-linear-gradient(
    top,
    rgb(212, 158, 233),
    #51d182,
    #b16886
  );
  background-attachment: fixed;
}
.toast {
  width: 400px;
  height: 200px;
  background-color: rgb(159, 216, 194);
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
@media not screen and (min-width: 500px) {
  .toast {
    width: 80%;
    height: 25%;
    background-color: rgb(159, 216, 194);
    position: absolute;
    left: 50%;
    border-radius: 10px;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>