import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const DATA = path.join(process.cwd(), 'server', 'data.json');

const initialProducts = [
  {id:'p1',name:'Chicken Biryani',category:'Desi',price:450,description:'Aromatic basmati rice, tender chicken and our house masala.',image:'https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy%2Cf_auto%2Cq_auto/RX_THUMBNAIL/IMAGES/VENDOR/2025/3/14/facc08a7-035a-4c83-b984-db2426d4a532_709884.jpg',popular:true},
  {id:'p2',name:'Chicken Karahi (Half)',category:'Desi',price:1250,description:'Traditional wok-cooked chicken karahi with ginger and green chilli.',image:'https://adalatrestaurant.com/_next/image?q=75&url=%2Fhandi_chicken.png&w=3840'},
  {id:'p3',name:'Beef Nihari',category:'Desi',price:650,description:'Slow-cooked rich beef nihari, served with naan.',image:'https://images.unsplash.com/photo-1545247181-516773cae754?w=900&q=85'},
  {id:'p4',name:'Chicken Handi',category:'Desi',price:1350,description:'Creamy, mildly spiced handi finished with fresh herbs.',image:'https://www.halalmealplan.com/_next/image?dpl=dpl_2MFu9WXPKTkKfd92kZj5JsTJUN91&q=75&url=%2Fimages%2Frecipes%2Fchicken-handi.jpg&w=3840'},
  {id:'p5',name:'Daal Makhni',category:'Desi',price:420,description:'Comforting slow-simmered lentils with a buttery tadka.',image:'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=900&q=85'},
  {id:'p6',name:'Chicken Zinger Burger',category:'Fast Food',price:520,description:'Crispy chicken fillet, fresh lettuce and signature sauce.',image:'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=900&q=85',popular:true},
  {id:'p7',name:'Beef Cheese Burger',category:'Fast Food',price:650,description:'Juicy beef patty, melted cheese and house burger dressing.',image:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=85'},
  {id:'p8',name:'Chicken Fajita Pizza (Small)',category:'Fast Food',price:850,description:'Chicken, capsicum, onion and mozzarella on a golden crust.',image:'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=900&q=85'},
  {id:'p9',name:'Alfredo Pasta',category:'Fast Food',price:780,description:'Creamy white sauce pasta with chicken and herbs.',image:'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=85'},
  {id:'p10',name:'Chicken Shawarma',category:'Fast Food',price:350,description:'Spiced chicken, pickles and garlic sauce wrapped fresh.',image:'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=900&q=85'},
  {id:'p11',name:'Club Sandwich',category:'Fast Food',price:580,description:'Triple-layer sandwich with chicken, egg and crisp vegetables.',image:'https://cdn.st-hubert.com/1024x768/10034.jpg'},
  {id:'p12',name:'French Fries',category:'Sides',price:250,description:'Golden crispy fries with house seasoning.',image:'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900&q=85'},
  {id:'p13',name:'Chicken Nuggets (6 pcs)',category:'Sides',price:390,description:'Six crunchy chicken bites with dipping sauce.',image:'https://images.unsplash.com/photo-1562967914-608f82629710?w=900&q=85'},
  {id:'p14',name:'Chocolate Lava Cake',category:'Desserts',price:420,description:'Warm chocolate cake with a soft molten centre.',image:'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&q=85'},
  {id:'p15',name:'Gulab Jamun (2 pcs)',category:'Desserts',price:180,description:'Soft milk dumplings in fragrant sugar syrup.',image:'https://images.pexels.com/photos/9198596/pexels-photo-9198596.jpeg?auto=compress&cs=tinysrgb&w=1200'},
  {id:'p16',name:'Mint Margarita',category:'Drinks',price:280,description:'Refreshing mint, lemon and sparkling soda.',image:'https://images.24ur.com/media/images/original/Jun2024/0196f64ce9b46bbb5252_63247517.jpg?fop=fp%3A0.48%3A0.57&v=1ec9'},
  {id:'p17',name:'Fresh Lime',category:'Drinks',price:180,description:'Freshly squeezed lemon with sweet or salty finish.',image:'https://images.24ur.com/media/images/original/Jun2024/0196f64ce9b46bbb5252_63247517.jpg?fop=fp%3A0.48%3A0.57&v=1ec9'}
];
export function readStore() {
  if (!fs.existsSync(DATA)) {
    const data = { products: initialProducts, orders: [], reservations: [], messages: [], reviews: [] };
    fs.writeFileSync(DATA, JSON.stringify(data, null, 2));
    return data;
  }
  const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  // Refresh starter-menu photo URLs in existing local data while preserving custom prices and orders.
  let changed = false;
  for (const product of (data.products || [])) {
    const current = initialProducts.find(item => item.id === product.id);
    if (current && product.image !== current.image) { product.image = current.image; changed = true; }
  }
  if (changed) writeStore(data);
  return data;
}
export function writeStore(data) { fs.writeFileSync(DATA, JSON.stringify(data, null, 2)); }
export function id() { return crypto.randomUUID(); }
