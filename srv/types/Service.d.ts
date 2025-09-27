import { Service, ServiceImpl, CdsFunctions } from "@sap/cds";

export type ServiceOptions = {
  kind: string;
  impl: string | ServiceImpl;
};

export type CDSService<T> = CdsFunctions<typeof T> & Service;