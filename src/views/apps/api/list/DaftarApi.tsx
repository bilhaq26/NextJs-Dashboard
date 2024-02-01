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
import Button from '@mui/material/Button'
import Icon from 'src/@core/components/icon'
import { useTheme } from '@mui/material/styles'
import JSONPretty from 'react-json-pretty'
import 'react-json-pretty/themes/monikai.css'

const DaftarApi = ({ data, activeTab }) => {
  const [reload, setReload] = useState(false)
  const [collapsedStates, setCollapsedStates] = useState({})
  const [visibility, setVisibility] = useState(true)
  const [apiResults, setApiResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [visibleCollapseCount, setVisibleCollapseCount] = useState(2)
  const [showLess, setShowLess] = useState(false)
  const theme = useTheme()

  const handleBackDrop = () => {
    setLoading(true)

    setTimeout(() => {
      setReload(false)
      Object.keys(apiResults).forEach(itemId => fetchDataForItem(itemId, data.url, data.endpoint, data.api_key, true))
      setLoading(false)
    }, 2000)
  }

  const fetchDataForItem = async (itemId, itemUrl, itemEndpoint, itemApiKey, forceRefresh = false) => {
    try {
      setLoading(true)
      const fullUrl = `${itemUrl}${itemEndpoint}`
      console.log('Full URL:', fullUrl)

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
    } finally {
      setLoading(false)
    }
  }

  const handleCollapseToggle = async (itemId, itemUrl, itemEndpoint, itemApiKey) => {
    setCollapsedStates(prevStates => ({
      ...prevStates,
      [itemId]: !prevStates[itemId]
    }))

    if (!apiResults[itemId]) {
      await fetchDataForItem(itemId, itemUrl, itemEndpoint, itemApiKey)
    }
  }

  return (
    <Grid container spacing={10} justifyContent='center'>
      {data.slice(0, visibleCollapseCount).map((item, index) => (
        <Grid item key={index} xs={12} md={6} mt={4}>
          <Fade in={visibility} timeout={300}>
            <Card sx={{ position: 'relative', zIndex: theme.zIndex.mobileStepper - 1 }}>
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
                  {loading ? (
                    <Backdrop
                      open={loading}
                      sx={{
                        position: 'absolute',
                        color: 'common.white',
                        zIndex: theme.zIndex.mobileStepper - 1
                      }}
                    >
                      <CircularProgress color='inherit' />
                    </Backdrop>
                  ) : apiResults[item.id] ? (
                    <div>
                      <div>
                        <strong>URL:</strong> {apiResults[item.id].url}
                        {apiResults[item.id].endpoint}
                      </div>
                      <div>
                        <strong>API Key:</strong> {apiResults[item.id].data.api_key}
                      </div>
                      <JSONPretty data={apiResults[item.id].data.slice(0, 2)} />
                    </div>
                  ) : (
                    <Typography variant='body2'>Fetching data...</Typography>
                  )}
                </CardContent>

                <Backdrop
                  open={reload}
                  sx={{
                    position: 'absolute',
                    color: 'common.white',
                    zIndex: theme.zIndex.mobileStepper - 1
                  }}
                >
                  <CircularProgress color='inherit' />
                </Backdrop>
              </Collapse>
            </Card>
          </Fade>
        </Grid>
      ))}

      {visibleCollapseCount < data.length && !showLess && (
        <Grid item xs={12} mt={4} sx={{ textAlign: 'center' }}>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              setVisibleCollapseCount(prevCount => prevCount + 2)
              setShowLess(true)
            }}
          >
            Load More
          </Button>
        </Grid>
      )}

      {showLess && (
        <Grid item xs={12} mt={4} sx={{ textAlign: 'center' }}>
          <Button
            variant='contained'
            color='secondary'
            onClick={() => {
              setVisibleCollapseCount(2)
              setShowLess(false)
            }}
          >
            Show Less
          </Button>
        </Grid>
      )}
    </Grid>
  )
}

export default DaftarApi
