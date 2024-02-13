// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Redux Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Types
import { RootState, AppDispatch } from 'src/store'
import { CalendarColors, CalendarFiltersType } from 'src/types/apps/calendarTypes'

// ** FullCalendar & App Components Imports
import Calendar from 'src/views/apps/calendar/Calendar'
import SidebarLeft from 'src/views/apps/calendar/SidebarLeft'
import CalendarWrapper from 'src/@core/styles/libs/fullcalendar'
import AddEventSidebar from 'src/views/apps/calendar/AddEventSidebar'

// ** Actions
import {
  addEvent,
  fetchEvents,
  deleteEvent,
  updateEvent,
  handleSelectEvent,
  handleAllCalendars,
  handleCalendarsUpdate
} from 'src/store/apps/calendar'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/page-header'
import Typography from '@mui/material/Typography'
import ApexAreaChart from 'src/views/charts/apex-charts/ApexAreaChart'
import WebsiteStatistic from '../analytics/Component/websitestatistik'
import ChartBerita from './Chart/chartberita'
import axios from 'axios'
import CalendarBerita from './CalendarBerita'
import { MenuItem } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** CalendarColors
const calendarsColor: CalendarColors = {
  Personal: 'error',
  Business: 'primary',
  Family: 'warning',
  Holiday: 'success',
  ETC: 'info'
}

const DaftarBerita = () => {
  const [data, setData] = useState([])
  const [jenisApiOptions, setJenisApiOptions] = useState([])
  const [selectedPerangkatDaerah, setSelectedPerangkatDaerah] = useState('');
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://newdashboard.bil/api/daftar-api', {
          headers: {
            key: '1234567890'
          }
        });
  
        if (response.data && Array.isArray(response.data.data)) {
          // Filter data dengan jenis_api: "Berita" atau id_jenis_api: 1
          const filteredData = response.data.data.filter(item => item.jenis_api === "Berita" || item.id_jenis_api === 1);
  
          // Jika selectedPerangkatDaerah tidak dipilih, tampilkan semua berita
          const filteredDataByPerangkat = selectedPerangkatDaerah
            ? filteredData.filter(item => item.perangkat_daerah === selectedPerangkatDaerah)
            : filteredData;
  
          setData(filteredDataByPerangkat);
  
          const uniqueJenisApiOptions = Array.from(new Set(filteredData.map(item => item.perangkat_daerah)))
          setJenisApiOptions(uniqueJenisApiOptions);
        } else {
          console.error('Invalid data format. Expecting an array.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [selectedPerangkatDaerah]);

  useEffect(() => {
    // Mengambil data yang dipilih berdasarkan selectedPerangkatDaerah
    const selectedData = selectedPerangkatDaerah
      ? data.filter((item) => item.perangkat_daerah === selectedPerangkatDaerah)
      : data;
    setSelectedData(selectedData[0] || null);
  }, [selectedPerangkatDaerah, data]);

  const handlePerangkatDaerahChange = (value) => {
    setSelectedPerangkatDaerah(value);
  };



  // ** States
  const [calendarApi, setCalendarApi] = useState<null | any>(null)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(false)
  const [addEventSidebarOpen, setAddEventSidebarOpen] = useState<boolean>(false)

  // ** Hooks
  const { settings } = useSettings()
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.calendar)

  // ** Vars
  const leftSidebarWidth = 300
  const addEventSidebarWidth = 400
  const { skin, direction } = settings
  const mdAbove = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

  useEffect(() => {
    dispatch(fetchEvents(store.selectedCalendars as CalendarFiltersType[]))
  }, [dispatch, store.selectedCalendars])

  const handleLeftSidebarToggle = () => setLeftSidebarOpen(!leftSidebarOpen)

  const handleAddEventSidebarToggle = () => setAddEventSidebarOpen(!addEventSidebarOpen)

  return (
    <>
    <CustomTextField
      select
      fullWidth
      label='Pilih Perangkat Daerah'
      id='form-layouts-separator-select'
      value={selectedPerangkatDaerah}
      onChange={(e) => handlePerangkatDaerahChange(e.target.value)}
    >
      {/* Menambahkan opsi untuk memilih semua berita */}
      <MenuItem value=''>Semua Berita</MenuItem>
      {jenisApiOptions.map((perangkatDaerah) => (
        <MenuItem key={perangkatDaerah} value={perangkatDaerah}>
          {perangkatDaerah}
        </MenuItem>
      ))}
    </CustomTextField>
    <CalendarWrapper
      className='app-calendar mt-5'
      style={{ marginTop: '20px' }}
      sx={{
        boxShadow: skin === 'bordered' ? 0 : 6,
        ...(skin === 'bordered' && { border: theme => `1px solid ${theme.palette.divider}` })
      }}
    >
      {/* <SidebarLeft
        store={store}
        mdAbove={mdAbove}
        dispatch={dispatch}
        calendarApi={calendarApi}
        calendarsColor={calendarsColor}
        leftSidebarOpen={leftSidebarOpen}
        leftSidebarWidth={leftSidebarWidth}
        handleSelectEvent={handleSelectEvent}
        handleAllCalendars={handleAllCalendars}
        handleCalendarsUpdate={handleCalendarsUpdate}
        handleLeftSidebarToggle={handleLeftSidebarToggle}
        handleAddEventSidebarToggle={handleAddEventSidebarToggle}
      /> */}
      <Box
        sx={{
          p: 6,
          pb: 0,
          flexGrow: 1,
          borderRadius: 1,
          boxShadow: 'none',
          backgroundColor: 'background.paper',
          ...(mdAbove ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {})
        }}
      >
        <CalendarBerita
          data={data}
          store={store}
          dispatch={dispatch}
          direction={direction}
          updateEvent={updateEvent}
          calendarApi={calendarApi}
          calendarsColor={calendarsColor}
          setCalendarApi={setCalendarApi}
          handleSelectEvent={handleSelectEvent}
          handleLeftSidebarToggle={handleLeftSidebarToggle}
          handleAddEventSidebarToggle={handleAddEventSidebarToggle}
          selectedPerangkatDaerah={selectedPerangkatDaerah}
        />
      </Box>
      <AddEventSidebar
        store={store}
        dispatch={dispatch}
        addEvent={addEvent}
        updateEvent={updateEvent}
        deleteEvent={deleteEvent}
        calendarApi={calendarApi}
        drawerWidth={addEventSidebarWidth}
        handleSelectEvent={handleSelectEvent}
        addEventSidebarOpen={addEventSidebarOpen}
        handleAddEventSidebarToggle={handleAddEventSidebarToggle}
      />
    </CalendarWrapper>
    </>
  )
}

export default DaftarBerita
