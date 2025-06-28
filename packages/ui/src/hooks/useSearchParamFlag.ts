import { useSearchParams } from 'react-router-dom';

type ValueSetter = (value: boolean) => void;
type UseSearchParamFlagResult = [value: boolean, setValue: ValueSetter];

export const useSearchParamFlag = (key: string): UseSearchParamFlagResult => {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(key) === 'true';

  const setValue: ValueSetter = (value) => {
    setSearchParams({ [key]: value ? 'true' : 'false' });
  };

  return [value, setValue];
};
