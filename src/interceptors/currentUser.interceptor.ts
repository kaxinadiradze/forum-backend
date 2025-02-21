import {
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    try {
      const request = context.switchToHttp().getRequest();
      const authHeader = await request.headers['authorization'];
      if (
        request.route.path == '/auth/signin' ||
        request.route.path == '/auth/signup'
      ) {
        return next.handle();
      }
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const payload = await this.jwtService.verifyAsync(token);
        const userId = payload.userId;
        if (userId) {
          const user = await this.usersService.findById(userId);
          if (user) {
            request.currentUser = user;
            console.log(
              'CurrentUser: ' + JSON.stringify(request.currentUser, null, 2),
            );
          } else {
            console.log('User not found');
            throw new NotFoundException('User not found');
          }
        } else {
          console.log('No userId found in jwt');
        }
      } else {
        console.log(
          'Authorization header missing, or does not include Bearer Token',
        );
      }
    } catch (error) {
      console.log('Current user interceptor error', error);
      throw new Error(error);
    }
    return next.handle();
  }
}
