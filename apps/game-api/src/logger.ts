type ExtraLogData = Record<string, unknown>;

interface LoggerArgs {
  message: string;
  data?: ExtraLogData;
}

/** simple console logger, should eventually be configured to send to a logging service */
export const logger = {
  info: (args: LoggerArgs) => {
    console.log(...formatLogData(args));
  },
  error: (args: LoggerArgs) => {
    console.error(...formatLogData(args));
  },
};

const formatLogData = ({ message, data }: LoggerArgs) => {
  const logData: Array<string | ExtraLogData> = [message];
  if (data) logData.push(data);
  return logData;
};
