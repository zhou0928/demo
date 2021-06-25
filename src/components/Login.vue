<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <!--用户名区域-->
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            prefix-icon="el-icon-user-solid"
            v-model="loginForm.username"

          >
          </el-input>
        </el-form-item>
        <!--密码区域-->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            type="password"
          >
          </el-input>
        </el-form-item>
        <!--按钮区域-->
        <el-form-item class="form-item__content">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      // 表单
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      // 表单的验证对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        // 验证密码是否合法
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 10, message: '长度在 6 到 10 个数字', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 重置登录表单
    resetLoginForm() {
      console.log(this)
      this.$refs.loginFormRef.resetFields()

    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await axios.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败')
        }
        this.$message.success('登录成功')
        console.log(res)
        window.sessionStorage.setItem('token', res.data.token)
        await this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  //中间盒子
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    //盒子和头像
    .avatar_box {
      width: 138px;
      height: 138px;
      border-radius: 50%;
      border: 1px solid #eee;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    //表单部分
    .el-form {
      padding: 100px 15px 10px 15px;

      .form-item__content {
        display: flex;
        justify-content: flex-end;

        .el-button {
          margin-right: 10px;
          margin-left: 10px;
          border-radius: 5px;
          width: 100px;
        }
      }
    }
  }
}

</style>
