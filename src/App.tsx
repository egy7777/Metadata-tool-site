import { useState } from 'react'
import { ThemeProvider, CssBaseline, Container, Box, Typography, Switch, FormControlLabel } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import { lightTheme, darkTheme } from './theme'
import exifr from 'exifr'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [metadata, setMetadata] = useState<any>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      try {
        // Extract metadata using exifr
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
        <Box sx={{ my: 4 }}>
          <Box sx={{ 
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 4 
          }}>
            <Typography 
              variant="h3" 
              component="h1"
              sx={{ 
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Metadata Analyzer
            </Typography>
            <Box sx={{ 
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)'
            }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                }
                label="Dark Mode"
              />
            </Box>
          </Box>

          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: 'primary.main',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
              mb: 4
            }}
          >
            <input {...getInputProps()} />
            <Typography>
              {isDragActive
                ? 'Drop the image here'
                : 'Drag and drop an image here, or click to select'}
            </Typography>
          </Box>

          {preview && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Image Preview:
              </Typography>
              <Box
                component="img"
                src={preview}
                alt="Preview"
                sx={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }}
              />
            </Box>
          )}

          {metadata && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Metadata:
              </Typography>
              <Box
                component="pre"
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  overflow: 'auto',
                  maxHeight: 400
                }}
              >
                {JSON.stringify(metadata, null, 2)}
              </Box>
            </Box>
          )}

          <Box sx={{ 
            mt: 8,
            textAlign: 'center'
          }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.75rem'
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
