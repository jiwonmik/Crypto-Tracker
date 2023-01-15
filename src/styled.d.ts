import 'styled-components';

declare module 'styled-components'{
    export interface DefaultTheme {
        // explain your shape(or properties) of theme
        textColor: string;
        bgColor: string;
        btnColor: string;
    }
}