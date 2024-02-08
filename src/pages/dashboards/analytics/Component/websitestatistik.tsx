// ** MUI Imports
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CustomAvatar from 'src/@core/components/mui/avatar';
import Icon from 'src/@core/components/icon';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Illustration = styled('img')(({ theme }) => ({
  right: 20,
  bottom: 0,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    right: 5,
    width: 110,
  },
}));

interface DataType {
  stats: string;
  title: string;
  color: string; // Ganti tipe data untuk warna sesuai kebutuhan Anda
  icon: string;
  value?: number;
  perangkat_daerah?: string;
}

const WebsiteStatistic = ({ data }) => {
  const [series, setSeries] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [loading, setLoading] = useState(true);
  const [stat, setStat] = useState([] as DataType[]); // Tambahkan tipe data untuk mengatasi permasalahan title
  const [areaColors, setAreaColors] = useState({
    series1: '#ab7efd',
    series2: '#b992fe',
    series3: '#e0cffe',
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        let maxCountData = null;
        let minCountData = null;
        let totalCount = 0;
  
        const newData = await Promise.all(
          data.map(async (item) => {
            if (!selectedDevice || item.perangkat_daerah === selectedDevice) {
              const fullUrl = item.url + item.endpoint;
              const response = await axios.get(fullUrl, {
                headers: {
                  key: item.api_key,
                },
              });
  
              const resData = response.data;
  
              let deviceTotalCount = 0;
  
              resData.forEach(itemData => {
                deviceTotalCount += itemData.count;
              });
  
              totalCount += deviceTotalCount;
  
              if (!maxCountData || deviceTotalCount > maxCountData.count) {
                maxCountData = { ...item, count: deviceTotalCount }; // Salin referensi objek agar tidak merubah objek asli
              }
  
              if (!minCountData || deviceTotalCount < minCountData.count) {
                minCountData = { ...item, count: deviceTotalCount }; // Salin referensi objek agar tidak merubah objek asli
              }
  
              return {
                name: item.perangkat_daerah,
                data: resData.map(itemData => itemData.count),
                date: resData.map(itemData => itemData.date || null),
                color: 'primary',
                icon: 'tabler:chart-pie-2',
              };
            }
            return null;
          }),
        );
  
        console.log('Data dengan jumlah count terbanyak:', maxCountData);
        console.log('Data dengan jumlah count terendah:', minCountData);
  
        // Tambahkan data untuk satu data terbanyak, satu data terendah, dan total ke dalam stat
        const stat = [
          {
            stats: maxCountData?.count ? `${maxCountData.count.toLocaleString()} Pengunjung` : '0 Pengunjung',
            title: maxCountData?.perangkat_daerah || 'Perangkat Daerah',
            color: 'primary', // Ganti warna sesuai kebutuhan Anda
            icon: 'flowbite:chart-line-up-outline',
          },
          {
            stats: minCountData?.count ? `${minCountData.count.toLocaleString()} Pengunjung` : '0 Pengunjung',
            title: minCountData?.perangkat_daerah || 'Perangkat Daerah',
            color: 'error', // Ganti warna sesuai kebutuhan Anda
            icon: 'flowbite:chart-line-down-outline',
          },
          {
            stats: totalCount ? `${totalCount.toLocaleString()} Pengunjung` : '0 Pengunjung',
            title: 'Total Semua Pengunjung', // Anda dapat menyesuaikan label total sesuai kebutuhan
            color: 'secondary', // Ganti warna sesuai kebutuhan Anda
            icon: 'fluent-mdl2:total',
          },
        ];
  
        setSeries(newData.filter(item => item !== null));
        setStat(stat);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSeries([]);
        setStat([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [data, selectedDevice]);
      

  const renderStats = () => {
    return stat.map((sale: DataType, index: number) => (
      <Grid item xs={6} md={3} key={index}>
        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar skin='light' color={sale.color} sx={{ mr: 4, width: 42, height: 42 }}>
            <Icon icon={sale.icon} fontSize='1.5rem' />
          </CustomAvatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h5'>{sale.stats}</Typography>
            <Typography variant='body2'>{sale.title}</Typography>
          </Box>
        </Box>
      </Grid>
    ));
  };

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h5' sx={{ textAlign: 'center', pb: theme => `${theme.spacing(10)} !important` }}>
          PENGUNJUNG WEBSITE PERANGKAT DAERAH DAN DESA KABUPATEN OGAN ILIR
        </Typography>
        <Grid container spacing={6}>
          {renderStats()}
        </Grid>
        <Illustration width={116} alt='congratulations john' src='/images/cards/logo_oi.png' />
      </CardContent>
    </Card>
  );
};

export default WebsiteStatistic;
