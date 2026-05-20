import { create } from 'zustand'

export interface Person {
  id: number
  name: string
  ageInHours: number | null
}

interface AppState {
  people: Person[]
  minimumAgeInMonths: number | null
  updatePersonAge: (id: number, ageInHours: number | null) => void
  setMinimumAgeInMonths: (months: number | null) => void
}

export const useStore = create<AppState>((set) => ({
  people: [
    { id: 1, name: 'Samuel', ageInHours: null },
    { id: 2, name: 'Samuel', ageInHours: 100 },
    { id: 3, name: 'Samuel', ageInHours: 1_000_000 },
  ],
  minimumAgeInMonths: null,
  updatePersonAge: (id, ageInHours) =>
    set((state) => ({
      people: state.people.map((p) => (p.id === id ? { ...p, ageInHours } : p)),
    })),
  setMinimumAgeInMonths: (months) => set({ minimumAgeInMonths: months }),
}))
