import { Fragment, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import axios from 'axios'
import DaftarApi from 'src/views/apps/api/list/DaftarApi'
import DialogTambahDaftarApi from 'src/views/apps/api/list/TambahDaftarApi'

const Api = () => {
  const [data, setData] = useState([])
  const [activeTab, setActiveTab] = useState('payment')
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('')
  const [jenisApiOptions, setJenisApiOptions] = useState([])
  const [filterJenisApi, setFilterJenisApi] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

          const uniqueJenisApiOptions = Array.from(new Set(response.data.data.map(item => item.jenis_api)))
          setJenisApiOptions(uniqueJenisApiOptions)
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

  const handleFilterJenisApi = selectedFilter => {
    setFilterJenisApi(selectedFilter)
  }

  const filteredData = data.filter(
    item =>
      item.perangkat_daerah.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterJenisApi === '' || item.jenis_api === filterJenisApi)
  )

  const openDialog = () => {
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
  }

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
            label='Filter Jenis API'
            size='medium'
            value={filterJenisApi}
            onChange={event => handleFilterJenisApi(event.target.value)}
            sx={{ ml: 2, width: '150px' }}
          >
            <MenuItem value=''>All</MenuItem>
            {jenisApiOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Button variant='contained' color='primary' onClick={openDialog}>
          Tambah Daftar Dinas
        </Button>
      </Box>
      {filteredData.length > 0 ? (
        <DaftarApi data={filteredData} activeTab={activeTab} searchTerm={searchTerm} />
      ) : (
        renderNoResult
      )}

      <DialogTambahDaftarApi open={isDialogOpen} onClose={closeDialog} fetchData={undefined} />
    </Fragment>
  )
}

export default Api