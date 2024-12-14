import { SetMetadata } from "@nestjs/common";

//  decorator response message
export const Response_Key = "response_message";
export const ResponseMessage = (mess: string) =>
  SetMetadata(Response_Key, mess);

//  decorator Is_Public

export const Is_Public_Key = "IsPublic";
export const IsPublic = () => SetMetadata(Is_Public_Key, true);

// role

export const Roles_Key = "role";
export enum Roles_Type {
  ADMIN = "admin",
  EMPLOYEE = "employee",
  USER = "user",
}
export const Roles = (...role: Roles_Type[]) => SetMetadata(Roles_Key, role);
