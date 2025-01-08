"use client"
import { SWRConfig } from 'swr'
import ListData from './ListData'

const TracksList = () => {
    return (
        <SWRConfig>
            <ListData />
        </SWRConfig>
    )
}

export default TracksList