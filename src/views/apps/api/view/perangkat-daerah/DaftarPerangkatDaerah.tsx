// ** React Imports
import { Ref, useState, forwardRef, ReactElement } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import Iframe from 'react-iframe'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

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

const DaftarPerangkatDaerah = ({ item, handleEditClick, handleDeleteClick }) => {
  const [show, setShow] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenu = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    handleEditClick(item.id) // Panggil fungsi handleEditClick dengan mengirimkan item yang akan di-edit
    handleCloseMenu()
  }

  const handleDelete = () => {
    handleDeleteClick(item.id) // Panggil fungsi handleDeleteClick dengan mengirimkan item yang akan di-delete
    handleCloseMenu()
  }

  return (
    <Card>
      <CardContent sx={{ textAlign: 'center', '& svg': { mb: 2 } }}>
        <div style={{ position: 'relative', textAlign: 'right', marginTop: '-15px' }}>
          <Button onClick={handleMenu} style={{ position: 'absolute', top: '0', right: '10px' }}>
            <Icon icon='tabler:dots' fontSize='1.5rem' />
          </Button>
        </div>
        <Icon icon='material-symbols:globe' fontSize='5rem' />
        <Typography variant='h4' sx={{ mb: 4 }}>
          {item.nama}
        </Typography>
        <Button variant='contained' onClick={() => setShow(true)}>
          Lihat Tampilan Website
        </Button>
      </CardContent>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={() => setShow(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => setShow(false)}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            py: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <CustomCloseButton onClick={() => setShow(false)}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Typography variant='h4' sx={{ mb: 4 }}>
            Tampilan Website {item.nama}
          </Typography>
          <Iframe url={item.url} width='100%' height='500px' />
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default DaftarPerangkatDaerah
