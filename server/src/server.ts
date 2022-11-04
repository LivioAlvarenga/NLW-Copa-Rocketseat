import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

import { poolRoutes } from "./routes/pool";
import { authRoutes } from "./routes/auth";
import { gameRoutes } from "./routes/game";
import { guessRoutes } from "./routes/guess";
import { userRoutes } from "./routes/user";

async function bootstrap() {
    const fastify = Fastify({
        logger: true, //Serve para o Fastify soltar os logs de tudo que vai acontecendo na Operação
    });

    // Habilitando o @fastify/cors. origen: true estamos deixando qualquer um acessar nossos dados, use isso somente
    //  em ambiente dev. Em prod é so adicionar os domínios, ex: origin: "livioalvarenga.com"
    await fastify.register(cors, {
        origin: true,
    });

    // em produção isso precisa ser uma variável de ambiente!!!
    await fastify.register(jwt, { secret: "nlwcopa" });

    await fastify.register(poolRoutes);
    await fastify.register(authRoutes);
    await fastify.register(gameRoutes);
    await fastify.register(guessRoutes);
    await fastify.register(userRoutes);

    // add host: "0.0.0.0" para funcionar no android
    await fastify.listen({ port: 3333, host: "0.0.0.0" });
}

bootstrap();
