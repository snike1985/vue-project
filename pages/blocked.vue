<template>

  <div class="m-grid--desktop m-body">

    <div class="row">

      <!--error-->
      <div class="error col-12">

        <!--error__img-->
        <div class="error__img">
          <img src="~/assets/images/anchor_pic.png" alt="anchor"/>
        </div>
        <!--/error__img-->

        <!--error__title-->
        <h2 class="error__title">You are blocked</h2>
        <!--/error__title-->

        <!--error__text-->
        <p class="error__text">
          Your account has been blocked.<br/>
          Please contact admin <a href="mailto:email@mail.com">email@mail.com</a>
        </p>
        <!--/error__text-->

      </div>
      <!--/error-->

    </div>

  </div>

</template>

<script>
  export default {
    name: "blocked",
    head() {
      return {
        title: 'Blocked User​'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/error';
</style>
