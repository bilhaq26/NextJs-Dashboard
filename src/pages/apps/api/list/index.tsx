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
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import DialogDeleteDaftarApi from 'src/views/apps/api/list/DeleteDaftarApi'
import DialogEditDaftarApi from 'src/views/apps/api/list/EditDaftarApi'

const Api = () => {
  const [data, setData] = useState([])
  const [activeTab, setActiveTab] = useState('payment')
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('')
  const [jenisApiOptions, setJenisApiOptions] = useState([])
  const [filterJenisApi, setFilterJenisApi] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false)
  const [itemIdToDelete, setItemIdToDelete] = useState(null)
  const [isDialogEditOpen, setIsDialogEditOpen] = useState(false)
  const [itemIdToEdit, setItemIdToEdit] = useState(null)

  const showAlert = message => {
    setAlertMessage(message)
    setIsAlertOpen(true)
  }

  const handleCloseDialogHapus = () => {
    setIsDialogDeleteOpen(false)
    setItemIdToDelete(null)
  }

  const handleDeleteClick = id => {
    setItemIdToDelete(id)
    setIsDialogDeleteOpen(true)
  }

  const handleCloseDialogEdit = () => {
    setIsDialogEditOpen(false)
    setItemIdToEdit(null)
  }

  const handleEditClick = id => {
    setItemIdToEdit(id)
    setIsDialogEditOpen(true)
  }

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

  const updateTableData = async () => {
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
        <DaftarApi
          data={filteredData}
          activeTab={activeTab}
          searchTerm={searchTerm}
          updateTableData={updateTableData}
          handleDeleteClick={handleDeleteClick}
          handleEditClick={handleEditClick}
        />
      ) : (
        renderNoResult
      )}

      <DialogTambahDaftarApi
        open={isDialogOpen}
        onClose={closeDialog}
        fetchData={updateTableData}
        showAlert={message => {
          setAlertMessage(message)
          setIsAlertOpen(true)
        }}
      />

      <DialogDeleteDaftarApi
        open={isDialogDeleteOpen}
        onClose={handleCloseDialogHapus}
        itemId={itemIdToDelete}
        fetchData={updateTableData}
        showAlert={message => {
          setAlertMessage(message)
          setIsAlertOpen(true)
        }}
      />

      <DialogEditDaftarApi
        open={isDialogEditOpen}
        onClose={handleCloseDialogEdit}
        itemId={itemIdToEdit}
        onEditSuccess={updateTableData} // Pass updateTableData as onEditSuccess
        showAlert={message => {
          setAlertMessage(message)
          setIsAlertOpen(true)
        }}
        itemData={filteredData.find(item => item.id === itemIdToEdit)}
      />

      <Snackbar
        open={isAlertOpen}
        autoHideDuration={3000} // Sesuaikan dengan durasi yang diinginkan
        onClose={() => setIsAlertOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setIsAlertOpen(false)}
          severity='success'
          sx={{ mt: 2, position: 'fixed', bottom: 16, left: 16 }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Fragment>
  )
}

export default Api
