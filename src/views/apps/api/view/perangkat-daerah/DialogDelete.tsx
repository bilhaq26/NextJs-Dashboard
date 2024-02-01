import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import axios from 'axios'

const DialogDeletePerangkatDaerah = ({
  open,
  handleClose,
  dataPerangkat, // Ganti dengan dataPerangkat
  updateTableData,
  showAlert
}) => {
  const handleDeleteClick = async () => {
    try {
      if (dataPerangkat && dataPerangkat.id) {
        const response = await axios.delete(`http://newdashboard.bil/api/perangkat-daerah/${dataPerangkat.id}`, {
          headers: {
            key: '1234567890'
          }
        })

        // Lakukan pembaruan data atau tindakan lain setelah penghapusan berhasil
        updateTableData()

        handleClose()
        showAlert('Data' + dataPerangkat.nama + ' berhasil dihapus', false)
      } else {
        showAlert('Data' + dataPerangkat.nama + 'gagal dihapus', false)
      }
    } catch (error) {
      console.error('Error deleting data:', error)
      showAlert('Data gagal dihapus', false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title' fullWidth>
      <DialogTitle id='form-dialog-title'>Hapus Perangkat Daerah</DialogTitle>
      <DialogContent>
        <DialogContentText>Apakah Anda yakin ingin menghapus perangkat daerah ini?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Batal</Button>
        <Button onClick={handleDeleteClick} color='error'>
          Hapus
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DialogDeletePerangkatDaerah
