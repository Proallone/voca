import { ServiceImpl } from "@sap/cds";

export type ServiceOptions = {
  kind: string;
  impl: string | ServiceImpl;
};