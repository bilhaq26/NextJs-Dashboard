import { Grid, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import axios from 'axios'
import { useState } from 'react'
import CustomTextField from 'src/@core/components/mui/text-field'

const DialogTambahPerangkatDaerah = ({ open, handleClose, dataPerangkat, showAlert, updateTableData }) => {
  const [formData, setFormData] = useState({
    nama: '',
    url: '',
    jenis: ''
  })

  const [formErrors, setFormErrors] = useState({
    nama: '',
    url: '',
    jenis: ''
  })

  const initialFormData = {
    nama: '',
    url: '',
    jenis: ''
  }

  const handleReset = () => {
    setFormData(initialFormData)
    setFormErrors({
      nama: '',
      url: '',
      jenis: ''
    })
  }

  const handleChange = event => {
    let value = event.target.value

    // Jika input adalah untuk URL dan pengguna memulai input tanpa "http://" atau "https://", tambahkan "https://"
    if (event.target.name === 'url') {
      // Hilangkan "https://" jika pengguna menghapus manual
      value = value.replace(/^https?:\/\//i, '')

      // Hilangkan "/" dari akhir URL
      value = value.replace(/\/$/, '')

      // Tambahkan "https://" ke awal jika tidak sudah ada
      if (value && !/^https?:\/\//i.test(value)) {
        value = 'https://' + value
      }
    }

    setFormData({
      ...formData,
      [event.target.name]: value
    })

    // Reset error message when user types
    setFormErrors({
      ...formErrors,
      [event.target.name]: '' // Reset error message when user types
    })
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://newdashboard.bil/api/perangkat-daerah/', formData, {
        headers: {
          key: '1234567890'
        }
      })

      updateTableData()
      handleClose()
      showAlert('Data berhasil disimpan!', true) // true menandakan sukses
      // Reset form setelah berhasil disimpan
      handleReset()
    } catch (error) {
      if (error.response) {
        const apiErrors = error.response.data.errors

        // Handle specific API validation messages
        setFormErrors({
          nama: apiErrors?.nama ? apiErrors.nama.join(', ') : '',
          url: apiErrors?.url ? apiErrors.url.join(', ') : ''
        })

        // Menampilkan pesan error dari API
        showAlert(
          'Terdapat kesalahan dalam pengisian formulir. ' +
            (apiErrors ? Object.values(apiErrors).flat().join(', ') : ''),
          false
        ) // false menandakan error
      } else {
        console.error('Gagal menambahkan data:', error)
        showAlert('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.', false) // false menandakan error
      }
    }
  }

  const handleCloseDialog = () => {
    handleClose()

    // Reset form saat dialog ditutup
    handleReset()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Tambah Perangkat Daerah</DialogTitle>
      <DialogContent>
        <Grid container spacing={6}>
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
            <Typography variant='caption' color='error'>
              {formErrors.nama}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              type='text'
              label='Url'
              placeholder='www.google.com'
              name='url'
              value={formData.url}
              onChange={handleChange}
              error={Boolean(formErrors.url)}
              helperText={formErrors.url}
            />
            <Typography variant='caption' color='error'>
              {formErrors.url}
            </Typography>
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

export default DialogTambahPerangkatDaerah
