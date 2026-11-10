import { forwardRef } from 'react'

const BrandDuotoneVideo = forwardRef(function BrandDuotoneVideo({ className = '', ...props }, ref) {
  return <>
    <svg className="absolute size-0" aria-hidden="true" focusable="false">
      <filter id="artiverse-duo" colorInterpolationFilters="sRGB">
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.012 0.08 0.831" />
          <feFuncG type="table" tableValues="0.016 0.345 1" />
          <feFuncB type="table" tableValues="0.027 0.788 0.141" />
        </feComponentTransfer>
      </filter>
    </svg>
    <video {...props} ref={ref} className={`brand-duotone-video ${className}`} src={props.src ?? '/video/nav%20video.mp4'} />
  </>
})

export default BrandDuotoneVideo
