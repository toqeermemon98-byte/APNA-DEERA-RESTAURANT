import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import { readStore, writeStore, id } from './store.js';

const app = express();
const PORT = process.env.PORT || 4000;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@apnadeera.pk').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeThisAdminPassword!';
const SECRET = process.env.JWT_SECRET || 'development-only-change-this-secret';
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use((req,res,next)=>{ req.store = readStore(); next(); });

function tokenFor(email, role='customer') {
  const payload = Buffer.from(JSON.stringify({email,role,exp:Date.now()+7*86400000})).toString('base64url');
  const sig = crypto.createHmac('sha256',SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}
function auth(req,res,next) {
  const token = (req.headers.authorization || '').replace(/^Bearer /,'');
  try {
    const [payload,sig] = token.split('.');
    const expected = crypto.createHmac('sha256',SECRET).update(payload).digest('base64url');
    if (!payload || sig !== expected) throw new Error('bad token');
    const user = JSON.parse(Buffer.from(payload,'base64url').toString());
    if (user.exp < Date.now()) throw new Error('expired');
    req.user = user; next();
  } catch { res.status(401).json({error:'Please sign in to continue.'}); }
}
function admin(req,res,next) { auth(req,res,()=> req.user.role==='admin' ? next() : res.status(403).json({error:'Admin access required.'})); }

app.get('/api/health',(_,res)=>res.json({ok:true,service:'Apna Deera API'}));
app.get('/api/products',(req,res)=>res.json(req.store.products));
app.post('/api/auth/register',(req,res)=>{
  const {name,email,password,phone} = req.body || {};
  if (!name || !email || !password || password.length < 6) return res.status(400).json({error:'Name, valid email and password (6+ characters) are required.'});
  if (email.toLowerCase()===ADMIN_EMAIL) return res.status(409).json({error:'This email is reserved.'});
  const users = req.store.users || [];
  if (users.some(u=>u.email===email.toLowerCase())) return res.status(409).json({error:'Email already registered.'});
  const salt=crypto.randomBytes(16).toString('hex');
  const hash=crypto.scryptSync(password,salt,64).toString('hex');
  users.push({id:id(),name,email:email.toLowerCase(),phone:phone||'',salt,hash});
  req.store.users=users; writeStore(req.store);
  res.status(201).json({token:tokenFor(email.toLowerCase()),user:{name,email:email.toLowerCase(),phone:phone||''}});
});
app.post('/api/auth/login',(req,res)=>{
  const {email,password}=req.body||{};
  if (email?.toLowerCase()===ADMIN_EMAIL && password===ADMIN_PASSWORD)
    return res.json({token:tokenFor(ADMIN_EMAIL,'admin'),user:{name:'Administrator',email:ADMIN_EMAIL,role:'admin'}});
  const u=(req.store.users||[]).find(x=>x.email===email?.toLowerCase());
  if (!u || crypto.scryptSync(password||'',u.salt,64).toString('hex')!==u.hash) return res.status(401).json({error:'Incorrect email or password.'});
  res.json({token:tokenFor(u.email),user:{name:u.name,email:u.email,phone:u.phone}});
});
app.get('/api/orders/mine',auth,(req,res)=>res.json(req.store.orders.filter(o=>o.email===req.user.email)));
app.post('/api/orders',(req,res)=>{
  const {customer,items,paymentMethod,address,notes}=req.body||{};
  if (!customer?.name || !customer?.phone || !address || !Array.isArray(items) || !items.length) return res.status(400).json({error:'Please complete your contact, delivery and cart details.'});
  const normalized=items.map(i=>{const p=req.store.products.find(p=>p.id===i.id); if(!p) throw new Error('Invalid item'); return {id:p.id,name:p.name,price:p.price,quantity:Math.max(1,Math.min(30,Number(i.quantity)||1)),image:p.image};});
  const total=normalized.reduce((s,i)=>s+i.price*i.quantity,0);
  const order={id:id(),orderNumber:'AD-'+Date.now().toString().slice(-7),name:customer.name,phone:customer.phone,email:customer.email||'',address,notes:notes||'',items:normalized,total,paymentMethod:paymentMethod||'Cash on Delivery',paymentStatus:'Pending',status:'Pending',createdAt:new Date().toISOString()};
  req.store.orders.unshift(order); writeStore(req.store); res.status(201).json(order);
});
app.get('/api/admin/orders',admin,(req,res)=>res.json(req.store.orders));
app.patch('/api/admin/orders/:id',admin,(req,res)=>{
  const order=req.store.orders.find(o=>o.id===req.params.id);
  if(!order) return res.status(404).json({error:'Order not found.'});
  const allowed=['Received','Pending','Preparing','Out for delivery','Delivered','Cancelled'];
  if(!allowed.includes(req.body.status)) return res.status(400).json({error:'Invalid order status.'});
  order.status=req.body.status;
  if(req.body.paymentStatus && ['Pending','Paid','Failed'].includes(req.body.paymentStatus)) order.paymentStatus=req.body.paymentStatus;
  writeStore(req.store); res.json(order);
});
app.post('/api/reservations',(req,res)=>{
  const {name,phone,date,time,guests}=req.body||{};
  if(!name||!phone||!date||!time||!guests) return res.status(400).json({error:'Please complete all reservation fields.'});
  const reservation={id:id(),name,phone,date,time,guests:Number(guests),status:'Pending',createdAt:new Date().toISOString()};
  req.store.reservations.unshift(reservation); writeStore(req.store); res.status(201).json(reservation);
});
app.post('/api/contact',(req,res)=>{
  const {name,email,message}=req.body||{};
  if(!name||!email||!message) return res.status(400).json({error:'Please complete all fields.'});
  req.store.messages.unshift({id:id(),name,email,message,createdAt:new Date().toISOString()}); writeStore(req.store); res.status(201).json({message:'Your message has been received.'});
});
app.post('/api/reviews',(req,res)=>{
  const {name,rating,message}=req.body||{};
  if(!name||!message||!rating) return res.status(400).json({error:'Please complete all fields.'});
  req.store.reviews.unshift({id:id(),name,rating:Number(rating),message,createdAt:new Date().toISOString()}); writeStore(req.store); res.status(201).json({message:'Thank you for your review.'});
});
app.get('/api/admin/summary',admin,(req,res)=>{
  const orders=req.store.orders;
  res.json({orders:orders.length,revenue:orders.filter(o=>o.paymentStatus==='Paid'||o.status==='Delivered').reduce((s,o)=>s+o.total,0),pending:orders.filter(o=>!['Delivered','Cancelled'].includes(o.status)).length,reservations:req.store.reservations.length,messages:req.store.messages.length});
});
app.get('/api/admin/reservations',admin,(req,res)=>res.json(req.store.reservations));
app.get('/api/admin/messages',admin,(req,res)=>res.json(req.store.messages));
app.get('/api/admin/reviews',admin,(req,res)=>res.json(req.store.reviews));
app.use(express.static('dist'));
app.get('*',(req,res)=>res.sendFile(process.cwd()+'/dist/index.html'));
app.listen(PORT,()=>console.log(`Apna Deera API running on http://localhost:${PORT}`));
