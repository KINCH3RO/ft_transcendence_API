import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({
		transformOptions: { enableImplicitConversion: true },
		transform: true,
		whitelist: true
	}));
	app.enableCors();
	await app.listen(3001);
}
bootstrap();
