import { SetMetadata } from '@nestjs/common';

//  decorator response message
export const Response_Key = 'response_message';
export const ResponseMessage = (mess: string) =>
  SetMetadata(Response_Key, mess);

//  decorator Is_Public

export const Is_Public_Key = 'IsPublic';
export const IsPublic = () => SetMetadata(Is_Public_Key, true);

// roles

export const Roles_Key = 'roles';
export enum Roles_Type {
  ADMIN = 'admin',
  USER = 'user',
}
export const Roles = (...roles: Roles_Type[]) => SetMetadata(Roles_Key, roles);
