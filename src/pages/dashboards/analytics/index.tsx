// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Demo Components Imports
import ApexBarChart from 'src/views/charts/apex-charts/ApexBarChart'
import ApexAreaChart from 'src/views/charts/apex-charts/ApexAreaChart'
import ApexLineChart from 'src/views/charts/apex-charts/ApexLineChart'
import ApexRadarChart from 'src/views/charts/apex-charts/ApexRadarChart'
import ApexDonutChart from 'src/views/charts/apex-charts/ApexDonutChart'
import { useEffect, useState } from 'react'
import axios from 'axios'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import MuiCard, { CardProps } from '@mui/material/Card'
import ChartAllVisitor from './Chart/chartallvisitor'
import ChartDonutVisitor from './Chart/chartdonutvisitor'
import ChartBarVisitor from './Chart/charbaevisitor'

const Card = styled(MuiCard)<CardProps>(() => ({
  border: 0,
  boxShadow: 'none',
  backgroundSize: 'cover',
  backgroundColor: 'transparent',
  backgroundImage: 'url(/images/pages/header-bg.png)'
}))

const AnalyticsDashboard = () => {
  const [data, setData] = useState([])
  const [jenisApiOptions, setJenisApiOptions] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://newdashboard.bil/api/daftar-api', {
          headers: {
            key: '1234567890'
          }
        })

        if (response.data && Array.isArray(response.data.data)) {
          setData(response.data.data)

          const uniqueJenisApiOptions = Array.from(new Set(response.data.data.map(item => item.jenis_api)))
          setJenisApiOptions(uniqueJenisApiOptions)
        } else {
          console.error('Invalid data format. Expecting an array.')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <ApexChartWrapper>
      <DatePickerWrapper>
        <Grid container spacing={6} className='match-height'>
          <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pt: 26, textAlign: 'center', pb: theme => `${theme.spacing(24)} !important` }}>
              <Typography sx={{ mb: 4, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385 }}>
                DASHBOARD WEBSITE 
              </Typography>
              <Typography sx={{ mt: 4, color: 'text.secondary' }}>
              PERANGKAT DAERAH DAN DESA KABUPATEN OGAN ILIR
              </Typography>
            </CardContent>
          </Card>
          </Grid>
          <Grid item xs={12}>
            <ChartAllVisitor data={data} jenisApiOptions={jenisApiOptions}  />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartBarVisitor data={data} jenisApiOptions={jenisApiOptions} />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartDonutVisitor data={data} jenisApiOptions={jenisApiOptions} />
          </Grid>
        </Grid>
      </DatePickerWrapper>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
