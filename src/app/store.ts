import { create } from 'zustand'

type View = '3d' | '2d'
type Universe = { id: string; label: string; videoUrl?: string; shine?: number }

type State = {
  view: View
  activeId: string | null
  universes: Universe[]
  setView: (v: View) => void
  setActive: (id: string | null) => void
  setUniverses: (u: Universe[]) => void
}

export const useApp = create<State>((set) => ({
  view: '3d',
  activeId: null,
  universes: [],
  setView: (v) => set({ view: v }),
  setActive: (id) => set({ activeId: id }),
  setUniverses: (u) => set({ universes: u }),
}))
