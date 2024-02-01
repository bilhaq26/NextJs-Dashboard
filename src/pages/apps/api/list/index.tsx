// ** React Imports
import { Fragment, useEffect, useState, SyntheticEvent } from 'react'

// ** Next Imports
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import axios from 'axios'

// ** Demo Imports
import ApiHeader from 'src/views/apps/api/list/HeaderApi'
import DaftarApi from 'src/views/apps/api/list/DaftarApi'

const Api = () => {
  // ** States
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>('payment')

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get('http://newdashboard.bil/api/daftar-api', {
          headers: {
            key: '1234567890'
          }
        })

        // Pastikan respons memiliki properti data dan data adalah array
        if (response.data && Array.isArray(response.data.data)) {
          setData(response.data.data)
        } else {
          console.error('Invalid data format. Expecting an array.')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData() // Call the fetch function
  }, [])

  const renderNoResult = (
    <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', '& svg': { mr: 2 } }}>
      <Icon fontSize='1.5rem' icon='tabler:alert-circle' />
      <Typography variant='h5'>No Results Found!!</Typography>
    </Box>
  )

  return (
    <Fragment>
      <ApiHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {data !== null && data.length > 0 ? <DaftarApi data={data} activeTab={activeTab} /> : renderNoResult}
    </Fragment>
  )
}

export default Api
