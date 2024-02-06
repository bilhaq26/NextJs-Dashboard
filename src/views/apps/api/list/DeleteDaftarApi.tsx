import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import axios from 'axios'

const DialogDeleteDaftarApi = ({ open, onClose, itemId, fetchData, showAlert }) => {
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://newdashboard.bil/api/daftar-api/${itemId}`, {
        headers: {
          key: '1234567890'
        }
      })

      // Lakukan pembaruan data atau tindakan lain setelah penghapusan berhasil
      fetchData()

      onClose()

      showAlert('Data berhasil dihapus')
    } catch (error) {
      console.error('Error deleting daftar API:', error)

      // Tambahkan penanganan kesalahan atau tindakan lain jika diperlukan
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Hapus Daftar Dinas</DialogTitle>
      <DialogContent>
        <DialogContentText>Apakah Anda yakin ingin menghapus daftar dinas ini?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button onClick={handleDelete} color='error'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogDeleteDaftarApi
