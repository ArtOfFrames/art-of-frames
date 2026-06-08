import { Suspense } from 'react';
import ProductView from './ProductView';

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container section-padding" style={{ textAlign: 'center', paddingTop: '120px' }}>
        <p>Loading products...</p>
      </div>
    }>
      <ProductView />
    </Suspense>
  );
}
