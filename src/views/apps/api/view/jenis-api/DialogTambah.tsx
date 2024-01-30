import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import { useState } from 'react'

const DialogTambahJenisApi = ({ open, handleClose, updateTableData, data, showAlert }: Props) => {
  const [jenisApi, setJenisApi] = useState({
    nama: '',
    deskripsi: ''
  })
  const [error, setError] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJenisApi({
      ...jenisApi,
      [event.target.name]: event.target.value
    })
    setError('') // Menghapus pesan kesalahan saat pengguna mengubah input
  }

  const handleSubmit = async () => {
    // Periksa apakah nama tidak kosong
    if (!jenisApi.nama.trim()) {
      setError('Nama tidak boleh kosong.')
    } else {
      // Periksa apakah jenis API dengan nama yang sama sudah ada
      const jenisApiExists = data && data.some(item => item.nama.toLowerCase() === jenisApi.nama.toLowerCase())

      if (jenisApiExists) {
        setError('Jenis API dengan nama tersebut sudah ada.')
      } else {
        try {
          const response = await axios.post('http://newdashboard.bil/api/jenis-api/', jenisApi, {
            headers: {
              key: '1234567890'
            }
          })

          updateTableData()

          handleClose()

          showAlert('Data berhasil disimpan!')
        } catch (error) {
          console.error('Gagal menambahkan data:', error)
        }
      }
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Tambah Jenis API</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          name='nama'
          label='Nama'
          fullWidth
          onChange={handleChange}
          error={error !== ''}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Batal
        </Button>
        <Button onClick={handleSubmit} color='primary'>
          Tambah
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogTambahJenisApi
