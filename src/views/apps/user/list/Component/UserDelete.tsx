import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import axios from 'axios'

const UserDelete = ({ user, open, onClose, onUserDeleted }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      // Mengirim permintaan penghapusan ke API
      await axios.delete(`http://newdashboard.bil/api/users/${user.id}`, {
        headers: {
          key: '123456789' // Gantilah dengan kunci API yang sesuai
        }
      })

      // Jika penghapusan berhasil, Anda dapat memberi tahu komponen induk
      onUserDeleted(user.id)

      // refresh data tanpa reload
      
    } catch (error) {
      console.error('Error deleting user:', error)
    } finally {
      setIsDeleting(false)
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Hapus Pengguna</DialogTitle>
      <DialogContent>
        <p>Anda yakin ingin menghapus pengguna {user.name}?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          Batal
        </Button>
        <Button onClick={handleDelete} color='error' disabled={isDeleting}>
          Hapus
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserDelete
