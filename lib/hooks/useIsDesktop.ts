import { useMedia } from 'react-use';
const useIsDesktop = (defaultState = true) => useMedia('(min-width: 980px)', defaultState);
export default useIsDesktop;
