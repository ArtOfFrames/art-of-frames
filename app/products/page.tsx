import { Suspense } from 'react';
import ProductView, { Product } from './ProductView';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  noStore();
  
  let allProducts: Product[] = [];
  let categories: string[] = ['All'];
  
  try {
    const res = await fetch('/api/products/data', { 
      cache: 'no-store',
    });
    
    if (res.ok) {
      const data = await res.json();
      allProducts = data.products || [];
      categories = data.categories || ['All'];
    }
  } catch (e) {
    console.error('Failed to fetch products data:', e);
  }

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
