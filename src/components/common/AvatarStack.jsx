import { heroMockupData } from '../../config/heroData'

export default function AvatarStack({ avatars = heroMockupData.avatarStack }) {
  return (
    <div className="flex -space-x-2" aria-hidden="true">
      {avatars.map((item, i) => (
        <span
          key={i}
          className="grid size-8 place-items-center rounded-full border-2 border-white text-[10px] font-bold text-[#34382c]"
          style={{ backgroundColor: item.bg }}
        >
          {item.initial}
        </span>
      ))}
    </div>
  )
}

