import { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import axios from 'axios'

const DialogEditDaftarApi = ({ open, onClose, itemId, onEditSuccess, showAlert, itemData }) => {
  const [editedData, setEditedData] = useState({
    id_jenis_api: '',
    id_perangkat_daerah: '',
    endpoint: '',
    api_key: ''
  })

  const [jenisApiOptions, setJenisApiOptions] = useState([])
  const [perangkatDaerahOptions, setPerangkatDaerahOptions] = useState([])

  useEffect(() => {
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

  useEffect(() => {
    setEditedData({
      id_jenis_api: itemData?.id_jenis_api || '',
      id_perangkat_daerah: itemData?.id_perangkat_daerah || '',
      endpoint: itemData?.endpoint || '',
      api_key: itemData?.api_key || ''
    })
  }, [itemData])

  const handleInputChange = (field, value) => {
    if (field === 'endpoint') {
      value = value.trim()
      if (value !== '' && !value.startsWith('/api/')) {
        value = '/api/' + value
      }
    }

    setEditedData(prevData => ({
      ...prevData,
      [field]: value
    }))
  }

  const handleEditData = async () => {
    try {
      const response = await axios.post(`http://newdashboard.bil/api/daftar-api/${itemId}`, editedData, {
        headers: {
          key: '1234567890'
        }
      })

      if (response.status === 201) {
        showAlert('Data berhasil diubah!')

        // Call the onEditSuccess prop to notify DaftarApi about the successful edit
        if (onEditSuccess) {
          onEditSuccess()
        }
      } else {
        console.error('Gagal mengubah data. Status:', response.status)
      }
      closeDialogAndReset()
    } catch (error) {
      console.error('Error dalam melakukan HTTP PUT:', error)
    }
  }

  const closeDialogAndReset = () => {
    onClose()
    setEditedData({
      id_jenis_api: '',
      id_perangkat_daerah: '',
      endpoint: '',
      api_key: ''
    })
  }

  return (
    <Dialog open={open} onClose={closeDialogAndReset}>
      <DialogTitle>Edit Daftar Dinas</DialogTitle>
      <DialogContent>
        <TextField
          select
          label='Jenis API'
          value={editedData.id_jenis_api}
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
          value={editedData.id_perangkat_daerah}
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
          value={editedData.endpoint}
          onChange={e => handleInputChange('endpoint', e.target.value)}
          fullWidth
          margin='normal'
        />
        <TextField
          label='Api Key'
          value={editedData.api_key}
          onChange={e => handleInputChange('api_key', e.target.value)}
          fullWidth
          margin='normal'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialogAndReset}>Batal</Button>
        <Button onClick={handleEditData} color='primary'>
          Simpan Perubahan
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogEditDaftarApi
