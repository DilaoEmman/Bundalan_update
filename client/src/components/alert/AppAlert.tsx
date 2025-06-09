import { Box, Collapse, Alert, IconButton, AlertTitle } from '@mui/material';
import React, { useEffect } from 'react';
import { useStore } from '../../store/rootStore';
import CloseIcon from '@mui/icons-material/Close';
import { observer } from 'mobx-react-lite';

const AUTO_CLOSE_MS = 3000;

const AppAlert = () => {
  const { rootStore: { alertStore } } = useStore();
  const { isAletOpen, alertData, close } = alertStore;

  useEffect(() => {
    if (isAletOpen) {
      const timer = setTimeout(() => {
        close();
      }, AUTO_CLOSE_MS);
      return () => clearTimeout(timer);
    }
  }, [isAletOpen, close]);

  // Only render Alert if alertData is not null and isAletOpen is true
  return (
    <Box sx={{ width: '100%' }}>
      <Collapse in={isAletOpen && !!alertData}>
        {isAletOpen && alertData && (
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  close();
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ mb: 2 }}
            severity={alertData.status}
          >
            <AlertTitle>{alertData.status.toUpperCase()}</AlertTitle>
            {alertData.message}
          </Alert>
        )}
      </Collapse>
    </Box>
  )
}

export default observer(AppAlert);
