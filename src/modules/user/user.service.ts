import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "@/modules/user/schema/user.schema";
import mongoose, { Model } from "mongoose";

import { v4 as uuidv4 } from "uuid";
import * as dayjs from "dayjs";
import { hashPassWord } from "@/utils/bcrypt";
import { MailerService } from "@nestjs-modules/mailer";
import { ActiveAccount } from "@/auth/dto/activeAccount.dto";
import { NewPasswordDto } from "@/auth/dto/NewPasswordDto.dto";
import aqp from "api-query-params";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private mailerServive: MailerService,
  ) {}

  sendCodeIdToEmail = async (result: any, IdCode: string) => {
    // send Email
    this.mailerServive.sendMail({
      to: result?.email,
      //from: 'noreply@nestjs.com',
      subject: "Email test send email with NestJS",
      text: "welcome", // plaintext body

      template: "./register",
      context: {
        name: result?.name ?? result?.email,
        activationCode: IdCode,
      },
    });
  };

  handleActiveAccount = async (user: any, dataClient: any) => {
    if (user.codeId === dataClient.codeId) {
      if (dayjs().isBefore(user.codeExpired)) {
        // Trường hợp: Quên mật khẩu (Forget Password)
        if (dataClient.password) {
          await this.UserModel.updateOne(
            {
              _id: dataClient.id,
              codeId: dataClient.codeId,
            },
            {
              codeId: "",
              isActive: true,
              password: dataClient.password,
              codeExpired: dayjs(),
            },
          );
          return {
            user: "active successful",
          };
        } else {
          // Trường hợp: Kích hoạt tài khoản (Active Account)
          await this.UserModel.updateOne(
            {
              _id: dataClient.id,
              codeId: dataClient.codeId,
            },
            {
              codeId: "",
              isActive: true,
              codeExpired: dayjs(),
            },
          );
          return {
            user: "active successful",
          };
        }
      } else {
        // Nếu code đã hết hạn
        throw new BadRequestException("CodeId đã hết hạn !!");
      }
    } else {
      // Nếu codeId không đúng
      throw new BadRequestException("CodeId không đúng !!");
    }
  };

  async registerUser(createUserDto: CreateUserDto) {
    const existingUser = await this.findOneByEmail(createUserDto.email);

    if (existingUser) {
      throw new BadRequestException("email đã tồn tại !!");
    }

    // Tạo một UUID để làm mã kích hoạt người dùng
    const IdCode = uuidv4();

    // Thiết lập thời gian hết hạn của mã kích hoạt là 5 phút
    const date = dayjs().add(5, "minute");

    const hasPassWord = await hashPassWord(createUserDto.password);

    try {
      await this.UserModel.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hasPassWord,
        address: createUserDto.address,
        phone: createUserDto.phone,
        codeId: IdCode,
        codeExpired: date,
      });

      // Đồng bộ hóa các chỉ mục của mô hình trong cơ sở dữ liệu
      await this.UserModel.syncIndexes();

      const result = await this.findOneByEmail(createUserDto.email);

      this.sendCodeIdToEmail(result, IdCode);

      return result;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${error.keyValue.email} đã tồn tại`);
      }
      throw new BadRequestException(error);
    }

    //return 'This action adds a new user';
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    // đếm tổng số lượng bản ghi vd có 10 bản ghi
    const totalItem = (await this.UserModel.find(filter)).length;

    // tính tổng số trang : ví dụ 1 trang có 2 bản ghi thì : 10/2 = 5 trang
    const totalPages = Math.ceil(totalItem / pageSize);

    // ví dự trang 1 thì sẽ bỏ qua 0 bản ghi, trang 2 thì sẽ bỏ qua : (2-1) * 10 =10, vậy là bỏ qua từ bản ghi 1 -> bản ghi 10
    const skip = (current - 1) * pageSize;

    const result = await this.UserModel.find(filter)
      .limit(pageSize)
      .skip(skip)
      .select("-password -createdAt -updatedAt") // loại bỏ trường password
      .sort(sort as any);

    return { result, totalPages };
  }

  async findOneByEmail(email: string) {
    return await this.UserModel.findOne({
      email,
    }).select("-password  -codeId -codeExpired -createdAt -updatedAt   ");
  }

  async findOne(_id: mongoose.Types.ObjectId) {
    try {
      return this.UserModel.findOne({
        _id,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  update(id: mongoose.Types.ObjectId, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} ${updateUserDto} user`;
  }

  async remove(_id: string) {
    const user = await this.UserModel.findById(_id).select(
      "-password  -codeId -codeExpired -createdAt -updatedAt  -isActive -isAdmin ",
    );
    if (!user) {
      throw new BadRequestException("not found user !!");
    }

    await this.UserModel.deleteOne({ _id });

    return {
      delete_successfull: user,
    };
  }

  async activeAccount(data: ActiveAccount) {
    const user = await this.UserModel.findOne({
      _id: data.id,
      codeId: data.codeId,
    });

    if (!user) {
      throw new UnauthorizedException("Not Found User !!");
    }

    try {
      if (user.codeId === data.codeId) {
        if (dayjs().isBefore(user.codeExpired)) {
          await this.UserModel.updateOne(
            {
              _id: data.id,
              codeId: data.codeId,
            },
            {
              codeId: "",
              isActive: true,
              codeExpired: dayjs(),
            },
          );
          return {
            user: "active successfull",
          };
        } else {
          throw new BadRequestException("CodeId đã hết hạn !!");

          //return {
          //  user: 'CodeId đã hết hạn !!',
          //};
        }
      } else {
        throw new BadRequestException("CodeId không đúng !!");
      }

      //await this.handleActiveAccount(user, data);
    } catch (error) {
      throw new BadRequestException(error);
    }
    //return user;
  }

  async ReSendCodeId(email: any) {
    const user = await this.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException("Not Found User !!");
    }
    // Tạo một UUID để làm mã kích hoạt người dùng
    const IdCode = uuidv4();

    // Thiết lập thời gian hết hạn của mã kích hoạt là 5 phút
    const date = dayjs().add(5, "minute");

    try {
      this.sendCodeIdToEmail(user, IdCode);

      await this.UserModel.updateOne(
        {
          email,
        },
        {
          codeId: IdCode,
          codeExpired: date,
        },
      );

      return {
        id: user._id,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async resetPassword(email: string) {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Not Found User !!");
    }

    // Tạo một UUID để làm mã kích hoạt người dùng
    const codeId = uuidv4();

    // Thiết lập thời gian hết hạn của mã kích hoạt là 5 phút
    const date = dayjs().add(5, "minute");

    try {
      this.sendCodeIdToEmail(user, codeId);

      await this.UserModel.updateOne(
        {
          email,
        },
        {
          codeId,
          codeExpired: date,
        },
      );
      return {
        user: {
          id: user._id,
        },
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async NewPassword(data: NewPasswordDto) {
    const user = await this.UserModel.findOne({
      _id: data.id,
    });

    if (!user) {
      throw new BadRequestException("Not Found User !!");
    }

    try {
      await this.handleActiveAccount(user, data);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new BadRequestException(
          "An error occurred while processing the request.",
        );
      }
    }
  }
}
