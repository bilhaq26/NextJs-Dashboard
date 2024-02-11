// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import CircularProgress from '@mui/material/CircularProgress'
import React from 'react'

const series = [32, 41, 41, 70]

const JumlahTotal = () => {

  const [apiData, setApiData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  // ** Hook
  const theme = useTheme()

  const options: ApexOptions = {
    colors: [
      theme.palette.success.main,
      hexToRGBA(theme.palette.success.main, 0.7),
      hexToRGBA(theme.palette.success.main, 0.5),
      hexToRGBA(theme.palette.success.main, 0.16)
    ],
    stroke: { width: 0 },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    labels: ['Electronic', 'Sports', 'Decor', 'Fashion'],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      padding: {
        top: -22,
        bottom: -18
      }
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
              fontFamily: theme.typography.fontFamily
            },
            value: {
              offsetY: -17,
              fontWeight: 500,
              formatter: val => `${val}`,
              color: theme.palette.text.primary,
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.h2.fontSize as string
            },
            total: {
              show: true,
              label: 'Total',
              color: theme.palette.text.secondary,
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.h5.fontSize as string
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          chart: { width: 200, height: 249 }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          chart: { width: 150, height: 199 }
        }
      }
    ]
  }

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://newdashboard.bil/api/perangkat-daerah', {
          headers: {
            'key': '1234567890'
          }
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

  return (
    <Card>
      <CardContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <div>
            <Box sx={{ gap: 2, display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', position: 'relative' }}>
              <Box sx={{ gap: 1.75, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <Typography variant='h5' sx={{ mb: 0.5 }}>
                    Total Semua Website
                  </Typography>
                  <Typography variant='body2'>Semua Website Perangkat Daerah dan Website Desa</Typography>
                </div>
                <div>
                  <Typography variant='h3'>{apiData.length}</Typography>
                </div>
              </Box>
              <ReactApexcharts type='donut' width={150} height={165} series={updatedSeries} options={options} />
            </Box>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default JumlahTotal;
