import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem' // Import MenuItem from MUI
import axios from 'axios'

const DialogTambahDaftarApi = ({ open, onClose, fetchData }) => {
  // State untuk menyimpan data yang akan ditambahkan
  const [newData, setNewData] = useState({
    id_jenis_api: '',
    id_perangkat_daerah: '',
    endpoint: ''
  })

  // State untuk menyimpan data dari API pertama
  const [jenisApiOptions, setJenisApiOptions] = useState([])

  // State untuk menyimpan data dari API kedua
  const [perangkatDaerahOptions, setPerangkatDaerahOptions] = useState([])

  useEffect(() => {
    // Fetch data dari API jenis-api
    const fetchJenisApi = async () => {
      try {
        const response = await axios.get('http://newdashboard.bil/api/jenis-api', {
          headers: {
            key: '1234567890'
          }
        })
        if (response.data && Array.isArray(response.data.data)) {
          setJenisApiOptions(response.data.data)
        } else {
          console.error('Invalid data format from jenis-api API. Expecting an array.')
        }
      } catch (error) {
        console.error('Error fetching data from jenis-api API:', error)
      }
    }

    // Fetch data dari API perangkat-daerah
    const fetchPerangkatDaerah = async () => {
      try {
        const response = await axios.get('http://newdashboard.bil/api/perangkat-daerah', {
          headers: {
            key: '1234567890'
          }
        })
        if (response.data && Array.isArray(response.data.data)) {
          setPerangkatDaerahOptions(response.data.data)
        } else {
          console.error('Invalid data format from perangkat-daerah API. Expecting an array.')
        }
      } catch (error) {
        console.error('Error fetching data from perangkat-daerah API:', error)
      }
    }

    fetchJenisApi()
    fetchPerangkatDaerah()
  }, [])

  // Fungsi untuk menangani perubahan input pada form
  const handleInputChange = (field, value) => {
    setNewData(prevData => ({
      ...prevData,
      [field]: value
    }))
  }

  // Fungsi untuk menangani penambahan data
  const handleTambahData = async () => {
    try {
      // Lakukan HTTP POST ke API
      const response = await axios.post('http://newdashboard.bil/api/daftar-api', newData, {
        headers: {
          key: '1234567890'
        }
      })

      // Tambahkan penanganan response sesuai kebutuhan
      console.log('Response dari API POST:', response.data)

      // Jika berhasil, tutup dialog dan perbarui data
      if (response.status === 201) {
        onClose()
        fetchData() // fungsi fetchData untuk memperbarui data setelah penambahan
      } else {
        console.error('Gagal menambahkan data. Status:', response.status)
      }
    } catch (error) {
      console.error('Error dalam melakukan HTTP POST:', error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Tambah Daftar Dinas</DialogTitle>
      <DialogContent>
        <TextField
          select
          label='Jenis API'
          value={newData.id_jenis_api}
          onChange={e => handleInputChange('id_jenis_api', e.target.value)}
          fullWidth
          margin='normal'
        >
          {jenisApiOptions.map(option => (
            <MenuItem key={option.id} value={option.id}>
              {option.nama}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label='Perangkat Daerah'
          value={newData.id_perangkat_daerah}
          onChange={e => handleInputChange('id_perangkat_daerah', e.target.value)}
          fullWidth
          margin='normal'
        >
          {perangkatDaerahOptions.map(option => (
            <MenuItem key={option.id} value={option.id}>
              {option.nama}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label='Endpoint'
          value={newData.endpoint}
          onChange={e => handleInputChange('endpoint', e.target.value)}
          fullWidth
          margin='normal'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button onClick={handleTambahData} color='primary'>
          Tambah
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogTambahDaftarApi
