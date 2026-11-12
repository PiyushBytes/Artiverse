import Reveal from '../common/Reveal'
import ProductCard from './ProductCard'
import { productDetails } from '../../config/landingData'

export default function Products() {
  return (
    <section id="products" className="section-pad bg-[#f6f7f2]">
      <div className="container-x">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow">One home for campus culture</p>
          <h2 className="display-font mt-4 text-[clamp(32px,5vw,52px)] font-semibold leading-tight tracking-[-0.03em] text-[#0d0f08]">
            Two sides of every campus.{' '}
            <span className="highlight italic">One platform.</span>
          </h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          <ProductCard
            id="events"
            title="Events"
            audience="For event managers"
            items={productDetails.events}
          />
          <ProductCard
            id="committees"
            title="Committees"
            audience="For coordinators and members"
            items={productDetails.committees}
          />
        </div>
      </div>
    </section>
  )
}

