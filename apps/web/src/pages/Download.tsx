import { Button } from '@repo/ui';

export const Download = () => {
  return (
    <div className="h-screen mt-nav-footer flex flex-col items-center justify-center pt-40">
      <div className="flex flex-col gap-10 w-full max-w-xs mx-auto">
        <h1 className="text-5xl sm:text-7xl font-pixel text-primary text-center">Download</h1>

        <div className="flex flex-col gap-4">
          <Button>Windows</Button>
          <Button>Mac</Button>
          <Button>Linux</Button>
        </div>
      </div>
    </div>
  );
};
