<template>
  <div class="bg-img">
    <div class="img">
      <img src="../assets/logo.png" alt="vue_image" class="image">
    </div>
    <pay
      ref="pays"
      @close="close"
      @forget="forget"
      @input-end="inputEnd">
    </pay>
  </div>
</template>

<script>
import Pay from '../lib/pay/lib/pay'

export default {
  name: 'HelloWorld',
  components: {
    Pay
  },
  data () {
    return {
      payPassword: '132169'
    }
  },
  methods: {
    close () {
      //
    },
    inputEnd (val) {
      setTimeout(() => {
        if (val === this.payPassword) {
          this.$refs.pays.$success(true).then(res => {
            console.log('支付成功')
            this.$router.push('/success')
          })
        } else {
          this.$refs.pays.$fail('支付失败')
        }
      }, 1000)
    }
  }
}
</script>

<style scoped lang="scss">
  .bg-img {
    background-color: grey;
    .img {
      width: 100%;
      text-align: center;
      .image {
        width: 200px;
        height: 200px;
        display: inline-block;
      }
    }
  }
</style>
