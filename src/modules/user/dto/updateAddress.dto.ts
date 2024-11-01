import { addressDto } from "@/modules/user/dto/address.dto";
import { PartialType } from "@nestjs/mapped-types";

export class updateAddressDto extends PartialType(addressDto) {}
