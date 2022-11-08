<template>
    <div class="mdui-tab mdui-tab-full-width mdui-color-indigo mdui-text-color-white" mdui-tab>
  <a @click="this.$router.push('/')" class="mdui-ripple">home</a>
  <a @click="this.$router.push('/qr')" class="mdui-ripple">qr</a>
</div>
<router-view></router-view>
</template>