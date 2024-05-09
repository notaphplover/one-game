import {
  VideogameAssetOutlined,
  PlaylistAddCheckOutlined,
  HomeOutlined,
} from '@mui/icons-material';
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
import React, { useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { CheckingAuth } from '../../auth/components/CheckingAuth';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { useCreateNewGame } from '../hooks/useCreateNewGame';
import { CreateNewGameStatus } from '../models/CreateNewGameStatus';

export const CreateNewGame = (): React.JSX.Element => {
  const {
    formFields,
    status,
    notifyFormFieldsFilled,
    formValidation,
    backendError,
    setFormFieldName,
    setFormFieldPlayers,
    setFormFieldOptions,
  } = useCreateNewGame();

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const navigate: NavigateFunction = useNavigate();

  const setHandleOpenDialog = (): void => {
    setOpenDialog(true);
  };

  const setHandleCloseDialog = (): void => {
    setOpenDialog(false);
  };

  const onSubmit = (event: React.FormEvent): void => {
    event.preventDefault();

    notifyFormFieldsFilled();
  };

  const onGoHome = (event: React.FormEvent): void => {
    event.preventDefault();
    navigate('/', { replace: true });
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
                  className="new-game-text-fieldset form-name-new-game"
                  disabled={isTextFieldDisabled()}
                  label="Name"
                  type="text"
                  fullWidth
                  name="name"
                  value={formFields.name}
                  onChange={setFormFieldName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className="new-game-text-fieldset form-players-new-game"
                  disabled={isTextFieldDisabled()}
                  label="Players"
                  type="number"
                  fullWidth
                  name="players"
                  value={formFields.players}
                  onChange={setFormFieldPlayers}
                  error={formValidation.isRight === false}
                  helperText={formValidation.value?.numberOfPlayers}
                />
              </Grid>
              <Grid item xs={12}>
                <Box className="new-game-options">
                  <Button
                    className="button-new-game-options"
                    onClick={setHandleOpenDialog}
                  >
                    Options
                  </Button>
                  <Dialog
                    open={openDialog}
                    onClose={setHandleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    className="dialog-new-game-options"
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
                                className="new-game-option-control"
                                checked={
                                  formFields.options.chainDraw2Draw2Cards
                                }
                                onChange={setFormFieldOptions}
                                name="chainDraw2Draw2Cards"
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
                                className="new-game-option-control"
                                checked={
                                  formFields.options.chainDraw2Draw4Cards
                                }
                                onChange={setFormFieldOptions}
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
                                className="new-game-option-control"
                                checked={
                                  formFields.options.chainDraw4Draw4Cards
                                }
                                onChange={setFormFieldOptions}
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
                                className="new-game-option-control"
                                checked={
                                  formFields.options.chainDraw4Draw2Cards
                                }
                                onChange={setFormFieldOptions}
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
                                className="new-game-option-control"
                                checked={formFields.options.playCardIsMandatory}
                                onChange={setFormFieldOptions}
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
                                className="new-game-option-control"
                                checked={
                                  formFields.options.playMultipleSameCards
                                }
                                onChange={setFormFieldOptions}
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
                                className="new-game-option-control"
                                checked={
                                  formFields.options
                                    .playWildDraw4IfNoOtherAlternative
                                }
                                onChange={setFormFieldOptions}
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

            <Grid
              container
              display={status === CreateNewGameStatus.backendOK ? '' : 'none'}
            >
              <Grid item xs={12}>
                <Box className="new-game-form-button">
                  <Button
                    className="new-game-cornie-button"
                    fullWidth
                    type="button"
                    variant="contained"
                    startIcon={<HomeOutlined />}
                    onClick={onGoHome}
                  >
                    CORNIE HOME
                  </Button>
                </Box>
              </Grid>
            </Grid>

            <Grid
              container
              display={status === CreateNewGameStatus.backendOK ? 'none' : ''}
            >
              <Grid item xs={12}>
                <Box className="new-game-form-button">
                  <Button
                    fullWidth
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
