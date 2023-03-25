import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import VideoCard from '../../components/CardForvideo';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'


export default function MediaControlCard() {
  const theme = useTheme();

  const items = [
    {
      id: 0,
      name: 'Cobol'
    },
    {
      id: 1,
      name: 'JavaScript'
    },
    {
      id: 2,
      name: 'Basic'
    },
    {
      id: 3,
      name: 'PHP'
    },
    {
      id: 4,
      name: 'Java'
    }
  ]

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    console.log(string, results)
  }

  const handleOnHover = (result) => {
    // the item hovered
    console.log(result)
  }

  const handleOnSelect = (item) => {
    // the item selected
    console.log(item)
  }

  const handleOnFocus = () => {
    console.log('Focused')
  }

  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: 'block', textAlign: 'left' }}>id: {item.id}</span>
        <span style={{ display: 'block', textAlign: 'left' }}>name: {item.name}</span>
      </>
    )
  }



  const videoURL = 'https://www.youtube.com/watch?v=7sDY4m8KNLc';
  const videoContent = 'Video Content';
  return (
    <>

<div style={{marginLeft:100}}>
        <div style={{ width: 400 }}>
          <ReactSearchAutocomplete
            items={items}
            onSearch={handleOnSearch}
            onHover={handleOnHover}
            onSelect={handleOnSelect}
            onFocus={handleOnFocus}
            autoFocus
            formatResult={formatResult}
          />
        </div>
      
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      <VideoCard videoURL={videoURL} videoContent={videoContent} />
      <VideoCard videoURL={videoURL} videoContent={videoContent} />
      <VideoCard videoURL={videoURL} videoContent={videoContent} />
      <VideoCard videoURL={videoURL} videoContent={videoContent} />

    </Box>

    </div>
    </>
  );
}
