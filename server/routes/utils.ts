import type { Request, Response, NextFunction } from "express";

export function asyncHandler(
  fn: (req: Request | any, res: Response | any, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
