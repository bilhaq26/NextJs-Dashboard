// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Box from '@mui/material/Box'
import CustomChip from 'src/@core/components/mui/chip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
import CustomTextField from 'src/@core/components/mui/text-field'
import { DialogActions, InputAdornment, MenuItem, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import UserDelete from './Component/UserDelete'
import React from 'react'

const TableUser = React.forwardRef(({ onDataChange }, ref) => {
  const [item, setItem] = useState([])
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [successAlert, setSuccessAlert] = useState(false)
  const [deleteDialogOpen, setdeleteDialogOpen] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState({
    id: '',
    name: '',
    username: '',
    email: '',
    phone: '',
    roles: '',
    status: '',
    password: '',
    confirmPassword: '',
    address: '',
    photo: ''
  })
  const [formErrors, setFormErrors] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    roles: '',
    status: '',
    password: '',
    confirmPassword: '',
    address: '',
    photo: ''
  })

  const [previewImage, setPreviewImage] = useState(null)

  useEffect(() => {
    // Fetch data from the API using Axios
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://newdashboard.bil/api/users/', {
          headers: {
            key: '123456789' // Add your API key here
          }
        })
        setItem(response.data.data)

        onDataChange(response.data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchUserData()
  }, [onDataChange])

  const handleEditClick = user => {
    setSelectedUser(user)
    setPreviewImage(user.photo)
    setOpenEditDialog(true)
  }

  const handleEditInputChange = e => {
    const { name, value, files } = e.target

    if (name === 'photo') {
      const file = files[0]
      setSelectedUser(prevUser => ({
        ...prevUser,
        [name]: file
      }))

      // Update preview foto saat memilih foto baru
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          // Set preview gambar di sini
          setPreviewImage(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        // Kosongkan preview gambar jika tidak ada file yang dipilih
        setPreviewImage(null)
      }
    } else {
      setSelectedUser(prevUser => ({
        ...prevUser,
        [name]: value
      }))
    }
  }

  const handleEditSave = async () => {
    try {
      // Reset form errors
      setFormErrors({
        name: '',
        username: '',
        email: '',
        phone: '',
        roles: '',
        status: '',
        password: '',
        confirmPassword: '',
        address: '',
        photo: ''
      })

      // Validate required fields (if needed)

      // Make an API call to edit the user
      const formData = new FormData()

      for (const key in selectedUser) {
        if (selectedUser[key] !== null) {
          formData.append(key, selectedUser[key])
        }
      }

      const response = await axios.post(`http://newdashboard.bil/api/users/${selectedUser.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          key: '123456789'
        }
      })

      if (response.data.status === 'error') {
        console.error('Error editing user:', response.data.message)

        Object.keys(response.data.message).forEach(field => {
          if (field !== 'password' && field !== 'confirmPassword') {
            setFormErrors(prevErrors => ({
              ...prevErrors,
              [field]: response.data.message[field][0]
            }))
          }
        })

        if (response.data.message.password) {
          setFormErrors(prevErrors => ({
            ...prevErrors,
            password: response.data.message.password[0]
          }))
        }
        if (response.data.message.confirmPassword) {
          setFormErrors(prevErrors => ({
            ...prevErrors,
            confirmPassword: response.data.message.confirmPassword[0]
          }))
        }

        return
      }

      // Check if the API response contains an error
      if (response.data.status === 'error') {
        console.error('Error editing user:', response.data.message)

        // Set specific field errors based on API response
        Object.keys(response.data.message).forEach(field => {
          setFormErrors(prevErrors => ({
            ...prevErrors,
            [field]: response.data.message[field][0]
          }))
        })

        return
      }

      // setelah data diupdate refresh data
      const responseRefresh = await axios.get('http://newdashboard.bil/api/users/', {
        headers: {
          key: '123456789' // Add your API key here
        }
      })

      setItem(responseRefresh.data.data)

      // Close the dialog
      handleCloseEditDialog()

      // Show success alert
      setSuccessAlert(true)

      // Hide success alert after a certain time (e.g., 3 seconds)
      setTimeout(() => {
        setSuccessAlert(false)
      }, 3000)
    } catch (error) {
      console.error('Error editing user:', error.message)
    }
  }

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
    setSelectedUser({
      id: '',
      name: '',
      username: '',
      email: '',
      phone: '',
      roles: '',
      status: '',
      password: '',
      confirmPassword: '',
      address: '',
      photo: ''
    })

    // Reset form errors when the dialog is closed
    setFormErrors({
      name: '',
      username: '',
      email: '',
      phone: '',
      roles: '',
      status: '',
      password: '',
      confirmPassword: '',
      address: '',
      photo: ''
    })
    setPreviewImage(null)
  }

  const handleDeleteClick = user => {
    setSelectedUser(user)
    setdeleteDialogOpen(true)
  }

  const handleUserDeleted = async deletedUserId => {
    try {
      // Menghapus pengguna dari server telah berhasil
      // Selanjutnya, perbarui state untuk menghilangkan pengguna yang dihapus
      setItem(prevItems => prevItems.filter(item => item.id !== deletedUserId))

      // Tampilkan alert atau lakukan tindakan lain yang sesuai
      setSuccessAlert(true)

      // Hide success alert after a certain time (e.g., 3 seconds)
      setTimeout(() => {
        setSuccessAlert(false)
      }, 3000)
    } catch (error) {
      console.error('Error handling user deletion:', error)

      // Handle error jika diperlukan
    } finally {
      setdeleteDialogOpen(false)
    }
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Nama</TableCell>
            <TableCell align='right'>Role</TableCell>
            <TableCell align='right'>Status</TableCell>
            <TableCell align='right'>Opsi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {item
            .filter(row => row.id !== 1) // Exclude data with id 1
            .map((row: any) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component='th' scope='row'>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar src={row.photo} sx={{ mr: 2.5, width: 38, height: 38 }} />
                    {row.name}
                  </Box>
                </TableCell>
                <TableCell align='right'>
                  <CustomChip
                    rounded
                    skin='light'
                    size='small'
                    label={row.role}
                    color={row.role === 'admin' ? 'secondary' : 'info'}
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell align='right'>
                  <CustomChip
                    rounded
                    skin='light'
                    size='small'
                    label={row.status}
                    color={row.status === 'active' ? 'success' : 'error'}
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
                <TableCell align='right'>
                  <Button variant='contained' onClick={() => handleEditClick(row)}>
                    <Icon icon='tabler:edit' />
                  </Button>
                  &nbsp;
                  <Button variant='contained' color='error' onClick={() => handleDeleteClick(row)}>
                    <Icon icon='tabler:trash' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Pengguna</DialogTitle>
        <DialogContent>
          {/* Menampilkan formulir edit dengan nilai yang sudah ada */}
          <Grid container spacing={3}>
            <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant='h6' align='center'>
                Photo Profile
              </Typography>
              {/* Menampilkan preview foto sebelumnya */}
              {previewImage && (
                <img
                  src={previewImage}
                  alt='Previous Photo'
                  style={{
                    width: 'auto',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    margin: 'auto'
                  }}
                />
              )}

              {/* Formulir untuk mengunggah foto baru */}
              <TextField
                fullWidth
                label='Photo'
                placeholder='Upload Photo'
                type='file'
                name='photo'
                onChange={handleEditInputChange}
                inputProps={{
                  accept: 'image/*' // This allows only image files
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={() => fileInputRef.current.click()}
                        onMouseDown={e => e.preventDefault()}
                        aria-label='toggle password visibility'
                      >
                        <Icon fontSize='1.25rem' icon='ph:upload-fill' />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='Nama'
                placeholder='Masukan Nama'
                name='name'
                value={selectedUser.name}
                onChange={handleEditInputChange}
                error={!!formErrors.name}
              />
              <Typography variant='caption' color='error'>
                {formErrors.name}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='Username'
                placeholder='Username'
                name='username'
                value={selectedUser.username}
                onChange={handleEditInputChange}
                error={!!formErrors.username}
              />
              <Typography variant='caption' color='error'>
                {formErrors.username}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='Email'
                placeholder='Email'
                name='email'
                value={selectedUser.email}
                onChange={handleEditInputChange}
                error={!!formErrors.email}
              />
              <Typography variant='caption' color='error'>
                {formErrors.email}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='Phone'
                placeholder='Phone'
                name='phone'
                value={selectedUser.phone}
                onChange={handleEditInputChange}
                error={!!formErrors.phone}
              />
              <Typography variant='caption' color='error'>
                {formErrors.phone}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='Password Baru'
                type='password'
                placeholder='Password Baru'
                name='password'
                value={selectedUser.password}
                onChange={handleEditInputChange}
                error={!!formErrors.password}
              />
              <Typography variant='caption' color='error'>
                {formErrors.password}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='Konfirmasi Password Baru'
                type='password'
                placeholder='Konfirmasi Password Baru'
                name='confirmPassword'
                value={selectedUser.confirmPassword}
                onChange={handleEditInputChange}
                error={!!formErrors.confirmPassword}
              />
              <Typography variant='caption' color='error'>
                {formErrors.confirmPassword}
              </Typography>
            </Grid>
            {/* make menuItem role */}
            <Grid item xs={6}>
              <CustomTextField
                select
                fullWidth
                label='Pilih Roles'
                id='form-layouts-separator-select'
                defaultValue=''
                name='roles'
                value={selectedUser.roles || ''} // Memastikan bahwa nilai tidak undefined atau null
                onChange={handleEditInputChange}
                error={!!formErrors.roles}
              >
                <MenuItem value=''>Pilih Roles</MenuItem>
                <MenuItem value='admin'>Admin</MenuItem>
                <MenuItem value='user'>User</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                select
                fullWidth
                label='Pilih status'
                id='form-layouts-separator-select'
                defaultValue=''
                name='status'
                value={selectedUser.status || ''} // Memastikan bahwa nilai tidak undefined atau null
                onChange={handleEditInputChange}
                error={!!formErrors.status}
              >
                <MenuItem value=''>Pilih status</MenuItem>
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>In-Active</MenuItem>
              </CustomTextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Batal</Button>
          <Button onClick={handleEditSave} color='primary'>
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      <UserDelete
        user={selectedUser}
        open={deleteDialogOpen}
        onClose={() => setdeleteDialogOpen(false)}
        onUserDeleted={handleUserDeleted}
      />

      {successAlert && (
        <Alert variant='filled' severity='success' sx={{ position: 'fixed', bottom: 16, right: 16 }}>
          Data berhasil disimpan!
        </Alert>
      )}
    </TableContainer>
  )
})

export default TableUser
