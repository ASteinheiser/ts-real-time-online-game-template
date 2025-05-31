interface DevLogEntryProps {
  id?: number;
  title?: string;
  date?: string;
  author?: string;
  content?: React.ReactNode;
}

export const DevLogEntry = ({ id, title, date, author, content }: DevLogEntryProps) => {
  return (
    <article className="rounded-xl border-3 border-gray-300">
      <div className="flex flex-col gap-4">
        {id}
        {title}
        {date}
        {author}
        {content}
      </div>
    </article>
  );
};
