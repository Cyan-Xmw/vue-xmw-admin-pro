/*
 * @Author: 白雾茫茫丶<baiwumm.com>
 * @Date: 2024-07-11 10:01:43
 * @LastEditors: 白雾茫茫丶<baiwumm.com>
 * @LastEditTime: 2024-11-06 09:41:17
 * @Description: AuthController
 */
import { Body, Controller, Get, Post, Req, Res, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'; // swagger 接口文档
import { Request, Response } from 'express';
import svgCaptcha from 'svg-captcha';

import { ResponseDto } from '@/dto/response.dto';
import { LoggerInterceptor } from '@/interceptor/logger.interceptor';
import { getRealIp, responseMessage } from '@/utils';

import { AuthService } from './auth.service';
import { juejinParamsDto, LoginParamsDto } from './dto/params-auth.dto';
import {
  DynamicRoutesResponseDto,
  JuejinResponseDto,
  LocalesResponseDto,
  LoginResponseDto,
  UserInfoResponseDto,
  VerifyCodeResponseDto,
} from './dto/response-auth.dto';

@ApiTags('身份鉴权')
@Controller('auth')
@UseInterceptors(LoggerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  /**
   * @description: 用户登录
   */
  @Post('/login')
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiOperation({ summary: '用户登录' })
  login(@Body() body: LoginParamsDto, @Session() session: CommonType.SessionInfo, @Req() req: Request) {
    return this.authService.login(body, session, getRealIp(req));
  }

  /**
   * @description: 获取用户信息
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({
    name: 'Authorization',
    required: true,
    description: 'token令牌',
  })
  @ApiBearerAuth()
  @Get('/getUserInfo')
  @ApiOkResponse({ type: UserInfoResponseDto })
  @ApiOperation({ summary: '获取用户信息' })
  getUserInfo(@Session() session: CommonType.SessionInfo) {
    return this.authService.getUserInfo(session);
  }

  /**
   * @description: 用户注销登录
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({
    name: 'Authorization',
    required: true,
    description: 'token令牌',
  })
  @ApiBearerAuth()
  @Post('/logout')
  @ApiOkResponse({ type: ResponseDto })
  @ApiOperation({ summary: '注销登录' })
  async logout(@Session() session: CommonType.SessionInfo) {
    const response = await this.authService.logout(session);
    return response;
  }

  /**
   * @description: 获取图形验证码
   */
  @Get('captcha') //当请求该接口时，返回一张随机图片验证码
  @ApiOkResponse({ type: VerifyCodeResponseDto })
  @ApiOperation({ summary: '获取图形验证码' })
  async getCaptcha(@Session() session: CommonType.SessionInfo, @Res() res: Response) {
    const captcha = svgCaptcha.createMathExpr({
      //可配置返回的图片信息
      size: 4, // 验证码长度
      ignoreChars: '0oO1ilI', // 验证码字符中排除 0oO1ilI
      noise: 2, // 干扰线条的数量
      width: 132,
      height: 40,
      fontSize: 50,
      color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
      background: '#fff',
    });
    session.captchaCode = captcha.text; //使用session保存验证，用于登陆时验证
    res.type('image/svg+xml'); //指定返回的类型
    return res.send(responseMessage(captcha.data)); //给页面返回一张图片
  }

  /**
   * @description: 国际化层级数据
   */
  @Get('/getLocales')
  @ApiOkResponse({ type: LocalesResponseDto })
  @ApiOperation({ summary: '国际化层级数据' })
  async getLocales() {
    const response = await this.authService.getLocales();
    return response;
  }

  /**
   * @description: 获取掘金文章列表
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({
    name: 'Authorization',
    required: true,
    description: 'token令牌',
  })
  @ApiBearerAuth()
  @Post('/juejin')
  @ApiOkResponse({ type: JuejinResponseDto })
  @ApiOperation({ summary: '获取掘金文章列表' })
  async juejin(@Body() params: juejinParamsDto) {
    const response = await this.authService.juejin(params);
    return response;
  }

  /**
   * @description: 获取动态路由
   */
  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({
    name: 'Authorization',
    required: true,
    description: 'token令牌',
  })
  @ApiBearerAuth()
  @Get('/getDynamicRoutes')
  @ApiOkResponse({ type: DynamicRoutesResponseDto })
  @ApiOperation({ summary: '获取动态路由' })
  async getDynamicRoutes(@Session() session: CommonType.SessionInfo) {
    const response = await this.authService.getDynamicRoutes(session);
    return response;
  }
}
