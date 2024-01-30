import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useDispatch } from 'react-redux'
import axios from 'axios'

const DialogHapusJenisApi = ({ open, handleClose, jenisApiId, updateTableData, showAlert }) => {
  const dispatch = useDispatch()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleHapus = async () => {
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://newdashboard.bil/api/jenis-api/${jenisApiId}`, {
          headers: {
            key: '1234567890'
          }
        })

        // Lakukan pembaruan data atau tindakan lain setelah penghapusan berhasil
        updateTableData()

        handleClose()

        showAlert('Data berhasil dihapus')
      } catch (error) {
        console.error('Error deleting jenis API:', error)

        // Tambahkan penanganan kesalahan atau tindakan lain jika diperlukan
      }
    } else {
      // Jika tidak dikonfirmasi, atur state konfirmasi menjadi true
      setConfirmDelete(true)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Hapus Jenis API</DialogTitle>
      <DialogContent>
        {confirmDelete ? (
          <DialogContentText>Apakah Anda yakin ingin menghapus jenis API ini?</DialogContentText>
        ) : (
          <DialogContentText>Klik "Hapus" lagi untuk mengonfirmasi penghapusan.</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Batal</Button>
        <Button onClick={handleHapus} autoFocus>
          {confirmDelete ? 'Hapus' : 'Konfirmasi Hapus'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogHapusJenisApi
