import { PrismaClient } from "@prisma/client";

// ativando log do prisma no terminal, assim vamos acompanhando tudo que o prisma retorna
export const prisma = new PrismaClient({
    log: ["query"],
});
