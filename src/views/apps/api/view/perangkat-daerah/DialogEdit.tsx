import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import axios from 'axios'
import CustomTextField from 'src/@core/components/mui/text-field'

const DialogEditPerangkatDaerah = ({ open, handleClose, dataPerangkat, showAlert, updateTableData }) => {
  const [formData, setFormData] = useState({
    nama: dataPerangkat ? dataPerangkat.nama : '',
    url: dataPerangkat ? dataPerangkat.url : ''
  })

  const [formErrors, setFormErrors] = useState({
    nama: '',
    url: ''
  })

  useEffect(() => {
    // Initialize formData with dataPerangkat when it changes
    setFormData({
      nama: dataPerangkat ? dataPerangkat.nama : '',
      url: dataPerangkat ? dataPerangkat.url : ''
    })
  }, [dataPerangkat])

  const handleChange = event => {
    const { name, value } = event.target

    // Handle special case for URL input
    let updatedValue = value
    if (name === 'url') {
      // Remove "https://" if user manually deletes it
      updatedValue = value.replace(/^https?:\/\//i, '')

      // Remove "/" from the end of URL
      updatedValue = updatedValue.replace(/\/$/, '')

      // Add "https://" to the beginning if not already present
      if (updatedValue && !/^https?:\/\//i.test(updatedValue)) {
        updatedValue = 'https://' + updatedValue
      }
    }

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: updatedValue || '' // Ensure that URL is always set, even if empty
    }))

    // Reset error message when user types
    setFormErrors({
      ...formErrors,
      [name]: ''
    })
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`http://newdashboard.bil/api/perangkat-daerah/${dataPerangkat.id}`, formData, {
        headers: {
          key: '1234567890'
        }
      })

      updateTableData()
      handleClose()

      setFormData({
        nama: '',
        url: ''
      })

      showAlert('Data berhasil diubah', 'success')
    } catch (error) {
      console.error('Error updating data:', error)
      showAlert('Gagal mengirim permintaan ke server', 'error')
    }
  }

  const handleCloseDialog = () => {
    // Reset the form data
    setFormData({
      nama: dataPerangkat ? dataPerangkat.nama : '',
      url: dataPerangkat ? dataPerangkat.url : ''
    })

    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Perangkat Daerah</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label='Nama Perangkat Daerah'
              placeholder='Dinas ...'
              name='nama'
              value={formData.nama}
              onChange={handleChange}
              error={Boolean(formErrors.nama)}
              helperText={formErrors.nama}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label='URL'
              placeholder='www.google.com'
              name='url'
              value={formData.url}
              onChange={handleChange}
              error={Boolean(formErrors.url)}
              helperText={formErrors.url}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Batal</Button>
        <Button onClick={handleSubmit} color='primary'>
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogEditPerangkatDaerah
