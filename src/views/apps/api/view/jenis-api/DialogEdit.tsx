import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import axios from 'axios'

const DialogEditJenisApi = ({ isDialogEditOpen, handleCloseDialogEdit, jenisApiIdToEdit, updateTableData, data }) => {
  const [editedData, setEditedData] = useState({
    nama: data ? data.nama : ''
  })

  const handleChange = e => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value
    })
  }

  const handleEditSubmit = async () => {
    try {
      const response = await axios.post('http://newdashboard.bil/api/jenis-api/' + jenisApiIdToEdit, editedData, {
        headers: {
          key: '1234567890' // Add your API key here
        }
      })

      updateTableData()
      handleCloseDialogEdit()

      // Reset the form
      setEditedData({
        nama: ''
      })
    } catch (error) {
      console.error('Error updating data:', error)
    }
  }

  return (
    <Dialog open={isDialogEditOpen} onClose={handleCloseDialogEdit} aria-labelledby='form-dialog-title' fullWidth>
      <DialogTitle id='form-dialog-title'>Edit Jenis API</DialogTitle>
      <DialogContent>
        <DialogContentText>Silakan ubah data jenis API yang ingin diubah.</DialogContentText>
        <TextField
          autoFocus
          margin='dense'
          name='nama'
          label='Nama'
          fullWidth
          value={editedData.nama}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialogEdit} color='primary'>
          Batal
        </Button>
        <Button onClick={handleEditSubmit} color='primary'>
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogEditJenisApi
