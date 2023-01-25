<script>
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import 'vue-waterfall-plugin-next/style.css'
import 'https://cdn.jsdelivr.net/npm/viewerjs@1.11.1/dist/viewer.min.js'
import axios from 'axios'
const img_check=new RegExp("(.*?)\.(png|jpe?g|gif|bmp|psd|tiff|tga|webp)","i")
export default{
    data(){
        return{
        file_info:[],
        status:false,
        over_page:false,
        powerby:true,
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
     const drag=document.getElementById('drag')
      drag.addEventListener('dragenter',(e)=>{
        e.preventDefault()
        this.over_page=true
      })
      drag.addEventListener('dragleave',(e)=>{
        e.preventDefault()
        
        if (
        e.clientX <= 0 ||
          e.clientY <= 0 ||
          e.clientX >= window.innerWidth ||
          e.clientY >= window.innerHeight
    ){
      this.over_page=false
    }
      })
      drag.addEventListener('dragover',(e)=>{
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy';
      })
      drag.addEventListener('drop',(e)=>{
        e.preventDefault()
        this.drop_upload(e)
      })
    },
    methods:{
    file(){
      let file_id=this.$refs.inp
      this.powerby=false
      const that=this
      let uplist=[]
       ////////
      async function up(file) {
          let f=new FormData()
          f.append('img',file)
          let UploadObj={
        method:'post',
        url:'/api',
        data:f
      }
      return axios(UploadObj)
      }
      ////

        for (let i = 0; i < file_id.files.length; i++) {
          
          if (file_id.files[i].size>26214400||!img_check.test(file_id.files[i].name)) {
            mdui.alert('文件格式不正确')
         that.status=false
         continue
          }
         uplist.push(up(file_id.files[i]))
         that.status=true
        }
        Promise.all(uplist).then(res=>{
          for (let i = 0; i < uplist.length; i++) {
            console.log(res.data);
            that.file_info.push({
              link:res[i].data.link
            }) 
          }
          that.status=false
        }).catch(err=>{
            mdui.alert(err.response.data.info)
        return that.status=false
        })
    },
    drop_upload(files){
      let file_id=files.dataTransfer.files
      this.powerby=false
      const that=this
      this.over_page=false
      let uplist=[]
      ////////
      async function up(file) {
          let f=new FormData()
          f.append('img',file)
          let UploadObj={
        method:'post',
        url:'/api',
        data:f
      }
      return axios(UploadObj)
      }
      ////

        for (let i = 0; i < file_id.length; i++) {
          if (file_id[i].size>26214400||!img_check.test(file_id[i].name)) {
            mdui.alert('文件格式不正确')
               continue
          }
         that.status=true
        uplist.push(up(file_id[i]))
        }
        Promise.all(uplist).then(res=>{
          for (let i = 0; i < uplist.length; i++) {
            that.file_info.push({
              link:res[i].data.link
            }) 
          }
          return that.status=false
        }).catch(err=>{
            mdui.alert(err.response.data.info)
        return that.status=false
        })
    },
    doCopy(e) {
        this.$copyText(this.file_info[e].link).then(()=>{
          mdui.alert('复制成功')
        },()=>{
          mdui.alert('上传中...')
        }
        )
      },
      display(e){
      const gallery = new Viewer(e);
      gallery.show()
    },
  },
  components:{
    Waterfall,
    LazyImg,
    Loading
}
}
</script>
<template>
  <div id="drag" style="position: absolute; inset:0;">
    <div class="overlay flex_center" v-if="over_page">  
      <div class="drop_text flex_center">
      </div>
</div>
  <Transition name="loading">
    <Loading :active="this.status" loader="bars" width="50" height="50" color="rgb(0,123,255)"></Loading>
    </Transition>
   
    <div style="font-weight: 300; top:20%;" class="center" v-if="powerby">
      GITHUB:<a href="https://github.com/iiop123/workers-image-hosting">Workers-ImageHosting</a>
    </div>
<Waterfall :list="file_info" id="images" :breakpoints="breakpoints">
  <template #item="{ item, url, index }">
    <div class="mdui-card">
  <div class="mdui-card-media">
    <LazyImg :url="item.link" @click="display($event.target)" />
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
<button class="mdui-fab mdui-color-indigo mdui-text-color-white center" style="bottom: 10px; position: fixed;" @change="file">
  <i class="mdui-icon material-icons">add</i>
  <input type="file" accept="image/*" ref="inp" multiple style="opacity: 0;">
</button>
</div>
</template>
<style>
@import 'https://cdn.jsdelivr.net/npm/viewerjs@1.11.1/dist/viewer.min.css';
.drop_text{
  border: dashed 2px;
  border-radius: 10px;
  width: 150px;
  height: 150px;
  color: white;
  padding: 5px;
  }
.drop_text:before{
  content: '+将文件拖到此处，即可上传';
}
.overlay{
  background-color: rgba(0,0,0,.7);
  z-index: 10;
  position: fixed;
  inset: 0;
}
.flex_center{
  display: flex;
  justify-content: center;
  align-items: center;
}

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
