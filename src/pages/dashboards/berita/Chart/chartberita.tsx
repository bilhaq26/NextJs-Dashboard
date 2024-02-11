// ** React Imports
import { forwardRef, useEffect, useState } from 'react';

// ** MUI Imports
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

// ** Custom Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts';

// ** Third Party Imports
import axios from 'axios';
import format from 'date-fns/format';
import DatePicker from 'react-datepicker';

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes';

interface PickerProps {
  start: Date | number;
  end: Date | number;
}

const ChartBerita = ({ data }) => {
  // ** States
  const [endDate, setEndDate] = useState<DateType>(null);
  const [startDate, setStartDate] = useState<DateType>(null);
  const [series, setSeries] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [loading, setLoading] = useState(true);
  const [areaColors, setAreaColors] = useState({
    series1: '#ab7efd',
    series2: '#b992fe',
    series3: '#e0cffe'
  });
  const [countedData, setCountedData] = useState({});

  // ** Hook
  const theme = useTheme();

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    // Add opacity (alpha) to the color
    return `${color}80`; // 80 is the hex value for 50% opacity
  };

  // Fungsi untuk mengonversi berbagai format tanggal menjadi YYYY-MM-DD
  const convertDateFormat = (rawDate) => {
    const date = new Date(rawDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fungsi untuk menghitung jumlah berita setiap tanggal
  const countDataPerDate = (data) => {
    const countedData = {};
    data.forEach(({ date }) => {
      countedData[date] = (countedData[date] || 0) + 1;
    });
    return countedData;
  };

  // Fungsi untuk mendapatkan rentang tanggal 30 hari terakhir
  const getLast30Days = () => {
    const today = new Date();
    const last30Days = new Date(today);
    last30Days.setDate(today.getDate() - 30);
    return { start: last30Days, end: today };
  };

  const fetchData = async () => {
    try {
      const { start, end } = getLast30Days();
      setStartDate(start);
      setEndDate(end);

      const newData = await Promise.all(
        data.map(async (item) => {
          if (!selectedDevice || item.perangkat_daerah === selectedDevice) {
            const fullUrl = item.url + item.endpoint;
            const response = await axios.get(fullUrl, {
              headers: {
                key: item.api_key
              }
            });

            const resData = response.data.data;

            // Print resData untuk memeriksa formatnya
            console.log('resData:', resData);

            if (Array.isArray(resData)) {
              console.log('Valid data format. resData:', resData);
              const randomColor = generateRandomColor();

              const processedData = resData.map(itemData => ({
                name: item.perangkat_daerah,
                title: itemData.title,
                slug: itemData.slug,
                type: itemData.type,
                content: itemData.content,
                thumbnail: itemData.thumbnail,
                created_at: itemData.created_at,
                // Menggunakan fungsi konversi tanggal
                date: convertDateFormat(itemData.published_at),
                views: itemData.views,
                author: itemData.author,
                color: randomColor
              }));

              // Filter data untuk satu bulan terakhir
              const filteredData = processedData.filter(({ date }) => {
                const dateObj = new Date(date);
                return dateObj >= start && dateObj <= end;
              });

              // Menghitung jumlah berita setiap tanggal
              const countedData = countDataPerDate(filteredData);
              setCountedData(countedData);

              // Log hasil filter
              console.log('Filtered Data:', filteredData);

              return filteredData;
            } else {
              console.error('Invalid data format. Please provide an array.', resData);
              return [];
            }
          }
          return null;
        })
      );

      const filteredData = newData.filter(item => item !== null);
      setSeries(filteredData.flat());

      // Tampilkan jumlah data dengan tanggal yang sama di console log
      console.log('Counted Data:', countedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSeries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { start, end } = getLast30Days();
        console.log('Fetching data for the last 30 days:', start, end);
        setStartDate(start);
        setEndDate(end);
  
        const newData = await Promise.all(
          data.map(async (item) => {
            if (!selectedDevice || item.perangkat_daerah === selectedDevice) {
              const fullUrl = item.url + item.endpoint;
              console.log(`Fetching data for ${item.perangkat_daerah} from ${fullUrl}`);
  
              const response = await axios.get(fullUrl, {
                headers: {
                  key: item.api_key
                }
              });
  
              const resData = response.data.data;
  
              if (Array.isArray(resData)) {
                console.log('Valid data format. Processing data:', resData);
                const randomColor = generateRandomColor();
  
                const processedData = resData.map(itemData => ({
                  name: item.perangkat_daerah,
                  title: itemData.title,
                  slug: itemData.slug,
                  type: itemData.type,
                  content: itemData.content,
                  thumbnail: itemData.thumbnail,
                  created_at: itemData.created_at,
                  date: convertDateFormat(itemData.published_at),
                  views: itemData.views,
                  author: itemData.author,
                  color: randomColor
                }));
  
                // Filter data untuk satu bulan terakhir
                const filteredData = processedData.filter(({ date }) => {
                  const dateObj = new Date(date);
                  return dateObj >= start && dateObj <= end;
                });
  
                // Menghitung jumlah berita setiap tanggal
                const countedData = countDataPerDate(filteredData);
                console.log('Counted Data:', countedData);
                setCountedData(countedData);
  
                // Log hasil filter
                console.log('Filtered Data:', filteredData);
  
                return filteredData;
              } else {
                console.error('Invalid data format. Please provide an array.', resData);
                return [];
              }
            }
            return null;
          })
        );
  
        const filteredData = newData.filter(item => item !== null);
        setSeries(filteredData.flat());
  
        // Ubah countedData ke format yang dapat digunakan oleh grafik
        const chartData = Object.keys(countedData).map(date => ({
          date,
          count: countedData[date]
        })).slice(-30); // Mengambil hanya 30 hari terakhir
  
        // Set data grafik
        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSeries([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [data, selectedDevice]);
  

  const [chartData, setChartData] = useState([]);

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    tooltip: {
      show: true,
      y: {
        formatter: function (value) {
          return `Jumlah Berita: ${value}`;
        }
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      show: false,
      curve: 'smooth'
    },
    legend: {
      show: false,
    },
    colors: [areaColors.series1],
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
      show: false,
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: theme.palette.divider },
      crosshairs: {
        stroke: { color: theme.palette.divider }
      },
      labels: {
        show: true,
      },
      categories: chartData.map(item => item.date),
    },
    title: {
      text: '',
    }
  };
  
  

  const formatDate = (dateString) => {
    const formattedDate = format(new Date(dateString), 'dd MMMM yyyy');
    return formattedDate;
  };

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
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
      ) : (
        chartData && chartData.length > 0 ? (
          <ReactApexcharts
            type='area'
            height={400}
            options={options}
            series={[{
              // memanggil nama perangkat daerah
              name: selectedDevice || data[0].perangkat_daerah,
              data: chartData.map(item => item.count),
              color: areaColors.series1
            }]}
          />
        ) : (
          <div>Data tidak tersedia.</div>
        )
      )}

      </CardContent>
    </Card>
  );
};

export default ChartBerita;
