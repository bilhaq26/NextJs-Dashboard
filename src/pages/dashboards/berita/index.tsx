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

  useEffect(() => {
    // Memuat data dari API daftar API
    const fetchData = async () => {
      try {
        const response = await axios.get('http://newdashboard.bil/api/daftar-api', {
          headers: {
            key: '1234567890'
          }
        })

        if (response.data && Array.isArray(response.data.data)) {
          // Filter data dengan jenis_api: "Visitor" atau id_jenis_api: 2
          const filteredData = response.data.data.filter(item => item.jenis_api === "Berita" || item.id_jenis_api === 1);

          setData(filteredData);

          const uniqueJenisApiOptions = Array.from(new Set(filteredData.map(item => item.jenis_api)))
          setJenisApiOptions(uniqueJenisApiOptions);
        } else {
          console.error('Invalid data format. Expecting an array.')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])


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
    <ApexChartWrapper style={{ marginBottom: '20px' }}>
      <DatePickerWrapper>
        <Grid container spacing={6} className='match-height'>
          <PageHeader
            title={
              <Typography variant='h4'>
               React ApexCharts
              </Typography>
            }
            subtitle={<Typography sx={{ color: 'text.secondary' }}>React Component for ApexCharts</Typography>}
          />
          <Grid item xs={12}>
          <ChartBerita data={data} jenisApiOptions={jenisApiOptions}/>
          </Grid>
        </Grid>
      </DatePickerWrapper>
    </ApexChartWrapper>

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
        <Calendar
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
