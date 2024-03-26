import { useState } from 'react';
import { GameOptions } from '../models/GameOptions';
import { CreateNewGameResult } from '../models/CreateNewGameResult';

export const useCreateNewGame = (): CreateNewGameResult => {
  const [gameName, setGameName] = useState<string>('');
  const [openOptions, setOpenOptions] = useState<boolean>(false);
  const [numberOfPlayers, setNumberOfPlayer] = useState<number>(2);
  const [gameOptions, setGameOptions] = useState<GameOptions>({
    chainDraw2Draw2Cards: false,
    chainDraw2Draw4Cards: false,
    chainDraw4Draw4Cards: false,
    chainDraw4Draw2Cards: false,
    playCardIsMandatory: false,
    playMultipleSameCards: false,
    playWildDraw4IfNoOtherAlternative: true,
  });

  const setNewGame = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setGameName(event.target.value);
  };

  const setNewGameOptions = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setGameOptions({
      ...gameOptions,
      [event.target.name]: event.target.checked,
    });
  };

  const setNumberOfPlayers = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const value: number = parseInt(event.target.value);
    let newValue: number;

    if (value < 2) {
      newValue = 2;
    } else {
      if (value >= 10) {
        newValue = 10;
      } else {
        newValue = value;
      }
    }

    setNumberOfPlayer(newValue);
  };

  const setHandleOpenOptions = (): void => {
    setOpenOptions(true);
  };

  const setHandleCloseOptions = (): void => {
    setOpenOptions(false);
  };

  return {
    gameName,
    numberOfPlayers,
    gameOptions,
    openOptions,
    setNewGame,
    setNewGameOptions,
    setNumberOfPlayers,
    setHandleOpenOptions,
    setHandleCloseOptions,
  };
};
