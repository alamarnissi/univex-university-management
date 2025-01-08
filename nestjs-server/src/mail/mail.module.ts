import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('SMTP_USERNAME'),
            pass: config.get('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: `"Nice App" <${config.get('SMTP_USERNAME')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    })
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
