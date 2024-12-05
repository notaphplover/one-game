import { models as apiModels } from '@cornie-js/api-models';
import { Box, Dialog, DialogContent, DialogTitle, Grid2 } from '@mui/material';

export interface ColorChoiceDialogParams {
  onClose?: () => void;
  onHandlePlayCardsChoiceColor: (
    event: React.FormEvent,
    color: apiModels.CardColorV1,
  ) => void;
  open: boolean;
}

export const ColorChoiceDialog = (
  params: ColorChoiceDialogParams,
): React.JSX.Element => {
  const onHandleChoiceColor = (
    event: React.FormEvent,
    color: apiModels.CardColorV1,
  ): void => {
    params.onHandlePlayCardsChoiceColor(event, color);
  };

  return (
    <>
      <Dialog
        open={params.open}
        onClose={params.onClose}
        aria-labelledby="alert-dialog-title"
        className="choice-color-dialog"
      >
        <DialogTitle id="alert-dialog-title" className="dialog-title">
          Choose color
        </DialogTitle>
        <DialogContent>
          <Box className="color-choice-dialog-content">
            <Grid2 container className="colors-grid">
              <Grid2
                className="color-choice green"
                data-testid="color-choice-green"
                id="color-choice-green"
                onClick={(event) => {
                  onHandleChoiceColor(event, 'green');
                }}
              ></Grid2>
              <Grid2
                className="color-choice blue"
                data-testid="color-choice-blue"
                onClick={(event) => {
                  onHandleChoiceColor(event, 'blue');
                }}
              ></Grid2>
              <Grid2
                className="color-choice red"
                data-testid="color-choice-red"
                onClick={(event) => {
                  onHandleChoiceColor(event, 'red');
                }}
              ></Grid2>
              <Grid2
                className="color-choice yellow"
                data-testid="color-choice-yellow"
                onClick={(event) => {
                  onHandleChoiceColor(event, 'yellow');
                }}
              ></Grid2>
            </Grid2>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
