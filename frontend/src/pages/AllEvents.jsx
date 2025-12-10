import React from 'react'
import Events from '../components/Events'
import UpComing from '../components/UpComing'
import SearchBar from '../components/SearchBar'

const AllEvents = () => {
  return (
    <div className='mt-20 p-6'>
        <UpComing
            title="All Events"
            subtitle="Browse through all available events"
        />
        <Events />
    </div>
  )
}

export default AllEvents