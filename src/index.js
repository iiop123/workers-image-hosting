import {
    Application,
    Router,
    normalizePathnameMiddleware
  } from '@cfworker/web';
import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
const u = '123';//展示页面登录用户名
const p = '123';//密码
/*
默认用户名密码都是123
*/

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
      let list=new RegExp('/list.*','i')
      if (asset.test(pathname.pathname)||index.test(pathname.pathname)) {
        event.respondWith(handleEvent(event));
      }
      if (list.test(pathname.pathname)) {
        event.respondWith(listhandle(event));
      }  
    });
    
    async function handleEvent(event) {
      let pathname = new URL(event.request.url)
      console.log('path is '+pathname);
      return getAssetFromKV(event)
  }
  async function listhandle(request) {
  const has=request.request.headers.has('Authorization')
  if (has) {
    const { user, pass } = await basicAuthentication(request);
    if (u === user && p===pass) {
      return getAssetFromKV(request)
    }
  }

  // Not authenticated.
  return new Response('You need to login.', {
    status: 401,
    headers: {
      // Prompts the user for credentials.
      'WWW-Authenticate': 'Basic realm="my scope", charset="UTF-8"',
    },
  });
  }
  
  function basicAuthentication(request) {
    const Authorization = request.request.headers.get('Authorization');
  
    const [scheme, encoded] = Authorization.split(' ');
  
    if (!encoded || scheme !== 'Basic') {
      throw new BadRequestException('Malformed authorization header.');
    }
  
    const buffer = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
    const decoded = new TextDecoder().decode(buffer).normalize();
    const index = decoded.indexOf(':');
  
    if (index === -1 || /[\0-\x1F\x7F]/.test(decoded)) {
      throw new BadRequestException('Invalid authorization value.');
    }
  
    return {
      user: decoded.substring(0, index),
      pass: decoded.substring(index + 1),
    };
  }

  router.get('/',({res})=>{
    res.redirect('/index.html')
  })
  router.get('/list',({res})=>{
    res.redirect('/list.html')
  })
router.post(
    '/api', async ({req,res})=> {
      let form=req.body.formData()
      let out=[]
      let img=(await form).getAll('img')
      const img_check=/^[\s\S]*\.(jpg|jpeg|png|gif|ico|svg)$/
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
            date:new Date().getTime()
          }
        })
        out.push(req.url+'/img/'+url)
      res.body = {src:out}
        }else{
          res.status=400
          res.body={name:img[i].name,err:'非图片文件'}
        }
    }}
  );
  router.get('/api/img/:p', async ({req,res})=>{
    let body=await LINK.get(req.params.p,{cacheTtl:864000,type:"stream"})
    res.body=body
    
  })  
  // Favicon route for fun :)
  router.get('/favicon.ico', ({ res }) => {
    res.type = 'image/svg+xml';
    res.body = `
        <svg xmlns="http://www.w3.org/2000/svg" baseProfile="full" width="200" height="200">
          <rect width="100%" height="100%" fill="#F38020"/>
          <text font-size="120" font-family="Arial, Helvetica, sans-serif" text-anchor="end" fill="#FFF" x="185" y="185">W</text>
        </svg>`;
  });
  router.get('/query',async ({req,res})=>{
    const key=await LINK.list()
    res.body=key
  })
  

  // Compose the application
  new Application()
  .use(normalizePathnameMiddleware)
  .use(router.middleware)
  .listen();