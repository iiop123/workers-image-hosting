<script>
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/style.css'
export default{
    data(){
        return{
        file_info:[],
        img_link:[],
        status:false,
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
        this.status=true
      fetch('/api',{
      method:'POST',
      body:form
    }).then((e)=>{
    return e.json()}).then((re)=>{
      this.status=false
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
  <Transition name="loading">
    <div v-if="status" class="loading">
    <img src="https://img.giao111.workers.dev/api/img/F3BMbG" style="width: 5vh;">
    <h4>上传中...</h4>
    </div>
    </Transition>
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
.loading-enter-active,
.loading-leave-active {
  transition: all 0.8s ease;
}
.loading-enter-from,
.loading-leave-to {
  opacity: 0;
}
.loading{
  left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
    padding-top: 15px;
    z-index: 999;
    width: 16vh;
    position: absolute;
    background-color: #e5dedecf;
    box-sizing: border-box;
}
</style>