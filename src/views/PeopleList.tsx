import { Fragment } from 'react'
import { useStore, type Person } from '@/store'
import { NumericInput } from '@/components/NumericInput'

function ArrowDown() {
  return (
    <svg
      width="9"
      height="33"
      viewBox="0 0 9 33"
      fill="none"
      overflow="visible"
      aria-hidden
    >
      <path
        d="M4.5 0 L4.5 33 M1 29.5 L4.5 33 L8 29.5"
        stroke="#CFCADF"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function PersonRow({ person }: { person: Person }) {
  const updatePersonAge = useStore((s) => s.updatePersonAge)
  const fieldId = `hours-${person.id}`
  const hasValue = person.ageInHours != null

  return (
    <div className="flex h-20 w-fit min-w-[260px] items-center gap-4">
      <img
        src="/img.png"
        alt={person.name}
        className={
          'h-20 w-20 shrink-0 rounded-full object-cover ' +
          'outline outline-1 outline-offset-[2.5px] transition-[outline-color] duration-150 ' +
          (hasValue ? 'outline-[#3D06D7]' : 'outline-transparent')
        }
      />
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={fieldId}
          className={
            'text-sm font-extrabold uppercase tracking-wider transition-colors ' +
            (hasValue ? 'text-[#1E0E4C]' : 'text-[#906FEE]')
          }
        >
          {person.name} is
        </label>
        <div className="flex items-center gap-3">
          <NumericInput
            id={fieldId}
            value={person.ageInHours}
            onChange={(v) => updatePersonAge(person.id, v)}
            placeholder="7"
            aria-label={`${person.name}'s age in hours`}
          />
          <span className="text-lg text-gray-900">hours old</span>
        </div>
      </div>
    </div>
  )
}

export default function PeopleList() {
  const people = useStore((s) => s.people)

  return (
    <div className="flex h-fit min-h-[442px] w-fit min-w-[397px] justify-start bg-white px-9 py-9">
      <div className="flex flex-col items-start">
        {people.map((person, i) => (
          <Fragment key={person.id}>
            {i > 0 && (
              <div className="my-4 flex w-20 justify-center">
                <ArrowDown />
              </div>
            )}
            <PersonRow person={person} />
          </Fragment>
        ))}
      </div>
    </div>
  )
}
