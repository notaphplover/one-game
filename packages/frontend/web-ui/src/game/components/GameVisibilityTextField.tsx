import { MenuItem, TextField } from '@mui/material';

export interface GameVisibilityTextFieldParams {
  disabled: boolean;
  onChange?:
    | ((
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        checked: boolean,
      ) => void)
    | undefined;
}

enum GameVisibility {
  private = 'private',
  public = 'public',
}

const GAME_VISIBILITY_TO_GAME_VISIBILITY_LABEL_MAP: {
  [TKey in GameVisibility]: string;
} = {
  [GameVisibility.private]: 'Private',
  [GameVisibility.public]: 'Public',
};

export const GameVisibilityTextField = (
  params: GameVisibilityTextFieldParams,
): React.JSX.Element => {
  const onChange:
    | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined =
    params.onChange === undefined
      ? undefined
      : (
          event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ): void => {
          if (params.onChange !== undefined) {
            const stringValue = event.target.value;

            switch (stringValue) {
              case GameVisibility.private.toString():
                params.onChange(event, false);
                break;
              case GameVisibility.public.toString():
                params.onChange(event, true);
                break;
              default:
                break;
            }
          }
        };

  return (
    <TextField
      autoFocus
      className="new-game-text-fieldset"
      defaultValue={GameVisibility.private}
      disabled={params.disabled}
      fullWidth
      label="Visibility"
      name="visibility"
      onChange={onChange}
      select
    >
      {Object.values(GameVisibility).map((value: GameVisibility) => (
        <MenuItem key={value} value={value}>
          {GAME_VISIBILITY_TO_GAME_VISIBILITY_LABEL_MAP[value]}
        </MenuItem>
      ))}
    </TextField>
  );
};
