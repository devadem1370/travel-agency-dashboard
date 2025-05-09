import React from 'react'
import { Outlet } from 'react-router'

const AdminLayout = () => {
  return (
    <div className='admin-layout'>
        Mobilesidebar
        <aside className='w-full max-w-[200px] hidden lg:block  '>sidebar</aside>

        <aside className="children">
            <Outlet/>
        </aside>
    </div>
  )
}

export default AdminLayout