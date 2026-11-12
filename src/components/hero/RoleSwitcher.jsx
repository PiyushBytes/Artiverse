import { motion } from 'motion/react'
import { heroRolesData } from '../../config/heroData'

export default function RoleSwitcher({ activeRole, onRoleChange }) {
  return (
    <div className="mb-4 inline-flex items-center rounded-full border border-[#e4e6da] bg-[#f6f7f2] p-1 shadow-sm">
      {heroRolesData.roles.map((role) => {
        const isActive = activeRole === role
        return (
          <button
            key={role}
            type="button"
            onClick={() => onRoleChange(role)}
            className={`relative rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[#0d0f08] ${
              isActive ? 'text-white' : 'text-[#5e6355] hover:text-[#0d0f08]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="roleTogglePill"
                className="absolute inset-0 rounded-full bg-[#0d0f08]"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">{role}</span>
          </button>
        )
      })}
    </div>
  )
}

