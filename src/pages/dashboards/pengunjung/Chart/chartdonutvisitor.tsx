// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { useEffect, useState } from 'react'
import axios from 'axios'

const donutColors = {
  series1: '#fdd835',
  series2: '#00d4bd',
  series3: '#826bf8',
  series4: '#1FD5EB',
  series5: '#ffa1a1'
}

const ChartDonutVisitor = ({ data }) => {
  const [donutChartData, setDonutChartData] = useState([]);
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
  
            // Mengambil data terakhir dari resData
            const lastData = resData.length > 0 ? resData[resData.length - 1] : null;
  
            return {
              name: item.perangkat_daerah,
              value: lastData ? lastData.count : 0 // Menggunakan nilai count atau default 0 jika tidak ada data terakhir
            };
          })
        );
  
        setDonutChartData(newData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setDonutChartData([]);
      }
    };
  
    fetchData();
  }, [data]);

  const options: ApexOptions = {
    stroke: { width: 0 },
    labels: data.map(item => item.perangkat_daerah),
    colors: [donutColors.series1, donutColors.series5, donutColors.series3, donutColors.series2],
    dataLabels: {
      enabled: true,
      formatter: (val: string) => `${parseInt(val, 10)}%`
    },
    legend: {
      show: false // Menyembunyikan legend
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '1.2rem'
            },
            value: {
              fontSize: '1.2rem',
              color: theme.palette.text.secondary,
              formatter: (val: string) => `${parseInt(val, 10)}`
            },
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380
          },
          legend: {
            position: 'bottom'
          }
        }
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: theme.typography.body1.fontSize
                  },
                  value: {
                    fontSize: theme.typography.body1.fontSize
                  },
                  total: {
                    fontSize: theme.typography.body1.fontSize
                  }
                }
              }
            }
          }
        }
      }
    ]
  }

  return (
    <Card>
      <CardHeader
        title='Pengunjung Hari Ini'
        subheader='Total pengunjung website pada hari ini'
        subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
      />
      <CardContent>
      {donutChartData.length > 0 ? (
          <ReactApexcharts type='donut' height={400} options={options} series={donutChartData.map(item => item.value)} />
        ) : (
          <div>Data tidak tersedia.</div>
        )}
      </CardContent>
    </Card>
  )
}

export default ChartDonutVisitor
