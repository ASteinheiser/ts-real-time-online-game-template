import { useSearchParams } from 'react-router-dom';

type ValueResult = string | null;
type ValueSetter = (value: string | boolean) => void;
type UseSearchParamStateResult = [value: ValueResult, setValue: ValueSetter];

export const useSearchParamState = (key: string): UseSearchParamStateResult => {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(key);

  const setValue: ValueSetter = (value) => {
    if (typeof value === 'boolean') {
      setSearchParams({ [key]: value ? 'true' : 'false' });
    } else {
      setSearchParams({ [key]: value });
    }
  };

  return [value, setValue];
};
