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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1">
              Metadata Analyzer
            </Typography>
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
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default App
