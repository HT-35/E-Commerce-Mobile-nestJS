import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "20012931 - Trần Quang Huy - Đồ Án Tốt Nghiệp";
  }
}
