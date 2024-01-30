// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

// ** Demo Components Imports
import TableJenisApi from 'src/views/apps/api/view/jenis-api/TableJenisApi'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '@mui/material/Button'
import DialogTambahJenisApi from 'src/views/apps/api/view/jenis-api/DialogTambah'
import Icon from 'src/@core/components/icon'
import DialogHapusJenisApi from 'src/views/apps/api/view/jenis-api/DialogHapus'
import DialogEditJenisApi from 'src/views/apps/api/view/jenis-api/DialogEdit'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

const JenisApi = () => {
  const [data, setData] = useState([])
  const [isDialogTambahOpen, setIsDialogTambahOpen] = useState(false)
  const [isDialogEditOpen, setIsDialogEditOpen] = useState(false)
  const [jenisApiIdToEdit, setJenisApiIdToEdit] = useState(null)
  const [isDialogHapusOpen, setIsDialogHapusOpen] = useState(false)
  const [jenisApiIdToDelete, setJenisApiIdToDelete] = useState(null)
  const [alertMessage, setAlertMessage] = useState('')
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const showAlert = message => {
    setAlertMessage(message)
    setIsAlertOpen(true)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://newdashboard.bil/api/jenis-api', {
          headers: {
            key: '1234567890' // Add your API key here
          }
        })
        setData(response.data.data)

        console.log(response.data.data)
      } catch (error) {
        console.error('Error fetching data from API:', error)
      }
    }

    fetchData()
  }, [])

  const handleOpenDialog = () => {
    setIsDialogTambahOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogTambahOpen(false)
  }

  const handleEditClick = (id: any) => {
    setIsDialogEditOpen(true)
    setJenisApiIdToEdit(id)
  }

  const handleCloseDialogEdit = () => {
    setIsDialogEditOpen(false)
    setJenisApiIdToEdit(null)
  }

  const handleDeleteClick = async (id: any) => {
    // Buka dialog konfirmasi penghapusan
    setIsDialogHapusOpen(true)
    setJenisApiIdToDelete(id)
  }

  const handleCloseDialogHapus = () => {
    setIsDialogHapusOpen(false)
    setJenisApiIdToDelete(null)
  }

  const updateTableData = async () => {
    try {
      const response = await axios.get('http://newdashboard.bil/api/jenis-api', {
        headers: {
          key: '1234567890'
        }
      })
      setData(response.data.data)

      if (jenisApiIdToDelete) {
        await axios.delete(`http://newdashboard.bil/api/jenis-api/${jenisApiIdToDelete}`, {
          headers: {
            key: '1234567890'
          }
        })

        setJenisApiIdToDelete(null)
      }
    } catch (error) {
      console.error('Error updating table data:', error)
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Jenis Jenis API'
            action={
              <Button variant='contained' onClick={handleOpenDialog} color='primary'>
                <Icon icon='ph:plus-fill' /> Tambah Jenis Api
              </Button>
            }
          />

          <TableJenisApi data={data} handleDeleteClick={handleDeleteClick} handleEditClick={handleEditClick} />
        </Card>
      </Grid>
      <DialogTambahJenisApi
        open={isDialogTambahOpen}
        handleClose={handleCloseDialog}
        updateTableData={updateTableData}
        data={data}
        showAlert={showAlert}
      />

      <DialogHapusJenisApi
        open={isDialogHapusOpen}
        handleClose={handleCloseDialogHapus}
        jenisApiId={jenisApiIdToDelete}
        updateTableData={updateTableData}
        showAlert={message => {
          setAlertMessage(message)
          setIsAlertOpen(true)
        }}
      />

      <DialogEditJenisApi
        isDialogEditOpen={isDialogEditOpen}
        handleCloseDialogEdit={handleCloseDialogEdit}
        jenisApiIdToEdit={jenisApiIdToEdit}
        updateTableData={updateTableData}
        data={data}
        showAlert={message => {
          setAlertMessage(message)
          setIsAlertOpen(true)
        }}
      />

      <DialogTambahJenisApi
        open={isDialogTambahOpen}
        handleClose={handleCloseDialog}
        updateTableData={updateTableData}
        data={data}
        showAlert={message => {
          setAlertMessage(message)
          setIsAlertOpen(true)
        }}
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
    </Grid>
  )
}

export default JenisApi
