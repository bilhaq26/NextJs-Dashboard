import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { AvatarGroup } from '@mui/material'
import Grid from '@mui/material/Grid'
import Link from 'next/link'

const AnalyticsProject = () => {
  const [characterData, setCharacterData] = useState([])
  const [visibleItems, setVisibleItems] = useState(6)
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    // Fetch data from the API using Axios
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api-blue-archive.vercel.app/api/characters')
        setCharacterData(response.data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const handleSeeMore = () => {
    setVisibleItems(prevValue => prevValue + 6)
    if (visibleItems + 6 >= characterData.length) {
      setShowMore(true)
    }
  }

  const handleShowLess = () => {
    setVisibleItems(6)
    setShowMore(false)
  }

  return (
    <>
      {characterData.slice(0, visibleItems).map((character, index) => (
        <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
          <Card sx={{ position: 'relative' }}>
            <CardMedia sx={{ height: '12.625rem' }} image={character.image} />
            <Avatar
              alt={character.name}
              src={character.photoUrl}
              sx={{
                width: 75,
                height: 75,
                left: '1.313rem',
                top: '10.28125rem',
                position: 'absolute',
                border: theme => `0.25rem solid ${theme.palette.common.white}`
              }}
            />
            <CardContent>
              <Box
                sx={{
                  mt: 5.75,
                  mb: 8.75,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ mr: 2, mb: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='h5'>{character.name}</Typography>
                  <Typography variant='body2'>{character.title}</Typography>
                </Box>
                {/* make button to detail character [name] */}
                <Button variant='contained'>Detail Character</Button>
              </Box>
              <Box
                sx={{
                  gap: 2,
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                  {characterData.length - 1} Members
                </Typography>
                <AvatarGroup max={4}>
                  {characterData.map(item => (
                    <Avatar key={item._id} alt={item.name} src={item.photoUrl} />
                  ))}
                </AvatarGroup>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
      {/* grid center */}
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        {showMore ? (
          <Button variant='contained' onClick={handleShowLess}>
            Show Less
          </Button>
        ) : (
          <Button variant='contained' onClick={handleSeeMore}>
            Show More
          </Button>
        )}
      </Grid>
    </>
  )
}

export default AnalyticsProject
