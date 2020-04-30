<template>
  <div class="zfb-pay" v-if="show">
    <div class="content">
      <!--标题栏-->
      <header class="pay-title">
        <div class="ico-back" @click="cancel">
          <img src="./images/back.png" class="img">
        </div>
        <div class="title">{{title}}</div>
      </header>

      <!--密码框-->
      <div class="pass-box">
        <ul class="pass-area">
          <li class="pass-item"
              :class="{on: password.length > index}"
              v-for="(item, index) in digit"
              :key="index"></li>
        </ul>
      </div>

      <!--忘记密码-->
      <div class="forget-pass">
        <div class="forget-pass-btn" @click="forget">忘记密码</div>
      </div>

      <!--键盘区-->
      <ul class="keyboard">
        <li @click="onKeyboard(1)">
          <p class="num"><strong>1</strong></p>
          <p class="character"></p>
        </li>
        <li @click="onKeyboard(2)">
          <p class="num"><strong>2</strong></p>
          <p class="character">ABC</p>
        </li>
        <li @click="onKeyboard(3)">
          <p class="num"><strong>3</strong></p>
          <p class="character">DEF</p>
        </li>
        <li @click="onKeyboard(4)">
          <p class="num"><strong>4</strong></p>
          <p class="character">GHI</p>
        </li>
        <li @click="onKeyboard(5)">
          <p class="num"><strong>5</strong></p>
          <p class="character">JKL</p>
        </li>
        <li @click="onKeyboard(6)">
          <p class="num"><strong>6</strong></p>
          <p class="character">MNO</p>
        </li>
        <li @click="onKeyboard(7)">
          <p class="num"><strong>7</strong></p>
          <p class="character">PQRS</p>
        </li>
        <li @click="onKeyboard(8)">
          <p class="num"><strong>8</strong></p>
          <p class="character">TUV</p>
        </li>
        <li @click="onKeyboard(9)">
          <p class="num"><strong>9</strong></p>
          <p class="character">WXYZ</p>
        </li>
        <li class="none"></li>
        <li class="zero" @click="onKeyboard(0)"><strong>0</strong></li>
        <li class="delete" @click="deleteKey">
          <img class="img" src="./images/delect.png" />
        </li>
      </ul>

      <!--加载中状态-->
      <div class="loading-wrap" v-if="payStatus !== 0">
        <div class="loading">
          <!--加载图标-->
          <img src="./images/loading.png" class="loading-ico" alt="" v-if="payStatus === 1">
          <img src="./images/success.png" class="success-ico" alt="" v-if="payStatus === 2">
          <!--加载文字-->
          <p v-if="payStatus === 1">{{loadingText}}</p>
          <p v-if="payStatus === 2">{{finishedText}}</p>
        </div>
      </div>

      <!--支付失败提示框-->
      <div class="pay-fail" v-if="isShowFail">
        <div class="pay-fail-lay">
          <h3 class="title">{{failTip}}</h3>
          <div class="btns">
            <div @click="reInput">重新输入</div>
            <div @click="forget">忘记密码</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pay',
  model: {
    prop: 'show',
    required: true,
    event: 'change'
  },
  props: {
    digit: {
      type: Number,
      default: 6
    },
    show: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '请输入支付密码'
    },
    loading: {
      type: String,
      default: '正在支付'
    },
    duration: {
      type: Number,
      default: 500
    },
    // 正在支付的文字提示
    loadingText: {
      type: String,
      default: '正在支付'
    },
    // 支付成功的文字提示
    finishedText: {
      type: String,
      default: '支付成功'
    }
  },
  data () {
    return {
      payStatus: 0, // 0无状态 1正在支付 2支付成功
      password: '',
      isShowFail: false
    }
  },
  watch: {
    password () {
      if (this.password.length === this.digit) {
        setTimeout(() => {
          this.payStatus = 1
          this.$emit('input-end', this.password)
        }, 200)
      }
    }
  },
  methods: {
    onKeyboard (key) {
      if (this.password.length < 6) {
        this.password = this.password + key
      }
    },
    cancel () {
      if (this.payStatus === 1) return
      this.password = ''
      this.payStatus = 0
      this.$emit('change', false)
      this.$emit('close')
    },
    forget () {
      //
    },
    deleteKey () {
      if (this.password.length === 0) return
      this.password = this.password.substring(0, this.password.length - 1)
    },
    $success () {
      return new Promise((resolve, reject) => {
        // 支付成功立即显示成功状态
        this.payStatus = 2
        // 待指定间隔后，隐藏整个支付弹窗，并resolve
        setTimeout(() => {
          this.cancel()
          resolve()
        }, this.duration)
      })
    },
    $fail (tip) {
      tip && typeof tip === 'string' && (this.failTip = tip)
      // 隐藏掉支付状态窗口
      this.payStatus = 0
      // 显示密码错误弹窗
      this.isShowFail = true
    },
    reInput () {
      this.isShowFail = false
      this.password = ''
    }
  }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
* {
  padding: 0;
  margin: 0;
  font-size: 14px;
}
ul, li {
  list-style: none;
}
.zfb-pay {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  max-width: 750px;
  z-index: 998;
  background: rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column-reverse;
  .content {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    background: white;
    .pay-title {
      font-size: 20px;
      color: grey;
      width: 100%;
      text-align: center;
      border-bottom: 1px solid lightgray;
      box-sizing: border-box;
      padding: 8px 2px;
      display: flex;
      .ico-back {
        display: flex;
        width: 40px;
        z-index: 100;
        .img {
          justify-content: center;
          width: 30px;
          height: 20px;
        }
      }
      .title {
        flex: 1;
        justify-content: center;
        align-items: center;
        margin-left: -40px;
      }
    }
    .pass-box {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 20px;
      .pass-area {
        list-style: none;
        display: flex;
        flex-wrap: nowrap;
        border: 1px solid #e7e7e7;
        border-radius: 4px;
        height: 40px;
        .pass-item {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          border-right: 1px solid #e7e7e7;
          &:last-child {
            border-right: 0;
          }
          &.on:after {
            content: "";
            width: 8px;
            height: 8px;
            overflow: hidden;
            border: 1px solid black;
            border-radius: 50%;
            background: black;
          }
        }
      }
    }
    .forget-pass {
      width: 100%;
      .forget-pass-btn {
        display: flex;
        justify-content: flex-end;
        color: #24b0ff;
        padding: 0 20px;
      }
    }
    .keyboard {
      margin-top: 65px;
      width: 100%;
      display: flex;
      text-align: center;
      flex-wrap: wrap;
      li {
        width: 33.3333%;
        height: 45px;
        padding-top: 4px;
        text-align: center;
        border-bottom: 1px solid #b2b2b2;
        border-right: 1px solid #b2b2b2;
        box-sizing: border-box;
        user-select: none;
        .num {
          font-weight: bold;
        }
        .character {
          font-size: 12px;
        }
        &:nth-child(3n) {
          border-right: 0;
        }
        &:active{
          background-color: lightgray;
        }
      }
      .zero {
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .none {
        background-color: lightgray;
      }
      .delete {
        background-color: lightgray;
        display: flex;
        align-items: center;
        justify-content: center;
        &:active{
          background-color: white;
        }
        .img {
          width: 30px;
          height: 30px;
        }
      }
    }
    .loading-wrap {
      position: absolute;
      left: 0;
      top: 40px;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;
      .loading {
        text-align: center;
        .loading-ico {
          animation: rotate 0.6s linear infinite;
          @-webkit-keyframes rotate {
            0% {
              transform: rotate(0)
            }
            50% {
              transform: rotate(180deg)
            }
            100% {
              transform: rotate(360deg)
            }
          }
          @keyframes rotate {
            0% {
              transform: rotate(0)
            }
            50% {
              transform: rotate(180deg)
            }
            100% {
              transform: rotate(360deg)
            }
          }
          p {
            margin-top: 6px;
          }
        }
      }
    }
    .pay-fail {
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      max-width: 750px;
      background: rgba(0,0,0,.6);
      z-index: 999;
      .pay-fail-lay {
        width: 60%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        border-radius: 10px;
        overflow: hidden;
        .title {
          line-height: 30px;
          text-align: center;
          font-size: 16px;
          padding: 10px;
        }
        .btns {
          display: flex;
          border-top: 1px solid #f1f1f1;
          div {
            flex: 1;
            height: 40px;
            line-height: 40px;
            text-align: center;
            &:active {
              background: #f3f3f3;
            }
            &:last-child {
              border-left: 1px solid #f1f1f1;
            }
          }
        }
      }
    }
  }
}
</style>
