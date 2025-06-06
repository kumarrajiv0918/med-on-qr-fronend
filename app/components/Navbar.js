'use client';

import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Box,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { useRouter } from 'next/navigation';
import ChangePasswordDialog from './changePassword';

const drawerWidth = 240;

export default function Navbar() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState('');
  const [token, setToken] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleChangePassword = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('authToken');

      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserName(user.name);
      }

      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <MedicalServicesIcon fontSize="medium" />
            <Typography variant="h6" noWrap>
              Med'On
            </Typography>
          </Box>

          {/* User Menu */}
          <div>
            <IconButton onClick={handleMenuClick} color="inherit">
              <AccountCircleIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem disabled>{userName}</MenuItem>
              <MenuItem onClick={handleChangePassword}>Change Password</MenuItem>
              <MenuItem onClick={handleLogout}><LogoutIcon />Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar >

      {/* Change Password Dialog */}
      < ChangePasswordDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)
        }
        token={token}
      />
    </>
  );
}
