import {
    Application,
    Router,
    normalizePathnameMiddleware
  } from '@cfworker/web';
import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

  const router = new Router();
  async function randomString(len) {
    　　len = len || 6;
    　　let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    　　let maxPos = $chars.length;
    　　let result = '';
    　　for (let i = 0; i < len; i++) {
    　　　　result += $chars.charAt(Math.floor(Math.random() * maxPos));
    　　}
    　　return result;
    }
    
    
     addEventListener("fetch", async (event) => {
      let pathname = new URL(event.request.url)
      let asset= new RegExp('/assets/.*','i')
      let index=new RegExp('/index.*','i')
      if (asset.test(pathname.pathname)||index.test(pathname.pathname)) {
        event.respondWith(handleEvent(event));
      } 
    });
    
    async function handleEvent(event) {
      let pathname = new URL(event.request.url)
      console.log('path is '+pathname);
      return getAssetFromKV(event)
  }

  router.get('/',({res})=>{
    res.redirect('/index.html')
  })
router.post(
    '/api', async ({req,res})=> {
      let form=req.body.formData()
      let out=[]
      let img=(await form).getAll('img')
      const img_check=/^[\s\S]*\.(pdf|sh|zip|txt|docx|xlsx|exe|apk)$/
      for (let i = 0; i < img.length; i++) {
        if (img_check.test(img[i].name)) {
          res.status=400
          res.body={name:img[i].name,err:'非图片文件'}
        }else{
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
            date:new Date().getTime()
          }
        })
        out.push(req.url+'/img/'+url)
      res.body = {src:out}
        }
    }}
  );
  
  // Favicon route for fun :)
  router.get('/favicon.ico', ({ res }) => {
    res.type = 'image/svg+xml';
    res.body = `
        <svg xmlns="http://www.w3.org/2000/svg" baseProfile="full" width="200" height="200">
          <rect width="100%" height="100%" fill="#F38020"/>
          <text font-size="120" font-family="Arial, Helvetica, sans-serif" text-anchor="end" fill="#FFF" x="185" y="185">W</text>
        </svg>`;
  });
  

  // Compose the application
  new Application()
  .use(normalizePathnameMiddleware)
  .use(router.middleware)
  .listen();
