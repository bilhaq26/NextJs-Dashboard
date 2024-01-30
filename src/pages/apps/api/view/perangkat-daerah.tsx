import Grid from '@mui/material/Grid'
import axios from 'axios'
import { useEffect, useState } from 'react'
import DaftarPerangkatDaerah from 'src/views/apps/api/view/perangkat-daerah/DaftarPerangkatDaerah'

const PerangkatDaerah = () => {
  const [dataPerangkat, setDataPerangkat] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://newdashboard.bil/api/perangkat-daerah', {
          headers: {
            key: '1234567890'
          }
        })

        // response not array
        setDataPerangkat(response.data.data)
        console.log(response.data.data)
      } catch (error) {
        console.error('Error fetching data from API:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <Grid container spacing={6} className='match-height'>
      {dataPerangkat.map((item, index) => (
        <Grid key={index} item md={4} sm={6} xs={12}>
          <DaftarPerangkatDaerah item={item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default PerangkatDaerah
