import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import StoreMallDirectoryIcon from '@mui/icons-material/StoreMallDirectory';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import PersonIcon from '@mui/icons-material/Person';
import Link from "next/link";

export default function MenuTienda() {
    const [value, setValue] = React.useState(0);

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ width: 500, }}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                >
                    <BottomNavigationAction 
                    label="Tiendas" 
                    icon={<StoreMallDirectoryIcon />} 
                    component={Link}
                    href="/tiendas" />
                    <BottomNavigationAction 
                    label="Productos" 
                    icon={<ShoppingBagIcon />} 
                    component={Link}
                    href="/productos" 
                    />
                    <BottomNavigationAction 
                    label="Carrito" 
                    icon={<LocalGroceryStoreIcon />}
                    component={Link}
                    href="/carrito"  
                    />
                    <BottomNavigationAction 
                    label="Area Privada" 
                    icon={<PersonIcon />}
                    component={Link}
                    href="/panel-cliente"  
                    />
                </BottomNavigation>
            </Box>
        </div>
    );
}
