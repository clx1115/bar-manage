<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large" class="login-content-form">
    <el-form-item class="login-animation1" prop="username">
      <el-input text placeholder="用户名" v-model="loginForm.username" clearable autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-User />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation2" prop="password">
      <el-input :type="isShowPassword ? 'text' : 'password'" placeholder="密码" v-model="loginForm.password" autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-Unlock />
          </el-icon>
        </template>
        <template #suffix>
          <i class="iconfont el-input__icon login-content-password" :class="isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'" @click="isShowPassword = !isShowPassword">
          </i>
        </template>
      </el-input>
    </el-form-item>
    <div class="tip">
      <el-checkbox v-model="loginForm.checked" class="rememberMe">记住密码</el-checkbox>
    </div>
    <el-form-item class="login-animation4">
      <el-button type="primary" class="login-content-submit" round v-waves @click="onLogin" :loading="loading">
        <span>登 录</span>
      </el-button>
    </el-form-item>
    <login-captcha ref="loginCaptchaRef" @success="handleSubmit" />
  </el-form>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElForm } from 'element-plus'
import { useUserInfo } from '@/stores/userInfo'
import Base64 from '@/utils/base64';
import LoginCaptcha from '@/components/captcha/WordClickCaptcha.vue'

function validateUserName(rule: any, value: any, callback: any) {
  if (!value) {
    callback(new Error('用户名不能为空'))
  } else {
    callback()
  }
}

function validatePassword(rule: any, value: any, callback: any) {
  if (value.length < 6) {
    callback(new Error('请填写最少6位数的密码'))
  } else {
    callback()
  }
}

// 定义变量内容
const router = useRouter()
const loginFormRef = ref(ElForm)
const storesUserInfo = useUserInfo()
const loginCaptchaRef = ref()

//定义变量
const state = reactive({
  isShowPassword: false,
  loading: false,
  loginForm: {
    username: '',
    password: '',
  } as any, //登录表单
  loginRules: {
    username: [
      { required: true, trigger: 'blur', validator: validateUserName },
    ],
    password: [
      { required: true, trigger: 'blur', validator: validatePassword },
    ],
  },
})

const { isShowPassword, loading, loginForm, loginRules } = toRefs(state)

// 登录
const onLogin = async () => {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      loginCaptchaRef.value?.show()
    } else {
      return false
    }
  })
}

//确认登录
const handleSubmit = async (captchaId: any) => {
  // state.loginForm.vcode = captchaId
  state.loading = true
  storesUserInfo
    .login(state.loginForm)
    .then(() => {
      //判断是否点击记住密码
      if (state.loginForm.checked) {
        const base64Encoder = new Base64();
        localStorage.setItem('userName', state.loginForm.username);
        localStorage.setItem('userPassword', base64Encoder.encode(state.loginForm.password));
      } else {
        localStorage.removeItem('userName');
        localStorage.removeItem('userPassword');
      }
      state.loading = false
      router.push('/')
    })
    .catch(() => {
      state.loading = false
    })
}


// 页面加载时
onMounted(() => {
  // 尝试从localStorage加载记住密码的状态
  if (localStorage.getItem('userName') && localStorage.getItem('userPassword')) {
    state.loginForm.checked = true;
    const base64Encoder = new Base64();
    state.loginForm.username = localStorage.getItem('userName');
    const pass = base64Encoder.decode(localStorage.getItem('userPassword'))
    state.loginForm.password = pass.replaceAll('\u0000', "");
  }
});

</script>

<style scoped lang="scss">
.login-content-form {
  margin-top: 20px;

  @for $i from 1 through 4 {
    .login-animation#{$i} {
      opacity: 0;
      animation-name: error-num;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
      animation-delay: calc($i/10) + s;
    }
  }

  .login-content-password {
    display: inline-block;
    width: 20px;
    cursor: pointer;

    &:hover {
      color: #909399;
    }
  }

  .login-content-code {
    width: 100%;
    padding: 0;
    font-weight: bold;
    letter-spacing: 5px;
  }

  .login-content-submit {
    width: 100%;
    letter-spacing: 2px;
    font-weight: 300;
    margin-top: 15px;
  }
}
</style>
