// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import format from 'date-fns/format'
import { ApexOptions } from 'apexcharts'
import DatePicker from 'react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'

import axios from 'axios'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'

interface PickerProps {
  start: Date | number
  end: Date | number
}

const ChartAllVisitor = ({ data }) => {
  // ** States
  const [endDate, setEndDate] = useState<DateType>(null)
  const [startDate, setStartDate] = useState<DateType>(null)
  const [series, setSeries] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [loading, setLoading] = useState(true);
  const [areaColors, setAreaColors] = useState({
    series1: '#ab7efd',
    series2: '#b992fe',
    series3: '#e0cffe'
  });

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    // Add opacity (alpha) to the color
    return `${color}80`; // 80 is the hex value for 50% opacity
  };

  // ** Hook
  const theme = useTheme()

  const newData = [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await Promise.all(
          data.map(async (item) => {
            if (!selectedDevice || item.perangkat_daerah === selectedDevice) {
              const fullUrl = item.url + item.endpoint;
              const response = await axios.get(fullUrl, {
                headers: {
                  key: item.api_key
                }
              });

              const resData = response.data;
              const randomColor = generateRandomColor();

              return {
                name: item.perangkat_daerah,
                data: resData.map(itemData => itemData.count),
                date: resData.map(itemData => itemData.date || null),
                color: randomColor
              };
            }
            return null;
          })
        );

        setSeries(newData.filter(item => item !== null));
      } catch (error) {
        console.error('Error fetching data:', error);
        setSeries([]);
      } finally {
        setLoading(false);
      }
      
    };

    fetchData();
  }, [data, selectedDevice]);

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: { show: false }, // Menyembunyikan tooltip
    dataLabels: { enabled: false }, // Menonaktifkan label data
    stroke: {
      show: false,
      curve: 'straight'
    },
    legend: {
      show: false, // Menyembunyikan legend
    },
    colors: [areaColors.series3, areaColors.series2, areaColors.series1],
    fill: {
      opacity: 1,
      type: 'solid'
    },
    grid: {
      show: true,
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: true }
      }
    },
    yaxis: {
      show: false, // Menyembunyikan label sumbu y
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: theme.palette.divider },
      crosshairs: {
        stroke: { color: theme.palette.divider }
      },
      labels: {
        show: false, // Menyembunyikan label sumbu x
      },
      categories: series.length > 0 && series[0] && series[0].date ? series[0].date : [],
    },
    title: {
      text: '',  // Set judul menjadi string kosong untuk menghilangkan judul
    }
  }

  return (
    <Card>
      <CardHeader
        title='Statistik Data Pengunjung'
        subheader='Website Perangkat Daerah Kabupaten Ogan Ilir'
        subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
        action={
          <Select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Pilih Perangkat Daerah' }}
          >
            <MenuItem value="" disabled>Pilih Perangkat Daerah</MenuItem>
            {data.map((item) => (
              <MenuItem key={item.perangkat_daerah} value={item.perangkat_daerah}>
                {item.perangkat_daerah}
              </MenuItem>
            ))}
          </Select>
        }
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
      />
      <CardContent>
        {loading ? (
        <Backdrop
          open={true}
          sx={{
            position: 'absolute',
            color: 'common.white',
            zIndex: theme.zIndex.mobileStepper - 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)' // Menambahkan latar belakang transparan
          }}
          >
          <CircularProgress color='inherit' />
        </Backdrop>
        ) : (
          series && series.length > 0 && series[0].data ? (
            <ReactApexcharts
              type='area'
              height={400}
              options={options}
              series={series.map(item => ({ data: item.data, color: item.color }))}
            />
          ) : (
            <div>Data tidak tersedia.</div>
          )
        )}
      </CardContent>
    </Card>
  )
}

export default ChartAllVisitor
