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
} from '@mui/material';
import { CornieLayout } from '../../common/layout/CornieLayout';
import {
  VideogameAssetOutlined,
  PlaylistAddCheckOutlined,
} from '@mui/icons-material';
import { useCreateNewGame } from '../hooks/useCreateNewGame';

export const CreateNewGame = (): React.JSX.Element => {
  const {
    gameName,
    gameOptions,
    numberOfPlayers,
    openOptions,
    setNewGame,
    setNewGameOptions,
    setNumberOfPlayers,
    setHandleOpenOptions,
    setHandleCloseOptions,
  } = useCreateNewGame();

  const onSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    console.log(gameName);
    console.log(numberOfPlayers);
    console.log(gameOptions);
  };

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
                  label="Name"
                  type="text"
                  fullWidth
                  name="name"
                  value={gameName}
                  onChange={setNewGame}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className="new-game-text-fieldset"
                  label="Players"
                  type="number"
                  fullWidth
                  name="players"
                  value={numberOfPlayers}
                  onChange={setNumberOfPlayers}
                />
              </Grid>
              <Grid item xs={12}>
                <Box className="new-game-options">
                  <Button onClick={setHandleOpenOptions}>Options</Button>
                  <Dialog
                    open={openOptions}
                    onClose={setHandleCloseOptions}
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
                            control={
                              <Checkbox
                                checked={gameOptions.chainDraw2Draw2Cards}
                                onChange={setNewGameOptions}
                                name="chainDraw2Draw2Cards"
                              />
                            }
                            label="Chain +2 with +2 cards."
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            value="chainDraw2Draw4Cards"
                            className="new-game-option-formcontrol"
                            control={
                              <Checkbox
                                checked={gameOptions.chainDraw2Draw4Cards}
                                onChange={setNewGameOptions}
                                name="chainDraw2Draw4Cards"
                              />
                            }
                            label="Chain +2 with +4 cards."
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            value="chainDraw4Draw4Cards"
                            className="new-game-option-formcontrol"
                            control={
                              <Checkbox
                                checked={gameOptions.chainDraw4Draw4Cards}
                                onChange={setNewGameOptions}
                                name="chainDraw4Draw4Cards"
                              />
                            }
                            label="Chain +4 with +4 cards."
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            value="chainDraw4Draw2Cards"
                            className="new-game-option-formcontrol"
                            control={
                              <Checkbox
                                checked={gameOptions.chainDraw4Draw2Cards}
                                onChange={setNewGameOptions}
                                name="chainDraw4Draw2Cards"
                              />
                            }
                            label="Chain +4 with +2 cards."
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            value="playCardMandatory"
                            className="new-game-option-formcontrol"
                            control={
                              <Checkbox
                                checked={gameOptions.playCardIsMandatory}
                                onChange={setNewGameOptions}
                                name="playCardIsMandatory"
                              />
                            }
                            label="Playing cards is mandatory."
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            value="playMultiplesSameCards"
                            className="new-game-option-formcontrol"
                            control={
                              <Checkbox
                                checked={gameOptions.playMultipleSameCards}
                                onChange={setNewGameOptions}
                                name="playMultipleSameCards"
                              />
                            }
                            label="Playing multiple same cards is allowed."
                            labelPlacement="end"
                          />
                          <FormControlLabel
                            value="playWildDraw4IfNoOtherAlternative"
                            className="new-game-option-formcontrol"
                            control={
                              <Checkbox
                                checked={
                                  gameOptions.playWildDraw4IfNoOtherAlternative
                                }
                                onChange={setNewGameOptions}
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
                        onClick={setHandleCloseOptions}
                        autoFocus
                      >
                        OK
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              </Grid>
            </Grid>
            <Grid container>
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
