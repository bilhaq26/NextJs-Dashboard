import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import Snackbar from '@mui/material/Snackbar'
import axios from 'axios'
import { SetStateAction, useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import DaftarPerangkatDaerah from 'src/views/apps/api/view/perangkat-daerah/DaftarPerangkatDaerah'
import DialogTambahPerangkatDaerah from 'src/views/apps/api/view/perangkat-daerah/DialogTambah'
import { InputAdornment } from '@mui/material'
import DialogEditPerangkatDaerah from 'src/views/apps/api/view/perangkat-daerah/DialogEdit'
import DialogDeletePerangkatDaerah from 'src/views/apps/api/view/perangkat-daerah/DialogDelete'

const PerangkatDaerah = () => {
  const [dataPerangkat, setDataPerangkat] = useState([])
  const [dialogTambah, setDialogTambah] = useState(false)
  const [dialogEdit, setDialogEdit] = useState(false)
  const [iddialogEdit, setIddialogEdit] = useState(null)
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [AlertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')
  const [filter, setFilter] = useState('')

  const handleFilterChange = event => {
    setFilter(event.target.value)
  }

  const showAlert = (message, isSuccess) => {
    setAlertMessage(message)
    setAlertSeverity(isSuccess ? 'success' : 'error')
    setIsAlertOpen(true)
  }

  const handleDialogTambah = () => {
    setDialogTambah(true)
  }

  const handleCloseDialogTambah = () => {
    setDialogTambah(false)
  }

  const handleEditClick = id => {
    setDialogEdit(true)
    setIddialogEdit(id)
  }

  const handleDeleteClick = id => {
    setIddialogEdit(id) // Atau sesuaikan dengan id yang sesuai
    setDialogDeleteOpen(true)
  }

  const handleCloseDialogDelete = () => {
    setDialogDeleteOpen(false)
  }

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
      } catch (error) {
        console.error('Error fetching data from API:', error)
      }
    }
    fetchData()
  }, [])

  const updateTableData = async () => {
    try {
      const response = await axios.get('http://newdashboard.bil/api/perangkat-daerah', {
        headers: {
          key: '1234567890'
        }
      })
      setDataPerangkat(response.data.data)
    } catch (error) {
      console.error('Error fetching data from API:', error)
    }
  }

  return (
    <>
      <CardHeader
        title='Daftar Perangkat Dinas'
        action={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CustomTextField
              variant='outlined'
              size='small'
              value={filter}
              onChange={handleFilterChange}
              placeholder='Cari...'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Icon icon='lets-icons:search-alt-fill' />
                  </InputAdornment>
                )
              }}
            />
            <Button variant='contained' onClick={handleDialogTambah} color='primary' style={{ marginLeft: '8px' }}>
              <Icon icon='ph:plus-fill' /> Tambah Jenis Api
            </Button>
          </div>
        }
      />
      <Grid container spacing={6} className='match-height'>
        {(dataPerangkat || [])
          .filter(item => item.nama.toLowerCase().includes(filter.toLowerCase()))
          .map((item, index) => (
            <Grid key={index} item md={4} sm={6} xs={12}>
              <DaftarPerangkatDaerah
                item={item}
                handleEditClick={handleEditClick}
                handleDeleteClick={handleDeleteClick}
              />
            </Grid>
          ))}
      </Grid>

      <DialogTambahPerangkatDaerah
        open={dialogTambah}
        handleClose={handleCloseDialogTambah}
        dataPerangkat={dataPerangkat}
        showAlert={showAlert}
        updateTableData={updateTableData}
      />

      <DialogEditPerangkatDaerah
        open={dialogEdit}
        handleClose={() => setDialogEdit(false)}
        dataPerangkat={(dataPerangkat || []).find(item => item.id === iddialogEdit)} // Ambil data sesuai dengan id yang di-edit
        showAlert={showAlert}
        updateTableData={updateTableData}
      />

      <DialogDeletePerangkatDaerah
        open={dialogDeleteOpen}
        handleClose={handleCloseDialogDelete}
        dataPerangkat={(dataPerangkat || []).find(item => item.id === iddialogEdit)} // Ambil data sesuai dengan id yang di-delete
        showAlert={showAlert}
        updateTableData={updateTableData}
      />

      {isAlertOpen && (
        <Snackbar
          open={isAlertOpen}
          autoHideDuration={3000} // Sesuaikan dengan durasi yang diinginkan
          onClose={() => setIsAlertOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert severity={alertSeverity} onClose={() => setIsAlertOpen(false)}>
            {AlertMessage}
          </Alert>
        </Snackbar>
      )}
    </>
  )
}

export default PerangkatDaerah
