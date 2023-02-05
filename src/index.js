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
  

  let header=new Headers()
      header.set('access-control-allow-origin', '*')
  //上传api
router.post(
    '/api', async ({req,res})=> {
      let form=req.body.formData()
      let img=(await form).get('img')
      const img_check=new RegExp("(.*?)\.(png|jpe?g|gif|bmp|psd|tiff|tga|webp)","i")
      

      //文件格式验证
        if (img_check.test(img.name)) {
        
          let url=await randomString()
        let check=await LINK.get(url)
        if (check!==null) {
          url=await randomString()
        }
      let stream=img.stream()
        await LINK.put(url,stream,{
          metadata:{
            size:img.size,
            name:url,
            type:img.type,
            date:new Date().getTime()
          }
        })
        res.headers=header
        res.body={
          link: req.url+'/img/'+url
        }
        }
        else{
          res.status=400
          res.headers=header
          res.body={
            info:'非图片文件404'
          }
        }
  }
  );

  //获取图片
  router.get('/api/img/:p', async ({req,res})=>{
    let body=await LINK.get(req.params.p,{cacheTtl:864000,type:"stream"})
    let {metadata:{type,date,size}}=await LINK.getWithMetadata(req.params.p,{ type: "text" });
    if (req.headers.has('If-None-Match')) {
      return res.status=304
      
    }
    res.headers=header
    res.headers.set('Cache-Control','public, max-age=864000')
    res.type=type
    res.etag=size
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
