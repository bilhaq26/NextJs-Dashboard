// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Third Party Imports
import format from 'date-fns/format'
import { ApexOptions } from 'apexcharts'
import DatePicker from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import axios from 'axios'

interface PickerProps {
  start: Date | number
  end: Date | number
}

const ChartBarVisitor = ({data}) => {
  // ** States
  const [endDate, setEndDate] = useState<DateType>(null)
  const [startDate, setStartDate] = useState<DateType>(null)
  const [barChartData, setbarChartData] = useState([]);

  // ** Hook
  const theme = useTheme()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await Promise.all(
          data.map(async (item) => {
            const fullUrl = item.url + item.endpoint;
            const response = await axios.get(fullUrl, {
              headers: {
                key: item.api_key
              }
            });
  
            const resData = response.data;
  
            // Filter data berdasarkan rentang tanggal jika startDate dan endDate terdefinisi
            let filteredData = resData;
            if (startDate && endDate) {
              filteredData = resData.filter((dataItem) => {
                const date = new Date(dataItem.date);
                return date >= startDate && date <= endDate;
              });
            }
  
            // Mengambil data terakhir dari filteredData
            const lastData = filteredData.length > 0 ? filteredData[filteredData.length - 1] : null;
  
            return {
              name: item.perangkat_daerah,
              value: lastData ? lastData.count : 0, // Menggunakan nilai count atau default 0 jika tidak ada data terakhir
              date: lastData ? lastData.date : null
            };
          })
        );
  
        // Urutkan newData berdasarkan nilai dari yang terbesar
        newData.sort((a, b) => b.value - a.value);
  
        // Ambil 5 data pertama
        const top5Data = newData.slice(0, 5);
  
        setbarChartData(top5Data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setbarChartData([]);
      }
    };
  
    fetchData();
  }, [data, startDate, endDate]);

  console.log('barChartData:', barChartData);

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    colors: ['#00cfe8'],
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 8,
        barHeight: '30%',
        horizontal: true,
        startingShape: 'rounded'
      }
    },
    grid: {
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: false }
      },
      padding: {
        top: -10
      }
    },
    yaxis: {
      labels: {
        style: { colors: theme.palette.text.disabled }
      }
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: theme.palette.divider },
      categories: data.map(item => item.perangkat_daerah),
      labels: {
        style: { colors: theme.palette.text.disabled }
      }
    }
  }

  const CustomInput = forwardRef((props: PickerProps, ref) => {
    const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
    const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return (
      <CustomTextField
        {...props}
        value={value}
        inputRef={ref}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Icon fontSize='1.25rem' icon='tabler:calendar-event' />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position='end'>
              <Icon fontSize='1.25rem' icon='tabler:chevron-down' />
            </InputAdornment>
          )
        }}
      />
    )
  })

  const handleOnChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const seriesData = barChartData.map(item => item.value);

  return (
    <Card>
      <CardHeader
        title='Pengunjung Website Terbanyak'
        subheader='Daftar 5 Website dengan pengunjung terbanyak hari ini'
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
        action={
          <DatePicker
            selectsRange
            endDate={endDate}
            id='apexchart-bar'
            selected={startDate}
            startDate={startDate}
            onChange={handleOnChange}
            placeholderText='Pilih tanggal'
            customInput={<CustomInput start={startDate as Date | number} end={endDate as Date | number} />}
          />
        }
      />
      <CardContent>
        <ReactApexcharts
          type='bar'
          height={400}
          options={options}
          series={[{ data: seriesData }]}
        />
      </CardContent>
    </Card>
  )
}

export default ChartBarVisitor
