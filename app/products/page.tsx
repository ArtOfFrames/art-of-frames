import fs from 'fs';
import path from 'path';
import { Suspense } from 'react';
import { unstable_noStore as noStore } from 'next/cache';
import ProductView, { Product } from './ProductView';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  noStore();
  const productsDir = path.join(process.cwd(), 'public', 'product_images');
  
  // Ensure directory exists
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
  }

  // Load global config
  let globalDiscount = 0;
  const globalConfigPath = path.join(process.cwd(), 'public', 'global-config.json');
  if (fs.existsSync(globalConfigPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(globalConfigPath, 'utf8'));
      if (config.globalDiscount) globalDiscount = Number(config.globalDiscount);
    } catch (e) {
      console.error('Error reading global-config.json', e);
    }
  }

  const allProducts: Product[] = [];
  const categorySet = new Set<string>(['All']);

  function scanFolder(dir: string, depth = 0, currentCategoryDiscount = 0) {
    if (depth > 2) return;
    
    // Check for category-config.json
    let categoryDiscount = currentCategoryDiscount;
    const catConfigPath = path.join(dir, 'category-config.json');
    if (fs.existsSync(catConfigPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(catConfigPath, 'utf8'));
        if (config.categoryDiscount) categoryDiscount = Number(config.categoryDiscount);
      } catch (e) {
        console.error(`Error reading category config in ${dir}`, e);
      }
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    const hasJson = entries.find(e => e.name === 'info.json');
    if (hasJson) {
      const category = path.relative(productsDir, dir).replace(/\\/g, ' / ');
      const jsonPath = path.join(dir, 'info.json');
      
      try {
        const fileContent = fs.readFileSync(jsonPath, 'utf8');
        const data = JSON.parse(fileContent);
        const productsArray = Array.isArray(data) ? data : [data];
        
        if (productsArray.length > 0) {
          categorySet.add(category);
          productsArray.forEach((p, index) => {
            if (p.name) {
              // Calculate Pricing
              let finalPrice = Number(p.price) || 0;
              let originalPrice: number | undefined = undefined;
              let discountPercentage = 0;

              // Priority: 1. salePrice, 2. item discount, 3. categoryDiscount, 4. globalDiscount
              if (p.salePrice) {
                 originalPrice = finalPrice;
                 finalPrice = Number(p.salePrice);
                 discountPercentage = Math.round(((originalPrice - finalPrice) / originalPrice) * 100);
              } else {
                 if (p.discount) {
                   discountPercentage = Number(p.discount);
                 } else if (categoryDiscount > 0) {
                   discountPercentage = categoryDiscount;
                 } else if (globalDiscount > 0) {
                   discountPercentage = globalDiscount;
                 }

                 if (discountPercentage > 0) {
                   originalPrice = finalPrice;
                   finalPrice = Math.round(originalPrice * (1 - (discountPercentage / 100)));
                 }
              }

              allProducts.push({
                ...p,
                status: p.status || 'In Stock',
                description: p.description || '',
                price: finalPrice,
                originalPrice: originalPrice,
                discountPercentage: discountPercentage > 0 ? discountPercentage : undefined,
                id: `${category}-${p.name}-${index}`.toLowerCase().replace(/\s+/g, '-'),
                category: category,
                mainImage: `/product_images/${path.relative(productsDir, dir).replace(/\\/g, '/')}/${p.mainImage}`,
                secondaryImages: (p.secondaryImages || []).map((img: string) => 
                  `/product_images/${path.relative(productsDir, dir).replace(/\\/g, '/')}/${img}`
                )
              });
            }
          });
        }
      } catch (err) {
        console.error(`Error in folder ${dir}:`, err);
      }
    }

    entries.filter(e => e.isDirectory()).forEach(d => {
      scanFolder(path.join(dir, d.name), depth + 1, categoryDiscount);
    });
  }

  scanFolder(productsDir);
  const categories = Array.from(categorySet);

  return (
    <Suspense fallback={
      <div className="container section-padding" style={{ textAlign: 'center', paddingTop: '120px' }}>
        <p>Loading products...</p>
      </div>
    }>
      <ProductView 
        initialProducts={allProducts} 
        categories={categories} 
      />
    </Suspense>
  );
}
