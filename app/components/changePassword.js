import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material';
import axios from 'axios';

const ChangePasswordDialog = ({ open, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [user,setUser]=useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('authToken');
            setToken(storedToken || '');
            const storedUser = localStorage.getItem('user');

            if (storedUser) {
                const user = JSON.parse(storedUser);
                setUser(user)
                if (user.roleId !== 'admin' && !storedToken) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    window.location.href = '/auth';
                }
            }
        }
    }, []);
console.log(user);
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            setSnackbar({ open: true, message: 'All fields are required.', severity: 'error' });
            return;
        }

        if (newPassword.length < 6) {
            setSnackbar({ open: true, message: 'New password must be at least 6 characters.', severity: 'error' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setSnackbar({ open: true, message: 'Passwords do not match.', severity: 'error' });
            return;
        }

        setLoading(true);

        try {
            const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            if (!backendUrl) throw new Error('Backend URL not set');

            const response = await axios.post(
                `${backendUrl}/api/auth/change-password`,
                { currentPassword, newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSnackbar({ open: true, message: response.data.message, severity: 'success' });
            handleReset();
            onClose();
        } catch (error) {
            const errorMsg = error?.response?.data?.message || error.message || 'Something went wrong';
            setSnackbar({ open: true, message: errorMsg, severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleCloseDialog = () => {
        handleReset();
        onClose();
    };

    return (
        <>
            <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Current Password"
                        type="password"
                        fullWidth
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleChangePassword} disabled={loading}>
                        {loading ? <CircularProgress size={20} /> : 'Change Password'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ChangePasswordDialog;
