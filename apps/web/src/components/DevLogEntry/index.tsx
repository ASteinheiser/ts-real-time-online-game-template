import { Calendar } from '../icons/Calendar';
import { Person } from '../icons/Person';

interface DevLogEntryProps {
  id: number;
  title: string;
  date: string;
  author: string;
  content: React.ReactNode;
}

export const DevLogEntry = ({ id, title, date, author, content }: DevLogEntryProps) => {
  return (
    <article className="rounded-xl border-4 border-gray-300">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-row items-center gap-4">
          <h1 className="text-8xl font-isometric">#{id}</h1>

          <div className="flex flex-col">
            <h2 className="text-3xl font-title pb-1">{title}</h2>

            <div className="flex flex-row items-center gap-2">
              <Calendar size={20} className="text-gray-500" />
              <p className="text-md text-gray-500 font-pixel pt-1">{date}</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Person size={20} className="text-gray-500" />
              <p className="text-md text-gray-500 font-pixel pt-1">{author}</p>
            </div>
          </div>
        </div>

        {content}
      </div>
    </article>
  );
};
