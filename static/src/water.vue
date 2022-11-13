<script>
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import 'vue-waterfall-plugin-next/style.css'
export default{
    data(){
        return{
        file_info:[],
        img_link:[],
        status:false,
        start:true,
        change:true,
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
    mounted(){
     this.start=false
    },
    methods:{
    file(){
      let file_id=this.$refs.inp
      let inp_file=file_id.files
      this.change=false
      let form=new FormData()
        for (let i = 0; i < inp_file.length; i++) {
        let reader  = new FileReader();
        reader.onload=(e)=> {
          form.append('img',inp_file[i])
          this.status=true
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
      if (e.ok) {
        return e.json()
      }else{
        throw e
      }
    }).then((re)=>{
      this.status=false
      for (let i = 0; i < re.src.length; i++) {
        this.img_link.push(re.src[i]) 
      }
    }).catch(async (error)=>{
      const json=await error.json();
      this.file_info=[]
      alert(json.err);
      this.status=false
    })
  },600)      
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
    LazyImg,
    Loading
}
}
</script>
<template>
  <Transition name="loading">
    <Loading :active="this.status" loader="bars" width="50" height="50" color="rgb(0,123,255)"></Loading>
    </Transition>
    <Loading :active="this.start" loader="bars" width="50" height="50" color="rgb(0,123,255)"></Loading>
    <div style="font-weight: 300; top:20%;" class="center" v-if="change">
      GITHUB:<a href="https://github.com/iiop123/workers-image-hosting">Workers-ImageHosting</a>
    </div>
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
<button class="mdui-fab mdui-color-indigo mdui-text-color-white center" style="bottom: 10px;" @change="file">
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
.center{
  position: absolute;
  left: 50%;
    transform: translate(-50%,-50%);
}
</style>
