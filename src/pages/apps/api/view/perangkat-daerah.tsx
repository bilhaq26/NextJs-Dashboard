import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import Snackbar from '@mui/material/Snackbar'
import axios from 'axios'
import { ReactElement, Ref, forwardRef, useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import DialogTambahPerangkatDaerah from 'src/views/apps/api/view/perangkat-daerah/DialogTambah'
import {
  Box,
  Dialog,
  DialogContent,
  Fade,
  FadeProps,
  IconButton,
  IconButtonProps,
  InputAdornment,
  Typography,
  styled
} from '@mui/material'
import DialogEditPerangkatDaerah from 'src/views/apps/api/view/perangkat-daerah/DialogEdit'
import DialogDeletePerangkatDaerah from 'src/views/apps/api/view/perangkat-daerah/DialogDelete'
import { DataGrid, GridColDef, GridRowId, CellParams } from '@mui/x-data-grid'
import { InvoiceType } from 'src/types/apps/invoiceTypes'
import Link from 'next/link'
import Iframe from 'react-iframe'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})
interface CellType {
  row: InvoiceType
}

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  fontSize: theme.typography.body1.fontSize,
  color: `${theme.palette.primary.main} !important`
}))

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const PerangkatDaerah = () => {
  const [dataPerangkat, setDataPerangkat] = useState([])
  const [dialogTambah, setDialogTambah] = useState(false)
  const [dialogEdit, setDialogEdit] = useState(false)
  const [iddialogEdit, setIddialogEdit] = useState(null)
  const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [AlertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [showUrl, setShowUrl] = useState({ open: false, data: null })
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = event => {
    setSearchQuery(event.target.value)
  }

  const showAlert = (message, isSuccess) => {
    setAlertMessage(message)
    setAlertSeverity(isSuccess ? 'success' : 'error')
    setIsAlertOpen(true)
  }

  const handleDialogTambah = () => {
    setDialogTambah(true)
  }

  const handleCloseDialogTambah = () => {
    setDialogTambah(false)
  }

  const handleEditClick = id => {
    setDialogEdit(true)
    setIddialogEdit(id)
  }

  const handleDeleteClick = id => {
    setIddialogEdit(id) // Atau sesuaikan dengan id yang sesuai
    setDialogDeleteOpen(true)
  }

  const handleCloseDialogDelete = () => {
    setDialogDeleteOpen(false)
  }

  const handleShowUrl = id => {
    const selectedRow = dataPerangkat.find(row => row.id === id)
    setShowUrl({ open: true, data: selectedRow })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://newdashboard.bil/api/perangkat-daerah', {
          headers: {
            key: '1234567890'
          }
        })

        // response not array
        const filteredData = response.data.data.filter(item =>
          item.nama.toLowerCase().includes(searchQuery.toLowerCase())
        )

        setDataPerangkat(filteredData)
      } catch (error) {
        console.error('Error fetching data from API:', error)
      }
    }

    fetchData()
  }, [searchQuery])

  const updateTableData = async () => {
    try {
      const response = await axios.get('http://newdashboard.bil/api/perangkat-daerah', {
        headers: {
          key: '1234567890'
        }
      })
      setDataPerangkat(response.data.data)
    } catch (error) {
      console.error('Error fetching data from API:', error)
    }
  }

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 100,
      field: 'No',
      headerName: 'ID',
      renderCell: (params: CellParams) => {
        const rowNumber = dataPerangkat.indexOf(params.row) + 1

        return (
          <Typography component={LinkStyled} target='_blank' href={`${params.row.url}`}>
            {rowNumber}
          </Typography>
        )
      }
    },
    {
      flex: 0.25,
      field: 'nama',
      minWidth: 520,
      headerName: 'Nama Perangkat',
      renderCell: ({ row }: CellType) => (
        <Box>
          <Typography noWrap>{row.nama}</Typography>
        </Box>
      )
    },

    // tambahkan titik 3 untuk menampilkan edit dan delete
    {
      flex: 0.25,
      minWidth: 50,
      field: 'actions',
      headerName: 'Aksi',
      renderCell: ({ row }: CellType) => (
        <Box>
          <Button>
            <Icon icon='solar:eye-broken' onClick={() => handleShowUrl(row.id)} />
          </Button>
          <Button color='secondary' onClick={() => handleEditClick(row.id)}>
            <Icon icon='flowbite:edit-outline' />
          </Button>
          <Button color='error' onClick={() => handleDeleteClick(row.id)}>
            <Icon icon='fluent:delete-20-regular' />
          </Button>
        </Box>
      )
    }
  ]

  return (
    <>
      <Grid container spacing={6} className='match-height pt-2'>
        <CardHeader
          action={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button variant='contained' onClick={handleDialogTambah} color='primary'>
                <Icon icon='ph:plus-fill' />
              </Button>
              <CustomTextField
                style={{ marginLeft: '8px' }}
                variant='outlined'
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Icon icon='bi:search' />
                    </InputAdornment>
                  )
                }}
              />
            </div>
          }
        />
        <Box width='100%'>
          <DataGrid
            autoHeight
            pagination
            rowHeight={62}
            rows={dataPerangkat}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            onRowSelectionModelChange={rows => setSelectedRows(rows)}
          />
        </Box>
      </Grid>

      <DialogTambahPerangkatDaerah
        open={dialogTambah}
        handleClose={handleCloseDialogTambah}
        dataPerangkat={dataPerangkat}
        showAlert={showAlert}
        updateTableData={updateTableData}
      />

      <DialogEditPerangkatDaerah
        open={dialogEdit}
        handleClose={() => setDialogEdit(false)}
        dataPerangkat={(dataPerangkat || []).find(item => item.id === iddialogEdit)} // Ambil data sesuai dengan id yang di-edit
        showAlert={showAlert}
        updateTableData={updateTableData}
      />

      <DialogDeletePerangkatDaerah
        open={dialogDeleteOpen}
        handleClose={handleCloseDialogDelete}
        dataPerangkat={(dataPerangkat || []).find(item => item.id === iddialogEdit)} // Ambil data sesuai dengan id yang di-delete
        showAlert={showAlert}
        updateTableData={updateTableData}
      />

      <Dialog
        fullWidth
        open={showUrl.open}
        maxWidth='md'
        scroll='body'
        onClose={() => setShowUrl({ open: false, data: null })}
        TransitionComponent={Transition}
        onBackdropClick={() => setShowUrl({ open: false, data: null })}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            py: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={() => setShowUrl({ open: false, data: null })}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Typography variant='h4' sx={{ mb: 4 }}>
            Tampilan Website {showUrl.data?.nama || ''}
          </Typography>
          {showUrl.data && <Iframe url={showUrl.data.url} width='100%' height='500px' />}
        </DialogContent>
      </Dialog>

      {isAlertOpen && (
        <Snackbar
          open={isAlertOpen}
          autoHideDuration={3000} // Sesuaikan dengan durasi yang diinginkan
          onClose={() => setIsAlertOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert severity={alertSeverity} onClose={() => setIsAlertOpen(false)}>
            {AlertMessage}
          </Alert>
        </Snackbar>
      )}
    </>
  )
}

export default PerangkatDaerah
