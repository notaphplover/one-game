import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  TextField,
  Typography,
  NativeSelect,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { CornieLayout } from '../../common/layout/CornieLayout';
import { VideogameAssetRounded } from '@mui/icons-material';

interface GameOptions {
  chainDraw2Draw2Cards: boolean;
  chainDraw2Draw4Cards: boolean;
  chainDraw4Draw4Cards: boolean;
  chainDraw4Draw2Cards: boolean;
  playCardIsMandatory: boolean;
  playMultipleSameCards: boolean;
  playWildDraw4IfNoOtherAlternative: boolean;
}

export const CreateNewGame = (): React.JSX.Element => {
  const [gameOptions, setGameOptions] = useState<GameOptions>({
    chainDraw2Draw2Cards: true,
    chainDraw2Draw4Cards: true,
    chainDraw4Draw4Cards: true,
    chainDraw4Draw2Cards: false,
    playCardIsMandatory: true,
    playMultipleSameCards: false,
    playWildDraw4IfNoOtherAlternative: true,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setGameOptions({
      ...gameOptions,
      [event.target.value]: event.target.checked,
    });
  };

  return (
    <CornieLayout id="create-new-game-page" withFooter withNavBar>
      <Box
        component="div"
        className="page-section-container new-game-container"
      >
        <Grid item xs={12}>
          <Box className="box-shadow new-game-form-grid">
            <Typography variant="h5" className="new-game-form-title">
              {'Create new game'}
            </Typography>

            <form>
              <Grid container>
                <Grid item xs={12}>
                  <TextField
                    className="new-game-text-fieldset"
                    autoFocus
                    label="Name of the game"
                    type="text"
                    placeholder="Name of the game"
                    fullWidth
                    name="name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Age</InputLabel>
                    <select id="demo-simple-select" value={1}>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </select>
                  </FormControl>
                </Grid>
                <Box className="new-game-form-grid">
                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Game Options</FormLabel>
                      <FormGroup aria-label="position">
                        <FormControlLabel
                          value="chainTwoToTwoCard"
                          className="new-game-text-fieldset"
                          control={
                            <Checkbox
                              checked={gameOptions.chainDraw2Draw2Cards}
                              onChange={handleChange}
                              name="chainDraw2Draw2cards"
                            />
                          }
                          label="Chain Draw Two with Draw Two cards."
                          labelPlacement="end"
                        />
                        <FormControlLabel
                          value="chainTwoToFourCard"
                          className="new-game-text-fieldset"
                          control={
                            <Checkbox
                              checked={gameOptions.chainDraw2Draw4Cards}
                              onChange={handleChange}
                              name="chainDraw2Draw4cards"
                            />
                          }
                          label="Chain Draw Two with Wild Draw Four cards."
                          labelPlacement="end"
                        />
                        <FormControlLabel
                          value="chainFourToFourCard"
                          className="new-game-text-fieldset"
                          control={
                            <Checkbox
                              checked={gameOptions.chainDraw4Draw4Cards}
                              onChange={handleChange}
                              name="chainDraw4Draw4cards"
                            />
                          }
                          label="Chain Wild Draw Four with Wild Draw Four cards."
                          labelPlacement="end"
                        />
                        <FormControlLabel
                          value="chainFourToTwoCard"
                          className="new-game-text-fieldset"
                          control={
                            <Checkbox
                              checked={gameOptions.chainDraw4Draw2Cards}
                              onChange={handleChange}
                              name="chainDraw4Draw2cards"
                            />
                          }
                          label="Chain Wild Draw Four with Draw Two cards."
                          labelPlacement="end"
                        />
                        <FormControlLabel
                          value="playCardMandatory"
                          className="new-game-text-fieldset"
                          control={
                            <Checkbox
                              checked={gameOptions.playCardIsMandatory}
                              onChange={handleChange}
                              name="playCardIsMandatory"
                            />
                          }
                          label="Playing card is mandatory."
                          labelPlacement="end"
                        />
                        <FormControlLabel
                          value="playMultiplesSameCards"
                          className="new-game-text-fieldset"
                          control={
                            <Checkbox
                              checked={gameOptions.playMultipleSameCards}
                              onChange={handleChange}
                              name="playMultipleSameCards"
                            />
                          }
                          label="Playing multiple same cards."
                          labelPlacement="end"
                        />
                        <FormControlLabel
                          value="playWildDraw4IfNoOtherAlternative"
                          className="new-game-text-fieldset"
                          control={
                            <Checkbox
                              checked={
                                gameOptions.playWildDraw4IfNoOtherAlternative
                              }
                              onChange={handleChange}
                              name="playWildDraw4IfNoOtherAlternative"
                            />
                          }
                          label="Playing Wild Draw Four if no other alternative."
                          labelPlacement="end"
                        />
                      </FormGroup>
                    </FormControl>
                  </Grid>
                </Box>
              </Grid>

              <Button
                type="button"
                className="new-game-form-button"
                variant="contained"
                startIcon={<VideogameAssetRounded />}
              >
                CREATE
              </Button>
            </form>
          </Box>
        </Grid>
      </Box>
    </CornieLayout>
  );
};
