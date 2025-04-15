import { useState } from 'react'
import { ThemeProvider, CssBaseline, Container, Box, Typography, Switch, FormControlLabel, useMediaQuery, Paper, Fade, Grow, Zoom } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import { lightTheme, darkTheme } from './theme'
import exifr from 'exifr'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [metadata, setMetadata] = useState<any>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const isMobile = useMediaQuery('(max-width:600px)')

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      try {
        const metadata = await exifr.parse(file)
        setMetadata(metadata)
      } catch (error) {
        console.error('Error extracting metadata:', error)
        setMetadata({ error: 'Failed to extract metadata from this image' })
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  })

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ 
          minHeight: '100vh',
          py: 4,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ 
            position: 'relative',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 6,
            gap: isMobile ? 2 : 0
          }}>
            <Fade in timeout={1000}>
              <Typography 
                variant={isMobile ? "h4" : "h3"}
                component="h1"
                sx={{ 
                  fontWeight: 'bold',
                  textAlign: 'center',
                  order: isMobile ? 1 : 0,
                  background: darkMode 
                    ? 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)'
                    : 'linear-gradient(45deg, #1976d2 30%, #dc004e 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                Metadata Analyzer
              </Typography>
            </Fade>
            <Box sx={{ 
              position: isMobile ? 'static' : 'absolute',
              right: isMobile ? 'auto' : 0,
              top: isMobile ? 'auto' : '50%',
              transform: isMobile ? 'none' : 'translateY(-50%)',
              order: isMobile ? 0 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                    color="primary"
                  />
                }
                label={darkMode ? "Dark" : "Light"}
              />
            </Box>
          </Box>

          <Grow in timeout={800}>
            <Paper
              {...getRootProps()}
              elevation={3}
              sx={{
                border: '2px dashed',
                borderColor: 'primary.main',
                borderRadius: 4,
                p: 6,
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                mb: 6,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <input {...getInputProps()} />
              <CloudUploadIcon 
                sx={{ 
                  fontSize: 48, 
                  color: 'primary.main',
                  mb: 2
                }} 
              />
              <Typography variant="h6" gutterBottom>
                {isDragActive
                  ? 'Drop the image here'
                  : 'Drag and drop an image here, or click to select'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supported formats: JPEG, PNG, GIF
              </Typography>
            </Paper>
          </Grow>

          {preview && (
            <Zoom in timeout={500}>
              <Paper
                elevation={3}
                sx={{ 
                  mb: 6,
                  p: 2,
                  borderRadius: 4,
                  overflow: 'hidden'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ px: 2 }}>
                  Image Preview:
                </Typography>
                <Box
                  component="img"
                  src={preview}
                  alt="Preview"
                  sx={{ 
                    width: '100%',
                    maxHeight: 400,
                    objectFit: 'contain',
                    borderRadius: 2
                  }}
                />
              </Paper>
            </Zoom>
          )}

          {metadata && (
            <Fade in timeout={800}>
              <Paper
                elevation={3}
                sx={{ 
                  p: 3,
                  borderRadius: 4,
                  overflow: 'hidden'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Metadata:
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    overflow: 'auto',
                    maxHeight: 400,
                    border: '1px solid',
                    borderColor: 'divider',
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'primary.main',
                      borderRadius: '4px',
                    },
                  }}
                >
                  {JSON.stringify(metadata, null, 2)}
                </Box>
              </Paper>
            </Fade>
          )}

          <Box sx={{ 
            mt: 'auto',
            pt: 4,
            textAlign: 'center'
          }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.75rem',
                opacity: 0.7
              }}
            >
              Powered by Dynamic.IO
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
