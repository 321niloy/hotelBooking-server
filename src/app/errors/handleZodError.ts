import { TErrorSources, TGenericErrorResponse } from '../interface/error';

type ZodIssue = {
  path: Array<string | number>;
  message: string;
};

type ZodError = {
  issues: ZodIssue[];
};

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};

export default handleZodError;
