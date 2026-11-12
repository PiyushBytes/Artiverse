export default function ProcessStepCard({ step, index, active, product }) {
  return (
    <article
      data-workflow-step
      className={`soft-card min-h-40 p-5 transition-colors sm:p-6 ${
        active ? 'border-[#a9c548]' : 'border-[#e4e6da]'
      }`}
    >
      <span className="text-3xl font-semibold text-[#82954c]">0{index + 1}</span>
      <h3 className="mt-5 text-base font-semibold text-[#0d0f08]">{step}</h3>
      <div className="mt-4 h-px bg-[#eceee6]" />
      <span className="mt-3 block text-xs text-[#73786a]">
        {product === 'Events' ? 'Event workflow' : 'Committee workflow'}
      </span>
    </article>
  )
}

