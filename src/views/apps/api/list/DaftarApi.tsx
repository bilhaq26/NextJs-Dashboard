import { useEffect, useState } from 'react'
import axios from 'axios'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Icon from 'src/@core/components/icon'

const DaftarApi = ({ data, activeTab }) => {
  const [reload, setReload] = useState<boolean>(false)
  const [collapsedStates, setCollapsedStates] = useState<{ [key: string]: boolean }>({})
  const [visibility, setVisibility] = useState<boolean>(true)
  const [apiResults, setApiResults] = useState<{ [key: string]: { url: string; endpoint: string; data: any[] } }>({})

  const handleBackDrop = () => {
    setReload(true)

    setTimeout(() => {
      // Setelah 2 detik, hentikan backdrop dan panggil fetchDataForItem untuk semua item dengan forceRefresh true
      setReload(false)
      Object.keys(apiResults).forEach(itemId => fetchDataForItem(itemId, data.url, data.endpoint, data.api_key, true))
    }, 2000)
  }

  const fetchDataForItem = async (
    itemId: string,
    itemUrl: string,
    itemEndpoint: string,
    itemApiKey: string,
    forceRefresh = false
  ) => {
    try {
      const fullUrl = `${itemUrl}${itemEndpoint}`
      console.log('Full URL:', fullUrl)

      // Hanya panggil API jika forceRefresh diaktifkan atau data belum ada
      if (forceRefresh || !apiResults[itemId]) {
        const response = await axios.get(fullUrl, {
          headers: {
            key: itemApiKey
          }
        })

        setApiResults(prevResults => ({
          ...prevResults,
          [itemId]: { url: itemUrl, endpoint: itemEndpoint, data: response.data }
        }))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleCollapseToggle = async (itemId: string, itemUrl: string, itemEndpoint: string, itemApiKey: string) => {
    setCollapsedStates(prevStates => ({
      ...prevStates,
      [itemId]: !prevStates[itemId]
    }))

    if (!apiResults[itemId]) {
      await fetchDataForItem(itemId, itemUrl, itemEndpoint, itemApiKey)
    }
  }

  return (
    <Grid container spacing={10}>
      {(data || []).map((item, index) => (
        <Grid item key={index} xs={12} md={6} mt={4}>
          <Fade in={visibility} timeout={300}>
            <Card sx={{ position: 'relative' }}>
              <CardHeader
                title={item.perangkat_daerah}
                action={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      size='small'
                      aria-label='collapse'
                      sx={{ mr: 2, color: 'text.secondary' }}
                      onClick={() => handleCollapseToggle(item.id, item.url, item.endpoint, item.api_key)}
                    >
                      <Icon
                        fontSize={20}
                        icon={!collapsedStates[item.id] ? 'tabler:chevron-down' : 'tabler:chevron-up'}
                      />
                    </IconButton>
                    <IconButton
                      size='small'
                      aria-label='reload'
                      onClick={() => handleBackDrop()}
                      sx={{ mr: 2, color: 'text.secondary' }}
                    >
                      <Icon icon='tabler:reload' fontSize={20} />
                    </IconButton>
                  </Box>
                }
              />
              <Collapse in={collapsedStates[item.id]}>
                <CardContent>
                  {apiResults[item.id] ? (
                    <pre>{JSON.stringify(apiResults[item.id].data.slice(0, 2), null, 2)}</pre>
                  ) : (
                    <Typography variant='body2'>Fetching data...</Typography>
                  )}
                </CardContent>

                <Backdrop
                  open={reload}
                  sx={{
                    position: 'absolute',
                    color: 'common.white',
                    zIndex: theme => theme.zIndex.mobileStepper - 1
                  }}
                >
                  <CircularProgress color='inherit' />
                </Backdrop>
              </Collapse>
            </Card>
          </Fade>
        </Grid>
      ))}
    </Grid>
  )
}

export default DaftarApi
