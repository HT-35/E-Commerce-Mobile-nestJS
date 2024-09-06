import { IsNotEmpty } from "class-validator";

export class ActiveAccount {
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  codeId: string;
}
