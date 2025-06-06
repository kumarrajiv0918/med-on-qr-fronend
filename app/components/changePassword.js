import React, { useState } from 'react';
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

const ChangePasswordDialog = ({ open, onClose, token }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            setSnackbar({ open: true, message: 'All fields are required', severity: 'error' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setSnackbar({ open: true, message: 'Passwords do not match', severity: 'error' });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to change password');
            }

            setSnackbar({ open: true, message: data.message, severity: 'success' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            onClose();
        } catch (err) {
            setSnackbar({ open: true, message: err.message, severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
                    <Button onClick={onClose} disabled={loading}>
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
