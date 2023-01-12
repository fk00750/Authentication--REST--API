import { NextFunction, Request, Response } from "express";

type RouteParamsHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export default RouteParamsHandler;
