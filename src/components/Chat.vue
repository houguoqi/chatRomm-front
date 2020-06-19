<template>
  <div class="chat">
    <div class="head">聊天室({{users}})</div>
    <div class="msg-area">
      <Scroll class="wrapper" ref="scroll">
        <div>
          <div v-for="(item,index) in messageList" :key="index" class="item">
            <div class="time">{{item.date}}</div>
            <!-- 进入聊天室 -->
            <div class="getin" v-if="item.type===1">{{item.msg}}</div>
            <!-- 发送消息 -->
            <div class="message" :class="{'myclass':item.uid===uid}" v-if="item.type===2">
              <div class="avat">
                <p>{{item.username | name}}</p>
              </div>
              <div class="msg">
                <div class="username">{{item.username}}</div>
                <div class="msg-content">
                  {{item.msg}}
                  <img v-if="item.imgurl" style="width:100%" :src="item.imgurl" />
                  <!-- 拿一个图片来放大版  -->
                </div>
              </div>
            </div>
            <!-- 退出聊天室 -->
            <div class="geout" v-if="item.type===3">{{item.msg}}</div>
          </div>
        </div>
      </Scroll>
    </div>
    <div class="cin-wrap">
      <div class="selectImg">
        <i class="el-icon-picture-outline" style="font-size:33px"></i>
        <input type="file" accept="image/gif, image/jpeg, image/jpg, image/png" id="sendimg" />
      </div>
      <el-input placeholder="请输入内容" v-model="msg" clearable></el-input>
      <el-button type="success" size="medium" round v-if="msg!=``" @click.native="go">发送</el-button>
      <el-button type="success" disabled size="medium" round v-else>发送</el-button>
    </div>
  </div>
</template>

<script>
import Scroll from "../components/Scroll";
export default {
  name: "Chat",
  components: {
    Scroll
  },
  data() {
    return {
      socket: null,
      username: "",
      msg: "",
      messageList: [],
      uid: "",
      img: null,

    };
  },
  mounted() {
    this.username = this.$route.query.username;
    this.getConnect();
    window.onbeforeunload = evenet => {
      this.sendMessage(3);
      this.socket.close();
    };
    // 监听enter
    document.onkeydown = e => {
      if (e.keyCode === 13 && this.msg !== "") {
        this.sendMessage(2, this.msg);
      }
    };
    document.getElementById("sendimg").onchange = e => {
      var reader = new FileReader();
      var AllowImgFileSize = 210000; //上传图片最大值(单位字节)（ 2 M = 2097152 B ）超过2M上传失败
      let file = e.target.files[0];
      var imgUrlBase64;
      if (file) {
        //将文件以Data URL形式读入页面
        imgUrlBase64 = reader.readAsDataURL(file);
        reader.onload = e => {
          //var ImgFileSize = reader.result.substring(reader.result.indexOf(",") + 1).length;//截取base64码部分（可选可不选，需要与后台沟通）
          if (
            AllowImgFileSize != 0 &&
            AllowImgFileSize < reader.result.length
          ) {
            alert("上传失败，请上传不大于2M的图片！");
            return;
          } else {
            //执行上传操作
            // alert(reader.result);
            this.img = reader.result;
            this.sendMessage(2, this.msg);
            this.img = null;
          }
        };
      }
    };
  },
  methods: {
    getConnect() {
      //建立websocket链接
      this.socket = new WebSocket("ws://47.92.39.166:8126");
      //添加新用户  创建id
      if (!this.uid) {
        this.uid = Date.parse(new Date()) + "-" + this.username;
      }

      //成功建立连接
      this.socket.onopen = () => {
        console.log("建立连接成功");
        this.sendMessage(1);
      };

      //接收到服务器消息

      this.socket.onmessage = e => {
        let message = JSON.parse(e.data);
        this.messageList.push(message);
        setTimeout(() => {
          this.$refs.scroll.scroll.refresh();
          this.$refs.scroll.scroll.scrollTo(
            0,
            this.$refs.scroll.scroll.maxScrollY
          );
        }, 200);
      };

      //服务器关闭
      this.socket.onclose = e => {
        console.log("服务器关闭");
      };
    },
    sendMessage(type, msg) {
      this.socket.send(
        JSON.stringify({
          uid: this.uid,
          type: type,
          username: this.username,
          msg: msg,
          img: this.img
        })
      );
      this.msg = "";
    },
    go() {
      this.sendMessage(2, this.msg);
    }
  },
  filters: {
    name(username) {
      return username.substring(0, 1);
    }
  },
  computed: {
    users() {
      let length = this.messageList.length;
      if (this.messageList[length - 1]) return this.messageList[length - 1].len;
      return 0;
    }
  }
};
</script>

<style scoped>
.msg-area {
  width: 100%;
  position: absolute;
  height: calc(100vh - 93px);
  position: relative;
}
.cin-wrap {
  height: 49px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: rgba(221, 230, 233, 0.527);
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.wrapper {
  width: 100%;
  overflow: hidden;
  background-color: rgb(247, 248, 248);
  position: absolute;
  height: 100%;
  margin-top: 44px;
}
.head {
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 44px;
  position: fixed;
  color: rgb(65, 121, 241);
  top: 0;
  left: 0;
  right: 0;
  background-color: rgb(214, 230, 226);
}
.getin,
.geout {
  background-color: rgba(219, 216, 216, 0.795);
  width: 70%;
  margin: 10px auto;
  text-align: center;
  border-radius: 3px;
  font-size: 12px;
  color: rgb(255, 255, 255);
}
/* 根据用户名生成头像 */
.message {
  position: relative;
  width: 80%;
  min-height: 40px;
  margin: 8px 0;
}
.avat {
  display: flex;
  justify-content: center;
  overflow: hidden;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: aliceblue;
  background-color: blueviolet;
  position: absolute;
}
.msg {
  display: inline-block;
  margin-left: 40px;
}
.msg-content {
  margin-left: 5px;
  padding: 5px;
  border-radius: 3px;
  background-color: rgb(243, 243, 243);
}
.myclass {
  margin-left: 20%;
  text-align: right;
}
.myclass .avat {
  display: flex;
  justify-content: center;
  overflow: hidden;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: aliceblue;
  background-color: blueviolet;
  position: absolute;
  right: 0;
}
.myclass .msg {
  margin-left: 0px;
  margin-right: 40px;
}
.username {
  font-size: 12px;
  color: rgb(56, 55, 55);
}
.myclass .msg-content {
  margin-right: 5px;
  padding: 5px;
  background-color: rgb(144, 233, 206);
  text-align: left;
  border-radius: 3px;
}
.time {
  font-size: 6px;
  color: rgb(71, 71, 71);
  text-align: center;
}
.selectImg {
  width: 60px;
  height: 40px;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.selectImg input {
  position: absolute;
  height: 100%;
  opacity: 0;
}
.bigimg {
  position: fixed;
  width: 100vw;
  left: 0;
  height: 100vh;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(219, 216, 216, 0.795);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}
</style>