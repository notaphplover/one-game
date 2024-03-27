import { useState } from 'react';
import { GameOptions } from '../models/GameOptions';
import { CreateNewGameResult } from '../models/CreateNewGameResult';
import { CreateNewGameStatus } from '../models/CreateNewGameStatus';

export const useCreateNewGame = (): CreateNewGameResult => {
  const [gameName, setGameName] = useState<string>('');
  const [numberOfPlayers, setNumberOfPlayer] = useState<number>(2);
  const [status, setStatus] = useState(CreateNewGameStatus.initial);
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
    if (
      status !== CreateNewGameStatus.initial &&
      status !== CreateNewGameStatus.validationKO
    ) {
      throw new Error('Unexpected form state at setNewGame');
    }

    setGameName(event.target.value);
  };

  const setNewGameOptions = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    if (
      status !== CreateNewGameStatus.initial &&
      status !== CreateNewGameStatus.validationKO
    ) {
      throw new Error('Unexpected form state at setNewGameOptions');
    }

    setGameOptions({
      ...gameOptions,
      [event.target.name]: event.target.checked,
    });
  };

  const setNumberOfPlayers = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    if (
      status !== CreateNewGameStatus.initial &&
      status !== CreateNewGameStatus.validationKO
    ) {
      throw new Error('Unexpected form state at setNumberOfPlayers');
    }

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

  const notifyFormFieldsFilled = (): void => {
    //setFormStatus(RegisterStatus.pendingValidation);
    //setBackendError(null);
    console.log('estamos en el hook');
  };

  return {
    gameName,
    numberOfPlayers,
    gameOptions,
    status,
    setNewGame,
    setNewGameOptions,
    setNumberOfPlayers,
    notifyFormFieldsFilled,
  };
};
