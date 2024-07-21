// Sidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemText, Checkbox, FormControlLabel, IconButton, Box, Slider, TextField } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTag,setPriceRange } from '../../redux/productsSlice'; 

const drawerWidth = 340;

const Sidebar = () => {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const products = useSelector(state => state.products.products);
  const selectedTags = useSelector(state => state.products.selectedTags);
  const priceRange = useSelector(state => state.products.priceRange);

  const tags = Array.from(new Set(products.flatMap(product => product.tags)));
  const minPrice = Math.min(...products.map(product => product.price));
  const maxPrice = Math.max(...products.map(product => product.price));

  const handleToggle = (tag) => {
    dispatch(toggleTag(tag));
  };

  const handlePriceChange = (event, newValue) => {
    dispatch(setPriceRange(newValue));
  };

  const handleMinPriceInputChange = (event) => {
    const newMinPrice = Number(event.target.value);
    dispatch(setPriceRange([newMinPrice, priceRange[1]]));
  };

  const handleMaxPriceInputChange = (event) => {
    const newMaxPrice = Number(event.target.value);
    dispatch(setPriceRange([priceRange[0], newMaxPrice]));
  };

  return (
    <div>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 5, // Ensure it's above other elements
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            position: 'fixed',
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ width: drawerWidth, padding: 2 }}>
            <Box sx={{
                height:"10vh",
                display:"flex",
                alignItems:"center",
                justifyContent:"center"
            }}>
                Tags Filter
            </Box>
          <List>
            {tags.map((tag, index) => (
              <ListItem key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedTags.includes(tag)}
                      onChange={() => handleToggle(tag)}
                      name={tag}
                    />
                  }
                  label={tag}
                />
              </ListItem>
            ))}
            <ListItem>
              <Box sx={{ width: '100%', padding: 2 }}>
                <ListItemText primary="Price Range" />
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={minPrice}
                  max={maxPrice}
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Min Price"
                  type="number"
                  value={priceRange[0]}
                  onChange={handleMinPriceInputChange}
                  sx={{ mt: 2 }}
                  fullWidth
                />
                <TextField
                  label="Max Price"
                  type="number"
                  value={priceRange[1]}
                  onChange={handleMaxPriceInputChange}
                  sx={{ mt: 2 }}
                  fullWidth
                />
              </Box>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </div>
  );
};

export default Sidebar;
