<script>
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import 'vue-waterfall-plugin-next/style.css'
export default{
    data(){
        return{
        list:[],
        status:false,
        start:true,
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
        fetch('/query',{
            method:'GET'
        }).then((response)=>{
            return response.json()
        }).then((succ)=>{
            for (let i = 0; i < succ.keys.length; i++) {
                this.list.push(succ.keys[i])
            }
            this.list.sort((a,b)=>{
              return b.metadata.date-a.metadata.date
            })
        })
    },
    methods:{
    remove(i){
      this.file_info=this.file_info.filter((t)=>t!=i)
    },
    doCopy(e) {
        this.$copyText('https://img.giao111.workers.dev/api/img/'+this.list[e].name).then(()=>{
          mdui.alert('复制成功')
        },()=>{
          mdui.alert('失败')
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
    <div v-if="status" class="loading">
    <h4>上传中...</h4>
    </div>
    </Transition>
    <Loading :active="this.start" loader="bars" width="50" height="50" color="rgb(0,123,255)"></Loading>
<Waterfall :list="this.list" :breakpoints="breakpoints">
  <template #item="{ item, url, index }">
    <div class="mdui-card">
  <div class="mdui-card-media">
    <LazyImg :url="'/api/img/'+item.name" />
    <div class="mdui-card-media-covered">
      <div class="mdui-card-primary">
        <div class="mdui-card-primary-title">{{item.name}}</div>
      </div>
    </div>
  </div>
  <div class="mdui-card-actions">
    <button class="mdui-btn mdui-ripple mdui-color-indigo mdui-text-color-white" @click="doCopy(index)">复制</button>
  </div>
</div>
  </template>
</Waterfall>
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