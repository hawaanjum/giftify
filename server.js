import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { nanoid } from 'nanoid';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import dotenv from 'dotenv';

dotenv.config();
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const app=express();
const PORT=process.env.PORT||3000;
const DATA_DIR=path.join(__dirname,'data');
await fs.mkdir(DATA_DIR,{recursive:true});

app.use(helmet({contentSecurityPolicy:false}));
app.use(cors({origin:true}));
app.use(express.json({limit:'1mb'}));
app.use(morgan('tiny'));

async function appendRecord(file,record){
  const full=path.join(DATA_DIR,file);
  await fs.appendFile(full,JSON.stringify(record)+'\n','utf8');
}
const text=(v,max=2000)=>typeof v==='string'?v.trim().slice(0,max):'';

app.get('/api/health',(req,res)=>res.json({ok:true,service:'Giftify API',time:new Date().toISOString()}));

app.get('/api/products',(req,res)=>{
  // Product catalogue is currently served by the frontend; this endpoint confirms API connectivity.
  res.json({ok:true,message:'Giftify catalogue endpoint is available. Product data can be moved to a database here.'});
});

app.post('/api/custom-requests',async(req,res)=>{
  const name=text(req.body?.name,100), email=text(req.body?.email,254);
  if(!name||!email||!email.includes('@')) return res.status(400).json({error:'Please provide a name and valid email.'});
  const record={
    id:`CUS-${nanoid(8).toUpperCase()}`,name,email,
    recipient:text(req.body?.recipient,80),occasion:text(req.body?.occasion,80),
    product:text(req.body?.product,150),details:text(req.body?.details,3000),
    createdAt:new Date().toISOString()
  };
  try{await appendRecord('custom-requests.jsonl',record);res.status(201).json({ok:true,requestId:record.id,message:'Custom request received.'});}
  catch(err){console.error(err);res.status(500).json({error:'Could not save request.'});}
});

app.post('/api/newsletter',async(req,res)=>{
  const email=text(req.body?.email,254).toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({error:'Please enter a valid email address.'});
  try{await appendRecord('newsletter.jsonl',{email,createdAt:new Date().toISOString()});res.status(201).json({ok:true});}
  catch(err){console.error(err);res.status(500).json({error:'Could not subscribe.'});}
});

app.post('/api/orders/demo',async(req,res)=>{
  const customer=req.body?.customer||{}, items=Array.isArray(req.body?.items)?req.body.items:[];
  if(!text(customer.name,100)||!text(customer.email,254).includes('@')||!text(customer.address,1000)||!items.length)
    return res.status(400).json({error:'Customer, delivery address and items are required.'});
  const safeItems=items.slice(0,30).map(i=>({id:text(i.id,80),product:text(i.product,150),qty:Math.max(1,Math.min(50,Number(i.qty)||1))}));
  const order={orderId:`DEMO-${nanoid(8).toUpperCase()}`,customer:{name:text(customer.name,100),email:text(customer.email,254),address:text(customer.address,1000),note:text(customer.note,1000)},items:safeItems,total:Number(req.body.total)||0,status:'DEMO_ONLY_NO_PAYMENT',createdAt:new Date().toISOString()};
  try{await appendRecord('demo-orders.jsonl',order);res.status(201).json({ok:true,orderId:order.orderId,status:order.status,message:'Demo order saved. No payment was collected.'});}
  catch(err){console.error(err);res.status(500).json({error:'Could not save demo order.'});}
});

app.use(express.static(path.join(__dirname,'dist')));
app.get('*',(req,res)=>{
  if(req.path.startsWith('/api/'))return res.status(404).json({error:'API route not found.'});
  res.sendFile(path.join(__dirname,'dist','index.html'));
});

app.listen(PORT,()=>console.log(`Giftify running on http://localhost:${PORT}`));
