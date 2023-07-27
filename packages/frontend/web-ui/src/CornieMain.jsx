import { CornieAppRouter } from './router';
import { CornieAppTheme } from './theme';

export const CornieMain = () => {
    return (
        <CornieAppTheme>
            <CornieAppRouter />
        </CornieAppTheme>
    )
};
