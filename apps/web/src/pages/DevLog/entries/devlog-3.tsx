import { DevLogEntry } from '../../../components/DevLogEntry';

export const DevLogEntry3 = () => {
  return (
    <DevLogEntry id={3} title="Yet Another Thing!" date="June 4, 2025" author="Andrew Steinheiser">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat.
      </p>
      <img src="/logo.svg" alt="Logo" className="w-1/4 mx-auto" />
      <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </p>
    </DevLogEntry>
  );
};
