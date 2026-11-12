import PhoneScreen from './PhoneScreen'
import VerifiedCard from './VerifiedCard'

export default function PhoneDevice({ activeRole }) {
  return (
    <div className="relative h-full w-full rounded-[48px] border-[4px] border-[#252820] bg-[#0d0f08] p-[7px] shadow-[0_24px_55px_-12px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.08)_inset]">
      {/* Side Buttons: Volume & Power */}
      <span className="absolute -left-[7px] top-[96px] h-7 w-[3px] rounded-l-sm bg-[#3a3e33]" />
      <span className="absolute -left-[7px] top-[134px] h-10 w-[3px] rounded-l-sm bg-[#3a3e33]" />
      <span className="absolute -left-[7px] top-[182px] h-10 w-[3px] rounded-l-sm bg-[#3a3e33]" />
      <span className="absolute -right-[7px] top-[120px] h-14 w-[3px] rounded-r-sm bg-[#3a3e33]" />

      {/* Internal Phone Screen */}
      <PhoneScreen activeRole={activeRole} />

      {/* Floating role-specific notification card */}
      <VerifiedCard activeRole={activeRole} />
    </div>
  )
}

