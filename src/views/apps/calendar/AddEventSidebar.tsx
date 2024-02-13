// ** React Imports
import { useState, useEffect, forwardRef, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomChip from 'src/@core/components/mui/chip'
import { Card, CardContent } from '@mui/material'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Types
import { AddEventSidebarType } from 'src/types/apps/calendarTypes'
import { ThemeColor } from 'src/@core/layouts/types'
import { getInitials } from 'src/@core/utils/get-initials'
import { format } from 'date-fns'
import idLocale from 'date-fns/locale/id';

const defaultState = {
  thumbnail: '',
  title: '',
  content: '',
  create: '',
  publish: '',
  view: ''
};

const AddEventSidebar = (props: AddEventSidebarType) => {
  // ** Props
  const {
    store,
    addEventSidebarOpen,
    handleAddEventSidebarToggle
  } = props;

  // ** States
  const [selectedEventDetails, setSelectedEventDetails] = useState(defaultState);

  // ** Functions
  const handleSidebarClose = () => {
    setSelectedEventDetails(defaultState);
    handleAddEventSidebarToggle();
  }

  const resetToStoredValues = useCallback(() => {
    if (store.selectedEvent !== null) {
      const event = store.selectedEvent;

      setSelectedEventDetails({
        name: event.extendedProps.name || '', // Menambahkan properti name
        thumbnail: event.extendedProps.thumbnail || '',
        title: event.title || '',
        content: event.extendedProps.content || '',
        create: event.extendedProps.create || '',
        view: event.extendedProps.view || ''
      });
    }
  }, [store.selectedEvent]);

  useEffect(() => {
    if (store.selectedEvent !== null) {
      resetToStoredValues();
    } else {
      setSelectedEventDetails(defaultState);
    }
  }, [addEventSidebarOpen, resetToStoredValues, store.selectedEvent]);

  const isValidDate = (dateString) => {
    const parsedDate = new Date(dateString);
    return !isNaN(parsedDate.getTime());
  };

  return (
    <Drawer
      anchor='right'
      open={addEventSidebarOpen}
      onClose={handleSidebarClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: '100%', md: '30%' } }}
    >
      <Box
        className='sidebar-header'
        sx={{
          p: 6,
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            size='small'
            onClick={handleSidebarClose}
            sx={{
              p: '0.375rem',
              borderRadius: 1,
              color: 'text.primary',
              backgroundColor: 'action.selected',
              '&:hover': {
                backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
              }
            }}
          >
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </IconButton>
        </Box>
      </Box>
      <Box className='sidebar-body' sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <DatePickerWrapper>
          <Card>
            <CardContent sx={{ pt: 13.5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {selectedEventDetails.thumbnail ? (
                <CustomAvatar
                  src={selectedEventDetails.thumbnail}
                  variant='rounded'
                  alt={selectedEventDetails.title}
                  sx={{ width: 100, height: 100, mb: 4 }}
                />
              ) : (
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={selectedEventDetails.color as ThemeColor}
                  sx={{ width: 100, height: 100, mb: 4, fontSize: '3rem' }}
                >
                  {getInitials(selectedEventDetails.title)}
                </CustomAvatar>
              )}
              <Typography variant='h4' sx={{ mb: 3 }}>
              {/* {selectedEventDetails.title.split(' ').map((word, index, array) => (
                <>
                  {word}
                  {index < array.length - 1 && ' '}
                  {index < array.length - 1 && (index + 1) % 4 === 0 && <br />}
                </>
              ))} */}
              {selectedEventDetails.title}
              </Typography>
              <CustomChip
                rounded
                skin='light'
                size='small'
                label={selectedEventDetails.name || ''} // Menambahkan properti name
                color='primary'
                sx={{ textTransform: 'capitalize' }}
              />
            </CardContent>

            <CardContent sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                  <div>
                  {isValidDate(selectedEventDetails.create)
                  ? format(new Date(selectedEventDetails.create), "dd MMMM yyyy HH:mm", { locale: idLocale })
                  : 'Tanggal tidak valid'}
                    <Typography variant='body2'>Tanggal Buat</Typography>
                  </div>
                </Box>
                <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                  <div>
                    <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{selectedEventDetails.view}</Typography>
                    <Typography variant='body2'>Views</Typography>
                  </div>
                </Box>
              </Box>
            </CardContent>
            <CardContent sx={{ pb: 4 }}>
              <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                Details
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                  <div>
                    <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      <div dangerouslySetInnerHTML={{ __html: selectedEventDetails.content }} />
                    </Typography>
                    <Typography variant='body2'>Konten Acara</Typography>
                  </div>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </DatePickerWrapper>
      </Box>
    </Drawer>
  );
}

export default AddEventSidebar;
