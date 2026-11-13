import { siteConfig } from '../../config/siteConfig'

const fieldClasses =
  'w-full rounded-xl border bg-white/[0.03] px-4 py-3.5 text-[15px] text-white outline-none backdrop-blur-sm transition-all duration-200 placeholder:text-white/30 focus:bg-white/[0.06] focus:shadow-[0_0_0_1px_#D4FF24,0_0_24px_rgba(212,255,36,0.08)]'

const departments = ['CSE', 'IT', 'ECE', 'EE', 'Mechanical', 'Civil', 'Other']
const years = ['1st', '2nd', '3rd']

function FieldWrapper({ label, name, error, children }) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-[13px] font-medium uppercase tracking-[0.12em] text-white/60"
      >
        {label}
      </label>
      {children}
      {error && <p className="text-[12px] text-red-400">{error}</p>}
    </div>
  )
}

export function StepPersonal({ form, onChange, errors }) {
  const border = (name) =>
    errors[name] ? 'border-red-400/60' : 'border-white/[0.1] hover:border-white/25'

  return (
    <div className="space-y-5">
      <FieldWrapper label="Full Name" name="fullName" error={errors.fullName}>
        <input
          id="fullName"
          name="fullName"
          value={form.fullName}
          onChange={onChange}
          placeholder="Your full name"
          className={`${fieldClasses} ${border('fullName')}`}
        />
      </FieldWrapper>

      <FieldWrapper label="College Email" name="email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          placeholder="you@university.edu"
          className={`${fieldClasses} ${border('email')}`}
        />
      </FieldWrapper>

      <FieldWrapper label="Phone / WhatsApp" name="phone" error={errors.phone}>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={onChange}
          placeholder="10-digit number"
          className={`${fieldClasses} ${border('phone')}`}
        />
      </FieldWrapper>
    </div>
  )
}

export function StepAcademic({ form, onChange, errors }) {
  const border = (name) =>
    errors[name] ? 'border-red-400/60' : 'border-white/[0.1] hover:border-white/25'

  return (
    <div className="space-y-5">
      <FieldWrapper label="Roll Number" name="rollNumber" error={errors.rollNumber}>
        <input
          id="rollNumber"
          name="rollNumber"
          value={form.rollNumber}
          onChange={onChange}
          placeholder="Your roll number"
          className={`${fieldClasses} ${border('rollNumber')}`}
        />
      </FieldWrapper>

      <FieldWrapper label="Department" name="department" error={errors.department}>
        <select
          id="department"
          name="department"
          value={form.department}
          onChange={onChange}
          className={`${fieldClasses} ${border('department')} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10`}
        >
          <option value="">Select department</option>
          {departments.map((d) => (
            <option key={d} value={d} className="bg-[#0a0d14]">
              {d}
            </option>
          ))}
        </select>
      </FieldWrapper>

      <FieldWrapper label="Year" name="year" error={errors.year}>
        <select
          id="year"
          name="year"
          value={form.year}
          onChange={onChange}
          className={`${fieldClasses} ${border('year')} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10`}
        >
          <option value="">Select year</option>
          {years.map((y) => (
            <option key={y} value={y} className="bg-[#0a0d14]">
              {y}
            </option>
          ))}
        </select>
      </FieldWrapper>
    </div>
  )
}

export function StepCreative({ form, onChange, errors }) {
  const border = (name) =>
    errors[name] ? 'border-red-400/60' : 'border-white/[0.1] hover:border-white/25'

  return (
    <div className="space-y-5">
      <FieldWrapper label="Domain Preference 1" name="domain1" error={errors.domain1}>
        <select
          id="domain1"
          name="domain1"
          value={form.domain1}
          onChange={onChange}
          className={`${fieldClasses} ${border('domain1')} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10`}
        >
          <option value="">Select domain</option>
          {siteConfig.domains.map((d) => (
            <option key={d.name} value={d.name} className="bg-[#0a0d14]">
              {d.name}
            </option>
          ))}
        </select>
      </FieldWrapper>

      <FieldWrapper label="Domain Preference 2" name="domain2" error={errors.domain2}>
        <select
          id="domain2"
          name="domain2"
          value={form.domain2}
          onChange={onChange}
          className={`${fieldClasses} ${border('domain2')} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10`}
        >
          <option value="">Select second preference</option>
          {siteConfig.domains.map((d) => (
            <option key={d.name} value={d.name} className="bg-[#0a0d14]">
              {d.name}
            </option>
          ))}
        </select>
      </FieldWrapper>

      <div className="space-y-2">
        <label
          htmlFor="why"
          className="block text-[13px] font-medium uppercase tracking-[0.12em] text-white/60"
        >
          Why do you want to join Artiverse?
        </label>
        <textarea
          id="why"
          name="why"
          maxLength={400}
          value={form.why}
          onChange={onChange}
          placeholder="Tell us what inspires you..."
          className={`${fieldClasses} ${border('why')} min-h-[120px] resize-none`}
        />
        <div className="flex items-center justify-between">
          {errors.why ? <p className="text-[12px] text-red-400">{errors.why}</p> : <span />}
          <span className="text-[11px] tabular-nums text-white/30">{form.why.length}/400</span>
        </div>
      </div>

      <FieldWrapper
        label="Portfolio / Drive / Instagram (optional)"
        name="portfolio"
        error={errors.portfolio}
      >
        <input
          id="portfolio"
          name="portfolio"
          value={form.portfolio}
          onChange={onChange}
          placeholder="https://"
          className={`${fieldClasses} ${border('portfolio')}`}
        />
      </FieldWrapper>
    </div>
  )
}

