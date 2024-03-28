import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Alert,
  AlertTitle,
} from '@mui/material';
import { CornieLayout } from '../../common/layout/CornieLayout';
import {
  VideogameAssetOutlined,
  PlaylistAddCheckOutlined,
} from '@mui/icons-material';
import { useCreateNewGame } from '../hooks/useCreateNewGame';
import { useDisplayDialog } from '../hooks/useDisplayDialog';
import { CreateNewGameStatus } from '../models/CreateNewGameStatus';
import { CheckingAuth } from '../../auth/components/CheckingAuth';
import { setFormFieldValue } from '../helpers/setFormFieldValue';
import { setFormFieldsParams } from '../models/CreateNewGameResult';
import { GameOptions } from '../models/GameOptions';

export const CreateNewGame = (): React.JSX.Element => {
  const {
    formFields,
    status,
    notifyFormFieldsFilled,
    formValidation,
    backendError,
    setFormField,
  } = useCreateNewGame();

  const { openDialog, setHandleOpenDialog, setHandleCloseDialog } =
    useDisplayDialog();

  const onSubmit = (event: React.FormEvent): void => {
    event.preventDefault();

    notifyFormFieldsFilled();
  };

  const onHandleNamePlayers = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const value: string | number = setFormFieldValue(
      event.target.name,
      event.target.value,
    );

    const paramsNamePlayers: setFormFieldsParams = {
      name: event.target.name,
      value: value,
    };

    setFormField(paramsNamePlayers);
  };

  const onHandleOptions = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const options: GameOptions = formFields.options;

    const optionsWithChanges: GameOptions = {
      ...options,
      [event.target.value]: event.target.checked,
    };

    const paramsOptions: setFormFieldsParams = {
      name: 'options',
      value: optionsWithChanges,
    };

    setFormField(paramsOptions);
  };

  const isTextFieldDisabled = (): boolean => {
    return (
      status === CreateNewGameStatus.backendOK ||
      status === CreateNewGameStatus.pendingBackend ||
      status === CreateNewGameStatus.pendingValidation
    );
  };

  if (
    status === CreateNewGameStatus.pendingValidation ||
    status === CreateNewGameStatus.pendingBackend
  ) {
    return <CheckingAuth />;
  }

  return (
    <CornieLayout id="create-new-game-page" withFooter withNavBar>
      <Box
        component="div"
        className="page-section-container new-game-container"
      >
        <Box className="box-shadow new-game-form-grid">
          <Typography variant="h5" className="new-game-form-title">
            {'New game'}
          </Typography>

          <form>
            <Grid container>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  className="new-game-text-fieldset"
                  disabled={isTextFieldDisabled()}
                  label="Name"
                  type="text"
                  fullWidth
                  name="name"
                  value={formFields.name}
                  onChange={onHandleNamePlayers}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className="new-game-text-fieldset"
                  disabled={isTextFieldDisabled()}
                  label="Players"
                  type="number"
                  fullWidth
                  name="players"
                  value={formFields.players}
                  onChange={onHandleNamePlayers}
                  error={formValidation.numberOfPlayers !== undefined}
                  helperText={formValidation.numberOfPlayers}
                />
              </Grid>
              <Grid item xs={12}>
                <Box className="new-game-options">
                  <Button onClick={setHandleOpenDialog}>Options</Button>
                  <Dialog
                    open={openDialog}
                    onClose={setHandleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {'Choose game options'}
                    </DialogTitle>
                    <DialogContent>
                      <FormControl component="fieldset">
                        <FormGroup aria-label="position">
                          <FormControlLabel
                            value="chainDraw2Draw2Cards"
                            className="new-game-option-formcontrol"
                            disabled={isTextFieldDisabled()}
                            control={
                              <Checkbox
                                checked={
                                  formFields.options.chainDraw2Draw2Cards
                                }
                                onChange={onHandleOptions}
                                name="options.chainDraw2Draw2Cards"
                              />
                            }
                            label="Chain +2 with +2 cards."
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            value="chainDraw2Draw4Cards"
                            className="new-game-option-formcontrol"
                            disabled={isTextFieldDisabled()}
                            control={
                              <Checkbox
                                checked={
                                  formFields.options.chainDraw2Draw4Cards
                                }
                                onChange={onHandleOptions}
                                name="chainDraw2Draw4Cards"
                              />
                            }
                            label="Chain +2 with +4 cards."
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            value="chainDraw4Draw4Cards"
                            className="new-game-option-formcontrol"
                            disabled={isTextFieldDisabled()}
                            control={
                              <Checkbox
                                checked={
                                  formFields.options.chainDraw4Draw4Cards
                                }
                                onChange={onHandleOptions}
                                name="chainDraw4Draw4Cards"
                              />
                            }
                            label="Chain +4 with +4 cards."
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            value="chainDraw4Draw2Cards"
                            className="new-game-option-formcontrol"
                            disabled={isTextFieldDisabled()}
                            control={
                              <Checkbox
                                checked={
                                  formFields.options.chainDraw4Draw2Cards
                                }
                                onChange={onHandleOptions}
                                name="chainDraw4Draw2Cards"
                              />
                            }
                            label="Chain +4 with +2 cards."
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            value="playCardIsMandatory"
                            className="new-game-option-formcontrol"
                            disabled={isTextFieldDisabled()}
                            control={
                              <Checkbox
                                checked={formFields.options.playCardIsMandatory}
                                onChange={onHandleOptions}
                                name="playCardIsMandatory"
                              />
                            }
                            label="Playing cards is mandatory."
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            value="playMultipleSameCards"
                            className="new-game-option-formcontrol"
                            disabled={isTextFieldDisabled()}
                            control={
                              <Checkbox
                                checked={
                                  formFields.options.playMultipleSameCards
                                }
                                onChange={onHandleOptions}
                                name="playMultipleSameCards"
                              />
                            }
                            label="Playing multiple same cards is allowed."
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            value="playWildDraw4IfNoOtherAlternative"
                            className="new-game-option-formcontrol"
                            disabled={isTextFieldDisabled()}
                            control={
                              <Checkbox
                                checked={
                                  formFields.options
                                    .playWildDraw4IfNoOtherAlternative
                                }
                                onChange={onHandleOptions}
                                name="playWildDraw4IfNoOtherAlternative"
                              />
                            }
                            label="Playing +4 is allowed only if there's no other alternative."
                            labelPlacement="end"
                          />
                        </FormGroup>
                      </FormControl>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        type="button"
                        className="new-game-form-button"
                        variant="contained"
                        startIcon={<PlaylistAddCheckOutlined />}
                        onClick={setHandleCloseDialog}
                        autoFocus
                      >
                        OK
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              </Grid>
            </Grid>

            <Grid container display={backendError !== null ? '' : 'none'}>
              <Grid item xs={12}>
                <Box className="form-new-game-error">
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {backendError}
                  </Alert>
                </Box>
              </Grid>
            </Grid>

            <Grid
              container
              display={status === CreateNewGameStatus.backendOK ? '' : 'none'}
            >
              <Grid item xs={12}>
                <Box className="form-new-game-success">
                  <Alert severity="success">
                    <AlertTitle>Success</AlertTitle>
                    {`New game created!`}
                  </Alert>
                </Box>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12}>
                <Box className="new-game-form-button">
                  <Button
                    fullWidth
                    disabled={isTextFieldDisabled()}
                    type="button"
                    variant="contained"
                    startIcon={<VideogameAssetOutlined />}
                    onClick={onSubmit}
                  >
                    CREATE
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </CornieLayout>
  );
};
