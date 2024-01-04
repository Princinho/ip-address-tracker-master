import { Box, Button, Paper, Stack, TextField, ThemeProvider, Typography, createTheme, useMediaQuery } from '@mui/material'
import './App.css'
import bgImageMobile from "./assets/images/pattern-bg-mobile.png"
import bgImageDesktop from "./assets/images/pattern-bg-desktop.png"
import { themeOptions } from "./ThemeOptions"
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import { ArrowForwardIos } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { getIpLocation } from './utils'
function App() {
  let grey = 'hsl(0, 0%, 59%)'
  let lightGrey = 'hsl(0, 0%, 80%)'
  let darkGrey = 'hsl(0, 0%, 17%)'
  const dark = createTheme({ ...themeOptions, palette: { ...themeOptions.palette } })
  const informationsStyles = {
    flex: '1 1 auto', paddingBlock: { sm: '2em' },
    borderRight: { sm: `1px solid ${lightGrey}` }, width: '20%'
  }
  const [isLoading, setIsloading] = useState(false)
  const [ipAdress, setIpAdress] = useState('')
  const [locationInfo, setLocationInfo] = useState(null)
  let isSmallScreen = useMediaQuery(dark.breakpoints.down('sm'))
  const backgroundHeight = isSmallScreen ? '18rem' : '15rem'
  const SmallTitle = (props) => (<Typography variant='h5' sx={{
    color: grey, fontSize: '.8em', fontWeight: 'bold', mb: '.2em', textTransform: 'uppercase'
  }}>{props.children}</Typography>)
  const BigTitle = (props) => (<Typography variant='h3' sx={{
    color: darkGrey, fontSize: '1em', fontWeight: 'bold'
  }}>{props.children}</Typography>)

  async function getLocationInformation() {
    let info = await getIpLocation(ipAdress)
    console.log(info)
    setLocationInfo(info)
  }
  useEffect(() => {
    async function getInfo() { getLocationInformation() }
    getInfo()
  }, [])
  return (

    <ThemeProvider theme={dark}>
      <div style={{ minHeight: '100svh', backgroundColor: "wheat" }}>
        <Stack direction='column' alignItems='center' gap={2} padding={2}
          sx={{
            backgroundImage: { xs: `url(${bgImageMobile})`, sm: `url(${bgImageDesktop})` },
            backgroundSize: 'cover', color: 'white',
            minHeight: backgroundHeight,
          }}>
          <Typography variant='h4'>IP Address Tracker</Typography>
          <Box sx={{ width: { xs: '100%', sm: '80%' }, position: 'relative' }}>

            <TextField id="ip-adress" label="Search for any IP address or domain"
              fullWidth
              variant="outlined"
              value={ipAdress}
              onChange={event => setIpAdress(event.target.value)}
              sx={{
                '& .MuiInputBase-root ': {
                  background: 'white',
                  borderRadius: '1em', fontSize: '1.2em'
                }, '& .MuiFormLabel-root': {
                  color: 'rgba(0,0,0,.95)',
                  position: 'absolute', top: 0, bottom: 0, left: 0, right: 0
                },
              }}
            />
            <Button sx={{
              borderRadius: 0, borderTopRightRadius: '1em', borderBottomRightRadius: '1em',
              position: 'absolute', right: 0, top: 0, bottom: 0
            }}
              onClick={getLocationInformation}
              variant='contained' disableElevation color='black'><ArrowForwardIos /></Button>
          </Box>


        </Stack>
        <Box sx={{ height: `calc(100svh - ${backgroundHeight})`, width: '100%', position: 'relative' }}>
          <Stack direction='row' paddingInline={2} justifyContent='center' alignItems='center' sx={{
            position: 'absolute', top: 0, left: 0, right: 0, zIndex: 401,/*Position it on top of the map */
            transform: 'translateY(-50%)'
          }}>
            <Paper elevation={24} sx={{
              padding: { xs: '1em', sm: '2em' }, width: { xs: '100%', sm: '80%' }, borderRadius: '1em',

            }}>{isLoading ? <h1>Loading...</h1> :
              <Stack direction={{ sm: "row" }} justifyContent={{ sm: 'space-around' }} gap={{ xs: '1em', sm: 0 }}>
                <Stack alignItems='center' sx={informationsStyles} >
                  <SmallTitle variant='subtitle2'>IP Adress</SmallTitle>
                  <BigTitle variant='body1'>{locationInfo?.ip || "-"}</BigTitle>
                </Stack>
                <Stack alignItems='center' sx={informationsStyles}>
                  <SmallTitle variant='subtitle2'>Location</SmallTitle>
                  <BigTitle variant='body1'>
                    {locationInfo ? locationInfo.location.country +
                      (locationInfo.location.region && ", " + locationInfo.location.region) +
                      (locationInfo.location.city && ", " + locationInfo.location.city)
                      : "-"}
                  </BigTitle>
                </Stack>
                <Stack alignItems='center' sx={informationsStyles}>
                  <SmallTitle variant='subtitle2'>Timezone</SmallTitle>
                  <BigTitle variant='body1'>
                    UTC {locationInfo && locationInfo.location?.timezone != '+00:00' ? locationInfo.location.timezone : ''}
                  </BigTitle>
                </Stack>
                <Stack alignItems='center' sx={{ ...informationsStyles, borderRight: 'none' }}>
                  <SmallTitle variant='subtitle2'>ISP</SmallTitle>
                  <BigTitle variant='body1'>{locationInfo?.isp || "-"}</BigTitle>
                </Stack>
              </Stack>}
            </Paper>
          </Stack>

          {locationInfo && <MapContainer center={[locationInfo?.location.lat, locationInfo?.location.lng]} zoom={13} scrollWheelZoom={true}
            style={{
              height: `calc(100vh - ${backgroundHeight})`,/*height is required or map wont show*/
            }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[locationInfo?.location.lat, locationInfo?.location.lng]}>
              <Popup>
                The given IP adress is located here.
                If no IP is provided, yours is located by default.
              </Popup>
            </Marker>
          </MapContainer>}
        </Box >
      </div >
    </ThemeProvider >

  )
}

export default App
