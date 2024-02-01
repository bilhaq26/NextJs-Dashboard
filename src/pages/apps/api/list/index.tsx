// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import CustomTextField from 'src/@core/components/mui/text-field'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import axios from 'axios'

// ** Demo Imports
import DaftarApi from 'src/views/apps/api/list/DaftarApi'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

const Api = () => {
  // ** States
  const [data, setData] = useState([])
  const [activeTab, setActiveTab] = useState<string>('payment')
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://newdashboard.bil/api/daftar-api', {
          headers: {
            key: '1234567890'
          }
        })

        if (response.data && Array.isArray(response.data.data)) {
          setData(response.data.data)
        } else {
          console.error('Invalid data format. Expecting an array.')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const handleFilterChange = value => {
    setSearchTerm(value)
  }

  const handleFilterSelect = selectedFilter => {
    setFilter(selectedFilter)
  }

  const filteredData = data.filter(item => item.perangkat_daerah.toLowerCase().includes(searchTerm.toLowerCase()))

  const renderNoResult = (
    <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', '& svg': { mr: 2 } }}>
      <Icon fontSize='1.5rem' icon='tabler:alert-circle' />
      <Typography variant='h5'>No Results Found!!</Typography>
    </Box>
  )

  return (
    <Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            size='medium'
            placeholder='Search a device...'
            value={searchTerm}
            onChange={event => handleFilterChange(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Icon fontSize='1.25rem' icon='tabler:search' />
                </InputAdornment>
              )
            }}
          />
          <TextField
            select
            label='Filter'
            size='medium'
            value={filter}
            onChange={event => handleFilterSelect(event.target.value)}
            sx={{ ml: 2, width: '150px' }}
          >
            <MenuItem value=''>All</MenuItem>
            <MenuItem value='filter1'>Filter 1</MenuItem>
            <MenuItem value='filter2'>Filter 2</MenuItem>
          </TextField>
        </Box>
        <Button variant='contained' color='primary'>
          Tambah Daftar Dinas
        </Button>
      </Box>
      {filteredData.length > 0 ? (
        <DaftarApi data={filteredData} activeTab={activeTab} searchTerm={searchTerm} />
      ) : (
        renderNoResult
      )}
    </Fragment>
  )
}

export default Api
