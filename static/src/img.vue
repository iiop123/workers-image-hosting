<script>
export default{
    data(){
        return{
        file_info:[]
        }
    },
    methods:{
    file(){
      let file_id=this.$refs.inp
      let inp_file=file_id.files
        for (let i = 0; i < file_id.files.length; i++) {
        let reader  = new FileReader();
        reader.onload=(e)=> {
          return this.file_info.push({
            name:inp_file[i].name,
            url:e.target.result
          })
        }
        if (inp_file) {
          reader.readAsDataURL(inp_file[i])
        }
      }
    },
    remove(i){
      this.file_info=this.file_info.filter((t)=>t!=i)
    }
  }
}
</script>
<template>
    <div style="margin: 30px;">
    <input multiple type="file" id="inp" ref="inp"/>
<button @click="file">提交</button>
</div>
<ul>
  <li v-for="(i,index) in file_info" style="display: inline-block; position: relative;" :key="index"><span @click="remove(i)" class="iconfont icon-shanchu" style="position: absolute; right: 1px; top: -5px; font-size: 20px;"></span><img :src="i.url" style="width: 200px;height:200px;margin:20px;">
  <p style="float: left;">第{{index+1}}张</p>
  </li>
</ul>
</template>