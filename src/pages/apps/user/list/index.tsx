// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

import axios from 'axios'

// ** Demo Components Imports
import TableUser from 'src/views/apps/user/list/TableUser'
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import React, { useRef } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CustomTextField from 'src/@core/components/mui/text-field'
import { InputAdornment, MenuItem, TextField } from '@mui/material'
import Alert from '@mui/material/Alert'

const User = () => {
  const [openAddDialog, setOpenAddDialog] = React.useState(false)
  const [newUserData, setNewUserData] = React.useState({
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
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [imagePreview, setImagePreview] = React.useState(null)
  const fileInputRef = useRef(null)
  const [successAlert, setSuccessAlert] = React.useState(false)
  const tableUserRef = useRef<any>(null)
  const [formErrors, setFormErrors] = React.useState({
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

  const handleAddClick = () => {
    setOpenAddDialog(true)
  }

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false)

    // Reset the form fields when the dialog is closed
    setNewUserData({
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
    setImagePreview(null)
  }

  const handleAddSave = async () => {
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

      // Validate required fields
      const requiredFields = ['name', 'username', 'email', 'phone', 'roles', 'status', 'password', 'confirmPassword']
      for (const field of requiredFields) {
        if (!newUserData[field]) {
          setFormErrors(prevErrors => ({
            ...prevErrors,
            [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} harus diisi`
          }))

          return
        }
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(newUserData.email)) {
        setFormErrors(prevErrors => ({ ...prevErrors, email: 'Format email tidak valid' }))

        return
      }

      // Validate minimum password length
      if (newUserData.password.length < 6) {
        setFormErrors(prevErrors => ({ ...prevErrors, password: 'Password harus memiliki setidaknya 6 karakter' }))

        return
      }

      // Check if passwords match
      if (newUserData.password !== newUserData.confirmPassword) {
        setFormErrors(prevErrors => ({
          ...prevErrors,
          confirmPassword: 'Password dan Konfirmasi Password tidak cocok'
        }))

        return
      }

      // Make an API call to add a new user
      const formData = new FormData()

      for (const key in newUserData) {
        if (newUserData[key] !== null) {
          formData.append(key, newUserData[key])
        }
      }

      const response = await axios.post('http://newdashboard.bil/api/users/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          key: '123456789'
        }
      })

      if (response.status === 429) {
        // Menunggu beberapa saat sebelum mencoba lagi
        setTimeout(() => {
          handleAddSave()
        }, 5000) // Contoh: Menunggu 5 detik sebelum mencoba lagi
      }

      // Check if the API response contains an error
      if (response.data.status === 'error') {
        console.error('Error adding user:', response.data.message)

        // Set specific field errors based on API response
        Object.keys(response.data.message).forEach(field => {
          setFormErrors(prevErrors => ({
            ...prevErrors,
            [field]: response.data.message[field][0]
          }))
        })

        return
      }

      // Optionally, you can update the table or perform any other actions here

      // Close the add dialog
      handleCloseAddDialog()

      // Show success alert
      setSuccessAlert(true)

      // Hide success alert after a certain time (e.g., 3 seconds)
      setTimeout(() => {
        setSuccessAlert(false)
      }, 3000)

      if (tableUserRef.current) {
        tableUserRef.current?.refreshTable()
      }
    } catch (error) {
      console.error('Error adding user:', error.message)
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target

    if (name === 'photo') {
      // Handle image preview
      const file = e.target.files[0]
      setNewUserData(prevData => ({ ...prevData, [name]: file }))
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        setImagePreview(null)
      }
    } else {
      setNewUserData(prevData => ({ ...prevData, [name]: value }))
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography sx={{ color: 'text.secondary' }}>
            <Button variant='contained' onClick={handleAddClick}>
              <Icon icon='ph:plus-fill' /> Tambah Pengguna
            </Button>
          </Typography>
        }
      />
      <Grid item xs={12}>
        <Card>
          <TableUser ref={tableUserRef} onDataChange={data => data} />
        </Card>
      </Grid>
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Tambah Pengguna</DialogTitle>
        <DialogContent>
          <Grid container spacing={5}>
            <Grid item xs={12} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant='h6' align='center'>
                Photo Profile
              </Typography>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt='Preview'
                  style={{
                    width: 'auto',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    margin: 'auto'
                  }}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              {/* buat customtextfield upload file dalam bentuk button */}
              <TextField
                fullWidth
                label='Photo'
                placeholder='Upload Photo'
                name='photo'
                type='file'
                inputRef={fileInputRef}
                onChange={handleInputChange}
                error={!!formErrors.photo}
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
                value={newUserData.name}
                onChange={handleInputChange}
                error={!!formErrors.name}
              />
              {/* buat pesan error */}
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
                value={newUserData.username}
                onChange={handleInputChange}
                error={!!formErrors.username}
              />
              <Typography variant='caption' color='error'>
                {formErrors.username}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                type='email'
                label='Email'
                placeholder='carterleonard@gmail.com'
                helperText='You can use letters, numbers & periods'
                name='email'
                value={newUserData.email}
                onChange={handleInputChange}
                error={!!formErrors.email}
              />
              <Typography variant='caption' color='error'>
                {formErrors.email}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='Password'
                placeholder='********'
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={newUserData.password}
                onChange={handleInputChange}
                error={!!formErrors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={e => e.preventDefault()}
                        aria-label='toggle password visibility'
                      >
                        <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Typography variant='caption' color='error'>
                {formErrors.password}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <CustomTextField
                fullWidth
                label='Confirm Password'
                placeholder='********'
                type={showConfirmPassword ? 'text' : 'password'}
                name='confirmPassword'
                value={newUserData.confirmPassword}
                onChange={handleInputChange}
                error={!!formErrors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={e => e.preventDefault()}
                        aria-label='toggle password visibility'
                      >
                        <Icon fontSize='1.25rem' icon={showConfirmPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Typography variant='caption' color='error'>
                {formErrors.confirmPassword}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Address'
                placeholder='123 Main Street'
                name='address'
                value={newUserData.address}
                onChange={handleInputChange}
                error={!!formErrors.address}
              />
              <Typography variant='caption' color='error'>
                {formErrors.address}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Phone'
                placeholder='123-456-7890'
                name='phone'
                value={newUserData.phone}
                onChange={handleInputChange}
                error={!!formErrors.phone}
              />
              <Typography variant='caption' color='error'>
                {formErrors.phone}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Pilih Roles'
                id='form-layouts-separator-select'
                defaultValue=''
                name='roles'
                value={newUserData.roles}
                onChange={handleInputChange}
                error={!!formErrors.roles}
              >
                <MenuItem value=''>Pilih Roles</MenuItem>
                <MenuItem value='admin'>Admin</MenuItem>
                <MenuItem value='user'>User</MenuItem>
              </CustomTextField>
              <Typography variant='caption' color='error'>
                {formErrors.roles}
              </Typography>
            </Grid>
            <Grid item xs={12} xs={6}>
              <CustomTextField
                select
                fullWidth
                label='Pilih Status'
                id='form-layouts-separator-select'
                defaultValue=''
                name='status'
                value={newUserData.status}
                onChange={handleInputChange}
                error={!!formErrors.status}
              >
                <MenuItem value=''>Select Status</MenuItem>
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>Inactive</MenuItem>
              </CustomTextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Batal</Button>
          <Button onClick={handleAddSave} color='primary'>
            Simpan
          </Button>
        </DialogActions>
      </Dialog>{' '}
      {/* Render the AlertsFilled component */}
      {successAlert && (
        <Alert variant='filled' severity='success' sx={{ position: 'fixed', bottom: 16, right: 16 }}>
          Data berhasil disimpan!
        </Alert>
      )}
    </Grid>
  )
}

export default User
