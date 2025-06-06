import { Calendar, Person } from '@repo/ui/icons';

interface DevLogEntryProps {
  id: number;
  title: string;
  date: string;
  author: string;
  children: React.ReactNode;
}

export const DevLogEntry = ({ id, title, date, author, children }: DevLogEntryProps) => {
  return (
    <article className="rounded-3xl border-4 border-secondary">
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
          <h2 className="text-8xl text-primary font-isometric tracking-[-12px]">#{id}</h2>

          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-title pb-1">{title}</h1>

            <div className="flex flex-row items-center gap-2">
              <Calendar size={20} className="text-muted" />
              <p className="text-md text-muted font-label pt-1">{date}</p>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Person size={20} className="text-muted" />
              <p className="text-md text-muted font-label pt-1">{author}</p>
            </div>
          </div>
        </div>

        <div className="w-full h-[2px] bg-secondary" />

        {children}
      </div>
    </article>
  );
};
