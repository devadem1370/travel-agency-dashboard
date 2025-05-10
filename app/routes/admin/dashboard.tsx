import Header from 'components/Header'
import React from 'react'

const Dashboard = () => {
  const user = {name: "Adil"}
  return (
    <main className='dashboard wrapper'>
      <Header
      title= {`welcome ${user?.name ?? "Guest"}`}
      description = "Track activity, trends and popular destinations in real tieme"
      />
      dashboard page content
    </main>
  )
}

export default Dashboard