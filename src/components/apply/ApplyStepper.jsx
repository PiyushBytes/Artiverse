export const applySteps = [
  { id: 'personal', title: 'About You', subtitle: 'Tell us who you are' },
  { id: 'academic', title: 'Academics', subtitle: 'Your academic details' },
  { id: 'creative', title: 'Creative Side', subtitle: 'Show us your passion' },
]

export default function ApplyStepper({ currentStep, onSelectStep }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-1">
        {applySteps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-1">
            <button
              onClick={() => {
                if (i < currentStep) onSelectStep(i)
              }}
              disabled={i > currentStep}
              className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${
                i === currentStep
                  ? 'border border-lime/30 bg-lime/[0.1] text-lime'
                  : i < currentStep
                    ? 'cursor-pointer border border-white/[0.08] bg-white/[0.04] text-white/50 hover:text-white/70'
                    : 'cursor-default border border-transparent bg-transparent text-white/25'
              }`}
            >
              <span
                className={`grid size-5 place-items-center rounded-full text-[10px] font-bold ${
                  i === currentStep
                    ? 'bg-lime text-ink'
                    : i < currentStep
                      ? 'bg-white/20 text-white/70'
                      : 'bg-white/10 text-white/30'
                }`}
              >
                {i < currentStep ? '✓' : i + 1}
              </span>
              <span className="hidden sm:inline">{s.title}</span>
            </button>
            {i < applySteps.length - 1 && (
              <div
                className={`mx-1 h-px w-4 transition-colors sm:w-6 ${
                  i < currentStep ? 'bg-lime/40' : 'bg-white/10'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

