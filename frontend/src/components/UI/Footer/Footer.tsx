import { AppBar, Box, Container, Divider, Grid, Link, Toolbar, Typography } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import { FooterStyle } from '../../../styles';
import React from 'react';

const Footer = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={FooterStyle}>
        <Toolbar sx={{ paddingY: '10px' }}>
          <Container maxWidth="xl">
            <Grid container justifyContent="space-between" alignItems="center" spacing={0.5}>
              <Grid container item direction="column" xs={12} md={3}>
                <Typography
                  variant="body1"
                  component="div"
                  style={{ margin: 'auto', display: 'flex', alignItems: 'center' }}
                >
                  +996 555 555555 <WhatsAppIcon style={{ marginLeft: '4px' }} />
                </Typography>
                <Typography
                  variant="body1"
                  component="div"
                  style={{ margin: 'auto', display: 'flex', alignItems: 'center' }}
                >
                  +996 777 77777
                  <CallIcon style={{ marginLeft: '4px' }} />
                </Typography>
                <Typography
                  variant="body1"
                  component="div"
                  style={{ margin: 'auto', display: 'flex', alignItems: 'center' }}
                >
                  +996 505 88888
                  <CallIcon style={{ marginLeft: '4px' }} />
                </Typography>
              </Grid>
              <Grid container item direction="column" xs={12} md={5}>
                <Typography
                  variant="body1"
                  component="div"
                  style={{ margin: 'auto', display: 'flex', alignItems: 'center' }}
                >
                  <EmailIcon style={{ marginRight: '4px' }} /> passage@gmail.com
                </Typography>
                <Typography
                  variant="body1"
                  component="div"
                  style={{ margin: 'auto', display: 'flex', alignItems: 'center' }}
                >
                  <Link
                    href="https://www.instagram.com/passage.kg/"
                    color="#FFF"
                    underline="none"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <InstagramIcon style={{ marginRight: '4px' }} /> Passage
                  </Link>
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 1 }} />
          </Container>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Footer;
