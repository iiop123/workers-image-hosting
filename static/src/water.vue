<script>
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/style.css'
export default{
    data(){
        return{
        file_info:[],
        img_link:[],
        breakpoints: {
  1200: { //当屏幕宽度小于等于1200
    rowPerView: 4,
  },
  800: { //当屏幕宽度小于等于800
    rowPerView: 3,
  },
  500: { //当屏幕宽度小于等于500
    rowPerView: 2,
  }
}
        }
    },
    methods:{
    file(){
      let file_id=this.$refs.inp
      let inp_file=file_id.files
      let form=new FormData()
        for (let i = 0; i < inp_file.length; i++) {
        let reader  = new FileReader();
        reader.onload=(e)=> {
          form.append('img',inp_file[i])
          return this.file_info.push({
            name:inp_file[i].name,
            src:e.target.result
          })
        }
        if (inp_file) {
          reader.readAsDataURL(inp_file[i])
        }
      }
      
      setTimeout(()=>{
        
      fetch('/api',{
      method:'POST',
      body:form
    }).then((e)=>{
    return e.json()}).then((re)=>{
      for (let i = 0; i < re.src.length; i++) {
        this.img_link.push(re.src[i]) 
      }
    })
  },600)      
    },
    remove(i){
      this.file_info=this.file_info.filter((t)=>t!=i)
    },
    doCopy(e) {
        this.$copyText(this.img_link[e]).then(()=>{
          mdui.alert('复制成功')
        },()=>{
          mdui.alert('上传中...')
        }
        )
      }
  },
  components:{
    Waterfall,
    LazyImg
  }
}
</script>
<template>
<Waterfall :list="file_info" :breakpoints="breakpoints">
  <template #item="{ item, url, index }">
    <div class="mdui-card">
  <div class="mdui-card-media">
    <LazyImg :url="url" />
    <div class="mdui-card-media-covered">
      <div class="mdui-card-primary">
        <div class="mdui-card-primary-title">第{{index}}张</div>
      </div>
    </div>
  </div>
  <div class="mdui-card-actions">
    <button class="mdui-btn mdui-ripple mdui-color-indigo mdui-text-color-white" @click="doCopy(index)">复制</button>
  </div>
</div>
  </template>
</Waterfall>
<button class="mdui-fab mdui-color-indigo mdui-text-color-white" @change="file" style="position: fixed; bottom:30px; margin-left:45%">
  <i class="mdui-icon material-icons">add</i>
  <input type="file" accept="image/*" ref="inp" multiple style="opacity: 0;">
</button>
</template>
<style>
.lazy__img[lazy=loading] {
  padding: 5em 0;
  width: 48px;
}

.lazy__img[lazy=loaded] {
  width: 100%;
}

.lazy__img[lazy=error] {
  padding: 5em 0;
  width: 48px;
}
</style>