"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
        errorHttpStatusCode: 400,
    }));
    app.setGlobalPrefix('api/v1');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('☕ Coffee Delivery API')
        .setDescription(`## Coffee Delivery — To'liq API Dokumentatsiyasi

### 🔐 Autentifikatsiya
JWT Bearer token ishlatiladi. Login yoki Register qilib token oling, so'ng **"Authorize"** tugmasini bosing va \`Bearer <token>\` kiriting.

### 👥 Rol tizimi
| Rol | Imkoniyatlar |
|-----|-------------|
| **SUPERADMIN** | Hamma narsa: Admin tayinlash, qahva o'chirish, seed, statistika |
| **ADMIN** | Worker tayinlash, qahva qo'shish/yangilash, buyurtma ko'rish/yangilash |
| **WORKER** | Buyurtmalarni ko'rish, statusini yangilash, statistika |
| **CUSTOMER** | Qahvalar ko'rish, buyurtma berish, o'z buyurtmalarini ko'rish |

### 🚀 Boshlash uchun qadamlar
1. \`POST /auth/register\` — Ro'yxatdan o'ting **YOKI**
2. \`POST /auth/login\` — Superadmin bilan kiring
3. Olingan \`access_token\` ni ko'chiring
4. Yuqoridagi **"Authorize 🔓"** tugmasini bosing → \`Bearer <token>\` kiriting
5. API endpointlardan foydalaning!

### 🔑 Default Superadmin (avtomatik yaratiladi)
\`\`\`
Email:    superadmin@coffeedelivery.com
Password: SuperAdmin123!
\`\`\``)
        .setVersion('1.0')
        .setContact('Coffee Delivery Team', 'https://coffeedelivery.com', 'dev@coffeedelivery.com')
        .addServer('http://localhost:3000', 'Local Development')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Login yoki register qilib JWT token oling, so\'ng bu yerga kiriting',
        in: 'header',
    }, 'bearerAuth')
        .addTag('🔐 Auth & Users', 'Ro\'yxatdan o\'tish, kirish, foydalanuvchilarni boshqarish')
        .addTag('☕ Coffees', 'Qahvalar katalogi — ko\'rish, qo\'shish, yangilash, o\'chirish')
        .addTag('📦 Orders', 'Buyurtmalar — berish, ko\'rish, status yangilash, statistika')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: '☕ Coffee Delivery API Docs',
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
            docExpansion: 'list',
            filter: true,
            showRequestDuration: true,
        },
        customCss: `
      .swagger-ui .topbar { background: linear-gradient(135deg, #4B2995, #6B3AC5); }
      .swagger-ui .topbar .download-url-wrapper { display: none; }
      .swagger-ui .info h2 { color: #4B2995; }
      .swagger-ui .btn.authorize { background: #DBAC2C; border-color: #DBAC2C; color: #fff; }
      .swagger-ui .btn.authorize:hover { background: #C4861A; }
      .swagger-ui .opblock-tag { font-size: 16px; }
    `,
    });
    const dataSource = app.get(typeorm_1.DataSource);
    await seedSuperAdmin(dataSource);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log('\n╔══════════════════════════════════════════════╗');
    console.log('║     ☕  Coffee Delivery API — ISHGA TUSHDI   ║');
    console.log('╠══════════════════════════════════════════════╣');
    console.log(`║  📍 API Base:  http://localhost:${port}/api/v1     ║`);
    console.log(`║  📚 Swagger:   http://localhost:${port}/api/docs   ║`);
    console.log('╠══════════════════════════════════════════════╣');
    console.log('║  🔑 Superadmin:                              ║');
    console.log('║     superadmin@coffeedelivery.com            ║');
    console.log('║     SuperAdmin123!                           ║');
    console.log('╚══════════════════════════════════════════════╝\n');
}
async function seedSuperAdmin(dataSource) {
    try {
        const bcrypt = require('bcryptjs');
        const userRepo = dataSource.getRepository('users');
        const existing = await userRepo.findOne({
            where: { email: 'superadmin@coffeedelivery.com' },
        });
        if (!existing) {
            const hashedPassword = await bcrypt.hash('SuperAdmin123!', 10);
            await userRepo.save(userRepo.create({
                email: 'superadmin@coffeedelivery.com',
                fullName: 'Super Administrator',
                password: hashedPassword,
                role: 'superadmin',
                isActive: true,
                phone: '+998901234567',
            }));
            console.log('✅ Superadmin yaratildi: superadmin@coffeedelivery.com');
        }
        else {
            console.log('ℹ️  Superadmin allaqachon mavjud');
        }
    }
    catch (err) {
        console.error('❌ Superadmin seed xatosi:', err.message);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map