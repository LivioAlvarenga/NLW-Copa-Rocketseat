import Fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import ShortUniqueId from "short-unique-id";

// ativando log do prisma no terminal, assim vamos acompanhando tudo que o prisma retorna
const prisma = new PrismaClient({
    log: ["query"],
});

async function bootstrap() {
    const fastify = Fastify({
        logger: true, //Serve para o Fastify soltar os logs de tudo que vai acontecendo na Operação
    });

    // Habilitando o @fastify/cors. origen: true estamos deixando qualquer um acessar nossos dados, use isso somente
    //  em ambiente dev. Em prod é so adicionar os domínios, ex: origin: "livioalvarenga.com"
    await fastify.register(cors, {
        origin: true,
    });

    //http://localhost:3333/pools/count (pools é bolão)
    //Fazendo uma rota, para contar número de bolões
    fastify.get("/pools/count", async () => {
        const count = await prisma.pool.count();

        return { count };
    });

    fastify.get("/users/count", async () => {
        const count = await prisma.user.count();

        return { count };
    });

    fastify.get("/guesses/count", async () => {
        const count = await prisma.guess.count();

        return { count };
    });

    fastify.post("/pools", async (request, reply) => {
        const createPoolBody = z.object({
            title: z.string(),
        });

        const { title } = createPoolBody.parse(request.body);

        const generate = new ShortUniqueId({ length: 6 });
        const code = String(generate()).toUpperCase();

        await prisma.pool.create({
            data: {
                title,
                code,
            },
        });

        return reply.status(201).send({ code });
    });

    // add host: "0.0.0.0" para funcionar no android
    await fastify.listen({ port: 3333 /* host: "0.0.0.0" */ });
}

bootstrap();
