import { DevLogEntry } from '../../../components/DevLogEntry';

export const DevLogEntry1 = () => {
  return (
    <DevLogEntry
      id={1}
      title="Dev Log Entry 1"
      date="2025-01-01"
      author="John Doe"
      content="This is the content of the first dev log entry."
    />
  );
};
