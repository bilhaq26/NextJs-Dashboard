// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// ** Icons Imports
import Icon from 'src/@core/components/icon';

// ** Third Party Imports
import { ApexOptions } from 'apexcharts';

// ** Custom Components Imports
import React from 'react';
import ReactApexcharts from 'src/@core/components/react-apexcharts';
import Lottie from 'react-lottie';

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba';

const JumlahTotal = () => {
  const [apiData, setApiData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const theme = useTheme();

  const options: ApexOptions = {
    colors: [
      theme.palette.success.main,
      hexToRGBA(theme.palette.success.main, 0.7),
      hexToRGBA(theme.palette.success.main, 0.5),
      hexToRGBA(theme.palette.success.main, 0.16),
    ],
    stroke: { width: 0 },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    labels: ['Electronic', 'Sports', 'Decor', 'Fashion'],
    states: {
      hover: {
        filter: { type: 'none' },
      },
      active: {
        filter: { type: 'none' },
      },
    },
    grid: {
      padding: {
        top: -22,
        bottom: -18,
      },
    },
    plotOptions: {
      pie: {
        customScale: 0.8,
        expandOnClick: false,
        donut: {
          size: '73%',
          labels: {
            show: true,
            name: {
              offsetY: 22,
              color: theme.palette.text.secondary,
              fontFamily: theme.typography.fontFamily,
            },
            value: {
              offsetY: -17,
              fontWeight: 500,
              formatter: (val) => `${val}`,
              color: theme.palette.text.primary,
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.h2.fontSize as string,
            },
            total: {
              show: true,
              label: 'Total',
              color: theme.palette.text.secondary,
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.h5.fontSize as string,
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          chart: { width: 200, height: 249 },
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          chart: { width: 150, height: 199 },
        },
      },
    ],
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://newdashboard.bil/api/perangkat-daerah', {
          headers: {
            key: '1234567890',
          },
        });

        if (response.ok) {
          const result = await response.json();
          setApiData(result.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updatedSeries = [apiData.length];

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: {
      // Ganti dengan data animasi Lottie yang sesuai
    },
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Card sx={{ position: 'relative', minHeight: '200px' }}>
      <CardContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <div>
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              <Box sx={{ gap: 1.75, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <Typography variant='h5' sx={{ mb: 0.5, color: 'white' }}>
                    Total Semua Website
                  </Typography>
                  <Typography variant='body2' sx={{ color: 'white' }}>
                    Semua Website Perangkat Daerah dan Website Desa
                  </Typography>
                </div>
                <div>
                  <Typography variant='h3' sx={{ color: 'white' }}>
                    {apiData.length}
                  </Typography>
                </div>
              </Box>
              <ReactApexcharts type='donut' width={150} height={165} series={updatedSeries} options={options} />
            </Box>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
              <Lottie options={lottieOptions} height={'100%'} width={'100%'} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JumlahTotal;
