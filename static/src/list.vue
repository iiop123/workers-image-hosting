<script>
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import 'vue-waterfall-plugin-next/style.css'
import 'https://cdn.jsdelivr.net/npm/viewerjs@1.11.1/dist/viewer.min.js'
export default{
    data(){
        return{
        list:[],
        auth:true,
        pass:'',
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
      query(){
     this.start=false
        fetch(`/query?pass=${this.pass}`,{
            method:'GET'
        }).then((response)=>{
          if (response.ok) {
            return response.json()
          }
            throw response
        }).then((succ)=>{
            for (let i = 0; i < succ.keys.length; i++) {
                this.list.push(succ.keys[i])
            }
            this.list.sort((a,b)=>{
              this.auth=false
              return b.metadata.date-a.metadata.date
            })
            
        }).catch((err)=>{
          alert('密码错误')
        })
    },
    display(e){
      const gallery = new Viewer(document.getElementById('images'));
      gallery.show()
    },

    doCopy(e) {
        this.$copyText(`${window.location.origin}/api/img/`+this.list[e].name).then(()=>{
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
    <div class="mdui-textfield mdui-textfield-floating-label center" style="top:30%" v-if="auth">
  <label class="mdui-textfield-label">PASSWORD</label>
  <input class="mdui-textfield-input" v-model="pass" type="password" @keyup.enter="query"/>
  <button class="mdui-btn mdui-btn-raised mdui-color-indigo mdui-text-color-white" style="margin-top: 10px;" @click="query">生成</button>
</div>
    </Transition>
<Waterfall :list="this.list" :breakpoints="breakpoints" id="images" v-if="!auth">
  <template #item="{ item, url, index }">
    <div class="mdui-card">
  <div class="mdui-card-media">
    <LazyImg :url="'/api/img/'+item.name" @click="display($event.target)"/>
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
@import 'https://cdn.jsdelivr.net/npm/viewerjs@1.11.1/dist/viewer.min.css';
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