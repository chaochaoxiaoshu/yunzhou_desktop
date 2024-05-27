import Sidebar from '@renderer/components/sidebar'
import { createRootRoute, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <div className="flex h-screen overflow-hidden text-white bg-[#050913]">
      <div className="flex-none">
        <Sidebar />
      </div>
      <div className="flex-auto">
        <Outlet />
      </div>
      {/* <TanStackRouterDevtools /> */}
    </div>
  )
})
