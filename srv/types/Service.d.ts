import { Service, ServiceImpl, CdsFunctions } from "@sap/cds";
import { Request } from "@sap/cds";
import { Response } from "express";

export type ServiceOptions = {
  kind: string;
  impl: string | ServiceImpl;
};

export type CDSService<T> = CdsFunctions<typeof T> & Service;


export type ExpressRequest = Request & { res: Response };
