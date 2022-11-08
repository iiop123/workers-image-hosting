<script>
export default{
  data(){
    return{
    valu:"",
    ss:false,
    url:""
  }
  },
  watch:{
    valu(){
      let file=document.getElementById('code')
      this.$nextTick(()=>{
        this.url=file.toDataURL()
      })
    }
  }
  
}
</script>
<template>
  <div class="mdui-container">
<div class="mdui-textfield mdui-textfield-floating-label" style="transform: translateY(100%);">
  <label class="mdui-textfield-label">请输入文本或网址</label>
  <input class="mdui-textfield-input" v-model="valu" type="text"/>
  <button class="mdui-btn mdui-btn-raised mdui-color-indigo mdui-text-color-white" style="margin-top: 10px;" >生成</button>
</div>
<div style="transform: translateY(80%);">
<Code class="mdui-valign mdui-center animate__animated animate__backInLeft" :value="valu" id="code" size="200"></Code>
<a :href="url" download="download">
  <button class="mdui-btn mdui-btn-raised mdui-center mdui-valign mdui-color-indigo mdui-text-color-white" style="margin-top: 50px;">下载图片</button>
</a>
<input class="mdui-textfield-input" type="text" :value="this.$route.params.id"/>
</div>
  </div>
</template>