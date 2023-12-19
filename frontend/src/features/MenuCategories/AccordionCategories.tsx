import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CategoriesType } from '../../types';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

interface Props {
  categories: CategoriesType[];
  close: () => void;
}

const AccordionCategories: React.FC<Props> = ({ categories, close }) => {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  const navigate = useNavigate();
  const navigateAndClose = (item: string) => {
    navigate('products/' + item);
    close();
  };

  return (
    <>
      {categories.map((item, index) => {
        return (
          <Accordion
            expanded={expanded === 'panel' + index + 1}
            onChange={handleChange('panel' + index + 1)}
            key={item._id}
            sx={{
              background: 'transparent',
              ':hover': { background: 'rgba(255,172,172,0.53)' },
              color: 'rgb(255,255,255)',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={'panel' + index + 1 + 'bh-content'}
              id={'panel' + index + 1 + 'bh-header'}
            >
              <Typography>{item.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Button onClick={() => navigateAndClose(item._id)}>{item.name}</Button>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );
};

export default AccordionCategories;
