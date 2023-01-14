import {
    Application,
    Router,
    normalizePathnameMiddleware
  } from '@cfworker/web';
import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
const pass='123'//默认登录密码
/*
默认密码都是123
*/

  const router = new Router();
  async function randomString(len) { //随机链接生成
    　　len = len || 6;
    　　let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    　　let maxPos = $chars.length;
    　　let result = '';
    　　for (let i = 0; i < len; i++) {
    　　　　result += $chars.charAt(Math.floor(Math.random() * maxPos));
    　　}
    　　return result;
    }
    
    //静态资源路由
     addEventListener("fetch", async (event) => {
      let pathname = new URL(event.request.url)
      let asset= new RegExp('/assets/.*','i')
      let index=new RegExp('/index.*','i')
      let list=new RegExp('/list.*','i')
      if (asset.test(pathname.pathname)||index.test(pathname.pathname)||list.test(pathname.pathname)) {
        event.respondWith(handleEvent(event));
      }
    });
    
    async function handleEvent(event) {
      return getAssetFromKV(event)
  }
//首页跳转
  router.get('/',({res})=>{
    res.redirect('/index.html')
  })
  
  //上传api
router.post(
    '/api', async ({req,res})=> {
      let form=req.body.formData()
      let out=[]
      let img=(await form).getAll('img')
      const img_check=new RegExp("(.*?)\.(png|jpe?g|gif|bmp|psd|tiff|tga|webp)","i")
      
      //文件格式验证
      for (let i = 0; i < img.length; i++) {
        if (img_check.test(img[i].name)) {
          let url=await randomString()
        let check=await LINK.get(url)
        if (check!==null) {
          url=await randomString()
        }
      let stream=img[i].stream()
        await LINK.put(url,stream,{
          metadata:{
            size:img[i].size,
            name:url,
            type:img[i].type,
            date:new Date().getTime()
          }
        })
        out.push(req.url+'/img/'+url)
        }else{
          res.status=400
          out='非图片文件'
          break
        }
    }
    res.body={src:out}
  }
  );

  //获取图片
  router.get('/api/img/:p', async ({req,res})=>{
    let body=await LINK.get(req.params.p,{cacheTtl:864000,type:"stream"})
    const { metadata } = await LINK.getWithMetadata(req.params.p);
    res.type=metadata.type
    res.body=body
    
  })  

  //简易登陆验证
  router.get('/query',async ({req,res})=>{
    const paramas=req.url.searchParams
    if (paramas.get('pass')==pass) {
      const key=await LINK.list()
    res.body=key
    }
    else{
      res.status=400
      res.body={info:'密码错误'}
    }
  })
  

  // Compose the application
  new Application()
  .use(normalizePathnameMiddleware)
  .use(router.middleware)
  .listen();
