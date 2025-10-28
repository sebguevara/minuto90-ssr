'use client'
import { SidebarContent } from './SidebarContent'

export const Sidebar = () => {
  return (
    <aside className="hidden lg:block w-max shrink-0">
      <SidebarContent />
    </aside>
  )
}
